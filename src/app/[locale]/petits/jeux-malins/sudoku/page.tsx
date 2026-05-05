import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { KidSudoku } from "@/components/app/games/KidSudoku";

export const metadata = { title: "Sudoku — Najaح" };

export default async function SudokuPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <KidSudoku />;
}
