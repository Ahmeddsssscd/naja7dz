import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Monuments } from "@/components/app/games/Monuments";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Monuments d'Algérie" };

export default async function MonumentsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Monuments />;
}
