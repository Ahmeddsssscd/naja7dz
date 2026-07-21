/**
 * /espace — smart post-login dispatch.
 *
 * One URL that sends every account to the right place based on the active
 * child's grade, so the login button never needs to know who is logging in:
 *
 *   - no child yet          → /parent   (onboarding: add a child first)
 *   - 1AP … 5AP (primaire)  → /petits   (Kids Universe)
 *   - 1AM … 3AS             → /eleve    (student space, already
 *                                        grade-filtered by child.grade)
 *
 * Parents can still open /parent directly from the nav — this route only
 * decides the default landing after "Connexion".
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { resolveActiveChild } from "@/lib/active-child";

const KIDS_GRADES = new Set(["1AP", "2AP", "3AP", "4AP", "5AP"]);

export default async function EspaceDispatchPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { active } = await resolveActiveChild(user.id);
  if (!active?.grade) redirect("/parent");

  if (KIDS_GRADES.has(active.grade)) redirect("/petits");
  redirect("/eleve");
}
