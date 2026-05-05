import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Espace parent — Najaح" };

export default async function ParentHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Read parent profile + children
  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from("parent_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("*").eq("parent_id", user.id).order("created_at"),
  ]);

  // First-time visitor → onboarding
  if (!profile?.onboarded || !children?.length) {
    redirect("/parent/bienvenue");
  }

  const childList = children ?? [];
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <AppShell active="home" parentName={profile?.full_name ?? ""}>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-1">Bonjour {firstName} 👋</h1>
          <p className="text-fg-soft">Voici un résumé de la semaine de tes enfants.</p>
        </div>

        {/* KPI cards (mocked numbers — populated by activity once kids start using the app) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Kpi label="Temps d'étude" value="0h 00m" hint="cette semaine" />
          <Kpi label="Quiz complétés" value="0" hint="cette semaine" />
          <Kpi label="Note moyenne" value="—" hint="—" />
          <Kpi label="Série en cours" value="0j" hint="commence aujourd'hui" />
        </div>

        {/* Insight card */}
        <div className="bg-navy text-white rounded-card p-6 md:p-8 mb-8 relative overflow-hidden">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">Cette semaine</span>
          <h3 className="text-xl md:text-2xl font-bold mt-2 mb-3">
            Ton enfant n&apos;a pas encore commencé. Lance la première session.
          </h3>
          <p className="text-white/70 text-sm md:text-base max-w-prose">
            Donne à ton enfant ses identifiants (créés depuis sa fiche) et fais-lui découvrir
            la plateforme. Au bout de 5–10 minutes d&apos;activité, des recommandations
            personnalisées apparaissent ici.
          </p>
        </div>

        {/* Children */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-fg">Mes enfants</h2>
          <Link href="/parent/enfants/nouveau" className="text-sm text-fg-soft hover:text-fg">
            + Ajouter un enfant
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {childList.map((c) => (
            <ChildCard key={c.id} child={c} />
          ))}
        </div>

        {/* Activity placeholder */}
        <h2 className="text-lg font-semibold text-fg mb-4">Activité récente</h2>
        <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft">
          Pas encore d&apos;activité. Une fois que tes enfants commencent, leurs progrès
          apparaissent ici en temps réel.
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none mb-2">{value}</div>
      <div className="text-xs text-fg-faint">{hint}</div>
    </div>
  );
}

interface ChildRow {
  id: string;
  full_name: string;
  age?: number | null;
  grade?: string | null;
  filiere?: string | null;
}

function ChildCard({ child }: { child: ChildRow }) {
  const initials = child.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <Link
      href={{ pathname: "/parent/enfants/[id]", params: { id: child.id } } as never}
      className="bg-surface border border-line rounded-card p-6 hover:shadow-card-hover hover:border-transparent transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="w-14 h-14 rounded-full bg-pale-blue text-navy text-xl font-bold flex items-center justify-center">
          {initials}
        </span>
        <div>
          <h3 className="font-semibold text-fg">{child.full_name}</h3>
          <p className="text-xs text-fg-soft">
            {child.age ? `${child.age} ans` : ""} · {child.grade ?? "—"}
          </p>
        </div>
      </div>
      <div className="text-sm text-fg-soft">Voir le profil →</div>
    </Link>
  );
}
