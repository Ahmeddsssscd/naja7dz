import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Contraires } from "@/components/app/games/Contraires";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les contraires" };

export default async function ContrairesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Contraires />;
}
