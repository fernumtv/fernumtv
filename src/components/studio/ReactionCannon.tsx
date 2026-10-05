"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, Plus, X } from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playPopSound,
  playSuccessSound,
} from "@/lib/interactive/sound";

interface StampedSticker {
  id: string;
  label: string;
  subtext?: string;
  bg: string;
  fg: string;
  x: number;
  y: number;
  rotation: number;
  isDragging?: boolean;
}

const STICKER_TEMPLATES = [
  {
    id: "cooked",
    label: "COOKED",
    subtext: "0:00 - 0:03",
    bg: "var(--accent)",
    fg: "var(--accent-fg)",
  },
  {
    id: "rent-free",
    label: "RENT FREE",
    subtext: "PERMANENT CTR",
    bg: "var(--sticker-2)",
    fg: "#ffffff",
  },
  {
    id: "no-cap",
    label: "NO CAP",
    subtext: "100% RETENTION",
    bg: "var(--sticker-1)",
    fg: "#000000",
  },
  {
    id: "half-cam",
    label: "0.5x CAM",
    subtext: "MACRO REVEAL",
    bg: "var(--block-4-bg)",
    fg: "var(--block-4-fg)",
  },
  {
    id: "rec",
    label: "REC ●",
    subtext: "FRAME DROP",
    bg: "#EF4444",
    fg: "#ffffff",
  },
  {
    id: "three-hooks",
    label: "3 HOOKS / AD",
    subtext: "A/B TESTED",
    bg: "var(--sticker-3)",
    fg: "#000000",
  },
];

export function ReactionCannon() {
  const [soundOn, setSoundOn] = useState(false);
  const [userStickers, setUserStickers] = useState<StampedSticker[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });

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

  const handleStampSticker = (template: typeof STICKER_TEMPLATES[0], e: React.MouseEvent) => {
    playPopSound();

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 600;

    // Spawn near the middle of current viewport with slight random jitter
    const spawnX = Math.max(20, Math.min(windowWidth - 180, windowWidth / 2 - 80 + (Math.random() - 0.5) * 160));
    const spawnY = scrollY + Math.max(120, windowHeight / 2 - 40 + (Math.random() - 0.5) * 140);
    const rotation = (Math.random() - 0.5) * 18;

    const newSticker: StampedSticker = {
      id: `user-sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      label: template.label,
      subtext: template.subtext,
      bg: template.bg,
      fg: template.fg,
      x: spawnX,
      y: spawnY,
      rotation,
    };

    setUserStickers((prev) => [...prev, newSticker]);
  };

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    const sticker = userStickers.find((s) => s.id === id);
    if (!sticker) return;

    dragOffsetRef.current = {
      x: e.clientX - sticker.x,
      y: e.clientY - (sticker.y - (typeof window !== "undefined" ? window.scrollY : 0)),
    };

    setActiveDragId(id);
    playPopSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeDragId) return;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const nextX = e.clientX - dragOffsetRef.current.x;
    const nextY = scrollY + (e.clientY - dragOffsetRef.current.y);

    setUserStickers((prev) =>
      prev.map((s) => (s.id === activeDragId ? { ...s, x: nextX, y: nextY } : s))
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeDragId) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setActiveDragId(null);
  };

  const handleRemoveSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    setUserStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetAll = () => {
    playPopSound();
    setUserStickers([]);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fernum-reset-stickers"));
    }
  };

  return (
    <>
      {/* User-Stamped Draggable Stickers on Canvas */}
      {userStickers.map((s) => {
        const isDragging = activeDragId === s.id;

        return (
          <div
            key={s.id}
            onPointerDown={(e) => handlePointerDown(s.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: "absolute",
              left: `${s.x}px`,
              top: `${s.y}px`,
              zIndex: isDragging ? 9999 : 80,
              transform: `rotate(${isDragging ? s.rotation + 4 : s.rotation}deg) scale(${isDragging ? 1.08 : 1})`,
              backgroundColor: s.bg,
              color: s.fg,
              touchAction: "none",
            }}
            className="group select-none cursor-grab active:cursor-grabbing border-2 border-[var(--border)] p-2.5 shadow-brutal-lg transition-transform inline-flex flex-col items-start gap-0.5 animate-in zoom-in-90 duration-150"
          >
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-display font-black text-sm uppercase tracking-tight leading-none whitespace-nowrap">
                {s.label}
              </span>
              <button
                type="button"
                onClick={(e) => handleRemoveSticker(s.id, e)}
                title="Remove sticker"
                aria-label="Remove sticker"
                className="w-4 h-4 rounded-full bg-black/30 hover:bg-black text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
            {s.subtext && (
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-85 leading-none">
                {s.subtext}
              </span>
            )}
          </div>
        );
      })}

      {/* Streetwear / Agency Sticker Dock */}
      <aside
        aria-label="Studio Sticker Dock"
        className="fixed bottom-4 left-4 sm:left-6 z-40 select-none max-w-[calc(100vw-32px)]"
      >
        <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-1.5 sm:p-2 shadow-brutal flex items-center gap-1.5 sm:gap-2 text-xs font-mono">
          {/* Dock Label */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[var(--page-bg)] text-[var(--page-fg)] border border-[var(--border)] font-bold text-[10px] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>STICKER VAULT</span>
          </div>

          {/* Sticker Stamp Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {STICKER_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={(e) => handleStampSticker(tmpl, e)}
                title={`Stamp "${tmpl.label}" onto screen`}
                aria-label={`Stamp ${tmpl.label}`}
                className="px-2 py-1 bg-[var(--page-bg)] hover:bg-[var(--accent)] text-[var(--page-fg)] hover:text-[var(--accent-fg)] border border-[var(--border)] font-mono font-black text-[10px] uppercase tracking-wider shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 opacity-60" />
                <span>{tmpl.label}</span>
              </button>
            ))}
          </div>

          <div className="w-[1px] h-6 bg-[var(--border)] opacity-30 mx-0.5 shrink-0" />

          {/* SFX Audio Engine Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundOn ? "Mute studio sounds" : "Enable tactile sounds"}
            aria-label={soundOn ? "Mute studio sounds" : "Enable tactile sounds"}
            className={`h-7 sm:h-8 px-2 sm:px-2.5 flex items-center gap-1.5 border border-[var(--border)] font-mono font-bold uppercase text-[10px] tracking-wider shrink-0 transition-colors cursor-pointer ${
              soundOn
                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                : "bg-[var(--page-bg)] text-[var(--page-fg)] hover:bg-[var(--border)]/10"
            }`}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            <span className="hidden sm:inline">{soundOn ? "SFX" : "MUTE"}</span>
          </button>

          {/* Reset All */}
          <button
            type="button"
            onClick={handleResetAll}
            title="Clear stamped stickers & reset board"
            aria-label="Clear stickers"
            className="h-7 sm:h-8 px-2 bg-[var(--page-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] text-[var(--page-fg)] border border-[var(--border)] flex items-center gap-1 text-[10px] font-mono font-bold uppercase shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </aside>
    </>
  );
}
