import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { MockExamMode } from "@/components/app/MockExamMode";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Examen blanc" };

interface PageProps {
  searchParams: Promise<{ subject?: string }>;
}

/**
 * Examen blanc — subject picker + timed run.
 *
 * Without ?subject: lists the child's grade subjects that have enough
 * questions in the bank (5+), plus a "toutes matières" mix. With
 * ?subject=<slug>: renders the locked exam mode fed by /api/exam/start.
 */
export default async function MockExamPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireAccessForGrade(user.id, null);

  const { data: child } = await supabase
    .from("children").select("full_name, grade").eq("parent_id", user.id).order("created_at").limit(1).maybeSingle();
  if (!child?.grade) redirect("/parent");

  const { subject } = await searchParams;
  const isAr = locale === "ar";

  const admin = createAdminClient();
  const { data: subjects } = await admin
    .from("subjects")
    .select("id, slug, name_fr, name_ar")
    .eq("grade_code", child.grade)
    .order("sort_order");

  // Question count per subject → only offer exams that can actually run.
  const counts: Record<string, number> = {};
  let totalQuestions = 0;
  if (subjects?.length) {
    const { data: chapters } = await admin
      .from("chapters")
      .select("id, subject_id")
      .in("subject_id", subjects.map((s) => s.id));
    const chapterToSubject: Record<string, string> = {};
    for (const c of chapters ?? []) chapterToSubject[c.id] = c.subject_id;
    if (chapters?.length) {
      const { data: qs } = await admin
        .from("quiz_questions")
        .select("chapter_id")
        .in("chapter_id", chapters.map((c) => c.id))
        .eq("active", true);
      for (const q of qs ?? []) {
        const sid = chapterToSubject[q.chapter_id];
        if (sid) counts[sid] = (counts[sid] ?? 0) + 1;
        totalQuestions++;
      }
    }
  }

  // ?subject=<slug> → run the exam
  if (subject) {
    const subj = subjects?.find((s) => s.slug === subject);
    const name = subj ? ((isAr && subj.name_ar) || subj.name_fr) : "Toutes matières";
    const pool = subj ? (counts[subj.id] ?? 0) : totalQuestions;
    const questionCount = Math.min(20, Math.max(5, pool));
    return (
      <MockExamMode
        examTitle={`Examen blanc ${child.grade} — ${name}`}
        subjectSlug={subj ? subject : undefined}
        durationMinutes={questionCount * 2}
        questionCount={questionCount}
        locale={isAr ? "ar" : "fr"}
      />
    );
  }

  const ready = (subjects ?? []).filter((s) => (counts[s.id] ?? 0) >= 5);
  const notReady = (subjects ?? []).filter((s) => (counts[s.id] ?? 0) < 5);

  return (
    <StudentShell active="practice" childName={child.full_name} childGrade={child.grade}>
      <Link href="/eleve/bac" className="text-sm text-fg-soft hover:text-fg inline-block mb-3">
        ← {isAr ? "رجوع" : "Retour"}
      </Link>
      <h1 className="text-2xl font-bold text-fg mb-1">
        {isAr ? "امتحان تجريبي" : "Examen blanc"}
      </h1>
      <p className="text-fg-soft text-sm mb-6">
        {isAr
          ? `أسئلة عشوائية من كل فصول مستواك (${child.grade}) — مؤقّت، بدون خروج، مع تصحيح مفصّل.`
          : `Questions tirées au hasard de tous les chapitres de ton niveau (${child.grade}) — chronométré, sans sortie, avec correction détaillée.`}
      </p>

      <div className="space-y-3">
        {/* Mixed exam — all subjects */}
        {totalQuestions >= 5 && (
          <Link
            href={{ pathname: "/eleve/bac/examen", query: { subject: "toutes" } } as never}
            className="bg-navy text-white rounded-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all block"
          >
            <span className="w-12 h-12 rounded-xl bg-gold text-navy font-bold text-lg flex items-center justify-center flex-shrink-0">
              ⚡
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold">{isAr ? "كل المواد — امتحان شامل" : "Toutes matières — examen complet"}</div>
              <div className="text-xs text-white/60 mt-0.5">
                {Math.min(20, totalQuestions)} questions · {Math.min(20, totalQuestions) * 2} min
              </div>
            </div>
            <span className="text-white/60">›</span>
          </Link>
        )}

        {ready.map((s) => {
          const n = counts[s.id] ?? 0;
          const qc = Math.min(20, n);
          return (
            <Link
              key={s.id}
              href={{ pathname: "/eleve/bac/examen", query: { subject: s.slug } } as never}
              className="bg-surface border border-line rounded-card p-5 flex items-center gap-4 hover:border-gold hover:shadow-card-hover transition-all block"
            >
              <span className="w-12 h-12 rounded-xl bg-pale-blue dark:bg-surface-3 text-navy dark:text-cream font-bold text-sm flex items-center justify-center flex-shrink-0">
                {((isAr && s.name_ar) || s.name_fr).slice(0, 2)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg">{(isAr && s.name_ar) || s.name_fr}</div>
                <div className="text-xs text-fg-soft mt-0.5">{qc} questions · {qc * 2} min</div>
              </div>
              <span className="text-fg-faint">›</span>
            </Link>
          );
        })}

        {ready.length === 0 && totalQuestions < 5 && (
          <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
            {isAr
              ? "لا توجد أسئلة كافية لمستواك بعد — قريبًا!"
              : "Pas encore assez de questions pour ton niveau — bientôt disponible !"}
          </div>
        )}

        {notReady.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-bold text-fg-faint uppercase tracking-wider mb-2">
              {isAr ? "قريبًا" : "Bientôt"}
            </div>
            <div className="flex flex-wrap gap-2">
              {notReady.map((s) => (
                <span key={s.id} className="text-xs text-fg-faint bg-surface-2 border border-line rounded-full px-3 py-1.5">
                  {(isAr && s.name_ar) || s.name_fr}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
