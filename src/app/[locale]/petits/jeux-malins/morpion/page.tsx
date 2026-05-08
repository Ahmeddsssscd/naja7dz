import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TicTacToe } from "@/components/app/games/TicTacToe";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Morpion" };

export default async function TicTacToePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <TicTacToe />;
}
