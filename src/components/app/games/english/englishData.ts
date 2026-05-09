/**
 * Shared data for the kids' English learning section (`/petits/anglais`).
 *
 * Audience: Algerian kids 5–12 yo. They speak French + Arabic at home and
 * learn English as a 3rd language at school (introduced from 3AP).
 *
 * Every word carries:
 *  - en : the English word (used by TTS — `lang = "en-US"`)
 *  - fr : the French translation (default UI language for the kid)
 *  - ar : the Arabic translation (shown alongside FR for full bilingual context)
 *  - emoji : an inline icon — kids learn faster when each word has a face
 *
 * The shape is reused by:
 *  - lesson pages (one Card per row)
 *  - the EnglishFlashcards game (rotates through cards)
 *  - the EnglishListenPick game (TTS plays `en`, options shown as text + emoji)
 *  - the EnglishPronunciation game (cycles through every lesson's vocab)
 */

export interface EnglishCard {
  en: string;
  fr: string;
  ar: string;
  emoji: string;
  /**
   * Optional example sentence in English. Used only by the alphabet lesson
   * ("A is for Apple") and a few flashcards.
   */
  example?: string;
}

export interface EnglishLesson {
  /** URL slug under /petits/anglais/{slug}. */
  slug: string;
  /** i18n key suffix — `lesson_${slug}` resolved via the PetitsAnglais namespace. */
  i18nKey: string;
  /** Single emoji shown on the lesson tile. */
  emoji: string;
  /** Two-tone Tailwind background (matches the kids hub palette). */
  color: string;
  /** Vocabulary (8–26 entries). */
  cards: EnglishCard[];
}

// ---------------------------------------------------------------------------
// 1. Alphabet — 26 letters, one canonical word per letter (kindergarten style)
// ---------------------------------------------------------------------------
export const ALPHABET_LESSON: EnglishLesson = {
  slug: "alphabet",
  i18nKey: "alphabet",
  emoji: "🔤",
  color: "bg-rose-100 text-rose-900",
  cards: [
    { en: "Apple", fr: "Pomme", ar: "تفّاحة", emoji: "🍎", example: "A is for Apple" },
    { en: "Ball", fr: "Ballon", ar: "كرة", emoji: "⚽", example: "B is for Ball" },
    { en: "Cat", fr: "Chat", ar: "قطّ", emoji: "🐱", example: "C is for Cat" },
    { en: "Dog", fr: "Chien", ar: "كلب", emoji: "🐶", example: "D is for Dog" },
    { en: "Elephant", fr: "Éléphant", ar: "فيل", emoji: "🐘", example: "E is for Elephant" },
    { en: "Fish", fr: "Poisson", ar: "سمكة", emoji: "🐟", example: "F is for Fish" },
    { en: "Goat", fr: "Chèvre", ar: "ماعز", emoji: "🐐", example: "G is for Goat" },
    { en: "Hat", fr: "Chapeau", ar: "قبّعة", emoji: "🎩", example: "H is for Hat" },
    { en: "Ice", fr: "Glace", ar: "ثلج", emoji: "🧊", example: "I is for Ice" },
    { en: "Juice", fr: "Jus", ar: "عصير", emoji: "🧃", example: "J is for Juice" },
    { en: "Kite", fr: "Cerf-volant", ar: "طائرة ورقيّة", emoji: "🪁", example: "K is for Kite" },
    { en: "Lion", fr: "Lion", ar: "أسد", emoji: "🦁", example: "L is for Lion" },
    { en: "Moon", fr: "Lune", ar: "قمر", emoji: "🌙", example: "M is for Moon" },
    { en: "Nest", fr: "Nid", ar: "عشّ", emoji: "🪺", example: "N is for Nest" },
    { en: "Orange", fr: "Orange", ar: "برتقال", emoji: "🍊", example: "O is for Orange" },
    { en: "Pen", fr: "Stylo", ar: "قلم", emoji: "🖊️", example: "P is for Pen" },
    { en: "Queen", fr: "Reine", ar: "ملكة", emoji: "👑", example: "Q is for Queen" },
    { en: "Rain", fr: "Pluie", ar: "مطر", emoji: "🌧️", example: "R is for Rain" },
    { en: "Sun", fr: "Soleil", ar: "شمس", emoji: "☀️", example: "S is for Sun" },
    { en: "Tree", fr: "Arbre", ar: "شجرة", emoji: "🌳", example: "T is for Tree" },
    { en: "Umbrella", fr: "Parapluie", ar: "مظلّة", emoji: "☂️", example: "U is for Umbrella" },
    { en: "Van", fr: "Camionnette", ar: "شاحنة صغيرة", emoji: "🚐", example: "V is for Van" },
    { en: "Water", fr: "Eau", ar: "ماء", emoji: "💧", example: "W is for Water" },
    { en: "Box", fr: "Boîte", ar: "صندوق", emoji: "📦", example: "X is in Box" },
    { en: "Yarn", fr: "Laine", ar: "خيط صوف", emoji: "🧶", example: "Y is for Yarn" },
    { en: "Zebra", fr: "Zèbre", ar: "حمار وحشي", emoji: "🦓", example: "Z is for Zebra" },
  ],
};

