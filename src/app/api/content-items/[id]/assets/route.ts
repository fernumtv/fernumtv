import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { storage } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentItem = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        assets: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!contentItem) {
      return NextResponse.json({ error: "Content item not found." }, { status: 404 });
    }

    const auth = await requireWorkspaceAccess(req, contentItem.workspaceId);
    if ("errorResponse" in auth) {
      return auth.errorResponse;
    }

    // Refresh signed URLs for all assets that have storage keys
    const signedAssets = await Promise.all(
      contentItem.assets.map(async (asset) => {
        let signedUrl = asset.url;
        if (asset.storageKey) {
          signedUrl = await storage.getSignedUrl(asset.storageKey, 3600);
        }
        return {
          id: asset.id,
          assetType: asset.assetType,
          provider: asset.provider,
          model: asset.model,
          costEstimate: Number(asset.costEstimate),
          version: asset.version,
          signedUrl,
          createdAt: asset.createdAt,
          metadata: asset.metadata ? (typeof asset.metadata === "string" ? JSON.parse(asset.metadata) : asset.metadata) : null,
        };
      })
    );

    return NextResponse.json({ assets: signedAssets });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
