import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { TeacherShell } from "@/components/app/TeacherShell";
import { Link } from "@/i18n/routing";
import { ProfessorInbox } from "@/components/app/ProfessorInbox";

export const metadata = { title: "Messagerie — Enseignant" };

export default async function TeacherMessagesPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("teacher_profiles").select("user_id, status").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/enseignant");

  const approved = profile.status === "approved";

  return (
    <TeacherShell active="messages">
      <section className="py-8 bg-surface-2 border-b border-line">
        <div className="container-x max-w-3xl">
          <Link href="/enseignant/dashboard" className="text-xs text-fg-soft hover:text-fg">
            ← {isAr ? "لوحة التحكّم" : "Tableau de bord"}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mt-3">
            {isAr ? "الرسائل والطلبات" : "Messages & demandes"}
          </h1>
        </div>
      </section>

      <section className="py-8 bg-surface">
        <div className="container-x max-w-3xl">
          {approved ? (
            <ProfessorInbox locale={isAr ? "ar" : "fr"} />
          ) : (
            <div className="bg-surface border border-dashed border-line rounded-card p-10 text-center">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-fg-faint"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <h2 className="text-lg font-bold text-fg mb-2">
                {isAr ? "حسابك قيد المراجعة" : "Ton compte est en cours de validation"}
              </h2>
              <p className="text-fg-soft text-sm max-w-md mx-auto">
                {isAr
                  ? "ستتمكن من استقبال طلبات التلاميذ ومراسلة زملائك بعد تأكيد فريقنا لملفك."
                  : "Tu pourras recevoir les demandes d'élèves et échanger avec tes collègues une fois ton profil confirmé par notre équipe."}
              </p>
            </div>
          )}
        </div>
      </section>
    </TeacherShell>
  );
}
