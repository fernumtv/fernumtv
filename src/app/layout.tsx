import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { TestModeBanner } from "@/components/studio/TestModeBanner";

// Self-host Google Fonts at build time with automatic preloading of critical weights
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

import { ClientOverlays } from "@/components/studio/ClientOverlays";

export const metadata: Metadata = {
  title: "Fernum AdPass | Monthly Video Ads for D2C and E-Commerce Brands",
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
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Fernum AdPass | Monthly Video Ads for D2C and E-Commerce Brands",
    description:
      "Monthly subscription delivering 1 to 3 short-form video ads for Meta and TikTok. 3 alternate hooks per ad, Full HD formats, and team review. From $499/mo.",
    url: "https://fernum.online",
    siteName: "Fernum AdPass",
    images: [
      {
        url: "https://fernum.online/images/og-image.jpg",
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
    title: "Fernum AdPass | Monthly Video Ads for D2C and E-Commerce Brands",
    description:
      "Monthly subscription delivering 1 to 3 short-form video ads for Meta and TikTok. 3 alternate hooks per ad, Full HD formats, and team review. From $499/mo.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
  robots: {
    index: siteConfig.indexingEnabled,
    follow: siteConfig.indexingEnabled,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-vibe="orange"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="theme-color" content="#F14A0A" id="fernum-theme-color" />
        {!siteConfig.indexingEnabled && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        {/* Force HTTPS and apply saved vibe before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.location.protocol==="http:"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1")){window.location.replace(window.location.href.replace(/^http:/,"https:"));return;}var s=localStorage.getItem("fernum_vibe");var v=(s==="green"||s==="purple")?s:"orange";document.documentElement.setAttribute("data-vibe",v);var tc={orange:"#F14A0A",green:"#16C846",purple:"#6C3BF5"};var m=document.getElementById("fernum-theme-color");if(m)m.setAttribute("content",tc[v]);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] antialiased font-sans">
        <TestModeBanner />
        <ClientOverlays />
        {children}
      </body>
    </html>
  );
}
