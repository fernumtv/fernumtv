import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "").trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    if (!supabaseUrl || !anonKey) {
      // Fallback demo data if Supabase keys are not yet configured in local environment
      return NextResponse.json({
        user: { email: "demo@yourbrand.com", role: "client" },
        profile: {
          email: "demo@yourbrand.com",
          plan: "growth",
          brand_name: "Demo Brand",
        },
        adSlots: [
          {
            id: "demo-slot-1",
            title: "Ad #1 — Hero Problem/Agitation Angle",
            status: "delivered",
            due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
            notes: "Final cut approved. 3 alternate hooks included in Full HD.",
            deliverables: [
              {
                id: "deliv-1",
                file_name: "Ad1_PainHook_9x16_FullHD.mp4",
                aspect_ratio: "9:16",
                signedUrl: "/samples/fernum-reel.mp4",
              },
              {
                id: "deliv-2",
                file_name: "Ad1_CuriosityHook_1x1_FullHD.mp4",
                aspect_ratio: "1:1",
                signedUrl: "/samples/fernum-reel.mp4",
              },
            ],
          },
          {
            id: "demo-slot-2",
            title: "Ad #2 — Narrative Character UGC Angle",
            status: "in_production",
            due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
            notes: "3D scene compositing & sound design in progress.",
            deliverables: [],
          },
        ],
        isAdmin: false,
      });
    }

    const supabaseUserClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseUserClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Session expired or invalid." }, { status: 401 });
    }

    const userEmail = (user.email || "").toLowerCase();
    const isAdmin = siteConfig.adminEmails.includes(userEmail);

    // Use admin client with service key for privileged reads/signed URL generation
    const dbClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : supabaseUserClient;

    // 1. Fetch Profile
    let { data: profile } = await dbClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // Create profile row if not existing
      const initialRole = isAdmin ? "admin" : "client";
      const { data: newProfile } = await dbClient
        .from("profiles")
        .insert({
          id: user.id,
          email: userEmail,
          plan: "launch",
          role: initialRole,
        })
        .select()
        .single();
      profile = newProfile || { id: user.id, email: userEmail, plan: "launch", role: initialRole };
    }

    // 2. Fetch Ad Slots
    let query = dbClient.from("ad_slots").select("*").order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("client_id", user.id);
    }

    const { data: rawAdSlots, error: adSlotsError } = await query;
    if (adSlotsError) {
      console.error("Ad slots query error:", adSlotsError);
    }

    const adSlotsList = rawAdSlots || [];
    const adSlotIds = adSlotsList.map((s) => s.id);

    // 3. Fetch Deliverables
    let deliverablesMap: Record<string, any[]> = {};
    if (adSlotIds.length > 0) {
      const { data: deliverablesList } = await dbClient
        .from("deliverables")
        .select("*")
        .in("ad_slot_id", adSlotIds)
        .order("created_at", { ascending: false });

      if (deliverablesList && deliverablesList.length > 0) {
        // Generate signed URLs from Supabase private storage (1-hour validity)
        for (const item of deliverablesList) {
          let signedUrl = "";
          try {
            const { data: signedData } = await dbClient.storage
              .from("deliverables")
              .createSignedUrl(item.file_path, 3600);
            signedUrl = signedData?.signedUrl || "";
          } catch (storageErr) {
            console.error("Signed URL creation error:", storageErr);
          }

          if (!deliverablesMap[item.ad_slot_id]) {
            deliverablesMap[item.ad_slot_id] = [];
          }
          deliverablesMap[item.ad_slot_id].push({
            ...item,
            signedUrl: signedUrl || item.file_path,
          });
        }
      }
    }

    // Assemble ad slots with deliverables attached
    const adSlots = adSlotsList.map((slot) => ({
      ...slot,
      deliverables: deliverablesMap[slot.id] || [],
    }));

    // 4. If Admin, also fetch client list
    let allClients: any[] = [];
    if (isAdmin) {
      const { data: clients } = await dbClient
        .from("profiles")
        .select("id, email, plan, role, brand_name, created_at")
        .order("created_at", { ascending: false });
      allClients = clients || [];
    }

    return NextResponse.json({
      user: { id: user.id, email: userEmail, role: profile?.role || "client" },
      profile,
      adSlots,
      isAdmin,
      allClients,
    });
  } catch (err: any) {
    console.error("Portal data error:", err);
    return NextResponse.json({ error: "Failed to retrieve portal data." }, status(500));
  }
}
function status(arg0: number): { status: number } {
  return { status: arg0 };
}
