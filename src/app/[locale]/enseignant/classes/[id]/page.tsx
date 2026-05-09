/**
 * /enseignant/classes/[id] — single-class management page.
 *
 * Shows the student list + a paste-area for bulk CSV import (one student
 * per line: "Full Name, numero?"). Plus a stub for devoirs (coming next
 * iteration).
 */
import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { StudentImporter } from "@/components/app/enseignant/StudentImporter";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Classe ${id.slice(0, 8)}` };
}

export default async function ClassDetail({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("Enseignant");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: cls } = await supabase
    .from("teacher_classes")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .maybeSingle();
  if (!cls) notFound();

  const { data: students } = await supabase
    .from("class_students")
    .select("id, full_name, numero, created_at")
    .eq("class_id", id)
    .order("full_name");

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-5xl mx-auto">
        <Link href="/enseignant/dashboard" className="text-xs text-fg-soft hover:text-navy">← {t("back_to_dashboard")}</Link>
        <div className="flex items-start gap-3 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold flex items-center justify-center text-xl font-bold flex-shrink-0">
            {cls.grade}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-navy leading-tight">{cls.name}</h1>
            <p className="text-sm text-fg-soft mt-1">{cls.school_year} · 🧑‍🎓 {students?.length ?? 0} {isAr ? "تلميذ" : "élèves"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 lg:px-8 space-y-6">
        {/* Student list */}
        <section className="bg-white rounded-3xl border-2 border-pale-blue p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy">{t("section_students")}</h2>
            <span className="text-xs text-fg-soft">{students?.length ?? 0} {isAr ? "تلميذ" : "total"}</span>
          </div>

          {students && students.length > 0 ? (
            <div className="divide-y divide-pale-blue">
              {students.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-7 text-xs text-fg-soft text-end">{i + 1}.</span>
                  <span className="w-9 h-9 rounded-full bg-pale-blue/40 text-navy font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {s.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy text-sm">{s.full_name}</div>
                    {s.numero && <div className="text-xs text-fg-soft">N° {s.numero}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-fg-soft text-sm">
              {isAr ? "لا يوجد تلاميذ بعد. ألصق القائمة أدناه ↓" : "Aucun élève. Colle la liste ci-dessous ↓"}
            </div>
          )}
        </section>

        {/* CSV / paste import */}
        <StudentImporter classId={cls.id} />

        {/* Devoirs (coming-soon placeholder) */}
        <section className="bg-white rounded-3xl border border-pale-blue p-5">
          <h2 className="text-lg font-bold text-navy mb-2">📝 {t("section_devoirs")}</h2>
          <p className="text-sm text-fg-soft mb-3">{t("devoirs_soon")}</p>
          <div className="bg-pale-blue/30 rounded-2xl p-4 text-center text-sm text-fg-soft">
            {isAr ? "🚧 قيد التطوير — قريباً ستتمكّن من إنشاء واجبات وتتبّع نتائج تلاميذك." : "🚧 En construction — bientôt tu pourras assigner des devoirs et suivre les résultats."}
          </div>
        </section>
      </main>
    </div>
  );
}
