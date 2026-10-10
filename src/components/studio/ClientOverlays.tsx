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

export function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <EasterEggOverlay />
      <CookieConsentBanner />
      <AchievementsSystem />
    </>
  );
}
