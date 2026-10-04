"use client";

import React from "react";
import { BarChart3, Clock, TrendingUp, ShieldCheck } from "lucide-react";

export function StudioSocialProof() {
  const metrics = [
    {
      num: "01",
      badge: "Top-of-Funnel Attention",
      title: "Hook Rate (3-Sec View Rate)",
      target: ">30% Target",
      desc: "Measures the percentage of cold prospects who stop scrolling and watch past the 3-second mark. Traditional ads average 15-20%. We test 3 psychological angles per ad to find the winner.",
      icon: <BarChart3 className="w-6 h-6 text-[var(--accent)]" />,
    },
    {
      num: "02",
      badge: "Mid-Funnel Engagement",
      title: "Average Watch Time",
      target: "High Completion",
      desc: "Evaluates the audience drop-off curve across the 15-30 second runtime. We use dynamic pacing, pattern interrupts, and kinetic captions to keep retention high without sound.",
      icon: <Clock className="w-6 h-6 text-[var(--accent)]" />,
    },
    {
      num: "03",
      badge: "Bottom-Line Efficiency",
      title: "Cost Per Click & ROAS",
      target: "Lower CPA",
      desc: "The ultimate metric that matters: cheaper clicks and lower customer acquisition costs. Strong creative hooks directly reduce ad auction fatigue and scale return on ad spend.",
      icon: <TrendingUp className="w-6 h-6 text-[var(--accent)]" />,
    },
  ];

  return (
    <section className="relative bg-[var(--block-4-bg)] text-[var(--block-4-fg)] py-24 sm:py-36 overflow-hidden border-t-2 border-[var(--border)]">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone-white opacity-10 pointer-events-none z-0" />

      {/* Oversized Word Partly Cropping at Screen Edge */}
      <div className="absolute top-0 right-0 translate-x-12 -translate-y-8 pointer-events-none select-none z-0 opacity-5">
        <span className="font-display font-black text-[15vw] text-current leading-none tracking-tighter uppercase whitespace-nowrap">
          METRICS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-4-fg)]/10 border border-[var(--block-4-fg)]/20 text-[var(--accent)] text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <span>● Performance Framework</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--block-4-fg)] tracking-tighter uppercase leading-[0.93] mb-4">
            HOW WE MEASURE RESULTS
          </h2>
          <p className="text-base sm:text-xl opacity-75 font-normal leading-relaxed">
            Zero invented quotes, zero staged testimonials. We evaluate every ad creative against the 3 cold-traffic metrics that scale ad accounts.
          </p>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {metrics.map((m) => (
            <div
              key={m.num}
              className="bg-[var(--border)]/40 border-2 border-[var(--border)] p-8 shadow-brutal flex flex-col justify-between hover:border-[var(--accent)] transition-colors text-[var(--block-4-fg)]"
            >
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--block-4-fg)]/15">
                  <span className="font-display font-black text-4xl text-[var(--accent)]">
                    {m.num}
                  </span>
                  <div className="p-2.5 bg-[var(--block-4-bg)] border border-[var(--border)]">
                    {m.icon}
                  </div>
                </div>

                <div className="text-[11px] font-mono font-bold uppercase text-[var(--accent)] tracking-wider mb-2">
                  {m.badge}
                </div>

                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-[var(--block-4-fg)] mb-2">
                  {m.title}
                </h3>

                <div className="inline-block px-2.5 py-0.5 bg-[var(--block-4-fg)]/10 text-xs font-mono font-bold opacity-80 uppercase mb-4 border border-[var(--block-4-fg)]/10">
                  Benchmark: {m.target}
                </div>

                <p className="text-xs sm:text-sm opacity-75 leading-relaxed font-medium">
                  {m.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--block-4-fg)]/15 flex items-center justify-between text-xs font-mono opacity-70">
                <span>Objective Metric</span>
                <span className="text-[var(--block-4-fg)] font-bold">Tested in Ads Manager</span>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Transparency Notice Banner */}
        <div className="p-6 bg-[var(--block-4-bg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[var(--block-4-fg)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[var(--accent)] shrink-0" />
            <div className="text-xs font-mono opacity-80">
              <span className="font-bold text-[var(--block-4-fg)] uppercase block sm:inline sm:mr-2">
                Honest Transparency Disclosure:
              </span>
              Until active client campaigns complete private attribution verification, we refuse to display fabricated testimonials. We let creative metrics speak for themselves.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
