/**
 * /fac/devenir-helper — apply to become a marketplace helper.
 *
 * Two flows in one form:
 *   - Student helper (university + year + field)
 *   - Pro helper (profession + experience)
 *
 * After submit, the profile lands in status='pending' and admin reviews
 * it from /admin/approvals.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { HelperSignupForm } from "@/components/app/fac/HelperSignupForm";
import { CheckIcon } from "@/components/Icon";

export const metadata = { title: "Devenir helper — Université Najaح" };

export default async function DevenirHelperPage() {
  const t = await getTranslations("FacHelperSignup");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/fac/devenir-helper");

  // If they already have a profile, send them to their dashboard
  const { data: existing } = await supabase
    .from("helper_profiles")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "approved") redirect(`/fac/aide/${existing.id}`);
    redirect("/fac/mon-profil");
  }

  return (
    <PageShell active="fac">
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-3xl">
          <Link href="/fac/aide" className="text-xs text-fg-soft hover:text-fg inline-flex items-center gap-1">
            ← {t("back")}
          </Link>
          <div className="mt-5 text-center">
            <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
            <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-fg-soft max-w-xl mx-auto">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="container-x max-w-2xl space-y-6">
          {/* Promise checklist */}
          <ul className="space-y-2">
            {[t("promise_1"), t("promise_2"), t("promise_3"), t("promise_4")].map((p, i) => (
              <li key={i} className="flex gap-3 items-start bg-surface border border-line rounded-card p-3.5 text-sm">
                <CheckIcon size={18} className="mt-0.5 flex-shrink-0 text-gold" />
                <span className="text-fg">{p}</span>
              </li>
            ))}
          </ul>

          <HelperSignupForm userEmail={user.email ?? ""} />
        </div>
      </section>
    </PageShell>
  );
}
