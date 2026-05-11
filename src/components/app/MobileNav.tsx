"use client";

/**
 * MobileNav — bottom-tab navigation for the parent zone on phones.
 *
 * Sidebar is hidden on mobile (`hidden lg:block`), so this bottom bar gives
 * parents access to all dashboard pages. The 4 primary tabs cover the most
 * common actions; a "More" button opens a slide-up sheet with the secondary
 * items (reports, subscription, fac, settings, help).
 *
 * Primary tabs: Home · Children · Catalogue · Explain
 * More sheet:   Reports · Subscription · Université · Settings · Help
 */

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Props {
  active?: "home" | "children" | "reports" | "subscription" | "settings" | "catalogue" | "explain" | "fac";
}

export function MobileNav({ active }: Props) {
  const t = useTranslations("Shell");
  const [moreOpen, setMoreOpen] = useState(false);

  // Tabs that belong in the "More" sheet
  const moreActive = active === "reports" || active === "subscription" || active === "fac" || active === "settings";

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="dash-mobile-nav fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-line lg:hidden">
        <div className="grid grid-cols-5">
          {/* Home */}
          <Tab href="/parent" label={t("nav_home")} active={active === "home"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Tab>

          {/* Children */}
          <Tab href="/parent/enfants" label={t("nav_children")} active={active === "children"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </Tab>

          {/* Catalogue */}
          <Tab href="/parent/catalogue" label={t("nav_catalogue")} active={active === "catalogue"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </Tab>

          {/* Explain (AI) */}
          <Tab href="/parent/expliquer" label={t("nav_explain")} active={active === "explain"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.5 1 2.3v1h6v-1c0-.8.3-1.7 1-2.3A7 7 0 0 0 12 2z" />
            </svg>
          </Tab>

          {/* More — opens slide-up sheet */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition w-full ${
              moreActive ? "text-fg" : "text-fg-soft hover:text-fg"
            }`}
            aria-label={t("nav_more")}
          >
            <span className={`relative ${moreActive ? "text-fg" : "text-fg-soft"}`}>
              {moreActive && (
                <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-gold" />
              )}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </span>
            <span className="truncate max-w-full px-1">{t("nav_more")}</span>
          </button>
        </div>
      </nav>

      {/* More sheet — slide-up overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMoreOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 inset-x-0 bg-surface rounded-t-2xl border-t border-line pb-safe-area-inset-bottom"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-line" />
            </div>

            <div className="px-4 py-2 grid grid-cols-3 gap-2">
              <SheetLink href="/parent/rapports" label={t("nav_reports")} active={active === "reports"} onClick={() => setMoreOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="20" x2="6" y2="16" /><line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" /><line x1="3" y1="20" x2="21" y2="20" />
                </svg>
              </SheetLink>

              <SheetLink href="/parent/abonnement" label={t("nav_subscription")} active={active === "subscription"} onClick={() => setMoreOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </SheetLink>

              <SheetLink href="/fac" label={t("nav_fac")} active={active === "fac"} onClick={() => setMoreOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10L12 4 2 10l10 6 10-6z" /><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
                </svg>
              </SheetLink>

              <SheetLink href="/parent/parametres" label={t("nav_settings")} active={active === "settings"} onClick={() => setMoreOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </SheetLink>

              <SheetLink href="/support" label={t("nav_help")} active={false} onClick={() => setMoreOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </SheetLink>
            </div>

            <div className="pb-6" />
          </div>
        </div>
      )}
    </>
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

function SheetLink({
  href, label, active, onClick, children
}: {
  href: string; label: string; active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <Link
      href={href as never}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold transition ${
        active
          ? "bg-navy text-white"
          : "bg-surface-2 text-fg-soft hover:bg-surface-3 hover:text-fg"
      }`}
    >
      {children}
      <span className="text-center leading-tight">{label}</span>
    </Link>
  );
}
