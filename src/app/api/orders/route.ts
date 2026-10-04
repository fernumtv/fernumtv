import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      planSlug,
      clientName,
      clientEmail,
      companyName,
      website,
      productName,
      targetAudience,
      problemSolved,
      offerDetails,
      tone,
      referenceUrls,
      channelFocus,
    } = body;

    // Validate required fields
    if (!clientEmail || !clientName || !companyName || !productName || !targetAudience || !problemSolved) {
      return NextResponse.json(
        { success: false, error: "Missing required brief fields. Please fill in brand and product details." },
        { status: 400 }
      );
    }

    // Find the requested plan
    const plan = await prisma.plan.findUnique({
      where: { slug: planSlug || "fernum-growth" },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Selected plan not found" },
        { status: 404 }
      );
    }

    // Upsert or retrieve client
    let client = await prisma.client.findUnique({
      where: { email: clientEmail.toLowerCase().trim() },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          email: clientEmail.toLowerCase().trim(),
          name: clientName.trim(),
          companyName: companyName.trim(),
          website: website?.trim() || null,
        },
      });
    } else {
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: clientName.trim(),
          companyName: companyName.trim(),
          website: website?.trim() || client.website,
        },
      });
    }

    // Create or update BrandKit
    let brandKit = await prisma.brandKit.findFirst({
      where: { clientId: client.id },
    });

    if (!brandKit) {
      brandKit = await prisma.brandKit.create({
        data: {
          clientId: client.id,
          brandName: companyName.trim(),
          website: website?.trim() || null,
          voiceTone: tone || "Punchy, relatable UGC hook with direct value prop",
          guidelines: `Product: ${productName}. Audience: ${targetAudience}`,
        },
      });
    }

    // Create active subscription
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        clientId: client.id,
        planId: plan.id,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextMonth,
        adSlotsUsed: 1,
        totalAdSlots: plan.adsPerMonth,
      },
    });

    // Create initial AdSlot in status 'briefed'
    const adSlot = await prisma.adSlot.create({
      data: {
        clientId: client.id,
        subscriptionId: subscription.id,
        brandKitId: brandKit.id,
        title: `${productName} - Launch Ad #1`,
        status: "briefed",
        productName: productName.trim(),
        targetAudience: targetAudience.trim(),
        problemSolved: problemSolved.trim(),
        offerDetails: offerDetails?.trim() || null,
        tone: tone?.trim() || "High-Energy UGC Problem-Solution",
        referenceUrls: referenceUrls?.trim() || null,
        channelFocus: channelFocus || "Meta & TikTok",
        formatRatio: "9:16",
        budgetCapUsd: 10.0, // $10 hard per-ad budget cap
        currentSpendUsd: 0.0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order and brief successfully received! Production pipeline initialized.",
      order: {
        adSlotId: adSlot.id,
        subscriptionId: subscription.id,
        plan: {
          name: plan.name,
          priceUsd: plan.priceUsd,
          turnaroundWeeks: plan.turnaroundWeeks,
          revisions: plan.revisions,
          campaignPlanning: plan.campaignPlanning,
        },
        client: {
          name: client.name,
          email: client.email,
          companyName: client.companyName,
        },
        adSlot: {
          id: adSlot.id,
          title: adSlot.title,
          status: adSlot.status,
          targetAudience: adSlot.targetAudience,
          createdAt: adSlot.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error("Order brief intake failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order brief" },
      { status: 500 }
    );
  }
}
