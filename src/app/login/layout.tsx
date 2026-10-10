import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Login | Fernum AdPass",
  description:
    "Secure magic link access to your Fernum creative portal, active reels, revision requests, and monthly brand asset library.",
  alternates: {
    canonical: "https://fernum.online/login",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Client Login | Fernum AdPass",
    description:
      "Secure magic link access to your Fernum creative portal, active reels, revision requests, and monthly brand asset library.",
    url: "https://fernum.online/login",
    images: [{ url: "https://fernum.online/images/og-image.jpg", width: 1200, height: 630, alt: "Fernum AdPass Creative Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Login | Fernum AdPass",
    description:
      "Secure magic link access to your Fernum creative portal, active reels, revision requests, and monthly brand asset library.",
    images: ["https://fernum.online/images/og-image.jpg"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
