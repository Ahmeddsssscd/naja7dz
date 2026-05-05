import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // Verify admin
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("parent_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  let body: { id?: string; action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body.id || !["approve", "reject"].includes(body.action ?? "")) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  await admin
    .from("motivational_speeches")
    .update({
      status: body.action === "approve" ? "approved" : "rejected",
      reviewed_by_admin: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.id);

  return NextResponse.json({ ok: true });
}
