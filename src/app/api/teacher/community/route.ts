/**
 * Teacher community feed — posts + comments, restricted to APPROVED teachers.
 *
 * GET  /api/teacher/community        → recent posts with author + comments
 * POST /api/teacher/community
 *   { action: "post", kind, title, body }     → create a post
 *   { action: "comment", postId, body }        → comment on a post
 *
 * The "specialized team" confirms teachers via /admin/approvals
 * (teacher_profiles.status = 'approved'). Unapproved users get 403.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const KINDS = new Set(["note", "resource", "question", "tip"]);

async function isApprovedTeacher(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("teacher_profiles")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.status === "approved";
}

async function loadFeed() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("teacher_posts")
    .select("id, author_id, kind, title, body, created_at")
    .eq("visibility", "network")
    .order("created_at", { ascending: false })
    .limit(50);

  const authorIds = [...new Set((posts ?? []).map((p) => p.author_id))];
  const postIds = (posts ?? []).map((p) => p.id);

  const names = new Map<string, string>();
  if (authorIds.length) {
    const { data: profs } = await admin
      .from("teacher_profiles")
      .select("user_id, full_name")
      .in("user_id", authorIds);
    for (const p of profs ?? []) names.set(p.user_id, p.full_name);
  }

  const commentsByPost = new Map<string, { id: string; author: string; body: string; createdAt: string }[]>();
  if (postIds.length) {
    const { data: comments } = await admin
      .from("teacher_post_comments")
      .select("id, post_id, author_id, body, created_at")
      .in("post_id", postIds)
      .order("created_at");
    const commentAuthorIds = [...new Set((comments ?? []).map((c) => c.author_id))];
    if (commentAuthorIds.length) {
      const { data: profs } = await admin
        .from("teacher_profiles")
        .select("user_id, full_name")
        .in("user_id", commentAuthorIds);
      for (const p of profs ?? []) names.set(p.user_id, p.full_name);
    }
    for (const c of comments ?? []) {
      if (!commentsByPost.has(c.post_id)) commentsByPost.set(c.post_id, []);
      commentsByPost.get(c.post_id)!.push({
        id: c.id,
        author: names.get(c.author_id) ?? "Enseignant",
        body: c.body,
        createdAt: c.created_at,
      });
    }
  }

  return (posts ?? []).map((p) => ({
    id: p.id,
    author: names.get(p.author_id) ?? "Enseignant",
    kind: p.kind,
    title: p.title,
    body: p.body,
    createdAt: p.created_at,
    comments: commentsByPost.get(p.id) ?? [],
  }));
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  if (!(await isApprovedTeacher(user.id))) {
    return NextResponse.json({ error: "En attente de confirmation", approved: false }, { status: 403 });
  }
  return NextResponse.json({ approved: true, posts: await loadFeed() });
}

export async function POST(req: Request) {
  const rl = rateLimit(`community:${getClientKey(req)}`, { max: 15, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de messages. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  if (!(await isApprovedTeacher(user.id))) {
    return NextResponse.json({ error: "Réservé aux enseignants confirmés" }, { status: 403 });
  }

  let body: { action?: string; kind?: string; title?: string; body?: string; postId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const admin = createAdminClient();

  if (body.action === "post") {
    const text = (body.body ?? "").trim().slice(0, 3000);
    if (text.length < 2) return NextResponse.json({ error: "Message vide" }, { status: 400 });
    const kind = KINDS.has(body.kind ?? "") ? body.kind! : "note";
    const title = (body.title ?? "").trim().slice(0, 160) || null;
    const { error } = await admin.from("teacher_posts").insert({
      author_id: user.id, kind, title, body: text, visibility: "network",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, posts: await loadFeed() });
  }

  if (body.action === "comment") {
    const postId = (body.postId ?? "").trim();
    const text = (body.body ?? "").trim().slice(0, 1000);
    if (!postId || text.length < 1) return NextResponse.json({ error: "Commentaire vide" }, { status: 400 });
    const { error } = await admin.from("teacher_post_comments").insert({
      post_id: postId, author_id: user.id, body: text,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, posts: await loadFeed() });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
