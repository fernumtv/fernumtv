import React from "react";
import { ThanksContent } from "@/components/studio/ThanksContent";

export const metadata = {
  title: "Order Confirmed | Fernum AdPass",
  description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief and brand assets to begin script writing and video production.",
  alternates: {
    canonical: "https://fernum.online/thanks",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Order Confirmed | Fernum AdPass",
    description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief and brand assets to begin script writing and video production.",
    url: "https://fernum.online/thanks",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://fernum.online/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Confirmed | Fernum AdPass",
    description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief and brand assets to begin script writing and video production.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

export default function ThanksPage() {
  return <ThanksContent />;
}
