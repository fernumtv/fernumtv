import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

export const DEMO_CREDENTIALS = [
  {
    name: "Alice Vance",
    email: "alice@fernum.studio",
    password: "FernumAlice2026!",
    role: "OWNER",
    workspaceId: null, // Org-wide agency access
    workspaceName: "Fernum Media Studio (All Brands)",
    avatarUrl: "/avatars/alice.svg",
  },
  {
    name: "Bob Chen",
    email: "bob@aurahealth.com",
    password: "FernumBob2026!",
    role: "CREATIVE_DIRECTOR",
    workspaceId: "ws_aura_health",
    workspaceName: "AuraHealth",
    avatarUrl: "/avatars/bob.svg",
  },
  {
    name: "Charlie Ross",
    email: "charlie@aurahealth.com",
    password: "FernumCharlie2026!",
    role: "CLIENT_APPROVER",
    workspaceId: "ws_aura_health",
    workspaceName: "AuraHealth",
    avatarUrl: "/avatars/charlie.svg",
  },
  {
    name: "Dana Kapoor",
    email: "dana@vervepay.com",
    password: "FernumDana2026!",
    role: "EDITOR",
    workspaceId: "ws_verve_pay",
    workspaceName: "VervePay",
    avatarUrl: "/avatars/dana.svg",
  },
  {
    name: "Evan Wright",
    email: "evan@aurahealth.com",
    password: "FernumEvan2026!",
    role: "VIEWER",
    workspaceId: "ws_aura_health",
    workspaceName: "AuraHealth",
    avatarUrl: "/avatars/evan.svg",
  },
];

