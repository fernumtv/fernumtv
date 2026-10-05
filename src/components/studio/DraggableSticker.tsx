"use client";

import React, { useState, useRef } from "react";
import { playPopSound } from "@/lib/interactive/sound";

interface DraggableStickerProps {
  id: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  children: React.ReactNode;
  className?: string;
}

export function DraggableSticker({
  initialX,
  initialY,
  rotation = 0,
  children,
  className = "",
}: DraggableStickerProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0) return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    setIsDragging(true);
    playPopSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    setPosition({
      x: dragStartRef.current.initialX + deltaX,
      y: dragStartRef.current.initialY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      data-cursor="drag"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px) rotate(${
          isDragging ? rotation + 5 : rotation
        }deg) scale(${isDragging ? 1.1 : 1})`,
      }}
      className={`absolute z-30 select-none cursor-grab active:cursor-grabbing transition-shadow duration-150 ${
        isDragging ? "shadow-brutal-xl z-40" : "shadow-brutal hover:shadow-brutal-lg"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function HeroStickerPack() {
  return (
    <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className="relative w-full h-full max-w-7xl mx-auto pointer-events-auto">
        {/* Sticker 1: Smiley face round badge */}
        <DraggableSticker id="smiley-sticker" initialX={380} initialY={15} rotation={12}>
          <div className="w-13 h-13 rounded-full bg-[var(--sticker-2)] text-[var(--page-bg)] border-2 border-[var(--border)] flex items-center justify-center font-black text-2xl shadow-brutal-sm hover:scale-105 transition-transform">
            <span>☻</span>
          </div>
        </DraggableSticker>

        {/* Sticker 2: 3 Hooks per ad neon green badge */}
        <DraggableSticker id="hooks-badge" initialX={740} initialY={25} rotation={-5}>
          <div className="bg-[var(--sticker-3)] text-[var(--border)] border-2 border-[var(--border)] border-dashed px-3.5 py-1.5 font-mono font-black text-xs uppercase tracking-wider shadow-brutal-sm flex items-center gap-1.5 hover:scale-105 transition-transform">
            <span className="text-sm">⚡</span>
            <span>3 HOOKS / AD</span>
          </div>
        </DraggableSticker>

        {/* Sticker 3: Drag Me instructional indicator */}
        <DraggableSticker id="drag-arrow" initialX={500} initialY={470} rotation={6}>
          <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] px-3.5 py-1.5 font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-brutal-sm hover:scale-105 transition-transform">
            <span className="text-xs">↖</span>
            <span>DRAG & FLING ME</span>
          </div>
        </DraggableSticker>

        {/* Sticker 4: Starburst Top Performer (Yellow) */}
        <DraggableSticker id="top-performer" initialX={580} initialY={60} rotation={-9}>
          <div className="bg-[var(--sticker-1)] text-[var(--border)] border-2 border-[var(--border)] px-3.5 py-1.5 font-display font-black text-xs uppercase tracking-wider shadow-brutal-sm flex items-center gap-1 hover:scale-105 transition-transform">
            <span>★</span>
            <span>TOP PERFORMER</span>
          </div>
        </DraggableSticker>

        {/* Sticker 5: 48-72h Turnaround stamp */}
        <DraggableSticker id="turnaround-stamp" initialX={1060} initialY={440} rotation={-8}>
          <div className="bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] px-3.5 py-1.5 font-mono font-black text-xs uppercase tracking-wider shadow-brutal-sm flex items-center gap-1.5 hover:scale-105 transition-transform">
            <span>⏱</span>
            <span>48-72H DRAFTS</span>
          </div>
        </DraggableSticker>

        {/* Sticker 6: Formats pill */}
        <DraggableSticker id="formats-pill" initialX={660} initialY={480} rotation={4}>
          <div className="bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider shadow-brutal-sm hover:scale-105 transition-transform">
            <span>9:16 • 1:1 • 16:9</span>
          </div>
        </DraggableSticker>

        {/* Sticker 7: Retro Studio Barcode */}
        <DraggableSticker id="barcode-sticker" initialX={1120} initialY={240} rotation={-14}>
          <div className="bg-white text-black border-2 border-[var(--border)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-tighter shadow-brutal-sm flex flex-col items-center hover:scale-105 transition-transform">
            <span className="font-extrabold text-[13px] tracking-tight scale-y-125">||| | ||||| || |||</span>
            <span className="text-[8px] font-bold tracking-widest mt-0.5">FERNUM-ADS</span>
          </div>
        </DraggableSticker>

        {/* Sticker 8: 100% Commercial rights seal */}
        <DraggableSticker id="rights-seal" initialX={20} initialY={110} rotation={-12}>
          <div className="bg-[var(--sticker-2)] text-[var(--page-bg)] border-2 border-[var(--border)] px-3 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider shadow-brutal-sm hover:scale-105 transition-transform">
            <span>✓ COMMERCIAL USE</span>
          </div>
        </DraggableSticker>

        {/* Sticker 9: 2 Rounds of revisions badge */}
        <DraggableSticker id="revisions-badge" initialX={980} initialY={30} rotation={7}>
          <div className="bg-[var(--sticker-1)] text-[var(--border)] border-2 border-[var(--border)] px-3 py-1 font-mono font-extrabold text-[11px] uppercase tracking-wider shadow-brutal-sm hover:scale-105 transition-transform">
            <span>✦ 2 REVISIONS</span>
          </div>
        </DraggableSticker>

        {/* Sticker 10: Cancel Anytime stamp */}
        <DraggableSticker id="cancel-stamp" initialX={30} initialY={490} rotation={-6}>
          <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] px-3.5 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider shadow-brutal-sm flex items-center gap-1 hover:scale-105 transition-transform">
            <span>●</span>
            <span>CANCEL ANYTIME</span>
          </div>
        </DraggableSticker>

        {/* Sticker 11: Meta & TikTok ready pill */}
        <DraggableSticker id="meta-tiktok-pill" initialX={870} initialY={500} rotation={11}>
          <div className="bg-[var(--sticker-3)] text-[var(--border)] border-2 border-[var(--border)] px-3 py-1 font-mono font-extrabold text-[10px] uppercase tracking-wider shadow-brutal-sm hover:scale-105 transition-transform">
            <span>🔥 META + TIKTOK</span>
          </div>
        </DraggableSticker>

        {/* Sticker 12: Creative Director Review seal */}
        <DraggableSticker id="review-seal" initialX={1100} initialY={100} rotation={9}>
          <div className="w-14 h-14 rounded-full bg-[var(--sticker-1)] text-[var(--border)] border-2 border-[var(--border)] flex flex-col items-center justify-center font-mono font-black text-[9px] uppercase tracking-tight text-center leading-tight shadow-brutal-sm hover:scale-105 transition-transform">
            <span>TEAM</span>
            <span>PLANNED</span>
          </div>
        </DraggableSticker>
      </div>
    </div>
  );
}

