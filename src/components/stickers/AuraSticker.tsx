import React from "react";
import Image from "next/image";

export function AuraSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-1000-aura.png"
        alt="+1000 Aura Sticker"
        width={586}
        height={337}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
