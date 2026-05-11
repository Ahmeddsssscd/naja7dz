/**
 * /admin/approvals — unified queue for items waiting on admin review.
 *
 * Two sections side by side: pending helper_profiles (marketplace) and
 * pending teacher_profiles (réseau). Each row has Approve / Reject
 * buttons that POST to /api/admin/approvals.
 */
import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { ApprovalActions } from "@/components/app/admin/ApprovalActions";

export const metadata = { title: "Admin · Approbations" };

export default async function AdminApprovalsPage() {
  void getTranslations; // reserved for future i18n; admin keeps internal copy for now
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const [{ data: helpers }, { data: teachers }] = await Promise.all([
    admin
      .from("helper_profiles")
      .select("id, user_id, display_name, last_initial, helper_type, university_slug, study_year, field, profession, experience_years, services, bio, created_at, status")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("teacher_profiles")
      .select("user_id, full_name, school_name, wilaya, bio, bio_public, subjects, grades_taught, created_at, status, is_public")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const helpersCount = helpers?.length ?? 0;
  const teachersCount = teachers?.length ?? 0;

  return (
    <AdminShell active="approvals" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Approbations</h1>
      <p className="text-fg-soft mb-8">
        Profils en attente de validation. {helpersCount + teachersCount} au total.
      </p>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Helpers queue */}
        <section className="bg-surface border border-line rounded-card p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
            <h2 className="font-semibold text-fg">Marketplace — Helpers</h2>
            <span className="text-xs font-mono bg-surface-3 text-fg px-2 py-1 rounded-full">{helpersCount}</span>
          </div>
          {helpers && helpers.length > 0 ? (
            <div className="space-y-3">
              {helpers.map((h) => (
                <HelperRow key={h.id} h={h} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-soft text-center py-8">Aucune demande en attente.</p>
          )}
        </section>

        {/* Teachers queue */}
        <section className="bg-surface border border-line rounded-card p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
            <h2 className="font-semibold text-fg">Réseau enseignants</h2>
            <span className="text-xs font-mono bg-surface-3 text-fg px-2 py-1 rounded-full">{teachersCount}</span>
          </div>
          {teachers && teachers.length > 0 ? (
            <div className="space-y-3">
              {teachers.map((p) => (
                <TeacherRow key={p.user_id} p={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-soft text-center py-8">Aucune demande en attente.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function HelperRow({ h }: { h: any }) {
  const safeName = `${h.display_name.split(" ")[0]} ${h.last_initial?.toUpperCase() ?? ""}`;
  return (
    <div className="border border-line rounded-btn p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-semibold text-fg text-sm">{safeName}</div>
          <div className="text-xs text-fg-soft">
            {h.helper_type === "student"
              ? `${h.university_slug?.toUpperCase()} · ${h.field ?? "?"} · ${h.study_year ?? "?"}e année`
              : `${h.profession ?? "?"} · ${h.experience_years ?? 0} ans d'expérience`}
          </div>
        </div>
        <span className="text-[10px] text-fg-faint font-mono">{new Date(h.created_at).toLocaleDateString()}</span>
      </div>
      {h.bio && <p className="text-xs text-fg leading-relaxed mb-2 line-clamp-3">{h.bio}</p>}
      <div className="flex flex-wrap gap-1 mb-3">
        {(h.services ?? []).map((s: string) => (
          <span key={s} className="text-[10px] bg-surface-3 text-fg px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <ApprovalActions kind="helper" id={h.id} />
    </div>
  );
}

function TeacherRow({ p }: { p: any }) {
  return (
    <div className="border border-line rounded-btn p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-semibold text-fg text-sm">{p.full_name}</div>
          <div className="text-xs text-fg-soft">
            {p.school_name ?? "—"} · {p.wilaya ?? "—"}
          </div>
        </div>
        <span className="text-[10px] text-fg-faint font-mono">{new Date(p.created_at).toLocaleDateString()}</span>
      </div>
      {(p.bio_public || p.bio) && (
        <p className="text-xs text-fg leading-relaxed mb-2 line-clamp-3">{p.bio_public || p.bio}</p>
      )}
      <div className="flex flex-wrap gap-1 mb-3">
        {(p.subjects ?? []).map((s: string) => (
          <span key={s} className="text-[10px] bg-surface-3 text-fg px-2 py-0.5 rounded-full">{s}</span>
        ))}
        {(p.grades_taught ?? []).map((g: string) => (
          <span key={g} className="text-[10px] bg-gold/15 text-fg px-2 py-0.5 rounded-full">{g}</span>
        ))}
      </div>
      <ApprovalActions kind="teacher" id={p.user_id} />
    </div>
  );
}
