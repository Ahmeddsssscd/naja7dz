/**
 * Tiny endpoint that persists the parent's currently-active child to a cookie.
 * Called fire-and-forget from `<ChildSwitcher />` on the client. The cookie
 * (`naja7_active_child`) is read by `resolveActiveChild` so subsequent page
 * loads remember the parent's pick across navigations.
 *
 * Validates that the supplied childId actually belongs to the authenticated
 * parent so a hostile client can't park a stranger's id in their own cookie
 * and confuse the resolver.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { setActiveChildCookie } from "@/lib/active-child";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { childId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const childId = (body.childId ?? "").trim();
  if (!childId) return NextResponse.json({ error: "childId requis" }, { status: 400 });

  // Verify the child belongs to this parent before we trust the id.
  const { data: child } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (!child) return NextResponse.json({ error: "Enfant introuvable" }, { status: 404 });

  await setActiveChildCookie(childId);
  return NextResponse.json({ ok: true });
}
