"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThreadChartStickers } from "@/components/SiteStickers";

interface ThreadConnection {
  id: string;
  leftIndex: number;
  rightIndex: number;
}

const LEFT_WORDS = [
  "Low thumb-stop",
  "Rising CPM",
  "Ad fatigue",
  "Weak hold rate",
  "Wasted spend",
];

const RIGHT_WORDS = [
  "Generic opening",
  "Slow first 3 seconds",
  "One creative only",
  "No hook testing",
  "Unclear offer",
];

const CONNECTIONS: ThreadConnection[] = [
  { id: "c-0-1", leftIndex: 0, rightIndex: 1 }, // Low thumb-stop -> Slow first 3 seconds
  { id: "c-0-0", leftIndex: 0, rightIndex: 0 }, // Low thumb-stop -> Generic opening
  { id: "c-1-0", leftIndex: 1, rightIndex: 0 }, // Rising CPM -> Generic opening
  { id: "c-1-3", leftIndex: 1, rightIndex: 3 }, // Rising CPM -> No hook testing
  { id: "c-2-2", leftIndex: 2, rightIndex: 2 }, // Ad fatigue -> One creative only
  { id: "c-2-1", leftIndex: 2, rightIndex: 1 }, // Ad fatigue -> Slow first 3 seconds
  { id: "c-3-1", leftIndex: 3, rightIndex: 1 }, // Weak hold rate -> Slow first 3 seconds
  { id: "c-3-4", leftIndex: 3, rightIndex: 4 }, // Weak hold rate -> Unclear offer
  { id: "c-4-3", leftIndex: 4, rightIndex: 3 }, // Wasted spend -> No hook testing
  { id: "c-4-2", leftIndex: 4, rightIndex: 2 }, // Wasted spend -> One creative only
  { id: "c-4-4", leftIndex: 4, rightIndex: 4 }, // Wasted spend -> Unclear offer
];

