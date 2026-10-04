import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await prisma.jobQueueItem.findUnique({
      where: { id },
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

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Tenant check: User must have access to job's workspace
    const auth = await requireWorkspaceAccess(req, job.workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
