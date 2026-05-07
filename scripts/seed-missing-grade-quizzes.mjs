// Seeds chapters + quiz_questions for grades that currently have 0 quiz-ready
// chapters. Idempotent: safe to re-run, will only insert what's missing.
//
// Targets: 2AP, 2AM, 2AS, 3AM, 4AP — math subject only (the most universal).
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

// Per-grade math chapters with question pools. Kept small but >=3 questions
// per chapter so the player will accept them.
const SEED = {
  "2AP": [
    {
      slug: "2ap-nombres-100-999",
      title_fr: "Les nombres jusqu'à 999",
      title_ar: "الأعداد إلى 999",
      questions: [
        { fr: "Combien fait 200 + 50 ?", ar: "كم يساوي 200 + 50 ؟", opt_fr: ["240","250","260","270"], opt_ar: ["240","250","260","270"], correct: 1 },
        { fr: "Quel est le chiffre des centaines dans 357 ?", ar: "ما هو رقم المئات في 357 ؟", opt_fr: ["3","5","7","357"], opt_ar: ["3","5","7","357"], correct: 0 },
        { fr: "120 + 80 = ?", ar: "120 + 80 = ؟", opt_fr: ["190","200","210","220"], opt_ar: ["190","200","210","220"], correct: 1 },
        { fr: "Quel nombre vient juste après 499 ?", ar: "ما هو العدد الذي يأتي بعد 499 ؟", opt_fr: ["498","500","501","510"], opt_ar: ["498","500","501","510"], correct: 1 },
      ],
    },
    {
      slug: "2ap-addition-soustraction",
      title_fr: "Addition et soustraction posées",
      title_ar: "الجمع والطرح بالعمود",
      questions: [
        { fr: "147 + 235 = ?", ar: "147 + 235 = ؟", opt_fr: ["372","382","392","482"], opt_ar: ["372","382","392","482"], correct: 1 },
        { fr: "560 - 234 = ?", ar: "560 - 234 = ؟", opt_fr: ["316","326","336","426"], opt_ar: ["316","326","336","426"], correct: 1 },
        { fr: "85 + 65 = ?", ar: "85 + 65 = ؟", opt_fr: ["140","145","150","155"], opt_ar: ["140","145","150","155"], correct: 2 },
        { fr: "300 - 175 = ?", ar: "300 - 175 = ؟", opt_fr: ["115","125","135","145"], opt_ar: ["115","125","135","145"], correct: 1 },
      ],
    },
  ],
  "4AP": [
    {
      slug: "4ap-nombres-decimaux",
      title_fr: "Découverte des nombres décimaux",
      title_ar: "اكتشاف الأعداد العشرية",
      questions: [
        { fr: "Quelle est la partie décimale de 12,375 ?", ar: "ما الجزء العشري للعدد 12,375 ؟", opt_fr: ["12","375","0,375","0,12"], opt_ar: ["12","375","0,375","0,12"], correct: 2 },
        { fr: "0,1 + 0,1 = ?", ar: "0,1 + 0,1 = ؟", opt_fr: ["0,01","0,2","1","2"], opt_ar: ["0,01","0,2","1","2"], correct: 1 },
        { fr: "Quel est le double de 2,5 ?", ar: "ما ضعف 2,5 ؟", opt_fr: ["4","4,5","5","5,5"], opt_ar: ["4","4,5","5","5,5"], correct: 2 },
        { fr: "Range dans l'ordre croissant : 3,2 ; 3,02 ; 3,20", ar: "رتّب تصاعدياً: 3,2 ; 3,02 ; 3,20", opt_fr: ["3,02 < 3,2 = 3,20","3,2 < 3,02 < 3,20","3,20 < 3,2 < 3,02","3,02 < 3,20 < 3,2"], opt_ar: ["3,02 < 3,2 = 3,20","3,2 < 3,02 < 3,20","3,20 < 3,2 < 3,02","3,02 < 3,20 < 3,2"], correct: 0 },
      ],
    },
    {
      slug: "4ap-multiplication-division",
      title_fr: "Multiplication et division",
      title_ar: "الضرب والقسمة",
      questions: [
        { fr: "27 × 4 = ?", ar: "27 × 4 = ؟", opt_fr: ["88","98","108","118"], opt_ar: ["88","98","108","118"], correct: 2 },
        { fr: "144 ÷ 12 = ?", ar: "144 ÷ 12 = ؟", opt_fr: ["10","11","12","14"], opt_ar: ["10","11","12","14"], correct: 2 },
        { fr: "Combien font 9 × 9 ?", ar: "كم يساوي 9 × 9 ؟", opt_fr: ["72","81","90","99"], opt_ar: ["72","81","90","99"], correct: 1 },
        { fr: "Le quotient de 100 par 25 est :", ar: "ناتج قسمة 100 على 25 هو :", opt_fr: ["2","3","4","5"], opt_ar: ["2","3","4","5"], correct: 2 },
      ],
    },
  ],
  "2AM": [
    {
      slug: "2am-nombres-rationnels",
      title_fr: "Nombres rationnels",
      title_ar: "الأعداد الناطقة",
      questions: [
        { fr: "Simplifie 8/12 :", ar: "بسّط 8/12 :", opt_fr: ["1/2","2/3","3/4","4/6"], opt_ar: ["1/2","2/3","3/4","4/6"], correct: 1 },
        { fr: "1/2 + 1/3 = ?", ar: "1/2 + 1/3 = ؟", opt_fr: ["1/5","2/5","5/6","2/6"], opt_ar: ["1/5","2/5","5/6","2/6"], correct: 2 },
        { fr: "L'opposé de -3/4 est :", ar: "نظير -3/4 هو :", opt_fr: ["-4/3","3/4","4/3","-3/-4"], opt_ar: ["-4/3","3/4","4/3","-3/-4"], correct: 1 },
        { fr: "2/3 × 3/4 = ?", ar: "2/3 × 3/4 = ؟", opt_fr: ["1/2","5/12","6/12","2/4"], opt_ar: ["1/2","5/12","6/12","2/4"], correct: 0 },
      ],
    },
    {
      slug: "2am-theoreme-pythagore",
      title_fr: "Théorème de Pythagore",
      title_ar: "نظرية فيثاغورس",
      questions: [
        { fr: "Dans un triangle rectangle de côtés 3 et 4, l'hypoténuse vaut :", ar: "في مثلث قائم ضلعاه 3 و 4، الوتر يساوي :", opt_fr: ["5","6","7","12"], opt_ar: ["5","6","7","12"], correct: 0 },
        { fr: "Si l'hypoténuse vaut 13 et un côté 5, l'autre côté vaut :", ar: "إذا كان الوتر 13 وأحد الضلعين 5، فالضلع الآخر يساوي :", opt_fr: ["8","10","12","18"], opt_ar: ["8","10","12","18"], correct: 2 },
        { fr: "5² + 12² = ?", ar: "5² + 12² = ؟", opt_fr: ["119","169","144","289"], opt_ar: ["119","169","144","289"], correct: 1 },
        { fr: "Le théorème de Pythagore s'applique :", ar: "نظرية فيثاغورس تُطبَّق :", opt_fr: ["À tout triangle","Aux triangles isocèles","Aux triangles rectangles","Aux triangles équilatéraux"], opt_ar: ["على كل المثلثات","على المثلثات متساوية الساقين","على المثلثات قائمة الزاوية","على المثلثات متساوية الأضلاع"], correct: 2 },
      ],
    },
  ],
  "3AM": [
    {
      slug: "3am-equations",
      title_fr: "Équations du premier degré",
      title_ar: "معادلات من الدرجة الأولى",
      questions: [
        { fr: "Résous : 2x + 3 = 11", ar: "حلّ : 2x + 3 = 11", opt_fr: ["x = 3","x = 4","x = 5","x = 7"], opt_ar: ["x = 3","x = 4","x = 5","x = 7"], correct: 1 },
        { fr: "Résous : 5x - 2 = 13", ar: "حلّ : 5x - 2 = 13", opt_fr: ["x = 2","x = 3","x = 4","x = 5"], opt_ar: ["x = 2","x = 3","x = 4","x = 5"], correct: 1 },
        { fr: "Résous : 3(x + 2) = 18", ar: "حلّ : 3(x + 2) = 18", opt_fr: ["x = 3","x = 4","x = 6","x = 8"], opt_ar: ["x = 3","x = 4","x = 6","x = 8"], correct: 1 },
        { fr: "Résous : x/2 + 1 = 4", ar: "حلّ : x/2 + 1 = 4", opt_fr: ["x = 4","x = 5","x = 6","x = 8"], opt_ar: ["x = 4","x = 5","x = 6","x = 8"], correct: 2 },
      ],
    },
    {
      slug: "3am-thales",
      title_fr: "Théorème de Thalès",
      title_ar: "نظرية طاليس",
      questions: [
        { fr: "Le théorème de Thalès concerne :", ar: "نظرية طاليس تتعلّق بـ :", opt_fr: ["Les triangles rectangles","Les droites parallèles coupées par deux sécantes","Les cercles","Les angles droits"], opt_ar: ["المثلثات قائمة الزاوية","المستقيمات المتوازية المقطوعة بقاطعين","الدوائر","الزوايا القائمة"], correct: 1 },
        { fr: "Si AB/AC = 2/5 et AD/AE = 4/x, alors x = ?", ar: "إذا كان AB/AC = 2/5 و AD/AE = 4/x، فإن x = ؟", opt_fr: ["8","10","12","20"], opt_ar: ["8","10","12","20"], correct: 1 },
        { fr: "Dans la configuration de Thalès, les triangles formés sont :", ar: "في وضعية طاليس، المثلثان المتشكّلان :", opt_fr: ["Identiques","Isocèles","Semblables","Rectangles"], opt_ar: ["متطابقان","متساويا الساقين","متشابهان","قائما الزاوية"], correct: 2 },
        { fr: "Si k = AM/AB = 1/3, alors MN/BC = ?", ar: "إذا كان k = AM/AB = 1/3، فإن MN/BC = ؟", opt_fr: ["1/3","2/3","3","9"], opt_ar: ["1/3","2/3","3","9"], correct: 0 },
      ],
    },
  ],
  "2AS": [
    {
      slug: "2as-fonctions",
      title_fr: "Fonctions numériques",
      title_ar: "الدوال العددية",
      questions: [
        { fr: "Si f(x) = 2x + 3, alors f(5) = ?", ar: "إذا كانت f(x) = 2x + 3، فإن f(5) = ؟", opt_fr: ["10","11","13","15"], opt_ar: ["10","11","13","15"], correct: 2 },
        { fr: "L'image de 0 par f(x) = x² - 4 est :", ar: "صورة 0 بالدالة f(x) = x² - 4 هي :", opt_fr: ["-4","-2","0","4"], opt_ar: ["-4","-2","0","4"], correct: 0 },
        { fr: "f(x) = x² est :", ar: "f(x) = x² هي :", opt_fr: ["Une fonction affine","Une fonction linéaire","Une fonction du second degré","Une fonction inverse"], opt_ar: ["دالة تآلفية","دالة خطية","دالة من الدرجة الثانية","دالة عكسية"], correct: 2 },
        { fr: "Le domaine de définition de f(x) = 1/x est :", ar: "مجموعة تعريف f(x) = 1/x هي :", opt_fr: ["ℝ","ℝ \\ {0}","ℝ \\ {1}","ℝ⁺"], opt_ar: ["ℝ","ℝ \\ {0}","ℝ \\ {1}","ℝ⁺"], correct: 1 },
      ],
    },
    {
      slug: "2as-systemes-equations",
      title_fr: "Systèmes d'équations",
      title_ar: "جُمل المعادلات",
      questions: [
        { fr: "Résous { x + y = 7 ; x - y = 3 }", ar: "حلّ { x + y = 7 ; x - y = 3 }", opt_fr: ["(5, 2)","(4, 3)","(3, 4)","(2, 5)"], opt_ar: ["(5, 2)","(4, 3)","(3, 4)","(2, 5)"], correct: 0 },
        { fr: "Résous { 2x + y = 10 ; x + y = 6 }", ar: "حلّ { 2x + y = 10 ; x + y = 6 }", opt_fr: ["(4, 2)","(3, 3)","(2, 4)","(5, 0)"], opt_ar: ["(4, 2)","(3, 3)","(2, 4)","(5, 0)"], correct: 0 },
        { fr: "Un système 2x2 a en général :", ar: "جملة 2×2 لها عموماً :", opt_fr: ["0 solution","1 solution","Une infinité","2 solutions"], opt_ar: ["0 حلّ","حلّ واحد","ما لانهاية","حلّان"], correct: 1 },
        { fr: "La méthode par substitution consiste à :", ar: "طريقة التعويض تتمثّل في :", opt_fr: ["Additionner les équations","Exprimer une inconnue puis remplacer","Multiplier par un coefficient","Tracer les droites"], opt_ar: ["جمع المعادلات","التعبير عن مجهول ثم التعويض","الضرب في معامل","رسم المستقيمات"], correct: 1 },
      ],
    },
  ],
};

