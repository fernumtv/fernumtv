import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { revertPipelineStepVersion, PipelineStepName } from "@/lib/content/pipeline";
import { logAuditAction } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");

    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        creator: true,
        assets: true,
        approvals: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        pipelineSteps: {
          orderBy: { version: "desc" },
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

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, revertStep, ...fields } = body;

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "ContentItem not found." }, { status: 404 });
    }

    const checkWs = workspaceId || existing.workspaceId;
    const auth = await requireWorkspaceAccess(req, checkWs);
    if ("errorResponse" in auth) return auth.errorResponse;

    if (existing.workspaceId !== auth.workspaceId) {
      return NextResponse.json({ success: false, error: "Cross-tenant access forbidden." }, { status: 403 });
    }

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    // Handle version revert if requested
    if (revertStep && revertStep.step && revertStep.version) {
      await revertPipelineStepVersion(
        id,
        revertStep.step as PipelineStepName,
        revertStep.version,
        user.id
      );

      const refreshed = await prisma.contentItem.findUnique({
        where: { id },
        include: { pipelineSteps: { orderBy: { version: "desc" } } },
      });
      return NextResponse.json({ success: true, item: refreshed, message: `Reverted step '${revertStep.step}' to v${revertStep.version}.` });
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: fields,
      include: {
        creator: true,
        pipelineSteps: { orderBy: { version: "desc" } },
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId: auth.workspaceId,
      userId: user.id,
      action: "CONTENT_ITEM_UPDATED",
      targetEntity: "ContentItem",
      targetId: id,
      metadata: { changedFields: Object.keys(fields), actorRole: role },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
