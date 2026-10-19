import React from "react";
import Image from "next/image";

export function BatmanLogoSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-batman-logo.png"
        alt="Batman Logo Sticker"
        width={736}
        height={368}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
