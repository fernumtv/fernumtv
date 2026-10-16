import React from "react";

export function ClapperSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 90"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Die-cut white border */}
      <g stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" style={{ paintOrder: "stroke fill" }}>
        {/* Main Slate Body */}
        <rect x="8" y="28" width="84" height="54" rx="4" fill="#111111" />
        {/* Top Clapper Bar */}
        <polygon points="6,6 94,14 92,26 4,18" fill="#F14A0A" />
      </g>

      {/* Chevrons on top arm */}
      <polygon points="12,7 22,8 14,20 4,18" fill="#FFFFFF" />
      <polygon points="34,9 44,10 36,22 26,21" fill="#FFFFFF" />
      <polygon points="56,11 66,12 58,24 48,23" fill="#FFFFFF" />
      <polygon points="78,13 88,14 80,26 70,25" fill="#FFFFFF" />

      {/* Hinge Pin */}
      <circle cx="10" cy="20" r="3" fill="#FFD400" stroke="#111111" strokeWidth="1.5" />

      {/* Slate Labels */}
      <rect x="14" y="34" width="72" height="18" fill="#222222" rx="2" />
      <text x="18" y="46" fill="#FFD400" fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="0.05em">
        SCENE: 01
      </text>
      <text x="60" y="46" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="900">
        TAKE: 3
      </text>

      {/* Hook Line */}
      <rect x="14" y="56" width="72" height="20" fill="#F7F3EB" rx="2" />
      <text x="18" y="66" fill="#111111" fontSize="7" fontFamily="monospace" fontWeight="900">
        FERNUM ADPASS
      </text>
      <text x="18" y="73" fill="#F14A0A" fontSize="6" fontFamily="monospace" fontWeight="900">
        3 HOOK VARIATIONS
      </text>
    </svg>
  );
}
