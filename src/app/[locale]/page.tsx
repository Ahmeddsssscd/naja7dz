import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import {
  CheckIcon,
  PlusIcon,
  BookIcon,
  CapIcon,
  CameraIcon,
  FileTextIcon,
  StarIcon,
  ChartIcon,
} from "@/components/Icon";

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Static rendering for performance
  // (params is awaited but we don't need its value here)
  void params;
  return (
    <>
      <SiteNav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </>
  );
}

/* =============== NAV =============== */
function SiteNav() {
  const t = useTranslations("Nav");
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-nav border-b border-pale-blue">
      <div className="container-x flex items-center justify-between h-18 py-4">
        <Link href="/" aria-label="Najaح">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          <a href="#features" className="hover:text-navy transition-colors">
            {t("features")}
          </a>
          <a href="#pricing" className="hover:text-navy transition-colors">
            {t("pricing")}
          </a>
          <a href="#faq" className="hover:text-navy transition-colors">
            {t("faq")}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link href="/connexion" className="hidden md:inline text-sm font-medium text-navy">
            {t("login")}
          </Link>
          <Link href="/inscription" className="btn btn-primary">
            {t("start")}
          </Link>
        </div>
      </div>
    </header>
  );
}

/* =============== HERO =============== */
function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className="bg-cream py-20 md:py-30">
      <div className="container-x grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h1 className="text-[clamp(34px,6vw,56px)] font-bold leading-[1.1] tracking-tight text-navy mb-5">
            {t("headline_pre")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{t("headline_accent")}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-2 bg-gold/40 -z-0"
              />
            </span>
            {t("headline_post")}
          </h1>
          <p className="text-lg text-ink-soft mb-8 max-w-prose">{t("lead")}</p>
          <div className="flex flex-wrap items-center gap-4 mb-7">
            <Link href="/inscription" className="btn btn-primary btn-lg">
              {t("cta_primary")}
            </Link>
            <a href="#how" className="btn-text">
              {t("cta_secondary")}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <CheckIcon size={16} className="text-gold" />
            <span>{t("trust")}</span>
          </div>
        </div>
        <HeroQuizMock />
      </div>
    </section>
  );
}

function HeroQuizMock() {
  return (
    <div
      aria-hidden
      className="bg-white rounded-modal p-7 shadow-card-hover max-w-md w-full mx-auto md:ms-auto"
    >
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-pale-blue text-sm text-ink-soft">
        <span>Mathématiques · 4AM</span>
        <div className="flex-1 h-1 bg-pale-blue rounded overflow-hidden">
          <div className="h-full w-3/5 bg-gold rounded" />
        </div>
        <span>3/5</span>
      </div>
      <div className="text-lg font-semibold text-navy mb-5 leading-snug">
        Quelle est la solution de l&rsquo;équation 2x + 6 = 14 ?
      </div>
      <div className="flex flex-col gap-2.5">
        <MockOption letter="A" text="x = 2" />
        <MockOption letter="B" text="x = 4" correct />
        <MockOption letter="C" text="x = 6" />
        <MockOption letter="D" text="x = 10" />
      </div>
    </div>
  );
}

