import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { requireAccessForGrade } from "@/lib/subscriptions";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getStreak } from "@/lib/streak";
import {
  BookIcon,
  TargetIcon,
  PaletteIcon,
  PenIcon,
  TrendingUpIcon,
  FileTextIcon,
  CalendarIcon,
  LockIcon,
  AlertIcon,
} from "@/components/Icon";
import type { ComponentType } from "react";

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

  // Hard paywall — non-subscribers redirected to /parent/abonnement.
  const sub = await requireAccessForGrade(user.id, child?.grade);
  const canAccess = true;

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

  // Hero CTA target: first ready chapter for the child's grade if any,
  // otherwise the practice hub (which has cross-grade fallback). Never a
  // dead-end — the kid should always have somewhere to go.
  const heroTarget = firstReadyChapters[0]
    ? `/eleve/matieres/${firstReadyChapters[0].subject_id}/${firstReadyChapters[0].id}`
    : "/eleve/pratique";

  // Audience determines which big tiles appear under the hero. Same enum
  // as /eleve/pratique so the experience is consistent.
  type Audience = "primary" | "middle" | "high_school_other" | "bac";
  const grade = child?.grade ?? null;
  let audience: Audience = "primary";
  if (grade === "3AS" || grade === "4AM") audience = "bac";
  else if (grade && grade.endsWith("AS")) audience = "high_school_other";
  else if (grade && grade.endsWith("AM")) audience = "middle";
  else audience = "primary";

  const childFirstName = child?.full_name?.split(" ")[0] ?? "";
  const totalReadyForGrade = firstReadyChapters.length;
  const streak = await getStreak(child?.id);

  return (
    <StudentShell active="home" childName={child?.full_name ?? tStudent("default_name")} childGrade={child?.grade} childStreak={streak.current}>
      {/* Subscription gating banner */}
      {!sub && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1 inline-flex items-center gap-2">
            <LockIcon size={16} /> Aucun abonnement actif
          </div>
          <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">
            Tu peux explorer la plateforme, mais le contenu nécessite un abonnement.
          </p>
          <Link href="/tarifs" className="btn btn-primary btn-sm">
            Voir les abonnements
          </Link>
        </div>
      )}
      {sub && !canAccess && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1 inline-flex items-center gap-2">
            <AlertIcon size={16} /> Niveau non couvert par ton plan
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

      {/* Big personal greeting that surfaces the grade prominently */}
      <div className="accent-block rounded-modal p-6 md:p-8 mb-6 relative overflow-hidden">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
          {grade ? `Mon espace ${grade}` : t("today_eyebrow")}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-1">
          {childFirstName ? `Salut ${childFirstName}` : t("title")}
        </h1>
        <p className="text-white/70 text-sm md:text-base mb-5 max-w-prose">
          {firstReadyChapters[0]
            ? `Aujourd'hui : ${firstReadyChapters[0].subject_name} · ${firstReadyChapters[0].title}`
            : t("practice_hero_text")}
        </p>
        <Link
          href={heroTarget as never}
          className="bg-gold text-navy font-semibold px-5 py-2.5 rounded-btn text-sm md:text-base inline-block"
        >
          {firstReadyChapters[0] ? t("continue") : t("practice_hero_cta")}
        </Link>
      </div>

      {/* Big action tiles — adapt per audience */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
        {/* 1. Mes matières — visible to everyone, shows count */}
        <BigTile
          href="/eleve/matieres"
          icon={BookIcon}
          title={`Mes matières${grade ? ` (${grade})` : ""}`}
          subtitle={`${subjects.length} ${subjects.length === 1 ? "matière" : "matières"}`}
          color="bg-pale-blue text-navy"
        />
        {/* 2. Pratique — universal */}
        <BigTile
          href="/eleve/pratique"
          icon={TargetIcon}
          title="Pratiquer"
          subtitle={totalReadyForGrade > 0 ? `${totalReadyForGrade} chapitre${totalReadyForGrade > 1 ? "s" : ""} prêt${totalReadyForGrade > 1 ? "s" : ""}` : "Quiz, jeux et activités"}
          color="bg-gold/15 text-fg border-gold/40"
        />
        {/* 3. Audience-specific tiles */}
        {audience === "primary" && (
          <>
            <BigTile
              href="/petits"
              icon={PaletteIcon}
              title="Univers des petits"
              subtitle="Coloriage, lecture, jeux"
              color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100"
            />
            <BigTile
              href="/petits/lecture"
              icon={BookIcon}
              title="Lis avec moi"
              subtitle="Histoires bilingues"
              color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100"
            />
          </>
        )}
        {audience === "middle" && (
          <>
            <BigTile
              href="/eleve/redaction"
              icon={PenIcon}
              title="Rédaction du jour"
              subtitle="Sujet libre, FR + AR"
              color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
            />
            <BigTile
              href="/eleve/calligraphie"
              icon={PaletteIcon}
              title="Calligraphie arabe"
              subtitle="Trace les lettres"
              color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100"
            />
          </>
        )}
        {audience === "high_school_other" && (
          <>
            <BigTile
              href="/eleve/redaction"
              icon={PenIcon}
              title="Rédaction"
              subtitle="Pratique l'écriture"
              color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
            />
            <BigTile
              href="/eleve/progres"
              icon={TrendingUpIcon}
              title="Mes progrès"
              subtitle="Suis tes scores"
              color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
            />
          </>
        )}
        {audience === "bac" && bacOn && (
          <>
            <BigTile
              href="/eleve/bac"
              icon={FileTextIcon}
              title="Archive Bac & BEM"
              subtitle="25 sujets officiels"
              color="bg-navy/10 dark:bg-navy/30 text-fg border-navy/20"
            />
            <BigTile
              href="/eleve/bac/countdown"
              icon={CalendarIcon}
              title="Compte à rebours"
              subtitle="Jours avant le grand jour"
              color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100"
            />
          </>
        )}
      </div>

      {/* Today's missions — real chapter quizzes */}
      {firstReadyChapters.length > 0 && (
        <>
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="text-base md:text-lg font-semibold text-fg">{t("missions_today")}</h2>
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

      {/* Optional secondary quick access — only for older students with feature flags */}
      {(tutorOn || homeworkOn) && audience !== "primary" && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {tutorOn && <Quick href="/eleve/tuteur" title={t("quick_tutor")} subtitle={t("quick_tutor_sub")} />}
          {homeworkOn && <Quick href="/eleve/devoirs" title={t("quick_homework")} subtitle={t("quick_homework_sub")} />}
        </div>
      )}

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

function BigTile({
  href, icon: Icon, title, subtitle, color,
}: {
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <Link
      href={href as never}
      className={`${color} border border-line rounded-card p-4 md:p-5 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all min-h-[120px]`}
    >
      <span className="w-10 h-10 rounded-[10px] bg-surface/60 inline-flex items-center justify-center">
        <Icon size={20} />
      </span>
      <div>
        <div className="font-bold text-sm md:text-base leading-tight">{title}</div>
        <div className="text-xs opacity-75 mt-0.5">{subtitle}</div>
      </div>
    </Link>
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
