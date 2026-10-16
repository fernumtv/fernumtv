import React from "react";

export function CassetteSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 66"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Shell with Die-cut border */}
      <rect
        x="6"
        y="6"
        width="88"
        height="54"
        rx="5"
        fill="#111111"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      />
      <rect x="6" y="6" width="88" height="54" rx="5" stroke="#111111" strokeWidth="2.5" />

      {/* Label Area */}
      <rect x="14" y="12" width="72" height="28" rx="2" fill="#00E5FF" stroke="#111111" strokeWidth="1.5" />
      <line x1="14" y1="18" x2="86" y2="18" stroke="#F14A0A" strokeWidth="2" />
      <text x="50" y="26" fill="#111111" fontSize="6.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">
        BEAT DROP // 3s HOOK
      </text>

      {/* Spool Window */}
      <rect x="26" y="26" width="48" height="18" rx="3" fill="#111111" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="38" cy="35" r="5" fill="#FFFFFF" />
      <circle cx="38" cy="35" r="2.5" fill="#111111" />
      <circle cx="62" cy="35" r="5" fill="#FFFFFF" />
      <circle cx="62" cy="35" r="2.5" fill="#111111" />

      {/* Bottom Tape Trapezoid */}
      <polygon points="20,60 26,48 74,48 80,60" fill="#222222" stroke="#111111" strokeWidth="1.5" />
      <circle cx="32" cy="54" r="2" fill="#FFD400" />
      <circle cx="68" cy="54" r="2" fill="#FFD400" />
    </svg>
  );
}
