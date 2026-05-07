import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { WordSearch } from "@/components/app/games/WordSearch";

export const metadata = { title: "Mots cachés" };

export default async function WordSearchPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <WordSearch />;
}