// ---------------------------------------------------------------------------
// 2. Numbers — 1 to 20 + tens up to 100 (24 cards)
// ---------------------------------------------------------------------------
export const NUMBERS_LESSON: EnglishLesson = {
  slug: "numbers",
  i18nKey: "numbers",
  emoji: "🔢",
  color: "bg-sky-100 text-sky-900",
  cards: [
    { en: "One", fr: "Un", ar: "واحد", emoji: "1️⃣" },
    { en: "Two", fr: "Deux", ar: "اثنان", emoji: "2️⃣" },
    { en: "Three", fr: "Trois", ar: "ثلاثة", emoji: "3️⃣" },
    { en: "Four", fr: "Quatre", ar: "أربعة", emoji: "4️⃣" },
    { en: "Five", fr: "Cinq", ar: "خمسة", emoji: "5️⃣" },
    { en: "Six", fr: "Six", ar: "ستّة", emoji: "6️⃣" },
    { en: "Seven", fr: "Sept", ar: "سبعة", emoji: "7️⃣" },
    { en: "Eight", fr: "Huit", ar: "ثمانية", emoji: "8️⃣" },
    { en: "Nine", fr: "Neuf", ar: "تسعة", emoji: "9️⃣" },
    { en: "Ten", fr: "Dix", ar: "عشرة", emoji: "🔟" },
    { en: "Eleven", fr: "Onze", ar: "أحد عشر", emoji: "1️⃣1️⃣" },
    { en: "Twelve", fr: "Douze", ar: "اثنا عشر", emoji: "1️⃣2️⃣" },
    { en: "Thirteen", fr: "Treize", ar: "ثلاثة عشر", emoji: "1️⃣3️⃣" },
    { en: "Fourteen", fr: "Quatorze", ar: "أربعة عشر", emoji: "1️⃣4️⃣" },
    { en: "Fifteen", fr: "Quinze", ar: "خمسة عشر", emoji: "1️⃣5️⃣" },
    { en: "Sixteen", fr: "Seize", ar: "ستّة عشر", emoji: "1️⃣6️⃣" },
    { en: "Seventeen", fr: "Dix-sept", ar: "سبعة عشر", emoji: "1️⃣7️⃣" },
    { en: "Eighteen", fr: "Dix-huit", ar: "ثمانية عشر", emoji: "1️⃣8️⃣" },
    { en: "Nineteen", fr: "Dix-neuf", ar: "تسعة عشر", emoji: "1️⃣9️⃣" },
    { en: "Twenty", fr: "Vingt", ar: "عشرون", emoji: "2️⃣0️⃣" },
    { en: "Thirty", fr: "Trente", ar: "ثلاثون", emoji: "3️⃣0️⃣" },
    { en: "Fifty", fr: "Cinquante", ar: "خمسون", emoji: "5️⃣0️⃣" },
    { en: "Seventy", fr: "Soixante-dix", ar: "سبعون", emoji: "7️⃣0️⃣" },
    { en: "Hundred", fr: "Cent", ar: "مئة", emoji: "💯" },
  ],
};

