import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Mes matières" };

export default async function SubjectsPage() {
  const t = await getTranslations("EleveMatieres");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  // Pull subjects for the child's grade
  const subjects = child?.grade
    ? (await supabase.from("subjects").select("*").eq("grade_code", child.grade).order("sort_order")).data ?? []
    : [];

  const isAr = locale === "ar";

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">{t("page_title")}</h1>
      <p className="text-fg-soft text-sm mb-6">{t("subtitle")}</p>
      <div className="grid grid-cols-2 gap-3">
        {subjects.length === 0 ? (
          <div className="col-span-2 bg-surface border border-line rounded-card p-6 text-center text-fg-soft">
            {t("no_subjects")}
          </div>
        ) : (
          subjects.map((s) => (
            <div key={s.id} className="bg-surface border border-line rounded-card p-4">
              <div className="w-9 h-9 rounded-full bg-pale-blue text-navy mb-3 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className="text-sm font-semibold text-fg">{(isAr && s.name_ar) || s.name_fr}</div>
              <div className="text-xs text-fg-soft mt-1">{t("chapters_count", { count: 0 })}</div>
            </div>
          ))
        )}
      </div>
    </StudentShell>
  );
}
