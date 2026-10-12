"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

    // Coordinates with easing
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInput = false;

    // Context states: 'base' | 'video-play' | 'video-pause' | 'book' | 'link'
    let cursorState = "base";

    const getVibeTokens = () => {
      const computed = getComputedStyle(document.documentElement);
      const cursor = computed.getPropertyValue("--cursor-color").trim() || "var(--accent)";
      const accent = computed.getPropertyValue("--accent").trim() || "var(--accent)";
      const accentFg = computed.getPropertyValue("--accent-fg").trim() || "#000000";
      return { cursor, accent, accentFg };
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

    const updateCursorAppearance = () => {
      const main = mainRef.current;
      const content = contentRef.current;
      if (!main || !content) return;

      const { cursor, accent, accentFg } = tokens;

      if (isHoveringInput) {
        main.style.opacity = "0";
        return;
      }

      main.style.opacity = "1";

      switch (cursorState) {
        case "video-play":
          main.style.width = "72px";
          main.style.height = "72px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = cursor;
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--accent-fg)]">PLAY</span>`;
          break;

        case "video-pause":
          main.style.width = "72px";
          main.style.height = "72px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--sticker-3)";
          main.style.boxShadow = "3px 3px 0px var(--shadow-color)";
          content.innerHTML = `<span class="font-display font-black text-xs uppercase tracking-wider text-[var(--border)]">PAUSE</span>`;
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
          main.style.width = "36px";
          main.style.height = "36px";
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

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

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
      const bookBtn = target.closest('[data-cursor="book"]');
      const interactiveEl = target.closest("a, button, [role='button'], summary");

      if (videoCard) {
        const video = videoCard.querySelector("video");
        const isPlaying = video && !video.paused;
        newState = isPlaying ? "video-pause" : "video-play";
      } else if (bookBtn) {
        newState = "book";
      } else if (interactiveEl) {
        const text = (interactiveEl.textContent || "").toLowerCase();
        if (text.includes("book") || text.includes("schedule")) {
          newState = "book";
        } else {
          newState = "link";
        }
      }

      if (newState !== cursorState) {
        cursorState = newState;
        updateCursorAppearance();
      }
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
      const ease = 0.35;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("fernum-cursor-toggle", onCursorToggle);

    animationFrameId = requestAnimationFrame(renderLoop);
    updateCursorAppearance();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("fernum-cursor-toggle", onCursorToggle);
      vibeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      id="fernum-cursor-root"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
    >
      <div
        ref={mainRef}
        id="fernum-cursor-main"
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center border-2 border-[var(--border)] transition-[width,height,background-color,border-radius,box-shadow] duration-150 ease-out select-none will-change-transform"
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "9999px",
          backgroundColor: "var(--accent)",
          boxShadow: "2px 2px 0px var(--shadow-color)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={contentRef} className="pointer-events-none select-none" />
      </div>
    </div>
  );
}
