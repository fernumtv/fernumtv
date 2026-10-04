"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface WorkItem {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  category: string;
  isRealResult?: boolean;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: "work-1",
    title: "LumaGlow: Barrier Repair Serum",
    description: "Clinical skincare B-roll with 3 pain-point hooks tested for winter redness.",
    videoSrc: "/samples/sample-1-skincare.mp4",
    category: "D2C Skincare",
    isRealResult: false,
  },
  {
    id: "work-2",
    title: "Verve Daily: Electrolyte Mineral Packets",
    description: "Fast-paced TikTok product reveal debunking afternoon energy drink crashes.",
    videoSrc: "/samples/sample-2-beverage.mp4",
    category: "Functional Beverage",
    isRealResult: false,
  },
  {
    id: "work-3",
    title: "AeroPro: Active Noise Cancelling Earbuds",
    description: "Direct acoustic frequency shock-value demo showing subway noise isolation.",
    videoSrc: "/samples/sample-3-tech.mp4",
    category: "Consumer Electronics",
    isRealResult: false,
  },
  {
    id: "work-4",
    title: "Kinetix: Posture Alignment Wear",
    description: "Ergonomic 3D anatomical breakdown solving desk worker lower back fatigue.",
    videoSrc: "/samples/sample-4-wellness.mp4",
    category: "Health & Apparel",
    isRealResult: false,
  },
  {
    id: "work-5",
    title: "BrewCraft: Nitro Cold Brew Pods",
    description: "High-contrast visual pour demonstration targeting coffee subscription buyers.",
    videoSrc: "/samples/sample-1-skincare.mp4",
    category: "Food & Beverage",
    isRealResult: false,
  },
];

export function InhouseWork() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="work" className="py-24 sm:py-32 bg-white border-t border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">
              Portfolio
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-950">
              Some of our work
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-3 rounded-full border border-neutral-300 hover:border-neutral-950 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-3 rounded-full border border-neutral-300 hover:border-neutral-950 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Row of Vertical Video Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory focus:outline-none"
        >
          {WORK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="w-[260px] sm:w-[300px] shrink-0 snap-start group"
            >
              {/* Vertical Video Card (9:16) */}
              <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/90 shadow-md group-hover:shadow-xl transition-all duration-300">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src={item.videoSrc} type="video/mp4" />
                </video>

                {/* Honest Label: Concept ad */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-white border border-white/20">
                    {item.isRealResult ? "Client Result" : "Concept ad"}
                  </span>
                </div>

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              </div>

              {/* Title & One-line Description Below Card */}
              <div className="pt-4 px-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  {item.category}
                </div>
                <h3 className="text-base font-bold text-neutral-950 leading-snug tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