// ---------------------------------------------------------------------------
// 3. Colors — 10 basic colors. Emojis use coloured dots so RTL renders ok.
// ---------------------------------------------------------------------------
export const COLORS_LESSON: EnglishLesson = {
  slug: "colors",
  i18nKey: "colors",
  emoji: "🎨",
  color: "bg-fuchsia-100 text-fuchsia-900",
  cards: [
    { en: "Red", fr: "Rouge", ar: "أحمر", emoji: "🔴" },
    { en: "Blue", fr: "Bleu", ar: "أزرق", emoji: "🔵" },
    { en: "Green", fr: "Vert", ar: "أخضر", emoji: "🟢" },
    { en: "Yellow", fr: "Jaune", ar: "أصفر", emoji: "🟡" },
    { en: "Black", fr: "Noir", ar: "أسود", emoji: "⚫" },
    { en: "White", fr: "Blanc", ar: "أبيض", emoji: "⚪" },
    { en: "Orange", fr: "Orange", ar: "برتقالي", emoji: "🟠" },
    { en: "Purple", fr: "Violet", ar: "بنفسجي", emoji: "🟣" },
    { en: "Pink", fr: "Rose", ar: "وردي", emoji: "🌸" },
    { en: "Brown", fr: "Marron", ar: "بنّي", emoji: "🟤" },
  ],
};

// ---------------------------------------------------------------------------
// 4. Family — 8 core members (no spouses/in-laws — kid friendly)
// ---------------------------------------------------------------------------
export const FAMILY_LESSON: EnglishLesson = {
  slug: "family",
  i18nKey: "family",
  emoji: "👨‍👩‍👧‍👦",
  color: "bg-amber-100 text-amber-900",
  cards: [
    { en: "Mother", fr: "Mère", ar: "أمّ", emoji: "👩" },
    { en: "Father", fr: "Père", ar: "أب", emoji: "👨" },
    { en: "Brother", fr: "Frère", ar: "أخ", emoji: "👦" },
    { en: "Sister", fr: "Sœur", ar: "أخت", emoji: "👧" },
    { en: "Grandma", fr: "Grand-mère", ar: "جدّة", emoji: "👵" },
    { en: "Grandpa", fr: "Grand-père", ar: "جدّ", emoji: "👴" },
    { en: "Uncle", fr: "Oncle", ar: "عمّ", emoji: "🧔" },
    { en: "Aunt", fr: "Tante", ar: "عمّة", emoji: "👩‍🦰" },
  ],
};

// ---------------------------------------------------------------------------
// 5. School — 8 classroom items
// ---------------------------------------------------------------------------
export const SCHOOL_LESSON: EnglishLesson = {
  slug: "school",
  i18nKey: "school",
  emoji: "🎒",
  color: "bg-emerald-100 text-emerald-900",
  cards: [
    { en: "Teacher", fr: "Professeur", ar: "أستاذ", emoji: "👨‍🏫" },
    { en: "Student", fr: "Élève", ar: "تلميذ", emoji: "🧑‍🎓" },
    { en: "Book", fr: "Livre", ar: "كتاب", emoji: "📖" },
    { en: "Pen", fr: "Stylo", ar: "قلم", emoji: "🖊️" },
    { en: "Desk", fr: "Bureau", ar: "مكتب", emoji: "🪑" },
    { en: "Chair", fr: "Chaise", ar: "كرسي", emoji: "💺" },
    { en: "Board", fr: "Tableau", ar: "سبّورة", emoji: "📋" },
    { en: "Classroom", fr: "Salle de classe", ar: "قسم", emoji: "🏫" },
  ],
};

// ---------------------------------------------------------------------------
// 6. Food — 8 staples (Algerian breakfast vibes)
// ---------------------------------------------------------------------------
export const FOOD_LESSON: EnglishLesson = {
  slug: "food",
  i18nKey: "food",
  emoji: "🍞",
  color: "bg-orange-100 text-orange-900",
  cards: [
    { en: "Apple", fr: "Pomme", ar: "تفّاحة", emoji: "🍎" },
    { en: "Bread", fr: "Pain", ar: "خبز", emoji: "🍞" },
    { en: "Milk", fr: "Lait", ar: "حليب", emoji: "🥛" },
    { en: "Water", fr: "Eau", ar: "ماء", emoji: "💧" },
    { en: "Rice", fr: "Riz", ar: "أرز", emoji: "🍚" },
    { en: "Meat", fr: "Viande", ar: "لحم", emoji: "🥩" },
    { en: "Cheese", fr: "Fromage", ar: "جبن", emoji: "🧀" },
    { en: "Egg", fr: "Œuf", ar: "بيضة", emoji: "🥚" },
  ],
};

