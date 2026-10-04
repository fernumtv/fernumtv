"use client";

import React from "react";
import {
  Kanban,
  BrainCircuit,
  Bot,
  Clapperboard,
  Compass,
  Share2,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const navItems = [
    {
      id: "ops-board",
      label: "Internal Ops Board",
      icon: Kanban,
      active: true,
      phase: "Phase 1 Core",
    },
    {
      id: "brand-brain",
      label: "Brand Brain",
      icon: BrainCircuit,
      active: false,
      phase: "Phase 2",
    },
    {
      id: "creator-studio",
      label: "Creator Studio",
      icon: Bot,
      active: false,
      phase: "Phase 2",
    },
    {
      id: "content-studio",
      label: "Content Studio",
      icon: Clapperboard,
      active: false,
      phase: "Phase 3",
    },
    {
      id: "campaign-center",
      label: "Campaign Center",
      icon: Compass,
      active: false,
      phase: "Phase 6",
    },
    {
      id: "social-center",
      label: "Social Center",
      icon: Share2,
      active: false,
      phase: "Phase 7",
    },
    {
      id: "analytics",
      label: "Analytics & ROI",
      icon: BarChart3,
      active: false,
      phase: "Phase 8",
    },
    {
      id: "team",
      label: "Team & RBAC",
      icon: Users,
      active: true,
      phase: "Phase 1",
    },
  ];

  return (
    <aside className="w-64 border-r border-border/70 bg-card/40 backdrop-blur-md flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
            Operations Engine
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm"
                      : "text-muted-foreground hover:text-white hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isCurrent ? "text-purple-400" : "text-muted-foreground"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      item.active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground/60"
                    }`}
                  >
                    {item.phase}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Studio Status Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-purple-950/30 to-background border border-purple-500/20 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">
              Tenant Isolation Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Strict row-level tenancy enforced on all queries. Zero cross-brand data leakage.
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Zero-key mock mode online
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border/50 text-center">
        <p className="text-[10px] text-muted-foreground/70 font-mono">
          Fernum Engine v1.0.0 (Phase 1 Foundation)
        </p>
      </div>
    </aside>
  );
}
