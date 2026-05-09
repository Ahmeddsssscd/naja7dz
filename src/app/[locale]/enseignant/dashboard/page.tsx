/**
 * /enseignant/dashboard — teacher's class list + quick actions.
 *
 * Shows: profile name, list of classes (each with student count), CTA to
 * create a new class, and recent devoirs. Server component — uses RLS
 * filtering so each teacher only sees their own rows.
 */
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { CreateClassButton } from "@/components/app/enseignant/CreateClassButton";

export const metadata = { title: "Tableau de bord enseignant" };

export default async function TeacherDashboard() {
  const t = await getTranslations("Enseignant");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/enseignant");

  const { data: classes } = await supabase
    .from("teacher_classes")
    .select("id, name, grade, school_year, created_at")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  // Per-class student counts
  const classIds = (classes ?? []).map((c) => c.id);
  const { data: studentCounts } = await supabase
    .from("class_students")
    .select("class_id")
    .in("class_id", classIds.length ? classIds : ["00000000-0000-0000-0000-000000000000"]);
  const countByClass: Record<string, number> = {};
  for (const s of studentCounts ?? []) {
    countByClass[s.class_id] = (countByClass[s.class_id] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-fg-soft hover:text-navy">← {t("back_home")}</Link>
        <div className="flex items-start justify-between gap-3 mt-2 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">
              👨‍🏫 {isAr ? `أهلاً ${profile.full_name}` : `Bonjour ${profile.full_name}`}
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              {profile.school_name ? `${profile.school_name} · ` : ""}{profile.wilaya ?? ""}
            </p>
          </div>
          <CreateClassButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 lg:px-8 space-y-6">
        {/* KPI strip */}
        <section className="grid grid-cols-3 gap-3">
          <Kpi label={t("kpi_classes")} value={String(classes?.length ?? 0)} emoji="📚" />
          <Kpi label={t("kpi_students")} value={String(studentCounts?.length ?? 0)} emoji="🧑‍🎓" />
          <Kpi label={t("kpi_devoirs")} value="0" emoji="📝" />
        </section>

        {/* Classes list */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-3">{t("section_classes")}</h2>
          {classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classes.map((c) => (
                <Link key={c.id} href={`/enseignant/classes/${c.id}` as never}
                  className="bg-white border-2 border-pale-blue rounded-2xl p-4 hover:border-gold transition active:scale-[0.99]">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {c.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-navy text-base leading-tight">{c.name}</div>
                      <div className="text-xs text-fg-soft mt-1">{c.school_year}</div>
                      <div className="text-xs text-navy/70 mt-1.5">
                        🧑‍🎓 {countByClass[c.id] ?? 0} {isAr ? "تلميذ" : "élèves"}
                      </div>
                    </div>
                    <div className="text-fg-soft">→</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-pale-blue rounded-2xl p-8 text-center">
              <div className="text-5xl mb-2">📚</div>
              <h3 className="font-bold text-navy mb-1">{t("empty_classes_title")}</h3>
              <p className="text-sm text-fg-soft mb-4 max-w-sm mx-auto">{t("empty_classes_sub")}</p>
              <CreateClassButton />
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="bg-white rounded-3xl border border-pale-blue p-5">
          <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">{t("quick_links")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <QuickLink href="/eleve/pratique" emoji="🎯" title={t("ql_quizzes_title")} sub={t("ql_quizzes_sub")} />
            <QuickLink href="/parent/catalogue" emoji="📚" title={t("ql_catalog_title")} sub={t("ql_catalog_sub")} />
            <QuickLink href="/contact" emoji="✉️" title={t("ql_contact_title")} sub={t("ql_contact_sub")} />
          </div>
        </section>
      </main>
    </div>
  );
}

function Kpi({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-white border border-pale-blue rounded-2xl p-4">
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-navy leading-none">{value}</div>
      <div className="text-xs text-fg-soft uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function QuickLink({ href, emoji, title, sub }: { href: string; emoji: string; title: string; sub: string }) {
  return (
    <Link href={href as never} className="bg-pale-blue/30 hover:bg-gold/15 rounded-2xl p-3 flex items-center gap-3 transition">
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-navy text-sm leading-tight">{title}</div>
        <div className="text-xs text-fg-soft truncate">{sub}</div>
      </div>
    </Link>
  );
}
