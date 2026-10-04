import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `${ip}:${email}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        {
          error: "Too many sign-in attempts. Please wait 5 minutes before requesting another link.",
        },
        { status: 429 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fixed uniform message to eliminate any account enumeration vector
    const uniformResponse = {
      success: true,
      message: "We've emailed you a secure sign-in link. Check your inbox and spam folder.",
    };

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured in environment.");
      // In dev or preview mode when keys aren't set yet, return the uniform success message
      return NextResponse.json({
        ...uniformResponse,
        devNotice: "Supabase keys not yet set in environment. Link will be sent once Supabase URL/Anon key are configured.",
      });
    }

    const origin = req.headers.get("origin") || "https://fernum.online";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/portal`,
      },
    });

    if (error) {
      console.error("Supabase OTP error:", error);
      // Even if Supabase returns rate_limit or other auth errors, avoid leaking account existence
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a few minutes before trying again." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(uniformResponse);
  } catch (err: any) {
    console.error("Magic link handler error:", err);
    return NextResponse.json(
      {
        success: true,
        message: "We've emailed you a secure sign-in link. Check your inbox and spam folder.",
      },
      { status: 200 }
    );
  }
}
