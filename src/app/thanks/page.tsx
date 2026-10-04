import React from "react";
import { ThanksContent } from "@/components/studio/ThanksContent";

export const metadata = {
  title: "Order Confirmed | Fernum AdPass",
  description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief to get started.",
  alternates: {
    canonical: "https://fernum.online/thanks",
  },
  openGraph: {
    title: "Order Confirmed | Fernum AdPass",
    description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief to get started.",
    url: "https://fernum.online/thanks",
    siteName: "Fernum AdPass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Confirmed | Fernum AdPass",
    description: "Thank you for subscribing to Fernum AdPass. Submit your creative brief to get started.",
  },
};

export default function ThanksPage() {
  return <ThanksContent />;
}
