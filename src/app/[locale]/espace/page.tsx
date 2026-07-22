/**
 * /espace — smart post-login dispatch.
 *
 * One URL that sends every account to the right place:
 *
 *   - no child yet                          → /parent   (add a child first)
 *   - kids_universe_enabled is ON           → /petits   (Kids Universe)
 *   - otherwise (any grade, default)        → /eleve    (age-appropriate
 *                                             academic space, filtered by
 *                                             the child's grade)
 *
 * Kids Universe is now opt-in (migration 024): even primary pupils land on
 * their academic space by default. A parent flips the toggle per child in
 * /parent/enfants when they want the playful games.
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { resolveActiveChild } from "@/lib/active-child";

export default async function EspaceDispatchPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { active } = await resolveActiveChild(user.id);
  if (!active) redirect("/parent");

  // Look up the opt-in flag for the active child.
  const { data: child } = await supabase
    .from("children")
    .select("kids_universe_enabled")
    .eq("id", active.id)
    .maybeSingle();

  if (child?.kids_universe_enabled) redirect("/petits");
  redirect("/eleve");
}
