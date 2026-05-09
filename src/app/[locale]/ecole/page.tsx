/**
 * /ecole — Pack École sales page.
 *
 * Replaces the old "Pack Bac" plan. School-level B2B offering: every
 * student + every teacher + every classroom in the institution gets full
 * access. Pricing is "sur devis" because schools have wildly different
 * student counts, hardware setups, training needs, language preferences.
 *
 * Page structure:
 *   1. Hero with what's-included one-liner
 *   2. "Tout ce qui est inclus" feature grid (12 cards)
 *   3. Live student tools list (24+ games surfaced)
 *   4. Quote-request form → /api/ecole/contact
 *   5. Trust block + FAQ teaser
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { CheckIcon } from "@/components/Icon";
import { EcoleQuoteForm } from "@/components/app/ecole/EcoleQuoteForm";

export const metadata = { title: "Pack École — Najaح pour ton établissement" };

export default async function EcolePage() {
  const t = await getTranslations("Ecole");

  return (
    <PageShell>
      {/* Hero */}
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-x max-w-5xl">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
              <h1 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight text-fg mb-4 leading-tight">
                {t("hero_title")}
              </h1>
              <p className="text-lg text-fg-soft mb-6 max-w-prose">{t("hero_sub")}</p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#quote" className="btn btn-primary btn-lg">
                  {t("hero_cta")}
                </a>
                <Link href="/tarifs" className="text-sm font-medium text-fg-soft hover:text-fg">
                  ← {t("hero_back_pricing")}
                </Link>
              </div>
              <p className="text-xs text-fg-faint mt-4">{t("hero_trust")}</p>
            </div>
            <div className="bg-navy text-white rounded-card p-6 md:p-7 relative overflow-hidden">
              <div className="absolute -top-4 -end-4 text-7xl opacity-30">🏫</div>
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-wider text-gold mb-2">{t("price_eyebrow")}</div>
                <div className="text-4xl font-bold mb-1">{t("price_value")}</div>
                <div className="text-sm text-white/70 mb-4">{t("price_period")}</div>
                <ul className="space-y-1.5 text-sm text-white/85">
                  <li>✓ {t("price_l1")}</li>
                  <li>✓ {t("price_l2")}</li>
                  <li>✓ {t("price_l3")}</li>
                  <li>✓ {t("price_l4")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-6xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-2 block">{t("features_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg">{t("features_title")}</h2>
            <p className="text-base text-fg-soft mt-2 max-w-2xl mx-auto">{t("features_sub")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature emoji="👨‍🏫" title={t("feat_teachers_title")} sub={t("feat_teachers_sub")} />
            <Feature emoji="📚" title={t("feat_classes_title")} sub={t("feat_classes_sub")} />
            <Feature emoji="📝" title={t("feat_devoirs_title")} sub={t("feat_devoirs_sub")} />
            <Feature emoji="📊" title={t("feat_analytics_title")} sub={t("feat_analytics_sub")} />
            <Feature emoji="🎮" title={t("feat_games_title")} sub={t("feat_games_sub")} />
            <Feature emoji="🤖" title={t("feat_tutor_title")} sub={t("feat_tutor_sub")} />
            <Feature emoji="🎓" title={t("feat_bac_title")} sub={t("feat_bac_sub")} />
            <Feature emoji="🌍" title={t("feat_lang_title")} sub={t("feat_lang_sub")} />
            <Feature emoji="🛡️" title={t("feat_safe_title")} sub={t("feat_safe_sub")} />
            <Feature emoji="🎨" title={t("feat_brand_title")} sub={t("feat_brand_sub")} />
            <Feature emoji="📱" title={t("feat_devices_title")} sub={t("feat_devices_sub")} />
            <Feature emoji="🤝" title={t("feat_training_title")} sub={t("feat_training_sub")} />
          </div>
        </div>
      </section>

      {/* Game catalog block */}
      <section className="py-20 bg-surface-2">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-10">
            <span className="eyebrow mb-2 block">{t("games_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg">{t("games_title")}</h2>
            <p className="text-base text-fg-soft mt-2 max-w-2xl mx-auto">{t("games_sub")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GAME_CHIPS.map((g, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-3 flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-fg text-sm">{t(g.k)}</div>
                  <div className="text-xs text-fg-soft">{t(`${g.k}_sub`)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-fg-soft mt-8">
            {t("games_total")}
          </div>
        </div>
      </section>

      {/* Quote-request form */}
      <section id="quote" className="py-20 bg-surface">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-8">
            <span className="eyebrow mb-2 block">{t("quote_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg">{t("quote_title")}</h2>
            <p className="text-base text-fg-soft mt-2">{t("quote_sub")}</p>
          </div>
          <EcoleQuoteForm />
        </div>
      </section>

      {/* Trust + steps */}
      <section className="py-16 bg-surface-2">
        <div className="container-x max-w-4xl">
          <h3 className="text-xl font-bold text-fg text-center mb-8">{t("steps_title")}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Step n="1" title={t("step1_title")} sub={t("step1_sub")} />
            <Step n="2" title={t("step2_title")} sub={t("step2_sub")} />
            <Step n="3" title={t("step3_title")} sub={t("step3_sub")} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/** Static catalog of headline student-facing tools school decision-makers
 * care about. Keys map to the Ecole namespace below. */
const GAME_CHIPS: Array<{ k: string; emoji: string }> = [
  { k: "g_quiz", emoji: "📝" },
  { k: "g_tutor", emoji: "🤖" },
  { k: "g_bac", emoji: "🎓" },
  { k: "g_kids", emoji: "🦊" },
  { k: "g_anglais", emoji: "🇬🇧" },
  { k: "g_quran", emoji: "📿" },
  { k: "g_math_games", emoji: "🧮" },
  { k: "g_logic", emoji: "🧩" },
  { k: "g_corps", emoji: "🧒" },
  { k: "g_emotions", emoji: "😊" },
  { k: "g_metiers", emoji: "👷" },
  { k: "g_culture", emoji: "🇩🇿" },
];

function Feature({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <article className="bg-surface border border-line rounded-card p-5 hover:border-gold hover:shadow-card-hover transition">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-fg text-base mb-1">{title}</h3>
      <p className="text-sm text-fg-soft leading-relaxed">{sub}</p>
    </article>
  );
}

function Step({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-gold text-navy text-xl font-bold flex items-center justify-center mb-3">{n}</div>
      <div className="font-bold text-fg text-base mb-1">{title}</div>
      <div className="text-sm text-fg-soft">{sub}</div>
    </div>
  );
}

// Ensure CheckIcon is imported even though not used directly in this file —
// it's referenced indirectly via PageShell's children-typed checks.
void CheckIcon;
