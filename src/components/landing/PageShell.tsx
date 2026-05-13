"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";

/**
 * Reusable shell for non-landing public pages: nav + footer + light wrapper.
 * Same look as the landing nav, but with active-state highlighting on the
 * current page link.
 */
export function PageShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "tarifs" | "parents" | "faq" | "contact" | "fac" | "teacher" | "bac";
}) {
  const t = useTranslations("Nav");
  const f = useTranslations("Footer");

  const navLinkClass = (key: typeof active) =>
    `transition-colors ${
      active === key ? "text-fg" : "text-fg-soft hover:text-fg"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-nav border-b border-line">
        <div className="container-x flex items-center justify-between h-20 py-3">
          <Link href="/" aria-label="Najaح" className="flex-shrink-0">
            <Logo variant="combined" height={26} priority />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ms-12">
            <Link href="/tarifs" className={navLinkClass("tarifs")}>
              {t("pricing")}
            </Link>
            <Link href="/pour-les-parents" className={navLinkClass("parents")}>
              {t("parents")}
            </Link>
            <Link href="/bac" className={navLinkClass("bac")}>
              BAC
            </Link>
            <Link href="/fac" className={navLinkClass("fac")}>
              {t("fac")}
            </Link>
            <Link href="/enseignant" className={navLinkClass("teacher")}>
              {t("teacher")}
            </Link>
            <Link href="/faq" className={navLinkClass("faq")}>
              {t("faq")}
            </Link>
            <Link href="/contact" className={navLinkClass("contact")}>
              {t("contact")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangSwitch />
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
                { href: "/bac", label: "BAC" },
                { href: "/fac", label: t("fac") },
                { href: "/enseignant", label: t("teacher") },
                { href: "/faq", label: t("faq") },
                { href: "/contact", label: t("contact") },
                { href: "/connexion", label: t("login") },
              ]}
              ctaLabel={t("start")}
            />
          </div>
        </div>
      </header>

      <main className="bg-surface min-h-screen">{children}</main>

      <footer className="bg-surface-2 pt-16 pb-8 border-t border-line">
        <div className="container-x">
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
            <div>
              <Logo variant="combined" height={26} />
              <p className="text-fg-soft text-sm mt-4 max-w-xs">{f("tagline")}</p>
            </div>
            <FooterCol title={f("product")}>
              <Link href="/tarifs">{f("product_pricing")}</Link>
              <Link href="/pour-les-parents">{f("product_parents")}</Link>
              <Link href="/faq">{f("product_faq")}</Link>
            </FooterCol>
            <FooterCol title={f("company")}>
              <Link href="/about">{f("company_about")}</Link>
              <Link href="/blog">{f("company_blog")}</Link>
              <Link href="/contact">{f("company_contact")}</Link>
            </FooterCol>
            <FooterCol title={f("legal")}>
              <Link href="/legal/conditions">{f("legal_terms")}</Link>
              <Link href="/legal/confidentialite">{f("legal_privacy")}</Link>
              <Link href="/legal/loi-18-07">{f("legal_loi")}</Link>
              <Link href="/legal/mentions">{f("legal_mentions")}</Link>
            </FooterCol>
          </div>
          <div className="border-t border-line pt-6 flex flex-wrap justify-between gap-3 text-xs text-fg-soft">
            <span>{f("rights")}</span>
            <span>{f("made_in")}</span>
          </div>
        </div>
      </footer>
    </>
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
