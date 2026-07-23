import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/app/LogoutButton";

/**
 * PRO teacher workspace chrome. A distinct, focused shell — logo + "PRO"
 * badge, and only the sections a teacher needs (no parent/public links).
 * Used across /enseignant/* once a teacher is signed in.
 */
export function TeacherShell({
  children,
  active,
  teacherName,
}: {
  children: React.ReactNode;
  active?: "dashboard" | "exercices" | "communaute" | "messages" | "reseau";
  teacherName?: string;
}) {
  const NAV: { id: string; href: string; label: string }[] = [
    { id: "dashboard", href: "/enseignant/dashboard", label: "Tableau de bord" },
    { id: "exercices", href: "/enseignant/exercices", label: "Exercices" },
    { id: "communaute", href: "/enseignant/communaute", label: "Communauté" },
    { id: "messages", href: "/enseignant/messages", label: "Messages" },
    { id: "reseau", href: "/enseignant/reseau", label: "Réseau" },
  ];

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="container-x flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Link href="/enseignant/dashboard" aria-label="Najaح — espace enseignant" className="flex-shrink-0">
              <Logo variant="wordmark" height={24} />
            </Link>
            <span className="text-[10px] font-bold bg-gold text-navy rounded px-1.5 py-0.5 tracking-wide">PRO</span>
          </div>

          {/* Desktop nav — teacher sections only */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV.map((n) => (
              <Link
                key={n.id}
                href={n.href as never}
                className={`transition-colors ${active === n.id ? "text-fg" : "text-fg-soft hover:text-fg"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangSwitch />
            {teacherName && <span className="hidden md:inline text-sm text-fg ms-2 max-w-[140px] truncate">{teacherName}</span>}
            <LogoutButton />
          </div>
        </div>

        {/* Mobile nav — horizontal scroll */}
        <nav className="md:hidden border-t border-line overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-3 py-2 w-max">
            {NAV.map((n) => (
              <Link
                key={n.id}
                href={n.href as never}
                className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  active === n.id ? "bg-navy text-white dark:bg-gold dark:text-navy" : "bg-surface-2 text-fg-soft border border-line"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
