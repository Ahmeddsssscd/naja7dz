/**
 * /fac/diagnostic — interactive "Quel cursus me convient ?" wizard.
 *
 * No paywall: the diagnostic is the most discoverable thing on /fac and
 * works as a marketing surface that hooks high-school students.
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Diagnostic } from "@/components/app/fac/Diagnostic";

export const metadata = { title: "Quel cursus me convient ?" };

export default async function DiagnosticPage() {
  const t = await getTranslations("Fac");
  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-3xl mx-auto">
        <Link href="/fac" className="text-xs text-fg-soft hover:text-navy">← {t("back_to_fac")}</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2">🎯 {t("diag_page_title")}</h1>
        <p className="text-sm text-fg-soft mt-1">{t("diag_page_sub")}</p>
      </header>

      <main className="max-w-3xl mx-auto px-5 lg:px-8">
        <Diagnostic />
      </main>
    </div>
  );
}
