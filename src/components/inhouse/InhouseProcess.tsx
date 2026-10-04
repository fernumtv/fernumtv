"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function InhouseProcess() {
  const blocks = [
    {
      number: "01",
      title: "Knowledge Transfer",
      subtitle: "Brand, offer, audience, what campaigns this month",
      description:
        "What campaigns are we running this month? What core offer or discount are we pushing? Who is your ideal customer, and what problem does your product solve better than anyone else? We store your brand kit, guidelines, and tone into persistent memory so month 2 is even faster and more dialed in.",
      bullets: [
        "Brand kit, colors, font styling & voice guidelines",
        "Target customer avatar & core problem agitation",
        "Active monthly offers, promo codes & landing page URLs",
        "Competitor angles & past winning creative analysis",
      ],
    },
    {
      number: "02",
      title: "Creative Direction",
      subtitle: "Hook ideas, 3 alternate hooks per ad",
      description:
        "Every video ad succeeds or fails in the first 3 seconds on Meta and TikTok. We ideate high-converting angles and write 3 alternate hook variations for every approved ad script (e.g. Direct Problem, Curiosity Contrast, and UGC Social Proof) so you can test 3x the hooks for zero extra shoot cost.",
      bullets: [
        "3 high-impact script concepts tailored to paid social",
        "3 alternate hook openers generated per ad",
        "Clear 15 to 30 second shot list breakdown",
        "You approve the script before a single frame is generated",
      ],
    },
    {
      number: "03",
      title: "Execution & Delivery",
      subtitle: "Script, AI production, editing, 9:16 / 1:1 / 16:9 exports",
      description:
        "Once you approve the script, our hybrid AI engine and human creative team get to work. We generate cinematic visual shots, synthesize clean commercial voiceovers, add kinetic on-screen subtitles, and stitch everything via FFmpeg with human editor polish.",
      bullets: [
        "Delivered in 48 to 72 hours after script approval",
        "Full HD renders in 9:16 (Reels/TikTok), 1:1 (Feed), and 16:9",
        "2 revisions included per ad slot",
        "100% human creative director review before delivery",
      ],
    },
  ];

  return (
    <section id="process" className="py-24 sm:py-32 bg-neutral-50/60 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Workflow
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-950 mb-4">
            Process of Fernum
          </h2>
          <p className="text-base sm:text-xl text-neutral-600 font-normal leading-relaxed">
            A tight, predictable monthly pipeline built specifically for D2C brands running paid media.
          </p>
        </div>

        {/* Three Large Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blocks.map((block) => (
            <div
              key={block.number}
              className="bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Number & Tag */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                  <span className="text-3xl font-black tracking-tighter text-neutral-950">
                    {block.number}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Phase {block.number}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mb-2">
                  {block.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-500 mb-6 italic">
                  {block.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-8">
                  {block.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="pt-6 border-t border-neutral-100 space-y-2.5">
                {block.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
