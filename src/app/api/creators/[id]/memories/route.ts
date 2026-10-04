import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { logAuditAction } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const memories = await prisma.creatorMemory.findMany({
      where: { creatorId: id, workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, memories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, category, fact, context } = body;

    if (!workspaceId || !category || !fact) {
      return NextResponse.json(
        { success: false, error: "workspaceId, category, and fact are required." },
        { status: 400 }
      );
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    const creator = await prisma.creator.findUnique({ where: { id } });
    if (!creator || creator.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Creator not found in workspace." }, { status: 404 });
    }

    const memory = await prisma.creatorMemory.create({
      data: {
        organizationId,
        workspaceId,
        creatorId: id,
        category,
        fact,
        context,
        version: creator.version,
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CREATOR_MEMORY_ADDED",
      targetEntity: "CreatorMemory",
      targetId: memory.id,
      metadata: { creatorName: creator.name, category, fact, actorRole: role },
    });

    return NextResponse.json({ success: true, memory }, { status: 201 });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
