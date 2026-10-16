import React from "react";

export function MeltingSmileySticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 130"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Die-cut White Outline */}
      <path
        d="M28,44 
           C26,20 40,8 58,8 
           C76,8 90,20 88,44 
           C86,56 82,64 78,70 
           C74,76 72,84 74,90 
           C75,94 72,100 68,100 
           C63,100 62,90 60,82 
           C59,78 54,76 50,82 
           C46,88 48,108 46,116 
           C44,122 39,122 37,116 
           C34,108 36,86 34,78 
           C32,70 25,72 25,80 
           C25,88 23,102 19,102 
           C15,102 15,88 18,76 
           C20,64 26,56 28,44 Z"
        fill="#FFD000"
        stroke="#FFFFFF"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />

      {/* Main Yellow Melting Silhouette with Black Outline */}
      <path
        d="M28,44 
           C26,20 40,8 58,8 
           C76,8 90,20 88,44 
           C86,56 82,64 78,70 
           C74,76 72,84 74,90 
           C75,94 72,100 68,100 
           C63,100 62,90 60,82 
           C59,78 54,76 50,82 
           C46,88 48,108 46,116 
           C44,122 39,122 37,116 
           C34,108 36,86 34,78 
           C32,70 25,72 25,80 
           C25,88 23,102 19,102 
           C15,102 15,88 18,76 
           C20,64 26,56 28,44 Z"
        fill="#FFC700"
        stroke="#111111"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Oval Black Eyes */}
      <ellipse cx="48" cy="38" rx="4.5" ry="8" fill="#111111" />
      <ellipse cx="68" cy="38" rx="4.5" ry="8" fill="#111111" />

      {/* Wavy Smirk Smile */}
      <path
        d="M38,50 C41,54 48,64 58,64 C68,64 76,56 80,52"
        stroke="#111111"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cheek dimple ticks */}
      <path
        d="M36,49 L39,52"
        stroke="#111111"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M80,51 L83,54"
        stroke="#111111"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Drip Shading Accent Creases */}
      <path
        d="M62,82 C63,88 65,96 66,97"
        stroke="#D98800"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48,84 C48,96 47,108 44,114"
        stroke="#D98800"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M34,82 C34,90 32,100 27,100"
        stroke="#D98800"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
