"use client";

import React from "react";
import { ArrowRight, FileText, CheckCircle, Rocket } from "lucide-react";

export function StudioProcess() {
  const blocks = [
    {
      num: "01",
      title: "BRIEF",
      shortLine: "Submit your store URL, product angle, and monthly offer in under 2 minutes.",
      bg: "bg-[var(--block-1-bg)]",
      textColor: "text-[var(--block-1-fg)]",
      borderColor: "border-[var(--border)]",
      shadowColor: "shadow-brutal-xl",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      num: "02",
      title: "SCRIPT AND APPROVE",
      shortLine: "Review 3 conversion-tested script concepts and hook angles within 24 hours.",
      bg: "bg-[var(--block-3-bg)]",
      textColor: "text-[var(--block-3-fg)]",
      borderColor: "border-[var(--border)]",
      shadowColor: "shadow-brutal-xl",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    {
      num: "03",
      title: "SHIP AND TEST HOOKS",
      shortLine: "Receive finished Full HD ads in 9:16, 1:1, and 16:9 ready to scale in 48 to 72 hours.",
      bg: "bg-[var(--block-4-bg)]",
      textColor: "text-[var(--block-4-fg)]",
      borderColor: "border-[var(--border)]",
      shadowColor: "shadow-brutal-xl",
      icon: <Rocket className="w-8 h-8 text-[var(--accent)]" />,
    },
  ];

  return (
    <section id="process" className="relative bg-[var(--page-bg)] text-[var(--page-fg)] py-24 sm:py-36 overflow-hidden border-t-2 border-[var(--border)]">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      {/* Oversized Word Partly Cropping at Screen Edge */}
      <div className="absolute top-0 left-0 -translate-x-8 -translate-y-8 pointer-events-none select-none z-0">
        <span className="font-display font-black text-[14vw] text-[var(--page-fg)]/[0.05] leading-none tracking-tighter uppercase whitespace-nowrap">
          PROCESS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--accent)] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-brutal">
            <span>● 3 Big Steps</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.93] mb-4">
            HOW FERNUM WORKS
          </h2>
          <p className="text-base sm:text-xl text-[var(--page-fg)]/75 font-normal leading-relaxed">
            From brief intake to tested hook variations in Full HD. No meetings, no fluff.
          </p>
        </div>

        {/* 3 Big Color Blocks (Orange, Green, Black) with One Short Line Each */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blocks.map((b) => (
            <div
              key={b.num}
              className={`${b.bg} ${b.textColor} border-2 ${b.borderColor} p-8 sm:p-10 flex flex-col justify-between ${b.shadowColor} hover:-translate-y-1 transition-all duration-200`}
            >
              <div>
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between pb-8 mb-8 border-b-2 border-current/20">
                  <span className="font-display font-black text-5xl sm:text-6xl tracking-tighter">
                    {b.num}
                  </span>
                  <div className="p-3 bg-current/15 border-2 border-current">
                    {b.icon}
                  </div>
                </div>

                {/* Big Title */}
                <h3 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-4 leading-none">
                  {b.title}
                </h3>

                {/* One Short Line */}
                <p className="text-base sm:text-lg font-medium leading-snug">
                  {b.shortLine}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="pt-8 mt-8 border-t-2 border-current/20 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                <span>Phase {b.num}</span>
                <span>Speed & Precision →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
