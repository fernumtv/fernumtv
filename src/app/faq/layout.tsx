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
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Fernum",
    description: "Direct answers about monthly deliverables, revisions, timelines, licensing, and AI tools.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
