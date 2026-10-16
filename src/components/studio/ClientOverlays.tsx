"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () => import("@/components/studio/CookieConsentBanner").then((mod) => mod.CookieConsentBanner),
  { ssr: false }
);

export function ClientOverlays() {
  return <CookieConsentBanner />;
}
