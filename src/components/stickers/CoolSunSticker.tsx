import React from "react";

export function CoolSunSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 5px 8px rgba(0,0,0,0.28))" }}
    >
      {/* Outer Die-cut White Outline */}
      <path
        d="M50,8 
           C54,8 57,14 62,15 
           C67,16 73,13 77,17 
           C81,21 78,27 80,32 
           C82,37 88,40 88,45 
           C88,50 82,53 80,58 
           C78,63 81,69 77,73 
           C73,77 67,74 62,75 
           C57,76 54,82 50,82 
           C46,82 43,76 38,75 
           C33,74 27,77 23,73 
           C19,69 22,63 20,58 
           C18,53 12,50 12,45 
           C12,40 18,37 20,32 
           C22,27 19,21 23,17 
           C27,13 33,16 38,15 
           C43,14 46,8 50,8 Z"
        fill="#FF7A00"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />

      {/* Sun Ray Outline (Orange with Black Border) */}
      <path
        d="M50,8 
           C54,8 57,14 62,15 
           C67,16 73,13 77,17 
           C81,21 78,27 80,32 
           C82,37 88,40 88,45 
           C88,50 82,53 80,58 
           C78,63 81,69 77,73 
           C73,77 67,74 62,75 
           C57,76 54,82 50,82 
           C46,82 43,76 38,75 
           C33,74 27,77 23,73 
           C19,69 22,63 20,58 
           C18,53 12,50 12,45 
           C12,40 18,37 20,32 
           C22,27 19,21 23,17 
           C27,13 33,16 38,15 
           C43,14 46,8 50,8 Z"
        fill="#FF7A00"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Sun Face Circle */}
      <circle
        cx="50"
        cy="45"
        r="26"
        fill="#FFCA00"
        stroke="#111111"
        strokeWidth="2.5"
      />

      {/* Sunglasses Frame and Bridge */}
      {/* Left Lens */}
      <path
        d="M27,42 C27,37 36,37 45,39 C44,46 38,50 32,50 C28,50 27,46 27,42 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right Lens */}
      <path
        d="M55,39 C64,37 73,37 73,42 C73,46 72,50 68,50 C62,50 56,46 55,39 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Sunglasses Bridge */}
      <path
        d="M44,40 C47,39 53,39 56,40"
        stroke="#111111"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Sunglasses Sides */}
      <line x1="26" y1="42" x2="22" y2="43" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="74" y1="42" x2="78" y2="43" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />

      {/* Sunglasses White Lens Glare */}
      <path
        d="M32,41 C36,41 40,42 42,43"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M58,43 C60,42 64,41 68,41"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Cheeky Smile */}
      <path
        d="M51,57 C54,61 60,61 63,57"
        stroke="#111111"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheek Dimple Tick */}
      <path
        d="M62,56 L64,58"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
