import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Fernum AdPass Video Ads",
  description:
    "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds with 3 alternate opening hooks per ad.",
  alternates: {
    canonical: "https://fernum.online/work",
  },
  openGraph: {
    title: "Our Work | Fernum AdPass Video Ads",
    description:
      "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds with 3 alternate opening hooks per ad.",
    url: "https://fernum.online/work",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Fernum AdPass Video Ads",
    description:
      "Direct-response video ads, synthetic macro B-roll, and 3D product motion formatted for Meta and TikTok feeds with 3 alternate opening hooks per ad.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
