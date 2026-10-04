import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { logAuditAction } from "@/lib/audit";
import { validateCreatorConsent, ConsentVerificationError } from "@/lib/creators/context";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const creators = await prisma.creator.findMany({
      where: { workspaceId },
      include: {
        consentRecord: true,
        memories: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, creators });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      name,
      type = "TALKING_HEAD",
      niche,
      personality,
      tone,
      vocabulary,
      interests,
      values,
      behaviorRules,
      contentPillars,
      preferredTopics,
      prohibitedTopics,
      voiceProvider = "mock",
      voiceModelId,
      voiceSpeed = 1.0,
      voicePitch = 1.0,
      faceRefUrls,
      wardrobeNotes,
      visualStyleGuide,
      avatarUrl,
      isSynthetic = true,
      consentRecordId,
    } = body;

    if (!workspaceId || !name || !niche) {
      return NextResponse.json(
        { success: false, error: "workspaceId, name, and niche are required fields." },
        { status: 400 }
      );
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    // Real-Person Safeguard Check at creation
    if (!isSynthetic) {
      if (!consentRecordId) {
        return NextResponse.json(
          {
            success: false,
            error: "Real-person likeness requires an uploaded and verified ConsentRecord ID.",
          },
          { status: 400 }
        );
      }

      const consentRecord = await prisma.consentRecord.findUnique({
        where: { id: consentRecordId },
      });

      if (!consentRecord || consentRecord.workspaceId !== workspaceId || consentRecord.status !== "VERIFIED") {
        return NextResponse.json(
          {
            success: false,
            error: "Referenced ConsentRecord is either not found or not in VERIFIED status.",
          },
          { status: 400 }
        );
      }
    }

    const creator = await prisma.creator.create({
      data: {
        organizationId,
        workspaceId,
        name,
        type,
        status: "DRAFT",
        version: 1,
        niche,
        personality,
        tone,
        vocabulary,
        interests,
        values,
        behaviorRules,
        contentPillars,
        preferredTopics,
        prohibitedTopics,
        voiceProvider,
        voiceModelId,
        voiceSpeed,
        voicePitch,
        faceRefUrls,
        wardrobeNotes,
        visualStyleGuide,
        avatarUrl: avatarUrl || (type === "TALKING_HEAD"
          ? "/synthetic-assets/creators/kora-vance-ref.svg"
          : "/synthetic-assets/creators/devon-miles-ref.svg"),
        isSynthetic,
        consentRecordId: !isSynthetic ? consentRecordId : null,
      },
      include: {
        consentRecord: true,
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CREATOR_CREATED",
      targetEntity: "Creator",
      targetId: creator.id,
      metadata: { name: creator.name, type: creator.type, isSynthetic: creator.isSynthetic, actorRole: role },
    });

    return NextResponse.json({ success: true, creator }, { status: 201 });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, workspaceId, bumpVersion, ...updates } = body;

    if (!id || !workspaceId) {
      return NextResponse.json({ success: false, error: "id and workspaceId are required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;

    // Fetch existing creator
    const existing = await prisma.creator.findUnique({
      where: { id },
      include: { consentRecord: true },
    });

    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Creator not found in workspace." }, { status: 404 });
    }

    // Role check: status transition to APPROVED or LOCKED requires APPROVE_CONTENT
    const isApprovalTransition =
      updates.status && (updates.status === "APPROVED" || updates.status === "LOCKED") && updates.status !== existing.status;

    if (isApprovalTransition) {
      assertPermission(role, "APPROVE_CONTENT");
    } else {
      assertPermission(role, "EDIT_CONTENT");
    }

    // Real-Person Safeguard: Cannot approve or lock a real-person creator without valid consent
    if (isApprovalTransition || updates.status === "APPROVED" || updates.status === "LOCKED") {
      try {
        await validateCreatorConsent(existing.id);
      } catch (err: any) {
        if (err instanceof ConsentVerificationError) {
          return NextResponse.json({ success: false, error: err.message }, { status: 400 });
        }
        throw err;
      }
    }

    // Identity Lock Immutability:
    // "Locking an identity makes it immutable except through a new version with an audit entry."
    if (existing.status === "LOCKED") {
      const isStatusOnlyChange = Object.keys(updates).length === 1 && updates.status;
      if (!isStatusOnlyChange && !bumpVersion) {
        return NextResponse.json(
          {
            success: false,
            error: "Creator identity is locked and immutable. Modifications require a new version (set bumpVersion: true).",
          },
          { status: 403 }
        );
      }
    }

    const newVersion = bumpVersion ? existing.version + 1 : existing.version;

    const updated = await prisma.creator.update({
      where: { id },
      data: {
        ...updates,
        version: newVersion,
      },
      include: {
        consentRecord: true,
        memories: true,
      },
    });

    // Audit log
    const action = bumpVersion
      ? "CREATOR_VERSION_BUMPED"
      : updates.status === "LOCKED"
      ? "CREATOR_IDENTITY_LOCKED"
      : isApprovalTransition
      ? "CREATOR_APPROVED"
      : "CREATOR_UPDATED";

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action,
      targetEntity: "Creator",
      targetId: updated.id,
      metadata: {
        name: updated.name,
        newVersion: updated.version,
        newStatus: updated.status,
        changedFields: Object.keys(updates),
        actorRole: role,
      },
    });

    return NextResponse.json({ success: true, creator: updated });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const workspaceId = url.searchParams.get("workspaceId");

    if (!id || !workspaceId) {
      return NextResponse.json({ success: false, error: "id and workspaceId are required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "DELETE_CONTENT");

    const creator = await prisma.creator.findUnique({ where: { id } });
    if (!creator || creator.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Creator not found in workspace." }, { status: 404 });
    }

    await prisma.creator.delete({ where: { id } });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CREATOR_DELETED",
      targetEntity: "Creator",
      targetId: id,
      metadata: { name: creator.name, actorRole: role },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
