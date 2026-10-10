"use client";

import React, { useState } from "react";
import { Clock, Play, ArrowDownRight, AlertTriangle, CheckCircle2, RotateCcw, Plus, Minus, MoveLeft, MoveRight } from "lucide-react";

interface AdBlock {
  id: string;
  type: "hook" | "problem" | "proof" | "offer" | "cta";
  label: string;
  duration: number; // in seconds
  colorBg: string;
  colorFg: string;
  description: string;
}

const INITIAL_BLOCKS: AdBlock[] = [
  {
    id: "b-1",
    type: "hook",
    label: "0:03 HOOK",
    duration: 2.5,
    colorBg: "var(--accent)",
    colorFg: "var(--accent-fg)",
    description: "Visual pattern interrupt or bold contrarian statement",
  },
  {
    id: "b-2",
    type: "problem",
    label: "PROBLEM / AGITATION",
    duration: 3.5,
    colorBg: "var(--block-4-bg)",
    colorFg: "var(--block-4-fg)",
    description: "Pinpoint customer pain and friction",
  },
  {
    id: "b-3",
    type: "proof",
    label: "PROOF / DEMO",
    duration: 4.0,
    colorBg: "var(--sticker-1)",
    colorFg: "#000000",
    description: "Macro texture, creator demo, or transformation clip",
  },
  {
    id: "b-4",
    type: "offer",
    label: "CORE OFFER",
    duration: 3.0,
    colorBg: "var(--sticker-2)",
    colorFg: "#ffffff",
    description: "Specific bundle, discount, or direct guarantee",
  },
  {
    id: "b-5",
    type: "cta",
    label: "FINAL CTA",
    duration: 2.0,
    colorBg: "var(--block-2-bg)",
    colorFg: "var(--block-2-fg)",
    description: "Clear button prompt: Tap Shop Now or Link in Bio",
  },
];

