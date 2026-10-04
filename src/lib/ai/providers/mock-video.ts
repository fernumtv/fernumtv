import { ModelResult, ProviderCallTelemetry } from "../interfaces";
import { prisma } from "@/lib/db";

export interface VideoGenOptions {
  scenes: Array<{
    sceneNumber: number;
    imageUrl?: string;
    durationSec: number;
    cameraMotion?: string;
  }>;
  audioDurationSec: number;
  organizationId: string;
  workspaceId: string;
}

export interface IVideoModel {
  generateAnimatic(options: VideoGenOptions): Promise<ModelResult<{ animaticUrl: string; durationSec: number }>>;
}

export class MockVideoAdapter implements IVideoModel {
  async generateAnimatic(options: VideoGenOptions): Promise<ModelResult<{ animaticUrl: string; durationSec: number }>> {
    const start = Date.now();
    const durationSec = options.audioDurationSec || 15;
    const latencyMs = 300 + Math.floor(Math.random() * 200);
    const costUsd = parseFloat((durationSec * 0.005).toFixed(4));

    const animaticUrl = `/mock-assets/animatic-preview.mp4`;

    await prisma.usageLedger.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        provider: "mock-video",
        model: "fernum-animatic-v1",
        modality: "video",
        unitsConsumed: durationSec,
        costUsd,
        latencyMs,
        status: "SUCCESS",
      },
    });

    return {
      data: { animaticUrl, durationSec },
      telemetry: {
        provider: "mock-video",
        model: "fernum-animatic-v1",
        latencyMs: Date.now() - start,
        unitsConsumed: durationSec,
        costUsd,
      },
    };
  }
}

export const mockVideoModel = new MockVideoAdapter();
