"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { RotatingBadge } from "./RotatingBadge";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

// Defer draggable sticker pack physics until after first paint
const HeroStickerPack = dynamic(
  () => import("./DraggableSticker").then((mod) => mod.HeroStickerPack),
  { ssr: false }
);

interface StudioHeroProps {
  onScrollToWork?: () => void;
}

export function StudioHero({ onScrollToWork }: StudioHeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  // 3D Tilt toward pointer on hero feature box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;

    setCardTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden bg-[var(--page-bg)] pt-12 pb-24 sm:pt-20 sm:pb-36 border-b-2 border-[var(--border)] transition-colors">
      {/* Background Halftone Texture */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none z-0" />

      {/* Draggable Editorial Badges Pack */}
      <HeroStickerPack />

      {/* Rotating Circular Sticker Badge ("FERNUM ADPASS • MONTHLY ADS THAT SELL •") */}
      <div className="absolute right-4 top-6 sm:right-12 sm:top-12 z-20 pointer-events-none hidden md:block">
        <RotatingBadge text="FERNUM ADPASS • MONTHLY ADS THAT SELL • " />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Left Content: Explicit Value Proposition Within 5 Seconds */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--block-2-fg)] text-xs font-mono font-bold uppercase tracking-wider shadow-brutal">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span>For D2C and E-Commerce Brands Running Paid Social</span>
            </div>

            {/* Concrete Oversized Headline */}
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.93]">
              MONTHLY VIDEO ADS <br />
              <span className="text-[var(--accent)]">THAT SELL.</span>
            </h1>

            {/* Clear Concrete Supporting Explanation */}
            <p className="text-[17px] sm:text-xl text-[var(--page-fg)]/85 font-normal tracking-tight max-w-xl leading-relaxed">
              We write, produce, and edit 1 to 3 video ads for your brand every month. Each ad includes 3 alternate opening hooks to test in your paid campaigns. Delivered in Full HD across 9:16, 1:1, and 16:9. Plans from $499/mo.
            </p>

            {/* Short Line Above Book a Call */}
            <div className="pt-2">
              <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] bg-[var(--block-2-bg)] py-1 px-3 border border-[var(--border)] inline-block mb-3 shadow-brutal-sm">
                {siteConfig.callMinutes}-minute call. Bring your product and your current ads.
              </p>

              {/* Action Buttons: Book a Call & See Concept Ads */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={siteConfig.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="book"
                  onClick={() => trackEvent("Book a Call Click", { location: "hero" })}
                  className="btn-squish btn-magnetic h-[52px] px-8 bg-[var(--accent)] text-[var(--accent-fg)] font-display font-black text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2.5 cursor-pointer hover:opacity-95"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/work"
                  className="btn-squish btn-magnetic h-[52px] px-8 bg-[var(--block-2-bg)] hover:bg-[var(--block-1-bg)] text-[var(--block-2-fg)] hover:text-[var(--block-1-fg)] font-display font-black text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>See our work</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                </Link>
              </div>
            </div>

            {/* 3 Concrete Value Points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t-2 border-[var(--border)]/20 text-xs font-mono font-bold uppercase text-[var(--page-fg)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>3 Hooks Per Ad</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>9:16 + 1:1 + 16:9</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-[var(--border)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>2 Revisions Included</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilt Feature Block Summarizing Subscription Deliverables */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transition: "transform 0.1s ease-out",
              }}
              className="tilt-card w-full max-w-md bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-7 sm:p-9 shadow-brutal-xl relative"
            >
              {/* Badge */}
              <div className="flex items-center justify-between border-b border-[var(--block-4-fg)]/20 pb-4 mb-6">
                <span className="text-[11px] font-mono uppercase font-black px-2.5 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)]">
                  MONTHLY ADPASS
                </span>
                <span className="text-xs font-mono text-[var(--block-4-fg)]/70">
                  Plans from $499/mo
                </span>
              </div>

              {/* Concrete Summary of What Brands Receive */}
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--block-4-fg)]/20">
                  <span className="text-[var(--block-4-fg)]/70">Monthly Volume</span>
                  <span className="font-bold text-[var(--block-4-fg)]">1 to 3 Complete Ads</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--block-4-fg)]/20">
                  <span className="text-[var(--block-4-fg)]/70">A/B Testing</span>
                  <span className="font-bold text-[var(--accent)]">3 Alternate Hooks / Ad</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--block-4-fg)]/20">
                  <span className="text-[var(--block-4-fg)]/70">Aspect Ratios</span>
                  <span className="font-bold text-[var(--block-4-fg)]">9:16, 1:1, 16:9</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--block-4-fg)]/20">
                  <span className="text-[var(--block-4-fg)]/70">Turnaround</span>
                  <span className="font-bold text-[var(--block-4-fg)]">About 2 to 3 Weeks</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--block-4-fg)]/20">
                  <span className="text-[var(--block-4-fg)]/70">Commercial Usage</span>
                  <span className="font-bold text-[var(--block-4-fg)] text-right">Commercial use of delivered ads included</span>
                </div>
              </div>

              <div className="p-3.5 bg-[var(--block-4-fg)]/10 border border-[var(--block-4-fg)]/20 text-xs font-mono text-[var(--block-4-fg)]/90">
                <div className="font-bold text-[var(--accent)] mb-1">Human Creative Direction:</div>
                Every ad is planned, scripted and reviewed by the Fernum team before delivery.
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--block-4-fg)]/20 flex flex-col gap-1 text-xs font-mono text-[var(--block-4-fg)]/70">
                <div className="flex items-center justify-between">
                  <span>Predictable monthly billing</span>
                  <span className="text-[var(--accent)] font-bold">✓ Cancel Anytime</span>
                </div>
                <div className="text-[11px] opacity-80 pt-1">
                  Cancel anytime. Cancellation takes effect at the end of the current billing period.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
