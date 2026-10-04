export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assembleCreatorContext } from "@/lib/creators/context";

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

    const creator = await prisma.creator.findUnique({
      where: { id },
      include: {
        consentRecord: true,
        memories: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!creator || creator.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Creator not found in workspace." }, { status: 404 });
    }

    // Assemble comprehensive Creator Context (Identity + Memory + Brand Brain)
    const assembledContext = await assembleCreatorContext(id);

    return NextResponse.json({
      success: true,
      creator,
      assembledContext,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
