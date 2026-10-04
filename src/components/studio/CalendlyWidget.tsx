"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

interface CalendlyWidgetProps {
  url?: string;
  className?: string;
  minWidth?: string;
  height?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget?: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

export function CalendlyWidget({
  url = siteConfig.bookingUrl,
  className = "",
  minWidth = "320px",
  height = "700px",
}: CalendlyWidgetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If Calendly script is already loaded in the document, re-initialize widget
    if (typeof window !== "undefined" && window.Calendly?.initInlineWidget) {
      const container = document.getElementById("calendly-embed-container");
      if (container) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: container,
        });
      }
    }
  }, [url]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Calendly external widget script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.Calendly?.initInlineWidget) {
            const container = document.getElementById("calendly-embed-container");
            if (container) {
              window.Calendly.initInlineWidget({
                url,
                parentElement: container,
              });
            }
          }
        }}
      />

      {/* Calendly inline widget begin */}
      <div
        id="calendly-embed-container"
        className="calendly-inline-widget w-full rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[var(--page-bg)] shadow-brutal"
        data-url={url}
        style={{ minWidth, height }}
      />
      {/* Calendly inline widget end */}
    </div>
  );
}
