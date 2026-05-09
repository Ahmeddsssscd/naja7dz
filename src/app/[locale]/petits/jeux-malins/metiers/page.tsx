import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Metiers } from "@/components/app/games/Metiers";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les métiers" };

export default async function MetiersPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Metiers />;
}
