"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/studio/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

const EasterEggOverlay = dynamic(
  () => import("@/components/studio/EasterEggOverlay").then((mod) => mod.EasterEggOverlay),
  { ssr: false }
);

const CookieConsentBanner = dynamic(
  () => import("@/components/studio/CookieConsentBanner").then((mod) => mod.CookieConsentBanner),
  { ssr: false }
);

const AchievementsSystem = dynamic(
  () => import("@/components/studio/AchievementsSystem").then((mod) => mod.AchievementsSystem),
  { ssr: false }
);

import { useState, useEffect } from "react";

export function ClientOverlays() {
  const [isIdleReady, setIsIdleReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Defer until after first paint and browser is idle
    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(
        () => setIsIdleReady(true),
        { timeout: 1500 }
      );
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
      };
    } else {
      const timer = setTimeout(() => setIsIdleReady(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <CookieConsentBanner />
      {isIdleReady && (
        <>
          <CustomCursor />
          <EasterEggOverlay />
          <AchievementsSystem />
        </>
      )}
    </>
  );
}
