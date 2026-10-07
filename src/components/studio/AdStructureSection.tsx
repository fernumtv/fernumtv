"use client";

import React, { useState } from "react";
import { Play, Sparkles, Target, ShieldCheck, Tag, ArrowRight } from "lucide-react";

interface StructureStage {
  id: string;
  name: string;
  timestamp: string;
  share: string;
  goal: string;
  description: string;
  whatItDoes: string;
  example: string;
}

const STAGES: StructureStage[] = [
  {
    id: "hook",
    name: "Hook",
    timestamp: "0:00 - 0:03",
    share: "First 3s",
    goal: "Stop the scroll",
    description: "The visual and audio disruption that earns the viewer's attention before their thumb moves.",
    whatItDoes: "Separates curious shoppers from casual scrollers by addressing an immediate pain point, visual oddity, or bold question.",
    example: '"Stop using foaming cleansers if your skin feels tight after washing."',
  },
  {
    id: "promise",
    name: "Promise",
    timestamp: "0:03 - 0:08",
    share: "Next 5s",
    goal: "State the outcome",
    description: "A single, clear claim about the result your product delivers for the customer.",
    whatItDoes: "Tells the viewer exactly what changes when they use this product, without buried claims or confusing specifications.",
    example: '"This barrier-repair serum rebuilds hydration in 7 days without clogging pores."',
  },
  {
    id: "proof",
    name: "Proof",
    timestamp: "0:08 - 0:16",
    share: "Middle 8s",
    goal: "Demonstrate belief",
    description: "Visual evidence that backs up the promise with texture, breakdown, or side-by-side comparison.",
    whatItDoes: "Overcomes buyer skepticism by showing how the formulation works, macro ingredient absorption, or visible before/after texture.",
    example: '"Watch how lightweight lipids melt directly into dehydrated surface skin."',
  },
  {
    id: "offer",
    name: "Offer",
    timestamp: "0:16 - 0:21",
    share: "Next 5s",
    goal: "Give a reason to buy now",
    description: "The promotional incentive, guarantee, or bundle pricing that lowers the friction of purchase.",
    whatItDoes: "Gives someone who wants the product a rational financial reason to complete checkout today instead of waiting.",
    example: '"Try the Starter Bottle with free shipping and a 30-day empty-bottle guarantee."',
  },
  {
    id: "cta",
    name: "Call to Action",
    timestamp: "0:21 - 0:25",
    share: "Final 4s",
    goal: "Tell them where to tap",
    description: "A direct instruction guiding the viewer to the exact next step on the screen.",
    whatItDoes: "Removes decision fatigue with a clean end card showing product packaging and an unmissable link cue.",
    example: '"Tap Shop Now below to claim your bottle while current batches last."',
  },
];

export function AdStructureSection() {
  const [activeStageId, setActiveStageId] = useState<string>("hook");
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section id="structure" className="py-24 sm:py-32 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Creative Architecture</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            HOW WE THINK ABOUT ADS
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal leading-relaxed max-w-2xl">
            Direct-response video is not filmmaking. Every second exists to move a viewer from indifference to checkout. Tap any segment below to inspect the anatomy of our ads.
          </p>
        </div>

        {/* Interactive Concept Ad Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Timeline Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Timeline Bar */}
            <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-4 sm:p-6 shadow-brutal">
              <div className="flex items-center justify-between text-xs font-mono font-bold opacity-70 uppercase tracking-wider mb-3">
                <span>Timeline: 25-Second Concept Ad</span>
                <span className="text-[var(--block-2-fg)]">Total Duration: 0:25</span>
              </div>

              {/* Segmented Timeline Buttons */}
              <div className="grid grid-cols-5 gap-1.5 h-14 sm:h-16 p-1 bg-[var(--page-bg)] border-2 border-[var(--border)]">
                {STAGES.map((stage) => {
                  const isActive = stage.id === activeStageId;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveStageId(stage.id)}
                      onMouseEnter={() => setActiveStageId(stage.id)}
                      aria-label={`Inspect ${stage.name} section (${stage.timestamp})`}
                      className={`relative flex flex-col items-center justify-center transition-all cursor-pointer font-mono font-bold text-xs uppercase ${
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-sm font-black"
                          : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] hover:bg-[var(--border)]/10"
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs truncate px-1">{stage.name}</span>
                      <span className="text-[9px] opacity-75 hidden sm:block">{stage.share}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-between text-[11px] font-mono opacity-70">
                <span>0:00 (Scroll stop)</span>
                <span>0:15 (Belief established)</span>
                <span>0:25 (Action taken)</span>
              </div>
            </div>

            {/* List of 5 Segments for Fast Mobile & Desktop Tapping */}
            <div className="space-y-2.5">
              {STAGES.map((stage, idx) => {
                const isActive = stage.id === activeStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    className={`w-full text-left p-4 sm:p-5 border-2 border-[var(--border)] transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isActive
                        ? "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] shadow-brutal translate-x-1"
                        : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--block-2-bg)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-none border-2 border-[var(--border)] flex items-center justify-center font-display font-black text-xs ${
                          isActive ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)]"
                        }`}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="font-display font-black text-base sm:text-lg uppercase">
                          {stage.name}
                        </div>
                        <div className="text-xs font-mono opacity-70">{stage.goal}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold bg-[var(--page-bg)] text-[var(--page-fg)] px-2.5 py-1 border border-[var(--border)]">
                        {stage.timestamp}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Breakdown Card for the Selected Segment */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-6 sm:p-8 shadow-brutal-xl relative overflow-hidden">
              {/* Concept Ad Badge */}
              <div className="flex items-center justify-between border-b border-[var(--block-4-fg)]/20 pb-4 mb-6">
                <span className="px-2.5 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] font-mono font-bold text-[10px] uppercase tracking-wider">
                  Concept Ad Structure
                </span>
                <span className="text-xs font-mono opacity-70">
                  {activeStage.timestamp}
                </span>
              </div>

              {/* Title & Goal */}
              <div className="mb-6">
                <div className="text-xs font-mono text-[var(--accent)] uppercase font-bold tracking-widest mb-1">
                  Step Goal: {activeStage.goal}
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl uppercase text-[var(--block-4-fg)] tracking-tight">
                  {activeStage.name}
                </h3>
              </div>

              {/* Two or Three Sentences per Step (No Jargon) */}
              <div className="space-y-4 text-sm opacity-90 font-medium leading-relaxed mb-6">
                <p>{activeStage.description}</p>
                <p>{activeStage.whatItDoes}</p>
              </div>

              {/* Concrete Script Line Example */}
              <div className="bg-[var(--border)]/30 border border-[var(--block-4-fg)]/20 p-4 mb-6">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                  <span>Sample Script Line</span>
                </div>
                <blockquote className="text-xs sm:text-sm font-mono text-[var(--block-4-fg)] italic leading-normal">
                  {activeStage.example}
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[var(--block-4-fg)]/20 flex items-center justify-between text-xs font-mono opacity-80">
                <span>Scripting Rule: One clear idea per segment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
