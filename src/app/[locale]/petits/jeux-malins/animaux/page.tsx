import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AnimauxAlgerie } from "@/components/app/games/AnimauxAlgerie";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Animaux d'Algérie" };

export default async function AnimauxPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <AnimauxAlgerie />;
}
