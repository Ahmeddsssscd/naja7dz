import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PetitsScientifiques } from "@/components/app/games/PetitsScientifiques";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Petits scientifiques" };

export default async function PetitsScientifiquesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <PetitsScientifiques />;
}
