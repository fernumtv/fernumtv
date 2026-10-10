import React from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { StudioFAQ } from "@/components/studio/StudioFAQ";
import { BackToTop } from "@/components/studio/BackToTop";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/schema";

const faqData = [
  {
    question: "Do AI ads work?",
    answer:
      "It depends on your product and creative angle. AI provides speed and visual fidelity, but conversions depend on whether your hook addresses a real customer pain. That is why every ad we produce includes 3 alternate hooks—to test what actually converts on your ad account.",
  },
  {
    question: "Who owns the videos?",
    answer:
      "Commercial use of delivered ads is included. Once delivered and paid for, you receive full commercial rights to all finished video exports, voiceovers, and scripts for your brand's advertising without usage royalties.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Each ad slot includes 2 rounds of revisions. If you need pacing sped up, captions adjusted, music swapped, or specific visual cuts trimmed, submit your notes and we will execute updates within 2 business days.",
  },
  {
    question: "What if I don't like the ad?",
    answer:
      "We send written script concepts and hook angles before rendering to align on direction first. If the final cut is not a fit, you have 2 revision rounds. There are no lock-in contracts. Cancel anytime. Cancellation takes effect at the end of the current billing period.",
  },
  {
    question: "What platforms do you format for?",
    answer:
      "Every ad is rendered in 3 aspect ratios: 9:16 vertical (TikTok, Instagram Reels, YouTube Shorts), 1:1 square (Facebook and Instagram Feeds), and 16:9 widescreen (Desktop and YouTube). All files are Full HD 1080p master MP4s.",
  },
  {
    question: "Do you disclose AI use and what are your boundaries?",
    answer:
      "Yes. Some visuals and voices in our ads are AI-generated. Every ad is planned, scripted and reviewed by the Fernum team before delivery. We do not do on-location camera shoots, actor casting, or manage ad spend/campaigns in your ad account. We are a dedicated creative production studio delivering finished, tested ad variations ready for your media buyer to scale.",
  },
];

const breadcrumbData = [
  { name: "Home", url: "https://fernum.online" },
  { name: "FAQ", url: "https://fernum.online/faq" },
];

export default function FAQPage() {
  const faqSchema = getFAQSchema(faqData);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbData);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans">
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <StudioNavbar />

      <main className="py-12 sm:py-16">
        {/* Page Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Questions & Answers</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-lg sm:text-xl opacity-80 font-normal max-w-2xl leading-relaxed">
            Every answer in plain English. No corporate hedging, no hidden fees, and transparent disclosures on our production tools.
          </p>
        </div>

        {/* Full FAQ Accordion */}
        <StudioFAQ hideHeader={true} />

        {/* Support Direct Contact Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                Have a question not answered here?
              </h2>
              <p className="text-xs font-mono opacity-75 mt-1">
                Reach out to us directly at <a href={`mailto:${siteConfig.contactEmail}`} className="underline font-bold text-[var(--accent)]">{siteConfig.contactEmail}</a> or book a 30-minute intro call.
              </p>
            </div>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 shrink-0"
            >
              <span>Book a 30-Min Call</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <BackToTop />
      <StudioFooter />
    </div>
  );
}
