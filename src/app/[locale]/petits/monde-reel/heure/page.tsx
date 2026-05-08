import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TimeTellingGame } from "@/components/app/games/TimeTellingGame";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Lire l'heure" };

export default async function TimeTellingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <TimeTellingGame />;
}
