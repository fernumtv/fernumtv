import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const resolvedParams = await params;
  const key = resolvedParams.key.join("/");
  const url = new URL(req.url);
  const expires = parseInt(url.searchParams.get("expires") || "0", 10);
  const sig = url.searchParams.get("sig") || "";

  if (!sig || !expires || !storage.verifySignature(key, expires, sig)) {
    return new NextResponse("Access Denied: Invalid or expired storage signature", {
      status: 403,
    });
  }

  const file = storage.getLocalFile(key);
  if (!file) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
