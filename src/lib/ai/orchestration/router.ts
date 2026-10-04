import { prisma } from "@/lib/db";
import { ORCHESTRATION_CONFIG, QualityTier } from "@/config/orchestration.config";
import { FalFluxAdapter } from "../providers/fal-flux";
import { ElevenLabsAdapter } from "../providers/elevenlabs";
import { mockVideoModel } from "../providers/mock-video";
import { MockImageAdapter, MockSpeechAdapter } from "../interfaces";
import { assembleStoryboardVideo } from "@/lib/media/ffmpeg-worker";
import { runQualityGate } from "@/lib/quality/quality-gate";

export interface PipelineExecutionOptions {
  jobId: string;
  forceFailStage?: string; // For testing retries and fallbacks
}

export class OrchestrationRouter {
  private mockImage = new MockImageAdapter();
  private mockSpeech = new MockSpeechAdapter();

  /**
   * Executes the chained media generation pipeline for a queued job
   */
  public async executeJob(jobId: string, options?: { forceFailStage?: string }): Promise<void> {
    const job = await prisma.jobQueueItem.findUnique({
      where: { id: jobId },
      include: {
        workspace: true,
        contentItem: {
          include: {
            creator: true,
            pipelineSteps: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error(`JobQueueItem not found: ${jobId}`);
    }

    if (job.status === "COMPLETED" || job.status === "CANCELLED") {
      return;
    }

    // Set job to PROCESSING
    await prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: "PROCESSING",
        startedAt: job.startedAt || new Date(),
        currentStage: "GENERATING_STILLS",
        progress: 10,
      },
    });

    try {
      const payload: any = job.payload ? JSON.parse(typeof job.payload === "string" ? job.payload : JSON.stringify(job.payload)) : {};
      const qualityTier = (job.qualityTier || "DRAFT") as QualityTier;
      const usePaidProviders = Boolean(payload.usePaidProviders && payload.confirmedPaidUse);

      // Parse storyboard scenes
      let scenes: Array<{ sceneNumber: number; visualPrompt: string; durationSec: number }> = [];
      const storyboardStep = job.contentItem.pipelineSteps.find((s) => s.step === "storyboard");
      if (storyboardStep?.contentJson) {
        try {
          const parsed = JSON.parse(storyboardStep.contentJson);
          if (Array.isArray(parsed.scenes)) {
            scenes = parsed.scenes.map((sc: any, idx: number) => ({
              sceneNumber: sc.sceneNumber || idx + 1,
              visualPrompt: sc.visualPrompt || "Cinematic 9:16 shot of creator",
              durationSec: 4,
            }));
          }
        } catch {
          // Default scenes if parse fails
        }
      }

      if (scenes.length === 0) {
        scenes = [
          { sceneNumber: 1, visualPrompt: "Creator hook shot looking at lens", durationSec: 4 },
          { sceneNumber: 2, visualPrompt: "Product mechanism demonstration", durationSec: 5 },
          { sceneNumber: 3, visualPrompt: "Clinical data proof callout overlay", durationSec: 4 },
        ];
      }

      const scriptText = job.contentItem.script || "Discover the future of high-performance digital content with Fernum.";

      // -------------------------------------------------------------
      // STAGE 1: Generate Storyboard Stills
      // -------------------------------------------------------------
      await this.updateProgress(jobId, "GENERATING_STILLS", 25);
      const generatedStills: Array<{ sceneNumber: number; imageUrl: string }> = [];

      // Extract creator locked reference images for identity consistency
      let faceRefUrls: string[] = [];
      if (job.contentItem.creator?.faceRefUrls) {
        try {
          const parsed = JSON.parse(job.contentItem.creator.faceRefUrls);
          if (Array.isArray(parsed)) {
            faceRefUrls = parsed;
          } else if (typeof parsed === "string") {
            faceRefUrls = [parsed];
          }
        } catch {
          faceRefUrls = job.contentItem.creator.faceRefUrls.split(",").map((u) => u.trim()).filter(Boolean);
        }
      }

      for (const scene of scenes) {
        let imageUrl = "";
        let usedProvider = "mock-image";

        // Test hook to trigger fallback or failure
        if (options?.forceFailStage === "IMAGE_PRIMARY") {
          throw new Error("Simulated primary image provider timeout");
        }

        if (usePaidProviders) {
          try {
            const fal = new FalFluxAdapter();
            const res = await fal.generateImage({
              prompt: scene.visualPrompt,
              aspectRatio: "9:16",
              faceRefUrls,
              identityToken: job.contentItem.creator?.identityToken || undefined,
              organizationId: job.organizationId,
              workspaceId: job.workspaceId,
            });
            imageUrl = res.data.imageUrl;
            usedProvider = res.telemetry.model;
          } catch (err: any) {
            // Fallback to mock adapter
            const primaryName = faceRefUrls.length > 0 ? "fal-ai/flux-pulid" : "fal-ai/flux/schnell";
            await this.logFallback(job.organizationId, job.workspaceId, primaryName, "mock-image", err.message);
            const res = await this.mockImage.generateImage({
              prompt: scene.visualPrompt,
              aspectRatio: "9:16",
              faceRefUrls,
              identityToken: job.contentItem.creator?.identityToken || undefined,
              organizationId: job.organizationId,
              workspaceId: job.workspaceId,
            });
            imageUrl = res.data.imageUrl;
          }
        } else {
          const res = await this.mockImage.generateImage({
            prompt: scene.visualPrompt,
            aspectRatio: "9:16",
            faceRefUrls,
            identityToken: job.contentItem.creator?.identityToken || undefined,
            organizationId: job.organizationId,
            workspaceId: job.workspaceId,
          });
          imageUrl = res.data.imageUrl;
        }

        generatedStills.push({ sceneNumber: scene.sceneNumber, imageUrl });
      }

      // -------------------------------------------------------------
      // STAGE 2: Synthesize Voiceover Speech
      // -------------------------------------------------------------
      await this.updateProgress(jobId, "GENERATING_VOICE", 50);
      let audioBuffer: Buffer | undefined;

      if (options?.forceFailStage === "VOICE_PRIMARY") {
        throw new Error("Simulated primary voice provider rate-limit error");
      }

      if (usePaidProviders) {
        try {
          const eleven = new ElevenLabsAdapter();
          const res = await eleven.synthesizeSpeech({
            text: scriptText,
            organizationId: job.organizationId,
            workspaceId: job.workspaceId,
          });
          if (res.data.audioUrl.startsWith("data:audio")) {
            const base64Data = res.data.audioUrl.split(",")[1];
            audioBuffer = Buffer.from(base64Data, "base64");
          }
        } catch (err: any) {
          await this.logFallback(job.organizationId, job.workspaceId, "elevenlabs-flash", "mock-speech", err.message);
          await this.mockSpeech.synthesizeSpeech({
            text: scriptText,
            organizationId: job.organizationId,
            workspaceId: job.workspaceId,
          });
        }
      } else {
        await this.mockSpeech.synthesizeSpeech({
          text: scriptText,
          organizationId: job.organizationId,
          workspaceId: job.workspaceId,
        });
      }

      // -------------------------------------------------------------
      // STAGE 3: Animatic / Motion Generation
      // -------------------------------------------------------------
      await this.updateProgress(jobId, "ANIMATING_VIDEO", 70);
      await mockVideoModel.generateAnimatic({
        scenes: scenes.map((s) => ({ sceneNumber: s.sceneNumber, durationSec: s.durationSec })),
        audioDurationSec: scenes.reduce((a, b) => a + b.durationSec, 0),
        organizationId: job.organizationId,
        workspaceId: job.workspaceId,
      });

      // -------------------------------------------------------------
      // STAGE 4: FFmpeg Assembly, Loudnorm & Caption Burning
      // -------------------------------------------------------------
      await this.updateProgress(jobId, "ASSEMBLING_FFMPEG", 85);

      const assembled = await assembleStoryboardVideo({
        organizationId: job.organizationId,
        workspaceId: job.workspaceId,
        contentItemId: job.contentItemId,
        jobId: job.id,
        scenes: scenes.map((s) => ({
          sceneNumber: s.sceneNumber,
          captionText: s.visualPrompt,
          durationSec: s.durationSec,
        })),
        audioBuffer,
        scriptText,
        creatorName: job.contentItem.creator?.name,
      });

      // -------------------------------------------------------------
      // STAGE 5: Attach Versioned Assets & Update Cost Rollups
      // -------------------------------------------------------------
      const actualCostUsd = Number(job.estimatedCostUsd || 0.05);

      // Create Asset records
      const videoAsset = await prisma.asset.create({
        data: {
          organizationId: job.organizationId,
          contentItemId: job.contentItemId,
          assetType: "VIDEO",
          url: assembled.videoSignedUrl,
          storageKey: assembled.videoKey,
          version: 1,
          provider: usePaidProviders ? "fal-elevenlabs" : "mock-pipeline",
          model: `ffmpeg-9x16-${qualityTier.toLowerCase()}`,
          costEstimate: actualCostUsd,
          metadata: JSON.stringify({
            durationSec: assembled.durationSec,
            aspectRatio: "9:16",
            resolution: "1080x1920",
            loudnorm: "I=-16:TP=-1.5:LRA=11",
          }),
        },
      });

      await prisma.asset.create({
        data: {
          organizationId: job.organizationId,
          contentItemId: job.contentItemId,
          assetType: "AUDIO",
          url: assembled.audioSignedUrl,
          storageKey: assembled.audioKey,
          version: 1,
          provider: usePaidProviders ? "elevenlabs" : "mock-speech",
          model: "normalized-narration",
          costEstimate: 0.005,
        },
      });

      await prisma.asset.create({
        data: {
          organizationId: job.organizationId,
          contentItemId: job.contentItemId,
          assetType: "THUMBNAIL",
          url: assembled.thumbnailSignedUrl,
          storageKey: assembled.thumbnailKey,
          version: 1,
          provider: "ffmpeg",
          model: "frame-capture-1s",
          costEstimate: 0.0,
        },
      });

      // Update workspace current spend rollup
      await prisma.workspace.update({
        where: { id: job.workspaceId },
        data: {
          currentSpend: {
            increment: actualCostUsd,
          },
        },
      });

      // Update ContentItem cost
      await prisma.contentItem.update({
        where: { id: job.contentItemId },
        data: {
          estimatedCost: {
            increment: actualCostUsd,
          },
        },
      });

      // STAGE 6: Quality Gate Evaluation
      let qualityReportSummary: any = null;
      try {
        qualityReportSummary = await runQualityGate(job.contentItemId, videoAsset.id);
      } catch (qErr) {
        console.warn("Quality gate warning:", qErr);
      }

      // Mark Job COMPLETED
      await prisma.jobQueueItem.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          progress: 100,
          currentStage: "COMPLETED",
          completedAt: new Date(),
          actualCostUsd,
          resultData: JSON.stringify({
            videoAssetId: videoAsset.id,
            videoSignedUrl: assembled.videoSignedUrl,
            audioSignedUrl: assembled.audioSignedUrl,
            thumbnailSignedUrl: assembled.thumbnailSignedUrl,
            durationSec: assembled.durationSec,
            qualityReportId: qualityReportSummary?.id || null,
            qualityStatus: qualityReportSummary?.status || null,
            qualityScore: qualityReportSummary?.overallScore || null,
          }),
        },
      });
    } catch (err: any) {
      const errorMessage = err?.message || "Pipeline execution failed";

      // Handle Retries
      if (job.retryCount < job.maxRetries) {
        const nextRetry = job.retryCount + 1;
        await prisma.jobQueueItem.update({
          where: { id: jobId },
          data: {
            status: "RETRYING",
            retryCount: nextRetry,
            failureReason: `Attempt ${job.retryCount + 1} failed: ${errorMessage}. Retrying...`,
          },
        });
      } else {
        // Retry limit reached -> Mark FAILED
        await prisma.jobQueueItem.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            failureReason: `Exceeded max retries (${job.maxRetries}): ${errorMessage}`,
          },
        });
      }
      throw err;
    }
  }

  private async updateProgress(jobId: string, stage: string, progress: number): Promise<void> {
    await prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        currentStage: stage,
        progress,
      },
    });
  }

  private async logFallback(
    orgId: string,
    workspaceId: string,
    primaryProvider: string,
    fallbackProvider: string,
    reason: string
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: orgId,
          workspaceId,
          action: "PROVIDER_FALLBACK_TRIGGERED",
          targetEntity: "ORCHESTRATION_ROUTER",
          targetId: primaryProvider,
          metadata: JSON.stringify({
            primaryProvider,
            fallbackProvider,
            reason,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    } catch {
      // Ignore audit log error in fallback handler
    }
  }
}

export const orchestrationRouter = new OrchestrationRouter();
