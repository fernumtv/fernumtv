import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { runQualityGate } from "@/lib/quality/quality-gate";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const contentItemId = searchParams.get("contentItemId");

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: workspaceId" },
        { status: 400 }
      );
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const where: any = { workspaceId };
    if (contentItemId) {
      where.contentItemId = contentItemId;
    }

    const reports = await prisma.qualityReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        asset: true,
        contentItem: {
          select: { id: true, topic: true, status: true },
        },
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      reports: reports.map((r) => ({
        ...r,
        checks: JSON.parse(r.checksJson || "[]"),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, contentItemId, assetId } = body;

    if (!workspaceId || !contentItemId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: workspaceId, contentItemId" },
        { status: 400 }
      );
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const report = await runQualityGate(contentItemId, assetId);

    return NextResponse.json({
      success: true,
      report,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
