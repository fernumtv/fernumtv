"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  FolderDown,
  Clock,
  Sparkles,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  FileText,
  CheckCircle2,
  AlertCircle,
  Video,
  Settings,
  User,
  ArrowRight,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";

interface Deliverable {
  id: string;
  file_name: string;
  file_path: string;
  aspect_ratio?: string;
  signedUrl?: string;
}

interface AdSlot {
  id: string;
  client_id?: string;
  title: string;
  status: "brief_received" | "script_ready" | "in_production" | "delivered";
  due_date?: string;
  notes?: string;
  deliverables?: Deliverable[];
}

interface ClientProfile {
  id: string;
  email: string;
  plan: "launch" | "growth" | "scale";
  role: "client" | "admin";
  brand_name?: string;
  created_at?: string;
}

const STATUS_STEPS: { id: AdSlot["status"]; label: string; step: number }[] = [
  { id: "brief_received", label: "Brief Received", step: 1 },
  { id: "script_ready", label: "Script Ready", step: 2 },
  { id: "in_production", label: "In Production", step: 3 },
  { id: "delivered", label: "Delivered", step: 4 },
];

export default function PortalPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allClients, setAllClients] = useState<ClientProfile[]>([]);
  const [token, setToken] = useState<string>("");

  // Admin view toggle & modal forms
  const [adminMode, setAdminMode] = useState(false);
  const [selectedClientForSlot, setSelectedClientForSlot] = useState("");
  const [newSlotTitle, setNewSlotTitle] = useState("");
  const [newSlotStatus, setNewSlotStatus] = useState<AdSlot["status"]>("brief_received");
  const [newSlotDueDate, setNewSlotDueDate] = useState("");
  const [newSlotNotes, setNewSlotNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deliverable upload state
  const [selectedSlotForDeliv, setSelectedSlotForDeliv] = useState("");
  const [delivFileName, setDelivFileName] = useState("");
  const [delivFilePath, setDelivFilePath] = useState("");
  const [delivRatio, setDelivRatio] = useState("9:16");

  // Load portal session & data
  const loadPortalData = async () => {
    try {
      const supabase = getSupabaseClient();
      let accessToken = "";

      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        accessToken = session.access_token;
        setToken(accessToken);
        setUserEmail(session.user.email || "");
      } else {
        // Fallback for preview/mock demo
        setUserEmail("demo@yourbrand.com");
      }

      const res = await fetch("/api/portal/data", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "Bearer demo-token",
        },
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      if (data) {
        setProfile(data.profile);
        setAdSlots(data.adSlots || []);
        setIsAdmin(Boolean(data.isAdmin));
        setAllClients(data.allClients || []);
      }
    } catch (err) {
      console.error("Error loading portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/login");
  };

  // Admin: Create new ad slot
  const handleCreateAdSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForSlot || !newSlotTitle) return;

    setActionLoading(true);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/portal/admin/ad-slot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: selectedClientForSlot,
          title: newSlotTitle,
          status: newSlotStatus,
          due_date: newSlotDueDate || undefined,
          notes: newSlotNotes || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionSuccess("Ad slot created successfully!");
        setNewSlotTitle("");
        setNewSlotNotes("");
        await loadPortalData();
      } else {
        alert(data.error || "Failed to create ad slot.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Admin: Update status of an ad slot
  const handleUpdateStatus = async (slotId: string, newStatus: AdSlot["status"]) => {
    try {
      const res = await fetch("/api/portal/admin/ad-slot", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: slotId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        await loadPortalData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Add deliverable to slot
  const handleAddDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForDeliv || !delivFileName || !delivFilePath) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/portal/admin/deliverable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ad_slot_id: selectedSlotForDeliv,
          file_name: delivFileName,
          file_path: delivFilePath,
          aspect_ratio: delivRatio,
        }),
      });

      if (res.ok) {
        setActionSuccess("Deliverable added! Ad marked as Delivered.");
        setDelivFileName("");
        setDelivFilePath("");
        await loadPortalData();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Admin: Update client plan
  const handleUpdatePlan = async (clientId: string, newPlan: string) => {
    try {
      const res = await fetch("/api/portal/admin/client-plan", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: clientId,
          plan: newPlan,
        }),
      });

      if (res.ok) {
        await loadPortalData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-8 text-xs font-mono font-bold uppercase tracking-wider text-[var(--page-fg)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          <span>Opening your AdPass portal…</span>
        </div>
      </div>
    );
  }

  const currentPlan = profile?.plan || "growth";
  const planInfo =
    currentPlan === "scale"
      ? { name: "Scale", price: "$1,099/month", adsCount: 3, timeline: "About 2 Weeks" }
      : currentPlan === "growth"
      ? { name: "Growth", price: "$799/month", adsCount: 2, timeline: "About 2 Weeks" }
      : { name: "Launch", price: "$499/month", adsCount: 1, timeline: "About 3 Weeks" };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)]">
      {/* Top Portal Navigation */}
      <header className="border-b-2 border-[var(--border)] bg-[var(--block-2-bg)] text-[var(--block-2-fg)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase group-hover:text-[var(--accent)] transition-colors">
                FERNUM <span className="text-[var(--accent)]">PORTAL</span>
              </span>
            </Link>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setAdminMode(!adminMode)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal-sm cursor-pointer ${
                  adminMode
                    ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--border)]/10"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{adminMode ? "Exit Admin Mode" : "Admin Panel"}</span>
              </button>
            )}
          </div>

          {/* User info & Sign out */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-mono font-bold truncate max-w-[200px]">{userEmail}</span>
              <span className="text-[10px] font-mono uppercase opacity-65">
                {isAdmin ? "Studio Admin" : `${planInfo.name} Plan Active`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out of portal"
              className="btn-squish inline-flex items-center gap-1.5 px-3.5 py-2 bg-[var(--page-bg)] hover:bg-[var(--sticker-3)] hover:text-[var(--border)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider shadow-brutal-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Admin Mode Controls (Only visible to verified admin email) */}
        {isAdmin && adminMode ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] shadow-brutal-xl">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] text-[10px] font-mono font-bold uppercase mb-4 border border-[var(--border)]">
                ★ Studio Admin Dashboard
              </div>
              <h2 className="font-display font-black text-3xl uppercase tracking-tight mb-2">
                CLIENT & DELIVERABLE MANAGEMENT
              </h2>
              <p className="text-xs font-mono opacity-80 max-w-xl mb-6">
                Directly manage client subscription plans, assign production ad slots, update review status, and upload delivery download links.
              </p>

              {actionSuccess && (
                <div className="mb-6 p-3 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 text-xs font-mono font-bold">
                  ✓ {actionSuccess}
                </div>
              )}

              {/* Grid: Create Ad Slot & Attach Deliverable */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-[var(--block-4-fg)]/20">
                {/* 1. Create Ad Slot */}
                <form onSubmit={handleCreateAdSlot} className="space-y-4">
                  <h3 className="font-display font-black text-lg uppercase tracking-tight">
                    Create New Ad Slot
                  </h3>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Target Client *
                    </label>
                    <select
                      required
                      value={selectedClientForSlot}
                      onChange={(e) => setSelectedClientForSlot(e.target.value)}
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    >
                      <option value="">Select client email…</option>
                      {allClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.email} ({c.plan.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Ad Slot Title *
                    </label>
                    <input
                      required
                      type="text"
                      value={newSlotTitle}
                      onChange={(e) => setNewSlotTitle(e.target.value)}
                      placeholder="e.g. Ad #1 — Hero Hook / Pain Angle"
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Initial Status
                      </label>
                      <select
                        value={newSlotStatus}
                        onChange={(e) => setNewSlotStatus(e.target.value as AdSlot["status"])}
                        className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                      >
                        <option value="brief_received">Brief Received</option>
                        <option value="script_ready">Script Ready</option>
                        <option value="in_production">In Production</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                        Target Due Date
                      </label>
                      <input
                        type="date"
                        value={newSlotDueDate}
                        onChange={(e) => setNewSlotDueDate(e.target.value)}
                        className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Notes / Hook Details
                    </label>
                    <textarea
                      rows={2}
                      value={newSlotNotes}
                      onChange={(e) => setNewSlotNotes(e.target.value)}
                      placeholder="3 hook angles drafted: Direct Callout, Curiosity Hook, Social Proof..."
                      className="w-full p-2.5 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-squish px-6 h-10 bg-[var(--accent)] text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal cursor-pointer"
                  >
                    <span>Create Ad Slot</span>
                  </button>
                </form>

                {/* 2. Attach Deliverable Download */}
                <form onSubmit={handleAddDeliverable} className="space-y-4">
                  <h3 className="font-display font-black text-lg uppercase tracking-tight">
                    Add Delivered File
                  </h3>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Select Ad Slot *
                    </label>
                    <select
                      required
                      value={selectedSlotForDeliv}
                      onChange={(e) => setSelectedSlotForDeliv(e.target.value)}
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    >
                      <option value="">Select ad slot…</option>
                      {adSlots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      File Display Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={delivFileName}
                      onChange={(e) => setDelivFileName(e.target.value)}
                      placeholder="e.g. Ad1_FullHD_9x16_3Hooks.mp4"
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Private Storage Path or Download URL *
                    </label>
                    <input
                      required
                      type="text"
                      value={delivFilePath}
                      onChange={(e) => setDelivFilePath(e.target.value)}
                      placeholder="e.g. delivered/ad-123/final_export.mp4"
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={delivRatio}
                      onChange={(e) => setDelivRatio(e.target.value)}
                      className="w-full h-10 px-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono"
                    >
                      <option value="9:16">9:16 Vertical (Reels / TikTok)</option>
                      <option value="1:1">1:1 Square (Feed)</option>
                      <option value="16:9">16:9 Landscape (YouTube)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-squish px-6 h-10 bg-[var(--accent)] text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal cursor-pointer"
                  >
                    <span>Attach Deliverable</span>
                  </button>
                </form>
              </div>

              {/* 3. Client Plan Management Table */}
              <div className="mt-8 pt-6 border-t border-[var(--block-4-fg)]/20">
                <h3 className="font-display font-black text-lg uppercase tracking-tight mb-4">
                  Registered Clients ({allClients.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-2 border-[var(--border)]">
                    <thead className="bg-[var(--border)]/40 text-[var(--block-4-fg)]">
                      <tr>
                        <th className="p-3">Client Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Plan Subscription</th>
                        <th className="p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]/30">
                      {allClients.map((c) => (
                        <tr key={c.id} className="hover:bg-[var(--border)]/10">
                          <td className="p-3 font-bold">{c.email}</td>
                          <td className="p-3 uppercase text-[11px]">{c.role}</td>
                          <td className="p-3">
                            <select
                              value={c.plan}
                              onChange={(e) => handleUpdatePlan(c.id, e.target.value)}
                              className="bg-[var(--page-bg)] text-[var(--page-fg)] border border-[var(--border)] px-2 py-1 text-xs font-bold"
                            >
                              <option value="launch">Launch ($499/month)</option>
                              <option value="growth">Growth ($799/month)</option>
                              <option value="scale">Scale ($1,099/month)</option>
                            </select>
                          </td>
                          <td className="p-3 opacity-60">
                            {new Date(c.created_at || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Client Plan & Overview Banner */}
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b-2 border-[var(--border)]/15">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-brutal-sm">
                <span>● Active Subscription</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-none mb-2">
                {planInfo.name} Plan
              </h1>
              <p className="text-xs sm:text-sm font-mono opacity-75">
                {planInfo.adsCount} finished ad{planInfo.adsCount > 1 ? "s" : ""} per month • 3 alternate hooks included • {planInfo.timeline} target
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.customerPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squish inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--page-bg)] hover:bg-[var(--border)]/10 text-[var(--page-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider shadow-brutal-sm transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Manage Billing</span>
              </a>

              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-squish inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider shadow-brutal transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Book a Call</span>
              </a>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm">
              <span className="opacity-60 block uppercase text-[10px] font-bold">Monthly Price</span>
              <span className="font-display font-black text-lg text-[var(--accent)]">{planInfo.price}</span>
            </div>
            <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm">
              <span className="opacity-60 block uppercase text-[10px] font-bold">Commercial License</span>
              <span className="font-bold">Commercial use included</span>
            </div>
            <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm">
              <span className="opacity-60 block uppercase text-[10px] font-bold">Cancellation</span>
              <span className="font-bold">Cancel anytime (period-end)</span>
            </div>
          </div>
        </div>

        {/* Ad Slots Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                Your Monthly Ad Slots ({adSlots.length})
              </h2>
              <p className="text-xs font-mono opacity-70">
                Live production status, hook concept stages, and final video downloads.
              </p>
            </div>

            <Link
              href="/#brief"
              className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Ad Brief</span>
            </Link>
          </div>

          {adSlots.length === 0 ? (
            /* Empty state */
            <div className="p-12 text-center bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal space-y-4">
              <div className="w-12 h-12 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-full flex items-center justify-center mx-auto text-[var(--accent)]">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">
                No Active Ad Slots Yet
              </h3>
              <p className="text-xs font-mono opacity-70 max-w-sm mx-auto">
                Submit your product brief to kick off your first monthly ad slot and script angles.
              </p>
              <Link
                href="/#brief"
                className="btn-squish inline-flex items-center gap-2 px-6 h-10 bg-[var(--accent)] text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal"
              >
                <span>Submit Ad Brief →</span>
              </Link>
            </div>
          ) : (
            /* Ad Slots List */
            <div className="space-y-6">
              {adSlots.map((slot, idx) => {
                const isDelivered = slot.status === "delivered";
                const deliverables = slot.deliverables || [];

                return (
                  <div
                    key={slot.id}
                    className="p-6 sm:p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal-lg space-y-6"
                  >
                    {/* Slot Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]/15">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[var(--page-bg)] border border-[var(--border)]">
                            Slot #{idx + 1}
                          </span>
                          {slot.due_date && (
                            <span className="text-[11px] font-mono opacity-65 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[var(--accent)]" />
                              Target: {new Date(slot.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
                          {slot.title}
                        </h3>
                      </div>

                      {/* Admin Quick Status Changer */}
                      {isAdmin && adminMode && (
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold opacity-60">Status:</span>
                          <select
                            value={slot.status}
                            onChange={(e) =>
                              handleUpdateStatus(slot.id, e.target.value as AdSlot["status"])
                            }
                            className="bg-[var(--page-bg)] text-[var(--page-fg)] border border-[var(--border)] px-2 py-1 text-xs font-bold"
                          >
                            <option value="brief_received">Brief Received</option>
                            <option value="script_ready">Script Ready</option>
                            <option value="in_production">In Production</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar / Steps Tracker */}
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono font-bold uppercase tracking-wider">
                        {STATUS_STEPS.map((stepItem) => {
                          const currentStepObj = STATUS_STEPS.find((s) => s.id === slot.status);
                          const isCurrent = slot.status === stepItem.id;
                          const isPassed =
                            currentStepObj && currentStepObj.step >= stepItem.step;

                          return (
                            <div
                              key={stepItem.id}
                              className={`p-2.5 border-2 border-[var(--border)] transition-colors ${
                                isCurrent
                                  ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-brutal-sm"
                                  : isPassed
                                  ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)]"
                                  : "bg-[var(--page-bg)] text-[var(--page-fg)]/40"
                              }`}
                            >
                              <div className="text-[10px] opacity-75">Step 0{stepItem.step}</div>
                              <div className="text-[11px] truncate">{stepItem.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes if present */}
                    {slot.notes && (
                      <div className="p-3.5 bg-[var(--page-bg)] border border-[var(--border)] text-xs font-mono opacity-80">
                        <span className="font-bold text-[var(--accent)]">Studio Note: </span>
                        {slot.notes}
                      </div>
                    )}

                    {/* Deliverables / Downloads (Private Storage Short-Lived Signed URLs) */}
                    {isDelivered && deliverables.length > 0 && (
                      <div className="p-4 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                          <h4 className="font-display font-black text-sm uppercase tracking-wide">
                            Delivered Video Exports & Testing Hooks
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {deliverables.map((deliv) => (
                            <a
                              key={deliv.id}
                              href={deliv.signedUrl || deliv.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-squish flex items-center justify-between p-3 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] shadow-brutal-sm hover:border-[var(--accent)] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <FolderDown className="w-4 h-4 text-[var(--accent)] shrink-0" />
                                <div className="truncate text-left">
                                  <div className="font-mono font-bold text-xs truncate">
                                    {deliv.file_name}
                                  </div>
                                  <div className="text-[10px] font-mono opacity-60">
                                    {deliv.aspect_ratio || "9:16"} • Full HD 1080p
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold uppercase bg-[var(--accent)] text-[var(--accent-fg)] px-2 py-0.5 ml-2 shrink-0">
                                Download
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Useful Quick Links Footer Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-[var(--border)]/15">
          {/* Card 1: Submit Brief */}
          <Link
            href="/#brief"
            className="p-6 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal hover:shadow-brutal-lg transition-all space-y-2 group"
          >
            <div className="w-9 h-9 bg-[var(--page-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">
              Submit Ad Brief
            </h3>
            <p className="text-xs font-mono opacity-70">
              Launch your next video slot with script concepts reviewed within 2 business days.
            </p>
          </Link>

          {/* Card 2: Manage Billing */}
          <a
            href={siteConfig.customerPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal hover:shadow-brutal-lg transition-all space-y-2 group"
          >
            <div className="w-9 h-9 bg-[var(--page-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
              <span>Billing & Receipts</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </h3>
            <p className="text-xs font-mono opacity-70">
              Download payment receipts, update credit card, or adjust subscription via Dodo Payments.
            </p>
          </a>

          {/* Card 3: Creative Call */}
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal hover:shadow-brutal-lg transition-all space-y-2 group"
          >
            <div className="w-9 h-9 bg-[var(--page-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-2">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
              <span>Book Strategy Call</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </h3>
            <p className="text-xs font-mono opacity-70">
              Schedule your 30-minute creative strategy session directly on the studio calendar.
            </p>
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[var(--border)] bg-[var(--block-4-bg)] text-[var(--block-4-fg)] py-6 text-center text-xs font-mono opacity-70">
        <div>© {new Date().getFullYear()} Fernum (fernum.online). Client Portal.</div>
      </footer>
    </div>
  );
}
