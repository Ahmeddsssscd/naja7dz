import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ColorageNumeros } from "@/components/app/games/ColorageNumeros";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Coloriage par numéros" };

export default async function ColorageNumerosPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <ColorageNumeros />;
}
