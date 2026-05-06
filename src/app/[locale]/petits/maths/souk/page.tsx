import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CountingSouk } from "@/components/app/games/CountingSouk";

export const metadata = { title: "Le Souk" };

export default async function SoukPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <CountingSouk />;
}
