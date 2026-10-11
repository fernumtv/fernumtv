import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export interface VerifiedAuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Extracts a Bearer token or cookie-based Supabase session token from a Request or raw token string.
 */
function extractToken(reqOrToken: Request | string): string | null {
  if (typeof reqOrToken === "string") {
    const trimmed = reqOrToken.trim();
    if (trimmed.startsWith("Bearer ")) {
      return trimmed.slice(7).trim() || null;
    }
    return trimmed.length > 0 ? trimmed : null;
  }

  // 1. Check Authorization header: Bearer <token>
  const authHeader = reqOrToken.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  // 2. Fallback: Check Cookie header for Supabase auth access token
  const cookieHeader = reqOrToken.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      const [rawKey, ...valParts] = cookie.split("=");
      const key = rawKey.trim();
      const val = valParts.join("=").trim();
      if (!val) continue;

      if (key === "sb-access-token") {
        return decodeURIComponent(val);
      }

      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        try {
          const parsed = JSON.parse(decodeURIComponent(val));
          if (Array.isArray(parsed) && typeof parsed[0] === "string" && parsed[0]) {
            return parsed[0];
          }
          if (parsed && typeof parsed.access_token === "string" && parsed.access_token) {
            return parsed.access_token;
          }
        } catch {
          return decodeURIComponent(val);
        }
      }
    }
  }

  return null;
}

/**
 * Validates a Bearer token or Supabase Auth access token from request headers or cookies
 * and returns the authenticated user data and admin authorization.
 * Returns null if token is missing, invalid, expired, or database is not configured.
 */
export async function verifyAuthUser(reqOrToken: Request | string): Promise<VerifiedAuthUser | null> {
  const token = extractToken(reqOrToken);
  if (!token) {
    return null;
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = getSupabaseAdmin() || (anonKey && supabaseUrl ? createClient(supabaseUrl, anonKey) : null);
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) {
    return null;
  }

  const email = data.user.email;
  if (!email) {
    return null;
  }

  const userEmail = email.toLowerCase().trim();
  const isAdmin = siteConfig.adminEmails.some(
    (adminEmail) => adminEmail.toLowerCase().trim() === userEmail
  );

  return {
    id: data.user.id,
    email,
    isAdmin,
  };
}
