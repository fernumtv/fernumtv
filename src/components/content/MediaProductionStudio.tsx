"use client";

import React, { useState, useEffect } from "react";
import {
  Film,
  Sparkles,
  Play,
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertCircle,
  Download,
  DollarSign,
  Layers,
  Volume2,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { QualityTier } from "@/config/orchestration.config";

interface MediaProductionStudioProps {
  workspaceId: string;
  contentItemId: string;
  isApproved: boolean;
  currentUserRole: string;
  onAssetGenerated?: () => void;
}

export function MediaProductionStudio({
  workspaceId,
  contentItemId,
  isApproved,
  currentUserRole,
  onAssetGenerated,
}: MediaProductionStudioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qualityTier, setQualityTier] = useState<QualityTier>("DRAFT");
  const [usePaidProviders, setUsePaidProviders] = useState(false);
  const [confirmedPaidUse, setConfirmedPaidUse] = useState(false);

  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  const [budgetStatus, setBudgetStatus] = useState<any>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const canTrigger = ["OWNER", "ADMIN", "CREATIVE_DIRECTOR", "EDITOR"].includes(currentUserRole);

  const fetchEstimate = async () => {
    try {
      setLoadingEstimate(true);
      const res = await fetch("/api/orchestration/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          contentItemId,
          qualityTier,
          usePaidProviders,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEstimate(data.estimate);
        setBudgetStatus(data.budgetStatus);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to calculate quote." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setLoadingEstimate(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/orchestration/jobs?workspaceId=${workspaceId}&contentItemId=${contentItemId}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        const running = data.jobs.find((j: any) => j.status === "PENDING" || j.status === "PROCESSING" || j.status === "RETRYING");
        setActiveJob(running || data.jobs[0] || null);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workspaceId, contentItemId]);

  useEffect(() => {
    if (isOpen) {
      fetchEstimate();
    }
  }, [isOpen, qualityTier, usePaidProviders]);

  // Polling for active job status
  useEffect(() => {
    if (!activeJob || (activeJob.status !== "PENDING" && activeJob.status !== "PROCESSING" && activeJob.status !== "RETRYING")) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orchestration/jobs/${activeJob.id}`);
        const data = await res.json();
        if (data.job) {
          setActiveJob(data.job);
          if (data.job.status === "COMPLETED" || data.job.status === "FAILED") {
            fetchJobs();
            onAssetGenerated?.();
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  const handleStartGeneration = async () => {
    try {
      setActionLoading(true);
      setFeedback(null);

      const res = await fetch("/api/orchestration/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          contentItemId,
          qualityTier,
          usePaidProviders,
          confirmedPaidUse,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsOpen(false);
        setActiveJob(data.job);
        fetchJobs();
        setFeedback({ type: "success", msg: "Media generation job successfully enqueued!" });
      } else {
        setFeedback({ type: "error", msg: data.error || "Generation request blocked." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/orchestration/jobs/${jobId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchJobs();
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to cancel." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/orchestration/jobs/${jobId}/retry`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchJobs();
      } else {
        setFeedback({ type: "error", msg: data.error || "Retry failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const latestCompletedJob = jobs.find((j) => j.status === "COMPLETED");
  const parsedResult = latestCompletedJob?.resultData
    ? typeof latestCompletedJob.resultData === "string"
      ? JSON.parse(latestCompletedJob.resultData)
      : latestCompletedJob.resultData
    : null;

  return (
    <div className="space-y-4">
      {/* Media Studio Action Header */}
      <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground font-mono">Vertical Media Production Engine</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Assembles 9:16 MP4 vertical video with storyboard stills, synthesized voiceover, loudness normalization (-16 LUFS), and burned captions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            canTrigger ? (
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Launch Media Generation</span>
              </button>
            ) : (
              <span className="text-xs text-muted-foreground font-mono">Read-only role</span>
            )
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Requires Approved Script</span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Active Job Progress Tracker */}
      {activeJob && (activeJob.status === "PENDING" || activeJob.status === "PROCESSING" || activeJob.status === "RETRYING") && (
        <div className="p-4 rounded-xl border border-border bg-card/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-400 font-mono flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              STAGE: {activeJob.currentStage || "PROCESSING"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-mono">{activeJob.progress}%</span>
              <button
                onClick={() => handleCancelJob(activeJob.id)}
                disabled={actionLoading}
                className="text-red-400 hover:text-red-300 font-medium text-xs flex items-center gap-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
            <div
              className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(5, activeJob.progress)}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] text-muted-foreground text-center font-mono">
            <span className={activeJob.progress >= 25 ? "text-purple-400 font-semibold" : ""}>1. Stills</span>
            <span className={activeJob.progress >= 50 ? "text-purple-400 font-semibold" : ""}>2. Voiceover</span>
            <span className={activeJob.progress >= 70 ? "text-purple-400 font-semibold" : ""}>3. Animatic</span>
            <span className={activeJob.progress >= 85 ? "text-emerald-400 font-semibold" : ""}>4. FFmpeg (-16LUFS)</span>
          </div>
        </div>
      )}

      {/* Completed Video Player Preview */}
      {parsedResult && parsedResult.videoSignedUrl && (
        <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono">
              <CheckCircle className="h-4 w-4" />
              <span>Production Master Vertical 9:16 Video Ready</span>
            </div>
            <a
              href={parsedResult.videoSignedUrl}
              download="fernum_vertical_video.mp4"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download MP4</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 9:16 Video Player */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-[200px] h-[355px] bg-black rounded-lg overflow-hidden border border-border shadow-xl relative">
                <video
                  src={parsedResult.videoSignedUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={parsedResult.thumbnailSignedUrl}
                />
              </div>
            </div>

            {/* Asset Metadata & Normalized Audio */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-background/60 border border-border space-y-2">
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Resolution</span>
                  <span className="text-foreground">1080 x 1920 (9:16 Vertical)</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Loudness Standard</span>
                  <span className="text-emerald-400 font-bold">-16 LUFS (Broadcast Normalization)</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Subtitles</span>
                  <span className="text-foreground">Burned In High-Legibility Overlay</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Duration</span>
                  <span className="text-foreground">{parsedResult.durationSec || 15} seconds</span>
                </div>
              </div>

              {/* Audio Track Player */}
              {parsedResult.audioSignedUrl && (
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                    <Volume2 className="h-3 w-3" /> Normalized Narration Track:
                  </span>
                  <audio src={parsedResult.audioSignedUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generation Drawer / Pre-Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-bold text-foreground">Media Generation Pre-Flight Quote</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quality Tier Selector */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-foreground">Select Quality Tier</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setQualityTier("DRAFT")}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    qualityTier === "DRAFT"
                      ? "border-purple-500 bg-purple-950/20"
                      : "border-border bg-background/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">DRAFT</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Fast / Low Cost</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Flux Schnell (4-step stills) & Flash Voice. Ideal for client review and creative iteration.
                  </p>
                </div>

                <div
                  onClick={() => setQualityTier("FINAL")}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    qualityTier === "FINAL"
                      ? "border-purple-500 bg-purple-950/20"
                      : "border-border bg-background/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">FINAL</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Production</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    High-step visuals, multilingual nuances & full 1080x1920 broadcast assembly.
                  </p>
                </div>
              </div>
            </div>

            {/* Paid Providers Toggle & Explicit Confirmation */}
            <div className="p-3.5 rounded-lg border border-border bg-background/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground">Use Real Paid Cloud Providers</span>
                  <p className="text-[11px] text-muted-foreground">
                    Calls Fal.ai Flux Schnell and ElevenLabs Flash API keys.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={usePaidProviders}
                  onChange={(e) => {
                    setUsePaidProviders(e.target.checked);
                    if (!e.target.checked) setConfirmedPaidUse(false);
                  }}
                  className="h-4 w-4 rounded border-border text-purple-600 focus:ring-purple-500"
                />
              </div>

              {usePaidProviders && (
                <div className="pt-2 border-t border-border flex items-start gap-2 text-amber-300">
                  <input
                    type="checkbox"
                    id="paidConfirm"
                    checked={confirmedPaidUse}
                    onChange={(e) => setConfirmedPaidUse(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-border text-purple-600"
                  />
                  <label htmlFor="paidConfirm" className="text-[11px] cursor-pointer">
                    I explicitly confirm and authorize billing against configured cloud provider keys for this generation run.
                  </label>
                </div>
              )}
            </div>

            {/* Cost Estimate Preview */}
            <div className="p-3.5 rounded-lg border border-border bg-background/40 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-muted-foreground">Estimated Job Cost:</span>
                <span className="text-base font-bold text-emerald-400">
                  ${estimate ? estimate.totalEstimatedCostUsd.toFixed(4) : "0.0000"}
                </span>
              </div>

              {budgetStatus && (
                <div className="space-y-1 pt-2 border-t border-border text-[11px] font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Monthly Budget Limit:</span>
                    <span>${budgetStatus.monthlyBudgetUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Current Spend:</span>
                    <span>${budgetStatus.currentSpendUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Per-Job Cost Cap:</span>
                    <span>${budgetStatus.perJobCapUsd.toFixed(2)}</span>
                  </div>

                  {!budgetStatus.allowed && (
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30 text-red-300 text-[11px] mt-2">
                      ⚠️ {budgetStatus.reason}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartGeneration}
                disabled={
                  actionLoading ||
                  (budgetStatus && !budgetStatus.allowed) ||
                  (usePaidProviders && !confirmedPaidUse)
                }
                className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs disabled:opacity-50 transition"
              >
                {actionLoading ? "Enqueuing..." : "Confirm & Launch Pipeline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
