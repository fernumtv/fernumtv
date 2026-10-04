"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Building2,
  Shield,
  Wallet,
  Activity,
  LogOut,
  User,
} from "lucide-react";

interface NavbarProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  currentRole: string;
  currentWorkspace: {
    id: string;
    name: string;
    slug: string;
    monthlyBudget: number;
    currentSpend: number;
  } | null;
  allowedWorkspaces: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  onSwitchWorkspace: (workspaceId: string) => void;
  onOpenAudit: () => void;
}

export function Navbar({
  currentUser,
  currentRole,
  currentWorkspace,
  allowedWorkspaces,
  onSwitchWorkspace,
  onOpenAudit,
}: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const spendPercent = currentWorkspace
    ? Math.min(
        100,
        Math.round(
          (currentWorkspace.currentSpend / currentWorkspace.monthlyBudget) * 100
        )
      )
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Brand / Studio Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  fernum
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Studio Ops
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                AI-Native Media Platform
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-border/80" />

          {/* Permitted Workspace / Brand Selector */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-muted-foreground font-medium">
              Brand:
            </span>
            {allowedWorkspaces.length > 1 ? (
              <select
                value={currentWorkspace?.id || ""}
                onChange={(e) => onSwitchWorkspace(e.target.value)}
                className="bg-card border border-border/80 rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground hover:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer transition-colors"
              >
                {allowedWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-white">
                {currentWorkspace?.name || "Workspace"}
              </span>
            )}
          </div>
        </div>

        {/* Right: Budget Meter, Authenticated User & Logout */}
        <div className="flex items-center gap-4">
          {/* Monthly Budget Tracker */}
          {currentWorkspace && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card/60 border border-border/60">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="text-[11px]">
                <span className="text-muted-foreground">Spend: </span>
                <span className="font-semibold text-white">
                  ${currentWorkspace.currentSpend.toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / ${currentWorkspace.monthlyBudget.toFixed(0)}
                </span>
              </div>
              <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                  style={{ width: `${spendPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Audit Logs Trigger */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/70 hover:border-purple-500/40 hover:bg-purple-500/5 text-xs text-muted-foreground hover:text-white transition-all"
            title="Inspect Tenant Audit Log"
          >
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-medium">Audit Log</span>
          </button>

          {/* Authenticated User Badge */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-card border border-border/80">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-purple-300 font-mono">
                <Shield className="h-2.5 w-2.5 text-purple-400" />
                <span>{currentRole}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border/70 hover:border-red-500/40 hover:bg-red-500/10 text-xs text-muted-foreground hover:text-red-300 transition-all"
            title="Sign out of Fernum Studio"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
