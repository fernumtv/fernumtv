"use client";

import dynamic from "next/dynamic";

const ReactionCannon = dynamic(
  () => import("@/components/studio/ReactionCannon").then((mod) => mod.ReactionCannon),
  { ssr: false }
);

const BackToTop = dynamic(
  () => import("@/components/studio/BackToTop").then((mod) => mod.BackToTop),
  { ssr: false }
);

export function ClientPageWidgets() {
  return (
    <>
      <ReactionCannon />
      <BackToTop />
    </>
  );
}
