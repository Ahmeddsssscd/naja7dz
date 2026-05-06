import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { GeographyGame } from "@/components/app/games/GeographyGame";

export const metadata = { title: "Géographie · Wilayas" };

export default async function GeoPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: wilayas } = await admin.from("wilayas").select("*").order("code");
  return <GeographyGame wilayas={wilayas ?? []} />;
}
