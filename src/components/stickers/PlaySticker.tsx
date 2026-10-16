import React from "react";

export function PlaySticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Die-cut outline */}
      <circle
        cx="45"
        cy="45"
        r="38"
        fill="#FFD400"
        stroke="#FFFFFF"
        strokeWidth="6"
        style={{ paintOrder: "stroke fill" }}
      />

      {/* Inner offset circle */}
      <circle cx="45" cy="45" r="32" fill="#16C846" stroke="#111111" strokeWidth="2.5" />

      {/* Top Badge Tag */}
      <rect x="25" y="16" width="40" height="12" rx="3" fill="#111111" />
      <text x="45" y="25" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
        00:03 HOOK
      </text>

      {/* Chunky Play Triangle */}
      <polygon
        points="37,34 62,49 37,64"
        fill="#111111"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon points="39,37 57,49 39,60" fill="#F14A0A" />
    </svg>
  );
}
