export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { logAuditAction } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, step, variantIndex } = body;

    if (step !== "hook" && step !== "script") {
      return NextResponse.json({ success: false, error: "Variant selection only applies to 'hook' or 'script'." }, { status: 400 });
    }

    if (typeof variantIndex !== "number" || variantIndex < 0) {
      return NextResponse.json({ success: false, error: "variantIndex must be a non-negative number." }, { status: 400 });
    }

    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        pipelineSteps: {
          where: { step },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: "ContentItem not found." }, { status: 404 });
    }

    const checkWs = workspaceId || item.workspaceId;
    const auth = await requireWorkspaceAccess(req, checkWs);
    if ("errorResponse" in auth) return auth.errorResponse;

    if (item.workspaceId !== auth.workspaceId) {
      return NextResponse.json({ success: false, error: "Cross-tenant access forbidden." }, { status: 403 });
    }

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    const latestStep = item.pipelineSteps[0];
    if (!latestStep) {
      return NextResponse.json({ success: false, error: `No generated ${step} variants exist to select from.` }, { status: 400 });
    }

    let parsedVariants: any;
    try {
      parsedVariants = JSON.parse(latestStep.contentJson);
    } catch {
      parsedVariants = [];
    }

    if (!Array.isArray(parsedVariants) || !parsedVariants[variantIndex]) {
      return NextResponse.json(
        { success: false, error: `Variant index ${variantIndex} out of bounds.` },
        { status: 400 }
      );
    }

    // Update chosen variant in ContentPipelineStep
    await prisma.contentPipelineStep.update({
      where: { id: latestStep.id },
      data: { chosenVariant: variantIndex },
    });

    // Update ContentItem active text
    const updateData: any = {};
    if (step === "hook") {
      updateData.selectedHookIndex = variantIndex;
      updateData.hookText = parsedVariants[variantIndex].hook || parsedVariants[variantIndex];
    } else if (step === "script") {
      updateData.selectedScriptIndex = variantIndex;
      updateData.script = parsedVariants[variantIndex].script || parsedVariants[variantIndex];
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: updateData,
      include: { pipelineSteps: { orderBy: { version: "desc" } } },
    });

    await logAuditAction({
      organizationId,
      workspaceId: auth.workspaceId,
      userId: user.id,
      action: `PIPELINE_VARIANT_SELECTED_${step.toUpperCase()}`,
      targetEntity: "ContentItem",
      targetId: id,
      metadata: { step, variantIndex, actorRole: role },
    });

    return NextResponse.json({ success: true, item: updated, chosenVariant: variantIndex });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
