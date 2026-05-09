import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MathWorksheet } from "@/components/app/games/MathWorksheet";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Feuille de maths" };

export default async function MathWorksheetPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <MathWorksheet />;
}
