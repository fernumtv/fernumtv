import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { mediaQueue } from "@/lib/queue/media-queue";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await prisma.jobQueueItem.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(req, job.workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    if (auth.role === "VIEWER") {
      return NextResponse.json(
        { error: "Forbidden: Viewer role cannot retry jobs." },
        { status: 403 }
      );
    }

    // RETRY CAP ENFORCEMENT
    if (job.retryCount >= job.maxRetries) {
      return NextResponse.json(
        {
          error: `Retry cap exceeded: This job has already reached the maximum limit of ${job.maxRetries} retries.`,
        },
        { status: 400 }
      );
    }

    const updatedJob = await mediaQueue.retryJob(id, job.workspaceId);
    return NextResponse.json({ message: "Job retry scheduled.", job: updatedJob });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 400 });
  }
}
