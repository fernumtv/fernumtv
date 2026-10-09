import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Structure Ads | Fernum AdPass",
  description:
    "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines, production expectations, and commercial ad rights explained simply.",
  alternates: {
    canonical: "https://fernum.online/structure",
  },
  openGraph: {
    title: "How We Structure Ads | Fernum AdPass",
    description:
      "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines, production expectations, and commercial ad rights explained simply.",
    url: "https://fernum.online/structure",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Structure Ads | Fernum AdPass",
    description:
      "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines, production expectations, and commercial ad rights explained simply.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function StructureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
