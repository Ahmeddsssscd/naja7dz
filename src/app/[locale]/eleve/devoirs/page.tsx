import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PhotoHelper } from "@/components/app/PhotoHelper";

export const metadata = { title: "Aide aux devoirs — Najaح" };

export default async function PhotoHelperPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <PhotoHelper />;
}
