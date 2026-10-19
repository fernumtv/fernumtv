"use client";

import React from "react";
import { Sticker } from "./Sticker";
import {
  BoxingCatSticker,
  BatmanLogoSticker,
  BatCatSticker,
  AlienSticker,
  SpiderWebSticker,
  CurseTongueSticker,
  SpidermanSenseSticker,
  MewingEmojiSticker,
  AuraSticker,
} from "./stickers";

export function HeroStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 1. Spider Web with hanging spider - Top-right corner of hero */}
      <Sticker
        id="hero-spider-web"
        rotation={0}
        width={85}
        className="top-0 right-4 sm:top-0 sm:right-12 lg:right-20"
      >
        <SpiderWebSticker />
      </Sticker>

      {/* 2. Batman Batarang Logo - Top-left of hero */}
      <Sticker
        id="hero-batman-logo"
        rotation={-8}
        width={115}
        className="hidden sm:block top-16 left-6 lg:left-14"
      >
        <BatmanLogoSticker />
      </Sticker>

      {/* 3. Boxing Kitten with cap and red gloves - Lower-right of hero */}
      <Sticker
        id="hero-boxing-cat"
        rotation={-5}
        width={100}
        className="hidden md:block bottom-12 right-12 lg:right-24"
      >
        <BoxingCatSticker />
      </Sticker>

      {/* 4. +1000 AURA 8-bit Pixel Badge - Lower-left of hero */}
      <Sticker
        id="hero-aura"
        rotation={-6}
        width={125}
        className="hidden sm:block bottom-8 left-6 sm:left-12 lg:left-20"
      >
        <AuraSticker />
      </Sticker>
    </div>
  );
}

export function ThreadChartStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 5. Batcat in Batman cowl - Top-right of Thread Chart */}
      <Sticker
        id="thread-bat-cat"
        rotation={6}
        width={85}
        className="top-6 right-4 sm:top-8 sm:right-10 lg:right-16"
      >
        <BatCatSticker />
      </Sticker>

      {/* Spider Web - Hanging in top-left corner of orange section */}
      <Sticker
        id="thread-spider-web"
        rotation={0}
        width={75}
        className="hidden sm:block top-0 left-4 lg:left-10"
      >
        <SpiderWebSticker />
      </Sticker>

      {/* 6. Spider-Man Miles Morales Spider-Sense Alert - Lower-left of Thread Chart */}
      <Sticker
        id="thread-spiderman-sense"
        rotation={-7}
        width={100}
        className="hidden md:block bottom-8 left-6 sm:left-12 lg:left-20"
      >
        <SpidermanSenseSticker />
      </Sticker>

      {/* 7. Anime Curse Tongue - Top right near header */}
      <Sticker
        id="thread-curse-tongue"
        rotation={8}
        width={95}
        className="hidden sm:block top-6 right-28 sm:right-36 lg:right-48"
      >
        <CurseTongueSticker />
      </Sticker>
    </div>
  );
}

export function PricingStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 8. Green Alien Head - Top-right edge of pricing */}
      <Sticker
        id="pricing-alien"
        rotation={9}
        width={85}
        className="top-8 right-6 sm:top-12 sm:right-12 lg:right-24"
      >
        <AlienSticker />
      </Sticker>

      {/* Boxing Cat - Top-left edge of pricing */}
      <Sticker
        id="pricing-boxing-cat"
        rotation={-7}
        width={95}
        className="hidden sm:block top-6 left-4 sm:top-10 sm:left-10 lg:left-20"
      >
        <BoxingCatSticker />
      </Sticker>

      {/* 9. Mewing Chad Emoji (Shh / Quiet Confidence) - Lower-right of pricing */}
      <Sticker
        id="pricing-mewing-emoji"
        rotation={-6}
        width={95}
        className="hidden md:block bottom-8 right-8 sm:bottom-12 sm:right-16 lg:right-24"
      >
        <MewingEmojiSticker />
      </Sticker>
    </div>
  );
}

export function ProcessStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* Anime Curse Tongue - Top-right edge of Process section */}
      <Sticker
        id="process-curse-tongue"
        rotation={-8}
        width={100}
        className="hidden sm:block top-6 right-6 sm:right-16 lg:right-24"
      >
        <CurseTongueSticker />
      </Sticker>

      {/* Mewing Emoji - Lower-left edge of Process section */}
      <Sticker
        id="process-mewing-emoji"
        rotation={6}
        width={90}
        className="hidden md:block bottom-6 left-6 sm:left-12 lg:left-20"
      >
        <MewingEmojiSticker />
      </Sticker>
    </div>
  );
}
