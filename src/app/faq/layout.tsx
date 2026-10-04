import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Fernum",
  description: "Direct answers about monthly deliverables, revisions, timelines, licensing, and AI tools.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
