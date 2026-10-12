"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/studio/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

const CookieConsentBanner = dynamic(
  () => import("@/components/studio/CookieConsentBanner").then((mod) => mod.CookieConsentBanner),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <CustomCursor />
      <CookieConsentBanner />
    </>
  );
}
