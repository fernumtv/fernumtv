import React from "react";

export function ThumbsUpSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Die-cut outline */}
      <g stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" style={{ paintOrder: "stroke fill" }}>
        {/* Sleeve Cuff */}
        <rect x="12" y="52" width="22" height="26" rx="3" fill="#6C3BF5" />
        {/* Palm & Thumb */}
        <path
          d="M 32 54 L 32 46 C 32 32, 40 12, 48 12 C 54 12, 54 22, 52 30 L 50 36 L 70 36 C 76 36, 78 40, 76 45 L 72 68 C 70 74, 64 76, 56 76 L 32 76 Z"
          fill="#FFD400"
        />
      </g>

      {/* Internal Outlines & Fingers */}
      <rect x="12" y="52" width="22" height="26" rx="3" fill="#6C3BF5" stroke="#111111" strokeWidth="2.5" />
      <path
        d="M 32 54 L 32 46 C 32 32, 40 12, 48 12 C 54 12, 54 22, 52 30 L 50 36 L 70 36 C 76 36, 78 40, 76 45 L 72 68 C 70 74, 64 76, 56 76 L 32 76 Z"
        fill="#FFD400"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Knuckle Lines */}
      <line x1="56" y1="46" x2="68" y2="46" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="56" x2="66" y2="56" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="66" x2="64" y2="66" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
