import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { childId?: string; surahNumber?: number; versesMemorized?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body.childId || !body.surahNumber) return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const admin = createAdminClient();
  const { data: child } = await admin.from("children").select("id").eq("id", body.childId).eq("parent_id", user.id).maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if ((body.versesMemorized ?? 0) <= 0) {
    await admin.from("quran_progress").delete().eq("student_id", body.childId).eq("surah_number", body.surahNumber);
  } else {
    await admin.from("quran_progress").upsert({
      student_id: body.childId,
      surah_number: body.surahNumber,
      verses_memorized: body.versesMemorized,
      last_practiced: new Date().toISOString(),
    }, { onConflict: "student_id,surah_number" });
  }

  return NextResponse.json({ ok: true });
}
