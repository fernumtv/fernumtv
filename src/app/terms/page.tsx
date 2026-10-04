import React from "react";
import Link from "next/link";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service | Fernum AdPass",
  description: "Terms and conditions for Fernum video ad monthly subscription services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <StudioNavbar />

      <main className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-[70ch] mx-auto bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl">
          {/* Header */}
          <div className="border-b-2 border-[var(--border)]/15 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal-sm">
              <span>● Legal Policy</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase leading-[0.95] mb-4">
              TERMS OF SERVICE
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">
              Last updated: {siteConfig.lastUpdated}
            </p>
          </div>

          {/* Body Content: 17px body font, generous spacing, max ~70ch line length */}
          <div className="space-y-10 text-[17px] leading-relaxed opacity-90 font-normal">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                1. Who we are.
              </h2>
              <p>
                Fernum (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides monthly subscription video ad production for brands. The service is run by [YOUR FULL NAME OR BUSINESS NAME], [COUNTRY]. Contact: [<a href="mailto:fernumtv@gmail.com" className="underline font-bold text-[var(--accent)] hover:underline">fernumtv@gmail.com</a>].
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                2. What you get.
              </h2>
              <p>Each plan includes a fixed number of finished ads per month:</p>
              <ul className="list-disc pl-6 space-y-1 font-medium">
                <li><strong>Launch:</strong> 1 ad per month</li>
                <li><strong>Growth:</strong> 2 ads per month</li>
                <li><strong>Scale:</strong> 3 ads per month, with campaign planning included</li>
              </ul>
              <p>
                Every ad includes script writing, AI-assisted production, editing, Full HD export, and two revisions. Delivery targets are about 3 weeks (Launch) and about 2 weeks (Growth and Scale) after your script is approved. These are targets, not guarantees. (CONFIRM these timelines are ones you can meet.)
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                3. How it works.
              </h2>
              <p>
                You send a brief. We write a script and you approve it before we produce the video. Production starts after approval. Delays in your brief, approvals or assets move the delivery date by the same amount.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                4. Revisions.
              </h2>
              <p>
                A revision is a change to an ad within its approved script, such as edits to captions, pacing, music, or specific shots. A new concept or a new script counts as a new ad. Unused revisions do not carry over to another ad or month.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                5. Your responsibilities.
              </h2>
              <p>
                You must own or have the right to use everything you send us (logos, product images, music, claims). You are responsible for the claims made in your ads and for following the rules of the advertising platforms where you run them.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                6. AI-generated content.
              </h2>
              <p>
                Our ads may use AI-generated visuals and voices. Some platforms require you to label AI content. Check the current rules of each platform before publishing. We do not use a real person&apos;s face or voice without permission.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                7. No guaranteed results.
              </h2>
              <p>
                We do not promise sales, views, or any particular ad performance. Results depend on your product, offer, targeting and budget.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                8. Ownership.
              </h2>
              <p>
                After payment for the month, you may use the delivered videos for your own marketing. We keep the right to show them in our portfolio unless you ask us in writing not to. (CONFIRM.) Third-party tools we use may have their own licence terms.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                9. Billing and cancellation.
              </h2>
              <p>
                Plans renew monthly until cancelled. Payments are processed by Dodo Payments. You can cancel at any time through the customer portal link in your receipt email, or by emailing us. Cancellation takes effect at the end of the current billing period and you keep access to that period&apos;s ads. We do not charge again after cancellation. (CONFIRM what happens to ads not yet delivered.)
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                10. Our right to decline or stop.
              </h2>
              <p>
                We can decline or stop work on ads that are illegal, misleading, hateful or unsafe, or that infringe someone else&apos;s rights. In that case we will refund the unused part of the current month.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                11. Liability.
              </h2>
              <p>
                To the extent the law allows, our total liability is limited to the amount you paid us in the month the issue happened. We are not liable for lost sales, lost profit, or indirect damage.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                12. Changes.
              </h2>
              <p>
                We may update these terms. The date at the top shows the latest version. Continuing to use the service means you accept the update.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                13. Governing law.
              </h2>
              <p>
                These terms are governed by the laws of [india / haryana]. (CONFIRM with a lawyer.)
              </p>
            </section>
          </div>

          {/* Quick Cross-Links */}
          <div className="mt-12 pt-8 border-t-2 border-[var(--border)]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <Link href="/refund" className="text-[var(--accent)] hover:underline">
              See Refund Policy →
            </Link>
            <Link href="/privacy" className="opacity-70 hover:opacity-100">
              Privacy Policy →
            </Link>
          </div>
        </article>
      </main>

      <StudioFooter />
    </div>
  );
}