async function main() {
  console.log("🌱 Starting Fernum Database Seed with Real Hashed Auth & Scoped Memberships...");

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Demo Agency Organization
  const agency = await prisma.organization.create({
    data: {
      id: "org_fernum_studio",
      name: "Fernum Media Studio",
      slug: "fernum-media",
      planTier: "ENTERPRISE",
    },
  });
  console.log(` Created Agency: ${agency.name}`);

  // 3. Demo Brands (Workspaces)
  const auraHealth = await prisma.workspace.create({
    data: {
      id: "ws_aura_health",
      organizationId: agency.id,
      name: "AuraHealth",
      slug: "aura-health",
      monthlyBudget: 1500.0,
      currentSpend: 142.5,
    },
  });

  const vervePay = await prisma.workspace.create({
    data: {
      id: "ws_verve_pay",
      organizationId: agency.id,
      name: "VervePay",
      slug: "verve-pay",
      monthlyBudget: 2500.0,
      currentSpend: 289.0,
    },
  });
  console.log(` Created Brand 1: ${auraHealth.name}`);
  console.log(` Created Brand 2: ${vervePay.name}`);

  // 4. Seed Users with Cryptographic Password Hashes and Scoped Memberships
  for (const cred of DEMO_CREDENTIALS) {
    const passwordHash = hashPassword(cred.password);
    const user = await prisma.user.create({
      data: {
        email: cred.email,
        name: cred.name,
        passwordHash,
        avatarUrl: cred.avatarUrl,
      },
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: agency.id,
        workspaceId: cred.workspaceId,
        role: cred.role,
      },
    });

    console.log(
      `   👤 ${cred.name} (${cred.email}) -> Role: ${cred.role} [${
        cred.workspaceId ? "Scoped: " + cred.workspaceName : "Global Org Access"
      }]`
    );
  }

  // 5. Brand Brain Knowledge Hubs
  await prisma.brandBrain.create({
    data: {
      organizationId: agency.id,
      workspaceId: auraHealth.id,
      brandName: "AuraHealth",
      tagline: "Cellular Longevity & Science-Backed Nutrition",
      toneOfVoice: "Authoritative, empathetic, grounded in peer-reviewed biology, zero pseudoscience",
      positioning: "Premium longevity supplements engineered with cold-water extraction for modern biohackers and high-output professionals.",
      targetAudiences: "Entrepreneurs, tech executives, and fitness professionals aged 25-45 seeking peak cognitive focus and deep cellular recovery.",
      primaryColors: "#10B981, #064E3B, #0F172A",
      fontStyles: "Inter Display, JetBrains Mono",
      approvedMessaging: "30-day marine collagen trial protocol; Third-party heavy metal tested; Cold-extracted Nordic adaptogens",
      productsAndBenefits: "Marine Collagen Peptides (skin elasticity, joint recovery); Nordic Rhodiola Extract (cortisol modulation); Liposomal Magnesium (deep stage-4 slow-wave sleep).",
      competitorNotes: "AG1 (too generic), Thorne (clinical but boring branding), Ritual (good branding but under-dosed).",
      prohibitedClaims: "Never claim to cure, treat, or prevent chronic disease. Never guarantee specific weight loss numbers. Never bash traditional medicine.",
      prohibitedTopics: "Unverified fad diets, crash cleanses, political biohacking debates",
      legalRestrictions: "Mandatory FDA dietary supplement disclaimer on all video descriptions (#Ad #SupplementDisclosure).",
      approvedTerminology: "Cellular autophagy, circadian alignment, restorative sleep architecture",
      ctaRules: "Soft educational CTA: 'Link in bio for our 30-day clinical absorption study.'",
      campaignObjectives: "Establish Kora Vance as the leading trusted virtual authority on longevity and drive trial kit subscriptions.",
    },
  });

  await prisma.brandBrain.create({
    data: {
      organizationId: agency.id,
      workspaceId: vervePay.id,
      brandName: "VervePay",
      tagline: "Borderless Banking for the Global Generation",
      toneOfVoice: "Punchy, irreverent, direct, witty, transparent, anti-bureaucracy",
      positioning: "The first zero-FX fee neo-banking app designed for remote creators, digital nomads, and global freelancers.",
      targetAudiences: "Digital nomads, remote engineers, freelance creators, and international travelers aged 20-35.",
      primaryColors: "#6366F1, #4338CA, #0F172A",
      fontStyles: "Outfit, Inter",
      approvedMessaging: "Zero foreign transaction spread; Instant multi-currency IBANs; Disposable virtual cards for free trial protection.",
      productsAndBenefits: "Multi-Currency Wallet (hold 40+ currencies); Disposable Virtual Cards (prevent trial auto-renews); Split-Pay NFC (instant group bill settling).",
      competitorNotes: "Wise (good but complex fees), Revolut (too cluttered with crypto features), Traditional Banks (extortionate wire fees).",
      prohibitedClaims: "Never claim FDIC insurance directly without specifying partner bank ('Banking services provided by Evolve Bank & Trust, Member FDIC').",
      prohibitedTopics: "Speculative crypto trading, high-risk leverage, tax evasion schemes",
      legalRestrictions: "Clear disclosure that Verve is a financial technology company, not a chartered bank.",
      approvedTerminology: "Real interbank exchange rate, zero hidden markup, instant virtual issuance",
      ctaRules: "Punchy call to action: 'Get your virtual card in 60 seconds with no credit check.'",
      campaignObjectives: "Position Devon Miles as the premier globetrotting nomad creator demonstrating real-world payment speed across Tokyo, London, and Lisbon.",
    },
  });

  // 6. Virtual Creators
  const kora = await prisma.creator.create({
    data: {
      id: "creator_kora_vance",
      organizationId: agency.id,
      workspaceId: auraHealth.id,
      name: "Kora Vance",
      type: "TALKING_HEAD",
      niche: "Longevity, Biohacking & Cellular Nutrition",
      status: "LOCKED",
      personality: "Analytical, calm, curious, and intensely grounded in biochemistry. Speaks with steady cadence and deliberate pauses.",
      tone: "Educational, approachable scientist, trusted confidante",
      vocabulary: "Autophagy, biomarker, circadian protocol, bioavailability, cellular resilience",
      interests: "Molecular biology, cold exposure, sleep architecture, peptide research",
      values: "Radical scientific honesty, transparency, preventative health",
      behaviorRules: "Always cites scientific mechanisms before recommending any routine. Never promotes quick fixes.",
      contentPillars: "Morning protocols, deep sleep optimization, cellular nutrient absorption, biohacking debunked",
      preferredTopics: "Adaptogens, cold plunges, slow-wave sleep, marine collagen",
      prohibitedTopics: "Extreme starvation diets, synthetic stimulants",
      voiceProvider: "mock",
      voiceModelId: "kora-calm-female",
      voiceSpeed: 1.05,
      voicePitch: 1.0,
      avatarUrl: "/synthetic-assets/creators/kora-vance-ref.svg",
      faceRefUrls: JSON.stringify(["/synthetic-assets/creators/kora-vance-ref.svg"]),
      identityToken: "creator_kora_vance_face_lock_v1",
      isSynthetic: true,
    },
  });

  const devon = await prisma.creator.create({
    data: {
      id: "creator_devon_miles",
      organizationId: agency.id,
      workspaceId: vervePay.id,
      name: "Devon Miles",
      type: "ON_LOCATION",
      niche: "Urban Lifestyle, Borderless Travel & Neobanking",
      status: "LOCKED",
      personality: "Spontaneous, observant, witty, streetwear-enthusiast, tech-savvy nomad.",
      tone: "Candid friend sharing life hacks on the street, energetic, humorous",
      vocabulary: "FX spread, marble floor banks, frictionless, nomad stack, hidden fees",
      interests: "Street photography, coffee culture, fintech infrastructure, micro-apartments in Tokyo",
      values: "Freedom of movement, financial transparency, minimalism",
      behaviorRules: "Always films on location with ambient city audio. Interacts naturally with local environments.",
      contentPillars: "Nomad cost-of-living breakdowns, foreign fee exposes, travel card speed tests",
      preferredTopics: "Tokyo currency hacks, subscription trial shields, split bills abroad",
      prohibitedTopics: "Get-rich-quick crypto schemes, predatory lending",
      voiceProvider: "mock",
      voiceModelId: "devon-energetic-male",
      voiceSpeed: 1.1,
      voicePitch: 0.98,
      avatarUrl: "/synthetic-assets/creators/devon-miles-ref.svg",
      faceRefUrls: JSON.stringify(["/synthetic-assets/creators/devon-miles-ref.svg"]),
      identityToken: "creator_devon_miles_face_lock_v1",
      isSynthetic: true,
    },
  });

  // 7. Creator Memory Facts
  await prisma.creatorMemory.createMany({
    data: [
      {
        organizationId: agency.id,
        workspaceId: auraHealth.id,
        creatorId: kora.id,
        category: "past_event",
        fact: "Reviewed personal continuous glucose monitor (CGM) telemetry during a 72-hour fasting protocol in Episode 3.",
      },
      {
        organizationId: agency.id,
        workspaceId: auraHealth.id,
        creatorId: kora.id,
        category: "product_experience",
        fact: "Takes unflavored Marine Collagen peptides in lukewarm organic matcha tea every morning at 7:30 AM.",
      },
      {
        organizationId: agency.id,
        workspaceId: auraHealth.id,
        creatorId: kora.id,
        category: "lore",
        fact: "Spent 5 years as a computational biochemist research fellow before launching her longevity media studio.",
      },
      {
        organizationId: agency.id,
        workspaceId: vervePay.id,
        creatorId: devon.id,
        category: "past_event",
        fact: "Successfully paid for ramen at 2 AM in Shinjuku, Tokyo using VervePay virtual NFC while physical wallet was in hotel.",
      },
      {
        organizationId: agency.id,
        workspaceId: vervePay.id,
        creatorId: devon.id,
        category: "inside_joke",
        fact: "Has an ongoing running joke about legacy bank branches having giant marble columns paid for by customer overdraft fees.",
      },
      {
        organizationId: agency.id,
        workspaceId: vervePay.id,
        creatorId: devon.id,
        category: "lore",
        fact: "Has lived out of a single 35L backpack across 18 countries over the last 3 years.",
      },
    ],
  });

  // 6. Ops Board Content Items for AuraHealth
  const auraItems = [
    {
      topic: "Morning Cold Plunge Routine & Dopamine Baseline",
      hookText: "Stop drinking coffee at 7 AM. Here is what 3 minutes in 48-degree water actually does to your brain.",
      status: "IDEA",
      stageOrder: 1,
      creatorId: kora.id,
      estimatedCost: 0.12,
      platform: "INSTAGRAM",
    },
    {
      topic: "Top 3 Adaptogens for High-Performance Workdays",
      hookText: "Ashwagandha isn't the only stress reducer. Meet the Nordic root Silicon Valley CEOs take.",
      status: "SCRIPTED",
      stageOrder: 1,
      creatorId: kora.id,
      estimatedCost: 0.45,
      platform: "YOUTUBE",
    },
    {
      topic: "The Cellular Autophagy Blueprint",
      hookText: "Your cells are eating themselves right now—and that's the best thing that can happen.",
      status: "GENERATING",
      stageOrder: 1,
      creatorId: kora.id,
      estimatedCost: 1.85,
      platform: "INSTAGRAM",
    },
    {
      topic: "Clean Marine Collagen Honest 30-Day Protocol",
      hookText: "Most collagen peptides never make it past your stomach acid. Look at this absorption test.",
      status: "AWAITING_APPROVAL",
      stageOrder: 1,
      creatorId: kora.id,
      estimatedCost: 3.4,
      platform: "INSTAGRAM",
    },
    {
      topic: "Evening Wind-Down & Deep Sleep Architecture",
      hookText: "How to hit 2 hours of restorative deep sleep without prescription pills.",
      status: "SCHEDULED",
      stageOrder: 1,
      creatorId: kora.id,
      estimatedCost: 2.9,
      targetPostDate: new Date(Date.now() + 86400000 * 2),
      platform: "YOUTUBE",
    },
  ];

  for (const item of auraItems) {
    const created = await prisma.contentItem.create({
      data: {
        ...item,
        organizationId: agency.id,
        workspaceId: auraHealth.id,
      },
    });

    if (item.status === "AWAITING_APPROVAL") {
      await prisma.asset.create({
        data: {
          organizationId: agency.id,
          contentItemId: created.id,
          assetType: "VIDEO",
          url: "/mock-assets/kora-collagen-test.mp4",
          provider: "mock-heygen",
          model: "talking-head-v2",
          costEstimate: 3.4,
        },
      });
    }
  }

  // 7. Ops Board Content Items for VervePay
  const verveItems = [
    {
      topic: "Why Traditional Banks Charge You for Your Own Money",
      hookText: "If your bank is charging you an account maintenance fee in 2026, you're literally paying for their marble floors.",
      status: "IDEA",
      stageOrder: 1,
      creatorId: devon.id,
      estimatedCost: 0.15,
      platform: "INSTAGRAM",
    },
    {
      topic: "Split the Bill in Tokyo in 3 Seconds with Verve NFC",
      hookText: "No currency conversion math at 2 AM in Shinjuku.",
      status: "QC_PENDING",
      stageOrder: 1,
      creatorId: devon.id,
      estimatedCost: 2.1,
      platform: "INSTAGRAM",
    },
    {
      topic: "How Disposable Virtual Cards Saved Me $400 on Free Trials",
      hookText: "Auto-renew subscriptions hate this single toggle.",
      status: "APPROVED",
      stageOrder: 1,
      creatorId: devon.id,
      estimatedCost: 2.75,
      platform: "YOUTUBE",
    },
    {
      topic: "Zero FX Fee Cards: The Digital Nomad Survival Guide",
      hookText: "Airport exchange booths take up to 18% in hidden spread fees. Never exchange cash again.",
      status: "PUBLISHED",
      stageOrder: 1,
      creatorId: devon.id,
      estimatedCost: 3.2,
      platform: "INSTAGRAM",
    },
  ];

  for (const item of verveItems) {
    await prisma.contentItem.create({
      data: {
        ...item,
        organizationId: agency.id,
        workspaceId: vervePay.id,
      },
    });
  }

  console.log(" Seed completed successfully with hashed passwords and membership isolation!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
