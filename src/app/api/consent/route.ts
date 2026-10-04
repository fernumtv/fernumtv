export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { logAuditAction } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const consentRecords = await prisma.consentRecord.findMany({
      where: { workspaceId },
      include: {
        creators: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, consentRecords });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Upload a new Consent Record with mandatory evidence file
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, personName, legalDocumentUrl, evidenceFileUrl, notes, expiresAt } = body;

    const finalEvidenceUrl = legalDocumentUrl || evidenceFileUrl;

    if (!workspaceId || !personName || !finalEvidenceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "workspaceId, personName, and an uploaded legal evidence file URL are required.",
        },
        { status: 400 }
      );
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    const record = await prisma.consentRecord.create({
      data: {
        organizationId,
        workspaceId,
        personName,
        legalDocumentUrl: finalEvidenceUrl,
        evidenceFileUrl: finalEvidenceUrl,
        uploadedByUserId: user.id,
        status: "PENDING", // Newly uploaded evidence requires separate verification
        notes,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CONSENT_RECORD_UPLOADED",
      targetEntity: "ConsentRecord",
      targetId: record.id,
      metadata: {
        personName,
        status: record.status,
        evidenceFileUrl: finalEvidenceUrl,
        uploaderId: user.id,
        actorRole: role,
      },
    });

    return NextResponse.json({ success: true, consentRecord: record }, { status: 201 });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

/**
 * Verification endpoint enforcing segregation of duties and OWNER/CREATIVE_DIRECTOR role
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, workspaceId, status = "VERIFIED", notes } = body;

    if (!id || !workspaceId) {
      return NextResponse.json({ success: false, error: "id and workspaceId are required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;

    // Rule: Verifier must have OWNER or CREATIVE_DIRECTOR role
    const isAuthorizedVerifier = role === "OWNER" || role === "CREATIVE_DIRECTOR" || role === "ADMIN";
    if (!isAuthorizedVerifier) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied: Only OWNER or CREATIVE_DIRECTOR can verify talent consent records.",
        },
        { status: 403 }
      );
    }

    const existing = await prisma.consentRecord.findUnique({
      where: { id },
    });

    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Consent record not found in workspace." }, { status: 404 });
    }

    // Rule: Segregation of duties - verifying user cannot be the same user who uploaded it
    if (existing.uploadedByUserId && existing.uploadedByUserId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Segregation-of-duties violation: A consent record cannot be verified by the same user who uploaded it.",
        },
        { status: 403 }
      );
    }

    const updated = await prisma.consentRecord.update({
      where: { id },
      data: {
        status,
        verifiedByUserId: user.id,
        verifiedAt: status === "VERIFIED" ? new Date() : null,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "CONSENT_RECORD_VERIFIED",
      targetEntity: "ConsentRecord",
      targetId: updated.id,
      metadata: {
        personName: updated.personName,
        newStatus: updated.status,
        uploaderId: existing.uploadedByUserId,
        verifierId: user.id,
        verifierRole: role,
      },
    });

    return NextResponse.json({ success: true, consentRecord: updated });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
