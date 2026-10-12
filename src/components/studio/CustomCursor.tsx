"use client";

import React, { useEffect, useRef, useState } from "react";
import { isCalmModeActive } from "@/lib/interactive/calmMode";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const burstsContainerRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Desktop only with mouse or fine pointer, and no reduced motion
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    // Check localStorage preference
    let isCursorEnabled = true;
    try {
      const stored = localStorage.getItem("fernum_cursor_enabled");
      if (stored === "off") isCursorEnabled = false;
    } catch {}

    if (!isCursorEnabled) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    setIsActive(true);
    document.body.classList.add("has-custom-cursor");

    // Coordinates with spring easing
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInput = false;
    let isSquished = false;
    let isIdle = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Context states: 'base' | 'video-play' | 'video-pause' | 'vote' | 'lets-go' | 'book' | 'drag' | 'marquee' | 'link'
    let cursorState = "base";

    const getVibeTokens = () => {
      const computed = getComputedStyle(document.documentElement);
      const cursor = computed.getPropertyValue("--cursor-color").trim() || "var(--accent)";
      const accent = computed.getPropertyValue("--accent").trim() || "var(--accent)";
      const accentFg = computed.getPropertyValue("--accent-fg").trim() || "#000000";
      const s1 = computed.getPropertyValue("--sticker-1").trim() || "#FFD400";
      const s2 = computed.getPropertyValue("--sticker-2").trim() || "#F14A0A";
      const s3 = computed.getPropertyValue("--sticker-3").trim() || "#F33418";
      const pfg = computed.getPropertyValue("--page-fg").trim() || "#111111";
      return {
        cursor,
        accent,
        accentFg,
        palette: [s1, s2, s3, accent, pfg],
      };
    };

    let tokens = getVibeTokens();

    const vibeObserver = new MutationObserver(() => {
      tokens = getVibeTokens();
      updateCursorAppearance();
    });
    vibeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-vibe"],
    });

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (isIdle) {
        isIdle = false;
        updateCursorAppearance();
      }
      idleTimer = setTimeout(() => {
        if (!isHoveringInput && cursorState === "base") {
          isIdle = true;
          updateCursorAppearance();
        }
      }, 3500);
    };

    const updateCursorAppearance = () => {
      const main = mainRef.current;
      const content = contentRef.current;
      if (!main || !content) return;

      const { cursor, accent } = tokens;

      if (isHoveringInput) {
        main.style.opacity = "0";
        return;
      }

      main.style.opacity = "1";

      // Sleepy idle state (-.- zzz)
      if (isIdle) {
        main.style.width = "48px";
        main.style.height = "32px";
        main.style.borderRadius = "16px";
        main.style.backgroundColor = cursor;
        main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
        content.innerHTML = `<span class="font-mono text-[10px] font-bold text-[var(--accent-fg)] flex items-center gap-1 select-none pointer-events-none"><span>-.-</span><span class="text-[9px] animate-pulse">zzz</span></span>`;
        return;
      }

      switch (cursorState) {
        case "video-play":
          main.style.width = "76px";
          main.style.height = "76px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--accent-fg)]">▶ PLAY</span>`;
          break;

        case "video-pause":
          main.style.width = "76px";
          main.style.height = "76px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--sticker-3)";
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--border)]">❚❚ PAUSE</span>`;
          break;

        case "vote":
          main.style.width = "58px";
          main.style.height = "58px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[11px] uppercase tracking-wider text-[var(--accent-fg)]">VOTE</span>`;
          break;

        case "lets-go":
          main.style.width = "72px";
          main.style.height = "72px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)] text-center leading-tight">LET'S<br/>GO</span>`;
          break;

        case "book":
          main.style.width = "64px";
          main.style.height = "64px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = accent;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--accent-fg)]">BOOK</span>`;
          break;

        case "link":
          main.style.width = "38px";
          main.style.height = "38px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
          content.innerHTML = "";
          break;

        case "base":
        default:
          main.style.width = "16px";
          main.style.height = "16px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
          content.innerHTML = "";
          break;
      }
    };

    // Sparkle burst on touch / click
    const triggerBurst = (x: number, y: number) => {
      const bursts = burstsContainerRef.current;
      if (!bursts) return;
      if (isCalmModeActive() || document.documentElement.classList.contains("calm-mode")) return;

      const count = 7;
      const palette = tokens.palette;
      const sparkles = ["✦", "★", "✨", "◆", "▲", "●"];

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "cursor-burst-shape";
        particle.textContent = sparkles[i % sparkles.length];

        const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        const dist = 30 + Math.random() * 24;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 360;
        const color = palette[i % palette.length];

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.color = color;
        particle.style.fontSize = `${12 + Math.random() * 4}px`;
        particle.style.lineHeight = "1";
        particle.style.setProperty("--dx", `${dx}px`);
        particle.style.setProperty("--dy", `${dy}px`);
        particle.style.setProperty("--rot", `${rot}deg`);

        bursts.appendChild(particle);
        setTimeout(() => {
          particle.remove();
        }, 500);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      resetIdleTimer();

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        Boolean(target.closest("input, textarea, select, [contenteditable='true'], .calendly-inline-widget, iframe"));

      isHoveringInput = isInput;

      let newState = "base";

      const videoCard = target.closest('[data-cursor="video"], [data-cursor-label="play"]');
      const hookCard = target.closest('[data-cursor="vote"]');
      const subscribeBtn = target.closest('[data-cursor="lets-go"]');
      const bookBtn = target.closest('[data-cursor="book"]');
      const interactiveEl = target.closest("a, button, [role='button'], summary");

      if (videoCard) {
        const video = videoCard.querySelector("video");
        const isPlaying = video && !video.paused;
        newState = isPlaying ? "video-pause" : "video-play";
      } else if (hookCard) {
        newState = "vote";
      } else if (subscribeBtn) {
        newState = "lets-go";
      } else if (bookBtn) {
        newState = "book";
      } else if (interactiveEl) {
        const text = (interactiveEl.textContent || "").toLowerCase();
        if (text.includes("book") || text.includes("schedule")) {
          newState = "book";
        } else if (text.includes("subscribe") || text.includes("get the pass")) {
          newState = "lets-go";
        } else {
          newState = "link";
        }
      }

      if (newState !== cursorState) {
        cursorState = newState;
        updateCursorAppearance();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isHoveringInput) return;
      isSquished = true;
      triggerBurst(e.clientX, e.clientY);
    };

    const onPointerUp = () => {
      isSquished = false;
    };

    const onPointerLeave = () => {
      targetX = -100;
      targetY = -100;
      if (mainRef.current) mainRef.current.style.opacity = "0";
    };

    const onCursorToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      const shouldEnable = customEvent.detail?.enabled;
      if (!shouldEnable) {
        document.body.classList.remove("has-custom-cursor");
        if (mainRef.current) mainRef.current.style.opacity = "0";
        setIsActive(false);
      } else {
        document.body.classList.add("has-custom-cursor");
        setIsActive(true);
        updateCursorAppearance();
      }
    };

    let animationFrameId: number;

    const renderLoop = () => {
      const ease = 0.32;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      if (mainRef.current) {
        const scale = isSquished ? "scale(1.22, 0.78)" : "scale(1, 1)";
        mainRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) ${scale}`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("fernum-cursor-toggle", onCursorToggle);

    resetIdleTimer();
    animationFrameId = requestAnimationFrame(renderLoop);
    updateCursorAppearance();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("fernum-cursor-toggle", onCursorToggle);
      vibeObserver.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      ref={rootRef}
      id="genz-custom-cursor-root"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
    >
      {/* Main Cursor Element */}
      <div
        ref={mainRef}
        id="genz-custom-cursor-main"
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center border-2 border-[var(--border)] transition-[width,height,background-color,border-radius,box-shadow] duration-150 ease-out select-none will-change-transform"
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "9999px",
          backgroundColor: "var(--cursor-color)",
          boxShadow: "2px 2px 0px var(--shadow-color)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={contentRef} className="pointer-events-none select-none" />
      </div>

      {/* Particle Bursts Container for click sparkles */}
      <div ref={burstsContainerRef} className="pointer-events-none" />
    </div>
  );
}
