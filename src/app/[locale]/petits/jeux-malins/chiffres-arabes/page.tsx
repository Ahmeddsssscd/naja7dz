import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ChiffresArabes } from "@/components/app/games/ChiffresArabes";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Chiffres arabes" };

export default async function ChiffresArabesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <ChiffresArabes />;
}
