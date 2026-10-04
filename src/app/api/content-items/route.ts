import { NextRequest, NextResponse } from "next/server";
import { getTenantDb, TenantAccessViolationError, prisma } from "@/lib/db";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { logAuditAction } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const requestedWorkspaceId = url.searchParams.get("workspaceId");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { success: false, error: "workspaceId parameter is required." },
        { status: 400 }
      );
    }

    // Server-side authentication and workspace membership verification
    const auth = await requireWorkspaceAccess(req, requestedWorkspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const { organizationId, workspaceId } = auth;
    const tenantDb = getTenantDb(organizationId, workspaceId);

    const items = await tenantDb.contentItem.findMany({
      include: {
        creator: true,
        assets: true,
        approvals: true,
        pipelineSteps: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const { getCostRollups } = await import("@/lib/content/pipeline");
    const costRollups = await getCostRollups(workspaceId);

    return NextResponse.json({ success: true, items, costRollups });
  } catch (error: any) {
    const status = error instanceof TenantAccessViolationError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, hookText, script, platform = "INSTAGRAM", creatorId, workspaceId: requestedWsId } = body;

    if (!requestedWsId || !topic) {
      return NextResponse.json(
        { success: false, error: "topic and workspaceId are required." },
        { status: 400 }
      );
    }

    // Verify session and membership
    const auth = await requireWorkspaceAccess(req, requestedWsId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const { user, organizationId, workspaceId, role } = auth;

    // Check RBAC permission for the authenticated user's role
    assertPermission(role, "CREATE_CONTENT");

    const tenantDb = getTenantDb(organizationId, workspaceId);

    const newItem = await tenantDb.contentItem.create({
      topic,
      hookText,
      script,
      platform,
      creatorId,
      workspaceId,
      status: "IDEA",
      estimatedCost: 0.15,
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CONTENT_ITEM_CREATED",
      targetEntity: "ContentItem",
      targetId: newItem.id,
      metadata: { topic, platform, creatorId, actorRole: role },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    const status =
      error instanceof UnauthorizedError
        ? 403
        : error instanceof TenantAccessViolationError
        ? 403
        : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, topic, hookText, script } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Content item id is required." },
        { status: 400 }
      );
    }

    // Fetch existing item from DB to determine its true tenant ownership
    const existing = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Content item with id '${id}' not found.` },
        { status: 404 }
      );
    }

    // Verify caller has membership in the existing item's workspace
    const auth = await requireWorkspaceAccess(req, existing.workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const { user, organizationId, workspaceId, role } = auth;

    // Enforce role-based permission checks based on requested action
    if (status === "APPROVED" || status === "QC_FAILED") {
      assertPermission(role, "APPROVE_CONTENT");
    } else if (status) {
      assertPermission(role, "CHANGE_STAGE");
    } else {
      assertPermission(role, "EDIT_CONTENT");
    }

    const tenantDb = getTenantDb(organizationId, workspaceId);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (topic) updateData.topic = topic;
    if (hookText !== undefined) updateData.hookText = hookText;
    if (script !== undefined) updateData.script = script;

    const updated = await tenantDb.contentItem.update(id, updateData);

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CONTENT_STAGE_TRANSITION",
      targetEntity: "ContentItem",
      targetId: id,
      metadata: { newStatus: status, actorRole: role },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    const status =
      error instanceof UnauthorizedError
        ? 403
        : error instanceof TenantAccessViolationError
        ? 403
        : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Content item id is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Content item with id '${id}' not found.` },
        { status: 404 }
      );
    }

    // Verify caller has membership in the item's workspace
    const auth = await requireWorkspaceAccess(req, existing.workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    const { user, organizationId, workspaceId, role } = auth;

    assertPermission(role, "DELETE_CONTENT");

    const tenantDb = getTenantDb(organizationId, workspaceId);
    await tenantDb.contentItem.delete(id);

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CONTENT_ITEM_DELETED",
      targetEntity: "ContentItem",
      targetId: id,
      metadata: { topic: existing.topic, actorRole: role },
    });

    return NextResponse.json({ success: true, message: "Item deleted successfully." });
  } catch (error: any) {
    const status =
      error instanceof UnauthorizedError
        ? 403
        : error instanceof TenantAccessViolationError
        ? 403
        : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
