"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    name: "Alice Vance",
    role: "OWNER",
    email: "alice@fernum.studio",
    password: "FernumAlice2026!",
    scope: "Agency Admin (All Brands)",
  },
  {
    name: "Bob Chen",
    role: "CREATIVE_DIRECTOR",
    email: "bob@aurahealth.com",
    password: "FernumBob2026!",
    scope: "AuraHealth (Creative Lead)",
  },
  {
    name: "Charlie Ross",
    role: "CLIENT_APPROVER",
    email: "charlie@aurahealth.com",
    password: "FernumCharlie2026!",
    scope: "AuraHealth (Client Approver)",
  },
  {
    name: "Dana Kapoor",
    role: "EDITOR",
    email: "dana@vervepay.com",
    password: "FernumDana2026!",
    scope: "VervePay (Content Editor)",
  },
  {
    name: "Evan Wright",
    role: "VIEWER",
    email: "evan@aurahealth.com",
    password: "FernumEvan2026!",
    scope: "AuraHealth (Read-Only)",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDev = process.env.NODE_ENV !== "production";

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] text-[var(--page-fg)] px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Studio Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 border-2 border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] shadow-brutal mb-2">
            <Sparkles className="h-6 w-6 fill-current" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-[var(--page-fg)] uppercase">fernum</h1>
          <p className="text-xs text-[var(--page-fg)]/70 font-mono">
            Direct-Response Creative Studio Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal-lg space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-black uppercase text-[var(--block-2-fg)]">Sign In</h2>
            <p className="text-xs text-[var(--block-2-fg)]/70 font-mono">
              Enter your credentials to access the studio workspace.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[var(--sticker-3)] text-white border-2 border-[var(--border)] text-xs font-mono font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-bold uppercase text-[var(--block-2-fg)]">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--block-2-fg)]/60" />
                <input
                  type="email"
                  required
                  placeholder="name@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--page-bg)] border-2 border-[var(--border)] pl-9 pr-3 py-2 text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold uppercase text-[var(--block-2-fg)]">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--block-2-fg)]/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--page-bg)] border-2 border-[var(--border)] pl-9 pr-3 py-2 text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] hover:text-[var(--block-4-fg)] text-[var(--accent-fg)] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Studio"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Dev-Only Quick Fill Credentials (Disabled in Production) */}
          {isDev && (
            <div className="pt-4 border-t-2 border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-[var(--accent)]" /> Dev Quick Fill (Local Only)
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[var(--sticker-1)] text-[var(--block-4-bg)] border border-[var(--border)] font-mono font-bold">
                  DEV_MODE
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className="p-2 bg-[var(--page-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] border border-[var(--border)] text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-[var(--page-fg)] group-hover:text-[var(--accent-fg)]">
                        {acc.name}
                      </div>
                      <div className="text-[10px] font-mono opacity-70">{acc.scope}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border border-[var(--border)] font-bold">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono opacity-80 text-[var(--page-fg)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>HTTP-only SameSite session cookies with Argon/Scrypt password hashing</span>
        </div>
      </div>
    </div>
  );
}
