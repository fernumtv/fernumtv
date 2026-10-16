import React from "react";

export function StarburstSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* 12-point starburst polygon */}
      <polygon
        points="45,4 54,20 72,12 70,30 87,37 75,50 85,65 67,69 66,88 49,80 39,94 31,77 13,83 17,65 2,55 16,42 7,26 26,27 25,9 41,19"
        fill="#F14A0A"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      />
      <polygon
        points="45,4 54,20 72,12 70,30 87,37 75,50 85,65 67,69 66,88 49,80 39,94 31,77 13,83 17,65 2,55 16,42 7,26 26,27 25,9 41,19"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Center Circle with Text */}
      <circle cx="46" cy="48" r="22" fill="#FFD400" stroke="#111111" strokeWidth="2" />
      <text
        x="46"
        y="45"
        fill="#111111"
        fontSize="9"
        fontFamily="monospace"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="0.05em"
      >
        3 HOOKS
      </text>
      <text
        x="46"
        y="54"
        fill="#F14A0A"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="900"
        textAnchor="middle"
      >
        PER AD
      </text>
    </svg>
  );
}
