import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Structure Ads | Fernum",
  description: "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines and expectations.",
  alternates: {
    canonical: "https://fernum.online/structure",
  },
  openGraph: {
    title: "How We Structure Ads | Fernum",
    description: "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines and expectations.",
    url: "https://fernum.online/structure",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Structure Ads | Fernum",
    description: "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines and expectations.",
  },
};

export default function StructureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
