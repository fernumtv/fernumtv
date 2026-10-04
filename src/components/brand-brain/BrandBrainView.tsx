"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Upload,
  Search,
  Save,
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";

interface BrandBrainViewProps {
  workspaceId: string;
  currentUser: {
    name: string;
    role: string;
  };
}

export function BrandBrainView({ workspaceId, currentUser }: BrandBrainViewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [brandBrain, setBrandBrain] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const canEdit = ["OWNER", "ADMIN", "STRATEGIST", "CREATIVE_DIRECTOR"].includes(currentUser.role);

  const fetchBrandBrain = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/brand-brain?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success && data.brandBrain) {
        setBrandBrain(data.brandBrain);
        setFormData(data.brandBrain);
      }
    } catch (err) {
      console.error("Failed to load Brand Brain", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandBrain();
  }, [workspaceId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch("/api/brand-brain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBrandBrain(data.brandBrain);
        setFormData(data.brandBrain);
        setFeedback({ type: "success", msg: `Brand Brain saved as version v${data.brandBrain.version} with audit trail.` });
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to update Brand Brain." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canEdit) return;

    try {
      setUploading(true);
      setFeedback(null);
      const dataForm = new FormData();
      dataForm.append("workspaceId", workspaceId);
      dataForm.append("file", file);

      const res = await fetch("/api/brand-brain/upload", {
        method: "POST",
        body: dataForm,
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", msg: `Document '${file.name}' uploaded and indexed (${data.document.tokenCount} tokens).` });
        fetchBrandBrain();
      } else {
        setFeedback({ type: "error", msg: data.error || "Upload failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSearchRetrieval = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const res = await fetch(`/api/brand-brain?workspaceId=${workspaceId}&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResult(data.searchResult);
      }
    } catch (err) {
      console.error("Retrieval search failed", err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span>Loading Brand Brain Knowledge Base...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Brand Brain: {formData.brandName || "Workspace Knowledge"}
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono">
                  v{brandBrain?.version || 1}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Centralized brand governance, positioning, zero-tolerance claims, and retrieval store.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!canEdit && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md font-mono">
              <Lock className="h-3.5 w-3.5" />
              <span>Read-Only Mode ({currentUser.role})</span>
            </div>
          )}

          {canEdit && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow transition disabled:opacity-50"
            >
              {saving ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>Save Version Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Main Grid: Form + Sidebar (Documents & Retrieval) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Structured Brand Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Core Positioning Card */}
          <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Brand Identity & Positioning
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Brand Name</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.brandName || ""}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.tagline || ""}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tone of Voice</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.toneOfVoice || ""}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                  placeholder="e.g. Authoritative, scientific, optimistic, zero-pseudoscience"
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Positioning & Market Stance</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.positioning || ""}
                  onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Target Customers & Demographics</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.targetAudiences || ""}
                  onChange={(e) => setFormData({ ...formData, targetAudiences: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Visual Identity & Messaging */}
          <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Messaging, Products & Style Guidelines
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Primary Palette (Hex Codes)</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.primaryColors || ""}
                  onChange={(e) => setFormData({ ...formData, primaryColors: e.target.value })}
                  placeholder="#10B981, #064E3B, #0F172A"
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Font Families</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={formData.fontStyles || ""}
                  onChange={(e) => setFormData({ ...formData, fontStyles: e.target.value })}
                  placeholder="Inter Display, JetBrains Mono"
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Products and Key Benefits</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.productsAndBenefits || ""}
                  onChange={(e) => setFormData({ ...formData, productsAndBenefits: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Approved Messaging & Pillars</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.approvedMessaging || ""}
                  onChange={(e) => setFormData({ ...formData, approvedMessaging: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Competitor Intelligence</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.competitorNotes || ""}
                  onChange={(e) => setFormData({ ...formData, competitorNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Compliance & Zero-Tolerance Guardrails */}
          <div className="p-5 rounded-xl border border-red-500/20 bg-red-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Zero-Tolerance Compliance & Negative Constraints
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-red-300">
                  Prohibited Claims (Strictly blocked in all script generations)
                </label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={formData.prohibitedClaims || ""}
                  onChange={(e) => setFormData({ ...formData, prohibitedClaims: e.target.value })}
                  placeholder="e.g. Never claim to cure, treat, or prevent chronic disease..."
                  className="w-full px-3 py-2 text-xs rounded-md bg-background/80 border border-red-500/30 text-red-200 focus:border-red-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prohibited Topics</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={formData.prohibitedTopics || ""}
                    onChange={(e) => setFormData({ ...formData, prohibitedTopics: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Legal & Regulatory Disclaimers</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={formData.legalRestrictions || ""}
                    onChange={(e) => setFormData({ ...formData, legalRestrictions: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Approved Terminology</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={formData.approvedTerminology || ""}
                    onChange={(e) => setFormData({ ...formData, approvedTerminology: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Call-to-Action (CTA) Rules</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={formData.ctaRules || ""}
                    onChange={(e) => setFormData({ ...formData, ctaRules: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Documents & Live Retrieval Inspector */}
        <div className="space-y-6">
          {/* Document Upload & Knowledge Files */}
          <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Upload className="h-4 w-4 text-emerald-400" />
                Indexed Knowledge Docs
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                {brandBrain?.documents?.length || 0} Docs
              </span>
            </div>

            {canEdit && (
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-border hover:border-purple-500/50 rounded-lg cursor-pointer bg-background/40 transition">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs font-medium text-foreground">
                  {uploading ? "Extracting & Indexing..." : "Upload Brand PDF / Text"}
                </span>
                <span className="text-[10px] text-muted-foreground">PDF, TXT, MD up to 10MB</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Document List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {brandBrain?.documents?.map((doc: any) => (
                <div key={doc.id} className="p-2.5 rounded-lg border border-border bg-background/50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-medium">
                    <span className="truncate max-w-[180px] text-foreground">{doc.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{doc.tokenCount} tokens</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                    "{doc.extractedText.slice(0, 100)}..."
                  </p>
                </div>
              ))}

              {(!brandBrain?.documents || brandBrain.documents.length === 0) && (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  No uploaded knowledge documents yet.
                </div>
              )}
            </div>
          </div>

          {/* Live Retrieval Tester */}
          <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Context Retrieval Tester
            </h2>
            <p className="text-xs text-muted-foreground">
              Simulate prompt grounding: query the Brand Brain for relevant compliance claims and document snippets.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. cellular sleep protocol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchRetrieval()}
                className="flex-1 px-3 py-2 text-xs rounded-md bg-background border border-border focus:border-purple-500 outline-none"
              />
              <button
                onClick={handleSearchRetrieval}
                disabled={searching}
                className="px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium disabled:opacity-50"
              >
                {searching ? "..." : "Retrieve"}
              </button>
            </div>

            {searchResult && (
              <div className="p-3 rounded-lg border border-purple-500/30 bg-background/80 space-y-2 text-xs">
                <div className="font-semibold text-purple-300">Retrieved Context:</div>
                <div className="text-[11px] space-y-1">
                  <div>
                    <span className="text-muted-foreground">Tone: </span>
                    <span className="text-foreground">{searchResult.toneOfVoice || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-red-400 font-medium">Prohibited Claims: </span>
                    <span className="text-red-200">{searchResult.prohibitedClaims || "None"}</span>
                  </div>
                </div>

                {searchResult.matchedDocuments?.length > 0 && (
                  <div className="pt-2 border-t border-border space-y-1.5">
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Matched Snippets</div>
                    {searchResult.matchedDocuments.map((m: any, idx: number) => (
                      <div key={idx} className="p-1.5 rounded bg-muted/30 text-[11px]">
                        <span className="font-medium text-foreground">{m.title}</span> (Score: {m.score})
                        <p className="text-muted-foreground italic mt-0.5">{m.snippet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
