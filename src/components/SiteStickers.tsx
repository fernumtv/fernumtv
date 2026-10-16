"use client";

import React from "react";
import { Sticker } from "./Sticker";
import {
  ClapperSticker,
  PlaySticker,
  EyeSticker,
  LightningSticker,
  StarburstSticker,
  ThumbsUpSticker,
  HookBubbleSticker,
  CassetteSticker,
} from "./stickers";

export function HeroStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 1. Clapperboard - Top right edge of hero (Desktop & Mobile) */}
      <Sticker
        id="hero-clapper"
        rotation={-8}
        width={85}
        className="top-6 right-4 sm:top-10 sm:right-12 lg:right-20"
      >
        <ClapperSticker />
      </Sticker>

      {/* 2. Lightning - Far left edge of hero (Desktop only) */}
      <Sticker
        id="hero-lightning"
        rotation={14}
        width={65}
        className="hidden sm:block top-24 left-6 lg:left-14"
      >
        <LightningSticker />
      </Sticker>
    </div>
  );
}

export function ThreadChartStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 3. Eye - Left edge near thread chart (Desktop only) */}
      <Sticker
        id="thread-eye"
        rotation={-6}
        width={80}
        className="hidden sm:block top-10 left-4 lg:left-12"
      >
        <EyeSticker />
      </Sticker>

      {/* 4. Starburst - Right edge near thread chart (Desktop & Mobile) */}
      <Sticker
        id="thread-starburst"
        rotation={9}
        width={75}
        className="top-8 right-4 sm:top-12 sm:right-10 lg:right-16"
      >
        <StarburstSticker />
      </Sticker>

      {/* 5. Cassette - Bottom right edge near thread chart (Desktop only) */}
      <Sticker
        id="thread-cassette"
        rotation={-5}
        width={80}
        className="hidden sm:block bottom-6 right-6 lg:right-16"
      >
        <CassetteSticker />
      </Sticker>
    </div>
  );
}

export function PricingStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 5. Hook Bubble - Top-left edge of pricing (Desktop & Mobile) */}
      <Sticker
        id="pricing-hook"
        rotation={7}
        width={85}
        className="top-6 left-4 sm:top-12 sm:left-10 lg:left-20"
      >
        <HookBubbleSticker />
      </Sticker>

      {/* 6. Play Button - Top-right edge of pricing (Desktop only) */}
      <Sticker
        id="pricing-play"
        rotation={-9}
        width={75}
        className="hidden sm:block top-10 right-6 sm:top-14 sm:right-12 lg:right-24"
      >
        <PlaySticker />
      </Sticker>
    </div>
  );
}
