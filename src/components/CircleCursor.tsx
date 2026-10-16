"use client";

import React, { useEffect, useState, useRef } from "react";

export function CircleCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ targetX: -100, targetY: -100, currentX: -100, currentY: -100 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only enable if pointer: fine and not prefers-reduced-motion
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      return;
    }

    setEnabled(true);
    document.body.classList.add("has-circle-cursor");

    const resetIdleTimer = () => {
      setIsSleeping(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsSleeping(true);
      }, 3000); // Sleep after 3s of inactivity
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
      resetIdleTimer();

      // Check target element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Native text cursor for inputs/textareas
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']");
        setIsTextInput(Boolean(isInput));

        // Grow over interactive elements
        const isInteractive =
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.getAttribute("role") === "button" ||
          target.getAttribute("data-cursor") === "grow" ||
          target.closest("a, button, [role='button'], [data-cursor='grow']");
        setIsHovered(Boolean(isInteractive));
      }
    };

    const handleMouseDown = () => {
      setIsPressed(true);
      resetIdleTimer();
    };

    const handleMouseUp = () => {
      setIsPressed(false);
      resetIdleTimer();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsSleeping(false);
    };

    // RAF loop with lerp 0.18
    const animate = () => {
      const pos = posRef.current;
      pos.currentX += (pos.targetX - pos.currentX) * 0.18;
      pos.currentY += (pos.targetY - pos.currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.currentX}px, ${pos.currentY}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    animFrameRef.current = requestAnimationFrame(animate);
    resetIdleTimer();

    return () => {
      document.body.classList.remove("has-circle-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!enabled) return null;

  // Base sizing
  // Default: 18px, Hovered: 44px, Sleeping: 10px
  let size = 18;
  if (isSleeping) {
    size = 10;
  } else if (isHovered) {
    size = 44;
  }

  const opacity = !isVisible || isTextInput ? 0 : isSleeping ? 0.4 : 1;
  const scale = isPressed ? 0.85 : 1;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform"
        style={{
          opacity,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className="relative rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            marginTop: `-${size / 2}px`,
            marginLeft: `-${size / 2}px`,
            transform: `scale(${scale})`,
            backgroundColor: isHovered ? "rgba(241, 74, 10, 0.18)" : "#F14A0A",
            border: isHovered ? "2px solid #F14A0A" : "2px solid #111111",
            boxShadow: isSleeping
              ? "none"
              : isHovered
              ? "0 0 16px rgba(241, 74, 10, 0.45)"
              : "0 2px 8px rgba(241, 74, 10, 0.5)",
          }}
        >
          {/* Floating "z z" sleep animation */}
          {isSleeping && (
            <span
              className="absolute font-mono font-black text-[11px] text-[#F14A0A] select-none pointer-events-none animate-cursor-sleep-z whitespace-nowrap drop-shadow-sm"
              style={{
                left: "110%",
                bottom: "40%",
              }}
            >
              z z
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes cursorSleepZ {
          0% {
            opacity: 0;
            transform: translate(2px, 0px) scale(0.7);
          }
          40% {
            opacity: 0.85;
            transform: translate(6px, -6px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(12px, -14px) scale(1.15);
          }
        }
        .animate-cursor-sleep-z {
          animation: cursorSleepZ 2s ease-in-out infinite;
        }
        @media (pointer: fine) {
          body.has-circle-cursor,
          body.has-circle-cursor a,
          body.has-circle-cursor button,
          body.has-circle-cursor [role="button"],
          body.has-circle-cursor [data-cursor="grow"] {
            cursor: none !important;
          }
          body.has-circle-cursor input,
          body.has-circle-cursor textarea,
          body.has-circle-cursor select,
          body.has-circle-cursor [contenteditable="true"] {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
