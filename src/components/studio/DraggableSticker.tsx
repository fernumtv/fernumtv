"use client";

import React, { useState, useRef } from "react";

interface DraggableStickerProps {
  id: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  children: React.ReactNode;
}

export function DraggableSticker({
  initialX,
  initialY,
  rotation = 0,
  children,
}: DraggableStickerProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    setPosition({
      x: dragStartRef.current.initialX + deltaX,
      y: dragStartRef.current.initialY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      data-cursor="drag"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px) rotate(${
          isDragging ? rotation + 4 : rotation
        }deg) scale(${isDragging ? 1.08 : 1})`,
      }}
      className={`absolute z-30 select-none cursor-grab active:cursor-grabbing transition-shadow duration-150 ${
        isDragging ? "shadow-brutal-xl z-40" : "shadow-brutal hover:shadow-brutal-lg"
      }`}
    >
      {children}
    </div>
  );
}

export function HeroStickerPack() {
  return (
    <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className="relative w-full h-full max-w-7xl mx-auto pointer-events-auto">
        {/* Sticker 2: uses token --sticker-2 */}
        <DraggableSticker id="smiley-sticker" initialX={380} initialY={30} rotation={12}>
          <div className="w-12 h-12 rounded-full bg-[var(--sticker-2)] text-[var(--page-bg)] border-2 border-[var(--border)] flex items-center justify-center font-black text-xl shadow-brutal-sm">
            <span>☻</span>
          </div>
        </DraggableSticker>

        {/* Sticker 3: uses token --sticker-3 */}
        <DraggableSticker id="new-badge" initialX={720} initialY={40} rotation={-4}>
          <div className="bg-[var(--sticker-3)] text-[var(--border)] border-2 border-[var(--border)] border-dashed px-3 py-1 font-mono font-bold text-[11px] uppercase tracking-wider shadow-brutal-sm">
            <span>⚡ 3 HOOKS / AD</span>
          </div>
        </DraggableSticker>

        {/* Sticker 4: Block 4 */}
        <DraggableSticker id="drag-arrow" initialX={520} initialY={420} rotation={6}>
          <div className="bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-brutal-sm">
            <span>↖ DRAG STICKER</span>
          </div>
        </DraggableSticker>
      </div>
    </div>
  );
}
