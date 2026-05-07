// Seed sample quiz questions per chapter so the platform has real content
// from day 1. Idempotent — uses upsert on (chapter_id, prompt_fr) via
// hash-style uniqueness; really we just delete-then-insert per chapter so
// re-running gives a clean slate without dupes.
//
// Run: node scripts/seed-quiz-questions.mjs
//
// Math expressions in AR strings are wrapped with U+2066 (LRI) and U+2069
// (PDI) so equations like "2x + 6 = 14" stay LTR atomic.
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

// LRI/PDI markers
const L = "⁦";
const P = "⁩";

// Helper to build an arithmetic question quickly. The "L...P" wrapping makes
// the math segment render LTR atomic in RTL contexts.
const Q = (
  prompt_fr,
  prompt_ar,
  options,
  correct,
  explanation_fr,
  explanation_ar,
  difficulty = "medium",
) => ({
  prompt_fr,
  prompt_ar,
  options_fr: options,
  options_ar: options, // numeric options work in both languages
  correct_index: correct,
  explanation_fr,
  explanation_ar,
  difficulty,
});

// Per-slug question banks. Slugs match scripts/seed-chapters.mjs.
const QUESTIONS = {
  // ===== 1AP =====
  "nombres-1-9": [
    Q("Combien fait 3 + 2 ?", "كم يساوي ⁦3 + 2⁩ ؟", ["4", "5", "6", "7"], 1, "3 + 2 = 5.", "⁦3 + 2 = 5⁩.", "easy"),
    Q("Combien fait 7 − 4 ?", "كم يساوي ⁦7 − 4⁩ ؟", ["1", "2", "3", "4"], 2, "7 − 4 = 3.", "⁦7 − 4 = 3⁩.", "easy"),
    Q("Quel est le plus grand nombre ?", "ما هو العدد الأكبر؟", ["3", "5", "8", "6"], 2, "8 est le plus grand.", "⁦8⁩ هو الأكبر.", "easy"),
    Q("Combien fait 4 + 4 ?", "كم يساوي ⁦4 + 4⁩ ؟", ["6", "7", "8", "9"], 2, "4 + 4 = 8.", "⁦4 + 4 = 8⁩.", "easy"),
    Q("Combien y a-t-il de doigts à une main ?", "كم إصبعاً في اليد الواحدة؟", ["3", "4", "5", "6"], 2, "Une main a 5 doigts.", "في اليد ⁦5⁩ أصابع.", "easy"),
  ],

  "nombres-10-99": [
    Q("Combien fait 12 + 8 ?", "كم يساوي ⁦12 + 8⁩ ؟", ["18", "20", "22", "24"], 1, "12 + 8 = 20.", "⁦12 + 8 = 20⁩.", "easy"),
    Q("Combien fait 30 − 12 ?", "كم يساوي ⁦30 − 12⁩ ؟", ["12", "16", "18", "20"], 2, "30 − 12 = 18.", "⁦30 − 12 = 18⁩.", "easy"),
    Q("Quel nombre vient après 49 ?", "ما العدد الذي يأتي بعد ⁦49⁩ ؟", ["48", "49", "50", "51"], 2, "Après 49 vient 50.", "بعد ⁦49⁩ يأتي ⁦50⁩.", "easy"),
    Q("Combien font 25 + 25 ?", "كم يساوي ⁦25 + 25⁩ ؟", ["40", "45", "50", "55"], 2, "25 + 25 = 50.", "⁦25 + 25 = 50⁩.", "easy"),
    Q("Combien y a-t-il de dizaines dans 67 ?", "كم عشرة في ⁦67⁩ ؟", ["6", "7", "16", "60"], 0, "67 = 6 dizaines + 7 unités.", "⁦67 = 6⁩ عشرات و⁦7⁩ آحاد.", "medium"),
  ],

  "addition-soustraction": [
    Q("Combien fait 5 + 3 ?", "كم يساوي ⁦5 + 3⁩ ؟", ["7", "8", "9", "10"], 1, "5 + 3 = 8.", "⁦5 + 3 = 8⁩.", "easy"),
    Q("Combien fait 9 − 6 ?", "كم يساوي ⁦9 − 6⁩ ؟", ["2", "3", "4", "5"], 1, "9 − 6 = 3.", "⁦9 − 6 = 3⁩.", "easy"),
    Q("Si tu as 4 bonbons et tu en achètes 5, combien en as-tu ?", "إذا كان لديك ⁦4⁩ حلويات واشتريت ⁦5⁩، كم لديك؟", ["8", "9", "10", "11"], 1, "4 + 5 = 9.", "⁦4 + 5 = 9⁩.", "easy"),
  ],

  // ===== 3AP =====
  "nombres-1000": [
    Q("Combien fait 250 + 350 ?", "كم يساوي ⁦250 + 350⁩ ؟", ["500", "600", "700", "800"], 1, "250 + 350 = 600.", "⁦250 + 350 = 600⁩.", "medium"),
    Q("Quel est le chiffre des centaines dans 478 ?", "ما رقم المئات في ⁦478⁩ ؟", ["7", "8", "4", "47"], 2, "Centaines = 4.", "خانة المئات = ⁦4⁩.", "medium"),
    Q("Combien fait 1000 − 250 ?", "كم يساوي ⁦1000 − 250⁩ ؟", ["650", "700", "750", "800"], 2, "1000 − 250 = 750.", "⁦1000 − 250 = 750⁩.", "medium"),
    Q("999 + 1 = ?", "⁦999 + 1⁩ = ؟", ["999", "1000", "1001", "1010"], 1, "999 + 1 = 1000.", "⁦999 + 1 = 1000⁩.", "easy"),
  ],

  "multiplication": [
    Q("Combien fait 6 × 7 ?", "كم يساوي ⁦6 × 7⁩ ؟", ["36", "42", "48", "56"], 1, "6 × 7 = 42.", "⁦6 × 7 = 42⁩.", "easy"),
    Q("Combien fait 8 × 9 ?", "كم يساوي ⁦8 × 9⁩ ؟", ["64", "72", "81", "90"], 1, "8 × 9 = 72.", "⁦8 × 9 = 72⁩.", "medium"),
    Q("Combien fait 12 × 5 ?", "كم يساوي ⁦12 × 5⁩ ؟", ["50", "55", "60", "65"], 2, "12 × 5 = 60.", "⁦12 × 5 = 60⁩.", "easy"),
    Q("Quel est le double de 13 ?", "كم ضعف العدد ⁦13⁩ ؟", ["23", "25", "26", "30"], 2, "13 × 2 = 26.", "⁦13 × 2 = 26⁩.", "easy"),
    Q("Combien fait 7 × 8 ?", "كم يساوي ⁦7 × 8⁩ ؟", ["48", "54", "56", "64"], 2, "7 × 8 = 56.", "⁦7 × 8 = 56⁩.", "medium"),
  ],

  "division": [
    Q("Combien fait 24 ÷ 6 ?", "كم يساوي ⁦24 ÷ 6⁩ ؟", ["3", "4", "5", "6"], 1, "24 ÷ 6 = 4.", "⁦24 ÷ 6 = 4⁩.", "easy"),
    Q("Combien fait 35 ÷ 5 ?", "كم يساوي ⁦35 ÷ 5⁩ ؟", ["6", "7", "8", "9"], 1, "35 ÷ 5 = 7.", "⁦35 ÷ 5 = 7⁩.", "easy"),
    Q("Si on partage 18 bonbons en 3 parts égales ?", "إذا قسمنا ⁦18⁩ حبة على ⁦3⁩ بالتساوي؟", ["5", "6", "7", "9"], 1, "18 ÷ 3 = 6.", "⁦18 ÷ 3 = 6⁩.", "easy"),
    Q("Combien fait 100 ÷ 10 ?", "كم يساوي ⁦100 ÷ 10⁩ ؟", ["1", "10", "100", "1000"], 1, "100 ÷ 10 = 10.", "⁦100 ÷ 10 = 10⁩.", "easy"),
  ],

  "perimetre-aire": [
    Q("Périmètre d'un carré de côté 5 cm ?", "محيط مربع طول ضلعه ⁦5⁩ سم؟", ["10 cm", "15 cm", "20 cm", "25 cm"], 2, "P = 4 × 5 = 20 cm.", "⁦P = 4 × 5 = 20⁩ سم.", "medium"),
    Q("Aire d'un rectangle 6 × 4 ?", "مساحة مستطيل ⁦6 × 4⁩ ؟", ["10", "20", "24", "30"], 2, "6 × 4 = 24.", "⁦6 × 4 = 24⁩.", "medium"),
    Q("Périmètre d'un rectangle L=8 cm, l=3 cm ?", "محيط مستطيل طوله ⁦8⁩ سم وعرضه ⁦3⁩ سم؟", ["11 cm", "22 cm", "24 cm", "44 cm"], 1, "P = 2(L+l) = 22 cm.", "⁦P = 2(8 + 3) = 22⁩ سم.", "medium"),
  ],

  // ===== 5AP =====
  "fractions": [
    Q("Quelle est la moitié de 10 ?", "ما نصف ⁦10⁩ ؟", ["3", "4", "5", "6"], 2, "10 ÷ 2 = 5.", "⁦10 ÷ 2 = 5⁩.", "easy"),
    Q("1/2 + 1/2 = ?", "⁦1/2 + 1/2⁩ = ؟", ["1/4", "1/2", "1", "2"], 2, "1/2 + 1/2 = 1.", "⁦1/2 + 1/2 = 1⁩.", "easy"),
    Q("Quel est le quart de 20 ?", "ما ربع ⁦20⁩ ؟", ["4", "5", "6", "10"], 1, "20 ÷ 4 = 5.", "⁦20 ÷ 4 = 5⁩.", "medium"),
    Q("3/4 est plus grand que…", "⁦3/4⁩ أكبر من…", ["1", "1/2", "5/4", "2"], 1, "3/4 > 1/2 (= 2/4).", "⁦3/4 > 1/2⁩.", "medium"),
  ],

  "decimaux": [
    Q("0,5 + 0,5 = ?", "⁦0.5 + 0.5⁩ = ؟", ["0", "1", "1,5", "2"], 1, "0,5 + 0,5 = 1.", "⁦0.5 + 0.5 = 1⁩.", "easy"),
    Q("Lequel est le plus grand ?", "أيّها أكبر؟", ["0,7", "0,9", "0,5", "0,3"], 1, "0,9 est le plus grand.", "⁦0.9⁩ هو الأكبر.", "easy"),
    Q("Combien fait 2,5 × 4 ?", "كم يساوي ⁦2.5 × 4⁩ ؟", ["8", "9", "10", "11"], 2, "2,5 × 4 = 10.", "⁦2.5 × 4 = 10⁩.", "medium"),
  ],

  "pourcentages": [
    Q("Combien font 10 % de 100 ?", "كم يساوي ⁦10 %⁩ من ⁦100⁩ ؟", ["1", "10", "20", "100"], 1, "10 % de 100 = 10.", "⁦10 % من 100 = 10⁩.", "easy"),
    Q("Combien font 50 % de 80 ?", "كم يساوي ⁦50 %⁩ من ⁦80⁩ ؟", ["20", "30", "40", "60"], 2, "50 % = la moitié = 40.", "⁦50 %⁩ = النصف = ⁦40⁩.", "easy"),
    Q("Combien font 25 % de 200 ?", "كم يساوي ⁦25 %⁩ من ⁦200⁩ ؟", ["25", "50", "75", "100"], 1, "25 % de 200 = 50.", "⁦25 % من 200 = 50⁩.", "medium"),
    Q("Si un produit coûte 1000 DA et a 20 % de réduction, quel est le nouveau prix ?", "إذا كان منتج بـ⁦1000⁩ د.ج وخصم ⁦20 %⁩، فما السعر الجديد؟", ["750 DA", "800 DA", "850 DA", "900 DA"], 1, "1000 − 200 = 800 DA.", "⁦1000 − 200 = 800⁩ د.ج.", "medium"),
  ],

  // ===== 1AM =====
  "nombres-relatifs": [
    Q("Combien fait (−5) + 3 ?", "كم يساوي ⁦(−5) + 3⁩ ؟", ["−8", "−2", "2", "8"], 1, "−5 + 3 = −2.", "⁦−5 + 3 = −2⁩.", "easy"),
    Q("Quel est l'opposé de −7 ?", "ما هو المعاكس لـ ⁦−7⁩ ؟", ["−7", "0", "7", "14"], 2, "L'opposé de −7 est 7.", "معاكس ⁦−7⁩ هو ⁦7⁩.", "easy"),
    Q("Combien fait (−4) − (−6) ?", "كم يساوي ⁦(−4) − (−6)⁩ ؟", ["−10", "−2", "2", "10"], 2, "−4 − (−6) = −4 + 6 = 2.", "⁦−4 − (−6) = 2⁩.", "medium"),
    Q("Quel nombre est plus grand : −3 ou −5 ?", "أيّ العددين أكبر: ⁦−3⁩ أم ⁦−5⁩ ؟", ["−5", "ils sont égaux", "−3", "aucun"], 2, "−3 > −5.", "⁦−3 > −5⁩.", "easy"),
  ],

  "puissances": [
    Q("Que vaut 10² ?", "كم يساوي ⁦10²⁩ ؟", ["10", "20", "100", "1000"], 2, "10² = 100.", "⁦10² = 100⁩.", "easy"),
    Q("Que vaut 10⁴ ?", "كم يساوي ⁦10⁴⁩ ؟", ["100", "1000", "10000", "100000"], 2, "10⁴ = 10 000.", "⁦10⁴ = 10000⁩.", "medium"),
    Q("10⁰ = ?", "⁦10⁰⁩ = ؟", ["0", "1", "10", "100"], 1, "Toute puissance 0 = 1.", "⁦10⁰ = 1⁩.", "easy"),
    Q("Combien fait 2³ ?", "كم يساوي ⁦2³⁩ ؟", ["6", "8", "9", "12"], 1, "2 × 2 × 2 = 8.", "⁦2 × 2 × 2 = 8⁩.", "easy"),
  ],

  // ===== 4AM =====
  "calcul-litteral": [
    Q("Développe 3(x + 2)", "انشر ⁦3(x + 2)⁩", ["3x + 2", "3x + 5", "3x + 6", "x + 6"], 2, "3(x+2) = 3x + 6.", "⁦3(x + 2) = 3x + 6⁩.", "medium"),
    Q("Si x = 4, que vaut 2x − 1 ?", "إذا كان ⁦x = 4⁩، كم يساوي ⁦2x − 1⁩ ؟", ["3", "7", "8", "9"], 1, "2(4) − 1 = 7.", "⁦2(4) − 1 = 7⁩.", "easy"),
    Q("Réduis : 5x + 3x − 2x", "بسّط: ⁦5x + 3x − 2x⁩", ["6x", "8x", "10x", "x"], 0, "5+3−2 = 6.", "⁦5 + 3 − 2 = 6⁩.", "easy"),
  ],

  "equations-1er-degre": [
    Q("Quelle est la solution de 2x + 6 = 14 ?", "ما هو حلّ ⁦2x + 6 = 14⁩ ؟", ["x = 2", "x = 4", "x = 6", "x = 10"], 1, "2x = 8 → x = 4.", "⁦2x = 8 → x = 4⁩.", "easy"),
    Q("Résous : 3x − 5 = 10", "حلّ: ⁦3x − 5 = 10⁩", ["x = 3", "x = 5", "x = 15/3", "x = 5/3"], 1, "3x = 15 → x = 5.", "⁦3x = 15 → x = 5⁩.", "medium"),
    Q("Si 4x = 24, alors x = ?", "إذا كان ⁦4x = 24⁩، فإن ⁦x = ⁩ ؟", ["4", "5", "6", "8"], 2, "x = 24/4 = 6.", "⁦x = 24/4 = 6⁩.", "easy"),
    Q("x + 7 = 12, x = ?", "⁦x + 7 = 12⁩، ⁦x = ⁩ ؟", ["3", "4", "5", "19"], 2, "x = 5.", "⁦x = 5⁩.", "easy"),
    Q("2(x − 3) = 8, x = ?", "⁦2(x − 3) = 8⁩، ⁦x = ⁩ ؟", ["5", "6", "7", "8"], 2, "x − 3 = 4 → x = 7.", "⁦x − 3 = 4 → x = 7⁩.", "medium"),
  ],

  "thales": [
    Q("Si AB/AC = 2/5 et AB = 4, alors AC =", "إذا كان ⁦AB/AC = 2/5⁩ و⁦AB = 4⁩، فإن ⁦AC =⁩", ["8", "10", "12", "20"], 1, "AC = 4 × 5/2 = 10.", "⁦AC = 4 × 5/2 = 10⁩.", "medium"),
    Q("Théorème de Thalès s'applique quand…", "نظرية طاليس تطبَّق عندما…", ["les triangles sont rectangles", "les droites sont parallèles", "les angles sont égaux", "les cercles sont concentriques"], 1, "Il faut deux droites parallèles.", "نحتاج إلى مستقيمين متوازيين.", "medium"),
  ],

  // ===== 1AS =====
  "polynomes": [
    Q("Combien de racines un polynôme du 2nd degré a-t-il maximum ?", "كم جذراً للمتعدد الحدود من الدرجة الثانية كحدّ أقصى؟", ["1", "2", "3", "infinie"], 1, "Au plus 2 racines réelles.", "كحدّ أقصى ⁦2⁩.", "easy"),
    Q("Discriminant Δ = b² − 4ac. Si Δ > 0…", "المميز ⁦Δ = b² − 4ac⁩. إذا كان ⁦Δ > 0⁩…", ["1 racine", "2 racines distinctes", "0 racine", "infinité"], 1, "Δ > 0 → 2 racines réelles distinctes.", "⁦Δ > 0⁩ → جذران مختلفان.", "medium"),
    Q("Que vaut x² − 4 = 0 ?", "ما حلّ ⁦x² − 4 = 0⁩ ؟", ["x = 2", "x = ±2", "x = ±4", "x = 4"], 1, "x² = 4 → x = ±2.", "⁦x = ±2⁩.", "easy"),
  ],

  "trigonometrie-1as": [
    Q("sin(0°) = ?", "⁦sin(0°)⁩ = ؟", ["0", "1/2", "1", "−1"], 0, "sin 0 = 0.", "⁦sin 0 = 0⁩.", "easy"),
    Q("cos(0°) = ?", "⁦cos(0°)⁩ = ؟", ["0", "1/2", "1", "−1"], 2, "cos 0 = 1.", "⁦cos 0 = 1⁩.", "easy"),
    Q("sin(90°) = ?", "⁦sin(90°)⁩ = ؟", ["0", "1/2", "√2/2", "1"], 3, "sin 90 = 1.", "⁦sin 90 = 1⁩.", "easy"),
    Q("Combien font sin²α + cos²α ?", "كم يساوي ⁦sin²α + cos²α⁩ ؟", ["0", "1", "−1", "α²"], 1, "Identité fondamentale.", "متطابقة أساسية.", "medium"),
  ],

  // ===== 3AS =====
  "limites": [
    Q("lim x→0 de x = ?", "⁦lim x→0 de x⁩ = ؟", ["0", "1", "∞", "x"], 0, "Évident.", "بديهي.", "easy"),
    Q("lim x→∞ de 1/x = ?", "⁦lim x→∞ de 1/x⁩ = ؟", ["0", "1", "∞", "−∞"], 0, "Tend vers 0.", "يؤول إلى ⁦0⁩.", "medium"),
    Q("lim x→2 de (x² − 4)/(x − 2) = ?", "⁦lim x→2 de (x² − 4)/(x − 2)⁩ = ؟", ["0", "2", "4", "indéfini"], 2, "Factorise: (x+2)(x−2)/(x−2) = x+2 → 4.", "بعد التبسيط: ⁦x + 2 → 4⁩.", "hard"),
  ],

  "derivation": [
    Q("Dérivée de x² ?", "مشتقة ⁦x²⁩ ؟", ["x", "2x", "x²", "2"], 1, "(x²)' = 2x.", "⁦(x²)' = 2x⁩.", "easy"),
    Q("Dérivée d'une constante ?", "مشتقة ثابت؟", ["1", "0", "x", "la constante"], 1, "Dérivée de C = 0.", "⁦(C)' = 0⁩.", "easy"),
    Q("Dérivée de 3x³ ?", "مشتقة ⁦3x³⁩ ؟", ["3x²", "9x²", "x³", "3"], 1, "(3x³)' = 9x².", "⁦(3x³)' = 9x²⁩.", "medium"),
    Q("Dérivée de sin(x) ?", "مشتقة ⁦sin(x)⁩ ؟", ["cos(x)", "−cos(x)", "−sin(x)", "tan(x)"], 0, "(sin x)' = cos x.", "⁦(sin x)' = cos x⁩.", "medium"),
    Q("Dérivée de e^x ?", "مشتقة ⁦e^x⁩ ؟", ["1", "x·e^x", "e^x", "0"], 2, "(e^x)' = e^x.", "⁦(e^x)' = e^x⁩.", "medium"),
  ],

  "exponentielle": [
    Q("e⁰ = ?", "⁦e⁰⁩ = ؟", ["0", "1", "e", "∞"], 1, "Toute base⁰ = 1.", "⁦e⁰ = 1⁩.", "easy"),
    Q("e^a × e^b = ?", "⁦e^a × e^b⁩ = ؟", ["e^(ab)", "e^(a+b)", "e^(a−b)", "e^a + e^b"], 1, "Règle des exposants.", "⁦e^(a + b)⁩.", "medium"),
    Q("La fonction exp est…", "الدالة الأسية…", ["décroissante", "croissante", "constante", "périodique"], 1, "Toujours croissante.", "متزايدة دائماً.", "medium"),
  ],

  "logarithme": [
    Q("ln(1) = ?", "⁦ln(1)⁩ = ؟", ["0", "1", "e", "indéfini"], 0, "ln 1 = 0.", "⁦ln 1 = 0⁩.", "easy"),
    Q("ln(e) = ?", "⁦ln(e)⁩ = ؟", ["0", "1", "e", "10"], 1, "ln e = 1.", "⁦ln e = 1⁩.", "easy"),
    Q("ln(ab) = ?", "⁦ln(ab)⁩ = ؟", ["ln(a) + ln(b)", "ln(a) × ln(b)", "ln(a) − ln(b)", "ln(a/b)"], 0, "Propriété fondamentale.", "خاصية أساسية.", "medium"),
  ],

  "complexes": [
    Q("i² = ?", "⁦i²⁩ = ؟", ["1", "−1", "i", "0"], 1, "Définition de i.", "تعريف ⁦i⁩.", "easy"),
    Q("Module de 3 + 4i ?", "معيار ⁦3 + 4i⁩ ؟", ["5", "7", "12", "25"], 0, "√(9+16) = √25 = 5.", "⁦√(9+16) = 5⁩.", "medium"),
    Q("Conjugué de 2 − 3i ?", "مرافق ⁦2 − 3i⁩ ؟", ["−2 + 3i", "2 + 3i", "−2 − 3i", "3 + 2i"], 1, "Conjugué = on change le signe de la partie imaginaire.", "نغيّر إشارة الجزء التخيّلي.", "medium"),
  ],

  "probabilites": [
    Q("Probabilité d'obtenir « pile » avec une pièce équilibrée ?", "احتمال الحصول على «صورة» بقطعة عادلة؟", ["0", "1/4", "1/2", "1"], 2, "P = 1/2.", "⁦P = 1/2⁩.", "easy"),
    Q("On lance un dé à 6 faces. P(obtenir un 3) ?", "نرمي نرداً من ⁦6⁩ أوجه. احتمال ⁦3⁩ ؟", ["1/2", "1/3", "1/4", "1/6"], 3, "Un seul cas favorable sur 6.", "⁦1/6⁩.", "easy"),
    Q("Si A et B sont indépendants, P(A et B) = ?", "إذا كان ⁦A⁩ و⁦B⁩ مستقلين، ⁦P(A∩B)⁩ = ؟", ["P(A) + P(B)", "P(A) × P(B)", "P(A) − P(B)", "P(A) / P(B)"], 1, "Indépendants → produit.", "مستقلان → جداء.", "medium"),
  ],

  "suites": [
    Q("Suite arithmétique : u_n = u_0 + n·r. Si u_0 = 2 et r = 3, u_5 = ?", "متتالية حسابية: ⁦u_n = u_0 + n·r⁩. إذا ⁦u_0 = 2⁩ و⁦r = 3⁩، ⁦u_5⁩ = ؟", ["8", "13", "15", "17"], 3, "2 + 5×3 = 17.", "⁦2 + 5 × 3 = 17⁩.", "medium"),
    Q("Suite géométrique : u_n = u_0 × q^n. Si u_0 = 1 et q = 2, u_4 = ?", "متتالية هندسية. إذا ⁦u_0 = 1⁩ و⁦q = 2⁩، ⁦u_4⁩ = ؟", ["8", "16", "32", "64"], 1, "1 × 2⁴ = 16.", "⁦1 × 2⁴ = 16⁩.", "medium"),
    Q("La suite (u_n) avec u_n = 1/n converge vers ?", "المتتالية ⁦u_n = 1/n⁩ تتقارب نحو؟", ["0", "1", "∞", "n'a pas de limite"], 0, "1/n → 0.", "⁦1/n → 0⁩.", "easy"),
  ],
};

