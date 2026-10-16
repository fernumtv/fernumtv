import React from "react";

export function LipsLightningSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Die-cut White Base */}
      <g
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      >
        {/* Unified Silhouette */}
        <path
          d="M24,54 
             C22,36 38,24 58,24 
             C70,24 86,28 98,42 
             C106,50 102,64 92,72 
             C82,80 66,82 52,80 
             C44,88 56,104 52,106 
             C48,106 36,92 36,86 
             C30,82 24,68 24,54 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Main Mouth Opening (Black Interior) */}
      <path
        d="M26,56 C34,42 46,38 58,40 C70,38 84,44 94,44 C88,60 74,72 58,72 C42,72 32,64 26,56 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* White Teeth (Top Row) */}
      <path
        d="M38,48 C46,45 54,44 58,44 C64,44 72,45 80,48 L78,54 C72,56 66,57 58,57 C50,57 44,56 40,54 Z"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line x1="51" y1="45" x2="51" y2="56" stroke="#111111" strokeWidth="2" />
      <line x1="58" y1="44" x2="58" y2="57" stroke="#111111" strokeWidth="2" />
      <line x1="66" y1="45" x2="66" y2="56" stroke="#111111" strokeWidth="2" />

      {/* Lightning Tongue (Hot Magenta-Red sticking out like Image 1) */}
      <polygon
        points="48,56 74,53 90,62 70,68 88,82 54,106 64,86 44,82"
        fill="#FF0055"
        stroke="#111111"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Tongue 3D Facet */}
      <polygon
        points="70,68 88,82 54,106 62,90 56,84"
        fill="#D60042"
      />
      {/* Tongue Highlight Glare */}
      <polygon
        points="50,58 72,55 84,62 70,66"
        fill="#FF6699"
      />

      {/* Upper Lip (Purple / Magenta Pop Art) */}
      <path
        d="M24,56 C32,38 46,32 58,37 C70,32 84,38 96,44 C86,52 72,50 58,48 C44,50 32,52 24,56 Z"
        fill="#B800B8"
        stroke="#111111"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Upper Lip Shine */}
      <path
        d="M38,40 C44,36 52,37 54,39 C48,41 42,41 38,40 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Lower Lip (Purple / Magenta) */}
      <path
        d="M26,58 C36,78 58,84 84,76 C94,72 98,66 96,62 C86,68 72,70 58,68 C44,70 32,66 26,58 Z"
        fill="#990099"
        stroke="#111111"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
