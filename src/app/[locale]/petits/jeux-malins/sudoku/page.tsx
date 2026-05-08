import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { KidSudoku } from "@/components/app/games/KidSudoku";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Sudoku" };

export default async function SudokuPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <KidSudoku />;
}
