import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CountingSouk } from "@/components/app/games/CountingSouk";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Le Souk" };

export default async function SoukPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <CountingSouk />;
}
