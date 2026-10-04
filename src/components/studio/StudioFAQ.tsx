"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle, PhoneCall, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do AI ads work?",
    answer:
      "It depends on your product and creative angle. AI provides speed and visual fidelity, but conversions depend on whether your hook addresses a real customer pain. That is why every ad we produce includes 3 alternate hooks—to test what actually converts on your ad account.",
  },
  {
    question: "Who owns the videos?",
    answer:
      "You do. Once delivered, you hold 100% full commercial rights to all finished video exports, voiceovers, and scripts. You can run them on Meta, TikTok, YouTube, or your website without expiration dates or usage royalties.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Each ad slot includes 2 rounds of revisions. If you need pacing sped up, captions adjusted, music swapped, or specific visual cuts trimmed, submit your notes and we will execute updates within 24 hours.",
  },
  {
    question: "What if I don't like the ad?",
    answer:
      "We send written script concepts and hook angles before rendering to align on direction first. If the final cut is not a fit, you have 2 revision rounds. There are no lock-in contracts; you can cancel or pause anytime before renewal.",
  },
  {
    question: "What platforms do you format for?",
    answer:
      "Every ad is rendered in 3 aspect ratios: 9:16 vertical (TikTok, Instagram Reels, YouTube Shorts), 1:1 square (Facebook and Instagram Feeds), and 16:9 widescreen (Desktop and YouTube). All files are Full HD 1080p master MP4s.",
  },
  {
    question: "Do you disclose AI use?",
    answer:
      "Yes. Some visuals and voices in our ads are AI-generated. We format and deliver files in full compliance with Meta Ads and TikTok Creative Exchange AI disclosure guidelines. Our senior creative directors verify every frame, ensuring clean visual quality without synthetic distortions or policy flags.",
  },
  {
    question: "What do you not do?",
    answer:
      "We do not do on-location camera shoots, actor casting, or manage ad spend/campaigns in your ad account. We are a dedicated creative production studio that delivers finished, tested ad variations ready for your media buyer to scale.",
  },
];

export function StudioFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(idx);
    }
  };

  return (
    <section id="faq" className="py-24 sm:py-36 bg-[var(--page-bg)] text-[var(--page-fg)] border-t-2 border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--block-2-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Honest Answers</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-[var(--page-fg)] tracking-tight uppercase leading-[0.95] mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-[17px] sm:text-lg text-[var(--page-fg)]/80 font-normal leading-relaxed">
            Straightforward terms, plain answers, and zero agency hype.
          </p>
        </div>

        {/* Accordion List with Full Keyboard & Screen Reader Accessibility */}
        <div className="space-y-4 mb-20" role="region" aria-label="Frequently Asked Questions">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const headingId = `faq-heading-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div
                key={idx}
                className={`border-2 border-[var(--border)] transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[var(--block-2-bg)] shadow-brutal-lg"
                    : "bg-[var(--block-2-bg)] shadow-brutal hover:brightness-95"
                }`}
              >
                <button
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <span className="font-display font-black text-base sm:text-xl text-[var(--block-2-fg)] uppercase tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 border-2 border-[var(--border)] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[var(--accent)] text-[var(--accent-fg)] rotate-180" : "bg-[var(--page-bg)] text-[var(--page-fg)]"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm font-medium text-[var(--block-2-fg)]/85 leading-relaxed border-t border-[var(--border)]/15 pt-4"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action Block with Concrete Line Above It */}
        <div className="bg-[var(--block-1-bg)] text-[var(--block-1-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] text-xs font-mono font-bold uppercase tracking-widest border border-[var(--border)]">
            <span>● Have Creative To Test?</span>
          </div>

          <h3 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-[var(--block-1-fg)] tracking-tight uppercase leading-[0.93]">
            GET FINISHED ADS <br />
            DELIVERED EVERY MONTH.
          </h3>

          <p className="text-sm sm:text-lg text-[var(--block-1-fg)]/90 font-medium max-w-xl mx-auto leading-relaxed">
            Select a plan, send your product brief, and test 3 alternate opening hooks per ad on Meta and TikTok.
          </p>

          {/* Requirement 9: Concrete line above Book a Call */}
          <div className="pt-2">
            <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[var(--block-2-fg)] bg-[var(--block-2-bg)] py-1.5 px-4 border border-[var(--border)] inline-block mb-4 shadow-sm">
              {siteConfig.callMinutes}-minute call. Bring your product and your current ads.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#pricing"
                className="h-[52px] px-8 bg-[var(--block-4-bg)] hover:bg-[var(--block-2-bg)] text-[var(--block-4-fg)] hover:text-[var(--block-2-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2.5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <span>View Pricing Plans</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="book"
                onClick={() => trackEvent("Book a Call Click", { location: "faq" })}
                className="btn-magnetic h-[52px] px-8 bg-[var(--block-2-bg)] hover:bg-[var(--border)]/10 text-[var(--block-2-fg)] font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
                <span>Book a Call</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
