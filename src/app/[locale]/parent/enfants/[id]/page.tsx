import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Profil enfant" };

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("ChildProfile");
  const tHome = await getTranslations("ParentHome");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase.from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("*").eq("id", id).eq("parent_id", user.id).maybeSingle(),
  ]);

  if (!child) notFound();

  const subjects = [
    { name: t("subj_math"), score: 0 },
    { name: t("subj_physics"), score: 0 },
    { name: t("subj_arabic"), score: 0 },
    { name: t("subj_french"), score: 0 },
  ];

  return (
    <AppShell active="children" parentName={profile?.full_name ?? ""}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <span className="w-20 h-20 rounded-full bg-pale-blue dark:bg-surface-3 text-navy dark:text-cream text-3xl font-bold flex items-center justify-center">
            {child.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </span>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-fg">{child.full_name}</h1>
            <p className="text-fg-soft">
              {child.age ? tHome("years_old", { age: child.age }) : ""} ·{" "}
              {t("grade_label", { grade: child.grade ?? "—" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/eleve/pratique"
              className="btn btn-primary btn-sm inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
              {t("open_practice")}
            </Link>
            <Link
              href={`/parent/enfants/${child.id}/controles` as never}
              className="btn btn-outline btn-sm"
            >
              {t("parental_controls")}
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Kpi label={t("study_time")} value="0h" />
          <Kpi label={t("quizzes_completed")} value="0" />
          <Kpi label={t("avg_score")} value="—" />
        </div>

        {/* Subjects */}
        <h2 className="text-lg font-semibold text-fg mb-4">{t("perf_by_subject")}</h2>
        <div className="bg-surface border border-line rounded-card p-6 mb-8">
          <ul className="space-y-4">
            {subjects.map((s) => (
              <li key={s.name} className="flex items-center gap-3">
                <span className="w-32 text-sm text-fg">{s.name}</span>
                <div className="flex-1 h-2 bg-pale-blue rounded">
                  <div className="h-full bg-navy rounded" style={{ width: `${s.score}%` }} />
                </div>
                <span className="w-12 text-end text-sm font-medium text-fg-soft">{s.score}%</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-fg-faint mt-4">{t("perf_empty")}</p>
        </div>

        {/* Recommendations */}
        <h2 className="text-lg font-semibold text-fg mb-4">{t("recommendations")}</h2>
        <div className="accent-block rounded-card p-6">
          <p className="text-white/80">{t("rec_empty")}</p>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none">{value}</div>
    </div>
  );
}
