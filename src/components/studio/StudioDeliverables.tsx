"use client";

import React from "react";
import { Smartphone, Sparkles, CheckSquare, RefreshCw, Video, Type } from "lucide-react";

export function StudioDeliverables() {
  const deliverables = [
    {
      icon: <Smartphone className="w-6 h-6 text-[var(--accent)]" />,
      title: "3 Aspect Ratios Included",
      subtitle: "9:16, 1:1, and 16:9",
      desc: "Every single ad is rendered in 9:16 vertical (TikTok, Instagram Reels, Shorts), 1:1 square (Instagram & Facebook Feeds), and 16:9 landscape (Desktop & YouTube).",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[var(--accent)]" />,
      title: "3 Alternate Hooks Per Ad",
      subtitle: "First 3 seconds A/B testing",
      desc: "We generate 3 distinct psychological hooks for every approved concept (Direct Problem, Curiosity Twist, UGC Reaction) so you can isolate what scales your ROAS.",
    },
    {
      icon: <Video className="w-6 h-6 text-current" />,
      title: "Full HD Master Delivery",
      subtitle: "1080p clean render files",
      desc: "Master exports with calibrated audio leveling, crisp 60fps / 30fps encoding, and zero compression artifacts ready to upload directly into Meta Ads Manager.",
    },
    {
      icon: <Type className="w-6 h-6 text-[var(--accent)]" />,
      title: "Dynamic Captions & Motion",
      subtitle: "Sound-off engagement",
      desc: "80% of mobile users browse with sound off. Every ad includes animated, on-brand dynamic subtitles and kinetic text cards to stop the scroll instantly.",
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[var(--accent)]" />,
      title: "2 Revisions Included",
      subtitle: "Per ad slot, every month",
      desc: "Need pacing sped up, music changed, or a specific caption adjusted? Every slot includes 2 revision rounds executed within 24 hours.",
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-current" />,
      title: "100% Human Polish",
      subtitle: "Senior creative QA",
      desc: "AI produces speed, but experienced creative directors review every frame, audio sync point, and transition before delivery. Zero synthetic glitches.",
    },
  ];

  return (
    <section className="relative bg-[var(--page-bg)] text-[var(--page-fg)] py-24 sm:py-36 overflow-hidden border-t-2 border-[var(--border)]">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      {/* Oversized Word Partly Cropping at Screen Edge */}
      <div className="absolute top-0 right-0 translate-x-12 -translate-y-8 pointer-events-none select-none z-0">
        <span className="font-display font-black text-[13vw] text-[var(--page-fg)]/[0.04] leading-none tracking-tighter uppercase whitespace-nowrap">
          INCLUDED
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-brutal">
            <span>● Production Deliverables</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.93] mb-4">
            WHAT YOU GET EACH MONTH
          </h2>
          <p className="text-base sm:text-xl text-[var(--page-fg)]/75 font-normal leading-relaxed">
            Every subscription includes complete multi-format exports and 3 psychological hook angles per ad.
          </p>
        </div>

        {/* 6 Grid Deliverables Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {deliverables.map((d, idx) => (
            <div
              key={idx}
              className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-7 sm:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] flex items-center justify-center mb-6 shadow-sm">
                  {d.icon}
                </div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
                  {d.subtitle}
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight mb-3">
                  {d.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--block-2-fg)]/75 leading-relaxed font-medium">
                  {d.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border)]/15 text-[11px] font-mono font-bold flex items-center justify-between">
                <span>Standard In All Plans</span>
                <span className="text-[var(--accent)]">✓ Included</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
