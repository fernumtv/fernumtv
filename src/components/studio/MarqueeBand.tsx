"use client";

import React, { useEffect, useRef, useState } from "react";

interface MarqueeBandProps {
  phrases?: string[];
  direction?: "left" | "right";
  bg?: string;
  textColor?: string;
  borderY?: boolean;
  className?: string;
}

export function MarqueeBand({
  phrases = [
    "ADS WITH INTENT",
    "SHIPPED EVERY MONTH",
    "3 HOOKS PER AD",
    "100% HUMAN POLISH",
    "FULL HD 9:16 + 1:1 + 16:9",
    "METRICS OVER OPINIONS",
  ],
  direction = "left",
  bg = "bg-[var(--marquee-bg)]",
  textColor = "text-[var(--marquee-fg)]",
  borderY = true,
  className = "",
}: MarqueeBandProps) {
  const content = phrases.join("  •  ") + "  •  ";
  const [isReversed, setIsReversed] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Reverse on scroll UP
      if (delta < -3) {
        setIsReversed(true);
        setSpeedMultiplier(2.5); // speed up on scroll
      } else if (delta > 3) {
        setIsReversed(false);
        setSpeedMultiplier(2.5); // speed up on scroll
      }

      // Smoothly return to normal speed after scrolling stops
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setSpeedMultiplier(1);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Compute effective direction
  const effectiveDirection = isReversed
    ? direction === "left"
      ? "right"
      : "left"
    : direction;

  const duration = (24 / speedMultiplier).toFixed(1);

  return (
    <div
      data-cursor="marquee"
      className={`w-full overflow-hidden select-none py-3.5 sm:py-4 transition-colors ${bg} ${textColor} ${
        borderY ? "border-y-2 border-[var(--border)]" : ""
      } ${className}`}
    >
      <div
        style={{
          animationDuration: `${duration}s`,
        }}
        className={
          effectiveDirection === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        }
      >
        <span className="text-sm sm:text-base md:text-lg font-display font-black uppercase tracking-wider whitespace-nowrap px-4">
          {content}
        </span>
        <span className="text-sm sm:text-base md:text-lg font-display font-black uppercase tracking-wider whitespace-nowrap px-4">
          {content}
        </span>
        <span className="text-sm sm:text-base md:text-lg font-display font-black uppercase tracking-wider whitespace-nowrap px-4">
          {content}
        </span>
        <span className="text-sm sm:text-base md:text-lg font-display font-black uppercase tracking-wider whitespace-nowrap px-4">
          {content}
        </span>
      </div>
    </div>
  );
}
