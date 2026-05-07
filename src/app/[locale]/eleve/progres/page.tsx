import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Mes progrès" };

export default async function ProgressPage() {
  const t = await getTranslations("EleveProgres");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="progress" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-6">{t("page_title")}</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-line rounded-card p-4 text-center">
          <div className="text-2xl font-bold text-fg">0</div>
          <div className="text-xs text-fg-soft mt-1">{t("kpi_quizzes")}</div>
        </div>
        <div className="bg-surface border border-line rounded-card p-4 text-center">
          <div className="text-2xl font-bold text-fg">—</div>
          <div className="text-xs text-fg-soft mt-1">{t("kpi_avg")}</div>
        </div>
        <div className="bg-surface border border-line rounded-card p-4 text-center">
          <div className="text-2xl font-bold text-fg">0</div>
          <div className="text-xs text-fg-soft mt-1">{t("kpi_xp")}</div>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card p-6 mb-4">
        <h2 className="font-semibold text-fg mb-3">{t("chart_title")}</h2>
        <div className="h-32 flex items-end justify-around gap-1">
          {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
            <div key={i} className="flex-1 bg-pale-blue rounded-t" style={{ height: `${10 + i * 5}%`, opacity: 0.3 }} />
          ))}
        </div>
        <p className="text-xs text-fg-faint text-center mt-3">{t("chart_empty")}</p>
      </div>
    </StudentShell>
  );
}
