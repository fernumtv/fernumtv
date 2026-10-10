import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Test Video Ads | Fernum AdPass",
  description:
    "The 3-hook method, direct-response metrics decoded, interactive Hook Battle tool, and our transparent testing boundaries for profitable D2C social ads.",
  alternates: {
    canonical: "https://fernum.online/how-we-test",
  },
  openGraph: {
    title: "How We Test Video Ads | Fernum AdPass",
    description:
      "The 3-hook method, direct-response metrics decoded, interactive Hook Battle tool, and our transparent testing boundaries for profitable D2C social ads.",
    url: "https://fernum.online/how-we-test",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Test Video Ads | Fernum AdPass",
    description:
      "The 3-hook method, direct-response metrics decoded, interactive Hook Battle tool, and our transparent testing boundaries for profitable D2C social ads.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function HowWeTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
