"use client";

import React from "react";
import { Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Flame, Zap } from "lucide-react";

interface HeroSectionProps {
  onScrollToBrief: () => void;
  onScrollToShowcase: () => void;
  onOpenBookCall: () => void;
}

export function HeroSection({
  onScrollToBrief,
  onScrollToShowcase,
  onOpenBookCall,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Engineered for D2C Brands Running Meta & TikTok Ads</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
          Stop Paying $5,000/mo For{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
            Slow Video Agencies.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Get finished, high-converting short-form video ads tailored to your product. Every ad ships in{" "}
          <span className="text-white font-medium">9:16, 1:1, and 16:9</span> with{" "}
          <span className="text-white font-medium">3 alternate hooks</span> to crush creative fatigue—reviewed by human creative directors before delivery.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={onScrollToBrief}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-base shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start an Ad Brief</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToShowcase}
            className="w-full sm:w-auto px-6 py-3.5 bg-secondary/80 hover:bg-secondary text-foreground font-medium rounded-xl text-sm border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400/30" />
            <span>Watch Sample Reels</span>
          </button>
        </div>

        {/* Live Guarantees / Bullets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-card/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">3 Hooks</div>
            <div className="text-xs text-muted-foreground">Included with every ad for rapid Meta/TikTok split testing</div>
          </div>

          <div className="p-4 rounded-xl bg-card/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">3 Ratios</div>
            <div className="text-xs text-muted-foreground">Full HD in 9:16 (Reels/TikTok), 1:1 (Feed), and 16:9</div>
          </div>

          <div className="p-4 rounded-xl bg-card/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">$333 - $499</div>
            <div className="text-xs text-muted-foreground">Predictable per-ad price. No agency retainers or hidden fees</div>
          </div>

          <div className="p-4 rounded-xl bg-card/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">100% Polish</div>
            <div className="text-xs text-muted-foreground">Script approved by you. Reviewed by a human editor before delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}
