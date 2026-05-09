import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DrapeauxMaghreb } from "@/components/app/games/DrapeauxMaghreb";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Drapeaux du monde arabe" };

export default async function DrapeauxPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <DrapeauxMaghreb />;
}
