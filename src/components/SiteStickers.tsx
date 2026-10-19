"use client";

import React from "react";
import { Sticker } from "./Sticker";
import {
  BoxingCatSticker,
  BatmanLogoSticker,
  BatCatSticker,
  AlienSticker,
  SpiderWebSticker,
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
    </div>
  );
}

export function ThreadChartStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 4. Batcat in Batman cowl - Top-right of Thread Chart */}
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
    </div>
  );
}

export function PricingStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {/* 5. Green Alien Head - Top-right edge of pricing */}
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
    </div>
  );
}
