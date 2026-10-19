"use client";

import React, { useEffect, useRef, useState } from "react";

export function CircleCursor() {
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

    // Trail dots (5 smooth physics dots)
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
      const cursor = computed.getPropertyValue("--cursor-color").trim() || "#F14A0A";
      const accent = computed.getPropertyValue("--accent").trim() || "#F14A0A";
      const accentFg = computed.getPropertyValue("--accent-fg").trim() || "#FFFFFF";
      return {
        cursor: cursor || "#F14A0A",
        accent: accent || "#F14A0A",
        accentFg: accentFg || "#FFFFFF",
        palette: ["#FFD000", "#FF0055", "#F14A0A", "#00F0FF", "#16C846", "#FFFFFF"],
      };
    };

    let tokens = getVibeTokens();

    // Create 5 trail dot elements
    const trailDots: HTMLDivElement[] = [];
    if (trailContainerRef.current) {
      trailContainerRef.current.innerHTML = "";
      const sizes = [10, 8, 6.5, 5, 3.5];
      const opacities = [0.75, 0.55, 0.38, 0.24, 0.14];

      for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement("div");
        dot.style.position = "fixed";
        dot.style.width = `${sizes[i]}px`;
        dot.style.height = `${sizes[i]}px`;
        dot.style.borderRadius = "9999px";
        dot.style.backgroundColor = tokens.cursor;
        dot.style.border = "1.5px solid #111111";
        dot.style.boxShadow = "1px 1px 0px rgba(0,0,0,0.3)";
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
      }, 3000); // 3s sleep
    };

    const updateCursorAppearance = () => {
      const main = mainRef.current;
      const content = contentRef.current;
      if (!main || !content) return;

      const { cursor, accent } = tokens;

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
        const opacities = [0.75, 0.55, 0.38, 0.24, 0.14];
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
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "4px 4px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--accent-fg)] flex items-center gap-1">❚❚ PAUSE</span>`;
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
          main.style.width = "48px";
          main.style.height = "48px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2.5px 2.5px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-[11px] uppercase tracking-wider text-[var(--accent-fg)] select-none">DRAG</span>`;
          break;

        case "link":
          main.style.width = "40px";
          main.style.height = "40px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "2.5px 2.5px 0px var(--shadow-color)";
          content.innerHTML = `<span class="text-xs font-bold text-[var(--accent-fg)]">↗</span>`;
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

    // Click Effects: Expanding Shockwave Ripple + Particle Explosion
    const triggerClickEffect = (x: number, y: number) => {
      const bursts = burstsContainerRef.current;
      if (!bursts) return;

      // 1. Shockwave Ripple
      const ripple = document.createElement("div");
      ripple.className = "cursor-click-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      bursts.appendChild(ripple);
      setTimeout(() => ripple.remove(), 450);

      // 2. Exploding Shape Particles
      const count = 9;
      const palette = tokens.palette;
      const shapes = ["★", "●", "■", "✦", "▲", "◆", "★", "●", "✦"];

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "cursor-burst-shape";
        particle.textContent = shapes[i % shapes.length];

        const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
        const dist = 38 + Math.random() * 32;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 360;
        const color = palette[i % palette.length];

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.color = color;
        particle.style.fontSize = `${13 + Math.random() * 5}px`;
        particle.style.setProperty("--dx", `${dx}px`);
        particle.style.setProperty("--dy", `${dy}px`);
        particle.style.setProperty("--rot", `${rot}deg`);

        bursts.appendChild(particle);
        setTimeout(() => particle.remove(), 520);
      }
    };

    // Enhanced Magnetic Pull: Pulls cursor AND tilts button
    let magnetizedEl: HTMLElement | null = null;

    const handleMagneticPull = (x: number, y: number) => {
      // If actively dragging a sticker, disable magnetic pull completely so cursor stays 1:1 on pointer
      if (document.body.classList.contains("is-dragging-sticker")) {
        if (magnetizedEl) {
          magnetizedEl.style.transform = "translate3d(0, 0, 0)";
          magnetizedEl = null;
        }
        return;
      }

      const magneticTargets = document.querySelectorAll<HTMLElement>(
        ".btn-magnetic, button, a.btn-squish, a[href*='calendly'], a[href*='dodopayments'], .group"
      );
      let closestEl: HTMLElement | null = null;
      const maxDistance = 85; // 85px range
      let pullX = 0;
      let pullY = 0;
      let targetCenterX = 0;
      let targetCenterY = 0;
      let closestDist = Infinity;

      for (let i = 0; i < magneticTargets.length; i++) {
        const el = magneticTargets[i];
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance && dist < closestDist) {
          closestDist = dist;
          closestEl = el;
          targetCenterX = centerX;
          targetCenterY = centerY;
          const factor = (1 - dist / maxDistance);
          pullX = (dx / dist) * factor * 14;
          pullY = (dy / dist) * factor * 14;
        }
      }

      if (closestEl) {
        magnetizedEl = closestEl;
        closestEl.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
        closestEl.style.transition = "transform 0.12s ease-out";

        // Magnetically snap the cursor toward button center
        const cursorPullFactor = Math.max(0, 1 - closestDist / maxDistance) * 0.42;
        targetX += (targetCenterX - targetX) * cursorPullFactor;
        targetY += (targetCenterY - targetY) * cursorPullFactor;
      } else if (magnetizedEl) {
        magnetizedEl.style.transform = "translate3d(0, 0, 0)";
        magnetizedEl = null;
      }
    };

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      resetIdleTimer();
      handleMagneticPull(e.clientX, e.clientY);

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

      const isDraggingSticker = document.body.classList.contains("is-dragging-sticker");
      const dragEl = target.closest('[data-cursor="drag"], [data-cursor="sticker"], [data-sticker="true"]');
      const videoCard = target.closest('[data-cursor="video"], [data-cursor-label="play"]');
      const hookCard = target.closest('[data-cursor="vote"]');
      const subscribeBtn = target.closest('[data-cursor="lets-go"]');
      const bookBtn = target.closest('[data-cursor="book"]');
      const marqueeEl = target.closest('[data-cursor="marquee"]');
      const interactiveEl = target.closest("a, button, [role='button'], summary");

      if (isDraggingSticker || dragEl) {
        newState = "drag";
      } else if (videoCard) {
        const video = videoCard.querySelector("video");
        const isPlaying = video && !video.paused;
        newState = isPlaying ? "video-pause" : "video-play";
      } else if (hookCard) {
        newState = "vote";
      } else if (subscribeBtn) {
        newState = "lets-go";
      } else if (bookBtn) {
        newState = "book";
      } else if (marqueeEl) {
        newState = "marquee";
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
      triggerClickEffect(e.clientX, e.clientY);
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

    let animationFrameId: number;

    const renderLoop = (now: number) => {
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

      const isDraggingSticker = document.body.classList.contains("is-dragging-sticker");
      const ease = isDraggingSticker ? 0.75 : 0.28;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      // Update trail positions
      if (trailEnabled && trailDots.length > 0) {
        const trailEase = isDraggingSticker ? 0.65 : 0.45;
        trailPositions[0].x += (currentX - trailPositions[0].x) * trailEase;
        trailPositions[0].y += (currentY - trailPositions[0].y) * trailEase;

        for (let i = 1; i < trailLength; i++) {
          trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * trailEase;
          trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * trailEase;
        }

        trailDots.forEach((dot, idx) => {
          dot.style.transform = `translate3d(${trailPositions[idx].x}px, ${trailPositions[idx].y}px, 0) translate(-50%, -50%)`;
        });
      }

      // Update main cursor transform with squish (keep perfectly round circle when on sticker / dragging)
      if (mainRef.current) {
        const scale = isSquished && !isDraggingSticker && cursorState !== "drag" ? "scale(1.35, 0.65)" : "scale(1, 1)";
        mainRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) ${scale}`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("pointermove", onPointerMove, { capture: true, passive: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    document.addEventListener("mouseleave", onPointerLeave);

    resetIdleTimer();
    animationFrameId = requestAnimationFrame(renderLoop);
    updateCursorAppearance();

    return () => {
      window.removeEventListener("pointermove", onPointerMove, { capture: true } as any);
      window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
      window.removeEventListener("pointerup", onPointerUp, { capture: true } as any);
      document.removeEventListener("mouseleave", onPointerLeave);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("has-custom-cursor");
      if (magnetizedEl) magnetizedEl.style.transform = "translate3d(0, 0, 0)";
    };
  }, []);

  if (!isActive) return null;

  return (
    <>
      <div
        ref={rootRef}
        id="genz-custom-cursor-root"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      >
        {/* 5 Smooth Trail Dots */}
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

        {/* Particle Bursts & Ripple Container */}
        <div ref={burstsContainerRef} className="pointer-events-none" />
      </div>

      <style jsx global>{`
        @media (pointer: fine) and (hover: hover) {
          body.has-custom-cursor,
          body.has-custom-cursor a,
          body.has-custom-cursor button,
          body.has-custom-cursor [role="button"],
          body.has-custom-cursor summary,
          body.has-custom-cursor .cursor-pointer,
          body.has-custom-cursor [data-cursor="drag"],
          body.has-custom-cursor [data-cursor="drag"] *,
          body.has-custom-cursor [data-cursor="sticker"],
          body.has-custom-cursor [data-cursor="sticker"] *,
          body.has-custom-cursor [data-sticker],
          body.has-custom-cursor [data-sticker] *,
          body.has-custom-cursor.is-dragging-sticker,
          body.has-custom-cursor.is-dragging-sticker * {
            cursor: none !important;
          }
          body.has-custom-cursor input,
          body.has-custom-cursor textarea,
          body.has-custom-cursor select,
          body.has-custom-cursor [contenteditable="true"],
          body.has-custom-cursor .calendly-inline-widget,
          body.has-custom-cursor iframe {
            cursor: auto !important;
          }
        }

        /* Shockwave Ripple on Click */
        @keyframes cursorClickRipple {
          0% {
            transform: translate(-50%, -50%) scale(0.25);
            opacity: 1;
            border-width: 3.5px;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.8);
            opacity: 0;
            border-width: 1px;
          }
        }

        .cursor-click-ripple {
          position: fixed;
          pointer-events: none;
          z-index: 999999;
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          border: 3px solid #F14A0A;
          animation: cursorClickRipple 0.45s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Particle Burst on Click */
        @keyframes cursor-burst-particle {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0);
            opacity: 0;
          }
        }

        .cursor-burst-shape {
          position: fixed;
          pointer-events: none;
          z-index: 999999;
          line-height: 1;
          user-select: none;
          font-weight: 900;
          animation: cursor-burst-particle 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
