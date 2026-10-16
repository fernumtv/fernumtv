import React from "react";

export function CoolSunSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 110"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Die-cut White Outline */}
      <path
        d="M55,8 
           C60,8 63,15 69,16 
           C75,17 81,13 86,18 
           C91,23 87,29 90,35 
           C93,41 99,44 99,50 
           C99,56 93,59 90,65 
           C87,71 91,77 86,82 
           C81,87 75,83 69,84 
           C63,85 60,92 55,92 
           C50,92 47,85 41,84 
           C35,83 29,87 24,82 
           C19,77 23,71 20,65 
           C17,59 11,56 11,50 
           C11,44 17,41 20,35 
           C23,29 19,23 24,18 
           C29,13 35,17 41,16 
           C47,15 50,8 55,8 Z"
        fill="#FF7700"
        stroke="#FFFFFF"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ paintOrder: "stroke fill" }}
      />

      {/* Sun Ray Outer Outline (Orange with Black Border) */}
      <path
        d="M55,8 
           C60,8 63,15 69,16 
           C75,17 81,13 86,18 
           C91,23 87,29 90,35 
           C93,41 99,44 99,50 
           C99,56 93,59 90,65 
           C87,71 91,77 86,82 
           C81,87 75,83 69,84 
           C63,85 60,92 55,92 
           C50,92 47,85 41,84 
           C35,83 29,87 24,82 
           C19,77 23,71 20,65 
           C17,59 11,56 11,50 
           C11,44 17,41 20,35 
           C23,29 19,23 24,18 
           C29,13 35,17 41,16 
           C47,15 50,8 55,8 Z"
        fill="#FF7700"
        stroke="#111111"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Sun Face Circle */}
      <circle
        cx="55"
        cy="50"
        r="28"
        fill="#FFC700"
        stroke="#111111"
        strokeWidth="3.2"
      />

      {/* Sunglasses (Black frames like Image 3) */}
      {/* Left Lens */}
      <path
        d="M31,46 C31,40 40,40 50,43 C49,51 43,55 36,55 C32,55 31,51 31,46 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right Lens */}
      <path
        d="M60,43 C70,40 79,40 79,46 C79,51 78,55 74,55 C67,55 61,51 60,43 Z"
        fill="#111111"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Sunglasses Bridge */}
      <path
        d="M49,44 C52,43 58,43 61,44"
        stroke="#111111"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Sunglasses Temple Arms */}
      <line x1="30" y1="46" x2="26" y2="47" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="80" y1="46" x2="84" y2="47" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />

      {/* Glossy White Reflections on Lenses */}
      <path
        d="M37,45 C41,45 45,46 47,47"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M63,47 C66,46 70,45 74,45"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Cheeky Smile */}
      <path
        d="M56,63 C60,68 67,67 70,62"
        stroke="#111111"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dimple Tick */}
      <path
        d="M69,61 L71,64"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
