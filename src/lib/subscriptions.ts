/**
 * Subscription helpers. Read-only — webhook + RPC handle writes.
 *
 * The "tier" system:
 *   - "full"     : full platform (eleve_*, famille_*) — all subjects, all
 *                  features, kid universe
 *   - "bac_only" : pack_bac — only Bac/BEM grades (3AS, 4AM) and only the
 *                  /eleve/bac archive. Hides /petits.
 */
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";

export interface ActiveSubscription {
  user_id: string;
  plan_id: string;
  status: "active" | "expired" | "cancelled";
  started_at: string;
  expires_at: string;
  tier: "full" | "bac_only";
  plan_name_fr: string;
  plan_name_ar: string | null;
}

// Per-request cache: many pages call this and we don't want N round-trips.
export const getActiveSubscription = cache(
  async (userId: string): Promise<ActiveSubscription | null> => {
    if (!userId) return null;
    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("subscriptions")
        .select("user_id, plan_id, status, started_at, expires_at, plans(tier, name_fr, name_ar)")
        .eq("user_id", userId)
        .maybeSingle();
      if (error || !data) return null;
      // Auto-expire: if expires_at < now, treat as inactive.
      if (new Date(data.expires_at).getTime() < Date.now()) return null;
      if (data.status !== "active") return null;
      const plan = Array.isArray(data.plans) ? data.plans[0] : data.plans;
      return {
        user_id: data.user_id,
        plan_id: data.plan_id,
        status: data.status,
        started_at: data.started_at,
        expires_at: data.expires_at,
        tier: (plan?.tier as "full" | "bac_only" | undefined) ?? "full",
        plan_name_fr: plan?.name_fr ?? data.plan_id,
        plan_name_ar: plan?.name_ar ?? null,
      };
    } catch {
      // Table may not exist yet (migration not applied). Default to no sub.
      return null;
    }
  },
);

/**
 * Centralized access check. Returns true if the user can access content of
 * the given access level.
 *
 * - "any"     : free / public (anyone)
 * - "subscriber" : any active sub
 * - "bac"     : Bac/BEM content (anyone with active sub since pack_bac
 *               IS bac and full plans include it)
 * - "kids"    : /petits (5-10 yo) — full plans only, NOT pack_bac
 * - "primary" : 1AP-5AP — full plans only, NOT pack_bac
 */
export type AccessLevel = "any" | "subscriber" | "bac" | "kids" | "primary";

export async function hasAccess(
  userId: string | null,
  level: AccessLevel,
): Promise<boolean> {
  if (level === "any") return true;
  if (!userId) return false;

  const sub = await getActiveSubscription(userId);
  if (!sub) return false;

  if (level === "subscriber") return true;
  if (level === "bac") return true; // both tiers include Bac
  if (level === "kids" || level === "primary") return sub.tier === "full";
  return false;
}

/**
 * Convenience for grade-based access. Used by student pages that read a
 * grade from the active child profile.
 */
export async function hasAccessForGrade(
  userId: string | null,
  grade: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;
  if (!grade) return true; // can't restrict if we don't know the grade
  const sub = await getActiveSubscription(userId);
  if (!sub) return false;
  if (sub.tier === "full") return true;
  // bac_only: only 3AS and 4AM (BEM final year + Bac final year)
  return grade === "3AS" || grade === "4AM";
}

/**
 * Server-page guard: redirects non-subscribers to the abonnement page.
 * The previous pattern was to render the page with a yellow "no sub" banner
 * but still link to all gated content — kids could play through everything
 * without paying. Now we hard-redirect.
 *
 * Allows authenticated calls only — pass the user.id you already have.
 *
 *   if (!user) redirect("/connexion");
 *   await requireSubscription(user.id);
 */
export async function requireSubscription(userId: string): Promise<ActiveSubscription> {
  // Lazy import to avoid pulling next/navigation into client-bundleable code.
  const { redirect } = await import("next/navigation");
  const sub = await getActiveSubscription(userId);
  if (!sub) {
    redirect("/parent/abonnement");
    // Unreachable — redirect throws — but TS can't infer that across the
    // dynamic-import boundary, so this satisfies the type checker.
    throw new Error("redirect");
  }
  return sub;
}

/**
 * Server-page guard for grade-tied content. Redirects to abonnement if no
 * subscription, or to abonnement with `?upgrade=1` if the current tier
 * doesn't cover this grade (e.g. pack_bac trying to use a 1AP page).
 */
export async function requireAccessForGrade(
  userId: string,
  grade: string | null | undefined,
): Promise<ActiveSubscription> {
  const { redirect } = await import("next/navigation");
  const sub = await getActiveSubscription(userId);
  if (!sub) {
    redirect("/parent/abonnement");
    throw new Error("redirect"); // TS narrowing across dynamic-import boundary
  }
  if (!grade) return sub;
  if (sub.tier === "full") return sub;
  if (grade === "3AS" || grade === "4AM") return sub;
  redirect("/parent/abonnement?upgrade=1");
  throw new Error("redirect");
}

/**
 * Server-page guard for the kids universe (/petits/*). Pack Bac users do
 * not have access — only full-tier (eleve / famille) plans do.
 */
export async function requireKidsAccess(userId: string): Promise<ActiveSubscription> {
  const { redirect } = await import("next/navigation");
  const sub = await getActiveSubscription(userId);
  if (!sub) {
    redirect("/parent/abonnement");
    throw new Error("redirect");
  }
  if (sub.tier !== "full") {
    redirect("/parent/abonnement?upgrade=1");
    throw new Error("redirect");
  }
  return sub;
}

/**
 * API-route guard. Returns null if access is granted (caller continues),
 * or a NextResponse 402/403 the caller should `return` immediately.
 *
 *   const sub = await getActiveSubscription(user.id);
 *   const block = requireSubscriptionApi(sub);
 *   if (block) return block;
 */
export function requireSubscriptionApi(sub: ActiveSubscription | null) {
  if (!sub) {
    // Lazy require to keep this importable from anywhere.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NextResponse } = require("next/server") as typeof import("next/server");
    return NextResponse.json(
      { error: "Subscription required", code: "SUBSCRIPTION_REQUIRED" },
      { status: 402 },
    );
  }
  return null;
}
