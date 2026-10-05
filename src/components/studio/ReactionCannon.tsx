"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, Flame } from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playPopSound,
  playClickSound,
  playSuccessSound,
} from "@/lib/interactive/sound";

interface RisingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

export function ReactionCannon() {
  const [soundOn, setSoundOn] = useState(false);
  const [particles, setParticles] = useState<RisingEmoji[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      setTimeout(() => playSuccessSound(), 50);
    }
  };

  const handleShootEmoji = (emoji: string, e: React.MouseEvent<HTMLButtonElement>) => {
    playPopSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;

    const count = 6;
    const newItems: RisingEmoji[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji,
      x: originX + (Math.random() - 0.5) * 80,
      y: originY,
      rotation: (Math.random() - 0.5) * 45,
    }));

    setParticles((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
    }, 1800);
  };

  const handleResetStickers = () => {
    playPopSound();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fernum-reset-stickers"));
    }
  };

  return (
    <>
      {/* Rising Floating Particle Layer */}
      {particles.length > 0 && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                animation: `floatUpEmoji 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                transform: `rotate(${p.rotation}deg)`,
              }}
              className="absolute text-2xl select-none"
            >
              {p.emoji}
            </div>
          ))}
          <style jsx>{`
            @keyframes floatUpEmoji {
              0% {
                transform: translateY(0) scale(0.6) rotate(0deg);
                opacity: 1;
              }
              50% {
                opacity: 1;
                transform: translateY(-120px) scale(1.3) rotate(20deg);
              }
              100% {
                transform: translateY(-240px) scale(0.9) rotate(-20deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Floating Bottom Bar */}
      <aside
        aria-label="Interactive Controls"
        className="fixed bottom-4 left-4 sm:left-6 z-40 select-none"
      >
        <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-1.5 sm:p-2 shadow-brutal flex items-center gap-2 text-xs font-mono">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[var(--page-bg)] text-[var(--page-fg)] border border-[var(--border)] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="uppercase tracking-wider">CREATIVE ENGINE ACTIVE</span>
          </div>

          {/* Reaction Emojis */}
          <div className="flex items-center gap-1">
            {[
              { emoji: "🔥", label: "Fire" },
              { emoji: "⚡", label: "Lightning" },
              { emoji: "💸", label: "Money" },
              { emoji: "💀", label: "Dead" },
              { emoji: "🎯", label: "Bullseye" },
            ].map((btn) => (
              <button
                key={btn.emoji}
                type="button"
                onClick={(e) => handleShootEmoji(btn.emoji, e)}
                title={`Shoot ${btn.label}`}
                aria-label={`Reaction ${btn.label}`}
                className="w-8 h-8 flex items-center justify-center bg-[var(--page-bg)] hover:bg-[var(--accent)] text-sm border border-[var(--border)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                {btn.emoji}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-6 bg-[var(--border)] opacity-30 mx-0.5" />

          {/* SFX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundOn ? "Mute UI sounds" : "Enable tactile UI sounds"}
            aria-label={soundOn ? "Mute UI sounds" : "Enable tactile UI sounds"}
            className={`h-8 px-2.5 flex items-center gap-1.5 border border-[var(--border)] font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer ${
              soundOn
                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--border)]/10"
            }`}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            <span className="hidden sm:inline">{soundOn ? "SFX: ON" : "SFX: OFF"}</span>
          </button>

          {/* Reset Stickers */}
          <button
            type="button"
            onClick={handleResetStickers}
            title="Reset dragged stickers back to starting positions"
            aria-label="Reset stickers"
            className="h-8 px-2 bg-[var(--page-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] text-[var(--page-fg)] border border-[var(--border)] flex items-center gap-1 text-[10px] font-bold uppercase transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </aside>
    </>
  );
}
