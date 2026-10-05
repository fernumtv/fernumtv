import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fernum | Windows 10 & 11 Storage Command Center & Disk Cleanup",
  description:
    "Fernum turns confusing disk space into a clear visual map—so you can find huge files, forgotten folders, and storage clutter without guessing what is safe to remove.",
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
    title: "Fernum | Windows 10 & 11 Storage Command Center & Disk Cleanup",
    description:
      "Map your disk space, spot oversized space hogs, and reclaim gigabytes safely. Built for Windows 10 & 11.",
    url: "https://fernum.online",
    siteName: "Fernum Storage Command Center",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernum | Windows 10 & 11 Storage Command Center",
    description:
      "Map your disk space, spot oversized space hogs, and reclaim gigabytes safely. Built for Windows 10 & 11.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="theme-color" content="#0A0B0F" />
        {/* Enforce HTTPS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.location.protocol==="http:"&&!window.location.hostname.includes("localhost")&&!window.location.hostname.includes("127.0.0.1")){window.location.replace(window.location.href.replace(/^http:/,"https:"));}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0A0B0F] text-[#F5F7FA] antialiased selection:bg-[#B6FF33] selection:text-[#0A0B0F]">
        {children}
      </body>
    </html>
  );
}
