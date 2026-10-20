"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DeferredSection } from "./DeferredSection";

import { HookRoulette } from "./HookRoulette";

const DynamicHookSwipeStack = dynamic(
  () => import("./HookSwipeStack").then((mod) => mod.HookSwipeStack),
  { ssr: false }
);

const DynamicHookBattle = dynamic(
  () => import("./HookBattle").then((mod) => mod.HookBattle),
  { ssr: false }
);

const DynamicAdRoiCalculator = dynamic(
  () => import("./AdRoiCalculator").then((mod) => mod.AdRoiCalculator),
  { ssr: false }
);

export function DeferredHookRoulette() {
  return <HookRoulette />;
}

export function DeferredHookSwipeStack() {
  return (
    <DeferredSection minHeight={520}>
      <DynamicHookSwipeStack />
    </DeferredSection>
  );
}

export function DeferredHookBattle() {
  return (
    <DeferredSection minHeight={500}>
      <DynamicHookBattle />
    </DeferredSection>
  );
}

export function DeferredAdRoiCalculator() {
  return (
    <DeferredSection minHeight={450}>
      <DynamicAdRoiCalculator />
    </DeferredSection>
  );
}
