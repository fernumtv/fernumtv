export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { executePipelineStepGeneration, PipelineStepName } from "@/lib/content/pipeline";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, step, userInstruction } = body;

    const validSteps: PipelineStepName[] = ["idea", "hook", "script", "storyboard", "caption", "thumbnail"];
    if (!step || !validSteps.includes(step)) {
      return NextResponse.json(
        { success: false, error: `Invalid step. Must be one of: ${validSteps.join(", ")}` },
        { status: 400 }
      );
    }

    const item = await prisma.contentItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: "ContentItem not found." }, { status: 404 });
    }

    const checkWs = workspaceId || item.workspaceId;
    const auth = await requireWorkspaceAccess(req, checkWs);
    if ("errorResponse" in auth) return auth.errorResponse;

    if (item.workspaceId !== auth.workspaceId) {
      return NextResponse.json({ success: false, error: "Cross-tenant access forbidden." }, { status: 403 });
    }

    const { user, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    const result = await executePipelineStepGeneration(
      id,
      step as PipelineStepName,
      user.id,
      userInstruction
    );

    const updatedItem = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        creator: true,
        pipelineSteps: { orderBy: { version: "desc" } },
      },
    });

    return NextResponse.json({
      success: true,
      stepResult: result,
      item: updatedItem,
    });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
