import React from "react";
import Image from "next/image";

export function BoxingCatSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-boxing-cat.png"
        alt="Boxing Kitten Sticker"
        width={576}
        height={1024}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
