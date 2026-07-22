import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Vue d'ensemble" };

export default async function AdminOverview() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const weekAgo = new Date(now - 7 * 864e5).toISOString();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  // Defensive count — a missing table never 500s the whole dashboard.
  const count = async (
    table: string,
    build?: (q: ReturnType<ReturnType<typeof admin.from>["select"]>) => unknown,
  ): Promise<number> => {
    try {
      let q = admin.from(table).select("*", { count: "exact", head: true });
      if (build) q = build(q) as typeof q;
      const { count: n } = await q;
      return n ?? 0;
    } catch {
      return 0;
    }
  };

  const [
    parents, parentsWeek, children, activeSubs, waitlist, waitlistWeek,
    pendingSpeeches, pendingApprovals, openSupport, pendingBookings, flaggedPosts,
    subjects, chapters, quizQuestions, exams, professors, quizzesWeek,
  ] = await Promise.all([
    count("parent_profiles"),
    count("parent_profiles", (q) => q.gte("created_at", weekAgo)),
    count("children"),
    count("subscriptions", (q) => q.eq("status", "active").gt("expires_at", nowIso)),
    count("early_access_signups"),
    count("early_access_signups", (q) => q.gte("created_at", weekAgo)),
    count("motivational_speeches", (q) => q.eq("status", "pending")),
    count("teacher_profiles", (q) => q.eq("status", "pending")),
    count("support_messages", (q) => q.eq("status", "open")),
    count("booking_requests", (q) => q.eq("status", "pending")),
    count("teacher_posts", (q) => q.eq("visibility", "flagged")),
    count("subjects"),
    count("chapters"),
    count("quiz_questions", (q) => q.eq("active", true)),
    count("exam_papers"),
    count("professors", (q) => q.eq("active", true)),
    count("quizzes", (q) => q.gte("started_at", weekAgo)),
  ]);

  // Revenue this month = sum of paid checkout amounts since month start.
  let revenueMonth = 0;
  let paidMonth = 0;
  try {
    const { data } = await admin
      .from("checkout_sessions")
      .select("amount_dzd")
      .eq("status", "paid")
      .gte("paid_at", monthStart);
    paidMonth = data?.length ?? 0;
    revenueMonth = (data ?? []).reduce((s, r) => s + (Number(r.amount_dzd) || 0), 0);
  } catch { /* table may not exist */ }

  const firstName = profile.full_name?.split(" ")[0] ?? "";

  const queue = [
    { label: "Enseignants à valider", value: pendingApprovals, href: "/admin/approvals" },
    { label: "Messages de support ouverts", value: openSupport, href: "/admin/support" },
    { label: "Demandes de réservation", value: pendingBookings, href: "/admin/professeurs" },
    { label: "Discours à modérer", value: pendingSpeeches, href: "/admin/discours" },
    { label: "Publications signalées", value: flaggedPosts, href: "/admin/moderation" },
  ];
  const queueTotal = queue.reduce((s, q) => s + q.value, 0);

  return (
    <AdminShell active="overview" adminName={profile.full_name}>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-1">
          Bonjour {firstName} 👋
        </h1>
        <p className="text-fg-soft">Voici l&apos;état de la plateforme en un coup d&apos;œil.</p>
      </div>

      {/* Business KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Comptes parents" value={parents} hint={`+${parentsWeek} cette semaine`} />
        <Kpi label="Enfants inscrits" value={children} hint="profils élèves" />
        <Kpi label="Abonnements actifs" value={activeSubs} hint="en cours de validité" accent />
        <Kpi
          label="Revenus du mois"
          value={`${revenueMonth.toLocaleString("fr-DZ")} DA`}
          hint={`${paidMonth} paiement${paidMonth > 1 ? "s" : ""}`}
          accent
        />
      </div>

      {/* Action queue */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <section className="bg-surface border border-line rounded-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-fg">À traiter</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${queueTotal > 0 ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"}`}>
              {queueTotal} en attente
            </span>
          </div>
          <ul className="text-sm">
            {queue.map((r) => (
              <li key={r.label} className="flex items-center justify-between py-2.5 border-b last:border-b-0 border-line">
                <Link href={r.href as never} className="text-fg hover:text-gold transition-colors">{r.label}</Link>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.value > 0 ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"}`}>
                  {r.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Secondary metrics */}
        <section className="bg-surface border border-line rounded-card p-6">
          <h2 className="font-semibold text-fg mb-4">Activité & croissance</h2>
          <ul className="text-sm">
            <MetricRow label="Quiz complétés (7 j)" value={quizzesWeek} />
            <MetricRow label="Liste d'attente" value={`${waitlist} (+${waitlistWeek})`} href="/admin/liste-attente" />
            <MetricRow label="Professeurs actifs" value={professors} href="/admin/professeurs" />
            <MetricRow label="Paiements ce mois" value={paidMonth} href="/admin/revenus" />
          </ul>
        </section>
      </div>

      {/* Content health */}
      <section className="bg-surface border border-line rounded-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-fg">Contenu pédagogique</h2>
          <Link href="/admin/contenu" className="text-xs text-gold font-semibold hover:underline">Gérer →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MiniStat label="Matières" value={subjects} />
          <MiniStat label="Chapitres" value={chapters} />
          <MiniStat label="Questions de quiz" value={quizQuestions} />
          <MiniStat label="Sujets d'examen" value={exams} />
          <MiniStat label="Professeurs" value={professors} />
        </div>
      </section>

      {/* Quick access — everything, organized */}
      <h2 className="font-semibold text-fg mb-3">Accès rapide</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickCard
          title="Utilisateurs & revenus"
          links={[
            { label: "Utilisateurs", href: "/admin/utilisateurs" },
            { label: "Revenus & abonnements", href: "/admin/revenus" },
            { label: "Liste d'attente", href: "/admin/liste-attente" },
          ]}
        />
        <QuickCard
          title="Contenu pédagogique"
          links={[
            { label: "Matières · chapitres · quiz", href: "/admin/contenu" },
            { label: "Sujets d'examens (PDF)", href: "/admin/contenu/examens" },
            { label: "Sujets de rédaction", href: "/admin/contenu/writing-prompts" },
            { label: "Discours motivants", href: "/admin/discours" },
          ]}
        />
        <QuickCard
          title="Communauté"
          links={[
            { label: "Professeurs & réservations", href: "/admin/professeurs" },
            { label: "Approbations enseignants", href: "/admin/approvals" },
            { label: "Modération", href: "/admin/moderation" },
            { label: "Support", href: "/admin/support" },
          ]}
        />
        <QuickCard
          title="Commerce"
          links={[
            { label: "Tarifs & abonnements", href: "/admin/tarifs" },
            { label: "Revenus", href: "/admin/revenus" },
          ]}
        />
        <QuickCard
          title="Réglages"
          links={[
            { label: "Fonctionnalités (flags)", href: "/admin/fonctionnalites" },
          ]}
        />
        <QuickCard
          title="Voir le site"
          links={[
            { label: "Page d'accueil", href: "/" },
            { label: "Tarifs (public)", href: "/tarifs" },
            { label: "Professeurs (public)", href: "/bac/professeurs" },
          ]}
        />
      </div>
    </AdminShell>
  );
}

function Kpi({ label, value, hint, accent }: { label: string; value: number | string; hint: string; accent?: boolean }) {
  return (
    <div className={`bg-surface border rounded-card p-5 ${accent ? "border-gold/50" : "border-line"}`}>
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl md:text-3xl font-bold leading-none mb-2 ${accent ? "text-gold" : "text-fg"}`}>
        <bdi>{value}</bdi>
      </div>
      <div className="text-xs text-fg-faint">{hint}</div>
    </div>
  );
}

function MetricRow({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const inner = (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0 border-line">
      <span className="text-fg">{label}</span>
      <span className="font-bold text-fg tabular-nums"><bdi>{value}</bdi></span>
    </div>
  );
  return href ? <Link href={href as never} className="block hover:text-gold [&_span:first-child]:hover:text-gold">{inner}</Link> : inner;
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-surface-2 rounded-xl py-4 px-2">
      <div className="text-2xl font-bold text-fg tabular-nums">{value}</div>
      <div className="text-xs text-fg-soft mt-1 leading-tight">{label}</div>
    </div>
  );
}

function QuickCard({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <h3 className="text-xs font-bold text-fg-faint uppercase tracking-wider mb-3">{title}</h3>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href as never} className="flex items-center justify-between text-sm text-fg hover:text-gold py-1.5 group">
              {l.label}
              <span className="text-fg-faint group-hover:text-gold">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
