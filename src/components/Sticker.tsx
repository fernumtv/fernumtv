"use client";

import React, { useState, useRef, useEffect } from "react";

// Global z-index counter so grabbed stickers rise above others
let globalStickerZ = 30;

interface StickerProps {
  id: string;
  initialX?: number; // percentage or px
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(25);
  const [isMounted, setIsMounted] = useState(false);

  const stickerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, posX: 0, posY: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      posX: position.x,
      posY: position.y,
    };

    globalStickerZ += 1;
    setZIndex(globalStickerZ);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.pointerX;
    const deltaY = e.clientY - dragStartRef.current.pointerY;

    let newX = dragStartRef.current.posX + deltaX;
    let newY = dragStartRef.current.posY + deltaY;

    // Viewport clamping so sticker never leaves the visible screen
    if (stickerRef.current && typeof window !== "undefined") {
      const rect = stickerRef.current.getBoundingClientRect();
      const stickerW = rect.width || width;
      const stickerH = rect.height || width;

      // Current un-translated viewport position:
      const originX = rect.left - position.x;
      const originY = rect.top - position.y;

      const minX = 8 - originX;
      const maxX = window.innerWidth - stickerW - 8 - originX;
      const minY = 8 - originY;
      const maxY = window.innerHeight - stickerH - 8 - originY;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div
      ref={stickerRef}
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
          isDragging ? rotation + 4 : rotation
        }deg) scale(${isDragging ? 1.1 : 1})`,
        filter: isDragging
          ? "drop-shadow(0 20px 25px rgba(0,0,0,0.38))"
          : "drop-shadow(0 5px 8px rgba(0,0,0,0.16))",
        transition: isDragging
          ? "transform 0.05s ease-out, filter 0.15s ease-out"
          : "transform 0.25s ease-out, filter 0.25s ease-out",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className={`select-none absolute pointer-events-auto will-change-transform group ${className}`}
    >
      <div className="w-full h-full sticker-hover-wiggle transition-transform">
        {children}
      </div>
    </div>
  );
}
