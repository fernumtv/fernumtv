import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPhase1Tests() {
  console.log("=========================================");
  console.log("🧪 Running Phase 1 Acceptance Test Suite");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  try {
    // 1. Verify 3 Monthly Plans in Database
    console.log("1. Verifying Database Plans & Pricing...");
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { priceUsd: "asc" },
    });

    assert(plans.length === 3, `Expected 3 active plans, found ${plans.length}`);

    const [sprint, growth, scale] = plans;

    // Plan 1: $499/mo, 1 ad, $499/ad, 2 revisions, 3 weeks, no campaign planning
    assert(sprint?.priceUsd === 499, `Sprint price is $499 (got $${sprint?.priceUsd})`);
    assert(sprint?.perAdPrice === 499, `Sprint per-ad price is $499 (got $${sprint?.perAdPrice})`);
    assert(sprint?.adsPerMonth === 1, `Sprint ads/month is 1 (got ${sprint?.adsPerMonth})`);
    assert(sprint?.revisions === 2, `Sprint revisions is 2 (got ${sprint?.revisions})`);
    assert(sprint?.turnaroundWeeks === 3, `Sprint turnaround is 3 weeks (got ${sprint?.turnaroundWeeks})`);
    assert(sprint?.campaignPlanning === false, "Sprint campaign planning is false");

    // Plan 2: $799/mo, 2 ads, $400/ad, 2 revisions, 2 weeks, no campaign planning
    assert(growth?.priceUsd === 799, `Growth price is $799 (got $${growth?.priceUsd})`);
    assert(growth?.perAdPrice === 400, `Growth per-ad price is $400 (got $${growth?.perAdPrice})`);
    assert(growth?.adsPerMonth === 2, `Growth ads/month is 2 (got ${growth?.adsPerMonth})`);
    assert(growth?.revisions === 2, `Growth revisions is 2 (got ${growth?.revisions})`);
    assert(growth?.turnaroundWeeks === 2, `Growth turnaround is 2 weeks (got ${growth?.turnaroundWeeks})`);
    assert(growth?.campaignPlanning === false, "Growth campaign planning is false");

    // Plan 3: $1,099/mo, 3 ads, $333/ad, 2 revisions, 2 weeks, campaign planning included
    assert(scale?.priceUsd === 1099, `Scale price is $1,099 (got $${scale?.priceUsd})`);
    assert(scale?.perAdPrice === 333, `Scale per-ad price is $333 (got $${scale?.perAdPrice})`);
    assert(scale?.adsPerMonth === 3, `Scale ads/month is 3 (got ${scale?.adsPerMonth})`);
    assert(scale?.revisions === 2, `Scale revisions is 2 (got ${scale?.revisions})`);
    assert(scale?.turnaroundWeeks === 2, `Scale turnaround is 2 weeks (got ${scale?.turnaroundWeeks})`);
    assert(scale?.campaignPlanning === true, "Scale campaign planning is true (included)");

    // 2. Test Strategy Call Booking
    console.log("\n2. Testing Call Booking Endpoint Logic...");
    const testBooking = await prisma.callBooking.create({
      data: {
        name: "Marcus Vance",
        email: "marcus@athleticd2c.com",
        brandName: "Athletic D2C Nutrition",
        website: "https://athleticd2c.com",
        monthlyAdSpend: "$20k - $50k/mo",
        notes: "Want to scale TikTok ads with 3 alternate hooks",
        status: "confirmed",
      },
    });

    assert(!!testBooking.id, `Created call booking with ID ${testBooking.id}`);
    assert(testBooking.status === "confirmed", "Booking status confirmed");

    // 3. Test Brief Submission & Order Checkout Flow
    console.log("\n3. Testing Brief Submission & Ad Slot Provisioning...");
    const testEmail = `d2cfounder_${Date.now()}@glowdrop.com`;
    const testBrand = "GlowDrop Electrolytes";

    // Simulate order creation
    const client = await prisma.client.create({
      data: {
        email: testEmail,
        name: "Chloe Bennett",
        companyName: testBrand,
        website: "https://glowdrop.com",
      },
    });

    const brandKit = await prisma.brandKit.create({
      data: {
        clientId: client.id,
        brandName: testBrand,
        website: "https://glowdrop.com",
        voiceTone: "High-Energy UGC Problem-Solution",
      },
    });

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        clientId: client.id,
        planId: growth.id,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextMonth,
        adSlotsUsed: 1,
        totalAdSlots: growth.adsPerMonth,
      },
    });

    const adSlot = await prisma.adSlot.create({
      data: {
        clientId: client.id,
        subscriptionId: subscription.id,
        brandKitId: brandKit.id,
        title: "GlowDrop Hydration Stick - Launch Ad #1",
        status: "briefed",
        productName: "GlowDrop Hydration Stick",
        targetAudience: "Active runners and gym-goers 20-35",
        problemSolved: "Sugar crashes from energy drinks and bland tap water dehydration",
        offerDetails: "Buy 2 Get 1 Free with code GLOWRUN",
        tone: "High-Energy UGC Problem-Solution",
        channelFocus: "Meta & TikTok",
        formatRatio: "9:16",
        budgetCapUsd: 10.0,
        currentSpendUsd: 0.0,
      },
    });

    assert(adSlot.status === "briefed", `AdSlot initialized in status 'briefed' (got ${adSlot.status})`);
    assert(adSlot.budgetCapUsd === 10.0, `AdSlot has per-ad budget cap of $10.00 (got $${adSlot.budgetCapUsd})`);
    assert(subscription.status === "active", "Subscription created as active");
    assert(subscription.totalAdSlots === 2, `Growth subscription provides 2 ad slots (got ${subscription.totalAdSlots})`);

    // Clean up test records
    await prisma.adSlot.delete({ where: { id: adSlot.id } });
    await prisma.subscription.delete({ where: { id: subscription.id } });
    await prisma.brandKit.delete({ where: { id: brandKit.id } });
    await prisma.client.delete({ where: { id: client.id } });
    await prisma.callBooking.delete({ where: { id: testBooking.id } });

    console.log("\n=========================================");
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log("=========================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase1Tests();
