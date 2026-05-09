import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { requireKidsAccess } from "@/lib/subscriptions";
import { EnglishHangman } from "@/components/app/games/english/EnglishHangman";

export const metadata = { title: "English – Hangman" };

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <EnglishHangman />;
}
