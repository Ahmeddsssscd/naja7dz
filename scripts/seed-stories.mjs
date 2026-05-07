// Seeds the stories table with bilingual short reading content for kids.
// Idempotent — checks slug before insert.
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

const STORIES = [
  {
    slug: "fennec-curieux",
    title_fr: "Le petit fennec curieux",
    title_ar: "الفنك الصّغير الفضولي",
    cover_emoji: "🦊",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 1,
    paragraphs_fr: [
      "Dans le grand désert du Sahara vivait un petit fennec qui s'appelait Karim. Ses oreilles étaient si grandes qu'il entendait même les fourmis qui marchaient.",
      "Un matin, Karim vit un papillon doré. \"Où vas-tu ?\" demanda-t-il. \"Je vais à l'oasis !\" répondit le papillon. Karim décida de le suivre.",
      "À l'oasis, il rencontra une vieille tortue très sage. Elle lui raconta des histoires anciennes, sur les rois de Tlemcen et les marchands de la route de Tombouctou.",
      "Le soir, Karim rentra chez lui, plein d'histoires à raconter à ses frères. Il avait appris que la curiosité est la plus belle chose au monde."
    ],
    paragraphs_ar: [
      "في صحراء الجزائر الكبرى عاش فنك صغير اسمه كريم. كانت أذناه كبيرتين جداً حتى يسمع خطوات النّمل.",
      "في صباحٍ ما، رأى كريم فراشة ذهبية. سألها: \"إلى أين تذهبين؟\" فأجابت: \"إلى الواحة!\" قرّر كريم أن يتبعها.",
      "في الواحة، التقى بسلحفاة عجوز حكيمة. روت له قصصاً قديمة عن ملوك تلمسان وتجّار طريق تمبكتو.",
      "في المساء، عاد كريم إلى بيته مليئاً بالقصص ليرويها لإخوته. تعلّم أنّ الفضول أجمل شيء في العالم."
    ],
  },
  {
    slug: "yasmine-graine",
    title_fr: "Yasmine et la graine magique",
    title_ar: "ياسمين والبذرة السحريّة",
    cover_emoji: "🌱",
    difficulty: "easy",
    reading_minutes: 4,
    sort_order: 2,
    paragraphs_fr: [
      "Yasmine était une fillette d'Annaba qui adorait jardiner avec sa grand-mère. Un jour, sa grand-mère lui donna une petite graine brillante.",
      "\"Plante-la et arrose-la chaque matin,\" dit-elle. \"Mais surtout, parle-lui.\" Yasmine fit ce qu'on lui dit.",
      "Au bout d'une semaine, une petite pousse verte apparut. Yasmine lui chantait des chansons et lui racontait sa journée à l'école.",
      "Un mois plus tard, la pousse était devenue un grand olivier. Et le plus étonnant : ses olives avaient un goût sucré, comme du miel.",
      "Yasmine comprit alors le secret de sa grand-mère : ce qu'on entoure d'amour grandit toujours plus beau."
    ],
    paragraphs_ar: [
      "كانت ياسمين فتاةً من عنّابة تُحبّ البستنة مع جدّتها. ذات يوم، أعطتها جدّتها بذرةً صغيرةً لامعة.",
      "قالت لها: \"ازرعيها واسقيها كلّ صباح، والأهمّ من ذلك: تكلّمي معها.\" فعلت ياسمين كما قيل لها.",
      "بعد أسبوع، ظهرت بُريعمة خضراء. كانت ياسمين تُغنّي لها وتروي لها يومها في المدرسة.",
      "بعد شهر، أصبحت البُريعمة شجرة زيتون كبيرة. والأعجب من ذلك: كان طعم زيتونها حُلواً كالعسل.",
      "فهمت ياسمين سرّ جدّتها: كلّ ما نُحيطه بالحبّ ينمو أجمل."
    ],
  },
  {
    slug: "casbah-honnete",
    title_fr: "Le marchand honnête de la Casbah",
    title_ar: "التّاجر الصّادق في القصبة",
    cover_emoji: "🏺",
    difficulty: "medium",
    reading_minutes: 5,
    sort_order: 3,
    paragraphs_fr: [
      "Il y a très longtemps, dans la Casbah d'Alger, vivait un marchand de tapis nommé Si Ali. Tous les voyageurs disaient : \"Si Ali ne ment jamais.\"",
      "Un jour, un client riche acheta un tapis et paya avec une pièce d'or. Quand Si Ali compta, il vit qu'il y avait deux pièces collées ensemble.",
      "Sans hésiter, il courut dans la rue à la recherche du client. Il le trouva loin, près du port. \"Tu m'as donné une pièce de trop,\" dit-il en lui rendant la deuxième.",
      "Le client était en réalité un envoyé du sultan, déguisé. Il voulait tester l'honnêteté des marchands de la ville.",
      "Le lendemain, Si Ali fut nommé chef du marché. Tout le monde répéta : \"L'honnêteté finit toujours par être récompensée.\""
    ],
    paragraphs_ar: [
      "منذ زمن بعيد، في قصبة الجزائر، عاش تاجر زرابي اسمه السي علي. كان جميع المسافرين يقولون: \"السي علي لا يكذب أبداً.\"",
      "في يومٍ ما، اشترى زبون غنيّ زربية ودفع بقطعة ذهبية. عندما عدّ السي علي، وجد أنّ هناك قطعتين ملتصقتين ببعضهما.",
      "دون تردّد، ركض في الشّارع باحثاً عن الزبون. وجده بعيداً قرب الميناء. قال له: \"أعطيتني قطعة زائدة،\" وأرجعها له.",
      "كان الزبون في الواقع مبعوثَ السلطان، متنكّراً. كان يريد اختبار صدق تجّار المدينة.",
      "في اليوم التّالي، عُيِّن السّي علي رئيس السّوق. وردّد الجميع: \"الصّدق يُكافأ دائماً في النهاية.\""
    ],
  },
  {
    slug: "olivier-parle",
    title_fr: "L'olivier qui parlait",
    title_ar: "الزيتونة التي تحدّثت",
    cover_emoji: "🌳",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 4,
    paragraphs_fr: [
      "Au pied des montagnes de Kabylie poussait un très vieil olivier. Les anciens disaient qu'il avait plus de mille ans.",
      "Un jour, le petit Mehdi vint s'asseoir sous l'olivier pour réfléchir à ses problèmes. Il était triste car il avait raté son devoir.",
      "Soudain, une voix douce sortit de l'arbre : \"Ne pleure pas, petit. Moi aussi j'ai connu des tempêtes. Mais à chaque tempête, mes racines sont devenues plus fortes.\"",
      "Mehdi rentra chez lui le cœur léger. Il reprit ses cahiers et étudia toute la nuit. Le jour suivant, il eut la meilleure note."
    ],
    paragraphs_ar: [
      "عند سفح جبال القبائل، نمت زيتونة قديمة جدّاً. كان الكبار يقولون إنّ عمرها يتجاوز ألف سنة.",
      "في يومٍ ما، جاء مهدي الصّغير ليجلس تحت الزيتونة ويفكّر في مشاكله. كان حزيناً لأنّه أخفق في واجبه.",
      "فجأة، خرج صوتٌ ناعم من الشّجرة: \"لا تبكِ يا صغير. أنا أيضاً عرفتُ العواصف. لكن مع كلّ عاصفة، تصبح جذوري أقوى.\"",
      "عاد مهدي إلى البيت بقلبٍ خفيف. أخذ دفاتره ودرس طوال الليل. في اليوم التّالي، حصل على أفضل علامة."
    ],
  },
  {
    slug: "trois-amis-bac",
    title_fr: "Les trois amis et le grand examen",
    title_ar: "الأصدقاء الثلاثة والامتحان الكبير",
    cover_emoji: "📚",
    difficulty: "medium",
    reading_minutes: 5,
    sort_order: 5,
    paragraphs_fr: [
      "Amine, Sara et Zineb étaient trois amis qui préparaient le BEM. Chacun avait sa façon de réviser.",
      "Amine voulait tout apprendre par cœur en une nuit. Sara faisait des exercices sans jamais s'arrêter. Zineb préférait dormir tôt et étudier un peu chaque jour.",
      "Le jour de l'examen, Amine était trop fatigué et oublia tout. Sara ne se reposa pas et fit des erreurs bêtes. Zineb resta calme et écrivit avec confiance.",
      "Quand les résultats sortirent, Zineb réussit avec une excellente note. Elle dit à ses amis : \"Le secret n'est pas de travailler le plus, mais de travailler régulièrement.\""
    ],
    paragraphs_ar: [
      "كان أمين وسارة وزينب ثلاثة أصدقاء يستعدّون لشهادة التعليم المتوسّط. لكلّ واحدٍ منهم طريقتُه في المراجعة.",
      "أراد أمين أن يحفظ كلّ شيءٍ في ليلةٍ واحدة. سارة كانت تحلّ التّمارين دون توقّف. زينب فضّلت أن تنام مبكّراً وتدرس قليلاً كلّ يوم.",
      "يوم الامتحان، كان أمين متعَباً جدّاً ونسي كلّ شيء. سارة لم ترتح وارتكبت أخطاءً سخيفة. أمّا زينب فبقيت هادئة وكتبت بثقة.",
      "حين ظهرت النّتائج، نجحت زينب بعلامةٍ ممتازة. قالت لأصدقائها: \"السرّ ليس في كثرة العمل، بل في انتظامه.\""
    ],
  },
];

let inserted = 0, skipped = 0;
for (const s of STORIES) {
  const { data: exist } = await admin.from("stories").select("id").eq("slug", s.slug).maybeSingle();
  if (exist) { skipped++; continue; }
  const { error } = await admin.from("stories").insert(s);
  if (error) { console.error(`✗ ${s.slug}:`, error.message); continue; }
  inserted++;
  console.log(`✓ ${s.slug}`);
}
console.log(`\n✓ inserted=${inserted} skipped=${skipped}`);
