/**
 * Weekly study plan CRUD for the active child.
 *
 * GET    /api/plan                 → all plan items (with chapter/subject info)
 * POST   /api/plan { chapterId, dayOfWeek }        → add a module to a day
 * PATCH  /api/plan { id, done }                    → tick / untick an item
 * DELETE /api/plan?id=<uuid>                       → remove an item
 *
 * Everything is scoped to the parent's first child and IDOR-protected.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

async function firstChild(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("children")
    .select("id, grade")
    .eq("parent_id", userId)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  return data;
}

async function loadPlan(childId: string) {
  const admin = createAdminClient();
  const { data: items } = await admin
    .from("weekly_plan_items")
    .select("id, chapter_id, day_of_week, done, sort_order")
    .eq("child_id", childId)
    .order("day_of_week")
    .order("sort_order");

  const chapterIds = [...new Set((items ?? []).map((i) => i.chapter_id))];
  const titles = new Map<string, { title_fr: string; title_ar: string | null; subject_id: string }>();
  if (chapterIds.length) {
    const { data: chapters } = await admin
      .from("chapters")
      .select("id, title_fr, title_ar, subject_id")
      .in("id", chapterIds);
    for (const c of chapters ?? []) titles.set(c.id, { title_fr: c.title_fr, title_ar: c.title_ar, subject_id: c.subject_id });

    const subjectIds = [...new Set((chapters ?? []).map((c) => c.subject_id))];
    const subjMap = new Map<string, { name_fr: string; name_ar: string | null }>();
    const { data: subjects } = await admin
      .from("subjects")
      .select("id, name_fr, name_ar")
      .in("id", subjectIds);
    for (const s of subjects ?? []) subjMap.set(s.id, { name_fr: s.name_fr, name_ar: s.name_ar });

    return (items ?? []).map((i) => {
      const ch = titles.get(i.chapter_id);
      const su = ch ? subjMap.get(ch.subject_id) : undefined;
      return {
        id: i.id,
        chapterId: i.chapter_id,
        subjectId: ch?.subject_id ?? null,
        chapterTitleFr: ch?.title_fr ?? "",
        chapterTitleAr: ch?.title_ar ?? null,
        subjectNameFr: su?.name_fr ?? "",
        subjectNameAr: su?.name_ar ?? null,
        dayOfWeek: i.day_of_week,
        done: i.done,
      };
    });
  }
  return [];
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const child = await firstChild(user.id);
  if (!child) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: await loadPlan(child.id) });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  const child = await firstChild(user.id);
  if (!child) return NextResponse.json({ error: "Aucun profil enfant" }, { status: 400 });

  let body: { chapterId?: string; dayOfWeek?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const chapterId = (body.chapterId ?? "").trim();
  const day = Number(body.dayOfWeek);
  if (!chapterId) return NextResponse.json({ error: "chapterId requis" }, { status: 400 });
  if (!Number.isInteger(day) || day < 0 || day > 6) return NextResponse.json({ error: "jour invalide" }, { status: 400 });

  const admin = createAdminClient();

  // Chapter must belong to the child's grade (prevents scheduling other grades).
  const { data: chapter } = await admin
    .from("chapters")
    .select("id, subjects(grade_code)")
    .eq("id", chapterId)
    .maybeSingle();
  const subjectsField = chapter?.subjects as unknown;
  const grade = Array.isArray(subjectsField)
    ? (subjectsField[0] as { grade_code?: string } | undefined)?.grade_code
    : (subjectsField as { grade_code?: string } | null)?.grade_code;
  if (!chapter || (child.grade && grade && grade !== child.grade)) {
    return NextResponse.json({ error: "Ce module n'est pas de ton niveau" }, { status: 400 });
  }

  // Cap items per day to keep plans sane.
  const { count } = await admin
    .from("weekly_plan_items")
    .select("id", { count: "exact", head: true })
    .eq("child_id", child.id)
    .eq("day_of_week", day);
  if ((count ?? 0) >= 8) {
    return NextResponse.json({ error: "Journée déjà bien remplie (max 8)." }, { status: 400 });
  }

  const { error } = await admin.from("weekly_plan_items").insert({
    child_id: child.id,
    chapter_id: chapterId,
    day_of_week: day,
    sort_order: count ?? 0,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: await loadPlan(child.id) });
}

export async function PATCH(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const child = await firstChild(user.id);
  if (!child) return NextResponse.json({ error: "Aucun profil enfant" }, { status: 400 });

  let body: { id?: string; done?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const id = (body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("weekly_plan_items")
    .update({ done: body.done === true })
    .eq("id", id)
    .eq("child_id", child.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const child = await firstChild(user.id);
  if (!child) return NextResponse.json({ error: "Aucun profil enfant" }, { status: 400 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("weekly_plan_items")
    .delete()
    .eq("id", id)
    .eq("child_id", child.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: await loadPlan(child.id) });
}
