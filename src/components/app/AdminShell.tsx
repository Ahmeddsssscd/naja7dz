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
  active?: "overview" | "users" | "speeches" | "moderation" | "content" | "support" | "revenue";
  adminName?: string;
}) {
  const t = await getTranslations("Admin");
  const NAV = [
    { id: "overview", href: "/admin", label: t("nav_overview"), icon: "📊" },
    { id: "users", href: "/admin/utilisateurs", label: t("nav_users"), icon: "👥" },
    { id: "revenue", href: "/admin/revenus", label: t("nav_revenue"), icon: "💳" },
    { id: "content", href: "/admin/contenu", label: t("nav_content"), icon: "📚" },
    { id: "moderation", href: "/admin/moderation", label: t("nav_moderation"), icon: "🛡" },
    { id: "speeches", href: "/admin/discours", label: t("nav_speeches"), icon: "🎤" },
    { id: "support", href: "/admin/support", label: t("nav_support"), icon: "💬" },
  ];

  return (
    <div className="bg-surface-2 min-h-screen flex flex-col">
      <header className="bg-surface border-b border-line h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2"><Logo height={28} /></Link>
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

      <div className="flex-1 grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block bg-surface border-e border-line p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.href as never}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium mb-1 ${
                active === n.id ? "bg-navy text-white" : "text-fg-soft hover:text-fg hover:bg-surface-3"
              }`}
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </aside>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
