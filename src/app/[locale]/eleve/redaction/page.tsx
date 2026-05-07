import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { WritingPad } from "@/components/app/WritingPad";

export const metadata = { title: "Rédaction" };

export default async function WritingPage() {
  const t = await getTranslations("EleveRedaction");
  const locale = await getLocale();
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
  const isAr = locale === "ar";

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">{t("page_title")}</h1>
      <p className="text-fg-soft text-sm mb-6">{t("subtitle")}</p>
      {prompt ? (
        <WritingPad
          prompt={(isAr && prompt.prompt_ar) || prompt.prompt_fr}
          promptAr={prompt.prompt_ar ?? undefined}
        />
      ) : (
        <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
          {t("no_prompt")}
        </div>
      )}
    </StudentShell>
  );
}
