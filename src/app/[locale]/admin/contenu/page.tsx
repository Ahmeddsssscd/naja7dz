import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Contenu — Najaح" };

export default async function ContentPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const [{ count: gradesCount }, { count: subjectsCount }, { count: chaptersCount }, { count: examsCount }] = await Promise.all([
    admin.from("grades").select("*", { count: "exact", head: true }),
    admin.from("subjects").select("*", { count: "exact", head: true }),
    admin.from("chapters").select("*", { count: "exact", head: true }),
    admin.from("exam_papers").select("*", { count: "exact", head: true }),
  ]);

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Contenu</h1>
      <p className="text-fg-soft mb-8">Curriculum, archive d&apos;examens, solutions IA.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Niveaux" value={gradesCount ?? 0} />
        <Stat label="Matières" value={subjectsCount ?? 0} />
        <Stat label="Chapitres" value={chaptersCount ?? 0} hint={chaptersCount === 0 ? "à créer" : ""} />
        <Stat label="Sujets d'examens" value={examsCount ?? 0} hint={examsCount === 0 ? "à uploader" : ""} />
      </div>

      <div className="bg-surface border border-line rounded-card p-12 text-center">
        <p className="text-fg-soft mb-2">Éditeur de curriculum + uploader d&apos;examens à venir.</p>
        <p className="text-xs text-fg-faint">
          Pour l&apos;instant, tu peux gérer le contenu directement dans la console Supabase.
        </p>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none mb-2">{value}</div>
      {hint && <div className="text-xs text-fg-faint">{hint}</div>}
    </div>
  );
}
