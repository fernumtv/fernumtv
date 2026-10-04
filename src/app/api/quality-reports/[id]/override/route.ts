import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { logAuditAction } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, reason } = body;

    const report = await prisma.qualityReport.findUnique({
      where: { id },
      include: { workspace: true },
    });

    if (!report) {
      return NextResponse.json({ success: false, error: "QualityReport not found" }, { status: 404 });
    }

    const checkWs = workspaceId || report.workspaceId;
    const auth = await requireWorkspaceAccess(req, checkWs);
    if ("errorResponse" in auth) return auth.errorResponse;

    if (report.workspaceId !== auth.workspaceId) {
      return NextResponse.json({ success: false, error: "Cross-tenant access forbidden" }, { status: 403 });
    }

    const { user, organizationId, role } = auth;

    // RBAC: Only OWNER or CREATIVE_DIRECTOR can override quality gate failures
    if (role !== "OWNER" && role !== "CREATIVE_DIRECTOR") {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied: Only OWNER or CREATIVE_DIRECTOR can override Quality Gate failures.",
        },
        { status: 403 }
      );
    }

    // Require written reason
    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid written override reason (minimum 5 characters) is required.",
        },
        { status: 400 }
      );
    }

    const previousStatus = report.status;

    // Update QualityReport to OVERRIDDEN
    const updated = await prisma.qualityReport.update({
      where: { id },
      data: {
        status: "OVERRIDDEN",
        isOverridden: true,
        overriddenByUserId: user.id,
        overrideReason: reason.trim(),
        overriddenAt: new Date(),
      },
    });

    // Log in AuditLog
    await logAuditAction({
      organizationId,
      workspaceId: auth.workspaceId,
      userId: user.id,
      action: "QUALITY_REPORT_OVERRIDDEN",
      targetEntity: "QualityReport",
      targetId: id,
      metadata: {
        previousStatus,
        newStatus: "OVERRIDDEN",
        overallScore: report.overallScore,
        actorRole: role,
        overrideReason: reason.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      report: {
        ...updated,
        checks: JSON.parse(updated.checksJson || "[]"),
      },
      message: "Quality Gate failure overridden successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
