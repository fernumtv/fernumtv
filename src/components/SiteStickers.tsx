"use client";

import React from "react";
import { Sticker } from "./Sticker";
import {
  LightningSticker,
  StarburstSticker,
  HookBubbleSticker,
  LipsLightningSticker,
  MeltingSmileySticker,
  CoolSunSticker,
} from "./stickers";

export function HeroStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 1. Pop Art Lips with Lightning Tongue - Top right of hero (Desktop & Mobile) */}
      <Sticker
        id="hero-lips"
        rotation={-6}
        width={95}
        className="top-6 right-4 sm:top-10 sm:right-12 lg:right-20"
      >
        <LipsLightningSticker />
      </Sticker>

      {/* 2. Cool Sun with Sunglasses - Left edge of hero (Desktop only) */}
      <Sticker
        id="hero-sun"
        rotation={10}
        width={85}
        className="hidden sm:block top-20 left-6 lg:left-14"
      >
        <CoolSunSticker />
      </Sticker>

      {/* 3. Clean Electric Yellow Spike - Lower right of hero (Desktop only) */}
      <Sticker
        id="hero-lightning"
        rotation={-12}
        width={65}
        className="hidden md:block bottom-16 right-12 lg:right-24"
      >
        <LightningSticker />
      </Sticker>
    </div>
  );
}

export function ThreadChartStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 4. Melting Acid Smiley Face - Right edge near thread chart (Desktop & Mobile) */}
      <Sticker
        id="thread-melting-smiley"
        rotation={8}
        width={85}
        className="top-6 right-4 sm:top-10 sm:right-10 lg:right-16"
      >
        <MeltingSmileySticker />
      </Sticker>

      {/* 5. Hook Comic Bubble - Left edge near thread chart (Desktop only) */}
      <Sticker
        id="thread-hook"
        rotation={-7}
        width={85}
        className="hidden sm:block top-8 left-4 lg:left-12"
      >
        <HookBubbleSticker />
      </Sticker>
    </div>
  );
}

export function PricingStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 6. Hook Bubble - Top-left edge of pricing (Desktop & Mobile) */}
      <Sticker
        id="pricing-hook"
        rotation={6}
        width={90}
        className="top-6 left-4 sm:top-12 sm:left-10 lg:left-20"
      >
        <HookBubbleSticker />
      </Sticker>

      {/* 7. Starburst - Top-right edge of pricing (Desktop only) */}
      <Sticker
        id="pricing-starburst"
        rotation={-8}
        width={80}
        className="hidden sm:block top-10 right-6 sm:top-14 sm:right-12 lg:right-24"
      >
        <StarburstSticker />
      </Sticker>
    </div>
  );
}
