/**
 * /enseignant — Mode Enseignant landing.
 *
 * If the user is logged in AND has a teacher_profiles row → redirect them
 * to /enseignant/dashboard. If logged in but no profile → show signup
 * form. If anonymous → show marketing landing with "Créer mon compte
 * enseignant" CTA pointing to /inscription.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { TeacherSignupForm } from "@/components/app/enseignant/TeacherSignupForm";

export const metadata = { title: "Espace enseignant" };

export default async function TeacherZone() {
  const t = await getTranslations("Enseignant");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: prof } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (prof) redirect("/enseignant/dashboard");
  }

  // Logged in but no teacher profile → show signup form right here.
  // Anonymous → show landing.
  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-fg-soft hover:text-navy">← {t("back_home")}</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-navy mt-2">
          👨‍🏫 {t("page_title")}
        </h1>
        <p className="text-sm md:text-base text-fg-soft mt-1 max-w-2xl">{t("page_sub")}</p>
      </header>

      <main className="max-w-5xl mx-auto px-5 lg:px-8 space-y-6">
        {/* Hero */}
        <section className="accent-block rounded-[28px] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -bottom-3 -end-3 text-7xl md:text-9xl opacity-90">🍎</div>
          <div className="relative max-w-[70%]">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">{t("hero_eyebrow")}</div>
            <h2 className="text-xl md:text-2xl font-bold leading-snug">{t("hero_title")}</h2>
            <p className="text-sm md:text-base mt-2 opacity-90">{t("hero_sub")}</p>
          </div>
        </section>

        {user ? (
          <TeacherSignupForm userEmail={user.email ?? ""} />
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ToolCard emoji="📚" title={t("tool_classes_title")} sub={t("tool_classes_sub")} />
              <ToolCard emoji="📝" title={t("tool_devoirs_title")} sub={t("tool_devoirs_sub")} />
              <ToolCard emoji="📊" title={t("tool_results_title")} sub={t("tool_results_sub")} />
            </section>

            <section className="bg-white rounded-3xl border-2 border-pale-blue p-6 text-center">
              <p className="text-base md:text-lg text-navy mb-4 max-w-2xl mx-auto">
                {t("cta_text")}
              </p>
              <Link href="/inscription?role=teacher" className="btn btn-primary inline-block">
                {t("cta_create_account")}
              </Link>
              <p className="text-xs text-fg-soft mt-3">{t("cta_already_account")} <Link href="/connexion" className="underline text-navy">{t("cta_login")}</Link></p>
            </section>
          </>
        )}

        {/* What's inside */}
        <section className="bg-white rounded-3xl border border-pale-blue p-5 md:p-6">
          <h3 className="font-bold text-navy text-lg mb-3">{t("inside_title")}</h3>
          <ul className="text-sm md:text-base text-fg-soft space-y-1.5 list-disc list-inside">
            <li>{t("inside_1")}</li>
            <li>{t("inside_2")}</li>
            <li>{t("inside_3")}</li>
            <li>{t("inside_4")}</li>
            <li>{t("inside_5")}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function ToolCard({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="bg-white border-2 border-pale-blue rounded-3xl p-5 hover:border-gold transition">
      <div className="text-4xl mb-2">{emoji}</div>
      <h3 className="font-bold text-navy text-base md:text-lg leading-tight">{title}</h3>
      <p className="text-xs md:text-sm text-fg-soft mt-1.5">{sub}</p>
    </div>
  );
}
