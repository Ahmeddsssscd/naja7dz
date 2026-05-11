/**
 * /fac/aide/[id] — single helper profile detail.
 *
 * Shows the helper's bio, university, services, indicative rate. Two CTAs:
 *   - "Demander une réponse" (400 DA flat — flow=ask_student)
 *   - "Négocier un projet" (free to start — flow=negotiate)
 *
 * Login is required to actually request. Anonymous users see a sign-in CTA.
 */
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { createServerClient } from "@/lib/supabase/server";
import { UNIVERSITIES } from "@/components/app/fac/universities";
import { RequestServiceForm } from "@/components/app/fac/RequestServiceForm";
import { MapPinIcon, ShieldIcon } from "@/components/Icon";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("helper_profiles")
    .select("display_name, last_initial")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (!data) return { title: "Helper introuvable" };
  const first = data.display_name.split(" ")[0];
  const init = data.last_initial ? `${data.last_initial.toUpperCase()}.` : "";
  return { title: `${first} ${init} — Université Najaح` };
}

export default async function HelperDetail({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("FacHelper");
  const locale = await getLocale();
  const isAr = locale === "ar";

  const supabase = await createServerClient();
  const { data: h } = await supabase
    .from("helper_profiles")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (!h) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const uni = h.university_slug ? UNIVERSITIES.find((u) => u.slug === h.university_slug) : null;
  const monogram = h.display_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
  const safeName = h.last_initial
    ? `${h.display_name.split(" ")[0]} ${h.last_initial.toUpperCase()}.`
    : h.display_name.split(" ")[0];

  return (
    <PageShell active="fac">
      {/* Back */}
      <section className="py-6 bg-surface border-b border-line">
        <div className="container-x max-w-4xl">
          <Link href="/fac/aide" className="text-xs text-fg-soft hover:text-fg inline-flex items-center gap-1">
            ← {t("back_to_list")}
          </Link>
        </div>
      </section>

      {/* Header */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="container-x max-w-4xl">
          <div className="flex items-start gap-5 flex-wrap">
            {h.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={h.photo_url} alt="" className="w-20 h-20 rounded-card object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-card bg-surface-3 text-fg font-bold text-lg inline-flex items-center justify-center flex-shrink-0">
                {monogram}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="eyebrow mb-2 block">
                {h.helper_type === "student" ? t("badge_student") : t("badge_pro")}
              </span>
              <h1 className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight text-fg leading-tight">
                {safeName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-fg-soft mt-2 flex-wrap">
                {uni && (
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon size={12} />
                    {isAr ? uni.name_ar : uni.short}
                  </span>
                )}
                {h.helper_type === "student" && h.study_year && (
                  <>
                    <span className="text-fg-faint">·</span>
                    <span>{isAr ? `السنة ${h.study_year}` : `${h.study_year}e année`}</span>
                  </>
                )}
                {h.field && (
                  <>
                    <span className="text-fg-faint">·</span>
                    <span>{h.field}</span>
                  </>
                )}
                {h.experience_years && (
                  <>
                    <span className="text-fg-faint">·</span>
                    <span>{h.experience_years} {isAr ? "سنوات خبرة" : "ans d'expérience"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="container-x max-w-4xl">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
            {/* Bio + services */}
            <div className="space-y-5">
              {h.bio && (
                <div className="bg-surface border border-line rounded-card p-6">
                  <h2 className="font-semibold text-fg mb-3">{t("section_about")}</h2>
                  <p className="text-base text-fg leading-relaxed whitespace-pre-wrap">{h.bio}</p>
                </div>
              )}
              <div className="bg-surface border border-line rounded-card p-6">
                <h2 className="font-semibold text-fg mb-3">{t("section_services")}</h2>
                <div className="flex flex-wrap gap-2">
                  {(h.services ?? []).map((s: string) => (
                    <span key={s} className="text-sm font-medium bg-surface-3 text-fg px-3 py-1.5 rounded-full border border-line">
                      {s}
                    </span>
                  ))}
                  {!(h.services ?? []).length && <span className="text-sm text-fg-soft">—</span>}
                </div>
              </div>
              <div className="bg-surface border border-line rounded-card p-6 flex items-start gap-3">
                <ShieldIcon size={20} className="mt-0.5 text-gold flex-shrink-0" />
                <div className="text-sm text-fg-soft">
                  <strong className="text-fg">{t("trust_title")} </strong>
                  {t("trust_text")}
                </div>
              </div>
            </div>

            {/* Right rail: request CTA */}
            <div className="md:sticky md:top-20 h-fit">
              {user ? (
                <RequestServiceForm helperId={h.id} helperName={safeName} />
              ) : (
                <div className="bg-surface border border-line rounded-card p-6">
                  <h3 className="font-semibold text-fg mb-2">{t("login_required")}</h3>
                  <p className="text-sm text-fg-soft mb-4">{t("login_required_sub")}</p>
                  <Link href={`/connexion?next=/fac/aide/${h.id}` as never} className="btn btn-primary w-full">
                    {t("login_cta")}
                  </Link>
                </div>
              )}

              {h.responds_within && (
                <div className="text-center text-xs text-fg-soft mt-3">
                  {t("responds_in", { time: h.responds_within })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
