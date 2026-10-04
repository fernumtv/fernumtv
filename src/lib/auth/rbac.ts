export type Role =
  | "OWNER"
  | "ADMIN"
  | "STRATEGIST"
  | "CREATIVE_DIRECTOR"
  | "EDITOR"
  | "CLIENT_APPROVER"
  | "VIEWER";

export type Permission =
  | "VIEW_OPS_BOARD"
  | "CREATE_CONTENT"
  | "EDIT_CONTENT"
  | "DELETE_CONTENT"
  | "CHANGE_STAGE"
  | "SUBMIT_FOR_QC"
  | "APPROVE_CONTENT"
  | "REJECT_CONTENT"
  | "SCHEDULE_PUBLISH"
  | "VIEW_AUDIT_LOGS"
  | "MANAGE_TEAM";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    "VIEW_OPS_BOARD",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "DELETE_CONTENT",
    "CHANGE_STAGE",
    "SUBMIT_FOR_QC",
    "APPROVE_CONTENT",
    "REJECT_CONTENT",
    "SCHEDULE_PUBLISH",
    "VIEW_AUDIT_LOGS",
    "MANAGE_TEAM",
  ],
  ADMIN: [
    "VIEW_OPS_BOARD",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "DELETE_CONTENT",
    "CHANGE_STAGE",
    "SUBMIT_FOR_QC",
    "APPROVE_CONTENT",
    "REJECT_CONTENT",
    "SCHEDULE_PUBLISH",
    "VIEW_AUDIT_LOGS",
    "MANAGE_TEAM",
  ],
  CREATIVE_DIRECTOR: [
    "VIEW_OPS_BOARD",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "CHANGE_STAGE",
    "SUBMIT_FOR_QC",
    "APPROVE_CONTENT",
    "REJECT_CONTENT",
    "SCHEDULE_PUBLISH",
    "VIEW_AUDIT_LOGS",
  ],
  STRATEGIST: [
    "VIEW_OPS_BOARD",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "CHANGE_STAGE",
    "SUBMIT_FOR_QC",
    "VIEW_AUDIT_LOGS",
  ],
  EDITOR: [
    "VIEW_OPS_BOARD",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "CHANGE_STAGE",
    "SUBMIT_FOR_QC",
  ],
  CLIENT_APPROVER: [
    "VIEW_OPS_BOARD",
    "APPROVE_CONTENT",
    "REJECT_CONTENT",
    "VIEW_AUDIT_LOGS",
  ],
  VIEWER: ["VIEW_OPS_BOARD"],
};

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(`[RBAC/Unauthorized] ${message}`);
    this.name = "UnauthorizedError";
  }
}

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new UnauthorizedError(
      `Role '${role}' is not granted permission '${permission}'.`
    );
  }
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
}

// Demo users mapped for testing and rapid switching in Phase 1 Ops Board
export const DEMO_USERS: Record<string, UserSession> = {
  alice: {
    userId: "user_alice_vance",
    email: "alice@fernum.studio",
    name: "Alice Vance",
    organizationId: "org_fernum_studio",
    workspaceId: "ws_aura_health",
    role: "OWNER",
  },
  bob: {
    userId: "user_bob_chen",
    email: "bob@aurahealth.com",
    name: "Bob Chen",
    organizationId: "org_fernum_studio",
    workspaceId: "ws_aura_health",
    role: "CREATIVE_DIRECTOR",
  },
  charlie: {
    userId: "user_charlie_ross",
    email: "charlie@aurahealth.com",
    name: "Charlie Ross",
    organizationId: "org_fernum_studio",
    workspaceId: "ws_aura_health",
    role: "CLIENT_APPROVER",
  },
  dana: {
    userId: "user_dana_kapoor",
    email: "dana@vervepay.com",
    name: "Dana Kapoor",
    organizationId: "org_fernum_studio",
    workspaceId: "ws_verve_pay",
    role: "EDITOR",
  },
};
