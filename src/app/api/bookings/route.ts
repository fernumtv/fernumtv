import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, brandName, website, monthlyAdSpend, notes, scheduledTime } = body;

    if (!name || !email || !brandName) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, email, and brand name." },
        { status: 400 }
      );
    }

    const booking = await prisma.callBooking.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        brandName: brandName.trim(),
        website: website?.trim() || null,
        monthlyAdSpend: monthlyAdSpend || "Not specified",
        notes: notes?.trim() || null,
        scheduledTime: scheduledTime || "Next available 15m slot",
        status: "confirmed",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Strategy call request recorded! Our team will send a calendar invite shortly.",
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to schedule call" },
      { status: 500 }
    );
  }
}
