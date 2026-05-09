import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ArbreGenealogique } from "@/components/app/games/ArbreGenealogique";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Mon arbre généalogique" };

export default async function ArbreGenealogiquePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <ArbreGenealogique />;
}
