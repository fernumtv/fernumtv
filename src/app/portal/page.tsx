"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { OpsBoard } from "@/components/ops/OpsBoard";
import { TeamView } from "@/components/team/TeamView";
import { AuditDrawer } from "@/components/ops/AuditDrawer";
import { PhasePreview } from "@/components/common/PhasePreview";
import { BrandBrainView } from "@/components/brand-brain/BrandBrainView";
import { CreatorStudioView } from "@/components/creators/CreatorStudioView";
import { ContentStudioView } from "@/components/content/ContentStudioView";

export default function PortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ops-board");
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  const fetchSession = async (workspaceId?: string) => {
    try {
      const url = workspaceId
        ? `/api/auth/session?workspaceId=${workspaceId}`
        : "/api/auth/session";

      const res = await fetch(url);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSession(data);
        setActiveWorkspaceId(data.activeWorkspace?.id || null);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to load session", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSwitchWorkspace = (workspaceId: string) => {
    fetchSession(workspaceId);
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <span>Verifying Studio Credentials...</span>
        </div>
      </div>
    );
  }

  const { user, role, activeWorkspace, allowedWorkspaces } = session;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar with Authenticated Identity */}
      <Navbar
        currentUser={user}
        currentRole={role}
        currentWorkspace={activeWorkspace}
        allowedWorkspaces={allowedWorkspaces || []}
        onSwitchWorkspace={handleSwitchWorkspace}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Surface Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background/50">
          {currentTab === "ops-board" && activeWorkspace && (
            <OpsBoard
              key={activeWorkspace.id}
              workspaceId={activeWorkspace.id}
              currentUser={{ name: user.name, role }}
            />
          )}

          {currentTab === "team" && <TeamView />}

          {currentTab === "brand-brain" && activeWorkspace && (
            <BrandBrainView
              key={activeWorkspace.id}
              workspaceId={activeWorkspace.id}
              currentUser={{ name: user.name, role }}
            />
          )}

          {currentTab === "creator-studio" && activeWorkspace && (
            <CreatorStudioView
              key={activeWorkspace.id}
              workspaceId={activeWorkspace.id}
              currentUser={{ name: user.name, role }}
            />
          )}

          {currentTab === "content-studio" && activeWorkspace && (
            <ContentStudioView
              key={activeWorkspace.id}
              workspaceId={activeWorkspace.id}
              currentUser={{ name: user.name, role }}
            />
          )}

          {currentTab === "campaign-center" && (
            <PhasePreview
              title="Campaign Strategy Center"
              phaseNumber="Phase 6"
              description="Transform plain-language marketing objectives into full multi-week distribution calendars."
              features={[
                "Plain-language goal translation agent",
                "Budget cap & generation pacing enforcement",
                "Automated batch generation runs",
                "Multi-platform format scheduling",
              ]}
            />
          )}

          {currentTab === "social-center" && (
            <PhasePreview
              title="Social Distribution Center"
              phaseNumber="Phase 7"
              description="Multi-platform publishing to Instagram and YouTube with automated AI disclosure labels."
              features={[
                "Official YouTube Data API v3 & Instagram Graph OAuth",
                "Rate-limited time-zone-aware publish dispatcher",
                "Comment ingestion & AI reply drafts",
                "Mandatory human sign-off on published posts",
              ]}
            />
          )}

          {currentTab === "analytics" && (
            <PhasePreview
              title="Analytics & Closed-Loop Intelligence"
              phaseNumber="Phase 8"
              description="Continuous feedback loop analyzing winning hooks, topic performance, and content fatigue."
              features={[
                "Daily metric snapshot ingestion (views, reach, watch-time)",
                "Hook retention curve analysis",
                "Content fatigue warning alerts",
                "Optimization Agent feedback into next week's content plan",
              ]}
            />
          )}
        </main>
      </div>

      {/* Audit Slide-over Drawer */}
      {activeWorkspace && (
        <AuditDrawer
          isOpen={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
          workspaceId={activeWorkspace.id}
        />
      )}
    </div>
  );
}
