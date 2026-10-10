import Link from "next/link";
import { StudioNavbar } from "@/components/studio/StudioNavbar";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

const breadcrumbData = [
  { name: "Home", url: "https://fernum.online" },
  { name: "Privacy Policy", url: "https://fernum.online/privacy" },
];

export const metadata = {
  title: "Privacy Policy | Fernum AdPass",
  description:
    "Privacy policy and data handling for Fernum video ad subscriptions. Details on cookieless analytics, Supabase auth, and our privacy standards.",
  alternates: {
    canonical: "https://fernum.online/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Fernum AdPass",
    description:
      "Privacy policy and data handling for Fernum video ad subscriptions. Details on cookieless analytics, Supabase auth, and our privacy standards.",
    url: "https://fernum.online/privacy",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Fernum AdPass",
    description:
      "Privacy policy and data handling for Fernum video ad subscriptions. Details on cookieless analytics, Supabase auth, and our privacy standards.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbData);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans flex flex-col justify-between">
      <JsonLd schema={breadcrumbSchema} />
      <StudioNavbar />

      <main className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-[70ch] mx-auto bg-[var(--block-2-bg)] text-[var(--block-2-fg)] border-2 border-[var(--border)] p-8 sm:p-14 shadow-brutal-xl">
          {/* Header */}
          <div className="border-b-2 border-[var(--border)]/15 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--page-bg)] border-2 border-[var(--border)] text-[var(--page-fg)] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-brutal-sm">
              <span>● Privacy Policy</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase leading-[0.95] mb-4">
              PRIVACY POLICY
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
                Who is responsible.
              </h2>
              <p>
                {siteConfig.businessName}, {siteConfig.country}. Contact:{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="underline font-bold text-[var(--accent)] hover:underline">
                  {siteConfig.contactEmail}
                </a>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                What we collect.
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Details you give us in forms: name, email, brand name, website, product, offer.
                </li>
                <li>
                  Booking details when you book a call through Calendly.
                </li>
                <li>
                  Payment details: payments are handled by Dodo Payments. We do not see or store your full card number.
                </li>
                <li>
                  Basic site analytics: Plausible Analytics, which does not use cookies and does not collect personal data.
                </li>
                <li>
                  Account and portal data: your account email, login sessions, and project delivery status are stored securely with Supabase.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                What we use it for.
              </h2>
              <p>
                To make your ads, answer you, bill you, run calls, and improve the site.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Who we share it with.
              </h2>
              <p>
                Only service providers needed to run Fernum: Vercel (hosting) and Resend (email delivery for client briefs), Supabase (client authentication and project status database), Dodo Payments (payment processing), Calendly (call scheduling), Plausible Analytics (cookieless site metrics){siteConfig.aiTools.length > 0 ? `, and the following AI and video production tools: ${siteConfig.aiTools.join(", ")}` : ""}. We do not sell your data. When we use AI tools, we send only what is needed to make your ad, such as your product details and brand assets.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                How long we keep it.
              </h2>
              <p>
                Form and booking data: {siteConfig.dataRetention}. Payment records: as long as the law requires.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Your rights.
              </h2>
              <p>
                You can ask to see, correct or delete your data by emailing{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="underline font-bold text-[var(--accent)] hover:underline">
                  {siteConfig.contactEmail}
                </a>. Depending on where you live (for example the EU or UK), you may have additional rights under local law.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Cookies & Local Storage.
              </h2>
              <p>
                We do not use advertising or cross-site tracking cookies.
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>Essential Local Storage:</strong> We use your browser's local storage to preserve your selected interface vibe (<code>fernum_vibe</code>), custom cursor setting (<code>fernum_cursor_enabled</code>), audio sound effects preference (<code>fernum_sound_enabled</code>), and your cookie consent choice (<code>fernum_cookie_consent</code>). These preferences remain on your device and are never sold or sent to third parties.
                </li>
                <li>
                  <strong>Cookieless Analytics:</strong> We use Plausible Analytics to understand traffic trends in aggregate. Plausible is fully GDPR/CCPA compliant, sets zero cookies, and collects no personal data. Analytics scripts are loaded only after you accept our consent banner.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Children.
              </h2>
              <p>
                Our service is for businesses and is not for people under 18.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="font-display font-black text-xl uppercase tracking-wide">
                Changes.
              </h2>
              <p>
                We will update this page when something changes. The date at the top shows the latest version.
              </p>
            </section>
          </div>

          {/* Quick Cross-Links */}
          <div className="mt-12 pt-8 border-t-2 border-[var(--border)]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <Link href="/terms" className="text-[var(--accent)] hover:underline">
              Terms of Service →
            </Link>
            <Link href="/refund" className="opacity-70 hover:opacity-100">
              Refund Policy →
            </Link>
          </div>
        </article>
      </main>

      <StudioFooter />
    </div>
  );
}
