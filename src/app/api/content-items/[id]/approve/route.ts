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
    const { workspaceId, decision = "APPROVED", comments } = body;

    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: { approvals: true },
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

    // Rule: Only CLIENT_APPROVER, CREATIVE_DIRECTOR, or OWNER can approve
    const canApprove = role === "CLIENT_APPROVER" || role === "CREATIVE_DIRECTOR" || role === "OWNER" || role === "ADMIN";
    if (!canApprove) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied: Only CLIENT_APPROVER, CREATIVE_DIRECTOR, or OWNER can approve content items.",
        },
        { status: 403 }
      );
    }

    // Rule: Pre-check compliance gate - cannot approve if blocking prohibited claims exist
    if (decision === "APPROVED" && item.complianceFlags) {
      try {
        const findings = JSON.parse(item.complianceFlags);
        const hasBlocking = Array.isArray(findings) && findings.some((f: any) => f.severity === "BLOCKING");
        if (hasBlocking) {
          return NextResponse.json(
            {
              success: false,
              error: "Compliance violation: Content item contains unresolved blocking prohibited claims. Regenerate or edit to comply with Brand Brain before approving.",
              findings,
            },
            { status: 400 }
          );
        }
      } catch {
        // Continue if parsing fails
      }
    }

    // Rule: Quality Gate enforcement - A failed asset cannot enter the approval queue without override
    if (decision === "APPROVED") {
      const latestQualityReport = await prisma.qualityReport.findFirst({
        where: { contentItemId: id },
        orderBy: { createdAt: "desc" },
      });

      if (latestQualityReport && latestQualityReport.status === "FAILED" && !latestQualityReport.isOverridden) {
        return NextResponse.json(
          {
            success: false,
            error: `Quality Gate violation: Content item failed quality evaluation (Score: ${latestQualityReport.overallScore}/100). A failed asset cannot enter the approval queue without an explicit override and written justification by an OWNER or CREATIVE_DIRECTOR.`,
            reportId: latestQualityReport.id,
            overallScore: latestQualityReport.overallScore,
          },
          { status: 400 }
        );
      }
    }

    const targetStatus = decision === "APPROVED" ? "APPROVED" : "QC_FAILED";

    // Create approval record
    const approval = await prisma.approval.create({
      data: {
        organizationId,
        contentItemId: id,
        userId: user.id,
        decision,
        comments: comments || (decision === "APPROVED" ? "Human review passed." : "Rejected during review."),
      },
    });

    // Update item status
    const updated = await prisma.contentItem.update({
      where: { id },
      data: { status: targetStatus },
      include: { approvals: true, creator: true },
    });

    await logAuditAction({
      organizationId,
      workspaceId: auth.workspaceId,
      userId: user.id,
      action: decision === "APPROVED" ? "CONTENT_ITEM_APPROVED" : "CONTENT_ITEM_REJECTED",
      targetEntity: "ContentItem",
      targetId: id,
      metadata: { decision, actorRole: role, comments },
    });

    return NextResponse.json({
      success: true,
      item: updated,
      approval,
      message: `Content item marked as ${targetStatus}.`,
    });
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
