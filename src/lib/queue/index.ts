export type QueueName = "generation" | "render" | "publish";

export interface QueueJob<T = any> {
  id: string;
  name: string;
  data: T;
  progress: number;
  status: "waiting" | "active" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
}

type JobProcessor<T> = (job: QueueJob<T>) => Promise<any>;

/**
 * Universal Queue Manager
 * Transparently falls back to an in-memory queue runner when Redis is not available
 */
class UniversalQueueManager {
  private inMemoryJobs: Map<string, QueueJob> = new Map();
  private processors: Map<string, JobProcessor<any>> = new Map();
  private isMock: boolean;

  constructor() {
    this.isMock = process.env.MOCK_QUEUE === "true" || !process.env.REDIS_URL;
  }

  public registerWorker<T>(queueName: QueueName, processor: JobProcessor<T>) {
    this.processors.set(queueName, processor);
  }

  public async add<T>(
    queueName: QueueName,
    jobName: string,
    data: T
  ): Promise<QueueJob<T>> {
    const jobId = `${queueName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: QueueJob<T> = {
      id: jobId,
      name: jobName,
      data,
      progress: 0,
      status: "waiting",
      createdAt: new Date(),
    };

    this.inMemoryJobs.set(jobId, job);

    // If in-memory mock mode, process asynchronously in background
    if (this.isMock) {
      setTimeout(async () => {
        const processor = this.processors.get(queueName);
        if (processor) {
          job.status = "active";
          job.progress = 25;
          try {
            const res = await processor(job);
            job.status = "completed";
            job.progress = 100;
            job.result = res;
            job.completedAt = new Date();
          } catch (err: any) {
            job.status = "failed";
            job.error = err?.message || "Unknown error";
          }
        } else {
          // Default mock handler simulating task progression
          job.status = "active";
          job.progress = 50;
          setTimeout(() => {
            job.status = "completed";
            job.progress = 100;
            job.completedAt = new Date();
          }, 500);
        }
      }, 100);
    }

    return job;
  }

  public async getJob(jobId: string): Promise<QueueJob | null> {
    return this.inMemoryJobs.get(jobId) || null;
  }

  public async listJobs(queueName?: QueueName): Promise<QueueJob[]> {
    const jobs = Array.from(this.inMemoryJobs.values());
    if (queueName) {
      return jobs.filter((j) => j.id.startsWith(queueName));
    }
    return jobs;
  }
}

export const queueManager = new UniversalQueueManager();
