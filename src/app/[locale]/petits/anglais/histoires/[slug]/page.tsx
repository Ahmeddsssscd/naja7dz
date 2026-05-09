import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { requireKidsAccess } from "@/lib/subscriptions";
import { EnglishStoryReader } from "@/components/app/games/english/EnglishStoryReader";
import { getStory } from "@/components/app/games/english/englishStories";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  return { title: story ? `Story – ${story.title_en}` : "Story" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <EnglishStoryReader story={story} />;
}
