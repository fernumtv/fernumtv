"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Zap, HelpCircle } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/interactive/sound";

export function AdRoiCalculator() {
  const [adSpend, setAdSpend] = useState<number>(10000);
  const [currentHookRate, setCurrentHookRate] = useState<number>(22);

  // Pure mathematical breakdown from user inputs
  const { dropoffRate, dropoffBudget, retainedBudget } = useMemo(() => {
    const dropoff = 100 - currentHookRate;
    const dropoffAmount = Math.round(adSpend * (dropoff / 100));
    const retainedAmount = Math.round(adSpend * (currentHookRate / 100));

    return {
      dropoffRate: dropoff,
      dropoffBudget: dropoffAmount,
      retainedBudget: retainedAmount,
    };
  }, [adSpend, currentHookRate]);

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdSpend(Number(e.target.value));
    playClickSound();
  };

  const handleHookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentHookRate(Number(e.target.value));
    playClickSound();
  };

  return (
    <section
      id="roi-calculator"
      className="py-20 sm:py-28 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative overflow-hidden"
    >
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.93] mb-4">
            HOOK BUDGET ILLUSTRATION
          </h2>
          <p className="text-[15px] sm:text-base text-[var(--page-fg)]/80 font-mono">
            Illustration only. Uses example numbers you can change. Your results will differ.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="bg-[var(--block-2-bg)] border-2 border-[var(--border)] p-6 sm:p-10 shadow-brutal-xl text-[var(--block-2-fg)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-8">
              {/* Slider 1: Monthly Ad Spend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="ad-spend-range" className="text-xs font-mono font-bold uppercase tracking-wider">
                    Monthly Ad Spend
                  </label>
                  <span className="font-display font-black text-2xl text-[var(--accent)] tracking-tight">
                    ${adSpend.toLocaleString()}
                  </span>
                </div>
                <input
                  id="ad-spend-range"
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={adSpend}
                  onChange={handleSpendChange}
                  className="w-full h-3 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-none appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-[11px] font-mono opacity-60">
                  <span>$1,000/mo</span>
                  <span>$25,000/mo</span>
                  <span>$50,000/mo</span>
                </div>
              </div>

              {/* Slider 2: Hook Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="hook-rate-range" className="text-xs font-mono font-bold uppercase tracking-wider block">
                      3-Second Hook Rate
                    </label>
                    <span className="text-[11px] font-mono opacity-65">
                      Percentage of impressions watching past 3s
                    </span>
                  </div>
                  <span className="font-display font-black text-2xl text-[var(--block-2-fg)] tracking-tight">
                    {currentHookRate}%
                  </span>
                </div>
                <input
                  id="hook-rate-range"
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={currentHookRate}
                  onChange={handleHookChange}
                  className="w-full h-3 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-none appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-[11px] font-mono opacity-60">
                  <span>10%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Formula Callout */}
              <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Visible Formulas</span>
                </div>
                <p className="opacity-75">
                  • Drop-off spend = Spend × (100% − Hook Rate)
                </p>
                <p className="opacity-75">
                  • Retained spend = Spend × Hook Rate
                </p>
              </div>
            </div>

            {/* Right Display: Stat Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Drop-off Before 3s */}
              <div className="p-5 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-[var(--page-fg)]/80">
                    Budget on 0-3s Drop-off
                  </span>
                  <span className="text-[10px] font-mono opacity-60">{dropoffRate}%</span>
                </div>
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[var(--page-fg)] tracking-tight leading-none mb-2">
                    ${dropoffBudget.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono opacity-70 border-t border-[var(--border)] pt-2">
                    Formula: ${adSpend.toLocaleString()} × {dropoffRate}%
                  </div>
                </div>
              </div>

              {/* Card 2: Reaching Past 3s */}
              <div className="p-5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-[var(--accent)]">
                    Budget Reaching Past 3s
                  </span>
                  <span className="text-[10px] font-mono opacity-80">{currentHookRate}%</span>
                </div>
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[var(--accent)] tracking-tight leading-none mb-2">
                    ${retainedBudget.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono opacity-80 border-t border-[var(--border)] pt-2">
                    Formula: ${adSpend.toLocaleString()} × {currentHookRate}%
                  </div>
                </div>
              </div>

              {/* Bottom Summary Bar */}
              <div className="sm:col-span-2 p-6 bg-[var(--block-3-bg)] text-[var(--block-3-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[var(--accent)] block mb-1">
                    Monthly Spend Total
                  </span>
                  <div className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1">
                    ${adSpend.toLocaleString()} Total Budget
                  </div>
                  <p className="text-xs font-mono opacity-80 max-w-sm">
                    ${dropoffBudget.toLocaleString()} (drop-off) + ${retainedBudget.toLocaleString()} (retained)
                  </p>
                </div>

                <Link
                  href="/#pricing"
                  onClick={playPopSound}
                  className="w-full sm:w-auto h-12 px-6 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>View Pricing Plans →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
