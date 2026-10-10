"use client";

import React, { useState, useEffect } from "react";
import { Heart, X, Copy, Check, Sparkles, RotateCcw, ArrowDownRight } from "lucide-react";

interface HookCard {
  id: string;
  category: string;
  hook: string;
  angle: string;
}

const SAMPLE_HOOKS_DECK: HookCard[] = [
  {
    id: "h-1",
    category: "Coffee & Energy",
    hook: "Stop scrolling if your cold brew leaves you jittery and crashing by 2 PM.",
    angle: "Problem Agitation // Energy Stability",
  },
  {
    id: "h-2",
    category: "Skincare",
    hook: "The 1 active ingredient dermatologists actually check for before recommending a serum.",
    angle: "Contrarian Truth // Ingredient Spotlight",
  },
  {
    id: "h-3",
    category: "E-Commerce Strategy",
    hook: "Your ads don't need a bigger budget. They need a hook in the first 2.5 seconds.",
    angle: "Pattern Interrupt // Retention Rule",
  },
  {
    id: "h-4",
    category: "Workplace / Ergonomics",
    hook: "Your lower back isn't getting older. Your desk chair is just actively ruining your posture.",
    angle: "Before/After Shock // Spine Angle",
  },
  {
    id: "h-5",
    category: "Sleep & Wellness",
    hook: "POV: You finally stopped doomscrolling at midnight and took these magnesium gummies.",
    angle: "Relatable POV // Night Routine",
  },
  {
    id: "h-6",
    category: "Pet Nutrition",
    hook: "Why brushing your dog's teeth feels like a wrestling match (and the 10-second fix).",
    angle: "The 10-Second Hack // Friction Removal",
  },
];

export function HookSwipeStack() {
  const [deck, setDeck] = useState<HookCard[]>(SAMPLE_HOOKS_DECK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedHooks, setSavedHooks] = useState<HookCard[]>([]);
  const [copied, setCopied] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const currentCard = deck[currentIndex];
  const isFinished = currentIndex >= deck.length;

  const handleKeep = () => {
    if (!currentCard) return;
    setSwipeDirection("right");
    setTimeout(() => {
      setSavedHooks((prev) => [...prev, currentCard]);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleSkip = () => {
    if (!currentCard) return;
    setSwipeDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleKeep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleCopyAll = () => {
    if (savedHooks.length === 0) return;
    const text = savedHooks.map((h, i) => `${i + 1}. [${h.category}] "${h.hook}" (${h.angle})`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToBrief = () => {
    const hooksText = savedHooks.map((h) => `• [${h.category}] "${h.hook}"`).join("\n");
    window.dispatchEvent(
      new CustomEvent("fernum-prefill-brief", {
        detail: {
          brandName: "My Hook Campaign",
          productToAdvertise: savedHooks[0]?.category || "Featured Product",
          offer: `Selected Hooks from Hook Swipe:\n${hooksText}`,
        },
      })
    );

    const briefEl = document.getElementById("brief");
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipeDirection(null);
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-4 border-[var(--border)] shadow-brutal-xl"
      role="region"
      aria-label="Hook Swipe Card Stack"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-[var(--border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            <span>Creative Swipe Deck</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
            HOOK SWIPE // CURATE YOUR ANGLE
          </h3>
          <p className="text-xs sm:text-sm font-medium opacity-75 mt-1">
            Swipe Right (or click Keep) to collect hooks. Swipe Left to pass.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)]">
            Saved: {savedHooks.length}
          </span>
          {isFinished && (
            <button
              type="button"
              onClick={handleReset}
              className="btn-squish inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Deck</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: The Card Stack */}
        <div className="relative min-h-[340px] flex flex-col justify-between">
          {!isFinished ? (
            <div
              className={`p-6 sm:p-8 bg-[var(--page-bg)] text-[var(--page-fg)] border-4 border-[var(--border)] shadow-brutal-xl relative transition-transform duration-200 ${
                swipeDirection === "right"
                  ? "translate-x-12 rotate-6 opacity-0"
                  : swipeDirection === "left"
                  ? "-translate-x-12 -rotate-6 opacity-0"
                  : "translate-x-0 rotate-0"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border border-[var(--border)]">
                  {currentCard.category}
                </span>
                <span className="text-xs font-mono opacity-50">
                  {currentIndex + 1} / {deck.length}
                </span>
              </div>

              <div className="my-6">
                <p className="font-display font-black text-lg sm:text-xl uppercase leading-snug">
                  "{currentCard.hook}"
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]/20 text-xs font-mono opacity-70">
                Formula: {currentCard.angle}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[var(--page-bg)] text-[var(--page-fg)] border-4 border-[var(--border)] shadow-brutal text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center mx-auto shadow-brutal">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-display font-black text-xl uppercase tracking-tight">
                Deck Completed!
              </h4>
              <p className="text-xs font-mono opacity-80">
                You saved {savedHooks.length} tested creative angles to your tray.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="btn-squish px-4 py-2 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] font-mono font-bold text-xs uppercase border-2 border-[var(--border)] shadow-brutal cursor-pointer"
              >
                Review Deck Again
              </button>
            </div>
          )}

          {/* Swipe Buttons Row */}
          {!isFinished && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleSkip}
                aria-label="Skip hook"
                className="btn-squish w-14 h-14 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 border-2 border-[var(--border)] shadow-brutal flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleKeep}
                aria-label="Keep hook"
                className="btn-squish w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 border-2 border-[var(--border)] shadow-brutal flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              >
                <Heart className="w-6 h-6 fill-white" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: "My Hooks" Tray */}
        <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-5 sm:p-6 shadow-brutal text-[var(--page-fg)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)]/30 pb-3">
            <div className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>MY SAVED HOOKS ({savedHooks.length})</span>
            </div>

            {savedHooks.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border border-[var(--border)] text-xs font-mono font-bold uppercase cursor-pointer hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy All"}</span>
              </button>
            )}
          </div>

          {savedHooks.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono opacity-60">
              No hooks saved yet. Swipe right or click ❤️ on the cards to save your favorite angles.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {savedHooks.map((h, idx) => (
                <div
                  key={h.id + idx}
                  className="p-3 bg-[var(--block-2-bg)] border border-[var(--border)] text-xs text-[var(--block-2-fg)] space-y-1"
                >
                  <span className="font-mono text-[10px] font-bold text-[var(--accent)] uppercase">
                    #{idx + 1} {h.category}
                  </span>
                  <p className="font-bold leading-tight">"{h.hook}"</p>
                </div>
              ))}
            </div>
          )}

          {savedHooks.length > 0 && (
            <div className="pt-2 border-t border-[var(--border)]/20">
              <button
                type="button"
                onClick={handleSendToBrief}
                className="btn-squish w-full py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--block-4-bg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Use Saved Hooks in Brief</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
