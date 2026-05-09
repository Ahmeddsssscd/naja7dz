import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Emotions } from "@/components/app/games/Emotions";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les émotions" };

export default async function EmotionsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Emotions />;
}
