import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Vocabulaire } from "@/components/app/games/Vocabulaire";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Vocabulaire" };

export default async function VocabulairePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Vocabulaire />;
}
