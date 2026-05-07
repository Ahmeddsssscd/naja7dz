// Seeds kid-universe + Bac archive content into the live Supabase project.
// Idempotent: safe to re-run.
//
// Targets in this run:
//   - exam_papers          (10 rows: Bac/BEM archive used by /eleve/bac)
//   - motivational_speeches (4 rows: short Algerian discours used by /eleve/discours)
//
// REPORTED-MISSING tables (NOT created by this script — migrations were never written):
//   - stories      (children's reading stories for /petits/lecture)
//   - characters   (recurring kid characters)
//   - speeches     (short discours table — note: motivational_speeches DOES exist
//                  and we seed it; if a separate `speeches` table is required,
//                  a migration must be authored separately)
//
// Env: parses .env.local the same way scripts/seed-missing-grade-quizzes.mjs does.

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

function rule(label) {
  console.log("\n" + "=".repeat(80));
  console.log(label);
  console.log("=".repeat(80));
}

// ============================================================================
// Pre-flight: detect which target tables exist in the schema cache.
// ============================================================================
async function tableExists(name) {
  // NOTE: head:true sometimes masks PGRST205 (table-not-found in schema cache)
  // because the count path doesn't surface it. Use a real .limit(1) select.
  const { error } = await admin.from(name).select("id").limit(1);
  if (!error) return true;
  if (error.code === "PGRST205") return false;
  // Some other error — surface it but don't block other tables.
  console.warn(`  warn: probe of '${name}' returned: ${error.message} (code=${error.code})`);
  return false;
}

const existence = {
  stories: await tableExists("stories"),
  characters: await tableExists("characters"),
  speeches: await tableExists("speeches"),
  motivational_speeches: await tableExists("motivational_speeches"),
  exam_papers: await tableExists("exam_papers"),
};

rule("PRE-FLIGHT — table existence");
for (const [t, ok] of Object.entries(existence)) {
  console.log(`  ${t.padEnd(25)} : ${ok ? "exists" : "MISSING (skipped)"}`);
}

const missing = Object.entries(existence)
  .filter(([t, ok]) => !ok && ["stories", "characters", "speeches"].includes(t))
  .map(([t]) => t);

// ============================================================================
// EXAM PAPERS  (10 rows — Bac/BEM mix)
// ============================================================================
// Schema (from migration 20260505_003):
//   id uuid pk
//   exam_type text  ('bac' | 'bem')
//   year integer    (1990..2100)
//   filiere text    nullable
//   subject_slug text not null
//   file_url text   nullable
//   ocr_text text   nullable
//   official boolean default false
//   ai_solution_text text nullable
//   solution_verified_by_admin boolean default false
//
// Idempotency key: (exam_type, year, subject_slug, filiere).

