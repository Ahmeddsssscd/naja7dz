import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CoinCounting } from "@/components/app/games/CoinCounting";

export const metadata = { title: "Compte tes pièces" };

export default async function CoinCountingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <CoinCounting />;
}
