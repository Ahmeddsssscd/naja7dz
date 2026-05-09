/**
 * Three short bilingual stories for the English Stories section.
 *
 * Each story is broken into 4-5 paragraphs. Every paragraph carries an EN
 * sentence (the primary text the kid is learning to read), plus FR and AR
 * translations the kid can reveal on tap. The "🔊" button on each paragraph
 * speaks the EN sentence via TTS — TextToSpeech is much more natural at the
 * sentence level than word-by-word.
 *
 * One story has an explicit Algerian touch (the Brave Fennec) — the fennec
 * is the platform mascot, so kids will recognize him.
 */

export interface StoryParagraph {
  en: string;
  fr: string;
  ar: string;
}

export interface EnglishStory {
  slug: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  emoji: string;
  /** Background tint for the cover tile. Tailwind classes. */
  color: string;
  /** Difficulty hint shown on the tile. */
  level: "Easy" | "Easy+" | "Medium";
  paragraphs: StoryParagraph[];
}

export const STORIES: EnglishStory[] = [
  {
    slug: "little-cat",
    title_en: "The Little Cat",
    title_fr: "Le petit chat",
    title_ar: "القطّ الصغير",
    emoji: "🐱",
    color: "bg-rose-100 text-rose-900",
    level: "Easy",
    paragraphs: [
      {
        en: "There is a little cat. The cat is white and small.",
        fr: "Il y a un petit chat. Le chat est blanc et petit.",
        ar: "هناك قطّ صغير. القطّ أبيض وصغير.",
      },
      {
        en: "The cat lives in a big house with a happy family.",
        fr: "Le chat vit dans une grande maison avec une famille heureuse.",
        ar: "يعيش القطّ في بيت كبير مع عائلة سعيدة.",
      },
      {
        en: "Every morning, the cat drinks milk and plays in the garden.",
        fr: "Chaque matin, le chat boit du lait et joue dans le jardin.",
        ar: "كلّ صباح، يشرب القطّ الحليب ويلعب في الحديقة.",
      },
      {
        en: "At night, the little cat sleeps on a soft blue pillow.",
        fr: "La nuit, le petit chat dort sur un coussin bleu et doux.",
        ar: "في الليل، ينام القطّ الصغير على وسادة زرقاء ناعمة.",
      },
      {
        en: "The little cat is happy. The family loves the little cat.",
        fr: "Le petit chat est heureux. La famille aime le petit chat.",
        ar: "القطّ الصغير سعيد. العائلة تحبّ القطّ الصغير.",
      },
    ],
  },
  {
    slug: "my-friend-the-sun",
    title_en: "My Friend the Sun",
    title_fr: "Mon ami le soleil",
    title_ar: "صديقي الشمس",
    emoji: "☀️",
    color: "bg-amber-100 text-amber-900",
    level: "Easy+",
    paragraphs: [
      {
        en: "The sun is yellow and warm. The sun is my best friend.",
        fr: "Le soleil est jaune et chaud. Le soleil est mon meilleur ami.",
        ar: "الشمس صفراء ودافئة. الشمس صديقي المفضّل.",
      },
      {
        en: "Every day, the sun says good morning to the children.",
        fr: "Chaque jour, le soleil dit bonjour aux enfants.",
        ar: "كلّ يوم، تقول الشمس صباح الخير للأطفال.",
      },
      {
        en: "The sun makes the trees green and the flowers red.",
        fr: "Le soleil rend les arbres verts et les fleurs rouges.",
        ar: "الشمس تجعل الأشجار خضراء والأزهار حمراء.",
      },
      {
        en: "When the sun goes down, the moon and the stars come out.",
        fr: "Quand le soleil se couche, la lune et les étoiles apparaissent.",
        ar: "حين تغيب الشمس، يظهر القمر والنجوم.",
      },
      {
        en: "Tomorrow, the sun will smile at me again. I love the sun.",
        fr: "Demain, le soleil me sourira encore. J'aime le soleil.",
        ar: "غدًا، ستبتسم لي الشمس من جديد. أحبّ الشمس.",
      },
    ],
  },
  {
    slug: "brave-fennec",
    title_en: "The Brave Fennec",
    title_fr: "Le fennec courageux",
    title_ar: "الفنك الشجاع",
    emoji: "🦊",
    color: "bg-orange-100 text-orange-900",
    level: "Medium",
    paragraphs: [
      {
        en: "In the desert of Algeria, there lives a small fennec with big ears.",
        fr: "Dans le désert d'Algérie, vit un petit fennec aux grandes oreilles.",
        ar: "في صحراء الجزائر، يعيش فنك صغير بأذنين كبيرتين.",
      },
      {
        en: "The fennec is brave. He is not afraid of the wind or the sand.",
        fr: "Le fennec est courageux. Il n'a pas peur du vent ni du sable.",
        ar: "الفنك شجاع. لا يخاف من الريح ولا من الرمل.",
      },
      {
        en: "One night, a little girl was lost under the stars.",
        fr: "Une nuit, une petite fille s'était perdue sous les étoiles.",
        ar: "في إحدى الليالي، تاهت فتاة صغيرة تحت النجوم.",
      },
      {
        en: "The brave fennec heard her cry and ran to help.",
        fr: "Le fennec courageux entendit ses pleurs et accourut pour l'aider.",
        ar: "سمع الفنك الشجاع بكاءها وأسرع لمساعدتها.",
      },
      {
        en: "He guided her home. The girl said: thank you, my friend the fennec!",
        fr: "Il la guida jusqu'à sa maison. La fille dit : merci, mon ami le fennec !",
        ar: "أرشدها إلى بيتها. قالت الفتاة: شكرًا يا صديقي الفنك!",
      },
    ],
  },
];

export function getStory(slug: string): EnglishStory | undefined {
  return STORIES.find((s) => s.slug === slug);
}
