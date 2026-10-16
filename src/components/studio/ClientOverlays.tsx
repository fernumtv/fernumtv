"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () => import("@/components/studio/CookieConsentBanner").then((mod) => mod.CookieConsentBanner),
  { ssr: false }
);

const CircleCursor = dynamic(
  () => import("@/components/CircleCursor").then((mod) => mod.CircleCursor),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <CircleCursor />
      <CookieConsentBanner />
    </>
  );
}
