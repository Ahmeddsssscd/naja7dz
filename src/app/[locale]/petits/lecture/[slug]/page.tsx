import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Histoire" };

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("PetitsReading");
  const locale = await getLocale();
  const isAr = locale === "ar";

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: story } = await admin
    .from("stories")
    .select("title_fr, title_ar, cover_emoji, paragraphs_fr, paragraphs_ar, reading_minutes, difficulty")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (!story) notFound();

  const title = (isAr && story.title_ar) || story.title_fr;
  const paragraphs: string[] =
    (isAr ? story.paragraphs_ar : story.paragraphs_fr) ?? [];

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-30">
        <Link
          href="/petits/lecture"
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={t("back_to_stories")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <span className="text-xs text-fg-soft font-medium">
          {story.reading_minutes} min · {t(`difficulty_${story.difficulty as "easy" | "medium" | "hard"}`)}
        </span>
        <div className="w-10" />
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{story.cover_emoji ?? "📖"}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy">{title}</h1>
        </div>

        <article className="prose prose-lg max-w-none space-y-5 text-fg leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg md:text-xl">
              {p}
            </p>
          ))}
        </article>

        <div className="mt-12 pt-6 border-t border-pale-blue text-center">
          <p className="text-fg-soft text-sm mb-4">{t("end_text")}</p>
          <Link href="/petits/lecture" className="btn btn-primary">
            {t("more_stories")}
          </Link>
        </div>
      </main>
    </div>
  );
}
