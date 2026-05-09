import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MaitrePatissier } from "@/components/app/games/MaitrePatissier";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Maître pâtissier" };

export default async function MaitrePatissierPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <MaitrePatissier />;
}