export function PricingStickerPack() {
  return (
    <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className="relative w-full h-full max-w-7xl mx-auto pointer-events-auto">
        {/* Pricing Sticker 1: Best Value */}
        <DraggableSticker id="pricing-best-val" initialX={80} initialY={80} rotation={-8}>
          <div className="bg-[var(--sticker-1)] text-[var(--border)] border-2 border-[var(--border)] px-3.5 py-1.5 font-display font-black text-xs uppercase tracking-wider shadow-brutal hover:scale-105 transition-transform">
            <span>★ ZERO LOCK-IN</span>
          </div>
        </DraggableSticker>

        {/* Pricing Sticker 2: D2C Favorite */}
        <DraggableSticker id="pricing-d2c" initialX={1120} initialY={90} rotation={9}>
          <div className="bg-[var(--sticker-3)] text-[var(--border)] border-2 border-[var(--border)] px-3.5 py-1.5 font-mono font-black text-xs uppercase tracking-wider shadow-brutal hover:scale-105 transition-transform">
            <span>⚡ 3 HOOKS / CONCEPT</span>
          </div>
        </DraggableSticker>

        {/* Pricing Sticker 3: Drag Sticker prompt */}
        <DraggableSticker id="pricing-drag" initialX={90} initialY={560} rotation={6}>
          <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-brutal hover:scale-105 transition-transform">
            <span>↖ GRAB ME</span>
          </div>
        </DraggableSticker>

        {/* Pricing Sticker 4: Tested formats */}
        <DraggableSticker id="pricing-formats" initialX={1100} initialY={540} rotation={-6}>
          <div className="bg-[var(--sticker-2)] text-[var(--page-bg)] border-2 border-[var(--border)] px-3.5 py-1.5 font-mono font-bold text-[11px] uppercase tracking-wider shadow-brutal hover:scale-105 transition-transform">
            <span>FULL HD 9:16 + 1:1</span>
          </div>
        </DraggableSticker>
      </div>
    </div>
  );
}
