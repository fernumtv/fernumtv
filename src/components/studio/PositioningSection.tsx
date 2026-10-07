"use client";

import React from "react";
import { Check, X } from "lucide-react";

export function PositioningSection() {
  const forPoints = [
    "D2C & e-commerce brand founders who already spend $2k+ per month on Meta or TikTok ads.",
    "Brands experiencing creative fatigue where winning ads have started burning out.",
    "Teams looking for a steady stream of 3-hook variations without multi-month agency retainers.",
    "Operators who understand that paid media success requires disciplined, weekly creative testing.",
  ];

  const notForPoints = [
    "Brands that require physical on-location film crews, studio sets, or celebrity actor casting.",
    "Early founders seeking 'guaranteed sales' or overnight ROAS promises without testing creative.",
    "Companies with 6-week corporate legal review cycles for a 15-second social ad script.",
    "Teams that do not currently have budget allocated to run paid social traffic.",
  ];

  return (
    <section id="positioning" className="py-24 sm:py-32 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Clear Fit</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            WHO THIS IS FOR / NOT FOR
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal leading-relaxed max-w-2xl">
            We are built specifically for direct-to-consumer brands that run paid traffic. If you need traditional agency bureaucracy or live film shoots, we are the wrong choice.
          </p>
        </div>

        {/* Two High-Contrast Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: WHO THIS IS FOR */}
          <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--border)]/15 pb-4 mb-6">
                <span className="font-display font-black text-2xl uppercase">
                  Who This Is For
                </span>
                <span className="px-3 py-1 bg-[var(--accent)] text-[var(--accent-fg)] font-mono font-bold text-xs uppercase border border-[var(--border)]">
                  Ideal Fit
                </span>
              </div>

              <div className="space-y-4">
                {forPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-none border border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <p className="text-sm sm:text-base font-medium leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)]/15 text-xs font-mono opacity-70">
              Target Profile: E-commerce brands selling physical products direct to consumers.
            </div>
          </div>

          {/* Card 2: WHO THIS IS NOT FOR */}
          <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--border)]/15 pb-4 mb-6">
                <span className="font-display font-black text-2xl uppercase">
                  Who This Is Not For
                </span>
                <span className="px-3 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] font-mono font-bold text-xs uppercase border border-[var(--border)]">
                  Bad Fit
                </span>
              </div>

              <div className="space-y-4">
                {notForPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-none border border-[var(--border)] bg-[var(--block-4-bg)] text-[var(--block-4-fg)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✕
                    </div>
                    <p className="text-sm sm:text-base opacity-85 font-medium leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)]/15 text-xs font-mono opacity-70">
              Expectation setting: We deliver high-speed creative variations, not magical guarantees.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
