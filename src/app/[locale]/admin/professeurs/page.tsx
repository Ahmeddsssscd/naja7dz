import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { ProfessorsAdmin, type ProfessorRow } from "@/components/app/ProfessorsAdmin";

export const metadata = { title: "Admin · Professeurs" };

export default async function AdminProfessorsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const [{ data: professors }, { data: bookings }] = await Promise.all([
    admin
      .from("professors")
      .select("id, full_name, subject, wilaya, teaches_at, mode, bio, hourly_rate_dzd, verified, active, sort_order")
      .order("sort_order"),
    admin
      .from("booking_requests")
      .select("id, professor_id, student_name, grade, preferred_mode, phone, message, status, created_at, professors(full_name)")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-DZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const profName = (b: { professors?: unknown }) => {
    const p = b.professors as { full_name?: string } | { full_name?: string }[] | null;
    return Array.isArray(p) ? p[0]?.full_name : p?.full_name;
  };

  return (
    <AdminShell active="professors" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Professeurs</h1>
      <p className="text-fg-soft mb-8">
        Gère l&apos;annuaire des professeurs affiché sur <code className="text-xs">/bac/professeurs</code>.
        Le badge « vérifié » signale les enseignants validés par l&apos;équipe.
      </p>

      <ProfessorsAdmin initialRows={(professors ?? []) as ProfessorRow[]} />

      {/* Booking requests */}
      <h2 className="text-xl font-bold text-fg mt-12 mb-4">
        Demandes de réservation
        {bookings && bookings.length > 0 && (
          <span className="ms-2 text-sm font-normal text-fg-soft">({bookings.length})</span>
        )}
      </h2>
      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/50">
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Professeur</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Élève</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Niveau</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Téléphone</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Statut</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {(bookings ?? []).map((b) => (
              <tr key={b.id} className="border-b last:border-b-0 border-line">
                <td className="p-4 text-fg">{profName(b) ?? "—"}</td>
                <td className="p-4 text-fg-soft">{b.student_name ?? "—"}</td>
                <td className="p-4 text-fg-soft">{b.grade ?? "—"}</td>
                <td className="p-4 text-fg-soft" dir="ltr">{b.phone ?? "—"}</td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-2 text-fg-soft">{b.status}</span>
                </td>
                <td className="p-4 text-fg-soft text-xs">{fmt(b.created_at)}</td>
              </tr>
            ))}
            {(!bookings || bookings.length === 0) && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-fg-soft">Aucune demande pour l&apos;instant.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
