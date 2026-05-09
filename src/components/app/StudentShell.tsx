import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/app/LogoutButton";

/**
 * Responsive student shell.
 *
 * Mobile (< lg): top bar with avatar + bottom tab navigation (5 icons).
 * Desktop (≥ lg): top bar with logo, left sidebar with labelled nav,
 *   wider main content. The mobile bottom nav is hidden so the page
 *   doesn't look like a phone in the middle of a desktop screen.
 */
export function StudentShell({
  children,
  childName,
  childGrade,
  childStreak = 0,
  active = "home",
}: {
  children: React.ReactNode;
  childName?: string;
  childGrade?: string | null;
  /** Daily streak count to surface in the top bar. 0 hides the flame. */
  childStreak?: number;
  active?: "home" | "subjects" | "practice" | "progress" | "profile";
}) {
  const t = useTranslations("Student");
  const initials = (childName ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="student-grid bg-surface-2 min-h-screen pb-24 lg:pb-0">
      {/* TOP BAR */}
      <header className="student-top sticky top-0 z-40 bg-surface border-b border-line">
        <div className="h-16 flex items-center justify-between px-5 lg:px-6 max-w-md lg:max-w-none mx-auto lg:mx-0">
          {/* Mobile: avatar + name. Desktop: logo + child pill. */}
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden lg:flex items-center" aria-label="Najaح — accueil">
              <Logo height={32} />
            </Link>
            <span className="lg:hidden w-9 h-9 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center">
              {initials}
            </span>
            <div className="lg:hidden">
              <div className="text-sm font-semibold text-fg leading-tight">
                {childName ?? t("default_name")}
              </div>
              <div className="text-xs text-fg-soft">
                {childGrade ?? "—"} · {t("streak_days", { days: childStreak })}
              </div>
            </div>
            {/* Desktop child pill — sits next to logo */}
            <div className="hidden lg:flex items-center gap-2 ms-4 ps-4 border-s border-line">
              <span className="w-9 h-9 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center">
                {initials}
              </span>
              <div>
                <div className="text-sm font-semibold text-fg leading-tight">
                  {childName ?? t("default_name")}
                </div>
                <div className="text-xs text-fg-soft">
                  {childGrade ?? "—"} · {t("streak_days", { days: childStreak })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <ThemeToggle />
            <LangSwitch />
            <div className="hidden lg:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="student-side bg-surface border-e border-line p-4 hidden lg:block">
        <SideLink href="/eleve" active={active === "home"} icon="home">{t("nav_home")}</SideLink>
        <SideLink href="/eleve/matieres" active={active === "subjects"} icon="book">{t("nav_subjects")}</SideLink>
        <SideLink href="/eleve/pratique" active={active === "practice"} icon="target">{t("nav_practice")}</SideLink>
        <SideLink href="/eleve/progres" active={active === "progress"} icon="chart">{t("nav_progress")}</SideLink>
        <SideLink href="/eleve/profil" active={active === "profile"} icon="user">{t("nav_profile")}</SideLink>
      </aside>

      {/* MAIN — narrow column on mobile, comfortable reading width on desktop.
          Pages can opt into a wider layout (e.g. max-w-6xl) by wrapping their
          own content. */}
      <main className="student-main">
        <div className="max-w-md lg:max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-line z-40 lg:hidden">
        <div className="max-w-md mx-auto grid grid-cols-5">
          <BottomLink href="/eleve" active={active === "home"} label={t("nav_home")} icon="home" />
          <BottomLink href="/eleve/matieres" active={active === "subjects"} label={t("nav_subjects")} icon="book" />
          <BottomLink href="/eleve/pratique" active={active === "practice"} label={t("nav_practice")} icon="target" />
          <BottomLink href="/eleve/progres" active={active === "progress"} label={t("nav_progress")} icon="chart" />
          <BottomLink href="/eleve/profil" active={active === "profile"} label={t("nav_profile")} icon="user" />
        </div>
      </nav>

      <style>{`
        .student-grid {
          display: grid;
          grid-template-rows: 64px 1fr;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .student-grid {
            grid-template-columns: 240px 1fr;
            grid-template-rows: 64px 1fr;
          }
          .student-top { grid-column: 1 / -1; }
          .student-side {
            grid-row: 2;
            position: sticky;
            top: 64px;
            height: calc(100vh - 64px);
            overflow-y: auto;
          }
          .student-main { grid-column: 2; }
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

function BottomLink({
  href, active, label, icon,
}: { href: string; active: boolean; label: string; icon: string }) {
  return (
    <Link href={href as never} className="flex flex-col items-center gap-1 py-3">
      <BottomIcon name={icon} active={active} />
      <span className={`text-[11px] font-medium ${active ? "text-fg" : "text-fg-faint"}`}>
        {label}
      </span>
    </Link>
  );
}

function SideIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 ${active ? "text-gold" : "text-fg-faint"}`;
  return <Icon name={name} className={cls} />;
}

function BottomIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 ${active ? "text-fg" : "text-fg-faint"}`;
  return <Icon name={name} className={cls} />;
}

function Icon({ name, className }: { name: string; className: string }) {
  switch (name) {
    case "home":
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "book":
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "chat":
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "target":
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "chart":
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "user":
    default:
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  }
}
