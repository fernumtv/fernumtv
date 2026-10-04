export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { mediaQueue } from "@/lib/queue/media-queue";
import { calculateJobEstimate, checkBudgetLimits } from "@/lib/orchestration/budget";
import { QualityTier } from "@/config/orchestration.config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const contentItemId = searchParams.get("contentItemId") || undefined;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const jobs = await mediaQueue.listJobs(workspaceId, contentItemId);
    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      contentItemId,
      qualityTier = "DRAFT",
      usePaidProviders = false,
      confirmedPaidUse = false,
    } = body;

    if (!workspaceId || !contentItemId) {
      return NextResponse.json(
        { error: "workspaceId and contentItemId are required." },
        { status: 400 }
      );
    }

    // Verify session and workspace membership
    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const { user, role, organizationId } = auth;

    // RBAC: VIEWER cannot trigger generation
    if (role === "VIEWER") {
      return NextResponse.json(
        { error: "Forbidden: Viewer role cannot initiate media generation jobs." },
        { status: 403 }
      );
    }

    // Verify ContentItem exists in this workspace
    const contentItem = await prisma.contentItem.findUnique({
      where: { id: contentItemId },
      include: {
        pipelineSteps: true,
      },
    });

    if (!contentItem || contentItem.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: "Content item not found in this workspace." },
        { status: 404 }
      );
    }

    // 1. CONTENT SCRIPT STATE GATE: Only APPROVED scripts can enter media generation
    if (contentItem.status !== "APPROVED") {
      return NextResponse.json(
        {
          error: `Content item is currently in '${contentItem.status}' state. Only content items in APPROVED script state can enter media generation.`,
        },
        { status: 400 }
      );
    }

    // 2. EXPLICIT PAID CONFIRMATION GATE
    if (usePaidProviders && !confirmedPaidUse) {
      return NextResponse.json(
        {
          error: "Paid provider execution requires explicit user confirmation. Please review the estimated cost and confirm before launching.",
        },
        { status: 400 }
      );
    }

    // Calculate cost quote
    let scenesCount = 3;
    const storyboardStep = contentItem.pipelineSteps.find((s) => s.step === "storyboard");
    if (storyboardStep?.contentJson) {
      try {
        const parsed = JSON.parse(storyboardStep.contentJson);
        if (Array.isArray(parsed.scenes)) {
          scenesCount = parsed.scenes.length;
        }
      } catch {
        // Fallback
      }
    }

    const scriptWordCount = (contentItem.script || "").split(/\s+/).filter(Boolean).length || 60;
    const estimate = calculateJobEstimate({
      scenesCount,
      scriptWordCount,
      qualityTier: qualityTier as QualityTier,
      usePaidProviders,
    });

    // 3. BUDGET & COST CAP ENFORCEMENT
    const budgetStatus = await checkBudgetLimits(workspaceId, estimate.totalEstimatedCostUsd);
    if (!budgetStatus.allowed) {
      return NextResponse.json(
        {
          error: budgetStatus.reason,
          budgetStatus,
        },
        { status: 400 }
      );
    }

    // Enqueue Media Job
    const job = await mediaQueue.enqueue({
      organizationId,
      workspaceId,
      contentItemId,
      userId: user.id,
      qualityTier: qualityTier as QualityTier,
      estimatedCostUsd: estimate.totalEstimatedCostUsd,
      usePaidProviders,
      confirmedPaidUse,
    });

    return NextResponse.json(
      {
        message: "Media generation job successfully enqueued.",
        job,
        estimate,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
