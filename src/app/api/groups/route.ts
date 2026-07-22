/**
 * Study groups — create, join, and list.
 *
 * GET  /api/groups            → groups the active child belongs to
 * POST /api/groups { action: "create", name }
 * POST /api/groups { action: "join", code }
 *
 * Membership is keyed on the parent's first child (same convention the rest
 * of the student space uses). Chat/messages are intentionally out of scope
 * here — they require the moderation pipeline — so this is create/join/list.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

async function resolveChild(userId: string) {
  const admin = createAdminClient();
  const { data: child } = await admin
    .from("children")
    .select("id, full_name")
    .eq("parent_id", userId)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  return child;
}

async function listGroups(childId: string) {
  const admin = createAdminClient();
  const { data: memberships } = await admin
    .from("group_members")
    .select("group_id")
    .eq("child_id", childId);
  const ids = (memberships ?? []).map((m) => m.group_id);
  if (ids.length === 0) return [];

  const { data: groups } = await admin
    .from("study_groups")
    .select("id, name, invite_code, owner_id, max_members, created_at")
    .in("id", ids)
    .order("created_at", { ascending: false });

  // Member counts per group.
  const { data: allMembers } = await admin
    .from("group_members")
    .select("group_id")
    .in("group_id", ids);
  const counts = new Map<string, number>();
  for (const m of allMembers ?? []) counts.set(m.group_id, (counts.get(m.group_id) ?? 0) + 1);

  return (groups ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    inviteCode: g.invite_code,
    isOwner: g.owner_id === childId,
    members: counts.get(g.id) ?? 1,
    maxMembers: g.max_members,
  }));
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const child = await resolveChild(user.id);
  if (!child) return NextResponse.json({ groups: [] });

  return NextResponse.json({ groups: await listGroups(child.id) });
}

export async function POST(req: Request) {
  const rl = rateLimit(`groups:${getClientKey(req)}`, { max: 10, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  const child = await resolveChild(user.id);
  if (!child) return NextResponse.json({ error: "Aucun profil enfant" }, { status: 400 });

  let body: { action?: string; name?: string; code?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const admin = createAdminClient();

  if (body.action === "create") {
    const name = (body.name ?? "").trim().slice(0, 60);
    if (name.length < 2) return NextResponse.json({ error: "Nom trop court" }, { status: 400 });

    // Cap groups owned per child to avoid abuse.
    const { count } = await admin
      .from("study_groups")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", child.id);
    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: "Limite de 5 groupes créés atteinte." }, { status: 400 });
    }

    const { data: group, error } = await admin
      .from("study_groups")
      .insert({ name, owner_id: child.id })
      .select("id")
      .single();
    if (error || !group) return NextResponse.json({ error: "Création impossible" }, { status: 500 });

    await admin.from("group_members").insert({ group_id: group.id, child_id: child.id });
    return NextResponse.json({ ok: true, groups: await listGroups(child.id) });
  }

  if (body.action === "join") {
    const code = (body.code ?? "").trim().toLowerCase();
    if (code.length < 4) return NextResponse.json({ error: "Code invalide" }, { status: 400 });

    const { data: group } = await admin
      .from("study_groups")
      .select("id, max_members")
      .eq("invite_code", code)
      .maybeSingle();
    if (!group) return NextResponse.json({ error: "Aucun groupe avec ce code." }, { status: 404 });

    // Already a member?
    const { data: existing } = await admin
      .from("group_members")
      .select("child_id")
      .eq("group_id", group.id)
      .eq("child_id", child.id)
      .maybeSingle();
    if (existing) return NextResponse.json({ ok: true, groups: await listGroups(child.id) });

    // Capacity check.
    const { count } = await admin
      .from("group_members")
      .select("child_id", { count: "exact", head: true })
      .eq("group_id", group.id);
    if ((count ?? 0) >= group.max_members) {
      return NextResponse.json({ error: "Ce groupe est complet." }, { status: 400 });
    }

    const { error } = await admin.from("group_members").insert({ group_id: group.id, child_id: child.id });
    if (error) return NextResponse.json({ error: "Impossible de rejoindre" }, { status: 500 });
    return NextResponse.json({ ok: true, groups: await listGroups(child.id) });
  }

  if (body.action === "leave") {
    const code = (body.code ?? "").trim();
    if (!code) return NextResponse.json({ error: "groupe requis" }, { status: 400 });
    // `code` here carries the group id for leave.
    await admin.from("group_members").delete().eq("group_id", code).eq("child_id", child.id);
    return NextResponse.json({ ok: true, groups: await listGroups(child.id) });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
