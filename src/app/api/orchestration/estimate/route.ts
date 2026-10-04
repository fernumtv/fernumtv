export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { calculateJobEstimate, checkBudgetLimits } from "@/lib/orchestration/budget";
import { QualityTier } from "@/config/orchestration.config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, contentItemId, qualityTier = "DRAFT", usePaidProviders = false } = body;

    if (!workspaceId || !contentItemId) {
      return NextResponse.json(
        { error: "workspaceId and contentItemId are required." },
        { status: 400 }
      );
    }

    // Verify authentication and workspace membership
    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

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

    // Count scenes
    let scenesCount = 3;
    const storyboardStep = contentItem.pipelineSteps.find((s) => s.step === "storyboard");
    if (storyboardStep?.contentJson) {
      try {
        const parsed = JSON.parse(storyboardStep.contentJson);
        if (Array.isArray(parsed.scenes)) {
          scenesCount = parsed.scenes.length;
        }
      } catch {
        // Default
      }
    }

    const scriptWordCount = (contentItem.script || "").split(/\s+/).filter(Boolean).length || 60;

    const estimate = calculateJobEstimate({
      scenesCount,
      scriptWordCount,
      qualityTier: qualityTier as QualityTier,
      usePaidProviders: Boolean(usePaidProviders),
    });

    const budgetStatus = await checkBudgetLimits(workspaceId, estimate.totalEstimatedCostUsd);

    return NextResponse.json({
      estimate,
      budgetStatus,
      isScriptApproved: contentItem.status === "APPROVED",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
