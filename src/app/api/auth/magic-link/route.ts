import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

// In-memory rate limiting map: email/ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 3;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    rateLimitMap.set(key, valid);
    return true;
  }

  valid.push(now);
  rateLimitMap.set(key, valid);
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `${ip}:${email}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many sign-in attempts. Please wait 5 minutes before requesting another link.",
        },
        { status: 429 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured in environment.");
      return NextResponse.json(
        {
          success: false,
          error: `We couldn't send the link. Try again or email us at ${siteConfig.contactEmail}.`,
          reason: "missing_supabase_credentials",
        },
        { status: 503 }
      );
    }

    const origin = req.headers.get("origin") || siteConfig.url || "https://fernum.online";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/portal`,
      },
    });

    if (error) {
      console.error("Supabase OTP error:", error);
      if (error.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many sign-in attempts. Please wait a few minutes before trying again.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `We couldn't send the link. Try again or email us at ${siteConfig.contactEmail}.`,
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "We've emailed you a secure sign-in link. Check your inbox and spam folder.",
    });
  } catch (err: any) {
    console.error("Magic link handler error:", err);
    return NextResponse.json(
      {
        success: false,
        error: `We couldn't send the link. Try again or email us at ${siteConfig.contactEmail}.`,
      },
      { status: 500 }
    );
  }
}
