"use client";

import React, { useState } from "react";
import { ArrowDownRight, RefreshCw } from "lucide-react";

interface ReelItem {
  id: string;
  label: string;
}

const PRODUCTS: ReelItem[] = [
  { id: "skincare", label: "Glow Serum" },
  { id: "coffee", label: "Cold Brew Coffee" },
  { id: "energy", label: "Zero-Sugar Energy" },
  { id: "ergonomic", label: "Ergonomic Chair" },
  { id: "gummies", label: "Sleep Gummies" },
  { id: "shoes", label: "Running Shoes" },
  { id: "pet", label: "Pet Dental Chews" },
  { id: "water", label: "Insulated Flask" },
];

const AUDIENCES: ReelItem[] = [
  { id: "founders", label: "Tired Founders" },
  { id: "gym", label: "Gym Rats" },
  { id: "desk", label: "Desk Jockeys" },
  { id: "students", label: "College Students" },
  { id: "dogmoms", label: "Anxious Dog Moms" },
  { id: "creatives", label: "Night Shift Creatives" },
  { id: "runners", label: "Marathon Runners" },
  { id: "parents", label: "Busy Parents" },
];

const HOOK_STYLES: ReelItem[] = [
  { id: "contrarian", label: "Contrarian Truth" },
  { id: "agitation", label: "Problem Agitation" },
  { id: "pattern", label: "Pattern Interrupt" },
  { id: "hack", label: "The 1-Minute Hack" },
  { id: "shock", label: "Before/After Shock" },
  { id: "pov", label: "Relatable POV" },
];

const SAMPLE_HOOKS: Record<string, string> = {
  "skincare-founders-contrarian": "Stop layering 7 serums at midnight. Here is the single ingredient tired founders actually need.",
  "coffee-founders-agitation": "If you crash at 2 PM every single day, you are drinking coffee completely wrong.",
  "energy-gym-pattern": "Wait—do not touch that neon pre-workout can until you look at the crash curve.",
  "ergonomic-desk-shock": "Your lower back isn't aging, your chair is just silently destroying your posture.",
  "gummies-creatives-hack": "The 1-step nighttime routine creative directors swear by to turn off racing thoughts.",
  "shoes-runners-pov": "POV: You finally switched to zero-drop foam and your shin splints disappeared in 48 hours.",
  "pet-dogmoms-contrarian": "Why brushing your dog's teeth is a daily battle, and the no-stress chew that fixes it.",
  "water-parents-agitation": "Your ice water shouldn't turn lukewarm before your morning school run is even finished.",
};

function generateHook(product: ReelItem, audience: ReelItem, style: ReelItem): string {
  const key = `${product.id}-${audience.id}-${style.id}`;
  if (SAMPLE_HOOKS[key]) return SAMPLE_HOOKS[key];

  switch (style.id) {
    case "contrarian":
      return `Stop using standard solutions for ${product.label.toLowerCase()}. Here's why ${audience.label.toLowerCase()} are making the switch.`;
    case "agitation":
      return `The thing nobody tells ${audience.label.toLowerCase()} before buying a generic ${product.label.toLowerCase()}.`;
    case "pattern":
      return `Stop scrolling if you're a ${audience.label.toLowerCase().slice(0, -1)} still dealing with low-retention ${product.label.toLowerCase()}.`;
    case "hack":
      return `The 30-second ${product.label.toLowerCase()} hack saving ${audience.label.toLowerCase()} hours every week.`;
    case "shock":
      return `What happens when ${audience.label.toLowerCase()} replace their daily routine with this ${product.label.toLowerCase()}.`;
    case "pov":
    default:
      return `POV: You found the only ${product.label.toLowerCase()} built specifically for ${audience.label.toLowerCase()}.`;
  }
}

