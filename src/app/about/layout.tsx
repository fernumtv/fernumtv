import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Fernum | Direct-Response Video Ads",
  description: "Who makes the ads, why we built Fernum, our team review standards, and our transparent policy on generative AI tools for high-growth D2C brands.",
  alternates: {
    canonical: "https://fernum.online/about",
  },
  openGraph: {
    title: "About Fernum | Direct-Response Video Ads",
    description: "Who makes the ads, why we built Fernum, our team review standards, and our transparent policy on generative AI tools for high-growth D2C brands.",
    url: "https://fernum.online/about",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Fernum | Direct-Response Video Ads",
    description: "Who makes the ads, why we built Fernum, our team review standards, and our transparent policy on generative AI tools for high-growth D2C brands.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