// Resolve subjects per grade (math).
async function findMathSubject(grade) {
  const { data } = await admin
    .from("subjects")
    .select("id, name_fr")
    .eq("grade_code", grade)
    .ilike("name_fr", "Math%")
    .maybeSingle();
  return data;
}

let chaptersCreated = 0;
let questionsCreated = 0;
let chaptersSkipped = 0;
let questionsSkipped = 0;

for (const [grade, chapters] of Object.entries(SEED)) {
  const subject = await findMathSubject(grade);
  if (!subject) {
    console.warn(`[${grade}] no Math subject — skipping`);
    continue;
  }
  for (const chSeed of chapters) {
    // Idempotent: insert by slug, get id back.
    const { data: existing } = await admin
      .from("chapters")
      .select("id")
      .eq("subject_id", subject.id)
      .eq("slug", chSeed.slug)
      .maybeSingle();

    let chapterId;
    if (existing) {
      chapterId = existing.id;
      chaptersSkipped++;
    } else {
      const { data: ins, error } = await admin
        .from("chapters")
        .insert({
          subject_id: subject.id,
          slug: chSeed.slug,
          title_fr: chSeed.title_fr,
          title_ar: chSeed.title_ar,
          sort_order: 1,
        })
        .select("id")
        .single();
      if (error) { console.error(`[${grade}] chapter insert failed:`, error.message); continue; }
      chapterId = ins.id;
      chaptersCreated++;
    }

    // Count existing active questions for this chapter — only insert if <3.
    const { data: existingQs } = await admin
      .from("quiz_questions")
      .select("id")
      .eq("chapter_id", chapterId)
      .eq("active", true);
    if ((existingQs?.length ?? 0) >= 3) {
      questionsSkipped += chSeed.questions.length;
      continue;
    }

    const rows = chSeed.questions.map((q, i) => ({
      chapter_id: chapterId,
      prompt_fr: q.fr,
      prompt_ar: q.ar,
      options_fr: q.opt_fr,
      options_ar: q.opt_ar,
      correct_index: q.correct,
      difficulty: "easy",
      sort_order: i,
      active: true,
    }));
    const { error } = await admin.from("quiz_questions").insert(rows);
    if (error) { console.error(`[${grade}/${chSeed.slug}] questions insert failed:`, error.message); continue; }
    questionsCreated += rows.length;
  }
}

console.log(`\n✓ chapters: ${chaptersCreated} created, ${chaptersSkipped} already existed`);
console.log(`✓ questions: ${questionsCreated} created, ${questionsSkipped} already existed`);
