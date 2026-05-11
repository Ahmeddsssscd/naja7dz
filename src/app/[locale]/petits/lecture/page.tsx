import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Lis avec moi" };

export default async function LectureHub() {
  const t = await getTranslations("PetitsReading");
  const tBack = await getTranslations("Petits");
  const locale = await getLocale();
  const isAr = locale === "ar";

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);

  // Real stories from the DB so kids can pick what to read.
  const admin = createAdminClient();
  const { data: stories } = await admin
    .from("stories")
    .select("id, slug, title_fr, title_ar, cover_emoji, difficulty, reading_minutes")
    .eq("active", true)
    .order("sort_order");

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <Link
          href="/petits"
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={tBack("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Quran follow tile — it has its own dedicated subroute */}
        <Link
          href="/petits/quran"
          className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 rounded-3xl p-5 flex items-center gap-4 active:scale-95 transition-transform mb-5"
        >
          <span className="text-5xl">📿</span>
          <div className="flex-1">
            <div className="font-bold text-lg">{t("tile_quran")}</div>
            <div className="text-sm opacity-80">{t("tile_quran_sub")}</div>
          </div>
          <span className="text-2xl">›</span>
        </Link>

        {/* Stories list */}
        <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">
          {t("stories_title")}
        </h2>
        {(stories?.length ?? 0) === 0 ? (
          <div className="bg-surface border-2 border-dashed border-pale-blue rounded-3xl p-5 text-center text-fg-soft">
            <div className="text-4xl mb-2">📖</div>
            <p className="font-semibold mb-1">{t("empty_title")}</p>
            <p className="text-xs">{t("empty_text")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {stories!.map((s) => (
              <Link
                key={s.id}
                href={`/petits/lecture/${s.slug}` as never}
                className="bg-surface border border-pale-blue rounded-3xl p-4 flex items-center gap-3 hover:border-gold hover:shadow-card-hover transition-all active:scale-95"
              >
                <span className="text-4xl flex-shrink-0">{s.cover_emoji ?? "📖"}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-navy text-sm">
                    {(isAr && s.title_ar) || s.title_fr}
                  </div>
                  <div className="text-xs text-fg-soft">
                    {s.reading_minutes ? `${s.reading_minutes} min · ` : ""}
                    {t(`difficulty_${s.difficulty as "easy" | "medium" | "hard"}`)}
                  </div>
                </div>
                <span className="text-xl text-navy/60">›</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
