"use client";

import React, { useState } from "react";
import { Sparkles, Trophy, ArrowRight, Zap, CheckCircle2, Flame, Smile, Briefcase } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type VibeType = "funny" | "serious" | "hype";

interface HookTemplate {
  angle: string;
  template: (prod: string) => string;
}

const TEMPLATES: Record<VibeType, HookTemplate[]> = {
  funny: [
    {
      angle: "Shock Contrast",
      template: (p) => `If your ${p} tastes like wet chalk, please stop drinking it immediately.`,
    },
    {
      angle: "Relatable Confession",
      template: (p) => `I tested multiple ${p} brands this month so your wallet doesn't have to suffer.`,
    },
    {
      angle: "Dramatic Boundary",
      template: (p) => `A friend told me this ${p} was overrated. We don't speak anymore.`,
    },
  ],
  serious: [
    {
      angle: "Direct Pain Callout",
      template: (p) => `The common reason most ${p}s stop delivering visible results after week two.`,
    },
    {
      angle: "Ingredient Inspection",
      template: (p) => `Stop buying ${p} until you check line four on the ingredients label.`,
    },
    {
      angle: "Routine Reality Check",
      template: (p) => `Before you overhaul your routine, test this simple adjustment with your ${p}.`,
    },
  ],
  hype: [
    {
      angle: "Insider Insight",
      template: (p) => `${p}: the thing nobody tells you before you buy.`,
    },
    {
      angle: "Curiosity Warning",
      template: (p) => `Do not order this ${p} until you see how it actually works.`,
    },
    {
      angle: "Formula Breakdown",
      template: (p) => `The breakdown behind this ${p} that everyone is talking about.`,
    },
  ],
};

export function HookBattle() {
  const [productName, setProductName] = useState("Cold Brew Micro-Can");
  const [vibe, setVibe] = useState<VibeType>("hype");
  const [votedHook, setVotedHook] = useState<number | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const getCleanProduct = () => productName.trim() || "Product";

  const hooks = TEMPLATES[vibe].map((t, idx) => ({
    id: idx + 1,
    angle: t.angle,
    text: t.template(getCleanProduct()),
  }));

  const handleVote = (hookId: number) => {
    setVotedHook(hookId);
    trackEvent("Hook Battle Voted", {
      hookId,
      vibe,
      product: getCleanProduct(),
    });

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2400);
    }
  };

  const handleGetFullAd = (hookText: string) => {
    trackEvent("Hook Battle Convert", {
      product: getCleanProduct(),
      hook: hookText,
    });

    if (typeof window !== "undefined") {
      const event = new CustomEvent("fernum-prefill-brief", {
        detail: {
          product: getCleanProduct(),
          hook: hookText,
        },
      });
      window.dispatchEvent(event);

      const briefEl = document.getElementById("brief");
      if (briefEl) {
        briefEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="hook-battle" className="py-24 sm:py-32 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative overflow-hidden">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      {/* Confetti Burst Overlay */}
      {confettiActive && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              style={{
                left: `${(i * 3) % 100}%`,
                top: `${(i * 5) % 60}%`,
                backgroundColor: ["var(--accent)", "var(--sticker-1)", "var(--sticker-2)", "var(--sticker-3)", "var(--block-4-bg)"][i % 5],
                animation: `confettiDrop 1.8s ease-out forwards`,
                transform: `rotate(${i * 24}deg)`,
              }}
              className="absolute w-3 h-3 border border-[var(--border)]"
            />
          ))}
          <style jsx>{`
            @keyframes confettiDrop {
              0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
              100% { transform: translateY(350px) scale(0.4) rotate(420deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Interactive Mini Tool</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.93] mb-4">
            HOOK BATTLE
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal">
            Type what you sell, pick a tone, and review 3 sample opening hooks for a 15-second ad.
          </p>
        </div>

        {/* The Generator Widget Shell */}
        <div className="bg-[var(--block-2-bg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal-xl text-[var(--block-2-fg)]">
          {/* Controls: Input Product + Pick Vibe */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b-2 border-[var(--border)]/15">
            {/* Step 1: Product Input */}
            <div className="md:col-span-7 space-y-2">
              <label htmlFor="product-hook-input" className="block text-xs font-mono font-bold uppercase text-[var(--block-2-fg)]">
                1. What do you sell?
              </label>
              <input
                id="product-hook-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Barrier Recovery Ceramide Serum"
                className="w-full h-13 px-4 bg-[var(--page-bg)] border-2 border-[var(--border)] text-sm sm:text-base font-bold text-[var(--page-fg)] placeholder:text-[var(--page-fg)]/40 focus:outline-none focus:bg-[var(--block-2-bg)] focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Step 2: Vibe Selector */}
            <div className="md:col-span-5 space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-[var(--block-2-fg)]">
                2. Select Hook Angle Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["funny", "serious", "hype"] as VibeType[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setVibe(v);
                      setVotedHook(null);
                    }}
                    className={`h-13 border-2 border-[var(--border)] font-display font-black text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
                      vibe === v
                        ? "bg-[var(--block-4-bg)] text-[var(--block-4-fg)] shadow-brutal"
                        : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--border)]/10"
                    }`}
                  >
                    <span>{v}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Generated 3 Hooks Cards */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase opacity-75">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span>3 Alternate Opening Hooks (Sample Preview):</span>
              </div>
              <span className="text-[11px] font-mono opacity-60">
                Generated in browser • Zero API delay
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {hooks.map((h) => {
                const isSelected = votedHook === h.id;

                return (
                  <div
                    key={h.id}
                    data-cursor="vote"
                    onClick={() => handleVote(h.id)}
                    className={`p-6 border-2 border-[var(--border)] transition-all cursor-pointer relative flex flex-col justify-between group ${
                      isSelected
                        ? "bg-[var(--block-3-bg)] text-[var(--block-3-fg)] shadow-brutal-xl -translate-y-1.5"
                        : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--block-2-bg)] shadow-brutal hover:shadow-brutal-lg"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]/20">
                        <span className="text-[11px] font-mono font-bold uppercase">
                          Hook #{h.id} • {h.angle}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase">
                            ✓ SELECTED
                          </span>
                        )}
                      </div>

                      <p className="font-display font-black text-base sm:text-lg leading-snug tracking-tight mb-4">
                        "{h.text}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)]/10 flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className={isSelected ? "text-current" : "text-[var(--accent)]"}>
                        {isSelected ? "✓ Selected Hook" : "Tap to select →"}
                      </span>
                      <span className="opacity-60">0:00 - 0:03</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer under results */}
            <p className="mt-4 text-xs font-mono text-[var(--block-2-fg)]/75 text-center">
              Sample hooks only. Only use claims that are true for your product.
            </p>
          </div>

          {/* Action Bar */}
          {votedHook !== null && (
            <div className="mt-8 p-6 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase flex items-center gap-1.5 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hook {votedHook} selected.</span>
                </div>
                <div className="text-sm font-medium opacity-90">
                  Ready to turn this hook into a finished Full HD ad?
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleGetFullAd(hooks[votedHook - 1].text)}
                className="h-12 px-6 bg-[var(--accent)] hover:bg-[var(--block-2-bg)] text-[var(--accent-fg)] hover:text-[var(--block-2-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 shrink-0"
              >
                <span>Get the full ad →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
