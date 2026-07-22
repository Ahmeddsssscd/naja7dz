import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/app/LogoutButton";
import { createServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("is_admin, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/parent");
  return { user, profile };
}

export async function AdminShell({
  children,
  active,
  adminName,
}: {
  children: React.ReactNode;
  active?: "overview" | "users" | "speeches" | "moderation" | "content" | "support" | "revenue" | "features" | "approvals" | "pricing" | "waitlist" | "professors";
  adminName?: string;
}) {
  const t = await getTranslations("Admin");
  // Grouped navigation — logical sections keep a growing panel scannable.
  const NAV_GROUPS: { title: string; items: { id: string; href: string; label: string; icon: string }[] }[] = [
    {
      title: "Pilotage",
      items: [{ id: "overview", href: "/admin", label: t("nav_overview"), icon: "grid" }],
    },
    {
      title: "Utilisateurs & revenus",
      items: [
        { id: "users", href: "/admin/utilisateurs", label: t("nav_users"), icon: "users" },
        { id: "revenue", href: "/admin/revenus", label: "Revenus & abonnements", icon: "chart" },
        { id: "waitlist", href: "/admin/liste-attente", label: "Liste d'attente", icon: "mail" },
      ],
    },
    {
      title: "Contenu pédagogique",
      items: [
        { id: "content", href: "/admin/contenu", label: t("nav_content"), icon: "book" },
        { id: "speeches", href: "/admin/discours", label: t("nav_speeches"), icon: "mic" },
      ],
    },
    {
      title: "Communauté",
      items: [
        { id: "professors", href: "/admin/professeurs", label: "Professeurs", icon: "cap" },
        { id: "approvals", href: "/admin/approvals", label: "Approbations", icon: "check" },
        { id: "moderation", href: "/admin/moderation", label: t("nav_moderation"), icon: "shield" },
        { id: "support", href: "/admin/support", label: t("nav_support"), icon: "chat" },
      ],
    },
    {
      title: "Réglages",
      items: [
        { id: "pricing", href: "/admin/tarifs", label: "Tarifs", icon: "tag" },
        { id: "features", href: "/admin/fonctionnalites", label: "Fonctionnalités", icon: "toggle" },
      ],
    },
  ];
  const flatNav = NAV_GROUPS.flatMap((g) => g.items);

  return (
    <div className="bg-surface-2 min-h-screen flex flex-col">
      <header className="bg-surface border-b border-line h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Najaح — accueil"><Logo height={28} /></Link>
          <span className="hidden md:inline-flex text-xs px-2 py-1 rounded-full bg-red-500 text-white font-bold uppercase tracking-wider">{t("badge")}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LangSwitch />
          {adminName && (
            <span className="hidden md:inline text-sm text-fg ms-2">{adminName}</span>
          )}
          <LogoutButton />
        </div>
      </header>

      {/* Mobile horizontal nav — the sidebar is desktop-only, so without this
          admins on phones have no way to move between sections. */}
      <nav className="lg:hidden bg-surface border-b border-line overflow-x-auto scrollbar-hide sticky top-16 z-30">
        <div className="flex gap-1 px-3 py-2 w-max">
          {flatNav.map((n) => (
            <Link
              key={n.id}
              href={n.href as never}
              className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                active === n.id ? "bg-navy text-white" : "bg-surface-2 text-fg-soft border border-line"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-[248px_1fr]">
        <aside className="hidden lg:block bg-surface border-e border-line p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-5">
              <div className="text-[10px] font-bold text-fg-faint uppercase tracking-wider px-3 mb-1.5">
                {group.title}
              </div>
              {group.items.map((n) => (
                <Link
                  key={n.id}
                  href={n.href as never}
                  className={`flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium mb-0.5 ${
                    active === n.id ? "bg-navy text-white" : "text-fg-soft hover:text-fg hover:bg-surface-3"
                  }`}
                >
                  <span className={active === n.id ? "text-gold" : "text-fg-faint"}>
                    <AdminNavIcon name={n.icon} />
                  </span>
                  {n.label}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

function AdminNavIcon({ name }: { name: string }) {
  const c = "w-4 h-4";
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "grid": return <svg className={c} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "users": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>;
    case "chart": return <svg className={c} viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "mail": return <svg className={c} viewBox="0 0 24 24" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>;
    case "book": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "mic": return <svg className={c} viewBox="0 0 24 24" {...p}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg>;
    case "cap": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/></svg>;
    case "check": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case "shield": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "chat": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "tag": return <svg className={c} viewBox="0 0 24 24" {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "toggle": return <svg className={c} viewBox="0 0 24 24" {...p}><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3"/></svg>;
    default: return <svg className={c} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
