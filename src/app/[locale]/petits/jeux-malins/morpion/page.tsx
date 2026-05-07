import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TicTacToe } from "@/components/app/games/TicTacToe";

export const metadata = { title: "Morpion" };

export default async function TicTacToePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <TicTacToe />;
}
