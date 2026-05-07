import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Matière" };

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const t = await getTranslations("EleveMatieres");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const [{ data: subject }, { data: chapters }] = await Promise.all([
    admin.from("subjects").select("id, name_fr, name_ar, grade_code").eq("id", subjectId).maybeSingle(),
    admin
      .from("chapters")
      .select("id, slug, title_fr, title_ar, description_fr, sort_order")
      .eq("subject_id", subjectId)
      .order("sort_order"),
  ]);
  if (!subject) notFound();

  // For each chapter, count the number of questions in the bank so the
  // student sees which chapters are quiz-ready.
  const counts: Record<string, number> = {};
  if (chapters?.length) {
    const { data: qs } = await admin
      .from("quiz_questions")
      .select("chapter_id")
      .in("chapter_id", chapters.map((c) => c.id))
      .eq("active", true);
    for (const q of qs ?? []) counts[q.chapter_id] = (counts[q.chapter_id] ?? 0) + 1;
  }

  const isAr = locale === "ar";
  const { data: child } = await supabase
    .from("children").select("full_name, grade").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <Link href="/eleve/matieres" className="text-sm text-fg-soft hover:text-fg inline-block mb-3">← {t("back")}</Link>
      <h1 className="text-2xl font-bold text-fg mb-1">
        {(isAr && subject.name_ar) || subject.name_fr}
      </h1>
      <p className="text-xs text-fg-soft mb-6 font-mono">{subject.grade_code}</p>

      <div className="space-y-2">
        {(chapters ?? []).map((c) => {
          const qCount = counts[c.id] ?? 0;
          const ready = qCount >= 3;
          return (
            <Link
              key={c.id}
              href={`/eleve/matieres/${subjectId}/${c.id}` as never}
              className="bg-surface border border-line rounded-card p-4 flex items-center gap-3 hover:border-fg/40 transition-colors"
            >
              <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                ready ? "bg-gold text-navy" : "bg-pale-blue dark:bg-surface-3 text-fg-soft"
              }`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-fg">
                  {(isAr && c.title_ar) || c.title_fr}
                </div>
                <div className="text-xs text-fg-soft">
                  {ready ? `${qCount} questions disponibles` : "À venir"}
                </div>
              </div>
              <span className="text-fg-faint">›</span>
            </Link>
          );
        })}
        {(!chapters || chapters.length === 0) && (
          <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
            Aucun chapitre pour cette matière.
          </div>
        )}
      </div>
    </StudentShell>
  );
}
