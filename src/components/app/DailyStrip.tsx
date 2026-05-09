/**
 * Inline strip shown on /petits between the hero and the game catalog.
 *
 * 3 cards (1 col on mobile, 3 cols on desktop):
 *   1. Streak — current_streak + week-dot timeline
 *   2. Activité du jour — pre-picked rotating featured game
 *   3. Mini-stats — XP / trophies (placeholders for now, wired to streak)
 *
 * Pure server component (gets the streak via the server-only helper). The
 * rotating featured game uses a deterministic day-of-year hash so every
 * kid sees the same daily pick (lets parents set up "today's challenge"
 * vibes without needing a CMS).
 */
import { getStreak } from "@/lib/streak";
import { Link } from "@/i18n/routing";

interface FeaturedGame {
  href: string;
  emoji: string;
  /** Translated client-side via the parent passing `t(name_key)` — but we
   *  keep the name inline since this is rendered on /petits/page.tsx where
   *  ElevePratique translations are already loaded. */
  name_fr: string;
  name_ar: string;
  tag_fr: string;
  tag_ar: string;
  bg: string;
}

const FEATURED_POOL: FeaturedGame[] = [
  { href: "/petits/jeux-malins/mon-corps",       emoji: "🧒", name_fr: "Mon corps",         name_ar: "جسمي",         tag_fr: "Découvre les parties du corps", tag_ar: "اكتشف أعضاء الجسم",      bg: "from-rose-200 to-amber-200" },
  { href: "/petits/jeux-malins/emotions",        emoji: "😊", name_fr: "Les émotions",      name_ar: "المشاعر",      tag_fr: "Reconnaître les émotions",       tag_ar: "تعرّف على المشاعر",       bg: "from-amber-200 to-pink-200" },
  { href: "/petits/jeux-malins/saisons",         emoji: "🌈", name_fr: "Les saisons",       name_ar: "الفصول",       tag_fr: "Trie les images par saison",      tag_ar: "صنّف الصور حسب الفصل",   bg: "from-emerald-200 to-blue-200" },
  { href: "/petits/jeux-malins/mon-assiette",    emoji: "🍎", name_fr: "Mon assiette",      name_ar: "صحني",         tag_fr: "Mange équilibré",                tag_ar: "تغذية متوازنة",         bg: "from-emerald-200 to-amber-200" },
  { href: "/petits/jeux-malins/sudoku-9x9",      emoji: "9️⃣", name_fr: "Sudoku 9×9",       name_ar: "سودوكو ٩×٩",   tag_fr: "Pour les vrais cracks",           tag_ar: "للأذكياء",               bg: "from-blue-200 to-indigo-200" },
  { href: "/petits/maths/number-ninja",          emoji: "🥷", name_fr: "Number Ninja",      name_ar: "نينجا الأرقام", tag_fr: "Mental math arcade",              tag_ar: "ألعاب حسابية سريعة",      bg: "from-red-200 to-orange-200" },
  { href: "/petits/jeux-malins/animaux",         emoji: "🦊", name_fr: "Animaux d'Algérie", name_ar: "حيوانات الجزائر", tag_fr: "Mémoire + faune locale",     tag_ar: "ذاكرة وحيوانات محلية",   bg: "from-orange-200 to-yellow-200" },
];

/** Picks one game deterministically based on today's calendar date. */
function pickToday(): FeaturedGame {
  const now = new Date();
  // Day-of-year ≈ unique seed per day, so every kid sees the same game on a
  // given day but the pick rotates across the week.
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return FEATURED_POOL[dayOfYear % FEATURED_POOL.length];
}

interface Props {
  childId: string | null;
  isAr: boolean;
}

export async function DailyStrip({ childId, isAr }: Props) {
  const streak = await getStreak(childId);
  const featured = pickToday();

  // Build a 7-dot week ribbon. We don't store per-day history yet (only
  // current_streak), so we derive it: dots[6] = today, fill leftward with
  // current_streak.
  const weekDots: ("done" | "open" | "today")[] = [];
  for (let i = 6; i >= 0; i--) {
    if (i === 6) weekDots.push(streak.activeToday ? "done" : "today");
    else if (6 - i < streak.current) weekDots.push("done");
    else weekDots.push("open");
  }

  const dayNamesFr = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const dayNamesAr = ["إث", "ثل", "أر", "خ ", "ج ", "س ", "أح"];
  const today = new Date().getDay(); // 0 = Sunday
  // Reorder so the last dot is "today" — easier than rotating arrays
  const labels = isAr ? dayNamesAr : dayNamesFr;
  const orderedLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const offset = (today - i + 7) % 7;
    orderedLabels.push(labels[offset === 0 ? 6 : offset - 1]);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {/* Streak */}
      <div className="bg-white border border-pale-blue rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-2xl font-bold text-navy leading-none">{streak.current}</div>
              <div className="text-xs text-fg-soft mt-0.5">{isAr ? "أيّام متتالية" : "jours d'affilée"}</div>
            </div>
          </div>
          {streak.longest > 0 && streak.longest >= streak.current && (
            <div className="text-end">
              <div className="text-xs text-fg-soft">{isAr ? "الرقم القياسي" : "Record"}</div>
              <div className="text-base font-bold text-gold">{streak.longest}</div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 mt-3">
          {weekDots.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                d === "done" ? "bg-gold text-navy"
                : d === "today" ? "bg-pale-blue/60 text-navy ring-2 ring-navy"
                : "bg-pale-blue/30 text-navy/40"
              }`}>
                {d === "done" ? "✓" : d === "today" ? "•" : ""}
              </span>
              <span className="text-[10px] text-fg-soft">{orderedLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured game */}
      <Link
        href={featured.href as never}
        className={`bg-gradient-to-br ${featured.bg} rounded-2xl p-4 shadow-card flex items-center gap-3 active:scale-[0.98] hover:shadow-card-hover transition`}
      >
        <span className="text-5xl">{featured.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider font-bold text-navy/60">
            {isAr ? "نشاط اليوم" : "Activité du jour"}
          </div>
          <div className="font-bold text-navy text-base md:text-lg leading-tight truncate">
            {isAr ? featured.name_ar : featured.name_fr}
          </div>
          <div className="text-xs text-navy/70 mt-0.5 truncate">
            {isAr ? featured.tag_ar : featured.tag_fr}
          </div>
        </div>
        <span className="text-navy/60 text-xl flex-shrink-0">→</span>
      </Link>

      {/* Quick parent / progress card */}
      <div className="bg-navy text-cream rounded-2xl p-4 shadow-card relative overflow-hidden">
        <div className="absolute -top-3 -end-3 text-5xl opacity-30">🦊</div>
        <div className="relative">
          <div className="text-[10px] uppercase tracking-wider font-bold text-gold mb-1">
            {isAr ? "نصيحة الفنك" : "Conseil du Fennec"}
          </div>
          <p className="text-sm leading-snug font-semibold">
            {isAr
              ? "العب لعبة واحدة كل يوم — حتى ٥ دقائق تكفي للحفاظ على شعلتك !"
              : "Joue à un jeu chaque jour — même 5 minutes suffisent pour garder ta flamme !"}
          </p>
          <Link
            href="/parent/catalogue"
            className="inline-block mt-2 text-xs font-bold text-gold underline underline-offset-4"
          >
            {isAr ? "عرض كل الأنشطة" : "Voir tout le catalogue"} →
          </Link>
        </div>
      </div>
    </div>
  );
}
