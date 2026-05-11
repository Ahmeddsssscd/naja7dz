/**
 * /fac/mon-profil — helper's own dashboard.
 *
 * Shows their profile status (pending / approved / rejected / paused),
 * incoming requests, and active chat threads. Approved helpers see a
 * link to their public profile.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { ArrowRightIcon, ShieldIcon } from "@/components/Icon";

export const metadata = { title: "Mon profil helper — Najaح" };

interface Props { searchParams: Promise<{ submitted?: string }> }

export default async function MonProfilPage({ searchParams }: Props) {
  const { submitted } = await searchParams;
  const t = await getTranslations("FacHelperDash");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/fac/mon-profil");

  const { data: profile } = await supabase
    .from("helper_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/fac/devenir-helper");
  }

  // Threads where I'm the helper
  const admin = createAdminClient();
  const { data: threads } = await admin
    .from("chat_threads")
    .select("id, request_id, buyer_id, last_message_at, helper_unread")
    .eq("helper_user_id", user.id)
    .order("last_message_at", { ascending: false })
    .limit(20);

  return (
    <PageShell active="fac">
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="container-x max-w-4xl">
          <Link href="/fac" className="text-xs text-fg-soft hover:text-fg">← {t("back")}</Link>
          <div className="mt-4 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="eyebrow mb-2 block">{t("eyebrow")}</span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-fg leading-tight">
                {profile.display_name}
              </h1>
              <p className="text-sm text-fg-soft mt-1">
                {profile.helper_type === "student" ? t("type_student") : t("type_pro")}
              </p>
            </div>
            <StatusBadge status={profile.status} t={t} />
          </div>
        </div>
      </section>

      <section className="py-10 bg-surface">
        <div className="container-x max-w-4xl space-y-5">
          {submitted && (
            <div className="bg-gold/15 border border-gold rounded-card p-4 flex items-start gap-3">
              <ShieldIcon size={20} className="mt-0.5 text-gold flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-fg block">{t("submitted_title")}</strong>
                <span className="text-fg-soft">{t("submitted_text")}</span>
              </div>
            </div>
          )}

          {profile.status === "rejected" && profile.rejection_note && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-card p-4 text-sm">
              <strong className="block mb-1">{t("rejection_title")}</strong>
              {profile.rejection_note}
            </div>
          )}

          {profile.status === "approved" && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 rounded-card p-4">
              <h3 className="font-semibold text-fg mb-1">{t("approved_title")}</h3>
              <p className="text-sm text-fg-soft mb-3">{t("approved_text")}</p>
              <Link href={`/fac/aide/${profile.id}` as never} className="btn btn-outline inline-flex items-center gap-2">
                {t("view_public")} <ArrowRightIcon size={14} />
              </Link>
            </div>
          )}

          {/* Threads */}
          <div className="bg-surface border border-line rounded-card p-5">
            <h2 className="font-semibold text-fg mb-4">{t("section_threads")}</h2>
            {threads && threads.length > 0 ? (
              <div className="divide-y divide-line">
                {threads.map((th) => (
                  <Link
                    key={th.id}
                    href={`/fac/chat/${th.id}` as never}
                    className="flex items-center justify-between py-3 hover:text-fg transition"
                  >
                    <div>
                      <div className="font-medium text-fg text-sm">{t("conversation_with_buyer")}</div>
                      <div className="text-xs text-fg-faint mt-0.5">
                        {new Date(th.last_message_at).toLocaleString()}
                      </div>
                    </div>
                    {th.helper_unread > 0 && (
                      <span className="bg-gold text-navy text-xs font-bold rounded-full px-2 py-0.5">
                        {th.helper_unread}
                      </span>
                    )}
                    <ArrowRightIcon size={14} className="text-fg-faint ms-3" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-soft">{t("no_threads")}</p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StatusBadge({ status, t }: { status: string; t: (k: string) => string }) {
  const styles: Record<string, string> = {
    pending: "bg-gold/15 text-gold border-gold/40",
    approved: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300",
    rejected: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-300",
    paused: "bg-surface-3 text-fg-soft border-line",
  };
  return (
    <span className={`text-xs font-semibold rounded-full px-3 py-1.5 border ${styles[status] ?? styles.pending}`}>
      {t(`status_${status}` as "status_pending")}
    </span>
  );
}
