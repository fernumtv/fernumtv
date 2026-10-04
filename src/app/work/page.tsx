"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { StudioWork } from "@/components/studio/StudioWork";
import { DirectVideoCard, VideoCardData } from "@/components/studio/DirectVideoCard";
import { BackToTop } from "@/components/studio/BackToTop";

const DIRECT_FEED_CARDS: VideoCardData[] = [
  {
    id: "work-card-1",
    adNumber: 1,
    category: "Synthetic 3D Motion",
    title: "Spatial Kinetic Artifact",
    caption: "High-velocity 3D product visuals cutting into macro textures and dynamic lighting transitions.",
    videoSrc: "/videos/ad-1.mp4",
    posterSrc: "/videos/ad-1.jpg",
    rotation: "-rotate-1",
  },
  {
    id: "work-card-2",
    adNumber: 2,
    category: "Character Narrative & Comedy",
    title: "Office Dialogue Direct Response",
    caption: "Comedic 2D narrative dramatizing relatable customer friction before introducing the upgrade.",
    videoSrc: "/videos/ad-animation.mp4",
    posterSrc: "/videos/ad-animation.jpg",
    rotation: "rotate-1",
  },
  {
    id: "work-card-3",
    adNumber: 3,
    category: "Architecture & Spatial",
    title: "Modular Geometry Reveal",
    caption: "Dynamic camera sweep highlighting structural form in under 15 seconds.",
    videoSrc: "/videos/ad-2.mp4",
    posterSrc: "/videos/ad-2.jpg",
    rotation: "-rotate-1",
  },
  {
    id: "work-card-4",
    adNumber: 4,
    category: "Brand Aesthetics",
    title: "Precision Spatial Lighting",
    caption: "Clean minimal aesthetic designed to stop feed scrollers on TikTok and Meta.",
    videoSrc: "/videos/ad-3.mp4",
    posterSrc: "/videos/ad-3.jpg",
    rotation: "rotate-0.5",
  },
];

export default function WorkPage() {
  const [activeUnmutedId, setActiveUnmutedId] = useState<string | null>(null);

  const handleToggleMute = (id: string) => {
    setActiveUnmutedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans">
      <StudioNavbar />

      <main className="py-12 sm:py-16">
        {/* Intro Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Creative Portfolio</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-4">
            OUR WORK
          </h1>
          <p className="text-lg sm:text-xl opacity-80 font-normal max-w-2xl leading-relaxed">
            Direct-response video ads, synthetic macro B-roll, 2D character narratives, and 3D product motion. All videos autoplay directly inside each card with single-tap audio.
          </p>
        </div>

        {/* Section 1: 4 Direct Cards Feed */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 bg-[var(--accent)] border border-[var(--border)]" />
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--page-fg)]">
              Latest Production Releases (Autoplay & Audio Mute/Unmute)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {DIRECT_FEED_CARDS.map((card) => (
              <DirectVideoCard
                key={card.id}
                card={card}
                activeUnmutedId={activeUnmutedId}
                onToggleMute={handleToggleMute}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Full Master Reel & Concept Ads Carousel */}
        <StudioWork />

        {/* Bottom CTA to Pricing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight">
                Want monthly ads engineered like this?
              </h3>
              <p className="text-xs font-mono opacity-75 mt-1">
                Plans start at $499/month. 2 revisions per ad, 3 alternate hooks. Cancel anytime. Cancellation takes effect at the end of the current billing period.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 shrink-0"
            >
              <span>See Subscription Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <BackToTop />
      <StudioFooter />
    </div>
  );
}
