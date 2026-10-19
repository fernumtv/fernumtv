import React from "react";
import Image from "next/image";

export function SpidermanSenseSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-spiderman-sense.png"
        alt="Spider-Man Spider-Sense Sticker"
        width={594}
        height={592}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
