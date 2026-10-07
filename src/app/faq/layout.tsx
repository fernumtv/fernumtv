import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Fernum",
  description: "Direct answers about monthly deliverables, revisions, timelines, licensing, and AI tools.",
  alternates: {
    canonical: "https://fernum.online/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Fernum",
    description: "Direct answers about monthly deliverables, revisions, timelines, licensing, and AI tools.",
    url: "https://fernum.online/faq",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Fernum",
    description: "Direct answers about monthly deliverables, revisions, timelines, licensing, and AI tools.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
