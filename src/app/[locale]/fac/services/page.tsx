/**
 * /fac/services — request a service from Najah staff.
 *
 * PageShell editorial style. Login required so we have an email to follow
 * up; anonymous users see a sign-in CTA instead of the form.
 */
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { ServicesForm } from "@/components/app/fac/ServicesForm";
import { ShieldIcon } from "@/components/Icon";

export const metadata = { title: "Services Faculté" };

export default async function ServicesPage() {
  const t = await getTranslations("Fac");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PageShell active="fac">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
            {t("services_title")}
          </h1>
          <p className="text-base md:text-lg text-fg-soft">{t("services_sub")}</p>
        </div>
      </section>

      {/* Form / login gate */}
      <section className="py-14 bg-surface">
        <div className="container-x max-w-2xl">
          {!user ? (
            <div className="bg-surface border border-line rounded-card p-8 text-center">
              <div className="w-12 h-12 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
                <ShieldIcon size={24} />
              </div>
              <h2 className="text-xl font-semibold text-fg mb-2">{t("services_login_title")}</h2>
              <p className="text-base text-fg-soft mb-6 max-w-prose mx-auto">
                {t("services_login_sub")}
              </p>
              <Link href="/connexion" className="btn btn-primary inline-block">
                {t("services_login_cta")}
              </Link>
            </div>
          ) : (
            <ServicesForm userEmail={user.email ?? ""} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
