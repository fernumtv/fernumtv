"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Sparkles, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [expiredNotice, setExpiredNotice] = useState(false);

  // Check if portal is enabled, if user is already signed in, or if link was expired
  useEffect(() => {
    if (!siteConfig.portalEnabled) {
      router.replace("/");
      return;
    }

    // Check URL parameters or hash for expired link tokens
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (
      errorParam === "expired" ||
      hash.includes("otp_expired") ||
      hash.includes("token_expired") ||
      (errorDesc && errorDesc.toLowerCase().includes("expired"))
    ) {
      setExpiredNotice(true);
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          router.replace("/portal");
        }
      });
    }
  }, [router, searchParams]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid business email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setExpiredNotice(false);

    try {
      // 1. Submit through our server route handler
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(
          data?.error ||
            `We couldn't send the link. Try again or email us at ${siteConfig.contactEmail}.`
        );
        return;
      }

      setSent(true);
    } catch (err: any) {
      console.error("Magic link request error:", err);
      setError(
        `We couldn't send the link. Try again or email us at ${siteConfig.contactEmail}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase authentication is not configured yet.");
        setGoogleLoading(false);
        return;
      }

      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/portal`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google sign-in.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)]">
      <StudioNavbar />

      {/* Main Login Card */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-12 shadow-brutal-xl space-y-6">
          {/* Eyebrow badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal-sm">
              <span>● Client Portal</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none mb-2">
              CLIENT LOGIN
            </h1>
            <p className="text-xs sm:text-sm font-mono opacity-75 max-w-sm mx-auto">
              Passwordless access to your monthly deliverables, ad slots, and creative pipeline.
            </p>
          </div>

          {/* Expired link banner notice */}
          {expiredNotice && (
            <div className="p-4 bg-[var(--sticker-3)]/15 border-2 border-[var(--sticker-3)] text-xs font-mono text-[var(--block-2-fg)] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[var(--sticker-3)]" />
                <span>Sign-In Link Expired</span>
              </div>
              <p className="opacity-90">
                Your previous link has expired or has already been used. Please enter your email below to receive a fresh magic link.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 text-xs font-mono font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success State: Magic Link Sent */}
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto shadow-brutal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display font-black text-xl uppercase tracking-tight">
                  Check Your Inbox
                </h2>
                <p className="text-xs font-mono opacity-80 max-w-xs mx-auto leading-relaxed">
                  We've emailed a secure sign-in link to{" "}
                  <strong className="text-[var(--accent)] font-bold">{email}</strong>. Click the link in your email to enter your portal.
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]/20 text-center space-y-3">
                <p className="text-[11px] font-mono opacity-60">
                  Didn't receive it? Check your spam folder or request a new link.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-xs font-mono font-bold uppercase underline hover:text-[var(--accent)] cursor-pointer"
                >
                  Send another link →
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleMagicLink} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
                >
                  Account / Billing Email *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@yourbrand.com"
                    autoComplete="email"
                    className="w-full h-12 px-4 bg-[var(--page-bg)] border-2 border-[var(--border)] text-sm font-medium text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] focus:border-[var(--accent)] transition-colors"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
                </div>
                <p className="text-[11px] font-mono opacity-65 mt-1.5">
                  We'll email you a sign-in link. No passwords stored by us.
                </p>
              </div>

              {/* Submit Magic Link */}
              <button
                type="submit"
                disabled={loading}
                data-cursor="lets-go"
                className="btn-squish w-full h-[50px] bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending magic link…</span>
                  </span>
                ) : (
                  <>
                    <span>Email Me a Sign-In Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-[2px] bg-[var(--border)]/20" />
                <span className="text-[10px] font-mono font-bold uppercase opacity-50">OR</span>
                <div className="flex-1 h-[2px] bg-[var(--border)]/20" />
              </div>

              {/* Google OAuth Option */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="btn-squish w-full h-[46px] bg-[var(--page-bg)] hover:bg-[var(--border)]/10 text-[var(--page-fg)] font-display font-bold text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? "Connecting…" : "Continue with Google"}</span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono opacity-60 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Protected by Supabase Auth • Free tier isolation</span>
              </div>
            </form>
          )}
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center text-xs font-mono font-bold uppercase text-[var(--page-fg)]">
          Loading login…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
