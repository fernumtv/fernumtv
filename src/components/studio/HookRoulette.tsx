"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Dices, ArrowDownRight, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { isCalmModeActive } from "@/lib/interactive/calmMode";

interface ReelItem {
  id: string;
  label: string;
  icon: string;
}

const PRODUCTS: ReelItem[] = [
  { id: "skincare", label: "Glow Serum", icon: "✨" },
  { id: "coffee", label: "Cold Brew Coffee", icon: "☕" },
  { id: "energy", label: "Zero-Sugar Energy", icon: "⚡" },
  { id: "ergonomic", label: "Ergonomic Chair", icon: "💺" },
  { id: "gummies", label: "Sleep Gummies", icon: "🌙" },
  { id: "shoes", label: "Running Shoes", icon: "👟" },
  { id: "pet", label: "Pet Dental Chews", icon: "🐶" },
  { id: "water", label: "Insulated Flask", icon: "💧" },
];

const AUDIENCES: ReelItem[] = [
  { id: "founders", label: "Tired Founders", icon: "💼" },
  { id: "gym", label: "Gym Rats", icon: "🏋️" },
  { id: "desk", label: "Desk Jockeys", icon: "💻" },
  { id: "students", label: "College Students", icon: "📚" },
  { id: "dogmoms", label: "Anxious Dog Moms", icon: "🐕" },
  { id: "creatives", label: "Night Shift Creatives", icon: "🎨" },
  { id: "runners", label: "Marathon Runners", icon: "🏃" },
  { id: "parents", label: "Busy Parents", icon: "👶" },
];

const HOOK_STYLES: ReelItem[] = [
  { id: "contrarian", label: "Contrarian Truth", icon: "🛑" },
  { id: "agitation", label: "Problem Agitation", icon: "🔥" },
  { id: "pattern", label: "Pattern Interrupt", icon: "⚡" },
  { id: "hack", label: "The 1-Minute Hack", icon: "🧪" },
  { id: "shock", label: "Before/After Shock", icon: "👀" },
  { id: "pov", label: "Relatable POV", icon: "📱" },
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
  const [isJackpot, setIsJackpot] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check initial sound preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fernum_sound_enabled");
      if (stored === "on") setSoundEnabled(true);
    } catch {}
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem("fernum_sound_enabled", next ? "on" : "off");
    } catch {}
  };

  const playClickTick = () => {
    if (!soundEnabled || isCalmModeActive()) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {}
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setLeverPulled(true);
    setIsJackpot(false);
    setTimeout(() => setLeverPulled(false), 300);

    let ticks = 0;
    const maxTicks = 18;

    const interval = setInterval(() => {
      ticks++;
      setProductIdx((prev) => (prev + 1) % PRODUCTS.length);
      setAudienceIdx((prev) => (prev + 1) % AUDIENCES.length);
      setStyleIdx((prev) => (prev + 1) % HOOK_STYLES.length);
      playClickTick();

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

        // Jackpot every 3rd spin or when numbers align
        const jackpotHit = newCount % 3 === 0 || finalP === finalA;
        if (jackpotHit) {
          setIsJackpot(true);
          if (!isCalmModeActive()) {
            window.dispatchEvent(new CustomEvent("fernum-logo-burst"));
          }
        }

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
    // Dispatch custom prefill event to brief form
    window.dispatchEvent(
      new CustomEvent("fernum-prefill-brief", {
        detail: {
          brandName: `${currentProduct.label} Studio`,
          productToAdvertise: currentProduct.label,
          offer: `Target Audience: ${currentAudience.label} • Angle: ${currentStyle.label}\nHook Angle: "${activeHookLine}"`,
        },
      })
    );

    // Smooth scroll down to brief form
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--accent)] border-2 border-[var(--border)] flex items-center justify-center shadow-brutal text-[var(--accent-fg)]">
            <Dices className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span>Interactive Studio Tool</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
              HOOK ROULETTE // GENERATOR
            </h3>
          </div>
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? "Mute roulette sound" : "Enable roulette sound"}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[var(--border)] bg-[var(--page-bg)] hover:bg-[var(--border)]/10 text-xs font-mono font-bold uppercase shadow-brutal-sm cursor-pointer transition-transform active:scale-95"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>SFX: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 opacity-50" />
              <span>SFX: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Slot Machine Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Reel 1: Product */}
        <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-4 shadow-brutal text-center">
          <span className="text-[10px] font-mono font-bold uppercase opacity-60 tracking-wider block mb-2">
            REEL 1: PRODUCT
          </span>
          <div
            className={`py-3 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <div className="text-3xl mb-1 select-none">{currentProduct.icon}</div>
            <div className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
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
            className={`py-3 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <div className="text-3xl mb-1 select-none">{currentAudience.icon}</div>
            <div className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
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
            className={`py-3 px-2 transition-transform duration-75 ${
              isSpinning ? "scale-95 blur-[0.5px]" : "scale-100"
            }`}
          >
            <div className="text-3xl mb-1 select-none">{currentStyle.icon}</div>
            <div className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[var(--page-fg)] line-clamp-1">
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
          aria-label="Spin Hook Roulette slot machine"
          className={`btn-squish w-full sm:w-auto px-8 py-3.5 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-sm sm:text-base uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-3 cursor-pointer ${
            isSpinning ? "opacity-75 cursor-not-allowed" : ""
          } ${leverPulled ? "scale-95" : ""}`}
        >
          <RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "Spinning Reels…" : "SPIN THE REELS"}</span>
        </button>

        {isJackpot && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#10B981] text-black border-2 border-[var(--border)] shadow-brutal font-mono font-black text-xs uppercase animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>JACKPOT MATCH! BONUS HOOK ANGLE</span>
          </div>
        )}
      </div>

      {/* Generated Hook Output Box */}
      <div className="bg-[var(--page-bg)] border-2 border-[var(--border)] p-5 sm:p-6 shadow-brutal text-[var(--page-fg)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase text-[var(--accent)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESULTING FIRST 3-SECOND SCRIPT HOOK:</span>
          </span>
          <span className="text-[10px] font-mono opacity-50 uppercase">Tested Pattern</span>
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
