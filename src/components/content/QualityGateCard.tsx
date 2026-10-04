"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface QualityCheck {
  checkId: string;
  name: string;
  category: string;
  status: "PASS" | "FAIL" | "SKIPPED" | "NOT_IMPLEMENTED" | "SIMULATED (mock provider)";
  score: number | null;
  weight: number;
  isImplemented: boolean;
  severity: "BLOCKING" | "WARNING" | "INFO";
  details: string;
  metrics?: Record<string, any>;
}

export interface QualityReportData {
  id: string;
  contentItemId: string;
  assetId: string | null;
  workspaceId: string;
  status: "PASSED" | "FAILED" | "OVERRIDDEN";
  overallScore: number;
  threshold: number;
  checks: QualityCheck[];
  isOverridden: boolean;
  overrideReason?: string | null;
  overriddenAt?: string | null;
  createdAt: string;
}

interface QualityGateCardProps {
  report: QualityReportData | null;
  userRole?: string;
  workspaceId: string;
  contentItemId: string;
  assetId?: string;
  onRefresh?: () => void;
}

export function QualityGateCard({
  report,
  userRole = "VIEWER",
  workspaceId,
  contentItemId,
  assetId,
  onRefresh,
}: QualityGateCardProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(true);

  const canOverride = userRole === "OWNER" || userRole === "CREATIVE_DIRECTOR";

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/quality-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, contentItemId, assetId }),
      });
      if (res.ok && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    if (overrideReason.trim().length < 5) {
      setOverrideError("Written justification must be at least 5 characters.");
      return;
    }

    setIsOverriding(true);
    setOverrideError(null);

    try {
      const res = await fetch(`/api/quality-reports/${report.id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, reason: overrideReason.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setOverrideError(data.error || "Failed to override Quality Gate.");
      } else {
        setShowOverrideModal(false);
        setOverrideReason("");
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      setOverrideError(err.message || "Network error during override.");
    } finally {
      setIsOverriding(false);
    }
  };

  if (!report) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Quality Gate v1 Verification</h4>
              <p className="text-xs text-slate-400">Automated multi-modal compliance, audio, and creator consistency checks</p>
            </div>
          </div>
          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? "animate-spin" : ""}`} />
            {isEvaluating ? "Evaluating..." : "Run Quality Gate"}
          </button>
        </div>
      </div>
    );
  }

  const activeChecks = (report.checks || []).filter((c) => c.status !== "NOT_IMPLEMENTED");
  const notImplementedChecks = (report.checks || []).filter((c) => c.status === "NOT_IMPLEMENTED");

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-2.5 ${
              report.status === "PASSED"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : report.status === "OVERRIDDEN"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
            }`}
          >
            {report.status === "PASSED" ? (
              <ShieldCheck className="h-6 w-6" />
            ) : report.status === "OVERRIDDEN" ? (
              <Unlock className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-slate-100">Quality Gate v1</h4>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  report.status === "PASSED"
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : report.status === "OVERRIDDEN"
                    ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                    : "bg-rose-950/80 text-rose-300 border border-rose-800"
                }`}
              >
                {report.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Workspace Threshold:{" "}
              <span className="font-mono text-slate-300">{Number(report.threshold || 80).toFixed(0)}%</span> • Overall
              Score:{" "}
              <span
                className={`font-mono font-bold ${
                  report.overallScore >= report.threshold ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {report.overallScore.toFixed(1)}/100
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {report.status === "FAILED" && (
            <button
              onClick={() => setShowOverrideModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
            >
              <Unlock className="h-3.5 w-3.5" />
              Override Gate
            </button>
          )}

          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? "animate-spin" : ""}`} />
            Re-evaluate
          </button>

          <button
            onClick={() => setExpandedDetails(!expandedDetails)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-slate-300 transition hover:bg-slate-700"
          >
            {expandedDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Override Notice if present */}
      {report.isOverridden && (
        <div className="mt-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <Unlock className="h-4 w-4 text-amber-400" />
            Quality Gate Overridden by Authorized Director / Owner
          </div>
          <p className="mt-1 text-slate-300">
            <span className="text-amber-300 font-medium">Justification:</span> &ldquo;{report.overrideReason}&rdquo;
          </p>
        </div>
      )}

      {/* Expanded Checks Breakdown */}
      {expandedDetails && (
        <div className="mt-4 space-y-4">
          {/* Active Evaluated Checks */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Verified Multi-Modal Checks ({activeChecks.length})
              </span>
              <span className="text-[11px] text-slate-500">Mocks labeled SIMULATED & excluded from score</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {activeChecks.map((check) => (
                <div
                  key={check.checkId}
                  className={`rounded-lg border p-3 transition ${
                    check.status === "PASS"
                      ? "border-emerald-900/60 bg-emerald-950/20"
                      : check.status === "SIMULATED (mock provider)"
                      ? "border-amber-900/60 bg-amber-950/20"
                      : check.status === "SKIPPED"
                      ? "border-slate-800 bg-slate-950/30"
                      : "border-rose-900/60 bg-rose-950/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {check.status === "PASS" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : check.status === "SIMULATED (mock provider)" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                      ) : check.status === "SKIPPED" ? (
                        <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                      <span className="text-xs font-medium text-slate-200">{check.name}</span>
                    </div>
                    {check.status === "SIMULATED (mock provider)" ? (
                      <span className="rounded bg-amber-950 border border-amber-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        SIMULATED (mock provider)
                      </span>
                    ) : check.score !== null ? (
                      <span
                        className={`font-mono text-xs font-bold ${
                          check.score >= 80 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {check.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">N/A</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{check.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unimplemented / Future Checks */}
          {notImplementedChecks.length > 0 && (
            <div className="border-t border-slate-800/80 pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Scheduled Future Checks (Not Active)
                </span>
                <span className="text-[11px] text-slate-500">Zero effect on score</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {notImplementedChecks.map((check) => (
                  <div
                    key={check.checkId}
                    className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5 opacity-60"
                  >
                    <span className="text-xs text-slate-400">{check.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      NOT IMPLEMENTED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Override Dialog Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                <Unlock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">Override Quality Gate</h3>
                <p className="text-xs text-slate-400">Requires OWNER or CREATIVE_DIRECTOR authorization</p>
              </div>
            </div>

            {!canOverride ? (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="h-4 w-4" /> Permission Denied
                </div>
                Your current role (<span className="font-mono">{userRole}</span>) cannot override quality gates. Please
                contact an Owner or Creative Director.
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowOverrideModal(false)}
                    className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOverrideSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Written Override Justification <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Provide explicit business rationale (e.g., Client approved experimental pacing for product launch)..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    This reason will be permanently recorded in the immutable compliance Audit Trail.
                  </p>
                </div>

                {overrideError && (
                  <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-400">
                    {overrideError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOverrideModal(false)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isOverriding || overrideReason.trim().length < 5}
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                  >
                    {isOverriding ? "Recording Override..." : "Confirm & Log Override"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
