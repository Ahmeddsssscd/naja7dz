import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { FeatureFlagsAdmin, type FlagRow } from "@/components/app/FeatureFlagsAdmin";

export const metadata = { title: "Admin · Fonctionnalités" };

export default async function FeatureFlagsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("feature_flags")
    .select("key, enabled, label_fr, description_fr, group_name, sort_order")
    .order("group_name")
    .order("sort_order");

  return (
    <AdminShell adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Fonctionnalités</h1>
      <p className="text-fg-soft mb-8">
        Active ou désactive les fonctionnalités. Les changements prennent effet immédiatement.
      </p>

      {(!rows || rows.length === 0) ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-6 text-sm">
          La table <code>feature_flags</code> n&apos;est pas encore créée. Applique la migration
          <code className="ms-1">database/migrations/20260507_006_quiz_questions_and_flags.sql</code>{" "}
          dans le SQL Editor de Supabase.
        </div>
      ) : (
        <FeatureFlagsAdmin initial={(rows ?? []) as FlagRow[]} />
      )}
    </AdminShell>
  );
}
