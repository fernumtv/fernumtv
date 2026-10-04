import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Fernum | Direct-Response Video Ads",
  description: "Who makes the ads, why we built Fernum, and our transparent AI disclosure policy.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
