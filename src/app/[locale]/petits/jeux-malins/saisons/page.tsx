import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Saisons } from "@/components/app/games/Saisons";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les saisons" };

export default async function SaisonsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Saisons />;
}
