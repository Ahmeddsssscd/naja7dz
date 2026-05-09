/**
 * Server-safe quiz metadata. Lives in its own module so that server
 * components (the /petits/anglais hub) can import the list without pulling
 * in the client-only EnglishQuiz.tsx (which loads canvas-confetti at module
 * scope and breaks SSR).
 *
 * The actual EnglishQuiz client component reads this same metadata for its
 * runtime quiz data + names.
 */

import {
  ANIMALS_LESSON,
  COLORS_LESSON,
  FAMILY_LESSON,
  SCHOOL_LESSON,
  FOOD_LESSON,
  NUMBERS_LESSON,
  type EnglishCard,
} from "./englishData";

export interface QuizDef {
  name_fr: string;
  name_ar: string;
  emoji: string;
  pool: EnglishCard[];
}

export const QUIZZES: Record<string, QuizDef> = {
  "colors-animals": {
    name_fr: "Couleurs & Animaux",
    name_ar: "ألوان وحيوانات",
    emoji: "🌈🦁",
    pool: [...COLORS_LESSON.cards, ...ANIMALS_LESSON.cards],
  },
  "family-school": {
    name_fr: "Famille & École",
    name_ar: "العائلة والمدرسة",
    emoji: "👨‍👩‍👧‍👦🎒",
    pool: [...FAMILY_LESSON.cards, ...SCHOOL_LESSON.cards],
  },
  "food-numbers": {
    name_fr: "Nourriture & Nombres",
    name_ar: "طعام وأرقام",
    emoji: "🍞🔢",
    pool: [...FOOD_LESSON.cards, ...NUMBERS_LESSON.cards],
  },
};

export const QUIZ_IDS = Object.keys(QUIZZES);
export const QUIZ_META: Record<string, { name_fr: string; name_ar: string; emoji: string }> =
  Object.fromEntries(
    Object.entries(QUIZZES).map(([k, v]) => [
      k,
      { name_fr: v.name_fr, name_ar: v.name_ar, emoji: v.emoji },
    ]),
  );
