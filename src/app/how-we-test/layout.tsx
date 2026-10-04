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
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Test Video Ads | Fernum",
    description: "The 3-hook method, metrics decoded, interactive Hook Battle tool, and honest testing limits.",
  },
};

export default function HowWeTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