export function ThreadChartSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [activeRight, setActiveRight] = useState<number | null>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setPrefersReducedMotion(true);
      setIsDrawn(true);
    }
  }, []);

  // IntersectionObserver to draw threads on scroll
  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleLeftClick = (idx: number) => {
    if (activeLeft === idx) {
      setActiveLeft(null);
      setActiveRight(null);
    } else {
      setActiveLeft(idx);
      setActiveRight(null);
    }
  };

  const handleRightClick = (idx: number) => {
    if (activeRight === idx) {
      setActiveLeft(null);
      setActiveRight(null);
    } else {
      setActiveRight(idx);
      setActiveLeft(null);
    }
  };

  const hasSelection = activeLeft !== null || activeRight !== null;

  const isConnectionActive = (conn: ThreadConnection) => {
    if (!hasSelection) return false;
    if (activeLeft !== null && conn.leftIndex === activeLeft) return true;
    if (activeRight !== null && conn.rightIndex === activeRight) return true;
    return false;
  };

  const isLeftHighlighted = (idx: number) => {
    if (!hasSelection) return false;
    if (activeLeft === idx) return true;
    if (activeRight !== null) {
      return CONNECTIONS.some((c) => c.rightIndex === activeRight && c.leftIndex === idx);
    }
    return false;
  };

  const isRightHighlighted = (idx: number) => {
    if (!hasSelection) return false;
    if (activeRight === idx) return true;
    if (activeLeft !== null) {
      return CONNECTIONS.some((c) => c.leftIndex === activeLeft && c.rightIndex === idx);
    }
    return false;
  };

  // Fixed desktop coordinates for 5 slots on 400x380 SVG viewBox
  // Y-slots: 38, 114, 190, 266, 342
  const DESKTOP_Y = [38, 114, 190, 266, 342];

  // Mobile horizontal slots on 340x160 SVG viewBox
  // X-slots: 34, 102, 170, 238, 306
  const MOBILE_X = [34, 102, 170, 238, 306];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--accent)] text-[var(--accent-fg)] pt-14 pb-16 sm:pt-20 sm:pb-22 border-b-4 border-[var(--border)] overflow-hidden select-none"
      aria-label="Hook thread chart section"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-[var(--page-bg)] border-2 border-[#111111] text-[11px] font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal-sm">
            <span>Thread Analysis // Paid Social Bottlenecks</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tight uppercase leading-[0.95]">
            ONE WEAK HOOK. EVERYTHING ELSE PAYS FOR IT.
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#111111]/80">
            Tap or hover any word to trace how creative fatigue tangles through your ad account
          </p>
        </div>

        {/* =========================================================================
            DESKTOP LAYOUT (Hidden on mobile < 768px, Visible on md and above)
            Horizontal side-by-side with central tangled SVG threads
           ========================================================================= */}
        <div className="hidden md:block bg-[var(--page-bg)] text-[var(--page-fg)] border-4 border-[#111111] shadow-brutal-xl p-8 lg:p-12 mb-8">
          <div className="flex items-center justify-between gap-6">
            {/* Left Column Words */}
            <div className="w-[230px] lg:w-[270px] shrink-0 space-y-4">
              <div className="text-[11px] font-mono font-black uppercase tracking-wider text-[#111111]/60 pb-1 border-b-2 border-[#111111]/20">
                Symptoms in Ad Account
              </div>
              {LEFT_WORDS.map((word, idx) => {
                const isActive = activeLeft === idx;
                const isLit = isLeftHighlighted(idx);
                const isDimmed = hasSelection && !isActive && !isLit;

                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleLeftClick(idx)}
                    onMouseEnter={() => {
                      setActiveLeft(idx);
                      setActiveRight(null);
                    }}
                    onMouseLeave={() => setActiveLeft(null)}
                    className={`w-full text-left px-4 py-3.5 border-2 border-[#111111] font-display font-black text-sm uppercase tracking-tight transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isActive || isLit
                        ? "bg-[#111111] text-[var(--page-bg)] shadow-brutal translate-x-1"
                        : isDimmed
                        ? "bg-[var(--block-2-bg)] text-[#111111]/35 border-[#111111]/25 opacity-40"
                        : "bg-[var(--block-2-bg)] text-[#111111] shadow-brutal-sm hover:bg-[#111111] hover:text-[var(--page-bg)]"
                    }`}
                  >
                    <span>{word}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full border border-[#111111] transition-colors ${
                        isActive || isLit ? "bg-[var(--accent)]" : "bg-[#111111]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Desktop SVG Tangled Threads Canvas */}
            <div className="flex-1 max-w-[460px] h-[380px] relative">
              <svg
                viewBox="0 0 400 380"
                className="w-full h-full overflow-visible pointer-events-none"
                aria-hidden="true"
              >
                {CONNECTIONS.map((conn) => {
                  const y1 = DESKTOP_Y[conn.leftIndex];
                  const y2 = DESKTOP_Y[conn.rightIndex];
                  const active = isConnectionActive(conn);
                  const dimmed = hasSelection && !active;

                  // Cubic bezier S-curve across 400px width
                  const d = `M 0 ${y1} C 180 ${y1}, 220 ${y2}, 400 ${y2}`;

                  return (
                    <g key={conn.id}>
                      {active && (
                        <path
                          d={d}
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="8"
                          strokeOpacity="0.45"
                          strokeLinecap="round"
                        />
                      )}
                      <path
                        d={d}
                        fill="none"
                        stroke="#111111"
                        strokeWidth={active ? 3.5 : 2}
                        strokeOpacity={active ? 1 : dimmed ? 0.12 : 0.65}
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset={isDrawn || prefersReducedMotion ? "0" : "1"}
                        style={{
                          transition: prefersReducedMotion
                            ? "none"
                            : "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 0.2s ease, stroke-width 0.2s ease",
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right Column Words */}
            <div className="w-[230px] lg:w-[270px] shrink-0 space-y-4">
              <div className="text-[11px] font-mono font-black uppercase tracking-wider text-[#111111]/60 pb-1 border-b-2 border-[#111111]/20 text-right">
                Creative Root Causes
              </div>
              {RIGHT_WORDS.map((word, idx) => {
                const isActive = activeRight === idx;
                const isLit = isRightHighlighted(idx);
                const isDimmed = hasSelection && !isActive && !isLit;

                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleRightClick(idx)}
                    onMouseEnter={() => {
                      setActiveRight(idx);
                      setActiveLeft(null);
                    }}
                    onMouseLeave={() => setActiveRight(null)}
                    className={`w-full text-right px-4 py-3.5 border-2 border-[#111111] font-display font-black text-sm uppercase tracking-tight transition-all duration-150 cursor-pointer flex items-center flex-row-reverse justify-between ${
                      isActive || isLit
                        ? "bg-[#111111] text-[var(--page-bg)] shadow-brutal -translate-x-1"
                        : isDimmed
                        ? "bg-[var(--block-2-bg)] text-[#111111]/35 border-[#111111]/25 opacity-40"
                        : "bg-[var(--block-2-bg)] text-[#111111] shadow-brutal-sm hover:bg-[#111111] hover:text-[var(--page-bg)]"
                    }`}
                  >
                    <span>{word}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full border border-[#111111] transition-colors ${
                        isActive || isLit ? "bg-[var(--accent)]" : "bg-[#111111]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE LAYOUT (Visible on mobile < 768px, works down to 390px and 320px)
            Vertical layout with threads scaled down, zero horizontal scroll
           ========================================================================= */}
        <div className="block md:hidden bg-[var(--page-bg)] text-[var(--page-fg)] border-4 border-[#111111] shadow-brutal-xl p-4 sm:p-6 mb-8 overflow-hidden">
          {/* Top Section: Symptoms */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-wider text-[#111111]/70 pb-1 border-b-2 border-[#111111]/20">
              <span>Symptoms (Top)</span>
              <span>Tap to trace</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {LEFT_WORDS.map((word, idx) => {
                const isActive = activeLeft === idx;
                const isLit = isLeftHighlighted(idx);
                const isDimmed = hasSelection && !isActive && !isLit;

                return (
                  <button
                    key={`m-l-${word}`}
                    type="button"
                    onClick={() => handleLeftClick(idx)}
                    className={`w-full text-left px-3 py-2 border-2 border-[#111111] font-display font-black text-xs uppercase tracking-tight transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isActive || isLit
                        ? "bg-[#111111] text-[var(--page-bg)] shadow-brutal"
                        : isDimmed
                        ? "bg-[var(--block-2-bg)] text-[#111111]/35 border-[#111111]/25 opacity-40"
                        : "bg-[var(--block-2-bg)] text-[#111111] shadow-brutal-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#111111] text-[var(--page-bg)] text-[9px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{word}</span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full border border-[#111111] ${
                        isActive || isLit ? "bg-[var(--accent)]" : "bg-[#111111]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Section: Scaled Vertical Tangled Threads Canvas */}
          <div className="w-full h-[150px] my-2 relative px-2">
            <svg
              viewBox="0 0 340 150"
              className="w-full h-full overflow-visible pointer-events-none"
              aria-hidden="true"
            >
              {CONNECTIONS.map((conn) => {
                const x1 = MOBILE_X[conn.leftIndex];
                const x2 = MOBILE_X[conn.rightIndex];
                const active = isConnectionActive(conn);
                const dimmed = hasSelection && !active;

                // Vertical cubic bezier flowing from top anchor (y=0) to bottom anchor (y=150)
                const d = `M ${x1} 0 C ${x1} 75, ${x2} 75, ${x2} 150`;

                return (
                  <g key={`m-conn-${conn.id}`}>
                    {active && (
                      <path
                        d={d}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="7"
                        strokeOpacity="0.45"
                        strokeLinecap="round"
                      />
                    )}
                    <path
                      d={d}
                      fill="none"
                      stroke="#111111"
                      strokeWidth={active ? 3 : 1.75}
                      strokeOpacity={active ? 1 : dimmed ? 0.12 : 0.65}
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={isDrawn || prefersReducedMotion ? "0" : "1"}
                      style={{
                        transition: prefersReducedMotion
                          ? "none"
                          : "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 0.2s ease, stroke-width 0.2s ease",
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Section: Root Causes */}
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-wider text-[#111111]/70 pb-1 border-b-2 border-[#111111]/20">
              <span>Root Causes (Bottom)</span>
              <span>Linked angles</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {RIGHT_WORDS.map((word, idx) => {
                const isActive = activeRight === idx;
                const isLit = isRightHighlighted(idx);
                const isDimmed = hasSelection && !isActive && !isLit;

                return (
                  <button
                    key={`m-r-${word}`}
                    type="button"
                    onClick={() => handleRightClick(idx)}
                    className={`w-full text-left px-3 py-2 border-2 border-[#111111] font-display font-black text-xs uppercase tracking-tight transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isActive || isLit
                        ? "bg-[#111111] text-[var(--page-bg)] shadow-brutal"
                        : isDimmed
                        ? "bg-[var(--block-2-bg)] text-[#111111]/35 border-[#111111]/25 opacity-40"
                        : "bg-[var(--block-2-bg)] text-[#111111] shadow-brutal-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#111111] text-[var(--page-bg)] text-[9px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{word}</span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full border border-[#111111] ${
                        isActive || isLit ? "bg-[var(--accent)]" : "bg-[#111111]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* One short line under the chart */}
        <div className="text-center">
          <p className="font-mono font-bold text-xs sm:text-base text-[#111111] uppercase tracking-wide inline-block bg-[#111111]/10 px-4 py-2 border-2 border-[#111111] shadow-brutal-sm">
            A strong opening is the cheapest thing to fix, so we test three.
          </p>
        </div>
      </div>

      {/* Decorative Scalloped Bottom Edge Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          className="w-full h-3 text-[#111111] fill-current"
          aria-hidden="true"
        >
          <path d="M0,0 Q15,12 30,0 Q45,12 60,0 Q75,12 90,0 Q105,12 120,0 Q135,12 150,0 Q165,12 180,0 Q195,12 210,0 Q225,12 240,0 Q255,12 270,0 Q285,12 300,0 Q315,12 330,0 Q345,12 360,0 Q375,12 390,0 Q405,12 420,0 Q435,12 450,0 Q465,12 480,0 Q495,12 510,0 Q525,12 540,0 Q555,12 570,0 Q585,12 600,0 Q615,12 630,0 Q645,12 660,0 Q675,12 690,0 Q705,12 720,0 Q735,12 750,0 Q765,12 780,0 Q795,12 810,0 Q825,12 840,0 Q855,12 870,0 Q885,12 900,0 Q915,12 930,0 Q945,12 960,0 Q975,12 990,0 Q1005,12 1020,0 Q1035,12 1050,0 Q1065,12 1080,0 Q1095,12 1110,0 Q1125,12 1140,0 Q1155,12 1170,0 Q1185,12 1200,0 L1200,12 L0,12 Z" />
        </svg>
      </div>

      {/* Draggable Die-Cut Stickers */}
      <ThreadChartStickers />
    </section>
  );
}
