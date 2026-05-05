import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { WritingPad } from "@/components/app/WritingPad";

export const metadata = { title: "Rédaction — Najaح" };

export default async function WritingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  // Pull a writing prompt for child's age
  const ageMin = (child?.age ?? 13) - 1;
  const ageMax = (child?.age ?? 13) + 1;
  const { data: prompts } = await supabase
    .from("writing_prompts")
    .select("*")
    .lte("age_min", ageMax)
    .gte("age_max", ageMin)
    .eq("active", true)
    .limit(1);

  const prompt = prompts?.[0];

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">Rédaction du jour</h1>
      <p className="text-fg-soft text-sm mb-6">
        Écris au moins 5 lignes sur le sujet ci-dessous.
      </p>
      {prompt ? (
        <WritingPad
          prompt={prompt.prompt_fr}
          promptAr={prompt.prompt_ar ?? undefined}
        />
      ) : (
        <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
          Aucun sujet disponible pour ton âge. Reviens demain !
        </div>
      )}
    </StudentShell>
  );
}
