import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Calligraphie" };

const ARABIC_LETTERS = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س"];

export default async function CalligraphyPage() {
  const t = await getTranslations("EleveCalligraphie");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">{t("page_title")}</h1>
      <p className="text-fg-soft text-sm mb-6">{t("subtitle")}</p>

      <h2 className="text-base font-semibold text-fg mb-3">{t("letters_title")}</h2>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {ARABIC_LETTERS.map((letter) => (
          <button
            key={letter}
            className="aspect-square bg-surface border border-line rounded-card flex items-center justify-center text-5xl text-navy dark:text-cream font-arabic hover:border-gold hover:bg-gold/10 active:scale-95 transition-all"
            aria-label={t("letter_aria", { letter })}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="bg-surface border-l-4 border-gold rounded-card p-5">
        <h3 className="font-semibold text-fg mb-2">{t("how_title")}</h3>
        <ol className="text-sm text-fg-soft space-y-1.5 list-decimal ms-5">
          <li>{t("step1")}</li>
          <li>{t("step2")}</li>
          <li>{t("step3")}</li>
          <li>{t("step4")}</li>
        </ol>
        <p className="text-xs text-fg-faint mt-3">{t("coming_soon")}</p>
      </div>
    </StudentShell>
  );
}
