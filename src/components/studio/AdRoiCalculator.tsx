"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, AlertTriangle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/interactive/sound";

export function AdRoiCalculator() {
  const [adSpend, setAdSpend] = useState<number>(10000);
  const [currentHookRate, setCurrentHookRate] = useState<number>(22);
  const [activeHooksTested, setActiveHooksTested] = useState<3>(3);

  // Calculations
  const stats = useMemo(() => {
    // Drop-off rate in first 3 seconds
    const dropoffRate = (100 - currentHookRate) / 100;
    // Estimated budget lost to immediate scroll-aways before seeing the pitch
    const spendLostToScroll = Math.round(adSpend * dropoffRate * 0.65);
    
    // Testing 3 hooks typically lifts hook rate by 35% - 55%
    const projectedHookRate = Math.min(52, Math.round(currentHookRate * 1.45));
    const hookRateLift = projectedHookRate - currentHookRate;
    
    // Assuming ~$15 average blended CPM across Meta/TikTok
    const totalImpressions = (adSpend / 15) * 1000;
    const additionalViewers = Math.round(totalImpressions * (hookRateLift / 100));

    // Estimated value recovered in retained attention
    const valueRecovered = Math.round(spendLostToScroll * 0.42);

    return {
      spendLostToScroll,
      projectedHookRate,
      hookRateLift,
      additionalViewers,
      valueRecovered,
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
            HOOK WASTAGE CALCULATOR
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal">
            80% of paid ad dropoff happens in seconds 0 to 3. See how much budget leaks on a single hook vs testing 3 variations per ad.
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
                    Monthly Paid Social Spend
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

              {/* Slider 2: Current Hook Retention Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="hook-rate-range" className="text-xs font-mono font-bold uppercase tracking-wider block">
                      Current 3-Second Hook Rate
                    </label>
                    <span className="text-[11px] font-mono opacity-65">
                      (Meta / TikTok View Through)
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
                  max="45"
                  step="1"
                  value={currentHookRate}
                  onChange={handleHookChange}
                  className="w-full h-3 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-none appearance-none cursor-pointer accent-[var(--accent)]"
                />
                <div className="flex justify-between text-[11px] font-mono opacity-60">
                  <span>10% (Low retention)</span>
                  <span>22% (Industry Avg)</span>
                  <span>45% (High retention)</span>
                </div>
              </div>

              {/* Angle Feature Badge */}
              <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-bold uppercase">Fernum Standard: 3 Hooks / Ad</span>
                </div>
                <span className="px-2 py-0.5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] font-bold uppercase text-[10px]">
                  3x Angles Tested
                </span>
              </div>
            </div>

            {/* Right Display: Stat Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stat 1: Leaking Ad Spend */}
              <div className="p-5 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Drop-off Leak
                  </span>
                  <span className="text-[10px] font-mono opacity-50">0-3 SEC</span>
                </div>
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-red-500 tracking-tight leading-none mb-1">
                    ${stats.spendLostToScroll.toLocaleString()}
                  </div>
                  <p className="text-xs font-medium opacity-80 leading-relaxed">
                    Estimated monthly budget burning before viewers hear your value proposition.
                  </p>
                </div>
              </div>

              {/* Stat 2: Projected Hook Lift */}
              <div className="p-5 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-[var(--accent)] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Tested Retention
                  </span>
                  <span className="text-[10px] font-mono opacity-70">3 HOOKS</span>
                </div>
                <div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[var(--accent)] tracking-tight leading-none mb-1">
                    +{stats.hookRateLift}%
                  </div>
                  <p className="text-xs font-medium opacity-90 leading-relaxed">
                    Higher 3-second hook rate by iterating high-contrast opening angles.
                  </p>
                </div>
              </div>

              {/* Stat 3: Additional Hooked Viewers */}
              <div className="sm:col-span-2 p-6 bg-[var(--block-3-bg)] text-[var(--block-3-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[var(--accent)] block mb-1">
                    ⚡ Qualified Audience Lift
                  </span>
                  <div className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none mb-1">
                    +{stats.additionalViewers.toLocaleString()} Viewers
                  </div>
                  <p className="text-xs opacity-85 max-w-sm">
                    More prospective customers making it into your core pitch every single month.
                  </p>
                </div>

                <Link
                  href="#pricing"
                  onClick={playPopSound}
                  className="w-full sm:w-auto h-12 px-6 bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Stop Wasting Spend →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
