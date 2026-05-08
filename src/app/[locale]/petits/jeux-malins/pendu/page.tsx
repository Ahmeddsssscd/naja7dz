import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Hangman } from "@/components/app/games/Hangman";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Le pendu" };

export default async function HangmanPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <Hangman />;
}
