"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Config check: if cursorStyle is "system", do not activate custom cursor
    if (siteConfig.cursorStyle === "system") {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    // 2. Desktop mouse only with fine pointer and no reduced motion
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    // 3. User toggle preference check from footer
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

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringInput = false;

    // Context states: 'base' | 'hover' | 'play' | 'pause' | 'book'
    let cursorState = "base";

    const updateCursorAppearance = () => {
      const main = mainRef.current;
      const content = contentRef.current;
      if (!main || !content) return;

      if (isHoveringInput) {
        main.style.opacity = "0";
        return;
      }
      main.style.opacity = "1";

      switch (cursorState) {
        case "play":
          main.style.width = "56px";
          main.style.height = "56px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--cursor-color)";
          main.style.border = "1px solid #111111";
          main.style.boxShadow = "2px 2px 0px rgba(0, 0, 0, 0.9)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)]">PLAY</span>`;
          break;

        case "pause":
          main.style.width = "56px";
          main.style.height = "56px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--cursor-color)";
          main.style.border = "1px solid #111111";
          main.style.boxShadow = "2px 2px 0px rgba(0, 0, 0, 0.9)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)]">PAUSE</span>`;
          break;

        case "book":
          main.style.width = "56px";
          main.style.height = "56px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--cursor-color)";
          main.style.border = "1px solid #111111";
          main.style.boxShadow = "2px 2px 0px rgba(0, 0, 0, 0.9)";
          content.innerHTML = `<span class="font-display font-black text-[10px] uppercase tracking-wider text-[var(--accent-fg)]">BOOK</span>`;
          break;

        case "hover":
          // Grows slightly over buttons and links (no text label)
          main.style.width = "26px";
          main.style.height = "26px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--cursor-color)";
          main.style.border = "1px solid #111111";
          main.style.boxShadow = "2px 2px 0px rgba(0, 0, 0, 0.8)";
          content.innerHTML = "";
          break;

        case "base":
        default:
          // Small solid dot: 16px, site accent color, thin black outline
          main.style.width = "16px";
          main.style.height = "16px";
          main.style.borderRadius = "9999px";
          main.style.backgroundColor = "var(--cursor-color)";
          main.style.border = "1px solid #111111";
          main.style.boxShadow = "1.5px 1.5px 0px rgba(0, 0, 0, 0.8)";
          content.innerHTML = "";
          break;
      }
    };

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Keep native system cursor and text caret for form inputs
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        Boolean(target.closest("input, textarea, select, [contenteditable='true'], .calendly-inline-widget, iframe"));

      isHoveringInput = isInput;

      // Context determination
      let newState = "base";

      const videoCard = target.closest('[data-cursor="video"], [data-cursor-label="play"]');
      const bookBtn = target.closest('[data-cursor="book"]');
      const interactiveEl = target.closest("a, button, [role='button'], summary, .cursor-pointer");

      if (videoCard) {
        const video = videoCard.querySelector("video");
        const isPlaying = video && !video.paused;
        newState = isPlaying ? "pause" : "play";
      } else if (bookBtn) {
        newState = "book";
      } else if (interactiveEl) {
        const text = (interactiveEl.textContent || "").toLowerCase();
        const href = (interactiveEl.getAttribute("href") || "").toLowerCase();
        if (text.includes("book") || text.includes("schedule") || href.includes("schedule") || href.includes("calendly")) {
          newState = "book";
        } else {
          newState = "hover";
        }
      }

      if (newState !== cursorState || isHoveringInput) {
        cursorState = newState;
        updateCursorAppearance();
      }
    };

    const onPointerLeave = () => {
      targetX = -100;
      targetY = -100;
      if (mainRef.current) mainRef.current.style.opacity = "0";
    };

    // Toggle event listener from footer
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

    // Animation frame loop with light easing
    let animationFrameId: number;
    const ease = 0.22;

    const renderLoop = () => {
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
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      ref={rootRef}
      id="custom-cursor-root"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
    >
      <div
        ref={mainRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center transition-[width,height,opacity] duration-150 ease-out select-none will-change-transform"
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "9999px",
          backgroundColor: "var(--cursor-color)",
          border: "1px solid #111111",
          boxShadow: "1.5px 1.5px 0px rgba(0, 0, 0, 0.8)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={contentRef} className="pointer-events-none select-none" />
      </div>
    </div>
  );
}
