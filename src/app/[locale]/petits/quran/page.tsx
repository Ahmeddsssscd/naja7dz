import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { QuranTracker } from "@/components/app/games/QuranTracker";

export const metadata = { title: "Coran" };

export default async function QuranPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const [{ data: surahs }, { data: child }] = await Promise.all([
    admin.from("quran_surahs").select("*").order("number"),
    supabase.from("children").select("id").eq("parent_id", user.id).limit(1).maybeSingle(),
  ]);

  const { data: progress } = child
    ? await admin.from("quran_progress").select("*").eq("student_id", child.id)
    : { data: [] };

  return <QuranTracker surahs={surahs ?? []} progress={progress ?? []} childId={child?.id ?? null} />;
}
