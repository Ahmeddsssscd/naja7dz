import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Lis avec moi" };

export default async function LectureHub() {
  const t = await getTranslations("PetitsReading");
  const tBack = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <Link href="/petits" className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label={tBack("back")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        <div className="grid grid-cols-1 gap-3">
          <Link href="/petits/quran" className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 rounded-3xl p-5 flex items-center gap-4 active:scale-95 transition-transform">
            <span className="text-5xl">📿</span>
            <div>
              <div className="font-bold text-lg">{t("tile_quran")}</div>
              <div className="text-sm opacity-80">{t("tile_quran_sub")}</div>
            </div>
          </Link>

          <div className="bg-white border-2 border-dashed border-pale-blue rounded-3xl p-5 text-center text-fg-soft">
            <div className="text-4xl mb-2">📖</div>
            <p className="font-semibold mb-1">{t("tile_drawing")}</p>
            <p className="text-xs">{t("tile_drawing_sub")}</p>
          </div>

          <div className="bg-white border-2 border-dashed border-pale-blue rounded-3xl p-5 text-center text-fg-soft">
            <div className="text-4xl mb-2">📚</div>
            <p className="font-semibold mb-1">{t("tile_tafsir")}</p>
            <p className="text-xs">{t("tile_tafsir_sub")}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
