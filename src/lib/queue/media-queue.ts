import { prisma } from "@/lib/db";
import { orchestrationRouter } from "@/lib/ai/orchestration/router";
import { QualityTier } from "@/config/orchestration.config";

export interface EnqueueMediaJobOptions {
  organizationId: string;
  workspaceId: string;
  contentItemId: string;
  userId?: string;
  qualityTier?: QualityTier;
  estimatedCostUsd: number;
  usePaidProviders?: boolean;
  confirmedPaidUse?: boolean;
}

export interface IMediaQueue {
  enqueue(options: EnqueueMediaJobOptions): Promise<any>;
  getJob(jobId: string, workspaceId: string): Promise<any | null>;
  cancelJob(jobId: string, workspaceId: string): Promise<any>;
  retryJob(jobId: string, workspaceId: string): Promise<any>;
  listJobs(workspaceId: string, contentItemId?: string): Promise<any[]>;
}

export class MediaJobQueue implements IMediaQueue {
  private isRedisEnabled: boolean;

  constructor() {
    this.isRedisEnabled = Boolean(process.env.REDIS_URL && process.env.USE_BULLMQ === "true");
  }

  /**
   * Enqueues a new media generation job in the database and dispatches background worker
   */
  async enqueue(options: EnqueueMediaJobOptions): Promise<any> {
    const job = await prisma.jobQueueItem.create({
      data: {
        organizationId: options.organizationId,
        workspaceId: options.workspaceId,
        contentItemId: options.contentItemId,
        userId: options.userId,
        jobType: "FULL_MEDIA_PIPELINE",
        qualityTier: options.qualityTier || "DRAFT",
        status: "PENDING",
        progress: 0,
        currentStage: "QUEUED",
        estimatedCostUsd: options.estimatedCostUsd,
        maxRetries: 3,
        retryCount: 0,
        payload: JSON.stringify({
          usePaidProviders: Boolean(options.usePaidProviders),
          confirmedPaidUse: Boolean(options.confirmedPaidUse),
        }),
      },
    });

    // In local zero-dependency mode, trigger processing asynchronously in background
    setTimeout(async () => {
      try {
        await orchestrationRouter.executeJob(job.id);
      } catch (err: any) {
        // Job error is recorded inside router
      }
    }, 50);

    return job;
  }

  /**
   * Gets job by ID with strict workspace tenant verification
   */
  async getJob(jobId: string, workspaceId: string): Promise<any | null> {
    const job = await prisma.jobQueueItem.findUnique({
      where: { id: jobId },
      include: {
        contentItem: {
          select: {
            id: true,
            topic: true,
            status: true,
            assets: true,
          },
        },
      },
    });

    if (!job || job.workspaceId !== workspaceId) {
      return null;
    }

    return job;
  }

  /**
   * Cancels a pending or processing job
   */
  async cancelJob(jobId: string, workspaceId: string): Promise<any> {
    const job = await this.getJob(jobId, workspaceId);
    if (!job) {
      throw new Error("Job not found or access denied.");
    }

    if (job.status === "COMPLETED") {
      throw new Error("Cannot cancel an already completed job.");
    }

    return await prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: "CANCELLED",
        currentStage: "CANCELLED_BY_USER",
      },
    });
  }

  /**
   * Retries a failed or retrying job if within maxRetries limit
   */
  async retryJob(jobId: string, workspaceId: string): Promise<any> {
    const job = await this.getJob(jobId, workspaceId);
    if (!job) {
      throw new Error("Job not found or access denied.");
    }

    if (job.retryCount >= job.maxRetries) {
      throw new Error(`Job has reached the maximum retry cap (${job.maxRetries}).`);
    }

    const updatedJob = await prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: "PENDING",
        progress: 0,
        currentStage: "RETRY_QUEUED",
        failureReason: null,
      },
    });

    setTimeout(async () => {
      try {
        await orchestrationRouter.executeJob(jobId);
      } catch {
        // Error logged in router
      }
    }, 50);

    return updatedJob;
  }

  /**
   * Lists media jobs for a workspace with optional content item filter
   */
  async listJobs(workspaceId: string, contentItemId?: string): Promise<any[]> {
    return await prisma.jobQueueItem.findMany({
      where: {
        workspaceId,
        ...(contentItemId ? { contentItemId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}

export const mediaQueue = new MediaJobQueue();
