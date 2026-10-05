"use client";

import React from "react";

export function FernumMarquee() {
  const phrases = [
    "FIND THE FILES",
    "FREE THE SPACE",
    "KEEP WHAT MATTERS",
    "DELETE WITH CONFIDENCE",
    "NO STORAGE JUMPSCARES",
    "WINDOWS 10 + 11 NATIVE",
    "SEE THE GIANTS",
    "ZERO DETECTIVE WORK",
  ];

  return (
    <div className="w-full bg-[#15171D] border-y border-[#2A2F3D] py-3.5 overflow-hidden select-none relative z-20">
      <div className="flex animate-marquee-left whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            {phrases.map((phrase, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span className="font-mono-data text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A5ABB8] hover:text-[#B6FF33] transition-colors">
                  {phrase}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF33]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
