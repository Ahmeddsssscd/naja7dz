/**
 * /fac/diagnostic — interactive "Quel cursus me convient ?" wizard.
 *
 * 2-column layout on desktop: wizard on the left, real-voices testimonials
 * on the right (DiagnosticTestimonials). Bottom: an editorial vision
 * statement about why we're building this (changing how Algerians see
 * university).
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Diagnostic } from "@/components/app/fac/Diagnostic";
import { DiagnosticTestimonials } from "@/components/app/fac/DiagnosticTestimonials";

export const metadata = { title: "Quel cursus me convient ?" };

export default async function DiagnosticPage() {
  const t = await getTranslations("Fac");

  return (
    <PageShell active="fac">
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("hero_eyebrow")}</span>
          <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
            {t("diag_page_title")}
          </h1>
          <p className="text-base md:text-lg text-fg-soft">{t("diag_page_sub")}</p>
        </div>
      </section>

      {/* Two columns on desktop: wizard left, testimonials right */}
      <section className="py-12 md:py-16 bg-surface">
        <div className="container-x max-w-6xl">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <Diagnostic />
            <DiagnosticTestimonials />
          </div>
        </div>
      </section>

      {/* Editorial vision statement — the "why this exists" message */}
      <section className="py-16 md:py-20 bg-surface-2 border-t border-line">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">{t("vision_eyebrow")}</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-5 leading-tight">
            {t("vision_title")}
          </h2>
          <p className="text-base md:text-lg text-fg leading-relaxed mb-4">{t("vision_p1")}</p>
          <p className="text-base md:text-lg text-fg-soft leading-relaxed">{t("vision_p2")}</p>
          <p className="text-sm font-semibold text-gold mt-7 tracking-wider uppercase">{t("vision_signature")}</p>
        </div>
      </section>
    </PageShell>
  );
}
