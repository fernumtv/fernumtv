import React from "react";
import Image from "next/image";

export function CurseTongueSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-curse-tongue.png"
        alt="Curse Tongue Sticker"
        width={502}
        height={362}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
