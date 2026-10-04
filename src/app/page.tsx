"use client";

import React from "react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioHero } from "@/components/studio/StudioHero";
import { MarqueeBand } from "@/components/studio/MarqueeBand";
import { HomeWorkPreview } from "@/components/studio/HomeWorkPreview";
import { HomeProcessTeaser } from "@/components/studio/HomeProcessTeaser";
import { StudioPricing } from "@/components/studio/StudioPricing";
import { StudioBriefForm } from "@/components/studio/StudioBriefForm";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { BackToTop } from "@/components/studio/BackToTop";

export default function FernumLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)]">
      {/* 1. Nav: Logo, Links (Work, Structure, How we test, Pricing, FAQ, About), Vibe, Book a Call */}
      <StudioNavbar />

      <main>
        {/* 2. Hero: 5-Second Clarity, Book a Call, See our work button */}
        <StudioHero />

        {/* 3. Marquee Strip */}
        <MarqueeBand
          direction="left"
          phrases={[
            "1 TO 3 ADS EVERY MONTH",
            "3 ALTERNATE HOOKS PER AD",
            "FULL HD 9:16 + 1:1 + 16:9",
            "2 REVISIONS INCLUDED",
            "TEST YOUR FIRST 3 SECONDS",
            "NO LONG-TERM CONTRACTS",
          ]}
        />

        {/* 4. "Our work" preview (3 video cards plus a "See our work" button) */}
        <HomeWorkPreview />

        {/* 5. 3-step process teaser with a "See our structure" button */}
        <HomeProcessTeaser />

        {/* 6. Pricing: Launch ($499), Growth ($799), Scale ($1,099) */}
        <StudioPricing />

        {/* 7. Final Call-To-Action (Intake Brief Form / Strategy Call) */}
        <StudioBriefForm />
      </main>

      {/* 8. Footer */}
      <StudioFooter />

      {/* Back to top sticker button */}
      <BackToTop />
    </div>
  );
}
