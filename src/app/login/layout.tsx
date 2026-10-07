import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Login | Fernum AdPass",
  description: "Secure magic link access to your Fernum creative portal, active reels, and revisions.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Client Login | Fernum AdPass",
    description: "Secure magic link access to your Fernum creative portal, active reels, and revisions.",
    url: "https://fernum.online/login",
    images: [{ url: "https://fernum.online/images/og-image.webp" }],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
