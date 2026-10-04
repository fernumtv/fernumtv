"use client";

import React, { useEffect, useState } from "react";
import { playSuccessSound } from "@/lib/interactive/sound";

interface EmojiParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  velocity: number;
}

export function EasterEggOverlay() {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const triggerBurst = () => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    playSuccessSound();
    setIsActive(true);

    const emojis = ["⚡", "🔥", "🚀", "💥", "🎬", "✨", "🎯", "💰", "★", "☻"];
    const count = 30;
    const width = window.innerWidth;

    const newParticles: EmojiParticle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * (width - 60) + 30,
      y: -50 - Math.random() * 200,
      size: Math.random() * 20 + 24, // 24px - 44px
      rotation: (Math.random() - 0.5) * 60,
      velocity: Math.random() * 400 + 450, // fall speed
    }));

    setParticles(newParticles);

    setTimeout(() => {
      setIsActive(false);
      setParticles([]);
    }, 3200);
  };

  useEffect(() => {
    let keyBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
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

  if (!isActive || particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            left: `${p.x}px`,
            fontSize: `${p.size}px`,
            animation: `fallDown 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
          className="absolute select-none"
        >
          {p.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes fallDown {
          0% {
            transform: translateY(-80px) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(${typeof window !== "undefined" ? window.innerHeight + 100 : 1000}px) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