// ---------------------------------------------------------------------------
// 7. Animals — 8 (mix of common & big-cat favourites)
// ---------------------------------------------------------------------------
export const ANIMALS_LESSON: EnglishLesson = {
  slug: "animals",
  i18nKey: "animals",
  emoji: "🦁",
  color: "bg-yellow-100 text-yellow-900",
  cards: [
    { en: "Dog", fr: "Chien", ar: "كلب", emoji: "🐶" },
    { en: "Cat", fr: "Chat", ar: "قطّ", emoji: "🐱" },
    { en: "Bird", fr: "Oiseau", ar: "طائر", emoji: "🐦" },
    { en: "Fish", fr: "Poisson", ar: "سمكة", emoji: "🐟" },
    { en: "Lion", fr: "Lion", ar: "أسد", emoji: "🦁" },
    { en: "Elephant", fr: "Éléphant", ar: "فيل", emoji: "🐘" },
    { en: "Monkey", fr: "Singe", ar: "قرد", emoji: "🐵" },
    { en: "Horse", fr: "Cheval", ar: "حصان", emoji: "🐴" },
  ],
};

// ---------------------------------------------------------------------------
// 8. Days & Months — 7 days + 12 months (19 cards)
// ---------------------------------------------------------------------------
export const TIME_LESSON: EnglishLesson = {
  slug: "days-months",
  i18nKey: "days_months",
  emoji: "📅",
  color: "bg-violet-100 text-violet-900",
  cards: [
    { en: "Monday", fr: "Lundi", ar: "الاثنين", emoji: "📅" },
    { en: "Tuesday", fr: "Mardi", ar: "الثلاثاء", emoji: "📅" },
    { en: "Wednesday", fr: "Mercredi", ar: "الأربعاء", emoji: "📅" },
    { en: "Thursday", fr: "Jeudi", ar: "الخميس", emoji: "📅" },
    { en: "Friday", fr: "Vendredi", ar: "الجمعة", emoji: "📅" },
    { en: "Saturday", fr: "Samedi", ar: "السبت", emoji: "📅" },
    { en: "Sunday", fr: "Dimanche", ar: "الأحد", emoji: "📅" },
    { en: "January", fr: "Janvier", ar: "يناير", emoji: "❄️" },
    { en: "February", fr: "Février", ar: "فبراير", emoji: "❄️" },
    { en: "March", fr: "Mars", ar: "مارس", emoji: "🌷" },
    { en: "April", fr: "Avril", ar: "أبريل", emoji: "🌷" },
    { en: "May", fr: "Mai", ar: "مايو", emoji: "🌼" },
    { en: "June", fr: "Juin", ar: "يونيو", emoji: "☀️" },
    { en: "July", fr: "Juillet", ar: "يوليو", emoji: "☀️" },
    { en: "August", fr: "Août", ar: "أغسطس", emoji: "☀️" },
    { en: "September", fr: "Septembre", ar: "سبتمبر", emoji: "🍂" },
    { en: "October", fr: "Octobre", ar: "أكتوبر", emoji: "🍂" },
    { en: "November", fr: "Novembre", ar: "نوفمبر", emoji: "🍁" },
    { en: "December", fr: "Décembre", ar: "ديسمبر", emoji: "🎄" },
  ],
};

export const ALL_LESSONS: EnglishLesson[] = [
  ALPHABET_LESSON,
  NUMBERS_LESSON,
  COLORS_LESSON,
  FAMILY_LESSON,
  SCHOOL_LESSON,
  FOOD_LESSON,
  ANIMALS_LESSON,
  TIME_LESSON,
];

export function getLesson(slug: string): EnglishLesson | undefined {
  return ALL_LESSONS.find((l) => l.slug === slug);
}

/** Pool of every card across every lesson — used by the pronunciation game. */
export function allCards(): EnglishCard[] {
  return ALL_LESSONS.flatMap((l) => l.cards);
}
