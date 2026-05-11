/**
 * /enseignant — Mode Enseignant landing.
 *
 * Editorial PageShell style. Three states:
 *   - Anonymous: marketing landing + CTA to /inscription.
 *   - Logged in, no teacher profile: signup form (TeacherSignupForm).
 *   - Logged in with profile: redirect to dashboard.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { TeacherSignupForm } from "@/components/app/enseignant/TeacherSignupForm";
import {
  BookIcon,
  ClipboardIcon,
  ChartIcon,
  CheckIcon,
} from "@/components/Icon";

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

  return (
    <PageShell active="teacher">
      {/* Hero */}
      <section className="py-20 md:py-30 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("hero_eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-4">
            {t("hero_title")}
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto">{t("hero_sub")}</p>
        </div>
      </section>

      {user ? (
        // Logged-in but no profile yet — inline activation form
        <section className="py-14 bg-surface">
          <div className="container-x max-w-2xl">
            <TeacherSignupForm userEmail={user.email ?? ""} />
          </div>
        </section>
      ) : (
        <>
          {/* 3 tool cards — same Parents-page pattern */}
          <section className="py-20 bg-surface">
            <div className="container-x">
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <ToolCard icon={<BookIcon />} title={t("tool_classes_title")} text={t("tool_classes_sub")} />
                <ToolCard icon={<ClipboardIcon />} title={t("tool_devoirs_title")} text={t("tool_devoirs_sub")} />
                <ToolCard icon={<ChartIcon />} title={t("tool_results_title")} text={t("tool_results_sub")} />
              </div>
              <div className="text-center mt-10">
                <Link href="/enseignant/reseau" className="text-sm font-semibold text-fg-soft hover:text-fg inline-flex items-center gap-1.5">
                  {t("see_network")} →
                </Link>
              </div>
            </div>
          </section>

          {/* Inside checklist */}
          <section className="py-16 bg-surface-2">
            <div className="container-x max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-6 text-center">
                {t("inside_title")}
              </h2>
              <ul className="space-y-3">
                {[t("inside_1"), t("inside_2"), t("inside_3"), t("inside_4"), t("inside_5")].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start bg-surface border border-line rounded-card p-4">
                    <CheckIcon size={20} className="mt-0.5 flex-shrink-0 text-gold" />
                    <span className="text-fg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA — primary button centered, secondary "déjà inscrit ?" link
              stacked underneath so the button is unambiguously centered
              (a side-by-side flex would shift the button left of center). */}
          <section className="accent-block py-20 text-center">
            <div className="container-x">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
                {t("cta_text")}
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">{t("hero_sub")}</p>
              <Link href="/inscription?role=teacher" className="btn btn-secondary btn-lg">
                {t("cta_create_account")}
              </Link>
              <p className="text-sm text-white/65 mt-5">
                {t("cta_already_account")}{" "}
                <Link href="/connexion" className="text-white underline underline-offset-4 hover:text-gold">
                  {t("cta_login")}
                </Link>
              </p>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}

function ToolCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="bg-surface border border-line rounded-card p-7 hover:shadow-card-hover hover:border-transparent transition-all duration-200">
      <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-fg mb-2">{title}</h3>
      <p className="text-base text-fg-soft">{text}</p>
    </article>
  );
}
