import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Fernum AdPass",
  description: "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds.",
  alternates: {
    canonical: "https://fernum.online/work",
  },
  openGraph: {
    title: "Our Work | Fernum AdPass",
    description: "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds.",
    url: "https://fernum.online/work",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Fernum AdPass",
    description: "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds.",
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
