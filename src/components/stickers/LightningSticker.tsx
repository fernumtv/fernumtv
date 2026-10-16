import React from "react";

export function LightningSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 100"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Bolt with Die-cut White Border */}
      <polygon
        points="42,4 12,54 36,54 22,96 62,42 38,42"
        fill="#FFD700"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />
      {/* Bold Black Outline */}
      <polygon
        points="42,4 12,54 36,54 22,96 62,42 38,42"
        fill="#FFDF00"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Crisp Top Highlight Glare */}
      <polygon
        points="40,8 18,50 34,50 38,44 40,8"
        fill="#FFF7A1"
        opacity="0.9"
      />
    </svg>
  );
}
