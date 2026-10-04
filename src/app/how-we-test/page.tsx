"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Clock,
  BarChart3,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { HookBattle } from "@/components/studio/HookBattle";
import { BackToTop } from "@/components/studio/BackToTop";

interface TestTopic {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  emoji: string;
  detailedTitle: string;
  detailedSubtitle: string;
  intro: string;
  bullets?: string[];
  isHookBattle?: boolean;
  isDiagram?: boolean;
}

const TOPICS: TestTopic[] = [
  {
    id: "3-hook-method",
    badge: "01 // METHODOLOGY",
    title: "The 3-Hook Method",
    shortDesc: "One ad concept, three distinct opening lines to find your winning angle.",
    icon: Flame,
    color: "bg-[var(--accent)]",
    textColor: "text-[var(--accent-fg)]",
    emoji: "🎯",
    detailedTitle: "The 3-Hook Method",
    detailedSubtitle: "Test 3 psychology angles without paying for 3 separate full shoots.",
    intro:
      "Instead of producing unrelated videos and guessing why one converted, we produce one high-retention direct-response body cut paired with three alternate opening hooks.",
    bullets: [
      "Hook A (Direct Pain): Hits the exact daily friction that makes customers look for a solution.",
      "Hook B (Curiosity & Visual Proof): Uses dynamic macro B-roll to stop scrollers in their tracks.",
      "Hook C (Social Proof & Authority): Overcomes skepticism with honest comparisons or founder logic.",
    ],
  },
  {
    id: "hook-battle",
    badge: "02 // INTERACTIVE TOOL",
    title: "Hook Battle",
    shortDesc: "Try our sample-hook tool to generate 3 opening lines in seconds.",
    icon: Zap,
    color: "bg-[var(--block-1-bg)]",
    textColor: "text-[var(--block-1-fg)]",
    emoji: "⚡",
    detailedTitle: "Hook Battle Mini-Tool",
    detailedSubtitle: "Generate direct-response opening hooks live in your browser.",
    intro:
      "Select your product category and tone below to preview how our scripts structure the crucial first 3 seconds of your ads.",
    isHookBattle: true,
  },
  {
    id: "3-second-rule",
    badge: "03 // ATTENTION RETENTION",
    title: "The 3-Second Rule",
    shortDesc: "What happens in the first 3 seconds of a scroll-stopping video ad.",
    icon: Clock,
    color: "bg-[var(--block-3-bg)]",
    textColor: "text-[var(--block-3-fg)]",
    emoji: "⏱️",
    detailedTitle: "The 3-Second Rule",
    detailedSubtitle: "The first 3 seconds dictate your CPM, hold rate, and ad spend efficiency.",
    intro:
      "Over 70% of viewers scroll away within the first 3 seconds on TikTok, Reels, and Shorts. Every millisecond of your opening is engineered for visual and conceptual grip.",
    bullets: [
      "0.0s – 1.0s (The Pattern Interrupt): Immediate contrast, macro textures, or bold audio statement.",
      "1.0s – 2.0s (The Recognition): Direct statement of the viewer's problem so they feel understood.",
      "2.0s – 3.0s (The Bridge): Seamless pivot into your product's mechanism before the swipe.",
    ],
  },
  {
    id: "metrics-decoded",
    badge: "04 // PLAIN METRICS",
    title: "Metrics, Decoded",
    shortDesc: "Hook rate, hold rate, CTR, and cost per result explained in plain words.",
    icon: BarChart3,
    color: "bg-[var(--sticker-1)]",
    textColor: "text-[var(--page-fg)]",
    emoji: "📊",
    detailedTitle: "Metrics, Decoded",
    detailedSubtitle: "No confusing agency jargon. Here are the 4 numbers that actually matter.",
    intro:
      "We build every cut around transparent, verifiable metrics that you can review inside Meta Ads Manager or TikTok Ads Manager.",
    bullets: [
      "Hook Rate (3s Views ÷ Impressions): Shows how effectively the opening line stopped the scroll. Target: 30%+.",
      "Hold Rate (15s Views ÷ 3s Views): Demonstrates whether the middle body script maintained interest. Target: 20%+.",
      "Outbound CTR & CPR: How many viewers actually clicked your link, and your blended cost per purchase or lead.",
    ],
  },
  {
    id: "the-test-loop",
    badge: "05 // ITERATION PIPELINE",
    title: "The Test Loop",
    shortDesc: "Results → Learn → Next month's brief. See our systematic monthly cycle.",
    icon: RefreshCw,
    color: "bg-[var(--accent)]",
    textColor: "text-[var(--accent-fg)]",
    emoji: "🔄",
    detailedTitle: "The Test Loop",
    detailedSubtitle: "How monthly ad subscriptions turn paid traffic into compounding learnings.",
    intro:
      "Video ads aren't one-off lottery tickets. We run a continuous monthly feedback loop where each delivery is informed by previous live campaign data.",
    isDiagram: true,
    bullets: [
      "Step 1: Deploy 3 concepts with 3 hook variations across your paid channels.",
      "Step 2: Inspect which hook generated the lowest cost per result within 7–10 days.",
      "Step 3: Feed winning angles directly into next month's creative brief to compound ROAS.",
    ],
  },
  {
    id: "what-we-wont-promise",
    badge: "06 // HONEST LIMITS",
    title: "What We Won't Promise",
    shortDesc: "Honest boundaries: no guaranteed ROAS, no fake viral claims, no retainers.",
    icon: ShieldAlert,
    color: "bg-[var(--block-4-bg)]",
    textColor: "text-[var(--block-4-fg)]",
    emoji: "🛡️",
    detailedTitle: "What We Won't Promise",
    detailedSubtitle: "Clear boundaries and direct honesty about what creative can and cannot do.",
    intro:
      "We are an ad production and creative testing studio, not growth gurus selling fantasies. We believe in clear, upfront transparency.",
    bullets: [
      "No guaranteed ROAS: Conversions depend on your product offer, pricing, reviews, and landing page quality.",
      "No black-hat hacks: We produce policy-compliant, high-fidelity ad creative designed to build long-term brand equity.",
      "No agency lock-in: No 6-month retainers. Pause or cancel anytime for the upcoming billing cycle.",
    ],
  },
];

