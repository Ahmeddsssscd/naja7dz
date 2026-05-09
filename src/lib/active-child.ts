/**
 * Active child resolution helpers.
 *
 * Parents in this app commonly have 2-4 children. The page used to silently
 * pick the first child by created_at — that left siblings invisible. Now
 * pages call `resolveActiveChild` which reads:
 *
 *   1. URL query `?child=<uuid>` (highest priority — explicit click)
 *   2. Cookie `naja7_active_child` (persists across navigations)
 *   3. First child by created_at (fallback)
 *
 * If the parent has 2+ children, the page should show a `<ChildSwitcher />`
 * UI so they can pick which one to view.
 */
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

export interface ChildRow {
  id: string;
  full_name: string;
  grade: string | null;
  age: number | null;
}

export interface ActiveChildResult {
  active: ChildRow | null;
  all: ChildRow[];
  /** True when the parent has 2+ kids — page should render a switcher. */
  hasMultiple: boolean;
}

const COOKIE = "naja7_active_child";

/**
 * Pick the active child for this request. Pass the URL query if the page
 * is a server component receiving searchParams.
 */
export async function resolveActiveChild(
  userId: string,
  queryChildId?: string,
): Promise<ActiveChildResult> {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("children")
    .select("id, full_name, grade, age")
    .eq("parent_id", userId)
    .order("created_at");
  const all = (rows ?? []) as ChildRow[];
  if (all.length === 0) return { active: null, all, hasMultiple: false };

  const cookieStore = await cookies();
  const cookieId = cookieStore.get(COOKIE)?.value;

  // Resolution order: query > cookie > first.
  let active = (queryChildId && all.find((c) => c.id === queryChildId)) || null;
  if (!active && cookieId) active = all.find((c) => c.id === cookieId) ?? null;
  if (!active) active = all[0];

  return { active, all, hasMultiple: all.length >= 2 };
}

/**
 * Server action to set the active-child cookie. Pages can call this from a
 * form action attribute or via a small API route.
 */
export async function setActiveChildCookie(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, childId, {
    httpOnly: false, // readable by client too if useful
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
