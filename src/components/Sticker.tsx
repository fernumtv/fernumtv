"use client";

import React, { useState, useRef, useEffect } from "react";

// Global z-index counter so grabbed stickers rise above others
let globalStickerZ = 50;

export const STICKER_RESET_EVENT = "fernum:reset-stickers";

/**
 * Resets all draggable stickers across the entire website back to their initial positions.
 */
export function resetAllStickers() {
  if (typeof window === "undefined") return;

  // Clear persisted sticker coordinates from localStorage
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("fernum_sticker_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {}

  // Broadcast reset event to all mounted sticker components
  window.dispatchEvent(new CustomEvent(STICKER_RESET_EVENT));
}

interface StickerProps {
  id: string;
  initialX?: number;
  initialY?: number;
  rotation?: number;
  width?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Sticker({
  id,
  initialX = 0,
  initialY = 0,
  rotation = 0,
  width = 90,
  children,
  className = "",
  style = {},
}: StickerProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(25);
  const [isMounted, setIsMounted] = useState(false);

  const stickerRef = useRef<HTMLDivElement>(null);
  const currentPosRef = useRef({ x: initialX, y: initialY });
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, posX: 0, posY: 0 });

  // Load saved position on client mount & listen for global Reset event
  useEffect(() => {
    setIsMounted(true);

    try {
      const saved = localStorage.getItem(`fernum_sticker_${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setPosition(parsed);
          currentPosRef.current = parsed;
        }
      }
    } catch {}

    const handleReset = () => {
      setPosition({ x: initialX, y: initialY });
      currentPosRef.current = { x: initialX, y: initialY };
      setIsDragging(false);
    };

    window.addEventListener(STICKER_RESET_EVENT, handleReset);
    return () => {
      document.body.classList.remove("is-dragging-sticker");
      window.removeEventListener(STICKER_RESET_EVENT, handleReset);
    };
  }, [id, initialX, initialY]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
    if (e.button !== 0) return;

    e.preventDefault();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      posX: currentPosRef.current.x,
      posY: currentPosRef.current.y,
    };

    globalStickerZ += 1;
    setZIndex(globalStickerZ);
    setIsDragging(true);
    document.body.classList.add("is-dragging-sticker");
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();

    const deltaX = e.clientX - dragStartRef.current.pointerX;
    const deltaY = e.clientY - dragStartRef.current.pointerY;

    const newX = Math.round(dragStartRef.current.posX + deltaX);
    const newY = Math.round(dragStartRef.current.posY + deltaY);

    currentPosRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    setIsDragging(false);
    document.body.classList.remove("is-dragging-sticker");

    // Save final dropped position so it remains locked there until user moves it again
    try {
      localStorage.setItem(`fernum_sticker_${id}`, JSON.stringify(currentPosRef.current));
    } catch {}
  };

  return (
    <div
      id={id}
      ref={stickerRef}
      data-cursor="drag"
      data-sticker="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-hidden="true"
      tabIndex={-1}
      role="presentation"
      style={{
        ...style,
        width: `${width}px`,
        zIndex,
        touchAction: "none",
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${
          isDragging ? rotation + 5 : rotation
        }deg) scale(${isDragging ? 1.08 : 1})`,
        filter: isDragging
          ? "drop-shadow(0 18px 24px rgba(0,0,0,0.35))"
          : "drop-shadow(0 4px 7px rgba(0,0,0,0.16))",
        // Crucial: NO transition during active drag so it follows cursor at 1:1 speed with zero lag.
        // Smooth transition only when resting or resetting back to origin.
        transition: isDragging
          ? "none"
          : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease-out",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className={`select-none absolute pointer-events-auto will-change-transform ${className}`}
    >
      <div
        className={`w-full h-full transition-transform ${
          isDragging ? "" : "sticker-hover-wiggle"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
