"use client";

import React from "react";
import { UserCheck, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

export function StudioAbout() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl space-y-8">
          {/* Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider shadow-brutal">
              <UserCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>About The Studio</span>
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70 bg-[var(--page-bg)] text-[var(--page-fg)] px-3 py-1 border border-[var(--border)]">
              Direct Creative Direction
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-[0.95]">
              WHO MAKES THE ADS & WHY
            </h2>
            {siteConfig.founderName ? (
              <div className="text-sm font-mono font-bold uppercase text-[var(--accent)] tracking-wide">
                Founded & Directed by {siteConfig.founderName}
              </div>
            ) : null}
          </div>

          {/* Two Honest Lines */}
          <div className="space-y-4 text-base sm:text-lg opacity-90 font-medium leading-relaxed border-t-2 border-[var(--border)]/15 pt-6">
            <p>
              Fernum was built because traditional agencies rely on slow communication cycles and heavy retainers, while generic automated AI tools pump out robotic, unhinged junk that gets ignored in feeds.
            </p>
            <p>
              Every ad is planned, scripted and reviewed by the Fernum team before delivery—using generative AI tools for visual speed so D2C brands can test winning variations every month without agency overhead.
            </p>
          </div>

          {/* Transparency Callout */}
          <div className="p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] rounded-none flex items-start sm:items-center gap-3 text-xs font-mono text-[var(--page-fg)]">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Transparency guarantee:</strong> Some visuals and voices in our ads are AI-generated. A person reviews every script, caption and final cut.
            </span>
          </div>

          {/* Link to booking */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="book"
              onClick={() => trackEvent("Book a Call Click", { location: "about" })}
              className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Talk With Creative Direction (30 Min)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
