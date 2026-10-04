import { NextResponse } from "next/server";
import { verifyAuthUser, getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Add deliverable to an ad slot (Admin only)
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
    const { ad_slot_id, file_name, file_path, aspect_ratio = "9:16" } = body;

    if (!ad_slot_id || !file_name || !file_path) {
      return NextResponse.json(
        { error: "ad_slot_id, file_name, and file_path are required." },
        { status: 400 }
      );
    }

    const { data: newDeliverable, error } = await admin
      .from("deliverables")
      .insert({
        ad_slot_id,
        file_name,
        file_path,
        aspect_ratio,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Automatically mark ad slot as 'delivered' when a deliverable is uploaded
    await admin
      .from("ad_slots")
      .update({ status: "delivered", updated_at: new Date().toISOString() })
      .eq("id", ad_slot_id);

    return NextResponse.json({ success: true, deliverable: newDeliverable });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
