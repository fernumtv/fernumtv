"use client";

import React from "react";
import { ArrowRight, BarChart2, CheckCircle2, Split, TrendingUp, RefreshCw } from "lucide-react";

export function TestingMethodologySection() {
  const metrics = [
    {
      name: "Hook Rate",
      plainDefinition: "The share of people who watch past the first 3 seconds of the video.",
      whatItTellsYou: "If hook rate is low, viewers are scrolling past your opening frame. Solution: swap the opening 3-second visual or statement.",
      actionCue: "Fixes thumb-stop friction",
    },
    {
      name: "Hold Rate",
      plainDefinition: "The share of people who stay through the middle demonstration of the ad.",
      whatItTellsYou: "If hold rate drops sharply, your product proof or pacing lost the viewer's interest. Solution: trim dead air or show clearer visual proof.",
      actionCue: "Fixes pacing and proof",
    },
    {
      name: "Click-Through Rate (CTR)",
      plainDefinition: "The share of viewers who tap the button or link to visit your store.",
      whatItTellsYou: "If hold rate is high but CTR is low, viewers enjoyed the video but didn't feel an urge to shop. Solution: sharpen your offer or call to action.",
      actionCue: "Fixes offer clarity",
    },
    {
      name: "Cost Per Result",
      plainDefinition: "The actual ad spend required to generate one sale or email lead.",
      whatItTellsYou: "Tells you which hook variation converts at the lowest customer acquisition cost, showing you exactly where to put more ad budget.",
      actionCue: "Determines budget allocation",
    },
  ];

  return (
    <section id="testing" className="py-24 sm:py-32 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Testing Methodology</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            HOW WE TEST
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal leading-relaxed max-w-2xl">
            Most ads fail in the first three seconds, not in the offer. Instead of guessing, we ship every single ad with three distinct opening hooks so your ad account tells you what works.
          </p>
        </div>

        {/* SVG Diagram: 1 Ad -> 3 Hooks -> Results -> Next Month's Brief */}
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal-xl mb-16">
          <div className="flex items-center justify-between border-b-2 border-[var(--border)]/20 pb-4 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">
              The 3-Hook Iteration Loop
            </span>
            <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
              Predictable Learning Cycle
            </span>
          </div>

          {/* Responsive SVG Flowchart */}
          <div className="w-full overflow-x-auto pb-4">
            <svg
              viewBox="0 0 960 260"
              className="w-full min-w-[760px] h-auto font-mono select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Box 1: 1 Core Ad Body */}
              <g transform="translate(10, 80)">
                <rect width="180" height="90" fill="var(--block-4-bg)" stroke="var(--border)" strokeWidth="2" />
                <rect x="4" y="4" width="172" height="82" fill="var(--block-4-bg)" stroke="var(--block-4-fg)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="90" y="40" fill="var(--accent)" fontSize="12" fontWeight="bold" textAnchor="middle">STEP 1</text>
                <text x="90" y="60" fill="var(--block-4-fg)" fontSize="14" fontWeight="bold" textAnchor="middle">1 CORE AD</text>
                <text x="90" y="78" fill="var(--block-4-fg)" opacity="0.7" fontSize="10" textAnchor="middle">Proof + Offer + CTA</text>
              </g>

              {/* Connecting Path 1 to Hooks */}
              <path d="M 190 125 L 250 125" stroke="var(--border)" strokeWidth="2" fill="none" />
              <path d="M 250 125 L 250 45 L 290 45" stroke="var(--border)" strokeWidth="2" fill="none" />
              <path d="M 250 125 L 290 125" stroke="var(--border)" strokeWidth="2" fill="none" />
              <path d="M 250 125 L 250 205 L 290 205" stroke="var(--border)" strokeWidth="2" fill="none" />

              {/* Box 2A: Hook 1 */}
              <g transform="translate(290, 15)">
                <rect width="200" height="60" fill="var(--page-bg)" stroke="var(--border)" strokeWidth="2" />
                <text x="15" y="26" fill="var(--page-fg)" fontSize="11" fontWeight="bold">HOOK A: Problem-First</text>
                <text x="15" y="45" fill="var(--page-fg)" opacity="0.7" fontSize="10">Direct customer frustration</text>
              </g>

              {/* Box 2B: Hook 2 */}
              <g transform="translate(290, 95)">
                <rect width="200" height="60" fill="var(--page-bg)" stroke="var(--border)" strokeWidth="2" />
                <text x="15" y="26" fill="var(--page-fg)" fontSize="11" fontWeight="bold">HOOK B: Curiosity Twist</text>
                <text x="15" y="45" fill="var(--page-fg)" opacity="0.7" fontSize="10">Debunks a common myth</text>
              </g>

              {/* Box 2C: Hook 3 */}
              <g transform="translate(290, 175)">
                <rect width="200" height="60" fill="var(--page-bg)" stroke="var(--border)" strokeWidth="2" />
                <text x="15" y="26" fill="var(--page-fg)" fontSize="11" fontWeight="bold">HOOK C: Direct Outcome</text>
                <text x="15" y="45" fill="var(--page-fg)" opacity="0.7" fontSize="10">Speed & visible result</text>
              </g>

              {/* Connecting Path Hooks to Results */}
              <path d="M 490 45 L 530 45 L 530 125 L 570 125" stroke="var(--border)" strokeWidth="2" fill="none" />
              <path d="M 490 125 L 570 125" stroke="var(--border)" strokeWidth="2" fill="none" />
              <path d="M 490 205 L 530 205 L 530 125" stroke="var(--border)" strokeWidth="2" fill="none" />

              {/* Box 3: Performance Results */}
              <g transform="translate(570, 80)">
                <rect width="170" height="90" fill="var(--block-3-bg)" stroke="var(--border)" strokeWidth="2" />
                <text x="85" y="38" fill="var(--block-3-fg)" fontSize="11" fontWeight="bold" textAnchor="middle">STEP 2: RUN TEST</text>
                <text x="85" y="58" fill="var(--block-3-fg)" fontSize="13" fontWeight="900" textAnchor="middle">ISOLATE WINNER</text>
                <text x="85" y="76" fill="var(--block-3-fg)" fontSize="10" textAnchor="middle">Hook Rate vs. Cost/Sale</text>
              </g>

              {/* Connecting Path Results to Next Brief */}
              <path d="M 740 125 L 780 125" stroke="var(--border)" strokeWidth="2" fill="none" />
              <polygon points="780,121 788,125 780,129" fill="var(--border)" />

              {/* Box 4: Next Month Brief */}
              <g transform="translate(790, 80)">
                <rect width="160" height="90" fill="var(--accent)" stroke="var(--border)" strokeWidth="2" />
                <text x="80" y="38" fill="var(--accent-fg)" fontSize="11" fontWeight="bold" textAnchor="middle">STEP 3: ITERATE</text>
                <text x="80" y="58" fill="var(--accent-fg)" fontSize="13" fontWeight="900" textAnchor="middle">NEXT BRIEF</text>
                <text x="80" y="76" fill="var(--accent-fg)" opacity="0.8" fontSize="10" textAnchor="middle">Double down on winner</text>
              </g>
            </svg>
          </div>

          <div className="pt-4 border-t border-[var(--border)]/20 text-xs sm:text-sm opacity-90 font-medium leading-relaxed">
            By keeping the core body identical and testing 3 openings, you isolate the exact hook variable. You learn what stops your target audience without paying three separate agency production invoices.
          </div>
        </div>

        {/* 4 Metric Definitions in Plain Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-8 shadow-brutal flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-2xl uppercase">
                    {m.name}
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-[var(--page-bg)] text-[var(--page-fg)] px-2.5 py-1 border border-[var(--border)]">
                    Metric {idx + 1}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
                    Plain Meaning:
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    {m.plainDefinition}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-70 mb-1">
                    What it tells you to do next:
                  </div>
                  <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-medium">
                    {m.whatItTellsYou}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]/20 flex items-center justify-between text-xs font-mono font-bold">
                <span>Diagnostic:</span>
                <span className="text-[var(--accent)]">{m.actionCue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
