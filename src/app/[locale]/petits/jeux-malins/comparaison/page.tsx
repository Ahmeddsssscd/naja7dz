import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Comparaison } from "@/components/app/games/Comparaison";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Compare les nombres" };

export default async function ComparaisonPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Comparaison />;
}
