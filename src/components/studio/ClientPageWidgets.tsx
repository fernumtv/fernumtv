"use client";

import dynamic from "next/dynamic";

const BackToTop = dynamic(
  () => import("@/components/studio/BackToTop").then((mod) => mod.BackToTop),
  { ssr: false }
);

export function ClientPageWidgets() {
  return <BackToTop />;
}
