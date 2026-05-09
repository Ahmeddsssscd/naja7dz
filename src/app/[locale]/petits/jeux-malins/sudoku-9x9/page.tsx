import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Sudoku9 } from "@/components/app/games/Sudoku9";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Sudoku 9×9" };

export default async function Sudoku9Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Sudoku9 />;
}
