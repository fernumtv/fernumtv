import { NextResponse } from "next/server";
import { verifyAuthUser, getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Update client plan manually (Admin only)
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
    const { client_id, plan, brand_name } = body;

    if (!client_id || !plan) {
      return NextResponse.json({ error: "client_id and plan are required." }, { status: 400 });
    }

    const updates: Record<string, any> = { plan, updated_at: new Date().toISOString() };
    if (brand_name !== undefined) updates.brand_name = brand_name;

    const { data: updatedProfile, error } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", client_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
