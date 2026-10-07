import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Test Video Ads | Fernum",
  description: "The 3-hook method, metrics decoded, interactive Hook Battle tool, and honest testing limits.",
  alternates: {
    canonical: "https://fernum.online/how-we-test",
  },
  openGraph: {
    title: "How We Test Video Ads | Fernum",
    description: "The 3-hook method, metrics decoded, interactive Hook Battle tool, and honest testing limits.",
    url: "https://fernum.online/how-we-test",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Test Video Ads | Fernum",
    description: "The 3-hook method, metrics decoded, interactive Hook Battle tool, and honest testing limits.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function HowWeTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