export function HookRoulette() {
  const [productIdx, setProductIdx] = useState(1);
  const [audienceIdx, setAudienceIdx] = useState(0);
  const [styleIdx, setStyleIdx] = useState(0);

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [leverPulled, setLeverPulled] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setLeverPulled(true);
    setTimeout(() => setLeverPulled(false), 300);

    let ticks = 0;
    const maxTicks = 18;

    const interval = setInterval(() => {
      ticks++;
      setProductIdx((prev) => (prev + 1) % PRODUCTS.length);
      setAudienceIdx((prev) => (prev + 1) % AUDIENCES.length);
      setStyleIdx((prev) => (prev + 1) % HOOK_STYLES.length);

      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalP = Math.floor(Math.random() * PRODUCTS.length);
        const finalA = Math.floor(Math.random() * AUDIENCES.length);
        const finalS = Math.floor(Math.random() * HOOK_STYLES.length);

        setProductIdx(finalP);
        setAudienceIdx(finalA);
        setStyleIdx(finalS);
        setIsSpinning(false);

        const newCount = spinCount + 1;
        setSpinCount(newCount);

        const currentHook = generateHook(PRODUCTS[finalP], AUDIENCES[finalA], HOOK_STYLES[finalS]);
        setAnnouncement(
          `Landed on: ${PRODUCTS[finalP].label}, for ${AUDIENCES[finalA].label}, style ${HOOK_STYLES[finalS].label}. Generated Hook: ${currentHook}`
        );
      }
    }, 80);
  };

  const currentProduct = PRODUCTS[productIdx];
  const currentAudience = AUDIENCES[audienceIdx];
  const currentStyle = HOOK_STYLES[styleIdx];
  const activeHookLine = generateHook(currentProduct, currentAudience, currentStyle);

  const handleGetThisAd = () => {
    window.dispatchEvent(
      new CustomEvent("fernum-prefill-brief", {
        detail: {
          brandName: `${currentProduct.label} Studio`,
          productToAdvertise: currentProduct.label,
          offer: `Target Audience: ${currentAudience.label} • Angle: ${currentStyle.label}\nHook Angle: "${activeHookLine}"`,
        },
      })
    );

    const briefSection = document.getElementById("brief");
    if (briefSection) {
      briefSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-4 border-[var(--border)] shadow-brutal-xl relative overflow-hidden"
      role="region"
      aria-label="Hook Roulette Interactive Slot Machine"
    >
      {/* Screen reader live announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-[var(--border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            <span>Interactive Studio Tool</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
            HOOK ROULETTE // GENERATOR
          </h3>
        </div>

        <div className="font-mono text-xs font-bold uppercase px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal-sm">
          <span>Spins: {spinCount}</span>
        </div>
      </div>

      {/* Slot Machine Display (Text-Only, brutalist cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Reel 1: Product */}
        <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-4 shadow-brutal text-center">
          <span className="text-[10px] font-mono font-bold uppercase opacity-60 tracking-wider block mb-2">
            REEL 1: PRODUCT
          </span>
          <div
            className={`py-4 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] inline-block mb-2">
              CAT 01
            </span>
            <div className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
              {currentProduct.label}
            </div>
          </div>
        </div>

        {/* Reel 2: Audience */}
        <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-4 shadow-brutal text-center">
          <span className="text-[10px] font-mono font-bold uppercase opacity-60 tracking-wider block mb-2">
            REEL 2: TARGET AUDIENCE
          </span>
          <div
            className={`py-4 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] inline-block mb-2">
              AUD 02
            </span>
            <div className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
              {currentAudience.label}
            </div>
          </div>
        </div>

        {/* Reel 3: Hook Style */}
        <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-4 shadow-brutal text-center">
          <span className="text-[10px] font-mono font-bold uppercase opacity-60 tracking-wider block mb-2">
            REEL 3: HOOK FORMULA
          </span>
          <div
            className={`py-4 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] inline-block mb-2">
              STYLE 03
            </span>
            <div className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
              {currentStyle.label}
            </div>
          </div>
        </div>
      </div>

      {/* Lever & Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          aria-label="Spin Hook Roulette reels"
          className={`btn-squish w-full sm:w-auto px-8 py-3.5 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-sm sm:text-base uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-3 cursor-pointer ${
            isSpinning ? "opacity-75 cursor-not-allowed" : ""
          } ${leverPulled ? "scale-95" : ""}`}
        >
          <RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "Spinning Reels…" : "SPIN THE REELS"}</span>
        </button>
      </div>

      {/* Generated Hook Output Box */}
      <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-5 sm:p-6 shadow-brutal text-[var(--page-fg)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase text-[var(--accent)]">
            RESULTING FIRST 3-SECOND SCRIPT HOOK:
          </span>
          <span className="text-[10px] font-mono opacity-50 uppercase">Sample pattern</span>
        </div>

        <p className="font-display font-black text-base sm:text-lg text-[var(--page-fg)] leading-snug mb-4">
          "{activeHookLine}"
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]/30 text-xs">
          <span className="font-mono text-[11px] opacity-70">
            Sample hook only. Only use claims that are true for your product.
          </span>
          <button
            type="button"
            onClick={handleGetThisAd}
            className="btn-squish inline-flex items-center gap-2 px-4 py-2 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal cursor-pointer transition-colors"
          >
            <span>Get This Ad in Brief</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
