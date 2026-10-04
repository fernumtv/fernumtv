export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTenantDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get("workspaceId");
    const organizationId = "org_fernum_studio";

    const tenantDb = getTenantDb(organizationId, workspaceId || undefined);
    const logs = await tenantDb.auditLog.findMany({ take: 30 });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
