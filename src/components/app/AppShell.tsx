import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/app/LogoutButton";

/**
 * Authenticated parent zone shell.
 * - Top bar (logo, search, notifications, avatar)
 * - Left sidebar with role-aware nav
 */
export function AppShell({
  children,
  active,
  parentName,
}: {
  children: React.ReactNode;
  active?: "home" | "children" | "reports" | "subscription" | "settings";
  parentName?: string;
}) {
  const t = useTranslations("Shell");
  return (
    <div className="dash-grid bg-surface-2 min-h-screen">
      {/* TOP */}
      <header className="dash-top bg-surface border-b border-line h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <Link href="/" className="flex items-center" aria-label="Najaح — accueil"><Logo height={32} /></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LangSwitch />
          {parentName && (
            <div className="hidden md:flex items-center gap-2 ms-2 ps-3 border-s border-line">
              <span className="w-9 h-9 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center">
                {parentName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <span className="text-sm text-fg font-medium">{parentName}</span>
            </div>
          )}
          <LogoutButton />
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="dash-side bg-surface border-e border-line p-4 hidden lg:block">
        <SideLink href="/parent" active={active === "home"} icon="home">{t("nav_home")}</SideLink>
        <SideLink href="/parent/enfants" active={active === "children"} icon="children">{t("nav_children")}</SideLink>
        <SideLink href="/parent/rapports" active={active === "reports"} icon="report">{t("nav_reports")}</SideLink>
        <SideLink href="/parent/abonnement" active={active === "subscription"} icon="card">{t("nav_subscription")}</SideLink>
        <div className="text-xs font-semibold text-fg-faint uppercase tracking-wider px-3 mt-6 mb-2">{t("nav_tools")}</div>
        <SideLink href="/parent/parametres" active={active === "settings"} icon="settings">{t("nav_settings")}</SideLink>
        <SideLink href="/contact" icon="help">{t("nav_help")}</SideLink>
      </aside>

      {/* MAIN */}
      <main className="dash-main p-6 md:p-10">{children}</main>

      <style>{`
        .dash-grid {
          display: grid;
          grid-template-rows: 64px 1fr;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .dash-grid {
            grid-template-columns: 240px 1fr;
            grid-template-rows: 64px 1fr;
          }
          .dash-top { grid-column: 1 / -1; }
          .dash-side {
            grid-row: 2;
            position: sticky;
            top: 64px;
            height: calc(100vh - 64px);
            overflow-y: auto;
          }
          .dash-main { grid-column: 2; }
        }
      `}</style>
    </div>
  );
}

function SideLink({
  href,
  active,
  children,
  icon,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  icon: string;
}) {
  return (
    <Link
      href={href as never}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium mb-1 transition-colors ${
        active ? "bg-navy text-white" : "text-fg-soft hover:text-fg hover:bg-surface-3"
      }`}
    >
      <SideIcon name={icon} active={!!active} />
      {children}
    </Link>
  );
}

function SideIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 ${active ? "text-gold" : "text-fg-faint"}`;
  const stroke = "currentColor";
  switch (name) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      );
    case "children":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      );
    case "report":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      );
    case "card":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      );
    case "settings":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      );
    case "help":
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      );
  }
}
