"use client";

import React, { useState, useEffect, useRef } from "react";

interface DeferredSectionProps {
  children: React.ReactNode;
  minHeight?: string | number;
  rootMargin?: string;
}

/**
 * Defers rendering and hydration of heavy below-the-fold interactive components
 * until they are scrolled into proximity of the viewport.
 */
export function DeferredSection({
  children,
  minHeight = "360px",
  rootMargin = "350px",
}: DeferredSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const styleMinHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;

  return (
    <div ref={containerRef}>
      {isVisible ? children : <div style={{ minHeight: styleMinHeight }} />}
    </div>
  );
}
