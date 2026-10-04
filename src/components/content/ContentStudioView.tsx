"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Film,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Layers,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Send,
  Eye,
  Plus,
  RefreshCw,
  User,
  Hash,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { MediaProductionStudio } from "./MediaProductionStudio";
import { QualityGateCard } from "./QualityGateCard";

interface ContentStudioViewProps {
  workspaceId: string;
  currentUser: {
    name: string;
    role: string;
  };
}

export function ContentStudioView({ workspaceId, currentUser }: ContentStudioViewProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [qualityReport, setQualityReport] = useState<any | null>(null);
  const [activeStep, setActiveStep] = useState<"idea" | "hook" | "script" | "storyboard" | "caption" | "thumbnail">("idea");
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [costRollups, setCostRollups] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [userInstruction, setUserInstruction] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newCreatorId, setNewCreatorId] = useState("");
  const [creators, setCreators] = useState<any[]>([]);

  const canEdit = ["OWNER", "ADMIN", "STRATEGIST", "CREATIVE_DIRECTOR", "EDITOR"].includes(currentUser.role);
  const canApprove = ["OWNER", "ADMIN", "CLIENT_APPROVER", "CREATIVE_DIRECTOR"].includes(currentUser.role);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resItems, resCreators] = await Promise.all([
        fetch(`/api/content-items?workspaceId=${workspaceId}`),
        fetch(`/api/creators?workspaceId=${workspaceId}`),
      ]);
      const dataItems = await resItems.json();
      const dataCreators = await resCreators.json();

      if (dataItems.success) {
        setItems(dataItems.items || []);
        setCostRollups(dataItems.costRollups);
        if (dataItems.items?.length > 0 && !selectedItem) {
          fetchItemDetail(dataItems.items[0].id);
        }
      }
      if (dataCreators.success) {
        setCreators(dataCreators.creators || []);
      }
    } catch (err) {
      console.error("Failed to load content studio data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/content-items/${id}?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.item);
      }

      // Fetch Quality Gate report for item
      const qRes = await fetch(`/api/quality-reports?workspaceId=${workspaceId}&contentItemId=${id}`);
      const qData = await qRes.json();
      if (qData.success && qData.reports?.length > 0) {
        setQualityReport(qData.reports[0]);
      } else {
        setQualityReport(null);
      }
    } catch (err) {
      console.error("Failed to load item detail", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workspaceId]);

  const handleGenerateStep = async () => {
    if (!selectedItem) return;

    try {
      setGenerating(true);
      setFeedback(null);
      const res = await fetch(`/api/content-items/${selectedItem.id}/generate-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          step: activeStep,
          userInstruction: userInstruction.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          msg: `Generated ${activeStep.toUpperCase()} (v${data.stepResult.version}) using ${data.stepResult.compliance.passed ? "verified" : "flagged"} compliance checks.`,
        });
        setUserInstruction("");
        setSelectedItem(data.item);
        fetchData();
      } else {
        setFeedback({ type: "error", msg: data.error || "Generation failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectVariant = async (step: "hook" | "script", variantIndex: number) => {
    if (!selectedItem) return;

    try {
      const res = await fetch(`/api/content-items/${selectedItem.id}/select-variant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          step,
          variantIndex,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.item);
        setFeedback({ type: "success", msg: `Active ${step} updated to Variant ${variantIndex + 1}.` });
      }
    } catch (err) {
      console.error("Failed to select variant", err);
    }
  };

  const handleRevertStep = async (step: string, version: number) => {
    if (!selectedItem) return;

    try {
      const res = await fetch(`/api/content-items/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          revertStep: { step, version },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.item);
        setFeedback({ type: "success", msg: data.message });
      }
    } catch (err) {
      console.error("Failed to revert step", err);
    }
  };

  const handleApprove = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedItem) return;

    try {
      setApproving(true);
      setFeedback(null);
      const res = await fetch(`/api/content-items/${selectedItem.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          decision,
          comments: `${currentUser.role} decision during Studio Review.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", msg: data.message });
        setSelectedItem(data.item);
        fetchData();
      } else {
        setFeedback({ type: "error", msg: data.error || "Approval failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setApproving(false);
    }
  };

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    try {
      const res = await fetch("/api/content-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          topic: newTopic,
          creatorId: newCreatorId || undefined,
          platform: "INSTAGRAM",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsNewModalOpen(false);
        setNewTopic("");
        fetchData();
        fetchItemDetail(data.item.id);
      }
    } catch (err) {
      console.error("Failed to create content item", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span>Loading Continuous Content Studio Pipeline...</span>
        </div>
      </div>
    );
  }

  // Get active step versions
  const activeStepRecords = (selectedItem?.pipelineSteps || []).filter(
    (s: any) => s.step === activeStep
  );
  const latestStepRecord = activeStepRecords[0];

  let parsedLatestContent: any = null;
  if (latestStepRecord?.contentJson) {
    try {
      parsedLatestContent = JSON.parse(latestStepRecord.contentJson);
    } catch {
      parsedLatestContent = latestStepRecord.contentJson;
    }
  }

  // Compliance findings
  let complianceFindings: any[] = [];
  if (selectedItem?.complianceFlags) {
    try {
      complianceFindings = JSON.parse(selectedItem.complianceFlags);
    } catch {
      complianceFindings = [];
    }
  }
  const hasBlockingCompliance = complianceFindings.some((f) => f.severity === "BLOCKING");

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header with Cost Rollups */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Continuous Content Studio
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {items.length} Pipeline Items
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Idea-to-Asset generation pipeline grounded by Creator Context and Brand Brain guardrails.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {costRollups && (
            <div className="hidden md:flex items-center gap-4 text-xs font-mono bg-muted/20 border border-border px-3 py-1.5 rounded-md">
              <span className="text-muted-foreground">Workspace Spend:</span>
              <span className="text-emerald-400 font-semibold">${costRollups.totalWorkspaceSpend.toFixed(4)}</span>
            </div>
          )}

          {canEdit && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Pipeline Item</span>
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
          {feedback.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Main Grid: Pipeline Items (Left 4 Cols) + Pipeline Studio Workspace (Right 8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Items List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase font-mono tracking-wider">
            Active Productions
          </h2>

          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                onClick={() => fetchItemDetail(it.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                  selectedItem?.id === it.id
                    ? "border-purple-500 bg-purple-950/20 shadow-sm"
                    : "border-border bg-card/60 hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      it.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : it.status === "AWAITING_APPROVAL"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {it.status}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    ${(it.estimatedCost || 0).toFixed(4)}
                  </span>
                </div>

                <span className="font-semibold text-xs text-foreground line-clamp-1">{it.topic}</span>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {it.creator?.name || "Unassigned"}
                  </span>
                  <span className="font-mono text-[10px]">{it.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 6-Step Flywheel Pipeline Studio */}
        {selectedItem ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Stage Stepper Tabs */}
            <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-foreground">{selectedItem.topic}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>Creator: <strong>{selectedItem.creator?.name || "Brand Campaign"}</strong></span>
                    <span>•</span>
                    <span>Cost: <strong className="text-emerald-400 font-mono">${(selectedItem.estimatedCost || 0).toFixed(4)}</strong></span>
                  </div>
                </div>

                {/* Human Approval Button */}
                <div className="flex items-center gap-2">
                  {selectedItem.status === "APPROVED" ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                      <Check className="h-3.5 w-3.5" />
                      <span>Approved for Production</span>
                    </div>
                  ) : canApprove ? (
                    <button
                      onClick={() => handleApprove("APPROVED")}
                      disabled={approving || hasBlockingCompliance}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition disabled:opacity-50"
                    >
                      {approving ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}
                      <span>Approve Asset</span>
                    </button>
                  ) : (
                    <div className="text-xs text-muted-foreground font-mono">
                      Status: {selectedItem.status}
                    </div>
                  )}
                </div>
              </div>

              {/* 6 Stage Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { key: "idea", label: "1. Idea" },
                  { key: "hook", label: "2. Hook" },
                  { key: "script", label: "3. Script" },
                  { key: "storyboard", label: "4. Storyboard" },
                  { key: "caption", label: "5. Caption" },
                  { key: "thumbnail", label: "6. Thumbnail" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveStep(s.key as any)}
                    className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition ${
                      activeStep === s.key
                        ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                        : "bg-background/60 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Compliance Pre-Check Warning Banner */}
              {complianceFindings.length > 0 && (
                <div
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    hasBlockingCompliance
                      ? "bg-red-950/20 border-red-500/30 text-red-200"
                      : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldAlert className="h-4 w-4" />
                    <span>
                      {hasBlockingCompliance
                        ? "Brand Brain Pre-Check: Blocking Prohibited Claims Detected"
                        : "Brand Brain Pre-Check Warnings"}
                    </span>
                  </div>
                  {complianceFindings.map((f: any, idx: number) => (
                    <p key={idx} className="text-[11px] pl-6 text-muted-foreground">
                      • <strong className="text-foreground">{f.matchedRule}</strong>: {f.explanation}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Phase 5: Quality Gate v1 Verification & Governance */}
            <QualityGateCard
              report={qualityReport}
              userRole={currentUser.role}
              workspaceId={workspaceId}
              contentItemId={selectedItem.id}
              onRefresh={() => {
                fetchData();
                fetchItemDetail(selectedItem.id);
              }}
            />

            {/* Phase 4 Orchestration: Vertical Media Production Studio */}
            <MediaProductionStudio
              workspaceId={workspaceId}
              contentItemId={selectedItem.id}
              isApproved={selectedItem.status === "APPROVED"}
              currentUserRole={currentUser.role}
              onAssetGenerated={() => {
                fetchData();
                fetchItemDetail(selectedItem.id);
              }}
            />

            {/* Step Generation & Version Controls */}
            <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 font-mono">
                    Step: {activeStep}
                  </h3>
                  {latestStepRecord && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted/40 font-mono text-muted-foreground">
                      Active: v{latestStepRecord.version}
                    </span>
                  )}
                </div>

                {/* Historical Version Revert Picker */}
                {activeStepRecords.length > 1 && (
                  <div className="flex items-center gap-2 text-xs">
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Revert:</span>
                    <select
                      onChange={(e) => handleRevertStep(activeStep, parseInt(e.target.value, 10))}
                      value={latestStepRecord?.version}
                      className="px-2 py-1 rounded bg-background border border-border text-xs outline-none"
                    >
                      {activeStepRecords.map((r: any) => (
                        <option key={r.id} value={r.version}>
                          Version {r.version} (${(r.costUsd || 0).toFixed(4)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Generator Prompt Box */}
              {canEdit && (
                <div className="p-4 rounded-lg bg-background/50 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      Grounded AI Director ({selectedItem.creator?.name || "Brand Brain"})
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Gemini / Provider Adapter
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Custom creative direction for ${activeStep} (e.g. emphasize cold extraction mechanism)...`}
                      value={userInstruction}
                      onChange={(e) => setUserInstruction(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-md bg-background border border-border outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleGenerateStep}
                      disabled={generating}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow transition disabled:opacity-50"
                    >
                      {generating ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      <span>{activeStepRecords.length > 0 ? "Regenerate Step" : "Generate Step"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step Output Display & Variants Picker */}
              <div className="space-y-4">
                {/* 1. HOOK STEP (Variants A/B Testing) */}
                {activeStep === "hook" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Generated Hook Variations (A/B Testing)
                    </h4>

                    {Array.isArray(parsedLatestContent) ? (
                      <div className="grid grid-cols-1 gap-3">
                        {parsedLatestContent.map((v: any, idx: number) => {
                          const isSelected = selectedItem.selectedHookIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border transition space-y-2 ${
                                isSelected
                                  ? "border-purple-500 bg-purple-950/20"
                                  : "border-border bg-card/40"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-purple-300">
                                  Variant {idx + 1}: {v.angle}
                                </span>
                                {isSelected ? (
                                  <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Chosen Active
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSelectVariant("hook", idx)}
                                    className="text-[10px] px-2.5 py-1 rounded bg-muted/40 hover:bg-purple-600 hover:text-white transition font-mono"
                                  >
                                    Select as Active
                                  </button>
                                )}
                              </div>
                              <p className="text-sm font-medium text-foreground italic">"{v.hook}"</p>
                              <p className="text-xs text-muted-foreground">{v.reasoning}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-background/50 border border-border text-xs text-foreground">
                        {selectedItem.hookText || "No hook generated yet."}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SCRIPT STEP (Variants Side-by-Side) */}
                {activeStep === "script" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Script Variations
                    </h4>

                    {Array.isArray(parsedLatestContent) ? (
                      <div className="grid grid-cols-1 gap-4">
                        {parsedLatestContent.map((v: any, idx: number) => {
                          const isSelected = selectedItem.selectedScriptIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border transition space-y-3 ${
                                isSelected
                                  ? "border-purple-500 bg-purple-950/20"
                                  : "border-border bg-card/40"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-foreground">
                                    Script Variant {idx + 1}: {v.versionName}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    ~{v.durationSec}s
                                  </span>
                                </div>
                                {isSelected ? (
                                  <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Chosen Active
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSelectVariant("script", idx)}
                                    className="text-[10px] px-2.5 py-1 rounded bg-muted/40 hover:bg-purple-600 hover:text-white transition font-mono"
                                  >
                                    Select as Active
                                  </button>
                                )}
                              </div>
                              <pre className="text-xs font-sans text-muted-foreground whitespace-pre-wrap leading-relaxed p-3 rounded-lg bg-background/60">
                                {v.script}
                              </pre>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <pre className="text-xs font-sans text-foreground whitespace-pre-wrap p-4 rounded-lg bg-background/50 border border-border leading-relaxed">
                        {selectedItem.script || "No script generated yet."}
                      </pre>
                    )}
                  </div>
                )}

                {/* 3. STORYBOARD STEP */}
                {activeStep === "storyboard" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Shot-by-Shot Storyboard Director
                    </h4>
                    {parsedLatestContent?.scenes ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {parsedLatestContent.scenes.map((s: any, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-lg border border-border bg-background/50 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-purple-300 font-mono text-[11px]">
                              <span>Scene {s.sceneNumber}: {s.shotType}</span>
                              <span>{s.timecode}</span>
                            </div>
                            <p className="text-foreground">{s.visualPrompt}</p>
                            <p className="text-[11px] text-muted-foreground italic">Audio: {s.audioNotes}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-xs text-foreground p-4 rounded-lg bg-background/50 border border-border whitespace-pre-wrap">
                        {selectedItem.storyboard || "No storyboard generated yet."}
                      </pre>
                    )}
                  </div>
                )}

                {/* 4. CAPTION STEP */}
                {activeStep === "caption" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Social Caption & Hashtags
                    </h4>
                    <div className="p-4 rounded-lg bg-background/50 border border-border space-y-3 text-xs">
                      <pre className="text-xs font-sans text-foreground whitespace-pre-wrap leading-relaxed">
                        {selectedItem.caption || "No caption generated yet."}
                      </pre>
                    </div>
                  </div>
                )}

                {/* 5. THUMBNAIL STEP */}
                {activeStep === "thumbnail" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                      Thumbnail Visual Direction
                    </h4>
                    <div className="p-4 rounded-lg bg-background/50 border border-border space-y-2 text-xs">
                      <p className="font-semibold text-purple-300">
                        {parsedLatestContent?.conceptTitle || "Thumbnail Direction"}
                      </p>
                      <p className="text-foreground">
                        {parsedLatestContent?.visualPrompt || selectedItem.thumbnailConcept || "No thumbnail generated yet."}
                      </p>
                      {parsedLatestContent?.overlayText && (
                        <div className="pt-2 border-t border-border flex items-center gap-2">
                          <span className="text-muted-foreground">Overlay Text:</span>
                          <span className="font-bold text-amber-400 font-mono">{parsedLatestContent.overlayText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. IDEA STEP */}
                {activeStep === "idea" && (
                  <div className="p-4 rounded-lg bg-background/50 border border-border text-xs text-foreground leading-relaxed">
                    {typeof parsedLatestContent === "string" ? parsedLatestContent : JSON.stringify(parsedLatestContent, null, 2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* New Pipeline Item Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-foreground">Create Production Item</h2>
            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Content Topic / Working Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why marine collagen peptides beat regular powder..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Assign Virtual Creator</label>
                <select
                  value={newCreatorId}
                  onChange={(e) => setNewCreatorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-purple-500"
                >
                  <option value="">-- Brand Campaign-less Item --</option>
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
