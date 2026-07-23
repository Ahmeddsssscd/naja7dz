import { PageShell } from "@/components/landing/PageShell";
import { createServerClient } from "@/lib/supabase/server";
import { ProfessorsDirectory, type Professor } from "@/components/app/ProfessorsDirectory";

export const metadata = {
  title: "Professeurs BAC — partout en Algérie",
  description: "Trouve un professeur pour préparer le BAC : par matière, par wilaya, en présentiel ou en ligne. Réserve en quelques clics.",
};

export default async function ProfessorsPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("professors")
    .select("id, full_name, subject, wilaya, teaches_at, mode, teaching_types, bio, hourly_rate_dzd, verified")
    .eq("active", true)
    .order("sort_order");

  return (
    <PageShell active="bac">
      <section className="bg-surface-2 py-16 md:py-20 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">BAC · Professeurs</span>
          <h1 className="text-[clamp(30px,5vw,46px)] font-bold tracking-tight text-fg mb-4 leading-tight">
            Un professeur pour réussir ton BAC
          </h1>
          <p className="text-lg text-fg-soft">
            Des enseignants partout en Algérie — en présentiel ou en ligne.
            Filtre par matière et par wilaya, puis réserve directement.
          </p>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="container-x max-w-5xl">
          <ProfessorsDirectory professors={(data ?? []) as Professor[]} />
        </div>
      </section>
    </PageShell>
  );
}
