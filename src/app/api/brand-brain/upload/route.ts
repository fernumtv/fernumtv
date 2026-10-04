import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/session";
import { assertPermission, UnauthorizedError } from "@/lib/auth/rbac";
import { storage } from "@/lib/storage";
import { extractTextFromBuffer, validateFileContent, FileValidationError } from "@/lib/brand-brain/extractor";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    let workspaceId = "";
    let filename = "";
    let mimeType = "text/plain";
    let buffer: Buffer;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      workspaceId = (formData.get("workspaceId") as string) || "";
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided in form-data." }, { status: 400 });
      }

      filename = file.name;
      mimeType = file.type || "application/octet-stream";
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // JSON payload fallback with base64 or raw text
      const body = await req.json();
      workspaceId = body.workspaceId || "";
      filename = body.filename || `document-${Date.now()}.txt`;
      mimeType = body.mimeType || "text/plain";

      if (body.contentBase64) {
        buffer = Buffer.from(body.contentBase64, "base64");
      } else if (body.text) {
        buffer = Buffer.from(body.text, "utf-8");
      } else {
        return NextResponse.json({ success: false, error: "No document content provided." }, { status: 400 });
      }
    }

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "workspaceId is required." }, { status: 400 });
    }

    const auth = await requireWorkspaceAccess(req, workspaceId);
    if ("errorResponse" in auth) return auth.errorResponse;

    const { user, organizationId, role } = auth;
    assertPermission(role, "EDIT_CONTENT");

    // Retrieve BrandBrain
    const brandBrain = await prisma.brandBrain.findUnique({
      where: { workspaceId },
    });

    if (!brandBrain) {
      return NextResponse.json({ success: false, error: "BrandBrain not found for workspace." }, { status: 404 });
    }

    // 1. Validate file content (magic bytes, whitelist, size limits) and sanitize filename
    const { sanitizedName } = validateFileContent(buffer, filename);

    // 2. Store file in object storage layer
    const stored = await storage.uploadAsset({
      organizationId,
      workspaceId,
      filename: sanitizedName,
      data: buffer,
      contentType: mimeType,
    });

    // 3. Extract text from validated buffer
    const extractedText = extractTextFromBuffer(sanitizedName, buffer);
    const tokenCount = Math.round(extractedText.length / 4);

    // 4. Save BrandBrainDocument record
    const document = await prisma.brandBrainDocument.create({
      data: {
        organizationId,
        workspaceId,
        brandBrainId: brandBrain.id,
        title: sanitizedName,
        fileUrl: stored.signedUrl,
        mimeType,
        extractedText,
        tokenCount,
      },
    });

    // 4. Audit Log
    await logAuditAction({
      organizationId,
      workspaceId,
      userId: user.id,
      action: "BRAND_BRAIN_DOC_UPLOADED",
      targetEntity: "BrandBrainDocument",
      targetId: document.id,
      metadata: {
        filename,
        tokenCount,
        fileUrl: stored.signedUrl,
        actorRole: role,
      },
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error: any) {
    console.error("BRAND_BRAIN_UPLOAD_ERROR:", error);
    let status = 500;
    if (error instanceof UnauthorizedError) status = 403;
    if (error.name === "FileValidationError") status = 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
