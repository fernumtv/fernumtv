"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileText, Mail, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";

function ThanksInner() {
  const searchParams = useSearchParams();
  // Safe extraction of query parameters
  const paymentId = searchParams.get("payment_id") || searchParams.get("id");
  const rawStatus = searchParams.get("status");

  // NOTE & SECURITY REQUIREMENT:
  // Query parameters in the URL are never treated as verified proof of payment.
  // We NEVER display or reflect the email parameter from query strings on this page.

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)] flex flex-col justify-between">
      <StudioNavbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        {/* Success Card */}
        <div className="bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] rounded-3xl p-8 sm:p-14 shadow-brutal-xl text-center space-y-8">
          {/* Badge & Icon */}
          <div className="w-20 h-20 bg-[var(--accent)] border-2 border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto shadow-brutal text-[var(--accent-fg)]">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)] text-[var(--block-2-fg)] text-xs font-mono font-bold uppercase tracking-wider">
              <span>Order Received • Studio Onboarding</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight leading-[0.95]">
              YOU'RE IN THE PASS.
            </h1>
            <p className="text-base sm:text-lg opacity-80 font-medium max-w-xl mx-auto">
              Your subscription checkout request has been registered. Welcome to the studio. Here is exactly what happens next to ship your first ads.
            </p>
          </div>

          {/* Dodo Checkout Reference Box (if query param present) */}
          {paymentId && (
            <div className="max-w-md mx-auto p-4 bg-[var(--page-bg)] border-2 border-[var(--border)] shadow-brutal text-left text-xs font-mono space-y-1 text-[var(--page-fg)]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold uppercase">Checkout Ref:</span>
                <span className="font-bold bg-[var(--block-2-bg)] px-2 py-0.5 border border-[var(--border)] truncate">
                  {paymentId}
                </span>
              </div>
              <div className="text-[11px] opacity-70 pt-1">
                Official payment confirmation & billing receipts are issued directly via email by Dodo Payments.
              </div>
            </div>
          )}

          {/* Primary Action Button: Link to Brief Form */}
          <div className="pt-2">
            <Link
              href="/#brief"
              className="inline-flex items-center justify-center gap-3 px-8 h-[54px] bg-[var(--accent)] hover:bg-[var(--block-4-bg)] text-[var(--accent-fg)] hover:text-[var(--block-4-fg)] font-display font-black text-sm uppercase tracking-wider rounded-full border-2 border-[var(--border)] shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Your Ad Brief Now →</span>
            </Link>
          </div>

          {/* Timeline Breakdown */}
          <div className="pt-8 border-t-2 border-[var(--border)]/15 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="p-6 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] rounded-2xl shadow-brutal">
              <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase mb-1">
                Step 1: Immediate
              </div>
              <h2 className="font-display font-black text-lg uppercase mb-2">
                Submit Your Brief
              </h2>
              <p className="text-xs font-medium opacity-75 leading-relaxed">
                Provide your store URL, key product, and current promotion or offer using our brief form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] rounded-2xl shadow-brutal">
              <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase mb-1">
                Step 2: 24 Hours
              </div>
              <h2 className="font-display font-black text-lg uppercase mb-2">
                Approve Script Concepts
              </h2>
              <p className="text-xs font-medium opacity-75 leading-relaxed">
                We synthesize 3 high-converting script concepts and hook angles for you to review and approve.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[var(--page-bg)] text-[var(--page-fg)] border-2 border-[var(--border)] rounded-2xl shadow-brutal">
              <div className="text-xs font-mono font-bold uppercase mb-1 opacity-70">
                Step 3: 48–72 Hours
              </div>
              <h2 className="font-display font-black text-lg uppercase mb-2">
                Full HD Ad Delivery
              </h2>
              <p className="text-xs font-medium opacity-75 leading-relaxed">
                Finished ads delivered in 9:16, 1:1, and 16:9 with 3 hooks and human creative director QA.
              </p>
            </div>
          </div>

          {/* Support and Questions Footer Box */}
          <div className="p-6 bg-[var(--block-4-bg)] text-[var(--block-4-fg)] border-2 border-[var(--border)] rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
                Need anything or have custom brand assets?
              </div>
              <div className="text-sm font-medium opacity-90">
                Direct studio line:{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-bold underline hover:text-[var(--accent)]"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[var(--block-2-bg)] hover:bg-[var(--border)]/10 text-[var(--block-2-fg)] font-display font-black text-xs uppercase tracking-wider border-2 border-[var(--border)] shadow-brutal transition-all shrink-0"
            >
              Return to Studio Home
            </Link>
          </div>
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}

export function ThanksContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-8 font-mono text-xs font-bold uppercase tracking-wider text-[var(--page-fg)]">
          Loading order details...
        </div>
      }
    >
      <ThanksInner />
    </Suspense>
  );
}
