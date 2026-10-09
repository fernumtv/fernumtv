"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Play,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Volume2,
  RefreshCw,
  Eye,
  FileCheck,
  ChevronRight,
  Layers,
} from "lucide-react";

interface CreatorStudioViewProps {
  workspaceId: string;
  currentUser: {
    name: string;
    role: string;
  };
}

export function CreatorStudioView({ workspaceId, currentUser }: CreatorStudioViewProps) {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<any[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);
  const [assembledContext, setAssembledContext] = useState<any | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [generatingPreview, setGeneratingPreview] = useState<"image" | "speech" | null>(null);
  const [previewTelemetry, setPreviewTelemetry] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // New Memory state
  const [newMemoryCategory, setNewMemoryCategory] = useState("product_experience");
  const [newMemoryFact, setNewMemoryFact] = useState("");

  // Consent Records for Real-Person dropdown
  const [consentRecords, setConsentRecords] = useState<any[]>([]);

  // Wizard Form State
  const [wizardData, setWizardData] = useState({
    name: "",
    type: "TALKING_HEAD",
    niche: "",
    personality: "",
    tone: "",
    vocabulary: "",
    interests: "",
    values: "",
    behaviorRules: "",
    contentPillars: "",
    preferredTopics: "",
    prohibitedTopics: "",
    voiceProvider: "mock",
    voiceModelId: "en-US-neutral-1",
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    wardrobeNotes: "",
    visualStyleGuide: "",
    isSynthetic: true,
    consentRecordId: "",
  });

  const canEdit = ["OWNER", "ADMIN", "STRATEGIST", "CREATIVE_DIRECTOR"].includes(currentUser.role);
  const canApprove = ["OWNER", "ADMIN", "CLIENT_APPROVER", "CREATIVE_DIRECTOR"].includes(currentUser.role);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const [resC, resCons] = await Promise.all([
        fetch(`/api/creators?workspaceId=${workspaceId}`),
        fetch(`/api/consent?workspaceId=${workspaceId}`),
      ]);
      const dataC = await resC.json();
      const dataCons = await resCons.json();

      if (dataC.success) {
        setCreators(dataC.creators || []);
        if (dataC.creators?.length > 0 && !selectedCreator) {
          fetchCreatorDetail(dataC.creators[0].id);
        }
      }
      if (dataCons.success) {
        setConsentRecords(dataCons.consentRecords || []);
      }
    } catch (err) {
      console.error("Failed to load creators", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/creators/${id}?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCreator(data.creator);
        setAssembledContext(data.assembledContext);
      }
    } catch (err) {
      console.error("Failed to load creator detail", err);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [workspaceId]);

  const handleStatusChange = async (targetStatus: "APPROVED" | "LOCKED" | "DRAFT") => {
    if (!selectedCreator) return;

    try {
      setFeedback(null);
      const res = await fetch("/api/creators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCreator.id,
          workspaceId,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          msg: `Creator status updated to ${targetStatus}.`,
        });
        fetchCreatorDetail(selectedCreator.id);
        fetchCreators();
      } else {
        setFeedback({ type: "error", msg: data.error || "Status update failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    }
  };

  const handleBumpVersion = async () => {
    if (!selectedCreator) return;

    try {
      setFeedback(null);
      const res = await fetch("/api/creators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCreator.id,
          workspaceId,
          bumpVersion: true,
          status: "DRAFT", // Unlocks into draft for new revisions
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          msg: `Created new editable version (v${data.creator.version}) with audit trail.`,
        });
        fetchCreatorDetail(selectedCreator.id);
        fetchCreators();
      } else {
        setFeedback({ type: "error", msg: data.error || "Version bump failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    }
  };

  const handleGeneratePreview = async (modality: "image" | "speech") => {
    if (!selectedCreator) return;

    try {
      setGeneratingPreview(modality);
      setPreviewTelemetry(null);
      const res = await fetch(`/api/creators/${selectedCreator.id}/generate-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          modality,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPreviewTelemetry(data.telemetry);
        setFeedback({
          type: "success",
          msg: `Generated mock ${modality} preview (${data.telemetry.latencyMs}ms, $${data.telemetry.costUsd.toFixed(4)} logged to UsageLedger).`,
        });
        fetchCreatorDetail(selectedCreator.id);
      } else {
        setFeedback({ type: "error", msg: data.error || "Preview generation failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setGeneratingPreview(null);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator || !newMemoryFact.trim()) return;

    try {
      const res = await fetch(`/api/creators/${selectedCreator.id}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          category: newMemoryCategory,
          fact: newMemoryFact,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewMemoryFact("");
        fetchCreatorDetail(selectedCreator.id);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to add memory fact." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    }
  };

  const handleCreateWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFeedback(null);
      const res = await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          ...wizardData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsWizardOpen(false);
        setFeedback({ type: "success", msg: `Creator '${data.creator.name}' created successfully in DRAFT.` });
        fetchCreators();
        fetchCreatorDetail(data.creator.id);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to create creator." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span>Loading Virtual Creator Roster...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Creator Studio
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono">
                {creators.length} Identities
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Design, lock, and manage persistent virtual influencers with versioned memory and real-person safeguards.
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setWizardStep(1);
              setIsWizardOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Creator Wizard</span>
          </button>
        )}
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
          {feedback.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Main Studio View: Roster Grid + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator List (Left 4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase font-mono tracking-wider">
            Virtual Creator Roster
          </h2>

          <div className="space-y-3">
            {creators.map((c) => (
              <div
                key={c.id}
                onClick={() => fetchCreatorDetail(c.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  selectedCreator?.id === c.id
                    ? "border-purple-500 bg-purple-950/20 shadow-sm"
                    : "border-border bg-card/60 hover:border-border/80"
                }`}
              >
                <img
                  src={c.avatarUrl || "/avatars/placeholder.svg"}
                  alt={c.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground truncate">{c.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">
                      v{c.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "LOCKED"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : c.status === "APPROVED"
                          ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                          : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {c.type === "TALKING_HEAD" ? "Talking Head" : "On Location"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{c.niche}</p>
                </div>
              </div>
            ))}

            {creators.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No creators configured for this brand yet.
              </div>
            )}
          </div>
        </div>

        {/* Creator Detail Inspector (Right 8 Cols) */}
        {selectedCreator ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Identity Card & Actions */}
            <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCreator.avatarUrl}
                    alt={selectedCreator.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-16 w-16 rounded-xl object-cover border-2 border-purple-500/30 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{selectedCreator.name}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        v{selectedCreator.version}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          selectedCreator.status === "LOCKED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : selectedCreator.status === "APPROVED"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {selectedCreator.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedCreator.type === "TALKING_HEAD" ? "Studio Talking Head" : "On-Location Vlog"} •{" "}
                      {selectedCreator.niche}
                    </p>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Transitions */}
                  {selectedCreator.status === "DRAFT" && canApprove && (
                    <button
                      onClick={() => handleStatusChange("APPROVED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Approve Identity</span>
                    </button>
                  )}

                  {selectedCreator.status === "APPROVED" && canApprove && (
                    <button
                      onClick={() => handleStatusChange("LOCKED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Lock Identity</span>
                    </button>
                  )}

                  {selectedCreator.status === "LOCKED" && canEdit && (
                    <button
                      onClick={handleBumpVersion}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-medium transition"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>New Version (v{selectedCreator.version + 1})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Likeness Safeguard Badge */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  selectedCreator.isSynthetic
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : selectedCreator.consentRecord?.status === "VERIFIED"
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedCreator.isSynthetic ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  <span>
                    {selectedCreator.isSynthetic
                      ? "100% Synthetic AI Influencer (Zero Real-Person Likeness Liability)"
                      : `Real-Person Likeness Model: Verified Consent (${selectedCreator.consentRecord?.personName || "Missing Record"})`}
                  </span>
                </div>
                {!selectedCreator.isSynthetic && (
                  <span className="font-mono text-[10px] uppercase">
                    Status: {selectedCreator.consentRecord?.status || "UNVERIFIED"}
                  </span>
                )}
              </div>

              {/* Persona Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">Personality & Cadence</span>
                  <p className="text-foreground">{selectedCreator.personality || "Not specified"}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">Tone & Mannerisms</span>
                  <p className="text-foreground">{selectedCreator.tone || "Not specified"}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">Vocabulary & Catchphrases</span>
                  <p className="text-foreground">{selectedCreator.vocabulary || "Not specified"}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">Content Pillars</span>
                  <p className="text-foreground">{selectedCreator.contentPillars || "Not specified"}</p>
                </div>
              </div>

              {/* Mock Generation Preview Buttons */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Mock Multimodal Generation (Zero Paid Keys):</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGeneratePreview("image")}
                    disabled={generatingPreview !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs transition disabled:opacity-50"
                  >
                    {generatingPreview === "image" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5" />
                    )}
                    <span>Generate Visual Frame ($0.04)</span>
                  </button>

                  <button
                    onClick={() => handleGeneratePreview("speech")}
                    disabled={generatingPreview !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-200 text-xs transition disabled:opacity-50"
                  >
                    {generatingPreview === "speech" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                    <span>Synthesize Voice Sample ($0.001)</span>
                  </button>
                </div>
              </div>

              {previewTelemetry && (
                <div className="p-3 rounded-lg bg-muted/20 border border-border text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                  <span>Provider: {previewTelemetry.provider} ({previewTelemetry.model})</span>
                  <span>Latency: {previewTelemetry.latencyMs}ms</span>
                  <span className="text-emerald-400 font-semibold">Ledger Cost: ${previewTelemetry.costUsd.toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Creator Memories Timeline */}
            <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  Creator Memory & Persistent Lore
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {selectedCreator.memories?.length || 0} Facts Known
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Persistent facts the creator "knows" and references across videos to maintain continuity.
              </p>

              {/* Add Memory Form */}
              {canEdit && (
                <form onSubmit={handleAddMemory} className="flex gap-2">
                  <select
                    value={newMemoryCategory}
                    onChange={(e) => setNewMemoryCategory(e.target.value)}
                    className="px-2 py-1.5 rounded-md bg-background border border-border text-xs text-foreground outline-none"
                  >
                    <option value="product_experience">Product Experience</option>
                    <option value="past_event">Past Event</option>
                    <option value="inside_joke">Inside Joke</option>
                    <option value="lore">Character Lore</option>
                  </select>
                  <input
                    type="text"
                    placeholder="e.g. Tried the cold plunge protocol in Episode 4..."
                    value={newMemoryFact}
                    onChange={(e) => setNewMemoryFact(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md bg-background border border-border text-xs text-foreground outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition"
                  >
                    Add Fact
                  </button>
                </form>
              )}

              {/* Memory List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedCreator.memories?.map((m: any) => (
                  <div key={m.id} className="p-2.5 rounded-lg border border-border bg-background/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-300 font-mono text-[10px] uppercase">
                        {m.category.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">v{m.version}</span>
                    </div>
                    <p className="text-foreground">{m.fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assembled Unified Context Inspector */}
            {assembledContext && (
              <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm space-y-3">
                <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Unified Creator Context (Identity + Memory + Brand Brain)
                </h3>
                <p className="text-xs text-muted-foreground">
                  This assembled JSON represents the exact grounding payload passed to generation models in Phase 3.
                </p>
                <pre className="p-3 rounded-lg bg-background/80 border border-border text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-48">
                  {JSON.stringify(assembledContext, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Creation Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Create Virtual Influencer</h2>
                <p className="text-xs text-muted-foreground">Step {wizardStep} of 4: Configure persona & guardrails</p>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateWizard} className="space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-foreground">Creator Name</label>
                      <input
                        type="text"
                        required
                        value={wizardData.name}
                        onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                        placeholder="e.g. Kora Vance"
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-foreground">Creator Type</label>
                      <select
                        value={wizardData.type}
                        onChange={(e) => setWizardData({ ...wizardData, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-purple-500"
                      >
                        <option value="TALKING_HEAD">Studio Talking Head</option>
                        <option value="ON_LOCATION">On-Location / Vlog</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-foreground">Content Niche & Focus</label>
                    <input
                      type="text"
                      required
                      value={wizardData.niche}
                      onChange={(e) => setWizardData({ ...wizardData, niche: e.target.value })}
                      placeholder="e.g. Longevity, Biohacking & Cellular Nutrition"
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-foreground">Personality & Cadence</label>
                    <textarea
                      rows={2}
                      value={wizardData.personality}
                      onChange={(e) => setWizardData({ ...wizardData, personality: e.target.value })}
                      placeholder="Analytical, calm, curious, speaks with steady cadence..."
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-foreground">Tone of Voice</label>
                      <input
                        type="text"
                        value={wizardData.tone}
                        onChange={(e) => setWizardData({ ...wizardData, tone: e.target.value })}
                        placeholder="Educational, scientist, approachable"
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-foreground">Signature Vocabulary</label>
                      <input
                        type="text"
                        value={wizardData.vocabulary}
                        onChange={(e) => setWizardData({ ...wizardData, vocabulary: e.target.value })}
                        placeholder="Autophagy, circadian, biomarkers"
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-foreground">Wardrobe & Visual Style</label>
                    <textarea
                      rows={2}
                      value={wizardData.wardrobeNotes}
                      onChange={(e) => setWizardData({ ...wizardData, wardrobeNotes: e.target.value })}
                      placeholder="Minimalist linen shirts, earthy tones, laboratory or modern loft setting"
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-medium text-foreground">Content Pillars</label>
                    <input
                      type="text"
                      value={wizardData.contentPillars}
                      onChange={(e) => setWizardData({ ...wizardData, contentPillars: e.target.value })}
                      placeholder="Morning routines, sleep architecture, supplement breakdowns"
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-foreground">Preferred Topics</label>
                      <input
                        type="text"
                        value={wizardData.preferredTopics}
                        onChange={(e) => setWizardData({ ...wizardData, preferredTopics: e.target.value })}
                        placeholder="Cold plunges, adaptogens, slow-wave sleep"
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-red-400">Prohibited Topics</label>
                      <input
                        type="text"
                        value={wizardData.prohibitedTopics}
                        onChange={(e) => setWizardData({ ...wizardData, prohibitedTopics: e.target.value })}
                        placeholder="Extreme crash starvation diets, synthetic stimulants"
                        className="w-full px-3 py-2 rounded-md bg-background border border-red-500/30 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-950/20 space-y-3">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-purple-400" />
                      Real-Person Likeness Safeguard (Section 8)
                    </div>
                    <p className="text-muted-foreground">
                      Fernum defaults to 100% synthetic characters. If you base this virtual influencer on a real
                      person's face or voice, you MUST bind an uploaded and verified legal consent record.
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isSynthetic"
                          checked={wizardData.isSynthetic}
                          onChange={() => setWizardData({ ...wizardData, isSynthetic: true })}
                        />
                        <span className="text-foreground">Fully Synthetic (Default)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isSynthetic"
                          checked={!wizardData.isSynthetic}
                          onChange={() => setWizardData({ ...wizardData, isSynthetic: false })}
                        />
                        <span className="text-amber-400 font-medium">Real-Person Likeness</span>
                      </label>
                    </div>

                    {!wizardData.isSynthetic && (
                      <div className="pt-3 border-t border-border space-y-1.5">
                        <label className="font-medium text-foreground">Select Verified Consent Agreement</label>
                        <select
                          required
                          value={wizardData.consentRecordId}
                          onChange={(e) => setWizardData({ ...wizardData, consentRecordId: e.target.value })}
                          className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
                        >
                          <option value="">-- Choose verified consent record --</option>
                          {consentRecords.map((cr) => (
                            <option key={cr.id} value={cr.id}>
                              {cr.personName} ({cr.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                  >
                    Create Creator
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
