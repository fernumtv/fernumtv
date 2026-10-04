import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Structure Ads | Fernum",
  description: "The 5-segment ad framework: Hook, Promise, Proof, Offer, CTA. Concept timelines and expectations.",
};

export default function StructureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
