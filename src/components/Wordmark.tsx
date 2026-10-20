import React from "react";
import { Bowlby_One } from "next/font/google";

const bowlby = Bowlby_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Wordmark({ className = "", size = "md" }: WordmarkProps) {
  const sizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl lg:text-5xl",
  }[size];

  return (
    <span
      className={`${bowlby.className} ${sizeClasses} inline-block font-normal uppercase tracking-wider select-none transform -rotate-3 transition-transform leading-none ${className}`}
      style={{
        color: "var(--accent)",
        WebkitTextStroke: "5px #FFFFFF",
        paintOrder: "stroke fill",
        textShadow:
          "1.5px 1.5px 0px #111111, 2.5px 2.5px 0px #111111, 3.5px 3.5px 0px #111111, 4.5px 4.5px 0px #111111",
      }}
      aria-label="Fernum"
    >
      FERNUM
    </span>
  );
}
