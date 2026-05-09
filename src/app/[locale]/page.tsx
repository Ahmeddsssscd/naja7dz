import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";
import { EmailCapture } from "@/components/EmailCapture";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscriptions";
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

/**
 * Landing page (root, locale-aware).
 *
 * Server component. Reads auth state + subscription so the nav/CTAs adapt:
 *   - signed-out      → "Connexion" link + "Commencer" button
 *   - signed-in/no sub → profile pill + "Découvrir les plans" CTA
 *   - signed-in/active → profile pill + "Continuer la pratique" CTA
 */
type AuthState = {
  isAuthed: boolean;
  name?: string;
  email?: string;
  hasSub: boolean;
  hasChild: boolean;
  childGrade?: string | null;
};

async function readAuthState(): Promise<AuthState> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAuthed: false, hasSub: false, hasChild: false };

  const [{ data: profile }, { data: child }, sub] = await Promise.all([
    supabase.from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("grade").eq("parent_id", user.id).order("created_at").limit(1).maybeSingle(),
    getActiveSubscription(user.id),
  ]);

  return {
    isAuthed: true,
    name: profile?.full_name ?? user.email?.split("@")[0],
    email: user.email ?? undefined,
    hasSub: !!sub,
    hasChild: !!child,
    childGrade: child?.grade ?? null,
  };
}

export default async function LandingPage() {
  const auth = await readAuthState();
  return (
    <>
      <SiteNav auth={auth} />
      <Hero auth={auth} />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA auth={auth} />
      <SiteFooter />
    </>
  );
}

