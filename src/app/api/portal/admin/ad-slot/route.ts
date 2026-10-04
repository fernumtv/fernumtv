import { NextResponse } from "next/server";
import { verifyAuthUser, getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Create new ad slot for a client (Admin only)
export async function POST(req: Request) {
  try {
    const auth = await verifyAuthUser(req);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { client_id, title, status = "brief_received", due_date, notes } = body;

    if (!client_id || !title) {
      return NextResponse.json({ error: "client_id and title are required." }, { status: 400 });
    }

    const { data: newSlot, error } = await admin
      .from("ad_slots")
      .insert({
        client_id,
        title,
        status,
        due_date: due_date || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, adSlot: newSlot });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update ad slot status, title, due_date or notes (Admin only)
export async function PATCH(req: Request) {
  try {
    const auth = await verifyAuthUser(req);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { id, status, title, due_date, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Ad slot id is required." }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (title !== undefined) updates.title = title;
    if (due_date !== undefined) updates.due_date = due_date;
    if (notes !== undefined) updates.notes = notes;

    const { data: updatedSlot, error } = await admin
      .from("ad_slots")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, adSlot: updatedSlot });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
