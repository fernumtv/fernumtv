import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../db";
import { Role } from "./rbac";

const DEV_DEFAULT_SECRET = "fernum_development_secret_key_32_bytes_min!";
const APP_SECRET = process.env.APP_SECRET || DEV_DEFAULT_SECRET;

if (process.env.NODE_ENV === "production") {
  if (!process.env.APP_SECRET || process.env.APP_SECRET === DEV_DEFAULT_SECRET || process.env.APP_SECRET.length < 32) {
    throw new Error(
      "[Security/Fatal] Refusing to start in production: APP_SECRET must be set to a cryptographically secure random string (minimum 32 characters) and cannot use the development default."
    );
  }
}

export const SESSION_COOKIE_NAME = "fernum_session";

interface SessionPayload {
  userId: string;
  exp: number;
}

/**
 * Creates an HMAC-signed session token for the user.
 * Payload: base64(JSON) . signature
 */
export function createSessionToken(userId: string, expiresInDays: number = 7): string {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const payload: SessionPayload = { userId, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", APP_SECRET)
    .update(payloadBase64)
    .digest("base64url");
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies the HMAC-signed session token.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", APP_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString()
    );
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
  };
  memberships: Array<{
    id: string;
    organizationId: string;
    workspaceId: string | null;
    role: Role;
  }>;
}

/**
 * Derives authenticated user and memberships strictly from the secure httpOnly session cookie.
 */
export async function getSession(req?: NextRequest): Promise<AuthSession | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      memberships: true,
    },
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    memberships: user.memberships.map((m) => ({
      id: m.id,
      organizationId: m.organizationId,
      workspaceId: m.workspaceId,
      role: m.role as Role,
    })),
  };
}

/**
 * Verifies that the authenticated session has permission to access the target workspaceId.
 * Never trusts any client header, query param, or request body for authority.
 */
export async function requireWorkspaceAccess(
  req: NextRequest,
  workspaceId: string
): Promise<
  | {
      user: AuthSession["user"];
      organizationId: string;
      workspaceId: string;
      role: Role;
    }
  | { errorResponse: NextResponse }
> {
  const session = await getSession(req);
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized: Active session required." },
        { status: 401 }
      ),
    };
  }

  // Find membership authority
  // 1. Check for organization-wide membership (workspaceId === null, e.g. OWNER or ADMIN)
  const orgWideMembership = session.memberships.find(
    (m) => m.workspaceId === null && (m.role === "OWNER" || m.role === "ADMIN")
  );

  if (orgWideMembership) {
    return {
      user: session.user,
      organizationId: orgWideMembership.organizationId,
      workspaceId,
      role: orgWideMembership.role,
    };
  }

  // 2. Check for explicit workspace membership
  const workspaceMembership = session.memberships.find(
    (m) => m.workspaceId === workspaceId
  );

  if (!workspaceMembership) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden: User does not have membership or authority in workspace '${workspaceId}'.`,
        },
        { status: 403 }
      ),
    };
  }

  return {
    user: session.user,
    organizationId: workspaceMembership.organizationId,
    workspaceId,
    role: workspaceMembership.role,
  };
}
