import React from "react";

export function LightningSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 100"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Bolt with Die-cut border */}
      <polygon
        points="42,4 12,54 36,54 22,96 62,42 38,42"
        fill="#FFD400"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />
      <polygon
        points="42,4 12,54 36,54 22,96 62,42 38,42"
        fill="#FFD400"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Internal Shadow / Facet */}
      <polygon points="36,4 12,54 36,54 22,96 34,54" fill="#F14A0A" opacity="0.85" />
    </svg>
  );
}
