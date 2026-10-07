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

  React.useEffect(() => {
    const handleReset = () => {
      setPosition({ x: initialX, y: initialY });
    };
    window.addEventListener("fernum-reset-stickers", handleReset);
    return () => window.removeEventListener("fernum-reset-stickers", handleReset);
  }, [initialX, initialY]);

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
        {/* Sticker 1: Creator Shock / Gasp Hook Face (Round Die-Cut Badge) */}
        <DraggableSticker id="gasp-face-sticker" initialX={380} initialY={15} rotation={9}>
          <div className="w-18 h-18 rounded-full bg-[var(--sticker-1)] border-2 border-[var(--border)] shadow-brutal flex flex-col items-center justify-center p-1.5 relative hover:scale-105 transition-transform group">
            <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" stroke="currentColor">
              <circle cx="32" cy="32" r="27" fill="#FACC15" stroke="#000" strokeWidth="2.5" />
              {/* Graphic Sunglasses */}
              <rect x="14" y="20" width="16" height="11" rx="2" fill="#000" stroke="#000" />
              <rect x="34" y="20" width="16" height="11" rx="2" fill="#000" stroke="#000" />
              <line x1="30" y1="25" x2="34" y2="25" stroke="#000" strokeWidth="3" />
              {/* Shocked Open Mouth */}
              <ellipse cx="32" cy="43" rx="6.5" ry="9" fill="#000" />
              <ellipse cx="32" cy="46" rx="4.5" ry="3" fill="#EF4444" />
            </svg>
            <span className="absolute -bottom-2 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-[var(--border)] whitespace-nowrap shadow-xs">
              0-3s GASP HOOK
            </span>
          </div>
        </DraggableSticker>

        {/* Sticker 2: 35mm Cinema Camera Graphic (Rectangular Cutout Shape) */}
        <DraggableSticker id="cinema-cam-sticker" initialX={760} initialY={15} rotation={-6}>
          <div className="relative bg-[#18181B] text-white border-2 border-[var(--border)] p-2.5 shadow-brutal hover:shadow-brutal-xl transition-all w-[155px] rounded-sm">
            {/* Top Hot Shoe */}
            <div className="absolute -top-2.5 left-4 w-7 h-2.5 bg-[#27272A] border-2 border-b-0 border-[var(--border)] rounded-t-xs" />
            
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] font-mono font-black text-red-400">REC ● 1080p</span>
              </div>
              <span className="text-[8px] font-mono opacity-60">60FPS</span>
            </div>

            {/* Camera Lens */}
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#38BDF8] border-2 border-[var(--border)] flex items-center justify-center shadow-inner relative my-1">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black/70 border border-white/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                </div>
              </div>
              <span className="absolute bottom-1 text-[7px] font-mono font-bold text-white/70">f/1.4</span>
            </div>

            <div className="text-center mt-1">
              <span className="text-[10px] font-display font-black tracking-wider uppercase text-[var(--accent)] block leading-none">
                FERNUM CINEMA
              </span>
            </div>
          </div>
        </DraggableSticker>

        {/* Sticker 3: Director Clapperboard / Film Slate */}
        <DraggableSticker id="clapper-sticker" initialX={1080} initialY={80} rotation={10}>
          <div className="relative bg-white text-black border-2 border-[var(--border)] w-[145px] shadow-brutal hover:shadow-brutal-xl transition-all">
            {/* Zebra Clapper Top */}
            <div className="h-5 border-b-2 border-[var(--border)] overflow-hidden flex items-center bg-black">
              <div className="w-full h-full flex transform -skew-x-12">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? "bg-white" : "bg-black"}`} />
                ))}
              </div>
            </div>
            
            {/* Slate Body */}
            <div className="p-2 space-y-1 font-mono">
              <div className="flex justify-between items-center text-[8px] font-black uppercase border-b border-black/20 pb-0.5">
                <span>SCENE: 01</span>
                <span className="text-[var(--accent)]">9:16 CUT</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black py-0.5">
                <span className="text-[7px] opacity-70">TAKE:</span>
                <span className="bg-black text-white px-1 text-[8px]">03 [WIN]</span>
              </div>
              <div className="text-[7px] font-bold text-center pt-0.5 opacity-80 uppercase tracking-tight border-t border-black/20">
                PROD: FERNUM ADPASS
              </div>
            </div>
          </div>
        </DraggableSticker>

        {/* Sticker 4: Founder / Creator Winking Face */}
        <DraggableSticker id="founder-face-sticker" initialX={20} initialY={110} rotation={-12}>
          <div className="w-18 h-18 rounded-full bg-[var(--sticker-2)] border-2 border-[var(--border)] shadow-brutal flex flex-col items-center justify-center p-1.5 relative hover:scale-105 transition-transform text-white">
            <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" stroke="currentColor">
              <circle cx="32" cy="32" r="27" fill="var(--sticker-2)" stroke="#000" strokeWidth="2.5" />
              {/* Wink Eye */}
              <path d="M16 26 Q 22 20 28 26" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Wide Eye */}
              <circle cx="44" cy="24" r="5" fill="#000" />
              <circle cx="46" cy="22" r="1.5" fill="#fff" />
              {/* Confident Smile */}
              <path d="M20 40 Q 32 50 46 36" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="absolute -bottom-2 bg-black text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-[var(--border)] whitespace-nowrap shadow-xs">
              FOUNDER POV
            </span>
          </div>
        </DraggableSticker>

        {/* Sticker 5: Camera Viewfinder Safe-Zone Reticle */}
        <DraggableSticker id="viewfinder-sticker" initialX={500} initialY={460} rotation={4}>
          <div className="w-[145px] h-[78px] bg-black/90 text-white border-2 border-[var(--border)] p-2 relative shadow-brutal flex flex-col justify-between">
            {/* Corner Brackets */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[var(--accent)]" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[var(--accent)]" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[var(--accent)]" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--accent)]" />

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3.5 h-[1px] bg-white/40" />
              <div className="h-3.5 w-[1px] bg-white/40 absolute" />
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono font-black">
              <span className="text-red-400">● 00:03.00</span>
              <span className="opacity-70">ISO 800</span>
            </div>

            <div className="flex justify-between items-end text-[7px] font-mono">
              <span className="opacity-70">SAFE ZONE</span>
              <span className="text-[var(--accent)] font-bold">9:16 TIKTOK</span>
            </div>
          </div>
        </DraggableSticker>

        {/* Sticker 6: 3-Hook Film Strip Negative */}
        <DraggableSticker id="film-strip-sticker" initialX={1120} initialY={260} rotation={-9}>
          <div className="w-13 bg-black text-white border-2 border-[var(--border)] p-1 shadow-brutal flex flex-col justify-between h-[155px]">
            <div className="flex justify-between px-0.5 border-b border-white/20 pb-0.5">
              <div className="w-1 h-1 bg-white/70" />
              <span className="text-[6px] font-mono font-bold">9:16</span>
              <div className="w-1 h-1 bg-white/70" />
            </div>

            <div className="space-y-1 my-auto">
              <div className="bg-[#222] border border-white/30 h-8 flex items-center justify-center text-[7px] font-mono font-black text-[var(--accent)]">
                HOOK A
              </div>
              <div className="bg-[#222] border border-white/30 h-8 flex items-center justify-center text-[7px] font-mono font-black text-yellow-300">
                HOOK B
              </div>
              <div className="bg-[#222] border border-white/30 h-8 flex items-center justify-center text-[7px] font-mono font-black text-green-400">
                HOOK C
              </div>
            </div>

            <div className="flex justify-between px-0.5 border-t border-white/20 pt-0.5">
              <div className="w-1 h-1 bg-white/70" />
              <span className="text-[5px] font-mono opacity-60">FERNUM</span>
              <div className="w-1 h-1 bg-white/70" />
            </div>
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
        {/* Pricing Sticker 1: Clapperboard Mini */}
        <DraggableSticker id="pricing-clapper" initialX={80} initialY={80} rotation={-8}>
          <div className="bg-white text-black border-2 border-[var(--border)] p-2 shadow-brutal hover:scale-105 transition-transform w-[120px] font-mono">
            <div className="text-[8px] font-black uppercase text-[var(--accent)] border-b border-black/20 pb-0.5">
              SLATE: 1-3 ADS
            </div>
            <div className="text-[9px] font-black pt-1">
              CANCEL ANYTIME
            </div>
          </div>
        </DraggableSticker>

        {/* Pricing Sticker 2: Camera Lens Circle */}
        <DraggableSticker id="pricing-lens" initialX={1120} initialY={90} rotation={9}>
          <div className="w-16 h-16 rounded-full bg-[#18181B] text-white border-2 border-[var(--border)] flex flex-col items-center justify-center shadow-brutal hover:scale-105 transition-transform">
            <span className="text-red-500 text-[8px] font-mono font-black">● 1080p</span>
            <span className="text-[8px] font-mono font-black text-[var(--accent)]">3 HOOKS</span>
          </div>
        </DraggableSticker>

        {/* Pricing Sticker 3: Viewfinder Safe Zone */}
        <DraggableSticker id="pricing-viewfinder" initialX={90} initialY={560} rotation={6}>
          <div className="bg-black text-white border-2 border-[var(--border)] px-2.5 py-1.5 font-mono text-[9px] font-bold shadow-brutal flex items-center gap-1.5 hover:scale-105 transition-transform">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span>9:16 + 1:1 + 16:9</span>
          </div>
        </DraggableSticker>
      </div>
    </div>
  );
}
