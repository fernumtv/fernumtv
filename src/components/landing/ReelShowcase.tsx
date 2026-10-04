"use client";

import React, { useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Check, Sparkles, Smartphone, Square, MonitorPlay } from "lucide-react";

interface AdSample {
  id: string;
  brand: string;
  category: string;
  product: string;
  color: string;
  gradient: string;
  hooks: {
    label: string;
    style: string;
    hookText: string;
    bodySummary: string;
    retentionRate: string;
  }[];
  captionSample: string;
  audioTrack: string;
}

const SAMPLES: AdSample[] = [
  {
    id: "lumaglow",
    brand: "LumaGlow Skincare",
    category: "D2C Beauty & Skincare",
    product: "Barrier Repair Peptide Serum",
    color: "#F43F5E",
    gradient: "from-rose-900/60 via-pink-950/40 to-slate-950",
    hooks: [
      {
        label: "Hook 1: Direct Pain-Point Callout",
        style: "Direct Problem / Callout",
        hookText: "If your winter moisturizer leaves your face greasy and still flaking, STOP.",
        bodySummary: "Side-by-side absorption demo showing heavy cream vs lightweight micro-peptide serum. 7-day barrier redness repair time-lapse.",
        retentionRate: "44.2% 3-sec hook rate",
      },
      {
        label: "Hook 2: Negative Curiosity",
        style: "Contrarian / Curiosity",
        hookText: "The real reason luxury skincare brands charge $90 for hyaluronic acid...",
        bodySummary: "Exposing filler water vs pure clinical lipid ratios. Macro close-up of clinical test dropper.",
        retentionRate: "47.6% 3-sec hook rate",
      },
      {
        label: "Hook 3: Skeptical Reviewer Angle",
        style: "UGC Social Proof",
        hookText: "I tested 6 viral barrier serums so you don't waste $150 on Sephora returns.",
        bodySummary: "Authentic UGC bathroom mirror testing, honest skin texture evaluation, rapid 50% BOGO offer prompt.",
        retentionRate: "41.9% 3-sec hook rate",
      },
    ],
    captionSample: "NO MORE WINTER FLAKING ❄️ 100% CLINICAL PEPTIDES",
    audioTrack: "Upbeat Lo-Fi Aesthetic Beats (Licensed Royalty-Free)",
  },
  {
    id: "verve-hydra",
    brand: "Verve Nutrition",
    category: "D2C Functional Beverage",
    product: "Electrolyte Daily Fuel Packets",
    color: "#6366F1",
    gradient: "from-indigo-950/60 via-purple-950/40 to-slate-950",
    hooks: [
      {
        label: "Hook 1: Health Agitation",
        style: "Physiological Agitation",
        hookText: "Why drinking 3 liters of plain water is still giving you 2 PM brain fog.",
        bodySummary: "Cellular hydration diagram showing sodium-potassium ATP pump. Instant glass swirl dissolution shot.",
        retentionRate: "48.1% 3-sec hook rate",
      },
      {
        label: "Hook 2: Energy Drink Expose",
        style: "Competitor Contrast",
        hookText: "Energy drinks give you 200mg of caffeine and a guaranteed jittery crash.",
        bodySummary: "Heart rate monitor animation vs clean sustained mineral focus. Pack-in-gym-bag visual B-roll.",
        retentionRate: "45.0% 3-sec hook rate",
      },
      {
        label: "Hook 3: The 3-Ingredient Breakdown",
        style: "Curiosity / Ingredient-First",
        hookText: "3 minerals inside this single packet that replace your entire supplement cabinet.",
        bodySummary: "Quick cuts: Himalayan pink salt, magnesium glycinate, coconut water powder. Taste reaction.",
        retentionRate: "43.7% 3-sec hook rate",
      },
    ],
    captionSample: "ZERO SUGAR ⚡ 1000MG CLEAN ELECTROLYTES",
    audioTrack: "Energetic Modern Tech Bassline (Commercial Licensed)",
  },
  {
    id: "aerosound",
    brand: "AeroSound Labs",
    category: "D2C Tech & Consumer Electronics",
    product: "AeroPro Active Noise Cancelling Earbuds",
    color: "#06B6D4",
    gradient: "from-cyan-950/60 via-blue-950/40 to-slate-950",
    hooks: [
      {
        label: "Hook 1: Price Disruption",
        style: "Extreme Value Shock",
        hookText: "The $45 wireless earbuds that make $300 Sony flagships look like a scam.",
        bodySummary: "Audio frequency sweep graphic, noise cancellation decibel drop simulation, airport cabin isolation cut.",
        retentionRate: "49.5% 3-sec hook rate",
      },
      {
        label: "Hook 2: Situation Demonstration",
        style: "Extreme Scenario Agitation",
        hookText: "Turn off screaming airplane babies and loud subway chatter with one tap.",
        bodySummary: "Extreme sound design contrast: cacophony instantly silenced with dynamic sound waves.",
        retentionRate: "46.3% 3-sec hook rate",
      },
      {
        label: "Hook 3: Blind Audio Test",
        style: "Social Experiment",
        hookText: "We asked audio engineers to guess which earbuds cost $250. They were wrong.",
        bodySummary: "Studio blindfold reaction cuts, deep bass kick punch, and limited-edition 30-day trial guarantee.",
        retentionRate: "43.1% 3-sec hook rate",
      },
    ],
    captionSample: "-42DB HYBRID ANC ✈️ STUDIO GRADE SOUND",
    audioTrack: "Punchy Cinematic Percussion (Commercial Licensed)",
  },
];