function MockOption({
  letter,
  text,
  correct = false,
}: {
  letter: string;
  text: string;
  correct?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-btn border text-base ${
        correct
          ? "border-gold bg-gold-faint text-navy font-medium"
          : "border-pale-blue text-ink"
      }`}
    >
      <span
        className={`inline-flex w-7 h-7 rounded-md items-center justify-center text-xs font-semibold ${
          correct ? "bg-gold text-navy" : "bg-cream text-ink-soft"
        }`}
      >
        {letter}
      </span>
      <span>{text}</span>
    </div>
  );
}

/* =============== TRUST STRIP =============== */
function TrustStrip() {
  const t = useTranslations("TrustStrip");
  const items = ["official", "grades", "languages", "payment"] as const;
  return (
    <div className="bg-white border-y border-pale-blue py-7">
      <div className="container-x flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-ink-soft font-medium">
        {items.map((key) => (
          <span key={key} className="inline-flex items-center gap-2">
            <CheckIcon size={16} className="text-gold" />
            {t(key)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =============== HOW IT WORKS =============== */
function HowItWorks() {
  const t = useTranslations("How");
  const steps = [
    { title: t("step1_title"), text: t("step1_text") },
    { title: t("step2_title"), text: t("step2_text") },
    { title: t("step3_title"), text: t("step3_text") },
  ];
  return (
    <section id="how" className="py-24 md:py-26">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center px-6 py-8">
              <div className="w-14 h-14 rounded-full bg-pale-blue text-navy font-bold text-xl inline-flex items-center justify-center mb-5">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">{step.title}</h3>
              <p className="text-ink-soft text-base">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== FEATURES =============== */
function Features() {
  const t = useTranslations("Features");
  const items = [
    { icon: BookIcon, title: t("f1_title"), text: t("f1_text") },
    { icon: CapIcon, title: t("f2_title"), text: t("f2_text") },
    { icon: CameraIcon, title: t("f3_title"), text: t("f3_text") },
    { icon: FileTextIcon, title: t("f4_title"), text: t("f4_text") },
    { icon: StarIcon, title: t("f5_title"), text: t("f5_text") },
    { icon: ChartIcon, title: t("f6_title"), text: t("f6_text") },
  ];
  return (
    <section id="features" className="py-24 md:py-26 bg-cream">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <article
              key={i}
              className="card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-transparent transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-[10px] bg-pale-blue text-navy inline-flex items-center justify-center mb-5">
                <it.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">{it.title}</h3>
              <p className="text-base text-ink-soft">{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== PRICING =============== */
function Pricing() {
  const t = useTranslations("Pricing");
  return (
    <section id="pricing" className="py-24 md:py-26">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PlanCard
            name={t("eleve_name")}
            price={t("eleve_price")}
            currency={t("eleve_currency")}
            period={t("per_month")}
            features={[t("eleve_f1"), t("eleve_f2"), t("eleve_f3"), t("eleve_f4")]}
            cta={t("eleve_cta")}
          />
          <PlanCard
            name={t("famille_name")}
            price={t("famille_price")}
            currency={t("famille_currency")}
            period={t("per_month")}
            features={[
              t("famille_f1"),
              t("famille_f2"),
              t("famille_f3"),
              t("famille_f4"),
              t("famille_f5"),
            ]}
            cta={t("famille_cta")}
            featured
            badge={t("popular")}
          />
          <PlanCard
            name={t("bac_name")}
            price={t("bac_price")}
            currency={t("bac_currency")}
            period={t("one_time")}
            features={[t("bac_f1"), t("bac_f2"), t("bac_f3"), t("bac_f4")]}
            cta={t("bac_cta")}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  currency,
  period,
  features,
  cta,
  featured = false,
  badge,
}: {
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-card p-8 flex flex-col transition-all duration-200 hover:shadow-card-hover ${
        featured
          ? "bg-navy text-white border-2 border-navy"
          : "bg-white border border-pale-blue hover:-translate-y-0.5"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 end-6 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full tracking-wider">
          {badge}
        </span>
      )}
      <div
        className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
          featured ? "text-white/70" : "text-ink-soft"
        }`}
      >
        {name}
      </div>
      <div className={`text-4xl font-bold leading-none mb-1 ${featured ? "text-white" : "text-navy"}`}>
        {price} <span className="text-base font-medium">{currency}</span>
      </div>
      <div className={`text-sm mb-7 ${featured ? "text-white/65" : "text-ink-soft"}`}>{period}</div>
      <ul className="flex-1 mb-7 space-y-2">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2.5 text-base ${featured ? "text-white" : "text-ink"}`}
          >
            <CheckIcon size={16} className={`mt-1 flex-shrink-0 ${featured ? "text-gold" : "text-gold"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/inscription"
        className={`btn w-full ${
          featured
            ? "bg-gold text-navy hover:bg-gold-soft"
            : "btn-primary"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

/* =============== FAQ =============== */
function FAQ() {
  const t = useTranslations("FAQ");
  const items = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t(`q${i}` as "q1"),
    a: t(`a${i}` as "a1"),
  }));
  return (
    <section id="faq" className="py-24 md:py-26 bg-cream">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <div className="max-w-3xl mx-auto">
          {items.map((it, i) => (
            <details key={i} className="border-b border-pale-blue group">
              <summary className="flex justify-between items-center py-6 text-lg font-medium text-navy cursor-pointer list-none">
                <span>{it.q}</span>
                <PlusIcon
                  size={20}
                  className="text-ink-soft transition-transform group-open:rotate-45 group-open:text-gold flex-shrink-0 ms-4"
                />
              </summary>
              <p className="pb-6 text-ink-soft text-base leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== FINAL CTA =============== */
function FinalCTA() {
  const t = useTranslations("CTA");
  return (
    <section className="bg-navy py-24 md:py-26 text-center">
      <div className="container-x">
        <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white leading-tight mb-4">
          {t("title")}
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">{t("subtitle")}</p>
        <Link href="/inscription" className="btn btn-secondary btn-lg">
          {t("button")}
        </Link>
      </div>
    </section>
  );
}

/* =============== FOOTER =============== */
function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-cream pt-16 pb-8 border-t border-pale-blue">
      <div className="container-x">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <Logo />
            <p className="text-ink-soft text-sm mt-4 max-w-xs">{t("tagline")}</p>
          </div>
          <FooterCol title={t("product")}>
            <a href="#features">{t("product_features")}</a>
            <a href="#pricing">{t("product_pricing")}</a>
            <a href="#faq">{t("product_faq")}</a>
          </FooterCol>
          <FooterCol title={t("company")}>
            <a href="#">{t("company_about")}</a>
            <a href="#">{t("company_blog")}</a>
            <a href="#">{t("company_contact")}</a>
            <a href="#">{t("company_partner")}</a>
          </FooterCol>
          <FooterCol title={t("legal")}>
            <a href="#">{t("legal_terms")}</a>
            <a href="#">{t("legal_privacy")}</a>
            <a href="#">{t("legal_loi")}</a>
            <a href="#">{t("legal_mentions")}</a>
          </FooterCol>
        </div>
        <div className="border-t border-pale-blue pt-6 flex flex-wrap justify-between gap-3 text-xs text-ink-soft">
          <span>{t("rights")}</span>
          <span>{t("made_in")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy mb-4">{title}</h4>
      <ul className="space-y-1.5 [&_a]:text-sm [&_a]:text-ink-soft [&_a]:py-1.5 [&_a]:block hover:[&_a]:text-navy [&_a]:transition-colors">
        {Array.isArray(children) ? (
          children.map((c, i) => <li key={i}>{c}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}

/* =============== SHARED =============== */
function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className="eyebrow mb-3">{eyebrow}</span>
      <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-navy leading-tight tracking-tight mb-3 mt-2">
        {title}
      </h2>
      {subtitle && <p className="text-ink-soft text-lg">{subtitle}</p>}
    </div>
  );
}
