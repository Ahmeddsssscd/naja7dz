import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Mesures } from "@/components/app/games/Mesures";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les mesures" };

export default async function MesuresPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Mesures />;
}
