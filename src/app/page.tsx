"use client";

import React from "react";
import { FernumNavbar } from "@/components/fernum/FernumNavbar";
import { FernumHero } from "@/components/fernum/FernumHero";
import { FernumMarquee } from "@/components/fernum/FernumMarquee";
import { FernumProblemSection } from "@/components/fernum/FernumProblemSection";
import { FernumProductDemo } from "@/components/fernum/FernumProductDemo";
import { FernumBeforeAfter } from "@/components/fernum/FernumBeforeAfter";
import { FernumHowItWorks } from "@/components/fernum/FernumHowItWorks";
import { FernumSafetySection } from "@/components/fernum/FernumSafetySection";
import { FernumFeatureGrid } from "@/components/fernum/FernumFeatureGrid";
import { FernumRealProblems } from "@/components/fernum/FernumRealProblems";
import { FernumDownloadCTA } from "@/components/fernum/FernumDownloadCTA";
import { FernumFAQ } from "@/components/fernum/FernumFAQ";
import { FernumFooter } from "@/components/fernum/FernumFooter";

export default function FernumHomePage() {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F5F7FA] font-sans selection:bg-[#B6FF33] selection:text-[#0A0B0F]">
      {/* 1. Sticky Navigation with Windows 10 & 11 Compatibility Badge */}
      <FernumNavbar />

      <main>
        {/* 2. Command-Center Hero Section with Interactive Storage Gauge */}
        <FernumHero />

        {/* 3. Ticker Marquee Strip */}
        <FernumMarquee />

        {/* 4. Problem Section: The Usual Suspects */}
        <FernumProblemSection />

        {/* 5. Central Product Demo: Command Center Explorer & Treemap */}
        <FernumProductDemo />

        {/* 6. Interactive Before & After: Storage Panic to Breathing Room */}
        <FernumBeforeAfter />

        {/* 7. How It Works: Three Steps. Zero Guesswork */}
        <FernumHowItWorks />

        {/* 8. Safety & Control Section: System Immunity & Safe Review */}
        <FernumSafetySection />

        {/* 9. Product Capabilities & Feature Grid */}
        <FernumFeatureGrid />

        {/* 10. Real-World Moments & Scenarios */}
        <FernumRealProblems />

        {/* 11. Full-Screen Download Command Center CTA */}
        <FernumDownloadCTA />

        {/* 12. Frequently Asked Questions */}
        <FernumFAQ />
      </main>

      {/* 13. Clean Dark Windows Utility Footer */}
      <FernumFooter />
    </div>
  );
}
