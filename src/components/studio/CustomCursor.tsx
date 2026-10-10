"use client";

import React, { useEffect, useRef, useState } from "react";
import { isCalmModeActive } from "@/lib/interactive/calmMode";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const burstsContainerRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check: desktop only with mouse or fine pointer, and no reduced motion
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

    // Cursor state variables (pure JS, 0 React re-renders)
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInput = false;
    let isSquished = false;
    let isIdle = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Trail dots (5 dots)
    const trailLength = 5;
    const trailPositions = Array.from({ length: trailLength }, () => ({ x: -100, y: -100 }));
    let trailEnabled = true;

    // Performance FPS tracking
    let fpsFrames = 0;
    let fpsStartTime = performance.now();

    // Context states: 'base' | 'video-play' | 'video-pause' | 'vote' | 'lets-go' | 'book' | 'drag' | 'marquee' | 'link' | 'idle'
    let cursorState = "base";

    const getVibeTokens = () => {
      const computed = getComputedStyle(document.documentElement);
      const cursor = computed.getPropertyValue("--cursor-color").trim() || "var(--cursor-color)";
      const fg = computed.getPropertyValue("--accent-fg").trim() || "var(--accent-fg)";
      const accent = computed.getPropertyValue("--accent").trim() || "var(--accent)";
      const accentFg = computed.getPropertyValue("--accent-fg").trim() || "var(--accent-fg)";
      const s1 = computed.getPropertyValue("--sticker-1").trim() || "var(--sticker-1)";
      const s2 = computed.getPropertyValue("--sticker-2").trim() || "var(--sticker-2)";
      const s3 = computed.getPropertyValue("--sticker-3").trim() || "var(--sticker-3)";
      const pfg = computed.getPropertyValue("--page-fg").trim() || "var(--page-fg)";
      return {
        cursor,
        fg,
        accent,
        accentFg,
        palette: [s1, s2, s3, accent, pfg],
      };
    };

    let tokens = getVibeTokens();

    // Listen to vibe mutations
    const vibeObserver = new MutationObserver(() => {
      tokens = getVibeTokens();
      updateCursorAppearance();
    });
    vibeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-vibe"],
    });

    // Create 5 trail dot elements
    const trailDots: HTMLDivElement[] = [];
    if (trailContainerRef.current) {
      trailContainerRef.current.innerHTML = "";
      const sizes = [9, 7.5, 6, 4.5, 3];
      const opacities = [0.65, 0.5, 0.35, 0.22, 0.12];

      for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement("div");
        dot.style.position = "fixed";
        dot.style.width = `${sizes[i]}px`;
        dot.style.height = `${sizes[i]}px`;
        dot.style.borderRadius = "9999px";
        dot.style.backgroundColor = tokens.cursor;
        dot.style.border = "1px solid var(--border)";
        dot.style.opacity = `${opacities[i]}`;
        dot.style.pointerEvents = "none";
        dot.style.zIndex = "999998";
        dot.style.willChange = "transform, opacity";
        dot.style.transform = "translate3d(-100px, -100px, 0)";
        trailContainerRef.current.appendChild(dot);
        trailDots.push(dot);
      }
    }

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
      }, 5000);
    };

    const updateCursorAppearance = () => {
      const main = mainRef.current;
      const content = contentRef.current;
      if (!main || !content) return;

      const { cursor, fg, accent, accentFg } = tokens;

      // Update trail dot colors
      trailDots.forEach((dot) => {
        dot.style.backgroundColor = cursor;
      });

      if (isHoveringInput) {
        main.style.opacity = "0";
        trailDots.forEach((d) => (d.style.opacity = "0"));
        return;
      }

      main.style.opacity = "1";
      if (trailEnabled) {
        const opacities = [0.65, 0.5, 0.35, 0.22, 0.12];
        trailDots.forEach((d, idx) => (d.style.opacity = `${opacities[idx]}`));
      }

      if (isIdle) {
        main.style.width = "48px";
        main.style.height = "32px";
        main.style.borderRadius = "16px";
        main.style.backgroundColor = cursor;
        main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
        content.innerHTML = `<span class="font-mono text-[10px] font-bold text-[var(--accent-fg)] flex items-center gap-1"><span>-.-</span><span class="text-[9px] animate-pulse">zzz</span></span>`;
        return;
      }

      switch (cursorState) {
        case "video-play":
          main.style.width = "80px";
          main.style.height = "80px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "4px 4px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--accent-fg)] flex items-center gap-1">▶ PLAY</span>`;
          break;

        case "video-pause":
          main.style.width = "80px";
          main.style.height = "80px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--sticker-3)";
          main.style.boxShadow = "4px 4px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--border)] flex items-center gap-1">❚❚ PAUSE</span>`;
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
          main.style.width = "76px";
          main.style.height = "76px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "4px 4px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)] text-center leading-tight">LET'S<br/>GO</span>`;
          break;

        case "book":
          main.style.width = "60px";
          main.style.height = "60px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = accent;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[11px] uppercase tracking-wider text-[var(--accent-fg)]">BOOK</span>`;
          break;

        case "drag":
          main.style.width = "64px";
          main.style.height = "64px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)] flex flex-col items-center leading-none gap-0.5"><span class="text-sm">✋</span><span>DRAG</span></span>`;
          break;

        case "marquee":
          main.style.width = "38px";
          main.style.height = "38px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
          content.innerHTML = `<span class="text-base font-bold text-[var(--accent-fg)] leading-none">➔</span>`;
          break;

        case "link":
          main.style.width = "40px";
          main.style.height = "40px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--sticker-3)";
          main.style.boxShadow = "2.5px 2.5px 0px var(--shadow-color)";
          content.innerHTML = "";
          break;

        case "base":
        default:
          main.style.width = "18px";
          main.style.height = "18px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2px 2px 0px var(--shadow-color)";
          content.innerHTML = "";
          break;
      }
    };

    // Particle burst on click (6 to 8 colored stars, circles, squares)
    const triggerBurst = (x: number, y: number) => {
      const bursts = burstsContainerRef.current;
      if (!bursts) return;

      const count = 7;
      const palette = tokens.palette;
      const shapes = ["★", "●", "■", "✦", "▲", "◆"];

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "cursor-burst-shape";
        particle.textContent = shapes[i % shapes.length];

        const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        const dist = 32 + Math.random() * 26;
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
        }, 520);
      }
    };

    // Magnetic buttons handling
    let magnetizedEl: HTMLElement | null = null;

    const handleMagneticPull = (x: number, y: number) => {
      const magneticButtons = document.querySelectorAll<HTMLElement>(".btn-magnetic");
      let closestBtn: HTMLElement | null = null;
      const maxDistance = 60; // within 60px
      let pullX = 0;
      let pullY = 0;

      for (let i = 0; i < magneticButtons.length; i++) {
        const btn = magneticButtons[i];
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          closestBtn = btn;
          const factor = (1 - dist / 60) * 10;
          pullX = (dx / dist) * factor;
          pullY = (dy / dist) * factor;
          break;
        }
      }

      if (closestBtn) {
        magnetizedEl = closestBtn;
        closestBtn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      } else if (magnetizedEl) {
        magnetizedEl.style.transform = "translate3d(0, 0, 0)";
        magnetizedEl = null;
      }
    };

    // Sticker collage cursor trail (desktop mouse only)
    let lastStickerX = -100;
    let lastStickerY = -100;
    const stickerIcons = ["★", "🎬", "🔥", "✦", "⚡", "100", "👀", "✨"];
    let stickerIdx = 0;

    const dropTrailSticker = (x: number, y: number) => {
      const bursts = burstsContainerRef.current;
      if (!bursts || isHoveringInput) return;
      if (isCalmModeActive() || document.documentElement.classList.contains("calm-mode")) return;

      const dist = Math.hypot(x - lastStickerX, y - lastStickerY);
      if (dist < 46) return; // Drop sticker every ~46px moved
      lastStickerX = x;
      lastStickerY = y;

      const sticker = document.createElement("div");
      sticker.className = "cursor-trail-sticker";
      sticker.textContent = stickerIcons[stickerIdx % stickerIcons.length];
      stickerIdx++;

      const rot = (Math.random() - 0.5) * 36;
      sticker.style.left = `${x}px`;
      sticker.style.top = `${y}px`;
      sticker.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.9)`;

      bursts.appendChild(sticker);
      setTimeout(() => {
        sticker.remove();
      }, 700);
    };

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      resetIdleTimer();
      handleMagneticPull(e.clientX, e.clientY);
      dropTrailSticker(e.clientX, e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Keep native system cursor and text caret for inputs/textareas/selects/calendly
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        Boolean(target.closest("input, textarea, select, [contenteditable='true'], .calendly-inline-widget, iframe"));

      isHoveringInput = isInput;

      // Determine context state
      let newState = "base";

      const videoCard = target.closest('[data-cursor="video"], [data-cursor-label="play"]');
      const hookCard = target.closest('[data-cursor="vote"]');
      const subscribeBtn = target.closest('[data-cursor="lets-go"]');
      const bookBtn = target.closest('[data-cursor="book"]');
      const dragEl = target.closest('[data-cursor="drag"]');
      const marqueeEl = target.closest('[data-cursor="marquee"]');
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
      } else if (dragEl) {
        newState = "drag";
      } else if (marqueeEl) {
        newState = "marquee";
      } else if (interactiveEl) {
        // Check if button text matches "Book a Call"
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
      trailDots.forEach((d) => (d.style.opacity = "0"));
      if (magnetizedEl) {
        magnetizedEl.style.transform = "translate3d(0, 0, 0)";
        magnetizedEl = null;
      }
    };

    // Toggle event listener from footer
    const onCursorToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      const shouldEnable = customEvent.detail?.enabled;
      if (!shouldEnable) {
        document.body.classList.remove("has-custom-cursor");
        if (mainRef.current) mainRef.current.style.opacity = "0";
        trailDots.forEach((d) => (d.style.opacity = "0"));
        setIsActive(false);
      } else {
        document.body.classList.add("has-custom-cursor");
        setIsActive(true);
        updateCursorAppearance();
      }
    };

    // Animation frame loop using transform translate3d only (0 layout shifts)
    let animationFrameId: number;

    const renderLoop = (now: number) => {
      // FPS check over 60 frames
      fpsFrames++;
      const elapsed = now - fpsStartTime;
      if (elapsed >= 1000) {
        const fps = (fpsFrames * 1000) / elapsed;
        if (fps < 40 && trailEnabled) {
          trailEnabled = false;
          trailDots.forEach((d) => (d.style.display = "none"));
        }
        fpsFrames = 0;
        fpsStartTime = now;
      }

      // Springy easing factor (0.28 feels light and springy, not laggy)
      const ease = 0.28;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      // Update trail positions
      if (trailEnabled && trailDots.length > 0) {
        trailPositions[0].x += (currentX - trailPositions[0].x) * 0.45;
        trailPositions[0].y += (currentY - trailPositions[0].y) * 0.45;

        for (let i = 1; i < trailLength; i++) {
          trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.45;
          trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.45;
        }

        trailDots.forEach((dot, idx) => {
          dot.style.transform = `translate3d(${trailPositions[idx].x}px, ${trailPositions[idx].y}px, 0) translate(-50%, -50%)`;
        });
      }

      // Update main cursor transform
      if (mainRef.current) {
        const scale = isSquished ? "scale(1.28, 0.72)" : "scale(1, 1)";
        mainRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) ${scale}`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Bind events
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
      if (magnetizedEl) magnetizedEl.style.transform = "translate3d(0, 0, 0)";
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
      {/* 5 Trail Dots Container */}
      <div ref={trailContainerRef} />

      {/* Main Cursor Element */}
      <div
        ref={mainRef}
        id="genz-custom-cursor-main"
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center border-2 border-[var(--border)] transition-[width,height,background-color,border-radius,box-shadow] duration-150 ease-out select-none will-change-transform"
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "9999px",
          backgroundColor: "var(--cursor-color)",
          boxShadow: "2px 2px 0px var(--shadow-color)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={contentRef} className="pointer-events-none select-none" />
      </div>

      {/* Particle Bursts Container */}
      <div ref={burstsContainerRef} className="pointer-events-none" />
    </div>
  );
}
