import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal | Fernum AdPass",
  description: "Secure client portal for managing monthly video ad deliverables, revisions, and brand kit.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Client Portal | Fernum AdPass",
    description: "Secure client portal for managing monthly video ad deliverables, revisions, and brand kit.",
    url: "https://fernum.online/portal",
    images: [{ url: "https://fernum.online/images/og-image.webp" }],
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
