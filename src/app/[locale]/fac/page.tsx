/**
 * /fac — Faculté hub. Entry point for post-Bac students.
 *
 * 3 sub-pages:
 *   1. /fac/diagnostic   — interactive "Quel cursus me convient ?"
 *   2. /fac/universites  — full catalogue of Algerian universities
 *   3. /fac/services     — request services from Najah staff (orientation,
 *                          dossier review, mémoire help, scholarship search)
 *
 * Hard paywall stays soft for now (post-Bac users may not be subscribed yet
 * — we let them land here as a teaser, but the diagnostic + catalogue are
 * fully functional without an account; only the services request requires
 * login).
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Section Faculté" };

export default async function FacHub() {
  const t = await getTranslations("Fac");
  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-fg-soft hover:text-navy">← {t("back_home")}</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-navy mt-2">
          🎓 {t("page_title")}
        </h1>
        <p className="text-sm md:text-base text-fg-soft mt-1 max-w-2xl">{t("page_sub")}</p>
      </header>

      <main className="max-w-5xl mx-auto px-5 lg:px-8 mt-2">
        {/* Hero — reuse same accent block as /petits */}
        <section className="accent-block rounded-[28px] p-6 md:p-10 relative overflow-hidden mb-7">
          <div className="absolute -bottom-6 -end-3 text-7xl md:text-9xl opacity-90">🎓</div>
          <div className="relative max-w-[70%]">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">{t("hero_eyebrow")}</div>
            <h2 className="text-xl md:text-2xl font-bold leading-snug">{t("hero_title")}</h2>
            <p className="text-sm md:text-base mt-2 opacity-90">{t("hero_sub")}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/fac/diagnostic" className="bg-gold text-navy font-bold rounded-full px-4 py-2 text-sm hover:bg-gold/80 transition">
                {t("cta_diagnostic")} →
              </Link>
              <Link href="/fac/universites" className="bg-white/10 text-cream border border-cream/30 font-bold rounded-full px-4 py-2 text-sm hover:bg-white/20 transition">
                {t("cta_catalogue")}
              </Link>
            </div>
          </div>
        </section>

        {/* 3 main cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card href="/fac/diagnostic"
            emoji="🎯"
            title={t("card_diagnostic_title")}
            sub={t("card_diagnostic_sub")}
            tag={t("card_diagnostic_tag")}
            color="bg-rose-100 text-rose-900 border-rose-200"
          />
          <Card href="/fac/universites"
            emoji="🏛️"
            title={t("card_unis_title")}
            sub={t("card_unis_sub")}
            tag={t("card_unis_tag")}
            color="bg-blue-100 text-blue-900 border-blue-200"
          />
          <Card href="/fac/services"
            emoji="🤝"
            title={t("card_services_title")}
            sub={t("card_services_sub")}
            tag={t("card_services_tag")}
            color="bg-emerald-100 text-emerald-900 border-emerald-200"
          />
        </section>

        {/* Quick context block */}
        <section className="bg-white rounded-3xl border border-pale-blue p-5 md:p-6 mt-7">
          <h3 className="font-bold text-navy text-lg mb-2">{t("info_title")}</h3>
          <ul className="text-sm md:text-base text-fg-soft space-y-1.5 list-disc list-inside">
            <li>{t("info_1")}</li>
            <li>{t("info_2")}</li>
            <li>{t("info_3")}</li>
            <li>{t("info_4")}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function Card({
  href, emoji, title, sub, tag, color,
}: {
  href: string;
  emoji: string;
  title: string;
  sub: string;
  tag: string;
  color: string;
}) {
  return (
    <Link href={href as never} className={`${color} border-2 rounded-3xl p-5 active:scale-[0.98] hover:scale-[1.02] hover:shadow-card-hover transition-all flex flex-col gap-3`}>
      <div className="text-5xl">{emoji}</div>
      <div className="flex-1">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider opacity-70">{tag}</span>
        <h3 className="font-bold text-lg md:text-xl mt-1 leading-tight">{title}</h3>
        <p className="text-sm opacity-80 mt-1.5">{sub}</p>
      </div>
      <div className="text-end text-2xl">→</div>
    </Link>
  );
}
