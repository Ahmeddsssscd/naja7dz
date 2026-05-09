import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CalculMental } from "@/components/app/games/CalculMental";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Calcul mental" };

export default async function CalculMentalPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <CalculMental />;
}
