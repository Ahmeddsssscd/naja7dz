import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Bac & BEM" };

export default async function BacListPage() {
  const t = await getTranslations("EleveBac");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const samplePapers = [
    { exam: "Bac 2024", subject: t("subj_math"), filiere: t("filiere_sciences") },
    { exam: "Bac 2024", subject: t("subj_physics"), filiere: t("filiere_sciences") },
    { exam: "Bac 2023", subject: t("subj_math"), filiere: t("filiere_math") },
    { exam: "BEM 2024", subject: t("subj_math"), filiere: t("filiere_tc") },
    { exam: "BEM 2024", subject: t("subj_sciences"), filiere: t("filiere_tc") },
  ];

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">{t("page_title")}</h1>
      <p className="text-fg-soft text-sm mb-6">{t("subtitle")}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/eleve/bac/countdown" className="accent-block rounded-card p-4">
          <div className="text-xs text-gold uppercase tracking-wider mb-1">{t("countdown_eyebrow")}</div>
          <div className="text-2xl font-bold">{t("countdown_value")}</div>
          <div className="text-xs text-white/60 mt-1">{t("countdown_hint")}</div>
        </Link>
        <Link href="/eleve/bac/examen" className="bg-surface border border-line rounded-card p-4">
          <div className="text-xs text-gold uppercase tracking-wider mb-1">{t("mock_eyebrow")}</div>
          <div className="text-fg font-semibold mb-1">{t("mock_title")}</div>
          <div className="text-xs text-fg-soft">{t("mock_subtitle")}</div>
        </Link>
      </div>

      <h2 className="text-base font-semibold text-fg mb-3">{t("papers_title")}</h2>
      <div className="space-y-2">
        {samplePapers.map((p, i) => (
          <div key={i} className="bg-surface border border-line rounded-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">{p.exam}</span>
              <span className="text-xs text-fg-faint">{p.filiere}</span>
            </div>
            <div className="text-fg font-medium text-sm">{p.subject}</div>
            <div className="text-xs text-fg-soft mt-2">{t("paper_format")}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fg-faint mt-6">{t("archive_note")}</p>
    </StudentShell>
  );
}
