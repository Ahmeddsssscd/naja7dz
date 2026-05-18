/**
 * /fac/aide — public listing of approved helpers.
 *
 * Visitors filter by university + service type and tap a profile to open
 * its detail page. Each profile card shows: monogram avatar, "First L."
 * privacy-respecting name display, university badge, services chips,
 * response time, indicative rate.
 *
 * No auth required to browse — login is only needed to actually request
 * a service from a helper.
 */
import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { createServerClient } from "@/lib/supabase/server";
import { UNIVERSITIES } from "@/components/app/fac/universities";
import {
  HandshakeIcon,
  ArrowRightIcon,
  MapPinIcon,
  ShieldIcon,
} from "@/components/Icon";

export const metadata = { title: "Demander de l'aide — Université" };

interface PageProps {
  searchParams: Promise<{ uni?: string; service?: string; type?: "student" | "pro" }>;
}

interface Helper {
  id: string;
  display_name: string;
  last_initial: string | null;
  helper_type: "student" | "pro";
  university_slug: string | null;
  study_year: number | null;
  field: string | null;
  profession: string | null;
  experience_years: number | null;
  services: string[] | null;
  bio: string | null;
  hourly_rate_da: number | null;
  responds_within: string | null;
  photo_url: string | null;
}

export default async function FacAidePage({ searchParams }: PageProps) {
  const t = await getTranslations("FacAide");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { uni, service, type } = await searchParams;

  const supabase = await createServerClient();

  // Build the query — only approved profiles, filtered if requested.
  let query = supabase
    .from("helper_profiles")
    .select("id, display_name, last_initial, helper_type, university_slug, study_year, field, profession, experience_years, services, bio, hourly_rate_da, responds_within, photo_url")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(40);

  if (uni) query = query.eq("university_slug", uni);
  if (type) query = query.eq("helper_type", type);
  if (service) query = query.contains("services", [service]);

  const { data: rows } = await query;
  const helpers: Helper[] = (rows ?? []) as Helper[];

  const uniName = uni ? UNIVERSITIES.find((u) => u.slug === uni) : null;

  return (
    <PageShell active="fac">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl">
          <Link href="/fac" className="text-xs text-fg-soft hover:text-fg inline-flex items-center gap-1">
            ← {t("back")}
          </Link>
          <div className="mt-4 text-center">
            <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
            <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-fg-soft max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Yellow CTA — primary entry into the marketplace flow */}
          <div className="mt-7 text-center">
            <Link href="/fac/aide?service=orientation" className="btn btn-cta inline-flex items-center gap-2">
              <HandshakeIcon size={18} />
              {t("cta_ask")}
            </Link>
            <p className="text-xs text-fg-faint mt-3">{t("cta_caption")}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-surface border-b border-line">
        <div className="container-x max-w-5xl">
          <div className="flex flex-wrap gap-2 items-center">
            <FilterPill href="/fac/aide" active={!type && !service && !uni}>
              {t("filter_all")}
            </FilterPill>
            <FilterPill href="/fac/aide?type=student" active={type === "student"}>
              {t("filter_students")}
            </FilterPill>
            <FilterPill href="/fac/aide?type=pro" active={type === "pro"}>
              {t("filter_pros")}
            </FilterPill>
            <span className="text-fg-faint mx-1">|</span>
            <FilterPill href="/fac/aide?service=orientation" active={service === "orientation"}>
              {t("svc_orientation")}
            </FilterPill>
            <FilterPill href="/fac/aide?service=memoire" active={service === "memoire"}>
              {t("svc_memoire")}
            </FilterPill>
            <FilterPill href="/fac/aide?service=exercises" active={service === "exercises"}>
              {t("svc_exercises")}
            </FilterPill>
            <FilterPill href="/fac/aide?service=dossier" active={service === "dossier"}>
              {t("svc_dossier")}
            </FilterPill>
          </div>
        </div>
      </section>

      {/* Active filter summary */}
      {(uniName || type || service) && (
        <section className="bg-surface-3 py-3">
          <div className="container-x max-w-5xl flex items-center justify-between gap-3 text-sm">
            <div className="text-fg-soft">
              {uniName && <span>{isAr ? uniName.name_ar : uniName.short}</span>}
              {uniName && (type || service) && <span className="mx-2 text-fg-faint">·</span>}
              {type && <span>{type === "student" ? t("filter_students") : t("filter_pros")}</span>}
              {service && <span className="ms-2">· {t(`svc_${service}` as "svc_orientation")}</span>}
            </div>
            <Link href="/fac/aide" className="text-xs font-medium text-fg-soft hover:text-fg">
              ✕ {t("clear_filters")}
            </Link>
          </div>
        </section>
      )}

      {/* Grid of profiles */}
      <section className="py-12 bg-surface">
        <div className="container-x max-w-5xl">
          {helpers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpers.map((h) => (
                <HelperCard key={h.id} helper={h} isAr={isAr} />
              ))}
            </div>
          ) : (
            <EmptyState isAr={isAr} t={t} />
          )}
        </div>
      </section>

      {/* Become a helper */}
      <section className="accent-block py-16 text-center">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight max-w-2xl mx-auto">
            {t("become_title")}
          </h2>
          <p className="text-white/70 text-base mb-7 max-w-prose mx-auto">{t("become_sub")}</p>
          <Link href="/fac/devenir-helper" className="btn btn-secondary btn-lg">
            {t("become_cta")}
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 bg-surface-2">
        <div className="container-x max-w-3xl">
          <div className="bg-surface border border-line rounded-card p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <ShieldIcon size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-fg mb-1">{t("trust_title")}</h3>
              <p className="text-sm text-fg-soft leading-relaxed">{t("trust_text")}</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FilterPill({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href as never}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
        active
          ? "bg-fg text-bg border-fg"
          : "bg-surface text-fg-soft border-line hover:border-fg/40 hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

function HelperCard({ helper: h, isAr }: { helper: Helper; isAr: boolean }) {
  const uni = h.university_slug ? UNIVERSITIES.find((u) => u.slug === h.university_slug) : null;
  const monogram = h.display_name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const safeName = h.last_initial
    ? `${h.display_name.split(" ")[0]} ${h.last_initial.toUpperCase()}.`
    : h.display_name.split(" ")[0];

  return (
    <Link
      href={`/fac/aide/${h.id}` as never}
      className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex flex-col h-full"
    >
      <div className="flex items-start gap-3 mb-3">
        {h.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.photo_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-surface-3 text-fg font-bold inline-flex items-center justify-center flex-shrink-0">
            {monogram}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fg leading-tight">{safeName}</div>
          <div className="text-xs text-fg-soft mt-0.5 flex items-center gap-1.5">
            {h.helper_type === "student" ? (
              <span>
                {isAr ? `${h.field ?? ""} - السنة ${h.study_year ?? "?"}` : `${h.field ?? "Étudiant"} · ${h.study_year ?? "?"}e année`}
              </span>
            ) : (
              <span>{h.profession ?? (isAr ? "محترف" : "Professionnel")}</span>
            )}
          </div>
        </div>
      </div>

      {uni && (
        <div className="inline-flex items-center gap-1.5 text-xs text-fg-soft mb-3">
          <MapPinIcon size={12} />
          <span className="font-medium">{isAr ? uni.name_ar : uni.short}</span>
        </div>
      )}

      {h.bio && <p className="text-sm text-fg-soft line-clamp-2 mb-3 flex-1">{h.bio}</p>}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(h.services ?? []).slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] font-semibold bg-surface-3 text-fg px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-3 mt-auto text-xs">
        <div className="text-fg-soft">
          {h.responds_within && <span>{h.responds_within}</span>}
        </div>
        <span className="text-fg font-semibold inline-flex items-center gap-1">
          {isAr ? "اطلب" : "Demander"} <ArrowRightIcon size={12} />
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ isAr, t }: { isAr: boolean; t: (k: string) => string }) {
  void isAr;
  return (
    <div className="bg-surface border border-dashed border-line rounded-card p-12 text-center">
      <div className="w-14 h-14 rounded-card bg-surface-3 text-fg inline-flex items-center justify-center mb-4">
        <HandshakeIcon size={28} />
      </div>
      <h3 className="font-semibold text-fg mb-1">{t("empty_title")}</h3>
      <p className="text-sm text-fg-soft mb-6 max-w-sm mx-auto">{t("empty_sub")}</p>
      <Link href="/fac/devenir-helper" className="btn btn-primary">
        {t("become_cta")}
      </Link>
    </div>
  );
}
