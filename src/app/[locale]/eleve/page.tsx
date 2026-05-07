import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Mon espace" };

export default async function StudentHome() {
  const t = await getTranslations("EleveHome");
  const tStudent = await getTranslations("Student");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Pick the parent's first child as the "active" student (basic for now)
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const subjects = [
    { key: "subj_math", name: t("subj_math") },
    { key: "subj_physics", name: t("subj_physics") },
    { key: "subj_arabic", name: t("subj_arabic") },
    { key: "subj_french", name: t("subj_french") },
    { key: "subj_english", name: t("subj_english") },
  ];

  return (
    <StudentShell active="home" childName={child?.full_name ?? tStudent("default_name")} childGrade={child?.grade}>
      {/* Hero mission card */}
      <div className="accent-block rounded-modal p-6 mb-6 relative overflow-hidden">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider">{t("today_eyebrow")}</span>
        <h1 className="text-xl font-bold mt-2 mb-1">{t("title")}</h1>
        <p className="text-white/70 text-sm mb-4">{t("missions_summary", { count: 3, minutes: 25 })}</p>
        <Link
          href="/eleve/quiz/demo"
          className="bg-gold text-navy font-semibold px-4 py-2 rounded-btn text-sm inline-block"
        >
          {t("continue")}
        </Link>
      </div>

      {/* Today's missions */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-base font-semibold text-fg">{t("missions_today")}</h2>
      </div>
      <div className="space-y-2 mb-8">
        <Mission title={t("m1_title")} meta={t("m1_meta")} xp={t("xp", { n: 50 })} />
        <Mission title={t("m2_title")} meta={t("m2_meta")} xp={t("xp", { n: 30 })} />
        <Mission title={t("m3_title")} meta={t("m3_meta")} xp={t("xp", { n: 40 })} />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Quick href="/eleve/tuteur" title={t("quick_tutor")} subtitle={t("quick_tutor_sub")} />
        <Quick href="/eleve/devoirs" title={t("quick_homework")} subtitle={t("quick_homework_sub")} />
        <Quick href="/eleve/bac" title={t("quick_bac")} subtitle={t("quick_bac_sub")} />
        <Quick href="/eleve/bac/examen" title={t("quick_exam")} subtitle={t("quick_exam_sub")} />
      </div>

      {/* Subjects scroll */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-base font-semibold text-fg">{t("subjects_title")}</h2>
        <Link href="/eleve/matieres" className="text-xs text-fg-soft">{t("subjects_view_all")}</Link>
      </div>
      <div className="-mx-5 px-5 flex gap-3 overflow-x-auto scrollbar-hide">
        {subjects.map((s) => (
          <div key={s.key} className="flex-none w-40 bg-surface border border-line rounded-card p-4">
            <div className="w-9 h-9 rounded-full bg-pale-blue text-navy mb-3 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="text-sm font-semibold text-fg">{s.name}</div>
            <div className="text-xs text-fg-soft mt-1">{t("subj_progress", { pct: 0, chapters: "—" })}</div>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}

function Mission({ title, meta, xp }: { title: string; meta: string; xp: string }) {
  return (
    <Link
      href="/eleve/quiz/demo"
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
