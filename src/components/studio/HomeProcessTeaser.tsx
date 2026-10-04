"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Video, CheckCircle2 } from "lucide-react";

export function HomeProcessTeaser() {
  const steps = [
    {
      num: "01",
      title: "Ideate & Script",
      desc: "We research your angles, craft 3 distinct opening hooks per ad concept, and submit complete scripts for your sign-off before rendering a single frame.",
      icon: Lightbulb,
      bgClass: "bg-[var(--block-1-bg)] text-[var(--block-1-fg)]",
      badgeBg: "bg-[var(--block-4-bg)] text-[var(--block-4-fg)]",
    },
    {
      num: "02",
      title: "Produce & Edit",
      desc: "Our pipeline synthesizes 3D product visuals and bespoke motion B-roll, cutting fast-paced direct-response sequences with pacing tuned for TikTok and Meta.",
      icon: Video,
      bgClass: "bg-[var(--block-2-bg)] text-[var(--block-2-fg)]",
      badgeBg: "bg-[var(--accent)] text-[var(--accent-fg)]",
    },
    {
      num: "03",
      title: "Ship & Iterate",
      desc: "You receive ready-to-run 9:16 vertical, 1:1 square, and 16:9 widescreen exports. 2 full revisions included per ad, plus cycle learnings for next month.",
      icon: CheckCircle2,
      bgClass: "bg-[var(--block-3-bg)] text-[var(--block-3-fg)]",
      badgeBg: "bg-[var(--block-4-bg)] text-[var(--block-4-fg)]",
    },
  ];

  return (
    <section className="relative bg-[var(--page-bg)] py-20 sm:py-24 border-t-2 border-[var(--border)] overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--block-2-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
              <span>● Systematic Delivery</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-2">
              HOW IT WORKS
            </h2>
            <p className="text-[17px] text-[var(--page-fg)]/80 font-normal max-w-xl">
              From creative brief to ready-to-scale ad creative in 3 straightforward steps.
            </p>
          </div>

          <Link
            href="/structure"
            className="btn-squish btn-magnetic self-start sm:self-auto h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2"
          >
            <span>See our structure</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Step Cards that rotate through the Vibe Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`${step.bgClass} border-2 border-[var(--border)] p-6 sm:p-8 shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-3xl sm:text-4xl opacity-50">
                      {step.num}
                    </span>
                    <div className={`w-10 h-10 ${step.badgeBg} border-2 border-[var(--border)] flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link to /structure */}
        <div className="mt-10 text-center">
          <Link
            href="/structure"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--page-fg)] hover:text-[var(--accent)] transition-colors"
          >
            <span>Read full creative methodology, concept timelines & expectations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
