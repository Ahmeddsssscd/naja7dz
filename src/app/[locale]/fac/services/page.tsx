/**
 * /fac/services — request a service from Najah staff.
 *
 * Possible services (radio buttons):
 *   - Orientation post-Bac (1-on-1 video call, 30 min)
 *   - Relecture de dossier (CV, lettre de motivation)
 *   - Aide PFE / mémoire (review chapters, structure)
 *   - Recherche de bourses / Erasmus / Campus France
 *   - Autre (free text)
 *
 * Form posts to /api/fac/services and stores a row in `fac_service_requests`.
 * Login required so we can route the response back to the user.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ServicesForm } from "@/components/app/fac/ServicesForm";

export const metadata = { title: "Services Faculté" };

export default async function ServicesPage() {
  const t = await getTranslations("Fac");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-3xl mx-auto">
        <Link href="/fac" className="text-xs text-fg-soft hover:text-navy">← {t("back_to_fac")}</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2">🤝 {t("services_title")}</h1>
        <p className="text-sm text-fg-soft mt-1 max-w-prose">{t("services_sub")}</p>
      </header>

      <main className="max-w-3xl mx-auto px-5 lg:px-8">
        {!user ? (
          <div className="bg-white rounded-3xl border-2 border-pale-blue p-6 text-center">
            <div className="text-5xl mb-2">🔐</div>
            <h2 className="text-lg font-bold text-navy mb-1">{t("services_login_title")}</h2>
            <p className="text-sm text-fg-soft mb-4">{t("services_login_sub")}</p>
            <Link href="/connexion" className="btn btn-primary inline-block">{t("services_login_cta")}</Link>
          </div>
        ) : (
          <ServicesForm userEmail={user.email ?? ""} />
        )}
      </main>
    </div>
  );
}
