"use client";

import React, { useEffect, useState } from "react";
import { playSuccessSound } from "@/lib/interactive/sound";

interface ConfettiBadge {
  id: number;
  text: string;
  x: number;
  y: number;
  bg: string;
  fg: string;
  rotation: number;
  scale: number;
}

const BADGES = [
  { text: "FERNUM", bg: "var(--accent)", fg: "var(--accent-fg)" },
  { text: "0:03 HOOK", bg: "var(--block-4-bg)", fg: "var(--block-4-fg)" },
  { text: "RENT FREE", bg: "var(--sticker-2)", fg: "#ffffff" },
  { text: "3 HOOKS / AD", bg: "var(--sticker-1)", fg: "#000000" },
  { text: "COOKED", bg: "var(--accent)", fg: "var(--accent-fg)" },
  { text: "NO CAP", bg: "var(--sticker-1)", fg: "#000000" },
  { text: "9:16 VERTICAL", bg: "var(--block-2-bg)", fg: "var(--block-2-fg)" },
  { text: "REC ●", bg: "#EF4444", fg: "#ffffff" },
  { text: "✦", bg: "var(--block-4-bg)", fg: "var(--accent)" },
  { text: "HIGH RETENTION", bg: "var(--sticker-3)", fg: "#000000" },
  { text: "★", bg: "var(--accent)", fg: "var(--accent-fg)" },
  { text: "1:1 SQUARE", bg: "var(--block-4-bg)", fg: "var(--block-4-fg)" },
];

export function EasterEggOverlay() {
  const [badges, setBadges] = useState<ConfettiBadge[]>([]);
  const [isActive, setIsActive] = useState(false);

  const triggerBurst = () => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    playSuccessSound();
    setIsActive(true);

    const count = 28;
    const width = window.innerWidth;

    const newBadges: ConfettiBadge[] = Array.from({ length: count }, (_, i) => {
      const template = BADGES[i % BADGES.length];
      return {
        id: Date.now() + i,
        text: template.text,
        bg: template.bg,
        fg: template.fg,
        x: Math.random() * (width - 120) + 20,
        y: -40 - Math.random() * 200,
        rotation: (Math.random() - 0.5) * 50,
        scale: Math.random() * 0.3 + 0.85,
      };
    });

    setBadges(newBadges);

    setTimeout(() => {
      setIsActive(false);
      setBadges([]);
    }, 3200);
  };

  useEffect(() => {
    let keyBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) {
        keyBuffer = keyBuffer.slice(-10);
      }

      if (keyBuffer.endsWith("fernum")) {
        keyBuffer = "";
        triggerBurst();
      }
    };

    const handleCustomTrigger = () => {
      triggerBurst();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("fernum-logo-burst", handleCustomTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("fernum-logo-burst", handleCustomTrigger);
    };
  }, []);

  if (!isActive || badges.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
    >
      {badges.map((b) => (
        <div
          key={b.id}
          style={{
            left: `${b.x}px`,
            backgroundColor: b.bg,
            color: b.fg,
            animation: `badgeFall 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            transform: `rotate(${b.rotation}deg) scale(${b.scale})`,
          }}
          className="absolute px-3 py-1 border-2 border-[var(--border)] shadow-brutal text-xs font-mono font-black uppercase tracking-wider select-none whitespace-nowrap"
        >
          {b.text}
        </div>
      ))}

      <style jsx>{`
        @keyframes badgeFall {
          0% {
            transform: translateY(-80px) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(${typeof window !== "undefined" ? window.innerHeight + 120 : 1000}px) rotate(380deg) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
