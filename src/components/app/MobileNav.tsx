"use client";

/**
 * MobileNav — bottom-tab navigation for the parent zone on phones.
 *
 * Sidebar is hidden on mobile (`hidden lg:block`), which left parents with
 * no way to move between dashboard pages. This component renders a 5-tab
 * bottom bar mirroring the most-used sidebar links (home / kids / reports /
 * université / settings). Shows only on viewports below the `lg` breakpoint.
 *
 * Highlights the active tab from the `active` prop the page passes to
 * AppShell. Uses stroke-only icons (no emoji) consistent with the editorial
 * refactor of /pour-les-parents and /fac.
 */

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Props {
  active?: "home" | "children" | "reports" | "subscription" | "settings" | "catalogue" | "explain" | "fac";
}

export function MobileNav({ active }: Props) {
  const t = useTranslations("Shell");
  return (
    <nav className="dash-mobile-nav fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line lg:hidden">
      <div className="grid grid-cols-5">
        <Tab href="/parent" label={t("nav_home")} active={active === "home"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Tab>
        <Tab href="/parent/enfants" label={t("nav_children")} active={active === "children"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          </svg>
        </Tab>
        <Tab href="/parent/rapports" label={t("nav_reports")} active={active === "reports"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="20" x2="6" y2="16" />
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="3" y1="20" x2="21" y2="20" />
          </svg>
        </Tab>
        <Tab href="/fac" label={t("nav_fac")} active={active === "fac"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </Tab>
        <Tab href="/parent/parametres" label={t("nav_settings")} active={active === "settings"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Tab>
      </div>
    </nav>
  );
}

function Tab({ href, label, active, children }: { href: string; label: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href as never}
      className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition ${
        active ? "text-fg" : "text-fg-soft hover:text-fg"
      }`}
    >
      <span className={active ? "text-fg" : "text-fg-soft"}>{children}</span>
      <span className="truncate max-w-full px-1">{label}</span>
    </Link>
  );
}
