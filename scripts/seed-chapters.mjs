// Seed sample chapters for the major Mathematics subjects so the curriculum
// has at least some real content. Idempotent — uses upsert on (subject_id, slug).
//
// Run: node scripts/seed-chapters.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Sample curriculum based on Algerian official program. Not exhaustive — kept
// short on purpose; admin can add the rest from the UI.
const CURRICULUM = {
  // Format: { gradeCode: { mathName: [chapters], ... } }
  "1AP": {
    "Mathématiques": [
      { slug: "nombres-1-9", title_fr: "Les nombres de 1 à 9", title_ar: "الأعداد من 1 إلى 9" },
      { slug: "nombres-10-99", title_fr: "Les nombres de 10 à 99", title_ar: "الأعداد من 10 إلى 99" },
      { slug: "addition-soustraction", title_fr: "Addition et soustraction simples", title_ar: "الجمع والطرح البسيط" },
      { slug: "formes", title_fr: "Les formes géométriques", title_ar: "الأشكال الهندسية" },
    ],
  },
  "3AP": {
    "Mathématiques": [
      { slug: "nombres-1000", title_fr: "Les nombres jusqu'à 1000", title_ar: "الأعداد حتى 1000" },
      { slug: "multiplication", title_fr: "La multiplication", title_ar: "الضرب" },
      { slug: "division", title_fr: "La division", title_ar: "القسمة" },
      { slug: "mesures", title_fr: "Les mesures (longueur, masse)", title_ar: "القياسات (الطول، الكتلة)" },
      { slug: "angles", title_fr: "Les angles", title_ar: "الزوايا" },
    ],
  },
  "5AP": {
    "Mathématiques": [
      { slug: "fractions", title_fr: "Les fractions", title_ar: "الكسور" },
      { slug: "decimaux", title_fr: "Les nombres décimaux", title_ar: "الأعداد العشرية" },
      { slug: "pourcentages", title_fr: "Les pourcentages", title_ar: "النسب المئوية" },
      { slug: "perimetre-aire", title_fr: "Périmètre et aire", title_ar: "المحيط والمساحة" },
      { slug: "symetrie", title_fr: "La symétrie", title_ar: "التناظر" },
    ],
  },
  "1AM": {
    "Mathématiques": [
      { slug: "nombres-relatifs", title_fr: "Les nombres relatifs", title_ar: "الأعداد النسبية" },
      { slug: "puissances", title_fr: "Puissances de 10", title_ar: "قوى العدد 10" },
      { slug: "proportionnalite", title_fr: "La proportionnalité", title_ar: "التناسب" },
      { slug: "triangle", title_fr: "Le triangle", title_ar: "المثلث" },
      { slug: "statistiques-1am", title_fr: "Statistiques", title_ar: "الإحصاء" },
    ],
  },
  "4AM": {
    "Mathématiques": [
      { slug: "calcul-litteral", title_fr: "Calcul littéral", title_ar: "الحساب الحرفي" },
      { slug: "equations-1er-degre", title_fr: "Équations du 1er degré", title_ar: "معادلات الدرجة الأولى" },
      { slug: "thales", title_fr: "Théorème de Thalès", title_ar: "نظرية طاليس" },
      { slug: "trigonometrie-base", title_fr: "Trigonométrie (base)", title_ar: "علم المثلثات (أساسيات)" },
      { slug: "fonctions-lineaires", title_fr: "Fonctions linéaires", title_ar: "الدوال الخطية" },
    ],
  },
  "1AS": {
    "Mathématiques": [
      { slug: "ensembles-nombres", title_fr: "Ensembles de nombres", title_ar: "مجموعات الأعداد" },
      { slug: "polynomes", title_fr: "Polynômes du 2nd degré", title_ar: "كثيرات الحدود من الدرجة الثانية" },
      { slug: "trigonometrie-1as", title_fr: "Trigonométrie", title_ar: "علم المثلثات" },
      { slug: "geometrie-plan", title_fr: "Géométrie dans le plan", title_ar: "الهندسة في المستوي" },
    ],
  },
  "3AS": {
    "Mathématiques": [
      { slug: "limites", title_fr: "Limites de fonctions", title_ar: "نهايات الدوال" },
      { slug: "derivation", title_fr: "Dérivation", title_ar: "الاشتقاق" },
      { slug: "primitives", title_fr: "Primitives et intégrales", title_ar: "الدوال الأصلية والتكامل" },
      { slug: "exponentielle", title_fr: "Fonction exponentielle", title_ar: "الدالة الأسية" },
      { slug: "logarithme", title_fr: "Fonction logarithme", title_ar: "الدالة اللوغاريتمية" },
      { slug: "complexes", title_fr: "Nombres complexes", title_ar: "الأعداد العقدية" },
      { slug: "probabilites", title_fr: "Probabilités", title_ar: "الاحتمالات" },
      { slug: "suites", title_fr: "Suites numériques", title_ar: "المتتاليات العددية" },
    ],
  },
};

let added = 0;
let skipped = 0;

for (const [grade, subjects] of Object.entries(CURRICULUM)) {
  for (const [subjectName, chapters] of Object.entries(subjects)) {
    // Find the subject row.
    const { data: subj, error: sErr } = await admin
      .from("subjects")
      .select("id")
      .eq("grade_code", grade)
      .eq("name_fr", subjectName)
      .maybeSingle();
    if (sErr || !subj) {
      console.warn(`[skip] subject not found: ${grade} / ${subjectName}`);
      skipped += chapters.length;
      continue;
    }

    let i = 0;
    for (const ch of chapters) {
      const { error: upErr } = await admin
        .from("chapters")
        .upsert(
          {
            subject_id: subj.id,
            slug: ch.slug,
            title_fr: ch.title_fr,
            title_ar: ch.title_ar,
            sort_order: i,
          },
          { onConflict: "subject_id,slug" }
        );
      if (upErr) {
        console.error(`[fail] ${grade}/${subjectName}/${ch.slug}: ${upErr.message}`);
      } else {
        added++;
      }
      i++;
    }
    console.log(`✓ ${grade} / ${subjectName}: ${chapters.length} chapter(s)`);
  }
}

console.log(`\nDone. ${added} chapter(s) upserted, ${skipped} skipped.`);
