import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Bac countdown" };

// Bac usually starts mid-June. Use next June 15 as placeholder.
function daysUntilBac() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 5, 15);
  if (target < now) target.setFullYear(target.getFullYear() + 1);
  const ms = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default async function BacCountdownPage() {
  const t = await getTranslations("EleveBacCountdown");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: subscriber required.
  const _activeSub = await requireAccessForGrade(user.id, null);
  void _activeSub;

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const days = daysUntilBac();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <div className="accent-block rounded-modal p-8 text-center mb-6 relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-gold mb-2">{t("page_title")}</div>
        <div className="text-7xl font-bold mb-1 leading-none"><bdi>{days}</bdi></div>
        <div className="text-white/80 mb-4">{t("days_until")}</div>
        <div className="text-xs text-white/60">{t("target_text")}</div>
      </div>

      <div className="bg-surface border-l-4 border-gold rounded-card p-5 mb-6">
        <div className="text-xs uppercase tracking-wider text-gold mb-2">{t("today_thought")}</div>
        <p className="text-fg italic">{t("today_thought_text")}</p>
        <p className="text-xs text-fg-faint mt-3">{t("today_thought_author")}</p>
      </div>

      <h2 className="text-base font-semibold text-fg mb-3">{t("todays_plan")}</h2>
      <div className="space-y-2 mb-6">
        <Task title={t("task1_title")} meta={t("task1_meta")} />
        <Task title={t("task2_title")} meta={t("task2_meta")} />
        <Task title={t("task3_title")} meta={t("task3_meta")} />
      </div>
    </StudentShell>
  );
}

function Task({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-4 flex items-center gap-3">
      <span className="w-9 h-9 rounded-full border-2 border-line-strong" />
      <div className="flex-1">
        <div className="text-sm font-semibold text-fg">{title}</div>
        <div className="text-xs text-fg-soft">{meta}</div>
      </div>
    </div>
  );
}
