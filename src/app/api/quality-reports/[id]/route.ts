export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await prisma.qualityReport.findUnique({
      where: { id },
      include: {
        workspace: true,
        asset: true,
        contentItem: true,
      },
    });

    if (!report) {
      return NextResponse.json({ success: false, error: "QualityReport not found" }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(req, report.workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        checks: JSON.parse(report.checksJson || "[]"),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
