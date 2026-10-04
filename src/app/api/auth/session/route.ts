export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: No active session." },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const requestedWorkspaceId = url.searchParams.get("workspaceId");

  // Determine permitted workspaces based on memberships
  const isGlobalAdmin = session.memberships.some(
    (m) => m.workspaceId === null && (m.role === "OWNER" || m.role === "ADMIN")
  );

  let allowedWorkspaces: any[] = [];
  if (isGlobalAdmin) {
    // Global admin can access all workspaces under their organization
    const orgId = session.memberships[0]?.organizationId;
    allowedWorkspaces = await prisma.workspace.findMany({
      where: { organizationId: orgId },
    });
  } else {
    // Scoped members can only access their specific workspaces
    const scopedWorkspaceIds = session.memberships
      .map((m) => m.workspaceId)
      .filter((id): id is string => id !== null);

    allowedWorkspaces = await prisma.workspace.findMany({
      where: { id: { in: scopedWorkspaceIds } },
    });
  }

  if (allowedWorkspaces.length === 0) {
    return NextResponse.json(
      { success: false, error: "User has no accessible workspaces." },
      { status: 403 }
    );
  }

  // Choose active workspace
  let activeWorkspace = allowedWorkspaces[0];
  if (requestedWorkspaceId) {
    const found = allowedWorkspaces.find((w) => w.id === requestedWorkspaceId);
    if (found) {
      activeWorkspace = found;
    }
  }

  // Derive role for the active workspace
  let role: Role = "VIEWER";
  if (isGlobalAdmin) {
    const adminMembership = session.memberships.find(
      (m) => m.workspaceId === null && (m.role === "OWNER" || m.role === "ADMIN")
    );
    role = adminMembership?.role || "OWNER";
  } else {
    const member = session.memberships.find((m) => m.workspaceId === activeWorkspace.id);
    role = member?.role || "VIEWER";
  }

  return NextResponse.json({
    success: true,
    user: session.user,
    role,
    activeWorkspace,
    allowedWorkspaces,
    isGlobalAdmin,
  });
}
