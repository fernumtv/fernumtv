"use client";

import React from "react";

interface RotatingBadgeProps {
  size?: number;
  text?: string;
  className?: string;
}

export function RotatingBadge({
  size = 130,
  text = "★ FERNUM ADPASS ★ SHIPPED EVERY MONTH ",
  className = "",
}: RotatingBadgeProps) {
  const radius = size * 0.38;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none text-[var(--page-fg)] ${className}`}
    >
      {/* Outer spinning ring with text */}
      <div className="absolute inset-0 animate-spin-slow">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          <defs>
            <path
              id="badge-circle-path"
              d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <text className="text-[10px] font-mono font-black uppercase tracking-[0.25em] fill-current">
            <textPath href="#badge-circle-path" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Solid center badge sticker */}
      <div className="w-[52px] h-[52px] rounded-full bg-[var(--accent)] text-[var(--accent-fg)] border-2 border-[var(--border)] shadow-brutal flex items-center justify-center font-black text-xs transition-colors">
        <span className="tracking-tighter font-display">⚡ AD</span>
      </div>
    </div>
  );
}
