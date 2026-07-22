import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { TeacherCommunity } from "@/components/app/TeacherCommunity";

export const metadata = { title: "Communauté enseignants — Najaح" };

export default async function TeacherCommunityPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("user_id, status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/enseignant");

  const approved = profile.status === "approved";

  return (
    <PageShell active="teacher">
      <section className="py-10 bg-surface-2 border-b border-line">
        <div className="container-x max-w-2xl">
          <Link href="/enseignant/dashboard" className="text-xs text-fg-soft hover:text-fg">
            ← {isAr ? "لوحة التحكّم" : "Tableau de bord"}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mt-3 mb-2">
            {isAr ? "مجتمع الأساتذة" : "Communauté enseignants"}
          </h1>
          <p className="text-fg-soft">
            {isAr
              ? "شارك مواردك واطرح أسئلتك وتبادل النصائح مع أساتذة مؤكَّدين من كامل الوطن."
              : "Partage tes ressources, pose tes questions et échange des conseils avec des enseignants confirmés de tout le pays."}
          </p>
        </div>
      </section>

      <section className="py-10 bg-surface">
        <div className="container-x max-w-2xl">
          {approved ? (
            <TeacherCommunity locale={isAr ? "ar" : "fr"} />
          ) : (
            <div className="bg-surface border border-dashed border-line rounded-card p-10 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <h2 className="text-lg font-bold text-fg mb-2">
                {isAr ? "حسابك قيد المراجعة" : "Ton compte est en cours de validation"}
              </h2>
              <p className="text-fg-soft text-sm max-w-md mx-auto mb-6">
                {isAr
                  ? "يتحقق فريقنا المختص من ملفك قبل فتح المجتمع. ستتلقى إشعارًا فور التأكيد."
                  : "Notre équipe spécialisée vérifie ton profil avant d'ouvrir l'accès à la communauté. Tu seras notifié dès la confirmation."}
              </p>
              <Link href="/enseignant/dashboard" className="btn btn-outline">
                {isAr ? "العودة" : "Retour"}
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
