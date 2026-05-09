/**
 * /fac/diagnostic — interactive "Quel cursus me convient ?" wizard.
 *
 * Same PageShell shell as the rest of the public site. The wizard logic
 * lives in the Diagnostic client component below.
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Diagnostic } from "@/components/app/fac/Diagnostic";

export const metadata = { title: "Quel cursus me convient ?" };

export default async function DiagnosticPage() {
  const t = await getTranslations("Fac");
  return (
    <PageShell active="fac">
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
            {t("diag_page_title")}
          </h1>
          <p className="text-base md:text-lg text-fg-soft">{t("diag_page_sub")}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-surface">
        <div className="container-x max-w-3xl">
          <Diagnostic />
        </div>
      </section>
    </PageShell>
  );
}
