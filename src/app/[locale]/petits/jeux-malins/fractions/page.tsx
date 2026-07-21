import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Fractions } from "@/components/app/games/Fractions";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les fractions" };

export default async function FractionsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Fractions />;
}
