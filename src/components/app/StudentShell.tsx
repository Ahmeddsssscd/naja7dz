import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Mobile-first student shell — top bar with greeting, bottom tab bar.
 * Wraps any /eleve/* page.
 */
export function StudentShell({
  children,
  childName,
  childGrade,
  active = "home",
}: {
  children: React.ReactNode;
  childName?: string;
  childGrade?: string | null;
  active?: "home" | "subjects" | "tutor" | "progress" | "profile";
}) {
  const t = useTranslations("Student");
  const initials = (childName ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="bg-surface-2 min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-surface border-b border-line">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center">
              {initials}
            </span>
            <div>
              <div className="text-sm font-semibold text-fg leading-tight">
                {childName ?? t("default_name")}
              </div>
              <div className="text-xs text-fg-soft">{childGrade ?? "—"} · {t("streak_days", { days: 0 })}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LangSwitch />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-6">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-line z-40">
        <div className="max-w-md mx-auto grid grid-cols-5">
          <BottomLink href="/eleve" active={active === "home"} label={t("nav_home")} icon="home" />
          <BottomLink href="/eleve/matieres" active={active === "subjects"} label={t("nav_subjects")} icon="book" />
          <BottomLink href="/eleve/tuteur" active={active === "tutor"} label={t("nav_tutor")} icon="chat" />
          <BottomLink href="/eleve/progres" active={active === "progress"} label={t("nav_progress")} icon="chart" />
          <BottomLink href="/eleve/profil" active={active === "profile"} label={t("nav_profile")} icon="user" />
        </div>
      </nav>
    </div>
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

function BottomIcon({ name, active }: { name: string; active: boolean }) {
  const cls = `w-5 h-5 ${active ? "text-fg" : "text-fg-faint"}`;
  switch (name) {
    case "home":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "book":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "chat":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "chart":
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "user":
    default:
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  }
}
