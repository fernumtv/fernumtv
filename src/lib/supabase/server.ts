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

/**
 * Validates a Bearer token or Supabase Auth access token from request headers
 * and returns the authenticated user data.
 */
export async function verifyAuthUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = getSupabaseAdmin() || (anonKey ? createClient(supabaseUrl, anonKey) : null);
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const isAdmin = siteConfig.adminEmails.includes(user.email || "");

  return {
    id: user.id,
    email: user.email || "",
    isAdmin,
  };
}
