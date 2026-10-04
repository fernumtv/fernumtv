"use client";

import React from "react";
import { ArrowDown, ArrowRight, Play, Sparkles } from "lucide-react";

interface InhouseHeroProps {
  onOpenBookCall: () => void;
  onScrollToWork: () => void;
}

export function InhouseHero({ onOpenBookCall, onScrollToWork }: InhouseHeroProps) {
  return (
    <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Editorial Copy */}
          <div className="lg:col-span-7 space-y-8">
            {/* Small Fernum AdPass Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-800 text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
              <span>Fernum AdPass</span>
            </div>

            {/* Giant Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-neutral-950 leading-[1.02]">
              We make video ads that sell for D2C brands.
              <br />
              <span className="text-neutral-400 font-extrabold">Delivered every month.</span>
            </h1>

            {/* Single Supporting Line */}
            <p className="text-lg sm:text-2xl text-neutral-600 font-normal tracking-tight max-w-xl">
              We ideate, script, produce, edit and ship.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBookCall}
                className="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold rounded-full text-sm sm:text-base tracking-tight transition-all flex items-center gap-2.5 shadow-lg shadow-neutral-950/10 cursor-pointer hover:scale-[1.02]"
              >
                <span>Book a Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToWork}
                className="px-7 py-4 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-semibold rounded-full text-sm sm:text-base tracking-tight transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>See our work</span>
                <ArrowDown className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Micro specs note */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-500 uppercase tracking-wider">
              <span>• Full HD (9:16, 1:1, 16:9)</span>
              <span>• 3 Alternate Hooks</span>
              <span>• 2 Revisions</span>
            </div>
          </div>

          {/* Right Column: Side Collage of Vertical Sample Videos */}
          <div className="lg:col-span-5 relative">
            <div className="relative flex justify-center lg:justify-end items-center py-4">
              {/* Card 1: Main foreground vertical card */}
              <div className="relative w-[240px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-neutral-300 shadow-2xl bg-neutral-950 z-20 transform hover:scale-[1.02] transition-transform duration-300">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/samples/sample-1-skincare.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-white border border-white/20">
                    Concept ad
                  </span>
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <div className="text-xs font-bold leading-tight">LumaGlow: Barrier Repair</div>
                  <div className="text-[10px] text-neutral-300 truncate">Hook A: Direct Winter Redness Callout</div>
                </div>
              </div>

              {/* Card 2: Stacked background card (tilted behind) */}
              <div className="hidden sm:block absolute -right-4 top-8 w-[230px] aspect-[9/16] rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-neutral-900 z-10 opacity-75 transform rotate-3 hover:opacity-100 hover:rotate-0 transition-all duration-300">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/samples/sample-2-beverage.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-[10px] font-mono uppercase tracking-wider text-white">
                    Concept ad
                  </span>
                </div>
              </div>

              {/* Card 3: Stacked background card (tilted left behind) */}
              <div className="hidden sm:block absolute -left-6 bottom-4 w-[210px] aspect-[9/16] rounded-3xl overflow-hidden border border-neutral-200 shadow-lg bg-neutral-900 z-0 opacity-60 transform -rotate-6 hover:opacity-90 hover:rotate-0 transition-all duration-300">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/samples/sample-3-tech.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