export default function HowWeTestPage() {
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeTopic = activeTopicIndex !== null ? TOPICS[activeTopicIndex] : null;

  // Open modal
  const openTopic = (index: number) => {
    setActiveTopicIndex(index);
  };

  // Close modal and return focus to triggering tile
  const closeModal = () => {
    const prevIndex = activeTopicIndex;
    setActiveTopicIndex(null);
    if (prevIndex !== null && triggerRefs.current[prevIndex]) {
      triggerRefs.current[prevIndex]?.focus();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTopicIndex((prev) =>
      prev === null ? null : (prev - 1 + TOPICS.length) % TOPICS.length
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTopicIndex((prev) =>
      prev === null ? null : (prev + 1) % TOPICS.length
    );
  };

  // Scroll lock and keyboard navigation / focus trap
  useEffect(() => {
    if (activeTopicIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    // Focus close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        setActiveTopicIndex((prev) =>
          prev === null ? null : (prev - 1 + TOPICS.length) % TOPICS.length
        );
      } else if (e.key === "ArrowRight") {
        setActiveTopicIndex((prev) =>
          prev === null ? null : (prev + 1) % TOPICS.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeTopicIndex]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans">
      <StudioNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Page Header */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal">
            <span>● Creative Testing Framework</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[var(--page-fg)] tracking-tighter uppercase leading-[0.95] mb-4">
            HOW WE TEST
          </h1>
          <p className="text-lg sm:text-xl opacity-85 font-normal max-w-2xl leading-relaxed">
            Click any tile below to explore our 3-hook methodology, metrics breakdown, interactive hook generator, and honest boundaries.
          </p>
        </div>

        {/* 6 Interactive Option Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TOPICS.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                ref={(el) => {
                  triggerRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => openTopic(idx)}
                aria-haspopup="dialog"
                className="group text-left bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-6 sm:p-7 shadow-brutal hover:shadow-brutal-xl hover:-translate-y-1.5 transition-all duration-150 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 bg-[var(--block-1-bg)]/20 border border-[var(--border)] text-[10px] font-mono font-bold uppercase opacity-80">
                      {topic.badge}
                    </span>
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {topic.emoji}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 ${topic.color} ${topic.textColor} border-2 border-[var(--border)] flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight leading-tight">
                      {topic.title}
                    </h2>
                  </div>

                  <p className="text-sm opacity-80 font-sans leading-relaxed">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-dashed border-[var(--border)]/20 flex items-center justify-between text-xs font-mono font-bold uppercase">
                  <span className="text-[var(--accent)] group-hover:underline">
                    Tap to view details
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--border)] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 p-8 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-black text-xl uppercase tracking-tight">
              Ready to test 3 hooks on your product?
            </h3>
            <p className="text-xs font-mono opacity-75">
              Subscription plans include 1 to 3 concept ads with 3 hook variations each month.
            </p>
          </div>
          <Link
            href="/#pricing"
            className="btn-squish btn-magnetic h-[48px] px-6 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all flex items-center gap-2 shrink-0"
          >
            <span>View Subscription Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* POP-UP MODAL (Centered, 70vw x 70vh, Blur Backdrop, Focus Trap) */}
      {activeTopic && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-topic-title"
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-[var(--block-4-bg)]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-[92vw] sm:w-[70vw] max-w-4xl h-[85vh] sm:h-[70vh] bg-[var(--page-bg)] text-[var(--page-fg)] border-3 border-[var(--border)] shadow-brutal-xl flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-150 relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-b-2 border-[var(--border)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] text-[10px] font-mono font-bold uppercase border border-[var(--border)]">
                  {activeTopic.badge}
                </span>
                <span className="text-xs font-mono opacity-70 hidden sm:inline">
                  Topic {activeTopicIndex! + 1} of {TOPICS.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous topic"
                  className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--block-2-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next topic"
                  className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--block-2-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  aria-label="Close dialog"
                  className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--block-4-bg)] text-[var(--block-4-fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] flex items-center justify-center cursor-pointer shadow-sm ml-2 transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h2
                  id="popup-topic-title"
                  className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-1"
                >
                  {activeTopic.detailedTitle}
                </h2>
                <p className="text-xs sm:text-sm font-mono opacity-75">
                  {activeTopic.detailedSubtitle}
                </p>
              </div>

              {/* Intro Paragraph */}
              <p className="text-base sm:text-lg opacity-85 font-sans leading-relaxed">
                {activeTopic.intro}
              </p>

              {/* Hook Battle Embed */}
              {activeTopic.isHookBattle && (
                <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-4 sm:p-6 shadow-brutal">
                  <HookBattle />
                </div>
              )}

              {/* Test Loop SVG Diagram */}
              {activeTopic.isDiagram && (
                <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-5 shadow-brutal">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-[var(--block-1-bg)] text-[var(--block-1-fg)] border-2 border-[var(--border)]">
                      <span className="font-mono text-xs font-bold block opacity-80">STAGE 1</span>
                      <strong className="text-xs font-display uppercase">Deploy 3 Hooks</strong>
                    </div>
                    <div className="p-3 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)]">
                      <span className="font-mono text-xs font-bold block opacity-80">STAGE 2</span>
                      <strong className="text-xs font-display uppercase">Track Hold Rate</strong>
                    </div>
                    <div className="p-3 bg-[var(--block-3-bg)] text-[var(--block-3-fg)] border-2 border-[var(--border)]">
                      <span className="font-mono text-xs font-bold block opacity-80">STAGE 3</span>
                      <strong className="text-xs font-display uppercase">Select Winner</strong>
                    </div>
                    <div className="p-3 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)]">
                      <span className="font-mono text-xs font-bold block opacity-80">STAGE 4</span>
                      <strong className="text-xs font-display uppercase">Feed Next Brief</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Bullets (Max 3, Plain Specific Language) */}
              {activeTopic.bullets && (
                <div className="space-y-3 pt-2">
                  {activeTopic.bullets.map((b, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] shadow-sm flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5 stroke-[2.5]" />
                      <p className="text-sm font-sans leading-relaxed">
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="px-6 py-4 bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-t-2 border-[var(--border)] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono opacity-70">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--page-bg)] border border-[var(--border)] font-mono text-[10px]">Esc</kbd> to close or use arrow keys ← →
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-[var(--block-4-bg)] hover:bg-[var(--accent)] text-[var(--block-4-fg)] hover:text-[var(--accent-fg)] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--border)] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <BackToTop />
      <StudioFooter />
    </div>
  );
}
