/**
 * /enseignant/reseau — public listing of approved + opted-in teachers.
 *
 * Anyone can browse to discover Algerian teachers in the network. Only
 * approved teachers themselves can message each other (gated by the
 * teacher_dms RLS policy).
 */
import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { createServerClient } from "@/lib/supabase/server";
import { MapPinIcon, UsersIcon, BookIcon } from "@/components/Icon";
import { ContactProfButton } from "@/components/app/ContactProfButton";

export const metadata = { title: "Réseau enseignants — Najaح" };

interface PageProps {
  searchParams: Promise<{ subject?: string; wilaya?: string }>;
}

export default async function ReseauPage({ searchParams }: PageProps) {
  const t = await getTranslations("ReseauProfs");
  const locale = await getLocale();
  const { subject, wilaya } = await searchParams;

  const supabase = await createServerClient();

  // Is the viewer an approved teacher? Only they can message peers.
  const { data: { user } } = await supabase.auth.getUser();
  let canMessage = false;
  if (user) {
    const { data: me } = await supabase
      .from("teacher_profiles").select("status").eq("user_id", user.id).maybeSingle();
    canMessage = me?.status === "approved";
  }

  let query = supabase
    .from("teacher_profiles")
    .select("user_id, full_name, school_name, wilaya, bio, bio_public, subjects, grades_taught")
    .eq("status", "approved")
    .eq("is_public", true)
    .order("approved_at", { ascending: false })
    .limit(50);
  if (subject) query = query.contains("subjects", [subject]);
  if (wilaya) query = query.eq("wilaya", wilaya);

  const { data: teachers } = await query;

  return (
    <PageShell active="teacher">
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl">
          <Link href="/enseignant" className="text-xs text-fg-soft hover:text-fg">← {t("back")}</Link>
          <div className="mt-4 text-center">
            <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
            <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-fg-soft max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-surface border-b border-line">
        <div className="container-x max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <FilterPill href="/enseignant/reseau" active={!subject && !wilaya}>{t("filter_all")}</FilterPill>
            {["math", "physique", "fr", "ar", "anglais", "histoire", "svt"].map((s) => (
              <FilterPill key={s} href={`/enseignant/reseau?subject=${s}`} active={subject === s}>
                {t(`subj_${s}` as "subj_math")}
              </FilterPill>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="container-x max-w-5xl">
          {teachers && teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((p) => {
                const monogram = p.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
                const last = p.full_name.split(" ").slice(-1)[0]?.[0] ?? "";
                const safeName = `${p.full_name.split(" ")[0]} ${last}.`;
                return (
                  <div key={p.user_id}
                    className="bg-surface border border-line rounded-card p-5 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-surface-3 text-fg font-bold inline-flex items-center justify-center flex-shrink-0">
                        {monogram}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-fg leading-tight">{safeName}</div>
                        {p.school_name && (
                          <div className="text-xs text-fg-soft mt-0.5 truncate">{p.school_name}</div>
                        )}
                      </div>
                    </div>
                    {p.wilaya && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-fg-soft mb-2">
                        <MapPinIcon size={12} /> {p.wilaya}
                      </div>
                    )}
                    {(p.bio_public || p.bio) && (
                      <p className="text-sm text-fg-soft line-clamp-2 mb-3 flex-1">{p.bio_public || p.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-1 border-t border-line pt-3 mt-auto">
                      {(p.subjects ?? []).slice(0, 4).map((s: string) => (
                        <span key={s} className="text-[10px] font-mono bg-surface-3 text-fg px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    {canMessage && user?.id !== p.user_id && (
                      <ContactProfButton peerId={p.user_id} peerName={safeName} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface border border-dashed border-line rounded-card p-12 text-center">
              <div className="w-14 h-14 rounded-card bg-surface-3 text-fg inline-flex items-center justify-center mb-4">
                <UsersIcon size={28} />
              </div>
              <h3 className="font-semibold text-fg mb-1">{t("empty_title")}</h3>
              <p className="text-sm text-fg-soft mb-6 max-w-sm mx-auto">{t("empty_sub")}</p>
              <Link href="/enseignant" className="btn btn-primary">{t("become_cta")}</Link>
            </div>
          )}
        </div>
      </section>

      <section className="accent-block py-14 text-center">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl mx-auto leading-tight">
            {t("cta_title")}
          </h2>
          <p className="text-white/70 text-base mb-6 max-w-prose mx-auto">{t("cta_sub")}</p>
          <Link href="/enseignant" className="btn btn-secondary btn-lg inline-flex items-center gap-2">
            <BookIcon size={18} /> {t("cta_button")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function FilterPill({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href as never}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
        active ? "bg-fg text-bg border-fg" : "bg-surface text-fg-soft border-line hover:border-fg/40 hover:text-fg"
      }`}>
      {children}
    </Link>
  );
}
