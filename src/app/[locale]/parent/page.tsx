import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";
import { ParentTrendChart } from "@/components/app/ParentTrendChart";
import { isSetupIncompleteError } from "@/lib/db-errors";
import { SetupRequiredScreen } from "@/components/app/SetupRequiredScreen";

export const metadata = { title: "Espace parent" };

export default async function ParentHome() {
  const t = await getTranslations("ParentHome");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [profileRes, childrenRes] = await Promise.all([
    supabase.from("parent_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("*").eq("parent_id", user.id).order("created_at"),
  ]);

  // If the schema isn't set up, show a friendly setup screen instead of crashing
  if (isSetupIncompleteError(profileRes.error) || isSetupIncompleteError(childrenRes.error)) {
    return <SetupRequiredScreen missing={["parent_profiles", "children"]} />;
  }

  const profile = profileRes.data;
  const children = childrenRes.data;

  if (!profile?.onboarded || !children?.length) {
    redirect("/parent/bienvenue");
  }

  const childList = children ?? [];
  const childIds = childList.map((c) => c.id);

  // Aggregate REAL KPIs from quizzes / attempts / activity_logs
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: weekQuizzes }, { data: recentActivity }] = await Promise.all([
    supabase
      .from("quizzes")
      .select("score_pct, duration_seconds, completed_at, total_questions, child_id")
      .in("child_id", childIds.length ? childIds : ["00000000-0000-0000-0000-000000000000"])
      .gte("completed_at", sevenDaysAgo)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("activity_type, metadata_json, occurred_at, child_id, children(full_name)")
      .in("child_id", childIds.length ? childIds : ["00000000-0000-0000-0000-000000000000"])
      .order("occurred_at", { ascending: false })
      .limit(10),
  ]);

  const completed = weekQuizzes ?? [];
  const totalSeconds = completed.reduce((s, q) => s + (q.duration_seconds ?? 0), 0);
  const avgScore =
    completed.length > 0
      ? Math.round(completed.reduce((s, q) => s + Number(q.score_pct ?? 0), 0) / completed.length)
      : null;
  const studyHours = Math.floor(totalSeconds / 3600);
  const studyMinutes = Math.floor((totalSeconds % 3600) / 60);
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  // Per-child weekly score map for the trend chart
  const trendByDay: Record<string, { day: string; score: number; count: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR", { weekday: "short" });
    trendByDay[key] = { day: dayLabel, score: 0, count: 0 };
  }
  for (const q of completed) {
    const key = q.completed_at?.slice(0, 10);
    if (key && trendByDay[key]) {
      trendByDay[key].score += Number(q.score_pct ?? 0);
      trendByDay[key].count += 1;
    }
  }
  const chartData = Object.values(trendByDay).map((d) => ({
    day: d.day,
    avg: d.count > 0 ? Math.round(d.score / d.count) : 0,
  }));

  return (
    <AppShell active="home" parentName={profile?.full_name ?? ""}>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-1">{t("greeting", { name: firstName })}</h1>
          <p className="text-fg-soft">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Kpi label={t("kpi_study_time")} value={`${studyHours}h ${studyMinutes.toString().padStart(2, "0")}min`} hint={t("hint_this_week")} />
          <Kpi label={t("kpi_quizzes")} value={String(completed.length)} hint={completed.length > 0 ? t("hint_this_week") : t("hint_start_today")} />
          <Kpi label={t("kpi_avg_score")} value={avgScore !== null ? `${avgScore}%` : "—"} hint={avgScore !== null ? "—" : t("hint_first_quiz")} />
          <Kpi label={t("kpi_children")} value={String(childList.length)} hint={t("hint_in_family")} />
        </div>

        {/* Trend chart */}
        {completed.length > 0 ? (
          <div className="bg-surface border border-line rounded-card p-6 mb-8">
            <h3 className="text-base font-semibold text-fg mb-4">{t("trend_title")}</h3>
            <ParentTrendChart data={chartData} />
          </div>
        ) : (
          <div className="accent-block rounded-card p-6 md:p-8 mb-8 relative overflow-hidden">
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">{t("empty_eyebrow")}</span>
            <h3 className="text-xl md:text-2xl font-bold mt-2 mb-3">{t("empty_title")}</h3>
            <p className="text-white/70 text-sm md:text-base max-w-prose">{t("empty_text")}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-fg">{t("children_title")}</h2>
          <Link href="/parent/enfants/nouveau" className="text-sm text-fg-soft hover:text-fg">{t("add_child")}</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {childList.map((c) => {
            const childQuizzes = completed.filter((q) => q.child_id === c.id);
            const childAvg = childQuizzes.length > 0 ? Math.round(childQuizzes.reduce((s, q) => s + Number(q.score_pct ?? 0), 0) / childQuizzes.length) : null;
            return <ChildCard key={c.id} child={c} weekQuizzes={childQuizzes.length} avgScore={childAvg} t={t} locale={locale} />;
          })}
        </div>

        <h2 className="text-lg font-semibold text-fg mb-4">{t("activity_title")}</h2>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            {recentActivity.map((row, i) => (
              <ActivityRow key={i} row={row} t={t} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
            {t("activity_empty")}
          </div>
        )}
      </div>
    </AppShell>
  );
}

type TFn = (key: string, vars?: Record<string, string | number>) => string;

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none mb-2">{value}</div>
      <div className="text-xs text-fg-faint">{hint}</div>
    </div>
  );
}

