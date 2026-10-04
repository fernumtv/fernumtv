export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { mockImageModel, mockSpeechModel } from "@/lib/ai/interfaces";
import { logAuditAction } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { workspaceId, modality = "image", prompt, text } = body;

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    const creator = await prisma.creator.findUnique({ where: { id } });
    if (!creator || creator.workspaceId !== workspaceId) {
      return NextResponse.json({ success: false, error: "Creator not found in workspace." }, { status: 404 });
    }

    if (modality === "image") {
      const imagePrompt = prompt || `Hyper-realistic portrait frame of ${creator.name}, ${creator.niche}, 8k UHD`;
      const result = await mockImageModel.generateImage({
        prompt: imagePrompt,
        organizationId,
        workspaceId,
      });

      // Update creator's avatar / preview
      await prisma.creator.update({
        where: { id },
        data: { avatarUrl: result.data.imageUrl },
      });

      await logAuditAction({
        organizationId,
        workspaceId,
        userId: user.id,
        action: "CREATOR_PREVIEW_GENERATED",
        targetEntity: "Creator",
        targetId: id,
        metadata: {
          modality: "image",
          costUsd: result.telemetry.costUsd,
          model: result.telemetry.model,
          actorRole: role,
        },
      });

      return NextResponse.json({
        success: true,
        modality: "image",
        assetUrl: result.data.imageUrl,
        seed: result.data.seed,
        telemetry: result.telemetry,
      });
    } else if (modality === "speech") {
      const speechText =
        text ||
        `Hey everyone, it's ${creator.name}. Today we are breaking down everything you need to know about ${creator.niche}.`;

      const result = await mockSpeechModel.synthesizeSpeech({
        text: speechText,
        voiceId: creator.voiceModelId || "default-voice",
        speed: creator.voiceSpeed,
        pitch: creator.voicePitch,
        organizationId,
        workspaceId,
      });

      await prisma.creator.update({
        where: { id },
        data: { sampleAudioUrl: result.data.audioUrl },
      });

      await logAuditAction({
        organizationId,
        workspaceId,
        userId: user.id,
        action: "CREATOR_PREVIEW_GENERATED",
        targetEntity: "Creator",
        targetId: id,
        metadata: {
          modality: "speech",
          costUsd: result.telemetry.costUsd,
          model: result.telemetry.model,
          actorRole: role,
        },
      });

      return NextResponse.json({
        success: true,
        modality: "speech",
        assetUrl: result.data.audioUrl,
        durationSec: result.data.durationSec,
        telemetry: result.telemetry,
      });
    } else {
      return NextResponse.json({ success: false, error: "Unsupported modality (use 'image' or 'speech')." }, { status: 400 });
    }
  } catch (error: any) {
    const status = error instanceof UnauthorizedError ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