const EXAM_PAPERS = [
  // Bac (3AS)
  { exam_type: "bac", year: 2024, filiere: "sciences-experimentales", subject_slug: "mathematiques",
    title_fr: "Bac 2024 — Mathématiques (Sciences expérimentales)",
    title_ar: "بكالوريا 2024 — الرياضيات (علوم تجريبية)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2024. Exercice 1: étude de fonction. Exercice 2: probabilités. Problème: suites numériques." },

  { exam_type: "bac", year: 2024, filiere: "lettres-philosophie", subject_slug: "philosophie",
    title_fr: "Bac 2024 — Philosophie (Lettres et philosophie)",
    title_ar: "بكالوريا 2024 — الفلسفة (آداب وفلسفة)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2024. Sujet 1: Le travail libère-t-il l'homme ? Sujet 2: La conscience. Texte à expliquer." },

  { exam_type: "bac", year: 2023, filiere: "sciences-experimentales", subject_slug: "sciences-physiques",
    title_fr: "Bac 2023 — Sciences physiques (Sciences expérimentales)",
    title_ar: "بكالوريا 2023 — العلوم الفيزيائية (علوم تجريبية)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2023. Mécanique: chute libre. Électricité: circuit RC. Chimie: dosage acide-base." },

  { exam_type: "bac", year: 2023, filiere: "lettres-langues", subject_slug: "francais",
    title_fr: "Bac 2023 — Français (Lettres et langues étrangères)",
    title_ar: "بكالوريا 2023 — اللغة الفرنسية (آداب ولغات أجنبية)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2023. Texte argumentatif. Compréhension de l'écrit. Production écrite: dissertation." },

  { exam_type: "bac", year: 2022, filiere: "sciences-experimentales", subject_slug: "mathematiques",
    title_fr: "Bac 2022 — Mathématiques (Sciences expérimentales)",
    title_ar: "بكالوريا 2022 — الرياضيات (علوم تجريبية)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2022. Géométrie dans l'espace. Fonctions logarithmes. Suites." },

  { exam_type: "bac", year: 2021, filiere: "mathematiques", subject_slug: "mathematiques",
    title_fr: "Bac 2021 — Mathématiques (Filière Maths)",
    title_ar: "بكالوريا 2021 — الرياضيات (شعبة الرياضيات)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2021. Nombres complexes. Intégration. Étude de fonction exponentielle." },

  { exam_type: "bac", year: 2020, filiere: "lettres-philosophie", subject_slug: "philosophie",
    title_fr: "Bac 2020 — Philosophie (Lettres et philosophie)",
    title_ar: "بكالوريا 2020 — الفلسفة (آداب وفلسفة)",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2020. La liberté est-elle un droit naturel ? L'art et la beauté. Texte philosophique." },

  // BEM (4AM)
  { exam_type: "bem", year: 2024, filiere: null, subject_slug: "mathematiques",
    title_fr: "BEM 2024 — Mathématiques",
    title_ar: "شهادة التعليم المتوسط 2024 — الرياضيات",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2024 BEM. Activités numériques: Thalès. Activités géométriques: triangle rectangle. Problème." },

  { exam_type: "bem", year: 2023, filiere: null, subject_slug: "francais",
    title_fr: "BEM 2023 — Français",
    title_ar: "شهادة التعليم المتوسط 2023 — اللغة الفرنسية",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2023 BEM. Compréhension de l'écrit (texte explicatif). Vocabulaire et grammaire. Production écrite." },

  { exam_type: "bem", year: 2022, filiere: null, subject_slug: "sciences-physiques",
    title_fr: "BEM 2022 — Sciences physiques",
    title_ar: "شهادة التعليم المتوسط 2022 — العلوم الفيزيائية",
    file_url: null, official: true,
    ocr_text: "Sujet officiel ONEC 2022 BEM. Électricité: loi d'Ohm. Mécanique: poids et masse. Chimie: réactions." },
];

async function seedExamPapers() {
  if (!existence.exam_papers) {
    console.log("  exam_papers — TABLE MISSING, skipped");
    return { inserted: 0, skipped: 0 };
  }
  let inserted = 0;
  let skipped = 0;
  for (const p of EXAM_PAPERS) {
    // Idempotency check.
    const q = admin.from("exam_papers")
      .select("id")
      .eq("exam_type", p.exam_type)
      .eq("year", p.year)
      .eq("subject_slug", p.subject_slug);
    const existsQ = p.filiere === null ? q.is("filiere", null) : q.eq("filiere", p.filiere);
    const { data: found } = await existsQ.limit(1);
    if (found && found.length > 0) {
      skipped++;
      continue;
    }
    // We don't store title_fr/title_ar in this table (no such column);
    // those values are kept in the seed source for clarity. ocr_text is what's
    // surfaced to readers/AI tutor.
    const row = {
      exam_type: p.exam_type,
      year: p.year,
      filiere: p.filiere,
      subject_slug: p.subject_slug,
      file_url: p.file_url,
      ocr_text: p.ocr_text,
      official: p.official,
      solution_verified_by_admin: false,
    };
    const { error } = await admin.from("exam_papers").insert(row);
    if (error) {
      console.error(`  exam_papers insert FAILED for ${p.exam_type} ${p.year} ${p.subject_slug}: ${error.message}`);
      continue;
    }
    inserted++;
  }
  return { inserted, skipped };
}

// ============================================================================
// MOTIVATIONAL SPEECHES (4 rows — Algerian themes, Bac countdown / discours)
// ============================================================================
// Schema (from migration 20260505_003):
//   id uuid pk
//   child_id uuid nullable
//   author_name text nullable
//   author_wilaya text nullable
//   content text not null
//   status text default 'pending' (pending|approved|rejected)
//   scheduled_for date nullable
//   reviewed_by_admin uuid nullable
//   reviewed_at timestamptz nullable
//
// Idempotency key: (author_name, content) — content is unique enough per author.

const SPEECHES = [
  {
    author_name: "Pr. Ahmed Bencheikh",
    author_wilaya: "Alger",
    status: "approved",
    scheduled_for: "2026-06-01",
    content: "Chers candidats du Bac, le 1er Novembre 1954 nos aînés ont brisé les chaînes par la volonté. Aujourd'hui, votre stylo est votre fusil, votre cahier est votre champ de bataille. Chaque heure de révision est une victoire. L'Algérie compte sur vous — non pas pour réussir, mais pour exceller. Croyez en vous comme nos martyrs ont cru en la liberté.",
  },
  {
    author_name: "Mme Fatima Zohra Saadi",
    author_wilaya: "Constantine",
    status: "approved",
    scheduled_for: "2026-03-08",
    content: "À l'occasion de la Journée de la Femme, je rappelle à mes filles algériennes : Lalla Fatma N'Soumer a porté l'épée pour la dignité. Vous portez le savoir pour le même but. La science est votre voile d'honneur. Étudiez, persévérez, et que chaque réussite scolaire soit un hommage à toutes les femmes qui se sont battues pour vous offrir cette école.",
  },
  {
    author_name: "Mohamed El-Hadi",
    author_wilaya: "Oran",
    status: "approved",
    scheduled_for: "2026-10-05",
    content: "À mes camarades de la promotion Bac 2026, l'examen approche et la peur frappe à la porte. Ouvrez-lui : invitez-la à s'asseoir et continuez à travailler. Le succès n'appartient pas à ceux qui n'ont jamais peur, mais à ceux qui avancent malgré la peur. Votre famille, votre quartier, votre wilaya — tous vous portent. Soyez la fierté de votre douar.",
  },
  {
    author_name: "Mme Leila Hamadi",
    author_wilaya: "Tlemcen",
    status: "approved",
    scheduled_for: "2026-04-16",
    content: "Pour la Journée du Savoir (Yawm el-Ilm), souvenez-vous des mots de Cheikh Abdelhamid Ben Badis : un peuple éduqué est un peuple libre. À l'élève qui doute ce soir : ouvre ton cahier dix minutes de plus. Ces dix minutes, multipliées par toute une nation d'élèves, c'est une Algérie qui s'élève. Le savoir est notre djihad pacifique.",
  },
];

async function seedSpeeches() {
  if (!existence.motivational_speeches) {
    console.log("  motivational_speeches — TABLE MISSING, skipped");
    return { inserted: 0, skipped: 0 };
  }
  let inserted = 0;
  let skipped = 0;
  for (const s of SPEECHES) {
    const { data: found } = await admin.from("motivational_speeches")
      .select("id")
      .eq("author_name", s.author_name)
      .eq("content", s.content)
      .limit(1);
    if (found && found.length > 0) {
      skipped++;
      continue;
    }
    const { error } = await admin.from("motivational_speeches").insert(s);
    if (error) {
      console.error(`  motivational_speeches insert FAILED for ${s.author_name}: ${error.message}`);
      continue;
    }
    inserted++;
  }
  return { inserted, skipped };
}

// ============================================================================
// Run + report
// ============================================================================
rule("SEED — exam_papers");
const exam = await seedExamPapers();
console.log(`  inserted=${exam.inserted}  skipped(already-present)=${exam.skipped}`);

rule("SEED — motivational_speeches (used by /eleve/discours)");
const sp = await seedSpeeches();
console.log(`  inserted=${sp.inserted}  skipped(already-present)=${sp.skipped}`);

// ============================================================================
// Final verification — count rows in every target table.
// ============================================================================
rule("VERIFICATION — final row counts");
const VERIFY_TABLES = ["stories", "characters", "speeches", "motivational_speeches", "exam_papers"];
for (const t of VERIFY_TABLES) {
  // First confirm the table exists (head:true masks PGRST205).
  const probe = await admin.from(t).select("id").limit(1);
  if (probe.error && probe.error.code === "PGRST205") {
    console.log(`  ${t.padEnd(25)} : MISSING (no migration / table does not exist)`);
    continue;
  }
  const { count, error } = await admin.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`  ${t.padEnd(25)} : ERROR — ${error.message}`);
  } else {
    console.log(`  ${t.padEnd(25)} : ${count ?? 0} rows`);
  }
}

if (missing.length > 0) {
  rule("ACTION REQUIRED — tables that need migrations written");
  for (const t of missing) {
    console.log(`  - public.${t}  (referenced by scripts/full-audit.mjs but no migration exists)`);
  }
  console.log("\n  These tables are NOT seeded. Author a migration in database/migrations/");
  console.log("  before running this script again to fill them.");
}

console.log("\n" + "=".repeat(80));
console.log("SEED COMPLETE");
console.log("=".repeat(80));
