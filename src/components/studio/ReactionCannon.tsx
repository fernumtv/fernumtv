"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, Plus, X } from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playPopSound,
  playSuccessSound,
} from "@/lib/interactive/sound";

type StickerKind = "camera" | "clapper" | "face" | "filmstrip" | "reticle";

interface StampedSticker {
  id: string;
  kind: StickerKind;
  x: number;
  y: number;
  rotation: number;
}

const DOCK_BUTTONS: { kind: StickerKind; label: string; icon: string }[] = [
  { kind: "camera", label: "CAM 1080p", icon: "📷" },
  { kind: "clapper", label: "SLATE", icon: "🎬" },
  { kind: "face", label: "HOOK FACE", icon: "😱" },
  { kind: "filmstrip", label: "FILM STRIP", icon: "🎞️" },
  { kind: "reticle", label: "9:16 SAFE", icon: "🎯" },
];

export function ReactionCannon() {
  const [soundOn, setSoundOn] = useState(false);
  const [userStickers, setUserStickers] = useState<StampedSticker[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.enabled === "boolean") {
        setSoundOn(customEvent.detail.enabled);
      }
    };
    window.addEventListener("fernum-sound-toggle", handleSync);
    return () => window.removeEventListener("fernum-sound-toggle", handleSync);
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      setTimeout(() => playSuccessSound(), 50);
    }
  };

  const handleStamp = (kind: StickerKind) => {
    playPopSound();

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 600;

    const spawnX = Math.max(20, Math.min(windowWidth - 180, windowWidth / 2 - 80 + (Math.random() - 0.5) * 160));
    const spawnY = scrollY + Math.max(120, windowHeight / 2 - 40 + (Math.random() - 0.5) * 140);
    const rotation = (Math.random() - 0.5) * 18;

    const newSticker: StampedSticker = {
      id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      kind,
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
      {/* User-Stamped Graphic Stickers (Hidden on screens under 1024px) */}
      <div className="hidden lg:block">
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
              touchAction: "none",
            }}
            className="group select-none cursor-grab active:cursor-grabbing transition-transform animate-in zoom-in-90 duration-150 relative"
          >
            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => handleRemoveSticker(s.id, e)}
              title="Remove sticker"
              aria-label="Remove sticker"
              className="absolute -top-2 -right-2 z-50 w-5 h-5 rounded-full bg-black border border-white text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Shape 1: Cinema Camera 1080p */}
            {s.kind === "camera" && (
              <div className="relative bg-[#18181B] text-white border-2 border-[var(--border)] p-2.5 shadow-brutal w-[155px] rounded-sm">
                <div className="absolute -top-2.5 left-4 w-7 h-2.5 bg-[#27272A] border-2 border-b-0 border-[var(--border)] rounded-t-xs" />
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[9px] font-mono font-black text-red-400">REC ● 1080p</span>
                  </div>
                  <span className="text-[8px] font-mono opacity-60">60FPS</span>
                </div>
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
            )}

            {/* Shape 2: Director Clapperboard */}
            {s.kind === "clapper" && (
              <div className="relative bg-white text-black border-2 border-[var(--border)] w-[145px] shadow-brutal font-mono">
                <div className="h-5 border-b-2 border-[var(--border)] overflow-hidden flex items-center bg-black">
                  <div className="w-full h-full flex transform -skew-x-12">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? "bg-white" : "bg-black"}`} />
                    ))}
                  </div>
                </div>
                <div className="p-2 space-y-1">
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
            )}

            {/* Shape 3: Creator Gasp Hook Face */}
            {s.kind === "face" && (
              <div className="w-18 h-18 rounded-full bg-[var(--sticker-1)] border-2 border-[var(--border)] shadow-brutal flex flex-col items-center justify-center p-1.5 relative">
                <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none" stroke="currentColor">
                  <circle cx="32" cy="32" r="27" fill="#FACC15" stroke="#000" strokeWidth="2.5" />
                  <rect x="14" y="20" width="16" height="11" rx="2" fill="#000" stroke="#000" />
                  <rect x="34" y="20" width="16" height="11" rx="2" fill="#000" stroke="#000" />
                  <line x1="30" y1="25" x2="34" y2="25" stroke="#000" strokeWidth="3" />
                  <ellipse cx="32" cy="43" rx="6.5" ry="9" fill="#000" />
                  <ellipse cx="32" cy="46" rx="4.5" ry="3" fill="#EF4444" />
                </svg>
                <span className="absolute -bottom-2 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-[8px] font-mono font-black uppercase px-2 py-0.5 border border-[var(--border)] whitespace-nowrap shadow-xs">
                  GASP HOOK
                </span>
              </div>
            )}

            {/* Shape 4: 3-Hook Film Strip */}
            {s.kind === "filmstrip" && (
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
            )}

            {/* Shape 5: Camera Viewfinder Reticle */}
            {s.kind === "reticle" && (
              <div className="w-[145px] h-[78px] bg-black/90 text-white border-2 border-[var(--border)] p-2 relative shadow-brutal flex flex-col justify-between">
                <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[var(--accent)]" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[var(--accent)]" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[var(--accent)]" />
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--accent)]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3.5 h-[1px] bg-white/40" />
                  <div className="h-3.5 w-[1px] bg-white/40 absolute" />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono font-black">
                  <span className="text-red-400">● REC 00:03</span>
                  <span className="opacity-70">ISO 800</span>
                </div>
                <div className="flex justify-between items-end text-[7px] font-mono">
                  <span className="opacity-70">SAFE ZONE</span>
                  <span className="text-[var(--accent)] font-bold">9:16 TIKTOK</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>

      {/* Dock Bar (Hidden on screens under 1024px to prevent overlapping mobile content) */}
      <aside
        aria-label="Studio Creative Sticker Dock"
        className="hidden lg:block fixed bottom-4 left-4 sm:left-6 z-40 select-none max-w-[calc(100vw-32px)]"
      >
        <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] p-1.5 sm:p-2 shadow-brutal flex items-center gap-1.5 sm:gap-2 text-xs font-mono">
          {/* Label */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[var(--page-bg)] text-[var(--page-fg)] border border-[var(--border)] font-bold text-[10px] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>STICKER VAULT</span>
          </div>

          {/* Graphical Sticker Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {DOCK_BUTTONS.map((btn) => (
              <button
                key={btn.kind}
                type="button"
                onClick={() => handleStamp(btn.kind)}
                title={`Stamp ${btn.label} onto screen`}
                aria-label={`Stamp ${btn.label}`}
                className="px-2 py-1 bg-[var(--page-bg)] hover:bg-[var(--accent)] text-[var(--page-fg)] hover:text-[var(--accent-fg)] border border-[var(--border)] font-mono font-black text-[10px] uppercase tracking-wider shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
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
