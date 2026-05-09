/**
 * /enseignant/classes/[id] — single-class management page.
 *
 * Editorial style — student list + bulk import + devoir placeholder.
 */
import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { StudentImporter } from "@/components/app/enseignant/StudentImporter";
import { PageShell } from "@/components/landing/PageShell";

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
    <PageShell active="teacher">
      {/* Breadcrumb */}
      <section className="py-6 bg-surface border-b border-line">
        <div className="container-x max-w-4xl">
          <Link href="/enseignant/dashboard" className="text-xs text-fg-soft hover:text-fg inline-flex items-center gap-1">
            ← {t("back_to_dashboard")}
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="py-12 md:py-14 bg-surface-2">
        <div className="container-x max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-card bg-surface-3 text-fg font-bold inline-flex items-center justify-center flex-shrink-0">
              {cls.grade}
            </div>
            <div className="flex-1 min-w-0">
              <span className="eyebrow mb-1 block">{cls.school_year}</span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-fg leading-tight">{cls.name}</h1>
              <p className="text-sm text-fg-soft mt-2">
                {students?.length ?? 0} {isAr ? "تلميذ" : "élèves"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="container-x max-w-4xl space-y-6">
          {/* Student list */}
          <div className="bg-surface border border-line rounded-card p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-fg">{t("section_students")}</h2>
              <span className="text-xs text-fg-faint">{students?.length ?? 0} {isAr ? "إجمالي" : "total"}</span>
            </div>

            {students && students.length > 0 ? (
              <div className="divide-y divide-line">
                {students.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 py-3">
                    <span className="w-8 text-xs text-fg-faint text-end font-mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="w-10 h-10 rounded-full bg-surface-3 text-fg font-semibold text-sm inline-flex items-center justify-center flex-shrink-0">
                      {s.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-fg text-sm">{s.full_name}</div>
                      {s.numero && <div className="text-xs text-fg-soft">N° {s.numero}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-fg-soft text-sm">
                {isAr ? "لا يوجد تلاميذ بعد. ألصق القائمة أدناه." : "Aucun élève. Colle la liste ci-dessous."}
              </div>
            )}
          </div>

          {/* CSV import */}
          <StudentImporter classId={cls.id} />

          {/* Devoirs placeholder */}
          <div className="bg-surface border border-line rounded-card p-6">
            <h2 className="text-lg font-semibold text-fg mb-2">{t("section_devoirs")}</h2>
            <p className="text-sm text-fg-soft mb-4">{t("devoirs_soon")}</p>
            <div className="bg-surface-3 border border-line rounded-btn p-4 text-center text-sm text-fg-soft">
              {isAr
                ? "قيد التطوير — قريباً ستتمكّن من إنشاء واجبات وتتبّع نتائج تلاميذك."
                : "En construction — bientôt tu pourras assigner des devoirs et suivre les résultats."}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
