import React from "react";
import Image from "next/image";

export function MewingEmojiSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-auto select-none pointer-events-none ${className}`}>
      <Image
        src="/images/stickers/sticker-mewing-emoji.png"
        alt="Mewing Shh Emoji Sticker"
        width={692}
        height={726}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-sm select-none"
        priority
        draggable={false}
      />
    </div>
  );
}
