import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TimeTellingGame } from "@/components/app/games/TimeTellingGame";

export const metadata = { title: "Lire l'heure — Najaح" };

export default async function TimeTellingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <TimeTellingGame />;
}
