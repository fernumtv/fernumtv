import React from "react";
import Image from "next/image";

export function AlienSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-alien.png"
        alt="Green Alien Sticker"
        width={639}
        height={606}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
