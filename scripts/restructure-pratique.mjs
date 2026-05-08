// One-shot restructure of /eleve/pratique to be strictly grade-aware.
// Replaces GamesSection with audience-filtered tiles and updates the render
// block to use the new `audience` enum.
import { readFileSync, writeFileSync } from "node:fs";

const path = "src/app/[locale]/eleve/pratique/page.tsx";
let src = readFileSync(path, "utf8");

// 1) Replace the GamesSection function block.
const oldGames = src.indexOf("  const GamesSection = () => (");
const oldGamesEnd = src.indexOf("  const ExamsSection = () => (");
if (oldGames === -1 || oldGamesEnd === -1) {
  console.error("Cannot locate GamesSection / ExamsSection markers");
  process.exit(1);
}

const newGamesBlock = `  // ---- Game catalog with audience tags --------------------------------
  // Each tile knows which audiences it's appropriate for. Letter-based games
  // need literacy, so under-8 kids don't see them. High school students don't
  // see Coloriage / clock-reading. The audience enum lives in the closure.
  const allGames: Array<{
    href: string; emoji: string; title: string; color: string;
    group: "math" | "logic" | "words" | "world";
    audiences: Audience[]; literate?: boolean;
  }> = [
    { href: "/petits/maths/number-ninja", emoji: "🥷", title: t("game_ninja"), color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900", group: "math", audiences: ["primary", "middle"] },
    { href: "/petits/maths/souk", emoji: "🛒", title: t("game_souk"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "math", audiences: ["primary"] },
    { href: "/petits/jeux-malins/course-maths", emoji: "🏁", title: t("game_mathrace"), color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900", group: "math", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/pieces", emoji: "🪙", title: t("game_coins"), color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900", group: "math", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/sudoku", emoji: "🧩", title: t("game_sudoku"), color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900", group: "logic", audiences: ["primary", "middle", "high_school_other", "bac"] },
    { href: "/petits/jeux-malins/memoire", emoji: "🧠", title: t("game_memory"), color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900", group: "logic", audiences: ["primary"] },
    { href: "/petits/jeux-malins/motifs", emoji: "🔷", title: t("game_pattern"), color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", group: "logic", audiences: ["primary"] },
    { href: "/petits/jeux-malins/enigme", emoji: "🤔", title: t("game_riddle"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "logic", audiences: ["primary", "middle", "high_school_other", "bac"] },
    { href: "/petits/jeux-malins/morpion", emoji: "❌", title: t("game_tictactoe"), color: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900", group: "logic", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/mots-caches", emoji: "🔍", title: t("game_wordsearch"), color: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900", group: "words", audiences: ["primary", "middle", "high_school_other"], literate: true },
    { href: "/petits/jeux-malins/pendu", emoji: "🪢", title: t("game_hangman"), color: "bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700", group: "words", audiences: ["primary", "middle"], literate: true },
    { href: "/petits/jeux-malins/anagrammes", emoji: "🔤", title: t("game_anagrams"), color: "bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-200 dark:border-fuchsia-900", group: "words", audiences: ["primary", "middle"], literate: true },
    { href: "/petits/coloriage", emoji: "🎨", title: t("game_coloriage"), color: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900", group: "world", audiences: ["primary"] },
    { href: "/petits/monde-reel/heure", emoji: "⏰", title: t("game_clock"), color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900", group: "world", audiences: ["primary"] },
    { href: "/petits/monde-reel/wilayas", emoji: "🇩🇿", title: t("game_wilayas"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "world", audiences: ["primary", "middle"] },
  ];
  const visibleGames = allGames.filter((g) => {
    if (!g.audiences.includes(audience)) return false;
    if (g.literate && isUnder8) return false;
    return true;
  });
  const gamesByGroup = {
    math: visibleGames.filter((g) => g.group === "math"),
    logic: visibleGames.filter((g) => g.group === "logic"),
    words: visibleGames.filter((g) => g.group === "words"),
    world: visibleGames.filter((g) => g.group === "world"),
  };

  const GamesSection = () => (
    <Section icon="🎮" title={t("section_games_title")} subtitle={t("section_games_subtitle")}>
      <div className="space-y-6">
        {gamesByGroup.math.length > 0 && (
          <SubGroup label={t("games_group_math")}>
            {gamesByGroup.math.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.logic.length > 0 && (
          <SubGroup label={t("games_group_logic")}>
            {gamesByGroup.logic.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.words.length > 0 && (
          <SubGroup label={t("games_group_words")}>
            {gamesByGroup.words.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.world.length > 0 && (
          <SubGroup label={t("games_group_world")}>
            {gamesByGroup.world.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
      </div>
    </Section>
  );

`;

src = src.slice(0, oldGames) + newGamesBlock + src.slice(oldGamesEnd);

// 2) Replace the render section block (uses old isBacStudent/isYoungKid flags).
const oldRender = `        {/* Section order changes by audience: Bac students see exams first;
            young kids see games first; everyone else sees quizzes first. */}
        <div className="space-y-10">
          {isBacStudent && <ExamsSection />}
          {isYoungKid && <GamesSection />}
          <QuizSection />
          {!isYoungKid && <GamesSection />}
          <ActivitiesSection />
          {!isBacStudent && childGrade && <ExamsSection />}
        </div>`;

const newRender = `        {/* Section ordering + visibility per audience.
            - primary (1AP-5AP)        : Quiz, Games, Activities. NO Examens.
            - middle (1AM-3AM)         : Quiz, Games, Activities. NO Examens.
            - high_school_other (1-2AS): Quiz, Activities, Games. NO Examens.
            - bac (3AS / 4AM)          : Examens FIRST, then Quiz, Activities. */}
        <div className="space-y-10">
          {audience === "bac" && <ExamsSection />}
          {audience === "primary" && <GamesSection />}
          <QuizSection />
          <ActivitiesSection />
          {audience === "middle" && <GamesSection />}
          {audience === "high_school_other" && <GamesSection />}
        </div>`;

if (!src.includes(oldRender)) {
  console.error("Cannot find old render block");
  process.exit(1);
}
src = src.replace(oldRender, newRender);

writeFileSync(path, src, "utf8");
console.log("✓ Restructured /eleve/pratique");
