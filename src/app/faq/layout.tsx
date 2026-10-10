import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Fernum",
  description:
    "Direct answers about monthly deliverables, revisions, timelines, licensing, and generative tools. Everything you need to know about our subscription.",
  alternates: {
    canonical: "https://fernum.online/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Fernum",
    description:
      "Direct answers about monthly deliverables, revisions, timelines, licensing, and generative tools. Everything you need to know about our subscription.",
    url: "https://fernum.online/faq",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Fernum",
    description:
      "Direct answers about monthly deliverables, revisions, timelines, licensing, and generative tools. Everything you need to know about our subscription.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
