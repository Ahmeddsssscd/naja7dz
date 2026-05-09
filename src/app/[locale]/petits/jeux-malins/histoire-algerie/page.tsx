import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { HistoireAlgerie } from "@/components/app/games/HistoireAlgerie";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Histoire de l'Algérie" };

export default async function HistoireAlgeriePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <HistoireAlgerie />;
}
