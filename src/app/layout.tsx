import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fernum AdPass | Monthly Video Ads for D2C Brands",
  description:
    "Monthly subscription delivering 1 to 3 short-form video ads for Meta and TikTok. 3 alternate hooks per ad, Full HD formats, and team review. From $499/mo.",
  metadataBase: new URL("https://fernum.online"),
  alternates: {
    canonical: "https://fernum.online",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Fernum AdPass | Monthly Video Ads for D2C Brands",
    description:
      "Monthly subscription delivering 1 to 3 short-form video ads for Meta and TikTok. 3 alternate hooks per ad, Full HD formats, and team review. From $499/mo.",
    url: "https://fernum.online",
    siteName: "Fernum AdPass",
    images: [
      {
        url: "https://fernum.online/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Fernum AdPass Creative Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernum AdPass | Monthly Video Ads for D2C Brands",
    description:
      "Monthly subscription delivering 1 to 3 short-form video ads for Meta and TikTok. 3 alternate hooks per ad, Full HD formats, and team review. From $499/mo.",
    images: ["https://fernum.online/images/og-image.webp"],
  },
};

import Script from "next/script";
import { CustomCursor } from "@/components/studio/CustomCursor";
import { TestModeBanner } from "@/components/studio/TestModeBanner";
import { EasterEggOverlay } from "@/components/studio/EasterEggOverlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-vibe="orange" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="theme-color" content="#F14A0A" id="fernum-theme-color" />
        {/* Force HTTPS and apply saved vibe before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.location.protocol==="http:"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1")){window.location.replace(window.location.href.replace(/^http:/,"https:"));return;}var s=localStorage.getItem("fernum_vibe");var v=(s==="green"||s==="purple")?s:"orange";document.documentElement.setAttribute("data-vibe",v);var tc={orange:"#F14A0A",green:"#16C846",purple:"#6C3BF5"};var m=document.getElementById("fernum-theme-color");if(m)m.setAttribute("content",tc[v]);}catch(e){}})();`,
          }}
        />
        {/* Privacy-friendly cookieless analytics */}
        <Script
          defer
          data-domain="fernum.online"
          src="https://plausible.io/js/script.tagged-events.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] antialiased">
        <TestModeBanner />
        <CustomCursor />
        <EasterEggOverlay />
        {children}
      </body>
    </html>
  );
}
