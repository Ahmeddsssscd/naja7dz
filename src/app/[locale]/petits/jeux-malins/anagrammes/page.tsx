import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Anagrammes } from "@/components/app/games/Anagrammes";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Anagrammes" };

export default async function AnagrammesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Anagrammes />;
}
