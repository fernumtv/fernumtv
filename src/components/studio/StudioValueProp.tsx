"use client";

import React from "react";
import { Zap, Layers, DollarSign, CheckCircle2 } from "lucide-react";

export function StudioValueProp() {
  return (
    <section className="relative bg-[var(--block-4-bg)] text-[var(--block-4-fg)] py-24 sm:py-36 overflow-hidden border-t-2 border-[var(--border)]">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone-white opacity-15 pointer-events-none z-0" />

      {/* Oversized Cropped Section Watermark */}
      <div className="absolute top-0 right-0 translate-x-10 -translate-y-8 pointer-events-none select-none z-0 opacity-5">
        <span className="font-display font-black text-[16vw] text-current leading-none tracking-tighter uppercase whitespace-nowrap">
          ADVANTAGE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-4-fg)]/10 border border-[var(--block-4-fg)]/20 text-[var(--accent)] text-xs font-mono font-bold uppercase tracking-widest mb-6">
          <span>● The Fernum Model</span>
        </div>

        {/* Oversized Statement Headline */}
        <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.93] max-w-5xl mb-8">
          MORE AD VARIATIONS. <br />
          <span className="text-[var(--accent)]">FASTER DELIVERY.</span> <br />
          FIXED MONTHLY PRICE.
        </h2>

        {/* Supporting Proposition Paragraph */}
        <p className="text-base sm:text-2xl opacity-80 font-medium max-w-3xl leading-relaxed mb-16">
          Traditional agencies charge $6,000+ retainers for 2 slow videos a month and take a cut of your ad spend. We built an AI-assisted creative pipeline that tests 3 hooks per ad, ships in 48-72 hours, and costs a fraction of an in-house hire.
        </p>

        {/* 3 Value Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: More Variations */}
          <div className="p-8 bg-[var(--border)]/40 border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] flex items-center justify-center font-display font-black text-xl mb-6 shadow-sm">
                01
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-3">
                More Hook Variations
              </h3>
              <p className="text-sm opacity-75 leading-relaxed font-medium">
                The first 3 seconds determine 80% of ad performance. Every approved script comes with 3 alternate psychological hooks so you can beat creative fatigue on Meta and TikTok.
              </p>
            </div>
            <div className="pt-6 border-t border-[var(--block-4-fg)]/15 mt-6 text-xs font-mono text-[var(--accent)] font-bold uppercase">
              ✓ 3 Tested Hooks Per Ad
            </div>
          </div>

          {/* Card 2: Faster Delivery */}
          <div className="p-8 bg-[var(--border)]/40 border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[var(--block-3-bg)] text-[var(--block-3-fg)] border-2 border-[var(--border)] flex items-center justify-center font-display font-black text-xl mb-6 shadow-sm">
                02
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-3">
                48–72h Turnaround
              </h3>
              <p className="text-sm opacity-75 leading-relaxed font-medium">
                No endless discovery meetings or 6-week production timelines. Review your script concepts in 24 hours and receive finished Full HD video creatives in 48 to 72 hours.
              </p>
            </div>
            <div className="pt-6 border-t border-[var(--block-4-fg)]/15 mt-6 text-xs font-mono text-[var(--accent)] font-bold uppercase">
              ✓ Fast Iteration Cycles
            </div>
          </div>

          {/* Card 3: Fixed Monthly Price */}
          <div className="p-8 bg-[var(--border)]/40 border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] flex items-center justify-center font-display font-black text-xl mb-6 shadow-sm">
                03
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-3">
                Fixed Monthly Price
              </h3>
              <p className="text-sm opacity-75 leading-relaxed font-medium">
                Predictable subscription pricing starting at $499/month. We never take a percentage of your media spend, never trap you in multi-month retainers, and you can cancel anytime. Cancellation takes effect at the end of the current billing period.
              </p>
            </div>
            <div className="pt-6 border-t border-[var(--block-4-fg)]/15 mt-6 text-xs font-mono text-[var(--accent)] font-bold uppercase">
              ✓ Zero Retainers, Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
