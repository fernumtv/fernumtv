import React from "react";

export function LipsLightningSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 5px 8px rgba(0,0,0,0.28))" }}
    >
      {/* Group with Die-cut White Outline */}
      <g
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      >
        {/* Mouth Background / Lips Contour */}
        <path
          d="M18,50 C18,34 32,24 50,24 C62,24 74,28 84,38 C90,44 88,58 78,66 C68,74 52,78 38,76 C26,74 18,64 18,50 Z"
          fill="#1E1B18"
        />

        {/* Upper Lip (Purple / Magenta) */}
        <path
          d="M18,50 C26,38 38,32 50,36 C62,32 76,38 84,38 C74,48 62,48 50,46 C38,48 26,48 18,50 Z"
          fill="#B8148E"
        />

        {/* Teeth */}
        <path
          d="M30,46 C36,44 44,43 50,43 C58,43 66,44 72,46 C70,52 64,54 50,54 C38,54 32,52 30,46 Z"
          fill="#FFFFFF"
        />

        {/* Lower Lip (Purple / Magenta) */}
        <path
          d="M20,54 C30,72 50,76 72,70 C78,68 84,62 82,58 C74,62 60,64 50,62 C38,64 26,60 20,54 Z"
          fill="#B8148E"
        />

        {/* Lightning Bolt Tongue (Vivid Hot Red/Pink) */}
        <polygon
          points="42,50 64,48 78,56 60,62 76,74 46,92 54,76 38,72"
          fill="#FF0854"
        />
      </g>

      {/* Crisp Black Inner Outlines and Details */}
      {/* Mouth Interior */}
      <path
        d="M20,50 C28,40 38,36 50,38 C62,36 74,40 82,40 C76,52 64,62 50,62 C36,62 26,56 20,50 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* White Teeth with division lines */}
      <path
        d="M30,44 C38,42 46,41 50,41 C56,41 64,42 72,44 L70,49 C64,51 58,52 50,52 C42,52 36,51 32,49 Z"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="2"
      />
      <line x1="43" y1="42" x2="43" y2="50" stroke="#111111" strokeWidth="1.8" />
      <line x1="50" y1="41" x2="50" y2="51" stroke="#111111" strokeWidth="1.8" />
      <line x1="57" y1="42" x2="57" y2="50" stroke="#111111" strokeWidth="1.8" />

      {/* Lightning Tongue with 3D edge */}
      <polygon
        points="42,50 64,48 78,56 60,62 76,74 46,92 54,76 38,72"
        fill="#FF0854"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Tongue Facet / Highlight */}
      <polygon
        points="60,62 76,74 46,92 52,78 48,74"
        fill="#D60042"
      />
      <polygon
        points="44,52 62,50 72,56 60,60"
        fill="#FF5288"
      />

      {/* Upper Lip Outer Contour */}
      <path
        d="M18,50 C26,34 38,28 50,33 C62,28 74,34 84,38 C76,46 62,46 50,44 C38,46 26,46 18,50 Z"
        fill="#D916A8"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Upper Lip Shine */}
      <path
        d="M32,36 C38,33 44,34 46,36 C42,38 36,38 32,36 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* Lower Lip Outer Contour */}
      <path
        d="M20,54 C30,72 50,78 72,72 C80,68 84,62 82,58 C72,64 60,66 50,64 C38,66 26,62 20,54 Z"
        fill="#B8148E"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
