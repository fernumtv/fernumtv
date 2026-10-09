"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DirectVideoCard, VideoCardData } from "./DirectVideoCard";

const PREVIEW_CARDS: VideoCardData[] = [
  {
    id: "card-1",
    adNumber: 1,
    category: "Synthetic 3D Motion",
    title: "Spatial Kinetic Artifact",
    caption: "High-velocity 3D product visual cutting into macro textures and dynamic lighting.",
    videoSrc: "/videos/ad-1.mp4",
    posterSrc: "/videos/ad-1.webp",
    rotation: "-rotate-1",
  },
  {
    id: "card-2",
    adNumber: 2,
    category: "Character Narrative & Comedy",
    title: "Office Dialogue Direct Response",
    caption: "Humorous character dialogue dramatizing old vs new product pain points.",
    videoSrc: "/videos/ad-animation.mp4",
    posterSrc: "/videos/ad-animation.webp",
    rotation: "rotate-1",
  },
  {
    id: "card-3",
    adNumber: 3,
    category: "Architecture & Tech",
    title: "Modular Geometry Reveal",
    caption: "Dynamic camera sweep highlighting structural form in under 15 seconds.",
    videoSrc: "/videos/ad-2.mp4",
    posterSrc: "/videos/ad-2.webp",
    rotation: "-rotate-0.5",
  },
];

export function HomeWorkPreview() {
  const [activeUnmutedId, setActiveUnmutedId] = useState<string | null>(null);

  const handleToggleMute = (id: string) => {
    setActiveUnmutedId((prev) => (prev === id ? null : id));
  };

  const [selectedFormat, setSelectedFormat] = useState<"9:16" | "1:1" | "16:9">("9:16");

  const FORMAT_DESCRIPTIONS = {
    "9:16": "TikTok, Instagram Reels & YouTube Shorts • Full-screen mobile immersive",
    "1:1": "Meta In-Feed, Instagram Carousel & Explore • Maximum square screen real estate",
    "16:9": "Desktop, YouTube Pre-Roll & Landscape Feeds • Cinematic widescreen pitch",
  };

  return (
    <section id="work" className="relative bg-[var(--block-3-bg)] text-[var(--block-3-fg)] py-20 sm:py-28 overflow-hidden border-t-2 border-[var(--border)] transition-colors">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--block-2-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
              <span>● Production Creative</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--block-3-fg)] tracking-tighter uppercase leading-[0.95] mb-2">
              OUR WORK
            </h2>
            <p className="text-[17px] text-[var(--block-3-fg)]/85 font-normal max-w-xl">
              Vertical video ads formatted for paid feeds. Every ad is delivered in all 3 formats.
            </p>
          </div>

          <Link
            href="/work"
            className="btn-squish btn-magnetic self-start sm:self-auto h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2"
          >
            <span>See our work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Aspect Ratio Switcher */}
        <div className="mb-10 p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
            <span className="text-[var(--accent)]">FORMAT ENGINE:</span>
            <span className="text-[var(--page-fg)]/80 text-[11px] hidden md:inline">
              {FORMAT_DESCRIPTIONS[selectedFormat]}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {(["9:16", "1:1", "16:9"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 border-2 border-[var(--border)] font-mono font-bold text-xs uppercase transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-brutal"
                    : "bg-[var(--block-2-bg)] text-[var(--block-2-fg)] hover:bg-[var(--border)]/15"
                }`}
              >
                {fmt === "9:16" ? "9:16 Vertical" : fmt === "1:1" ? "1:1 Square" : "16:9 Wide"}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {PREVIEW_CARDS.map((card) => (
            <DirectVideoCard
              key={card.id}
              card={card}
              activeUnmutedId={activeUnmutedId}
              onToggleMute={handleToggleMute}
            />
          ))}
        </div>

        {/* Bottom CTA to /work */}
        <div className="mt-12 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-[var(--block-2-bg)] hover:bg-[var(--accent)] text-[var(--block-2-fg)] hover:text-[var(--accent-fg)] font-display font-black text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Explore All Work & Full Ad Reels →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
