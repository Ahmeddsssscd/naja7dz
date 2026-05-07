import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { getActiveSubscription, hasAccessForGrade } from "@/lib/subscriptions";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const metadata = { title: "Mon espace" };

export default async function StudentHome() {
  const t = await getTranslations("EleveHome");
  const tStudent = await getTranslations("Student");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Pick the parent's first child as the "active" student.
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const sub = await getActiveSubscription(user.id);
  const canAccess = await hasAccessForGrade(user.id, child?.grade);

  // Pull the child's subjects + chapters + quiz counts so the home shows
  // REAL "today's missions" — the next 3 chapters that have a question bank.
  const admin = createAdminClient();
  const isAr = locale === "ar";

  let subjects: Array<{ id: string; name_fr: string; name_ar: string | null }> = [];
  let firstReadyChapters: Array<{
    id: string;
    title: string;
    subject_id: string;
    subject_name: string;
    questionCount: number;
  }> = [];

  if (child?.grade) {
    const { data: subjs } = await admin
      .from("subjects")
      .select("id, name_fr, name_ar")
      .eq("grade_code", child.grade)
      .order("sort_order");
    subjects = subjs ?? [];

    if (subjects.length) {
      const { data: chapters } = await admin
        .from("chapters")
        .select("id, title_fr, title_ar, subject_id, subjects(name_fr, name_ar)")
        .in("subject_id", subjects.map((s) => s.id))
        .order("sort_order");

      // Count questions per chapter (one query, group in JS).
      const { data: qs } = await admin
        .from("quiz_questions")
        .select("chapter_id")
        .in("chapter_id", (chapters ?? []).map((c) => c.id))
        .eq("active", true);
      const counts: Record<string, number> = {};
      for (const q of qs ?? []) counts[q.chapter_id] = (counts[q.chapter_id] ?? 0) + 1;

      firstReadyChapters = (chapters ?? [])
        .filter((c) => (counts[c.id] ?? 0) >= 3)
        .slice(0, 3)
        .map((c) => {
          const s = Array.isArray(c.subjects) ? c.subjects[0] : c.subjects;
          return {
            id: c.id,
            title: ((isAr && c.title_ar) || c.title_fr) as string,
            subject_id: c.subject_id,
            subject_name: ((isAr && s?.name_ar) || s?.name_fr) as string,
            questionCount: counts[c.id] ?? 0,
          };
        });
    }
  }

  // Feature flags for quick-access tiles.
  const [tutorOn, homeworkOn, bacOn] = await Promise.all([
    isFeatureEnabled("eleve_tutor"),
    isFeatureEnabled("eleve_homework_ai"),
    isFeatureEnabled("eleve_bac"),
  ]);

  // Hero CTA target: first ready chapter, or the matieres list if none.
  const heroTarget = firstReadyChapters[0]
    ? `/eleve/matieres/${firstReadyChapters[0].subject_id}/${firstReadyChapters[0].id}`
    : "/eleve/matieres";

  return (
    <StudentShell active="home" childName={child?.full_name ?? tStudent("default_name")} childGrade={child?.grade}>
      {/* Subscription gating banner */}
      {!sub && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
            🔒 Aucun abonnement actif
          </div>
          <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">
            Tu peux explorer la plateforme, mais le contenu nécessite un abonnement.
          </p>
          <Link href="/tarifs" className="btn btn-primary btn-sm">
            Voir les abonnements →
          </Link>
        </div>
      )}
      {sub && !canAccess && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
            ⚠️ Niveau non couvert par ton plan
          </div>
          <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">
            Le Pack Bac couvre uniquement la 3AS et la 4AM. Passe au plan Élève
            ou Famille pour accéder à toutes les classes.
          </p>
          <Link href="/parent/abonnement" className="btn btn-outline btn-sm">
            Changer de plan
          </Link>
        </div>
      )}

      {/* Hero mission card → real first chapter */}
      <div className="accent-block rounded-modal p-6 mb-6 relative overflow-hidden">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider">{t("today_eyebrow")}</span>
        <h1 className="text-xl font-bold mt-2 mb-1">{t("title")}</h1>
        <p className="text-white/70 text-sm mb-4">
          {firstReadyChapters[0]
            ? `${firstReadyChapters[0].subject_name} · ${firstReadyChapters[0].title}`
            : t("missions_summary", { count: 3, minutes: 25 })}
        </p>
        <Link
          href={heroTarget as never}
          className="bg-gold text-navy font-semibold px-4 py-2 rounded-btn text-sm inline-block"
        >
          {t("continue")}
        </Link>
      </div>

      {/* Today's missions — real chapter quizzes */}
      {firstReadyChapters.length > 0 && (
        <>
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="text-base font-semibold text-fg">{t("missions_today")}</h2>
          </div>
          <div className="space-y-2 mb-8">
            {firstReadyChapters.map((c, i) => (
              <Mission
                key={c.id}
                href={`/eleve/matieres/${c.subject_id}/${c.id}`}
                title={c.title}
                meta={`${c.subject_name} · ${c.questionCount} questions`}
                xp={t("xp", { n: 50 - i * 10 })}
              />
            ))}
          </div>
        </>
      )}

      {/* Quick access — gated by feature flags */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {tutorOn && <Quick href="/eleve/tuteur" title={t("quick_tutor")} subtitle={t("quick_tutor_sub")} />}
        {homeworkOn && <Quick href="/eleve/devoirs" title={t("quick_homework")} subtitle={t("quick_homework_sub")} />}
        {bacOn && <Quick href="/eleve/bac" title={t("quick_bac")} subtitle={t("quick_bac_sub")} />}
        {bacOn && <Quick href="/eleve/bac/examen" title={t("quick_exam")} subtitle={t("quick_exam_sub")} />}
      </div>

      {/* Subjects (link to matieres) */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-base font-semibold text-fg">{t("subjects_title")}</h2>
        <Link href="/eleve/matieres" className="text-xs text-fg-soft">{t("subjects_view_all")}</Link>
      </div>
      <div className="-mx-5 px-5 flex gap-3 overflow-x-auto scrollbar-hide">
        {subjects.length === 0 ? (
          <div className="flex-1 bg-surface border border-line rounded-card p-4 text-center text-fg-soft text-sm">
            Aucune matière pour {child?.grade ?? "ta classe"}.
          </div>
        ) : (
          subjects.map((s) => (
            <Link
              key={s.id}
              href={`/eleve/matieres/${s.id}` as never}
              className="flex-none w-40 bg-surface border border-line rounded-card p-4 hover:border-fg/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-pale-blue text-navy mb-3 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="text-sm font-semibold text-fg">{(isAr && s.name_ar) || s.name_fr}</div>
            </Link>
          ))
        )}
      </div>
    </StudentShell>
  );
}

function Mission({
  href, title, meta, xp,
}: { href: string; title: string; meta: string; xp: string }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-3.5 flex items-center gap-3 hover:border-fg/30 transition-colors"
    >
      <span className="w-10 h-10 rounded-[10px] bg-pale-blue text-navy flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-fg">{title}</div>
        <div className="text-xs text-fg-soft">{meta}</div>
      </div>
      <span className="text-xs font-bold text-gold">{xp}</span>
    </Link>
  );
}

function Quick({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-4 hover:border-fg/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-pale-blue text-navy mb-3 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div className="text-sm font-semibold text-fg">{title}</div>
      <div className="text-xs text-fg-soft">{subtitle}</div>
    </Link>
  );
}
