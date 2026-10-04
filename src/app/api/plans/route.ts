import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { priceUsd: "asc" },
    });

    const parsedPlans = plans.map((p) => ({
      ...p,
      features: p.featuresJson ? JSON.parse(p.featuresJson) : [],
    }));

    return NextResponse.json({
      success: true,
      plans: parsedPlans,
    });
  } catch (error: any) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load plans" },
      { status: 500 }
    );
  }
}
