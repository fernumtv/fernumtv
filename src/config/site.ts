/**
 * Fernum Site & Payments Configuration
 * Central config for all external payment links, Cal.com booking URL, and studio contact points.
 */

export interface FernumPlanConfig {
  name: string;
  slug: string;
  price: number;
  period: string;
  totalAds: string;
  pricePerVideo: string;
  revisionsTimeline: string;
  campaignPlanning: string;
  campaignPlanningIncluded: boolean;
  whatsIncluded: string;
  highlight?: boolean;
  badge?: string;
  checkoutUrl: string;
  checkoutEnabled?: boolean;
}

export const dodo = {
  testMode: process.env.NEXT_PUBLIC_DODO_TEST_MODE === "true" ? true : false,
  productIds: {
    launch: "pdt_PASTE",
    growth: "pdt_PASTE",
    scale:  "pdt_PASTE"
  },
  checkoutBaseLive: "https://checkout.dodopayments.com/buy/",
  checkoutBaseTest: "https://test.checkout.dodopayments.com/buy/",
  redirectUrl: "https://fernum.online/thanks"
};

/**
 * Checks whether live checkout is enabled for a given plan.
 * Returns false if product ID contains 'PASTE' or is empty.
 */
export function isCheckoutEnabled(plan: string | { slug?: string; name?: string }): boolean {
  const rawKey = typeof plan === "string" ? plan : (plan?.slug || plan?.name || "");
  const planKey = rawKey.toLowerCase().trim() as keyof typeof dodo.productIds;
  const productId = dodo.productIds[planKey];

  if (!productId || productId.trim() === "" || productId.toUpperCase().includes("PASTE")) {
    return false;
  }
  return true;
}

/**
 * Returns the full Dodo checkout URL for a given plan slug (launch, growth, scale).
 */
export function getCheckoutUrl(plan: string | { slug?: string; name?: string }): string {
  const rawKey = typeof plan === "string" ? plan : (plan?.slug || plan?.name || "");
  const planKey = rawKey.toLowerCase().trim() as keyof typeof dodo.productIds;
  const productId = dodo.productIds[planKey];

  if (!productId || productId.trim() === "") {
    return "";
  }

  const base = dodo.testMode ? dodo.checkoutBaseTest : dodo.checkoutBaseLive;
  return `${base}${productId}?redirect_url=${encodeURIComponent(dodo.redirectUrl)}`;
}

export const siteConfig = {
  name: "Fernum AdPass",
  domain: "fernum.online",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://fernum.online",
  contactEmail: "fernumtv@gmail.com",
  businessName: "Fernum",
  country: "India",
  governingLaw: "the laws of India (Haryana)",
  dataRetention: "12 months after last contact",
  briefTurnaround: "2 business days",
  founderName: "",
  comparisonClaims: false,
  aiTools: [] as string[],

  // Admin email allowlist for the client portal
  adminEmails: ["fernumtv@gmail.com"],

  // Dodo Customer Portal link for managing subscriptions and payment methods
  customerPortalUrl:
    process.env.NEXT_PUBLIC_DODO_CUSTOMER_PORTAL_URL ||
    (dodo.testMode
      ? "https://test.checkout.dodopayments.com/customer-portal"
      : "https://checkout.dodopayments.com/customer-portal"),

  // Call duration in minutes
  callMinutes: 30,

  // Last updated date for legal documents (/terms, /refund, /privacy)
  lastUpdated: "October 4, 2026",

  // Booking link: Calendly link (opens in modal or new tab) - GDPR banner enabled
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    "https://calendly.com/hardikapp12/30min?hide_event_type_details=1",

  // Search indexing toggle (true for production, can be disabled via NEXT_PUBLIC_INDEXING_ENABLED=false)
  indexingEnabled: process.env.NEXT_PUBLIC_INDEXING_ENABLED === "false" ? false : true,

  // Return URL after payment
  returnUrl: "/thanks",

  // Dodo Payments configuration
  dodo,

  // Pricing plans with dynamic checkout URLs via getCheckoutUrl
  plans: {
    launch: {
      name: "Launch",
      slug: "launch",
      price: 499,
      period: "/month",
      totalAds: "1 ad per month",
      pricePerVideo: "$500 per video",
      revisionsTimeline: "2 Revisions • About 3 Weeks",
      campaignPlanning: "Excluded",
      campaignPlanningIncluded: false,
      whatsIncluded: "Writing, AI Production, Editing, Full HD",
      highlight: false,
      checkoutUrl: getCheckoutUrl("launch"),
      checkoutEnabled: isCheckoutEnabled("launch"),
    },
    growth: {
      name: "Growth",
      slug: "growth",
      price: 799,
      period: "/month",
      totalAds: "2 ads per month",
      pricePerVideo: "$400 per video",
      revisionsTimeline: "2 Revisions • About 2 Weeks",
      campaignPlanning: "Excluded",
      campaignPlanningIncluded: false,
      whatsIncluded: "Writing, AI Production, Editing, Full HD",
      highlight: true,
      badge: "Most Popular",
      checkoutUrl: getCheckoutUrl("growth"),
      checkoutEnabled: isCheckoutEnabled("growth"),
    },
    scale: {
      name: "Scale",
      slug: "scale",
      price: 1099,
      period: "/month",
      totalAds: "3 ads per month",
      pricePerVideo: "$333 per video",
      revisionsTimeline: "2 Revisions • About 2 Weeks",
      campaignPlanning: "Included",
      campaignPlanningIncluded: true,
      whatsIncluded: "Campaign Planning, Writing, AI Production, Editing, Full HD",
      highlight: false,
      badge: "Best Value",
      checkoutUrl: getCheckoutUrl("scale"),
      checkoutEnabled: isCheckoutEnabled("scale"),
    },
  } as Record<string, FernumPlanConfig>,
};

