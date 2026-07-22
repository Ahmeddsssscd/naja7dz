import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { ExerciseGenerator } from "@/components/app/ExerciseGenerator";

export const metadata = { title: "Générateur d'exercices — Enseignant" };

export default async function TeacherExercisesPage() {
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/enseignant");

  return (
    <PageShell active="teacher">
      <section className="py-10 bg-surface-2 border-b border-line">
        <div className="container-x max-w-3xl">
          <Link href="/enseignant/dashboard" className="text-xs text-fg-soft hover:text-fg">
            ← {locale === "ar" ? "لوحة التحكّم" : "Tableau de bord"}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mt-3 mb-2">
            {locale === "ar" ? "مولّد التمارين" : "Générateur d'exercices"}
          </h1>
          <p className="text-fg-soft">
            {locale === "ar"
              ? "أنشئ تمارين جاهزة لتلاميذك حسب المستوى والمادة والدرس، بالعربية أو الفرنسية."
              : "Crée des exercices prêts à imprimer pour tes élèves, adaptés au niveau, à la matière et au chapitre — en français ou en arabe."}
          </p>
        </div>
      </section>

      <section className="py-10 bg-surface">
        <div className="container-x max-w-3xl">
          <ExerciseGenerator locale={locale === "ar" ? "ar" : "fr"} />
        </div>
      </section>
    </PageShell>
  );
}
