/**
 * /espace — smart post-login dispatch, by account role.
 *
 *   teacher → /enseignant/dashboard   (PRO teacher space)
 *   student → /eleve                  (they are their own learner)
 *   parent  → /parent                 (manage children) — unless they have
 *             no profile row yet, then also /parent (onboarding handles it)
 *
 * Role is set at sign-up (migration 030). Falls back to the child-based
 * dispatch for legacy accounts created before roles existed.
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { resolveActiveChild } from "@/lib/active-child";

export default async function EspaceDispatchPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = profile?.role ?? "parent";

  if (role === "teacher") redirect("/enseignant/dashboard");
  if (role === "student") redirect("/eleve");

  // Parent (or legacy account without a role): manage children from /parent.
  // Legacy fallback — if there's exactly one child and kids-universe is on,
  // still jump straight into the playful space.
  const { active } = await resolveActiveChild(user.id);
  if (!active) redirect("/parent");

  const { data: child } = await supabase
    .from("children")
    .select("kids_universe_enabled")
    .eq("id", active.id)
    .maybeSingle();
  if (child?.kids_universe_enabled) redirect("/petits");

  redirect("/parent");
}