/* =============== NAV =============== */
function SiteNav({ auth }: { auth: AuthState }) {
  const t = useTranslations("Nav");
  const initials = (auth.name ?? auth.email ?? "?")
    .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  // Smart "where do I go" target for the profile pill / CTA. Authenticated
  // users with a sub jump straight to their dashboard; without a sub we send
  // them to /tarifs to upgrade.
  const dashboardHref = auth.hasSub ? "/parent" : "/tarifs";

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-nav border-b border-line">
      <div className="container-x flex items-center justify-between h-20 py-3">
        <Link href="/" aria-label="Najaح" className="flex-shrink-0">
          <Logo variant="combined" height={44} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-fg-soft">
          <Link href="/tarifs" className="hover:text-fg transition-colors">
            {t("pricing")}
          </Link>
          <Link href="/pour-les-parents" className="hover:text-fg transition-colors">
            {t("parents")}
          </Link>
          <Link href="/fac" className="hover:text-fg transition-colors">
            {t("fac")}
          </Link>
          <Link href="/enseignant" className="hover:text-fg transition-colors">
            {t("teacher")}
          </Link>
          <Link href="/faq" className="hover:text-fg transition-colors">
            {t("faq")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LangSwitch />
          {auth.isAuthed ? (
            <>
              {/* Signed-in: profile pill that opens the parent dashboard */}
              <Link
                href={dashboardHref}
                className="hidden md:inline-flex items-center gap-2 ms-2 ps-3 pe-3 py-1.5 rounded-full border border-line hover:border-fg/40 hover:bg-surface-3 transition-colors"
                aria-label={t("open_dashboard")}
              >
                <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center">
                  {initials}
                </span>
                <span className="text-sm text-fg font-medium max-w-[140px] truncate">
                  {auth.name ?? auth.email}
                </span>
              </Link>
              {/* Smart primary CTA based on subscription state */}
              <Link
                href={auth.hasSub ? "/eleve/pratique" : "/tarifs"}
                className="btn btn-primary hidden md:inline-flex"
              >
                {auth.hasSub ? t("cta_practice") : t("cta_discover_plans")}
              </Link>
              <MobileMenu
                items={[
                  { href: dashboardHref, label: t("open_dashboard") },
                  { href: "/eleve/pratique", label: t("cta_practice") },
                  { href: "/parent/abonnement", label: t("subscription") },
                  { href: "/fac", label: t("fac") },
                  { href: "/enseignant", label: t("teacher") },
                  { href: "/faq", label: t("faq") },
                  { href: "/contact", label: "Contact" },
                ]}
                ctaLabel={auth.hasSub ? t("cta_practice") : t("cta_discover_plans")}
              />
            </>
          ) : (
            <>
              <Link href="/connexion" className="hidden md:inline text-sm font-medium text-fg ms-2">
                {t("login")}
              </Link>
              <Link href="/inscription" className="btn btn-primary hidden md:inline-flex">
                {t("start")}
              </Link>
              <MobileMenu
                items={[
                  { href: "/tarifs", label: t("pricing") },
                  { href: "/pour-les-parents", label: t("parents") },
                  { href: "/fac", label: t("fac") },
                  { href: "/enseignant", label: t("teacher") },
                  { href: "/faq", label: t("faq") },
                  { href: "/contact", label: "Contact" },
                  { href: "/connexion", label: t("login") },
                ]}
                ctaLabel={t("start")}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* =============== HERO =============== */
function Hero({ auth }: { auth: AuthState }) {
  const t = useTranslations("Hero");
  const tNav = useTranslations("Nav");

  return (
    <section className="bg-surface-2 py-20 md:py-30">
      <div className="container-x grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          {/* Welcome-back banner for signed-in users */}
          {auth.isAuthed && (
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-gold/15 dark:bg-gold/10 border border-gold/40 text-sm">
              <span className="text-gold">👋</span>
              <span className="text-fg font-medium">
                {t("welcome_back", { name: auth.name?.split(" ")[0] ?? "" })}
              </span>
            </div>
          )}

          <h1 className="text-[clamp(34px,6vw,56px)] font-bold leading-[1.1] tracking-tight text-fg mb-5">
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
          <p className="text-lg text-fg-soft mb-8 max-w-prose">{t("lead")}</p>

          {/* Auth-aware primary action: signed-in users get smart CTAs that
              jump into the practice space; signed-out users get email capture. */}
          {auth.isAuthed ? (
            <div className="flex flex-col sm:flex-row gap-3">
              {auth.hasSub ? (
                <>
                  <Link href="/eleve/pratique" className="btn btn-primary btn-lg">
                    🎯 {tNav("cta_practice")}
                  </Link>
                  <Link href="/petits" className="btn btn-outline btn-lg">
                    🦊 {tNav("cta_kids_universe")}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/tarifs" className="btn btn-primary btn-lg">
                    {tNav("cta_discover_plans")}
                  </Link>
                  <Link href="/parent" className="btn btn-outline btn-lg">
                    {tNav("open_dashboard")}
                  </Link>
                </>
              )}
            </div>
          ) : (
            <EmailCapture />
          )}

          <div className="flex items-center gap-2 text-sm text-fg-soft mt-6">
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
  const t = useTranslations("HeroMock");
  return (
    <div
      aria-hidden
      className="bg-surface rounded-modal p-7 shadow-card-hover border border-line max-w-md w-full mx-auto md:ms-auto"
    >
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-line text-sm text-fg-soft">
        <span>{t("subject")}</span>
        <div className="flex-1 h-1 bg-surface-3 rounded overflow-hidden">
          <div className="h-full w-3/5 bg-gold rounded" />
        </div>
        <span>3/5</span>
      </div>
      <div className="text-lg font-semibold text-fg mb-5 leading-snug">
        {t("question")}
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
          ? "border-gold bg-gold-faint dark:bg-gold/10 text-fg font-medium"
          : "border-line text-fg"
      }`}
    >
      <span
        className={`inline-flex w-7 h-7 rounded-md items-center justify-center text-xs font-semibold ${
          correct ? "bg-gold text-navy" : "bg-surface-2 text-fg-soft"
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
    <div className="bg-surface border-y border-line py-7">
      <div className="container-x flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-fg-soft font-medium">
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
    <section id="how" className="py-24 md:py-26 bg-surface">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center px-6 py-8">
              <div className="w-14 h-14 rounded-full bg-surface-3 text-fg font-bold text-xl inline-flex items-center justify-center mb-5">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-fg mb-2">{step.title}</h3>
              <p className="text-fg-soft text-base">{step.text}</p>
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
    <section id="features" className="py-24 md:py-26 bg-surface-2">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <article
              key={i}
              className="bg-surface border border-line rounded-card p-7 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-transparent transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
                <it.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-fg mb-2">{it.title}</h3>
              <p className="text-base text-fg-soft">{it.text}</p>
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
    <section id="pricing" className="py-24 md:py-26 bg-surface">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PlanCard
            planId="eleve_monthly"
            name={t("eleve_name")}
            price={t("eleve_price")}
            currency={t("eleve_currency")}
            period={t("per_month")}
            features={[t("eleve_f1"), t("eleve_f2"), t("eleve_f3"), t("eleve_f4")]}
            cta={t("eleve_cta")}
          />
          <PlanCard
            planId="famille_monthly"
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
            quoteHref="/ecole"
            name={t("ecole_name")}
            price={t("ecole_price")}
            currency=""
            period={t("ecole_period")}
            features={[
              t("ecole_f1"),
              t("ecole_f2"),
              t("ecole_f3"),
              t("ecole_f4"),
              t("ecole_f5"),
              t("ecole_f6"),
            ]}
            cta={t("ecole_cta")}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  planId,
  quoteHref,
  name,
  price,
  currency,
  period,
  features,
  cta,
  featured = false,
  badge,
}: {
  /** Standard plan: /checkout?plan=<id>. */
  planId?: string;
  /** Quote-request plan: links to a sales page (e.g. /ecole). */
  quoteHref?: string;
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
          ? "bg-navy text-white border-2 border-navy dark:border-gold"
          : "bg-surface border border-line text-fg hover:-translate-y-0.5"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 end-6 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full tracking-wider">
          {badge}
        </span>
      )}
      <div
        className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
          featured ? "text-white/70" : "text-fg-soft"
        }`}
      >
        {name}
      </div>
      <div className={`text-4xl font-bold leading-none mb-1 ${featured ? "text-white" : "text-fg"}`}>
        {/* bdi keeps multi-token numbers (e.g. "1 990") as a single LTR atom in RTL layout */}
        <bdi>{price}</bdi> <span className="text-base font-medium">{currency}</span>
      </div>
      <div className={`text-sm mb-7 ${featured ? "text-white/65" : "text-fg-soft"}`}>{period}</div>
      <ul className="flex-1 mb-7 space-y-2">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2.5 text-base ${featured ? "text-white" : "text-fg"}`}
          >
            <CheckIcon size={16} className="mt-1 flex-shrink-0 text-gold" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={
          quoteHref
            ? { pathname: quoteHref }
            : { pathname: "/checkout", query: { plan: planId ?? "eleve_monthly" } }
        }
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
    <section id="faq" className="py-24 md:py-26 bg-surface-2">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <div className="max-w-3xl mx-auto">
          {items.map((it, i) => (
            <details key={i} className="border-b border-line group">
              <summary className="flex justify-between items-center py-6 text-lg font-medium text-fg cursor-pointer list-none">
                <span>{it.q}</span>
                <PlusIcon
                  size={20}
                  className="text-fg-soft transition-transform group-open:rotate-45 group-open:text-gold flex-shrink-0 ms-4"
                />
              </summary>
              <p className="pb-6 text-fg-soft text-base leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== FINAL CTA =============== */
function FinalCTA({ auth }: { auth: AuthState }) {
  const t = useTranslations("CTA");
  const tNav = useTranslations("Nav");

  // Auth-aware messaging. Signed-in subscribers don't need to "start" — they
  // need a fast path to the practice space.
  const headline = auth.hasSub ? t("title_subscriber") : t("title");
  const subtitle = auth.hasSub ? t("subtitle_subscriber") : t("subtitle");

  return (
    <section className="accent-block py-24 md:py-26 text-center">
      <div className="container-x">
        <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white leading-tight mb-4">
          {headline}
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">{subtitle}</p>
        {auth.hasSub ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/eleve/pratique" className="btn btn-secondary btn-lg">
              🎯 {tNav("cta_practice")}
            </Link>
            <Link href="/petits" className="btn bg-white/10 text-white border-white/30 hover:bg-white/20 btn-lg">
              🦊 {tNav("cta_kids_universe")}
            </Link>
          </div>
        ) : auth.isAuthed ? (
          <Link href="/tarifs" className="btn btn-secondary btn-lg">
            {tNav("cta_discover_plans")}
          </Link>
        ) : (
          <Link href="/inscription" className="btn btn-secondary btn-lg">
            {t("button")}
          </Link>
        )}
      </div>
    </section>
  );
}

/* =============== FOOTER =============== */
function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-surface-2 pt-16 pb-8 border-t border-line">
      <div className="container-x">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <Logo height={36} />
            <p className="text-fg-soft text-sm mt-4 max-w-xs">{t("tagline")}</p>
          </div>
          <FooterCol title={t("product")}>
            <a href="#features">{t("product_features")}</a>
            <Link href="/tarifs">{t("product_pricing")}</Link>
            <Link href="/pour-les-parents">{t("product_parents")}</Link>
            <Link href="/faq">{t("product_faq")}</Link>
          </FooterCol>
          <FooterCol title={t("company")}>
            <Link href="/about">{t("company_about")}</Link>
            <Link href="/blog">{t("company_blog")}</Link>
            <Link href="/contact">{t("company_contact")}</Link>
          </FooterCol>
          <FooterCol title={t("legal")}>
            <Link href="/legal/conditions">{t("legal_terms")}</Link>
            <Link href="/legal/confidentialite">{t("legal_privacy")}</Link>
            <Link href="/legal/loi-18-07">{t("legal_loi")}</Link>
            <Link href="/legal/mentions">{t("legal_mentions")}</Link>
          </FooterCol>
        </div>
        <div className="border-t border-line pt-6 flex flex-wrap justify-between gap-3 text-xs text-fg-soft">
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
      <h4 className="text-xs font-semibold uppercase tracking-wider text-fg mb-4">{title}</h4>
      <ul className="space-y-1.5 [&_a]:text-sm [&_a]:text-fg-soft [&_a]:py-1.5 [&_a]:block hover:[&_a]:text-fg [&_a]:transition-colors">
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
      <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-fg leading-tight tracking-tight mb-3 mt-2">
        {title}
      </h2>
      {subtitle && <p className="text-fg-soft text-lg">{subtitle}</p>}
    </div>
  );
}
