import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Profil enfant" };

const SUBJECT_DEMO = [
  { name: "Mathématiques", score: 0 },
  { name: "Physique", score: 0 },
  { name: "Arabe", score: 0 },
  { name: "Français", score: 0 },
];

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase.from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("*").eq("id", id).eq("parent_id", user.id).maybeSingle(),
  ]);

  if (!child) notFound();

  return (
    <AppShell active="children" parentName={profile?.full_name ?? ""}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <span className="w-20 h-20 rounded-full bg-pale-blue dark:bg-surface-3 text-navy dark:text-cream text-3xl font-bold flex items-center justify-center">
            {child.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </span>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-fg">{child.full_name}</h1>
            <p className="text-fg-soft">
              {child.age ? `${child.age} ans` : ""} · Classe {child.grade ?? "—"}
            </p>
          </div>
          <Link
            href={{ pathname: "/parent/enfants/[id]/controles", params: { id: child.id } } as never}
            className="btn btn-outline btn-sm"
          >
            Contrôle parental
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Kpi label="Temps d'étude" value="0h" />
          <Kpi label="Quiz complétés" value="0" />
          <Kpi label="Note moyenne" value="—" />
        </div>

        {/* Subjects */}
        <h2 className="text-lg font-semibold text-fg mb-4">Performance par matière</h2>
        <div className="bg-surface border border-line rounded-card p-6 mb-8">
          <ul className="space-y-4">
            {SUBJECT_DEMO.map((s) => (
              <li key={s.name} className="flex items-center gap-3">
                <span className="w-32 text-sm text-fg">{s.name}</span>
                <div className="flex-1 h-2 bg-pale-blue rounded">
                  <div className="h-full bg-navy rounded" style={{ width: `${s.score}%` }} />
                </div>
                <span className="w-12 text-end text-sm font-medium text-fg-soft">{s.score}%</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-fg-faint mt-4">
            Les performances apparaîtront dès que ton enfant aura complété ses premiers exercices.
          </p>
        </div>

        {/* Recommendations */}
        <h2 className="text-lg font-semibold text-fg mb-4">Recommandations</h2>
        <div className="accent-block rounded-card p-6">
          <p className="text-white/80">
            Aucune recommandation personnalisée pour le moment. Une fois que ton enfant
            aura complété quelques exercices, des suggestions ciblées apparaîtront ici.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none">{value}</div>
    </div>
  );
}
