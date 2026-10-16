import React from "react";

export function EyeSticker({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 70"
      className={`w-full h-full overflow-visible select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.4))" }}
    >
      {/* Outer Eye Shape with Die-cut border */}
      <path
        d="M 10 35 C 25 10, 75 10, 90 35 C 75 60, 25 60, 10 35 Z"
        fill="#F7F3EB"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      />
      <path
        d="M 10 35 C 25 10, 75 10, 90 35 C 75 60, 25 60, 10 35 Z"
        stroke="#111111"
        strokeWidth="3"
        fill="#FFFFFF"
      />

      {/* Iris */}
      <circle cx="50" cy="35" r="18" fill="#6C3BF5" stroke="#111111" strokeWidth="2.5" />
      <circle cx="50" cy="35" r="13" fill="#00E5FF" />

      {/* Pupil */}
      <circle cx="50" cy="35" r="8" fill="#111111" />

      {/* Reflection Highlight */}
      <circle cx="46" cy="31" r="3" fill="#FFFFFF" />
      <circle cx="53" cy="38" r="1.5" fill="#FFFFFF" />

      {/* Retention Eyelash Accents */}
      <line x1="50" y1="13" x2="50" y2="6" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="17" x2="28" y2="10" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="17" x2="72" y2="10" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
