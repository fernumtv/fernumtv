import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { logAuditAction } from "@/lib/audit";
import { searchBrandBrainContext } from "@/lib/brand-brain/retrieval";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");
    const query = url.searchParams.get("query");

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    // Optional query-based contextual retrieval
    if (query) {
      const searchResult = await searchBrandBrainContext(workspaceId, query);
      return NextResponse.json({ success: true, searchResult });
    }

    const brandBrain = await prisma.brandBrain.findUnique({
      where: { workspaceId },
      include: {
        documents: true,
        versions: {
          orderBy: { version: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ success: true, brandBrain });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, ...fields } = body;

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    // Fetch existing BrandBrain
    const existing = await prisma.brandBrain.findUnique({
      where: { workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "BrandBrain not found for workspace." }, { status: 404 });
    }

    // 1. Create a version snapshot of current state
    await prisma.brandBrainVersion.create({
      data: {
        brandBrainId: existing.id,
        version: existing.version,
        snapshotJson: JSON.stringify(existing),
        editedByUserId: user.id,
      },
    });

    // 2. Update BrandBrain with new fields & bump version
    const updated = await prisma.brandBrain.update({
      where: { workspaceId },
      data: {
        ...fields,
        version: existing.version + 1,
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "BRAND_BRAIN_UPDATED",
      targetEntity: "BrandBrain",
      targetId: existing.id,
      metadata: { newVersion: updated.version, actorRole: role },
    });

    return NextResponse.json({ success: true, brandBrain: updated });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
