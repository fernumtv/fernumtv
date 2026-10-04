import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const FERNUM_PLANS = [
  {
    id: "plan_fernum_sprint",
    name: "Fernum Sprint",
    slug: "fernum-sprint",
    priceUsd: 499,
    perAdPrice: 499,
    adsPerMonth: 1,
    revisions: 2,
    turnaroundWeeks: 3,
    campaignPlanning: false,
    description: "Ideal for D2C brands validating new creative angles and hook styles.",
    featuresJson: JSON.stringify([
      "1 Finished High-Converting Video Ad per month",
      "$499 per ad effective price",
      "Delivered in ~3 weeks",
      "2 Revisions included",
      "Full HD 9:16 (TikTok/Reels/Shorts)",
      "Included 1:1 (Feed) & 16:9 (Landscape) versions",
      "3 Alternate Hooks included with every ad",
      "Script writing & AI production & human editor polish",
      "Animated dynamic subtitles / captions",
      "Campaign planning: Not included",
      "100% human review before delivery"
    ]),
  },
  {
    id: "plan_fernum_growth",
    name: "Fernum Growth",
    slug: "fernum-growth",
    priceUsd: 799,
    perAdPrice: 400,
    adsPerMonth: 2,
    revisions: 2,
    turnaroundWeeks: 2,
    campaignPlanning: false,
    description: "Consistent creative refresh to combat Meta & TikTok ad fatigue.",
    featuresJson: JSON.stringify([
      "2 Finished High-Converting Video Ads per month",
      "$400 per ad effective price (Save $198)",
      "Delivered in ~2 weeks",
      "2 Revisions included per ad",
      "Full HD 9:16 + 1:1 + 16:9 included",
      "3 Alternate Hooks per ad (6 total hook variants)",
      "Script writing, AI generation & human polish",
      "Animated dynamic subtitles / captions",
      "Brand kit & memory stored forever",
      "Campaign planning: Not included",
      "100% human review before delivery"
    ]),
  },
  {
    id: "plan_fernum_scale",
    name: "Fernum Scale",
    slug: "fernum-scale",
    priceUsd: 1099,
    perAdPrice: 333,
    adsPerMonth: 3,
    revisions: 2,
    turnaroundWeeks: 2,
    campaignPlanning: true,
    description: "Maximum output with strategic creative direction and angle planning.",
    featuresJson: JSON.stringify([
      "3 Finished High-Converting Video Ads per month",
      "$333 per ad effective price (Save $398)",
      "Delivered in ~2 weeks",
      "2 Revisions included per ad",
      "Campaign planning included (Angle research & hook roadmap)",
      "Full HD 9:16 + 1:1 + 16:9 included",
      "3 Alternate Hooks per ad (9 total hook variants)",
      "Script writing, AI generation & human polish",
      "Animated dynamic subtitles / captions",
      "Brand kit & memory stored forever",
      "Priority queue & 100% human review"
    ]),
  },
];

async function seedPlans() {
  console.log("Seeding Fernum Monthly Plans...");

  for (const plan of FERNUM_PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        priceUsd: plan.priceUsd,
        perAdPrice: plan.perAdPrice,
        adsPerMonth: plan.adsPerMonth,
        revisions: plan.revisions,
        turnaroundWeeks: plan.turnaroundWeeks,
        campaignPlanning: plan.campaignPlanning,
        description: plan.description,
        featuresJson: plan.featuresJson,
        active: true,
      },
      create: {
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
        priceUsd: plan.priceUsd,
        perAdPrice: plan.perAdPrice,
        adsPerMonth: plan.adsPerMonth,
        revisions: plan.revisions,
        turnaroundWeeks: plan.turnaroundWeeks,
        campaignPlanning: plan.campaignPlanning,
        description: plan.description,
        featuresJson: plan.featuresJson,
        active: true,
      },
    });
    console.log(`Plan: ${plan.name} ($${plan.priceUsd}/mo, $${plan.perAdPrice}/ad) synced.`);
  }

  // Create demo client & sample ad slot if none exists
  const existingClient = await prisma.client.findFirst({
    where: { email: "founder@lumaglow.co" }
  });

  if (!existingClient) {
    const client = await prisma.client.create({
      data: {
        email: "founder@lumaglow.co",
        name: "Elena Rostova",
        companyName: "LumaGlow Skincare",
        website: "https://lumaglow.co",
      }
    });

    const brandKit = await prisma.brandKit.create({
      data: {
        clientId: client.id,
        brandName: "LumaGlow",
        website: "https://lumaglow.co",
        primaryColors: JSON.stringify(["#F43F5E", "#FFE4E6", "#0F172A"]),
        fontStyle: "Modern Clean Sans",
        voiceTone: "Educational, glowing, relatable D2C problem-solution",
        competitorNotes: "Top competitors: Ordinary, Drunk Elephant",
      }
    });

    const adSlot = await prisma.adSlot.create({
      data: {
        clientId: client.id,
        brandKitId: brandKit.id,
        title: "LumaGlow Barrier Repair Serum - UGC Hook Test",
        status: "briefed",
        productName: "LumaGlow Barrier Repair Serum",
        targetAudience: "Women 22-38 struggling with compromised skin barrier, hormonal redness",
        problemSolved: "Heavy winter moisturizers clog pores; lightweight serums don't heal redness. This repairs the barrier in 7 days without greasy residue.",
        offerDetails: "Buy 1 Get 1 50% Off + Free Gua Sha tool using code GLOW50",
        tone: "Punchy, relatable UGC hook with clinical proof",
        referenceUrls: "https://tiktok.com/@skincare_trends/example-hook",
        channelFocus: "Meta & TikTok",
        formatRatio: "9:16",
        budgetCapUsd: 10.0,
      }
    });

    console.log(`Demo Client ${client.companyName} and Ad Slot ${adSlot.id} created.`);
  }

  console.log("Done seeding Fernum plans.");
}

seedPlans()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
