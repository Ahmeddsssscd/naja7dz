import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Mes matières" };

export default async function SubjectsPage() {
  const t = await getTranslations("EleveMatieres");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: subscriber required.
  const _activeSub = await requireAccessForGrade(user.id, null);
  void _activeSub;

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  // Use admin client so RLS doesn't block — these are open-read tables
  // anyway, but it's faster + avoids auth context for catalog lookups.
  const admin = createAdminClient();
  const subjects = child?.grade
    ? (await admin.from("subjects").select("*").eq("grade_code", child.grade).order("sort_order")).data ?? []
    : [];

  // Count chapters per subject so we don't show "0 chapitres" everywhere.
  const chapterCounts: Record<string, number> = {};
  if (subjects.length) {
    const { data: chapters } = await admin
      .from("chapters")
      .select("subject_id")
      .in("subject_id", subjects.map((s) => s.id));
    for (const c of chapters ?? []) {
      chapterCounts[c.subject_id] = (chapterCounts[c.subject_id] ?? 0) + 1;
    }
  }

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
          subjects.map((s) => {
            const count = chapterCounts[s.id] ?? 0;
            return (
              <Link
                key={s.id}
                href={`/eleve/matieres/${s.id}` as never}
                className="bg-surface border border-line rounded-card p-4 hover:border-fg/40 hover:shadow-card-hover transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-pale-blue text-navy mb-3 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div className="text-sm font-semibold text-fg">{(isAr && s.name_ar) || s.name_fr}</div>
                <div className="text-xs text-fg-soft mt-1">{t("chapters_count", { count })}</div>
              </Link>
            );
          })
        )}
      </div>
    </StudentShell>
  );
}
