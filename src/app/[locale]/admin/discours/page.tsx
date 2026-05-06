import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { SpeechModerationActions } from "@/components/app/SpeechModerationActions";

export const metadata = { title: "Admin · Discours motivants" };

export default async function AdminSpeeches() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const { data: speeches } = await admin
    .from("motivational_speeches")
    .select("id, content, author_name, author_wilaya, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="speeches" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Discours motivants</h1>
      <p className="text-fg-soft mb-8">
        File d&apos;attente — chaque discours doit être approuvé avant d&apos;apparaître sous le compte à rebours du Bac.
      </p>

      <div className="space-y-4">
        {(speeches ?? []).map((s) => (
          <div key={s.id} className="bg-surface border border-line rounded-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold font-semibold">
                  {s.author_name ?? "Anonyme"}{s.author_wilaya ? ` · ${s.author_wilaya}` : ""}
                </div>
                <div className="text-xs text-fg-faint">
                  Soumis le {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-900">
                En attente
              </span>
            </div>
            <p className="text-fg italic mb-5 leading-relaxed">« {s.content} »</p>
            <SpeechModerationActions id={s.id} />
          </div>
        ))}
      </div>

      {(!speeches || speeches.length === 0) && (
        <div className="bg-surface border border-line rounded-card p-12 text-center">
          <p className="text-fg-soft mb-2">Pas de discours en attente.</p>
          <p className="text-xs text-fg-faint">
            Quand un élève soumet un discours via le compte à rebours Bac, il apparaîtra ici.
          </p>
        </div>
      )}
    </AdminShell>
  );
}