export function ReelShowcase() {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [format, setFormat] = useState<"9:16" | "1:1" | "16:9">("9:16");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const sample = SAMPLES[selectedSampleIndex];
  const hook = sample.hooks[activeHookIndex];

  return (
    <section id="showcase" className="py-20 bg-background/60 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Interactive Creative Player
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            See How 3 Alternate Hooks 3x Your Testing Velocity
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Don't bet your ad spend on one creative guess. Every Fernum video ad ships with 3 distinct hook variations ready to test on Meta & TikTok, plus full HD renders in all 3 essential aspect ratios.
          </p>
        </div>

        {/* Niche / Brand Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSampleIndex(idx);
                setActiveHookIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedSampleIndex === idx
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40"
                  : "bg-secondary/60 text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {s.brand} • <span className="opacity-80">{s.category.split("&")[0]}</span>
            </button>
          ))}
        </div>

        {/* Interactive Reel Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column: Player & Aspect Ratio Controls */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Format Ratio Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-secondary/80 border border-white/10 rounded-xl mb-4 text-xs font-medium">
              <button
                onClick={() => setFormat("9:16")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  format === "9:16" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 Reels/TikTok</span>
              </button>
              <button
                onClick={() => setFormat("1:1")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  format === "1:1" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>1:1 Feed</span>
              </button>
              <button
                onClick={() => setFormat("16:9")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  format === "16:9" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>16:9 Landscape</span>
              </button>
            </div>

            {/* Video Container Mock */}
            <div
              className={`relative bg-gradient-to-b ${sample.gradient} border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between p-4 ${
                format === "9:16"
                  ? "w-[280px] sm:w-[320px] h-[500px] sm:h-[560px]"
                  : format === "1:1"
                  ? "w-[320px] sm:w-[380px] h-[320px] sm:h-[380px]"
                  : "w-full max-w-[480px] h-[270px]"
              }`}
            >
              {/* Top Bar inside Video: Channel & Ad Tag */}
              <div className="flex items-center justify-between text-[11px] text-white/90 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-[10px]">
                    {sample.brand.charAt(0)}
                  </div>
                  <span className="font-semibold drop-shadow">{sample.brand}</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-[10px] font-mono border border-white/10">
                  #Sponsored • AI-Assisted
                </div>
              </div>

              {/* Center Graphic / Animated Visual Simulation */}
              <div className="my-auto text-center px-4 relative z-10">
                {/* Visual Badge */}
                <div className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-purple-300 text-[10px] font-mono uppercase mb-3">
                  {hook.style}
                </div>

                {/* Hook Text Display */}
                <div className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-lg mb-3">
                  "{hook.hookText}"
                </div>

                {/* Simulated Animated Captions Overlay */}
                <div className="inline-block px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg transform -rotate-1">
                  {sample.captionSample}
                </div>
              </div>

              {/* Bottom Controls inside Video */}
              <div className="space-y-3 z-10">
                {/* Audio track indicator */}
                <div className="flex items-center justify-between text-[10px] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="truncate">{sample.audioTrack}</span>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Shop Now CTA Button */}
                <div className="w-full py-2 bg-white text-black font-bold text-xs rounded-xl text-center shadow-lg hover:bg-slate-100 transition-colors">
                  Shop {sample.product} →
                </div>
              </div>

              {/* Decorative animated glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Hook Variation Explainer */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                Hook Testing Engine
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Select an Alternate Hook Variant:
              </h3>
              <p className="text-xs text-muted-foreground">
                In Meta & TikTok ads, 70% of creative performance comes down to the first 3 seconds. That's why we generate and deliver 3 different psychological hooks for every approved script.
              </p>
            </div>

            {/* 3 Hooks Selector Buttons */}
            <div className="space-y-3">
              {sample.hooks.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setActiveHookIndex(i)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeHookIndex === i
                      ? "bg-card border-purple-500/80 shadow-lg shadow-purple-600/10 ring-1 ring-purple-500/50"
                      : "bg-secondary/40 border-white/5 hover:border-white/20 hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      {h.label}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      {h.retentionRate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white mb-2">
                    "{h.hookText}"
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {h.bodySummary}
                  </p>
                </div>
              ))}
            </div>

            {/* Specs Summary */}
            <div className="p-4 bg-secondary/30 rounded-xl border border-white/5 text-xs text-muted-foreground grid grid-cols-2 gap-3">
              <div>
                <span className="text-white font-medium block mb-0.5">Commercial Licensing:</span>
                100% royalty-free sound, AI models, and commercial fonts.
              </div>
              <div>
                <span className="text-white font-medium block mb-0.5">Turnaround Speed:</span>
                Script approved to final deliverable in 48-72h.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