interface ChildRow {
  id: string;
  full_name: string;
  age?: number | null;
  grade?: string | null;
}

function ChildCard({
  child,
  weekQuizzes,
  avgScore,
  t,
}: {
  child: ChildRow;
  weekQuizzes: number;
  avgScore: number | null;
  t: TFn;
  locale: string;
}) {
  const initials = child.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <Link
      href={`/parent/enfants/${child.id}` as never}
      className="bg-surface border border-line rounded-card p-6 hover:shadow-card-hover hover:border-transparent transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="w-14 h-14 rounded-full bg-pale-blue dark:bg-surface-3 text-navy dark:text-cream text-xl font-bold flex items-center justify-center">
          {initials}
        </span>
        <div>
          <h3 className="font-semibold text-fg">{child.full_name}</h3>
          <p className="text-xs text-fg-soft">{child.age ? t("years_old", { age: child.age }) : ""} · {child.grade ?? "—"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
        <div>
          <div className="text-xs text-fg-soft">{t("child_quizzes_7d")}</div>
          <div className="text-lg font-bold text-fg">{weekQuizzes}</div>
        </div>
        <div>
          <div className="text-xs text-fg-soft">{t("child_avg")}</div>
          <div className="text-lg font-bold text-fg">{avgScore !== null ? `${avgScore}%` : "—"}</div>
        </div>
      </div>
    </Link>
  );
}

interface ActivityRow {
  activity_type: string;
  metadata_json: { score_pct?: number; total?: number } | null;
  occurred_at: string;
  // Supabase types relations as either an object or array depending on FK shape
  children: { full_name: string } | { full_name: string }[] | null;
}

function ActivityRow({ row, t, locale }: { row: ActivityRow; t: TFn; locale: string }) {
  const child = Array.isArray(row.children) ? row.children[0] : row.children;
  const childName = child?.full_name ?? "—";
  const time = new Date(row.occurred_at).toLocaleString(
    locale === "ar" ? "ar-DZ" : "fr-FR",
    { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" },
  );
  let label = row.activity_type;
  if (row.activity_type === "quiz_completed") {
    const pct = row.metadata_json?.score_pct ?? "—";
    label = t("activity_quiz_completed", { score: pct });
  }
  return (
    <div className="px-5 py-3 border-b last:border-b-0 border-line flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
      <div className="flex-1 text-sm">
        <strong className="text-fg">{childName}</strong>{" "}
        <span className="text-fg-soft">{label}</span>
      </div>
      <span className="text-xs text-fg-faint whitespace-nowrap">{time}</span>
    </div>
  );
}
