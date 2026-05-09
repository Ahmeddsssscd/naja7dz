/**
 * /ecole — Pack École sales page.
 *
 * Editorial style — same shape as /pour-les-parents and /fac. No emoji,
 * stroke icons in 11×11 rounded-square containers, surface/line tokens.
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { EcoleQuoteForm } from "@/components/app/ecole/EcoleQuoteForm";
import {
  UsersIcon,
  BookIcon,
  ClipboardIcon,
  ChartIcon,
  GamepadIcon,
  CpuIcon,
  CapIcon,
  GlobeIcon,
  ShieldIcon,
  PaletteIcon,
  DeviceIcon,
  HandshakeIcon,
  CheckIcon,
  FileTextIcon,
  StarIcon,
  CompassIcon,
  BuildingIcon,
  HomeIcon,
  ArrowRightIcon,
} from "@/components/Icon";

export const metadata = { title: "Pack École — Najaح pour ton établissement" };

export default async function EcolePage() {
  const t = await getTranslations("Ecole");

  return (
    <PageShell active="tarifs">
      {/* Hero */}
      <section className="py-20 md:py-26 bg-surface-2">
        <div className="container-x max-w-5xl">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
              <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-4 leading-[1.05]">
                {t("hero_title")}
              </h1>
              <p className="text-lg text-fg-soft mb-7 max-w-prose">{t("hero_sub")}</p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#quote" className="btn btn-primary btn-lg">
                  {t("hero_cta")}
                </a>
                <Link href="/tarifs" className="text-sm font-medium text-fg-soft hover:text-fg">
                  ← {t("hero_back_pricing")}
                </Link>
              </div>
              <p className="text-xs text-fg-faint mt-5">{t("hero_trust")}</p>
            </div>

            {/* Pricing panel */}
            <div className="bg-surface border border-line rounded-card p-7">
              <span className="eyebrow mb-3 block">{t("price_eyebrow")}</span>
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-fg leading-none mb-1">
                {t("price_value")}
              </div>
              <div className="text-sm text-fg-soft mb-6">{t("price_period")}</div>
              <ul className="space-y-3 text-sm text-fg">
                {[t("price_l1"), t("price_l2"), t("price_l3"), t("price_l4")].map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckIcon size={16} className="mt-0.5 flex-shrink-0 text-gold" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid (12) */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-6xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-2 block">{t("features_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg">{t("features_title")}</h2>
            <p className="text-base text-fg-soft mt-3 max-w-2xl mx-auto">{t("features_sub")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature icon={<UsersIcon />}      title={t("feat_teachers_title")}  text={t("feat_teachers_sub")} />
            <Feature icon={<BookIcon />}       title={t("feat_classes_title")}   text={t("feat_classes_sub")} />
            <Feature icon={<ClipboardIcon />}  title={t("feat_devoirs_title")}   text={t("feat_devoirs_sub")} />
            <Feature icon={<ChartIcon />}      title={t("feat_analytics_title")} text={t("feat_analytics_sub")} />
            <Feature icon={<GamepadIcon />}    title={t("feat_games_title")}     text={t("feat_games_sub")} />
            <Feature icon={<CpuIcon />}        title={t("feat_tutor_title")}     text={t("feat_tutor_sub")} />
            <Feature icon={<CapIcon />}        title={t("feat_bac_title")}       text={t("feat_bac_sub")} />
            <Feature icon={<GlobeIcon />}      title={t("feat_lang_title")}      text={t("feat_lang_sub")} />
            <Feature icon={<ShieldIcon />}     title={t("feat_safe_title")}      text={t("feat_safe_sub")} />
            <Feature icon={<PaletteIcon />}    title={t("feat_brand_title")}     text={t("feat_brand_sub")} />
            <Feature icon={<DeviceIcon />}     title={t("feat_devices_title")}   text={t("feat_devices_sub")} />
            <Feature icon={<HandshakeIcon />}  title={t("feat_training_title")}  text={t("feat_training_sub")} />
          </div>
        </div>
      </section>

      {/* Game catalog */}
      <section className="py-20 bg-surface-2">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-2 block">{t("games_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg">{t("games_title")}</h2>
            <p className="text-base text-fg-soft mt-3 max-w-2xl mx-auto">{t("games_sub")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GAME_CHIPS.map((g, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-4 flex items-center gap-3 hover:border-fg/40 transition">
                <div className="w-10 h-10 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
                  {g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-fg text-sm leading-tight">{t(g.k)}</div>
                  <div className="text-xs text-fg-soft">{t(`${g.k}_sub`)}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-fg-soft mt-8">{t("games_total")}</p>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="py-20 bg-surface">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow mb-2 block">{t("quote_eyebrow")}</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-fg">{t("quote_title")}</h2>
            <p className="text-base text-fg-soft mt-3">{t("quote_sub")}</p>
          </div>
          <EcoleQuoteForm />
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-surface-2">
        <div className="container-x max-w-4xl">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-fg text-center mb-10">{t("steps_title")}</h3>
          <div className="grid md:grid-cols-3 gap-5">
            <Step n={1} title={t("step1_title")} sub={t("step1_sub")} />
            <Step n={2} title={t("step2_title")} sub={t("step2_sub")} />
            <Step n={3} title={t("step3_title")} sub={t("step3_sub")} />
          </div>
          <div className="text-center mt-10">
            <a href="#quote" className="btn btn-primary inline-flex items-center gap-2">
              {t("hero_cta")} <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/**
 * Catalog of student-facing tools, with stroke icons replacing emoji.
 * Keys map to the Ecole namespace (g_quiz, g_quiz_sub, etc.).
 */
const GAME_CHIPS: Array<{ k: string; icon: React.ReactNode }> = [
  { k: "g_quiz",       icon: <FileTextIcon /> },
  { k: "g_tutor",      icon: <CpuIcon /> },
  { k: "g_bac",        icon: <CapIcon /> },
  { k: "g_kids",       icon: <StarIcon /> },
  { k: "g_anglais",    icon: <GlobeIcon /> },
  { k: "g_quran",      icon: <BookIcon /> },
  { k: "g_math_games", icon: <ChartIcon /> },
  { k: "g_logic",      icon: <CompassIcon /> },
  { k: "g_corps",      icon: <UsersIcon /> },
  { k: "g_emotions",   icon: <HandshakeIcon /> },
  { k: "g_metiers",    icon: <BuildingIcon /> },
  { k: "g_culture",    icon: <HomeIcon /> },
];

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="bg-surface border border-line rounded-card p-7 hover:shadow-card-hover hover:border-transparent transition-all duration-200">
      <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-semibold text-fg text-base mb-2">{title}</h3>
      <p className="text-base text-fg-soft leading-relaxed">{text}</p>
    </article>
  );
}

function Step({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-6">
      <div className="font-mono text-xs font-semibold text-fg-faint mb-3">{String(n).padStart(2, "0")}</div>
      <div className="font-semibold text-fg text-base mb-1.5">{title}</div>
      <div className="text-sm text-fg-soft leading-relaxed">{sub}</div>
    </div>
  );
}