export function BuildAnAdGame() {
  const [blocks, setBlocks] = useState<AdBlock[]>(INITIAL_BLOCKS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const totalDuration = blocks.reduce((acc, b) => acc + b.duration, 0);
  const hookBlock = blocks.find((b) => b.type === "hook");
  const isHookFirst = blocks[0]?.type === "hook";
  const isHookTooLong = (hookBlock?.duration || 0) > 3.0;
  const hasCtaAtEnd = blocks[blocks.length - 1]?.type === "cta";

  // Calculate structure score (0 - 100 based on narrative framework rules)
  let score = 100;
  const feedbackNotes: string[] = [];

  if (!isHookFirst) {
    score -= 30;
    feedbackNotes.push("Hook is not the first block; viewers may scroll before the hook lands.");
  }
  if (isHookTooLong) {
    score -= 20;
    feedbackNotes.push("Hook runs longer than 3.0 seconds; optimal hook window is 2.0 - 2.8s.");
  }
  if (totalDuration > 15.5) {
    score -= 15;
    feedbackNotes.push(`Total duration is ${totalDuration.toFixed(1)}s (exceeds the 15-second cap).`);
  } else if (totalDuration < 12.0) {
    score -= 10;
    feedbackNotes.push(`Total duration is only ${totalDuration.toFixed(1)}s; leaves unused airtime.`);
  }
  if (!hasCtaAtEnd) {
    score -= 15;
    feedbackNotes.push("CTA is not placed at the end of the video.");
  }

  score = Math.max(20, Math.min(100, score));

  // Accessible reordering handlers
  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setBlocks(updated);
  };

  const adjustDuration = (index: number, delta: number) => {
    const updated = [...blocks];
    const newDur = Math.max(1.0, Math.min(8.0, Number((updated[index].duration + delta).toFixed(1))));
    updated[index].duration = newDur;
    setBlocks(updated);
  };

  const handleReset = () => {
    setBlocks(INITIAL_BLOCKS);
  };

  const handleSendToBrief = () => {
    const storyboardSummary = blocks
      .map((b, idx) => `${idx + 1}. [${b.duration.toFixed(1)}s] ${b.label}: ${b.description}`)
      .join("\n");

    window.dispatchEvent(
      new CustomEvent("fernum-prefill-brief", {
        detail: {
          brandName: "My Custom Ad Campaign",
          productToAdvertise: "Custom 15-Second Video Flow",
          offer: `15-Second Timeline Storyboard Structure (Score: ${score}/100):\n${storyboardSummary}`,
        },
      })
    );

    const briefEl = document.getElementById("brief");
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-4 border-[var(--border)] shadow-brutal-xl"
      role="region"
      aria-label="Build An Ad 15-Second Storyboard Tool"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-[var(--border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            <span>Structure Sandbox</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
            BUILD-AN-AD // 15-SECOND STORYBOARD
          </h3>
          <p className="text-xs sm:text-sm font-medium opacity-75 mt-1">
            Arrange and time your video narrative blocks. Test pacing against our 3-second hook rule.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn-squish inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--page-bg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase shadow-brutal-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Layout</span>
        </button>
      </div>

      {/* Visual Timeline Bar (15s total capacity) */}
      <div className="mb-6 bg-[var(--page-bg)] border-2 border-[var(--border)] p-4 shadow-brutal text-[var(--page-fg)]">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase mb-2">
          <span>TIMELINE PROGRESS: {totalDuration.toFixed(1)}s / 15.0s</span>
          <span className={totalDuration > 15.0 ? "text-red-500 font-black" : "opacity-70"}>
            {totalDuration > 15.0 ? "⚠️ Exceeds 15s Target" : "Within Pacing Limit"}
          </span>
        </div>

        {/* Proportional Segmented Bar */}
        <div className="w-full h-8 bg-zinc-800 border-2 border-[var(--border)] flex overflow-hidden rounded-none">
          {blocks.map((block, idx) => {
            const widthPct = (block.duration / totalDuration) * 100;
            return (
              <div
                key={block.id}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: block.colorBg,
                  color: block.colorFg,
                }}
                className="h-full border-r border-black/30 flex items-center justify-center text-[10px] font-mono font-black uppercase overflow-hidden px-1 whitespace-nowrap select-none transition-all duration-150"
                title={`${block.label}: ${block.duration}s`}
              >
                <span className="truncate">{block.label.split(" ")[0]} ({block.duration}s)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reorderable Blocks List */}
      <div className="space-y-3 mb-6" role="list" aria-label="Storyboard blocks list">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            role="listitem"
            className="p-3.5 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[var(--page-fg)]"
          >
            {/* Left Tag & Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-mono text-xs font-black px-2 py-0.5 border border-[var(--border)] bg-[var(--block-4-bg)] text-[var(--block-4-fg)] shrink-0">
                #{index + 1}
              </span>
              <div
                style={{ backgroundColor: block.colorBg, color: block.colorFg }}
                className="px-2.5 py-1 text-xs font-mono font-black uppercase border border-black/30 shrink-0"
              >
                {block.label}
              </div>
              <p className="text-xs font-medium opacity-80 truncate hidden md:block">
                {block.description}
              </p>
            </div>

            {/* Stepper Duration & Reorder Buttons (Accessible non-drag alternative) */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {/* Duration Stepper */}
              <div className="flex items-center border border-[var(--border)] bg-[var(--block-2-bg)] text-[var(--block-2-fg)] px-1">
                <button
                  type="button"
                  onClick={() => adjustDuration(index, -0.5)}
                  aria-label={`Decrease duration of ${block.label}`}
                  className="p-1 hover:text-[var(--accent)] font-mono font-bold cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold px-2">{block.duration.toFixed(1)}s</span>
                <button
                  type="button"
                  onClick={() => adjustDuration(index, 0.5)}
                  aria-label={`Increase duration of ${block.label}`}
                  className="p-1 hover:text-[var(--accent)] font-mono font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Order buttons */}
              <button
                type="button"
                onClick={() => moveBlock(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${block.label} up`}
                className="p-1.5 border border-[var(--border)] bg-[var(--page-bg)] hover:bg-[var(--border)]/10 disabled:opacity-30 cursor-pointer"
              >
                <MoveLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, index + 1)}
                disabled={index === blocks.length - 1}
                aria-label={`Move ${block.label} down`}
                className="p-1.5 border border-[var(--border)] bg-[var(--page-bg)] hover:bg-[var(--border)]/10 disabled:opacity-30 cursor-pointer"
              >
                <MoveRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Structural Feedback & Evaluation Score */}
      <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-5 shadow-brutal mb-6 text-[var(--page-fg)] space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)]/30 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase opacity-60 block">EVALUATION METRIC</span>
            <div className="font-display font-black text-2xl uppercase tracking-tight flex items-center gap-2">
              <span>NARRATIVE FLOW SCORE:</span>
              <span className={score >= 85 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-red-500"}>
                {score} / 100
              </span>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono opacity-70">
            Structure rule check only. No guarantees or claims.
          </div>
        </div>

        {feedbackNotes.length > 0 ? (
          <div className="space-y-1.5">
            {feedbackNotes.map((note, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-amber-500">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Optimal 15s structure: Hook is under 3.0s, proof leads the middle, and offer transitions into a clear CTA.</span>
          </div>
        )}
      </div>

      {/* Action to Brief Form */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-mono opacity-70 text-center sm:text-left">
          Ready to turn this timeline into 3 produced script variations?
        </span>
        <button
          type="button"
          onClick={handleSendToBrief}
          className="btn-squish w-full sm:w-auto px-6 py-3 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Send Storyboard to Brief Form</span>
          <ArrowDownRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