// Reset & seed
let totalAdded = 0;
let totalSkipped = 0;

for (const [slug, questions] of Object.entries(QUESTIONS)) {
  // Find chapter by slug.
  const { data: chapter, error: cErr } = await admin
    .from("chapters")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (cErr || !chapter) {
    console.warn(`[skip] chapter not found: ${slug}`);
    totalSkipped += questions.length;
    continue;
  }

  // Wipe existing questions for this chapter, then insert fresh.
  await admin.from("quiz_questions").delete().eq("chapter_id", chapter.id);

  const rows = questions.map((q, i) => ({
    chapter_id: chapter.id,
    prompt_fr: q.prompt_fr,
    prompt_ar: q.prompt_ar,
    options_fr: q.options_fr,
    options_ar: q.options_ar,
    correct_index: q.correct_index,
    explanation_fr: q.explanation_fr,
    explanation_ar: q.explanation_ar,
    difficulty: q.difficulty,
    sort_order: i,
    active: true,
  }));

  const { error: insErr } = await admin.from("quiz_questions").insert(rows);
  if (insErr) {
    console.error(`[fail] ${slug}: ${insErr.message}`);
    totalSkipped += questions.length;
  } else {
    console.log(`✓ ${slug}: ${questions.length} questions`);
    totalAdded += questions.length;
  }
}

console.log(`\nDone. ${totalAdded} question(s) seeded across ${Object.keys(QUESTIONS).length} chapter(s). ${totalSkipped} skipped.`);
