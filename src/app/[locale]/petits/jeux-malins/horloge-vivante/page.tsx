import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { HorlogeVivante } from "@/components/app/games/HorlogeVivante";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "L'horloge vivante" };

export default async function HorlogeVivantePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <HorlogeVivante />;
}
