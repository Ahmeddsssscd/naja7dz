import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { NumberNinja } from "@/components/app/games/NumberNinja";

export const metadata = { title: "Number Ninja" };

export default async function NumberNinjaPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <NumberNinja />;
}
