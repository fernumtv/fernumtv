import React from "react";
import Image from "next/image";

export function SpiderWebSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-spider-web.png"
        alt="Spider Web Sticker"
        width={420}
        height={460}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
