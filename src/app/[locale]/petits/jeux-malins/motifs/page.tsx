import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PatternPuzzles } from "@/components/app/games/PatternPuzzles";

export const metadata = { title: "Motifs" };

export default async function PatternsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <PatternPuzzles />;
}
