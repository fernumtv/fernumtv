"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do the 3 alternate hooks work for each ad?",
      a: "On Meta and TikTok, 70% of creative performance is dictated by the first 3 seconds. For each approved ad script, we generate and deliver 3 different psychological hook openers (e.g. a Direct Pain Callout, a Curiosity Contrast, and a UGC Review Angle). The body of the ad stays cohesive, allowing you to test 3 distinct creatives in your ad manager at no extra cost.",
    },
    {
      q: "What aspect ratios and formats do I receive?",
      a: "Every finished ad ships in Full HD across all 3 standard aspect ratios: 9:16 Vertical (ideal for Instagram Reels, TikTok, YouTube Shorts), 1:1 Square (for Instagram and Facebook feeds), and 16:9 Landscape. Dynamic animated captions and audio are mixed to standard broadcast loudness.",
    },
    {
      q: "How do revisions work?",
      a: "Every plan includes 2 revisions per ad slot. You can leave precise timestamped feedback or request adjustments to voice tone, caption styling, visual pacing, or product angles directly in your client portal.",
    },
    {
      q: "What is your delivery speed and timeline?",
      a: "Once you submit your brief, our script engine delivers 3 script concepts within 24-48 hours. The moment you approve the script, the finished video ad with all 3 hooks is delivered in 48 to 72 hours—well within the 2 to 3 week delivery window of your monthly plan.",
    },
    {
      q: "Do you disclose AI use?",
      a: "Yes. Some visuals and voices in our ads are AI-generated. Every ad is planned, scripted and reviewed by the Fernum team before delivery, ensuring clean visual quality without synthetic distortions. All music tracks and sound effects are fully cleared for commercial ad spend.",
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes. There are no long-term contracts. Cancel anytime. Cancellation takes effect at the end of the current billing period.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-background/50 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear answers about our D2C short-form video ad production process.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-card/70 border border-white/10 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base cursor-pointer hover:text-purple-300 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/5">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
