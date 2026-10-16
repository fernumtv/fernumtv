import React from "react";

export function HookBubbleSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Speech bubble with tail, die-cut border */}
      <path
        d="M 12 12 C 12 6, 88 6, 88 12 L 88 52 C 88 58, 60 58, 54 58 L 30 74 L 34 58 L 12 58 C 6 58, 6 12, 12 12 Z"
        fill="#111111"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      />
      <path
        d="M 12 12 C 12 6, 88 6, 88 12 L 88 52 C 88 58, 60 58, 54 58 L 30 74 L 34 58 L 12 58 C 6 58, 6 12, 12 12 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner Accent Fill */}
      <rect x="12" y="12" width="76" height="42" rx="4" fill="#F14A0A" />

      {/* Chunky Text */}
      <text
        x="50"
        y="38"
        fill="#FFFFFF"
        fontSize="22"
        fontFamily="sans-serif"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="0.08em"
        stroke="#111111"
        strokeWidth="3.5"
        style={{ paintOrder: "stroke fill" }}
      >
        HOOK!
      </text>

      {/* Speed sparks */}
      <circle cx="16" cy="18" r="1.5" fill="#FFD400" />
      <circle cx="84" cy="48" r="1.5" fill="#FFD400" />
    </svg>
  );
}
