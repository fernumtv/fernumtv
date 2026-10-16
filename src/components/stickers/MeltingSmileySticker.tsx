import React from "react";

export function MeltingSmileySticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 5px 8px rgba(0,0,0,0.28))" }}
    >
      {/* Outer Die-cut White Outline */}
      <path
        d="M26,38 C26,20 37,10 52,10 C67,10 78,20 78,38 C78,48 76,56 70,64 C66,69 64,76 66,82 C67,86 65,92 61,92 C57,92 56,84 55,78 C54,74 50,72 46,76 C42,80 43,98 42,104 C41,109 37,110 35,106 C32,100 34,80 32,74 C30,68 24,70 24,76 C24,84 22,96 19,96 C16,96 16,84 18,74 C20,64 24,56 26,48 Z"
        fill="#FFD000"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />

      {/* Main Yellow Melting Silhouette with Black Outline */}
      <path
        d="M26,38 C26,20 37,10 52,10 C67,10 78,20 78,38 C78,48 76,56 70,64 C66,69 64,76 66,82 C67,86 65,92 61,92 C57,92 56,84 55,78 C54,74 50,72 46,76 C42,80 43,98 42,104 C41,109 37,110 35,106 C32,100 34,80 32,74 C30,68 24,70 24,76 C24,84 22,96 19,96 C16,96 16,84 18,74 C20,64 24,56 26,48 Z"
        fill="#FFCA00"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <ellipse cx="45" cy="34" rx="4" ry="7" fill="#111111" />
      <ellipse cx="61" cy="34" rx="4" ry="7" fill="#111111" />

      {/* Wavy Drippy Smirk / Smile */}
      <path
        d="M36,44 C38,47 42,54 52,56 C62,58 68,50 71,46"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Smile dimple ticks */}
      <path
        d="M34,43 L37,46"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M71,45 L73,48"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Drip Shading / Melt Creases */}
      <path
        d="M55,76 C55,80 57,86 58,88"
        stroke="#E69500"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M44,78 C44,88 43,98 41,102"
        stroke="#E69500"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M33,76 C33,82 31,90 27,94"
        stroke="#E69500"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
