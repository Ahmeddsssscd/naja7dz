// Comprehensive content expansion: stories, riddles, speeches, exam papers.
// Idempotent — checks before insert.
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

// ============================================================================
// STORIES (10 new — current 5 → target 15)
// ============================================================================
const STORIES = [
  {
    slug: "tlemcen-marchand",
    title_fr: "Le marchand de Tlemcen",
    title_ar: "تاجر تلمسان",
    cover_emoji: "🏺",
    difficulty: "medium",
    reading_minutes: 5,
    sort_order: 6,
    paragraphs_fr: [
      "À Tlemcen, ville aux mille minarets, vivait un marchand nommé Hassan qui vendait des épices.",
      "Un jour, un voyageur perdu lui demanda son chemin. Hassan ferma sa boutique et l'accompagna jusqu'à l'auberge — un trajet d'une heure.",
      "« Pourquoi avoir fermé ta boutique ? » demanda le voyageur. « Les clients peuvent attendre, mais un voyageur perdu, non. »",
      "Le voyageur, ému, revint le lendemain : c'était un riche commerçant de Fès. Il devint le plus grand client de Hassan pour des années."
    ],
    paragraphs_ar: [
      "في تلمسان، مدينة الألف مئذنة، عاش تاجر اسمه حسن يبيع التوابل.",
      "في يوم من الأيام، سأله مسافر تائه عن الطريق. أغلق حسن متجره ورافقه إلى الفندق — مسافة ساعة كاملة.",
      "قال له المسافر: «لماذا أغلقت متجرك؟» فأجاب: «الزّبائن يستطيعون الانتظار، أمّا مسافر تائه فلا.»",
      "تأثّر المسافر وعاد في اليوم التالي: كان تاجراً ثرياً من فاس. وأصبح أكبر زبائن حسن لسنوات."
    ],
  },
  {
    slug: "lapin-tortue-kabylie",
    title_fr: "Le lièvre et la tortue de Kabylie",
    title_ar: "الأرنب والسلحفاة في القبائل",
    cover_emoji: "🐢",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 7,
    paragraphs_fr: [
      "Au pied du Djurdjura, un lièvre se moquait d'une vieille tortue : « Tu es si lente ! »",
      "« Faisons une course jusqu'au village d'en haut, » répondit la tortue calmement.",
      "Le lièvre rit, partit en flèche, puis s'endormit sous un olivier. La tortue, pas à pas, le dépassa.",
      "Quand le lièvre se réveilla, la tortue était déjà au village. Il comprit que la persévérance vaut mieux que la vitesse."
    ],
    paragraphs_ar: [
      "عند سفح جبل جرجرة، كان أرنب يسخر من سلحفاة عجوز قائلاً: «ما أبطأك!»",
      "أجابت السلحفاة بهدوء: «لنتسابق إلى القرية في الأعلى.»",
      "ضحك الأرنب وانطلق كالسهم، ثمّ نام تحت شجرة زيتون. أمّا السلحفاة، فمضت خطوةً خطوة وتجاوزته.",
      "حين استيقظ الأرنب، كانت السلحفاة قد وصلت القرية. فهم أنّ المثابرة أعظم من السرعة."
    ],
  },
  {
    slug: "djurdjura-pomme",
    title_fr: "La pomme du Djurdjura",
    title_ar: "تفاحة جرجرة",
    cover_emoji: "🍎",
    difficulty: "easy",
    reading_minutes: 4,
    sort_order: 8,
    paragraphs_fr: [
      "Trois enfants montaient le Djurdjura quand ils trouvèrent une pomme rouge.",
      "« Elle est à moi, je l'ai vue le premier ! » cria le premier. « Non, à moi, je l'ai cherchée ! » dit le deuxième.",
      "Le troisième, plus calme, dit : « Partageons-la. » Il la coupa en trois parts égales.",
      "En partant, ils trouvèrent un arbre plein de pommes — assez pour tous. Mais ils gardèrent l'habitude de partager pour toujours."
    ],
    paragraphs_ar: [
      "كان ثلاثة أطفال يصعدون جبل جرجرة فوجدوا تفاحة حمراء.",
      "صاح الأوّل: «إنّها لي، أنا رأيتها أوّلاً!» قال الثاني: «لا، بل لي، أنا بحثتُ عنها!»",
      "أمّا الثالث، الأهدأ، فقال: «لنتقاسمها.» وقطّعها ثلاثة أجزاء متساوية.",
      "وعند انصرافهم، وجدوا شجرةً ممتلئة بالتّفاح — تكفي الجميع. لكنّهم احتفظوا بعادة التقاسم إلى الأبد."
    ],
  },
  {
    slug: "soleil-ahaggar",
    title_fr: "Le soleil d'Ahaggar",
    title_ar: "شمس الأهقار",
    cover_emoji: "☀️",
    difficulty: "medium",
    reading_minutes: 4,
    sort_order: 9,
    paragraphs_fr: [
      "Dans les montagnes de l'Ahaggar, vivait une petite fille touareg appelée Tin Hinan.",
      "Chaque matin, elle observait le soleil se lever et notait sa position avec des cailloux blancs.",
      "Au bout d'un an, elle avait dessiné un cercle complet — la course du soleil. Les sages du village ne l'avaient jamais vue avant.",
      "« Tu es notre nouvelle astronome, » dit le chef. Tin Hinan apprit que regarder, longtemps, c'est comprendre."
    ],
    paragraphs_ar: [
      "في جبال الأهقار، عاشت فتاة طارقية صغيرة اسمها تين هينان.",
      "كلّ صباح كانت تراقب شروق الشمس وتُسجّل موقعه بحصى بيضاء.",
      "بعد سنة، رسمت دائرة كاملة — مسار الشمس. لم يره حكماء القرية من قبل.",
      "قال شيخ القبيلة: «أنت فلكيّتنا الجديدة.» تعلّمت تين هينان أنّ النظر طويلاً يعني الفهم."
    ],
  },
  {
    slug: "couscous-grand-mere",
    title_fr: "Le couscous de grand-mère",
    title_ar: "كسكس الجدّة",
    cover_emoji: "🍲",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 10,
    paragraphs_fr: [
      "Mamie Aïcha préparait le meilleur couscous du quartier. Tout le monde voulait sa recette.",
      "Un jour, sa petite-fille demanda : « Mamie, c'est quoi ton secret ? »",
      "« Trois choses, » dit-elle. « De bonnes graines, du temps, et beaucoup d'amour pour ceux qui vont manger. »",
      "Sa petite-fille comprit que la cuisine, comme tout, devient meilleure avec patience et avec cœur."
    ],
    paragraphs_ar: [
      "كانت الجدّة عائشة تُعدّ أفضل كسكس في الحي. الكلّ يريد وصفتها.",
      "في يوم من الأيام، سألتها حفيدتها: «جدّتي، ما هو سرّك؟»",
      "أجابت: «ثلاثة أشياء: قمح طيّب، وقت كافٍ، وحبّ كثير لمن سيأكل.»",
      "فهمت الحفيدة أنّ الطبخ، كأيّ شيء، يصبح أفضل بالصبر والقلب."
    ],
  },
  {
    slug: "berger-aures",
    title_fr: "Le berger des Aurès",
    title_ar: "راعي الأوراس",
    cover_emoji: "🐑",
    difficulty: "medium",
    reading_minutes: 5,
    sort_order: 11,
    paragraphs_fr: [
      "Yacine, jeune berger des Aurès, perdit une brebis dans une tempête de neige.",
      "Il chercha toute la nuit avec sa lampe et son chien fidèle. Il aurait pu rentrer se réchauffer.",
      "Au matin, il la retrouva, blessée, dans une crevasse. Il la porta sur son dos pendant trois heures.",
      "Quand il rentra au village, son père lui dit : « Une seule brebis, mais ta loyauté en vaut cent. »"
    ],
    paragraphs_ar: [
      "ياسين، راعٍ شابّ في جبال الأوراس، فقد نعجةً في عاصفة ثلجية.",
      "بحث عنها طوال الليل بمصباحه وكلبه الوفي. كان يستطيع العودة للتدفّئة.",
      "في الصباح وجدها، جريحةً في شقّ صخري. حملها على ظهره ثلاث ساعات.",
      "حين عاد إلى القرية، قال له والده: «نعجة واحدة، لكن وفاءك يساوي مئة.»"
    ],
  },
  {
    slug: "perle-mediterranee",
    title_fr: "La perle de la Méditerranée",
    title_ar: "لؤلؤة المتوسّط",
    cover_emoji: "🐚",
    difficulty: "medium",
    reading_minutes: 4,
    sort_order: 12,
    paragraphs_fr: [
      "Au port d'Alger, un pêcheur trouva une huître géante. Quand il l'ouvrit : une perle énorme.",
      "Le marché était plein de gens qui voulaient l'acheter. Mais le pêcheur garda la perle.",
      "« Pourquoi ne pas vendre ? » demanda son voisin. « Parce qu'elle nous est venue de la mer, et la mer nourrit tout le quartier. »",
      "Il accrocha la perle au mur de la mosquée. Tous, depuis ce jour, racontent l'histoire du pêcheur honnête."
    ],
    paragraphs_ar: [
      "في ميناء الجزائر العاصمة، وجد صياد محارة عملاقة. حين فتحها: لؤلؤة ضخمة.",
      "كان السّوق مليئاً بمن يرغب في شرائها. لكنّ الصيّاد احتفظ باللؤلؤة.",
      "سأله جاره: «لمَ لا تبيعها؟» أجاب: «لأنّها جاءتنا من البحر، والبحر يُطعم الحيّ كلّه.»",
      "علّقها على جدار المسجد. منذ ذلك اليوم، يروي الجميع قصّة الصيّاد الصادق."
    ],
  },
  {
    slug: "olivier-tres-vieux",
    title_fr: "L'olivier de mille ans",
    title_ar: "زيتونة الألف عام",
    cover_emoji: "🌳",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 13,
    paragraphs_fr: [
      "Au village de Bgayet, un olivier avait mille ans. Tout le monde s'asseyait sous son ombre.",
      "Un jour, un riche voulut le couper pour bâtir une maison. Le village entier protesta.",
      "« Cet arbre nous a vus naître, vivre, mourir, » dit le plus vieux. « Et il verra nos enfants. »",
      "Le riche reconsidéra. Il bâtit ailleurs. L'olivier, encore aujourd'hui, donne ses olives à tout le quartier."
    ],
    paragraphs_ar: [
      "في قرية بجاية، كانت زيتونة عمرها ألف عام. الكلّ يجلس تحت ظلّها.",
      "في يوم، أراد ثريّ أن يقطعها ليبني منزلاً. احتجّت القرية كلّها.",
      "قال أكبرهم سنّاً: «هذه الشجرة شهدت ميلادنا وحياتنا وموتنا، وستشهد أبناءنا.»",
      "أعاد الثريّ التفكير وبنى في مكان آخر. الزيتونة، حتى اليوم، تُعطي زيتونها للحيّ كلّه."
    ],
  },
  {
    slug: "fennec-jeu",
    title_fr: "Fennec et la pierre brillante",
    title_ar: "الفنك والحجر اللامع",
    cover_emoji: "✨",
    difficulty: "easy",
    reading_minutes: 3,
    sort_order: 14,
    paragraphs_fr: [
      "Notre ami Fennec creusait dans le sable quand il trouva une pierre brillante.",
      "« Un trésor ! » cria-t-il. Mais en l'examinant, il vit que ce n'était qu'un morceau de verre poli.",
      "Au lieu d'être déçu, il sourit : « Le verre brille aussi. Et il est plus beau qu'une pierre ordinaire. »",
      "Il la garda dans son terrier. Le soleil la faisait scintiller chaque matin. Fennec apprit que la beauté est partout, si on la cherche."
    ],
    paragraphs_ar: [
      "كان صديقنا الفنك يحفر في الرمل حين وجد حجراً لامعاً.",
      "صاح: «كنز!» لكن حين فحصه، رأى أنّه ليس سوى قطعة زجاج مصقول.",
      "بدلاً من أن يخيب، ابتسم وقال: «الزجاج يلمع أيضاً. وهو أجمل من حجر عادي.»",
      "احتفظ به في جحره. الشمس تجعله يتلألأ كلّ صباح. تعلّم الفنك أنّ الجمال في كلّ مكان، إذا بحثنا عنه."
    ],
  },
  {
    slug: "noor-soeurs-bac",
    title_fr: "Noor et le grand jour",
    title_ar: "نور واليوم الكبير",
    cover_emoji: "🎓",
    difficulty: "medium",
    reading_minutes: 5,
    sort_order: 15,
    paragraphs_fr: [
      "Noor passait le bac dans une semaine. Toute sa famille comptait sur elle.",
      "Elle révisait jour et nuit, dormait peu, mangeait à peine. Sa petite sœur s'inquiétait.",
      "« Sœur, repose-toi. Une heure de sommeil vaut mieux qu'une heure de fatigue. »",
      "Noor écouta. Le jour de l'examen, elle était calme. Elle réussit avec mention. Sa petite sœur reçut la première bise.",
      "Elle apprit que la sagesse vient parfois des plus petits."
    ],
    paragraphs_ar: [
      "كانت نور تجتاز البكالوريا بعد أسبوع. كلّ عائلتها تعتمد عليها.",
      "كانت تراجع ليلاً نهاراً، تنام قليلاً، تأكل بالكاد. أختها الصغيرة قلقت عليها.",
      "قالت لها: «أختي، استريحي. ساعة نوم أفضل من ساعة إرهاق.»",
      "استمعت نور. يوم الامتحان كانت هادئة. نجحت بميزة. أختها الصغيرة كانت أوّل من قبّلتها.",
      "تعلّمت نور أنّ الحكمة تأتي أحياناً من الأصغر."
    ],
  },
];

// ============================================================================
// LOGIC RIDDLES (12 new — table currently empty)
// ============================================================================
const RIDDLES = [
  { question_fr: "Je commence la nuit, finis le matin et apparais deux fois dans une année. Qui suis-je ?", question_ar: "أبدأ الليل، أنهي الصباح، وأظهر مرّتين في السنة. من أنا؟", answer: "n", hint_fr: "C'est une lettre" },
  { question_fr: "Plus j'en prends, plus j'en laisse. Qui suis-je ?", question_ar: "كلّما أخذتُ منّي، تركتُ أكثر. من أنا؟", answer: "pas", hint_fr: "On les fait en marchant" },
  { question_fr: "Je suis dans le sahara mais aussi dans le sucre. Qui suis-je ?", question_ar: "أنا في الصحراء وأيضاً في السكّر. من أنا؟", answer: "s", hint_fr: "Une lettre, encore" },
  { question_fr: "J'ai des dents mais je ne mange pas. Je peigne mais je ne chante pas.", question_ar: "لي أسنان لكنّي لا آكل. أمشّط لكنّي لا أغنّي.", answer: "peigne", hint_fr: "Tu l'utilises sur tes cheveux" },
  { question_fr: "Je suis plus rapide que le vent et personne ne peut me rattraper.", question_ar: "أنا أسرع من الريح ولا يمكن لأحد اللحاق بي.", answer: "temps", hint_fr: "Il avance toujours" },
  { question_fr: "Je tombe mais je ne me casse jamais.", question_ar: "أسقط لكنّي لا أنكسر أبداً.", answer: "nuit", hint_fr: "Elle vient après le coucher" },
  { question_fr: "Je grandis sans manger. Je meurs si je bois.", question_ar: "أكبر دون أن آكل. أموت إذا شربتُ.", answer: "feu", hint_fr: "Il chauffe et brûle" },
  { question_fr: "J'ai 88 touches mais je n'ouvre aucune porte.", question_ar: "لي 88 مفتاحاً لكنّي لا أفتح باباً.", answer: "piano", hint_fr: "Un instrument de musique" },
  { question_fr: "Je suis toujours devant toi mais tu ne peux jamais m'attraper.", question_ar: "أنا دائماً أمامك لكنّك لا تقدر على الإمساك بي.", answer: "futur", hint_fr: "L'opposé du passé" },
  { question_fr: "On me jette quand on a besoin de moi, on me ramasse quand on n'en a plus.", question_ar: "تُلقيني حين تحتاجني، وتلتقطني حين لا تحتاج.", answer: "ancre", hint_fr: "Pour les bateaux" },
  { question_fr: "Quel mot du dictionnaire est toujours mal écrit ?", question_ar: "أيّ كلمة في القاموس تُكتب دائماً بشكل خاطئ؟", answer: "mal", hint_fr: "C'est dans la question même" },
  { question_fr: "Je fais le tour de la terre en restant dans un coin.", question_ar: "أدور حول الأرض وأبقى في زاوية.", answer: "timbre", hint_fr: "On le colle sur les enveloppes" },
];

// ============================================================================
// MOTIVATIONAL SPEECHES (10 new — current 4 → target 14)
// ============================================================================
const SPEECHES = [
  { author_name: "Mahmoud", author_wilaya: "Oran", content: "Le Bac n'est pas la fin du monde. C'est juste une porte. Si tu rates, tu ouvres une autre porte. Si tu réussis, tu construis ton chemin. Dans les deux cas, tu apprends." },
  { author_name: "Lamia", author_wilaya: "Constantine", content: "Mon père disait : « Étudie comme si tu allais vivre éternellement, prie comme si tu allais mourir demain. » L'effort dans les études est aussi sacré que la prière." },
  { author_name: "Yacine", author_wilaya: "Tizi Ouzou", content: "À chaque échec, je me rappelle l'olivier de mon grand-père. Battu par les tempêtes, mais ses racines deviennent plus fortes. C'est aussi notre cas, à chaque difficulté." },
  { author_name: "Imène", author_wilaya: "Alger", content: "Ne compare jamais ton chapitre 3 au chapitre 30 de quelqu'un d'autre. Tu es exactement où tu dois être. Continue à tourner les pages." },
  { author_name: "Sofiane", author_wilaya: "Annaba", content: "L'examen, c'est une montagne. Mais souvenez-vous : chaque randonneur qui a atteint le sommet a posé un pied après l'autre. Pas de raccourci. Juste un pied après l'autre." },
  { author_name: "Khadija", author_wilaya: "Tlemcen", content: "Aux filles qui doutent : votre place est partout où vous voulez la prendre. Médecine, ingénierie, lettres, sciences — l'Algérie a besoin de votre intelligence." },
  { author_name: "Rachid", author_wilaya: "Sétif", content: "Mon professeur de maths m'a dit en 4ème : « Tu n'as pas la bosse des maths. » Vingt ans plus tard, je suis ingénieur. Personne ne peut décider de ton avenir, sauf toi." },
  { author_name: "Asmae", author_wilaya: "Bejaia", content: "Le jour où j'ai compris que les erreurs sont des leçons, pas des défaites, ma vie a changé. Trompe-toi. Recommence. Encore. C'est comme ça qu'on devient bon." },
  { author_name: "Mehdi", author_wilaya: "Bechar", content: "À Bechar, le désert nous apprend la patience. Une plante met des mois à pousser. Tes connaissances aussi. Sois patient avec toi-même." },
  { author_name: "Leïla", author_wilaya: "Mostaganem", content: "Ma mère ne savait pas lire. Mais elle me lisait des histoires en regardant les images, en inventant. Aujourd'hui, je suis professeure de lettres. Le rêve, ça commence comme ça." },
];

// ============================================================================
// EXAM PAPERS (15 new — current 10 → target 25)
// ============================================================================
const EXAM_PAPERS = [
  { exam_type: "bac", year: 2025, filiere: "sciences-experimentales", subject_slug: "math", official: true },
  { exam_type: "bac", year: 2025, filiere: "sciences-experimentales", subject_slug: "physiques", official: true },
  { exam_type: "bac", year: 2025, filiere: "sciences-experimentales", subject_slug: "svt", official: true },
  { exam_type: "bac", year: 2025, filiere: "lettres-philosophie", subject_slug: "philosophie", official: true },
  { exam_type: "bac", year: 2025, filiere: "lettres-philosophie", subject_slug: "francais", official: true },
  { exam_type: "bac", year: 2025, filiere: "lettres-langues", subject_slug: "anglais", official: true },
  { exam_type: "bac", year: 2025, filiere: "math", subject_slug: "math", official: true },
  { exam_type: "bac", year: 2024, filiere: "sciences-experimentales", subject_slug: "svt", official: true },
  { exam_type: "bac", year: 2023, filiere: "lettres-philosophie", subject_slug: "philosophie", official: true },
  { exam_type: "bac", year: 2022, filiere: "lettres-philosophie", subject_slug: "francais", official: true },
  { exam_type: "bem", year: 2025, filiere: "tc", subject_slug: "math", official: true },
  { exam_type: "bem", year: 2025, filiere: "tc", subject_slug: "francais", official: true },
  { exam_type: "bem", year: 2025, filiere: "tc", subject_slug: "physiques", official: true },
  { exam_type: "bem", year: 2024, filiere: "tc", subject_slug: "francais", official: true },
  { exam_type: "bem", year: 2024, filiere: "tc", subject_slug: "svt", official: true },
];

let storiesIns = 0, storiesSkip = 0;
for (const s of STORIES) {
  const { data: ex } = await admin.from("stories").select("id").eq("slug", s.slug).maybeSingle();
  if (ex) { storiesSkip++; continue; }
  const { error } = await admin.from("stories").insert(s);
  if (!error) storiesIns++;
}
console.log(`stories: +${storiesIns} (skipped ${storiesSkip})`);

let riddlesIns = 0, riddlesSkip = 0;
for (const r of RIDDLES) {
  const { data: ex } = await admin
    .from("logic_riddles")
    .select("id")
    .eq("question_fr", r.question_fr)
    .maybeSingle();
  if (ex) { riddlesSkip++; continue; }
  const { error } = await admin.from("logic_riddles").insert(r);
  if (!error) riddlesIns++; else console.log(`  ✗ riddle: ${error.message}`);
}
console.log(`riddles: +${riddlesIns} (skipped ${riddlesSkip})`);

let speechesIns = 0, speechesSkip = 0;
for (const s of SPEECHES) {
  const { data: ex } = await admin
    .from("motivational_speeches")
    .select("id")
    .eq("author_name", s.author_name)
    .eq("content", s.content)
    .maybeSingle();
  if (ex) { speechesSkip++; continue; }
  const { error } = await admin
    .from("motivational_speeches")
    .insert({ ...s, status: "approved", reviewed_at: new Date().toISOString() });
  if (!error) speechesIns++; else console.log(`  ✗ speech: ${error.message}`);
}
console.log(`speeches: +${speechesIns} (skipped ${speechesSkip})`);

let papersIns = 0, papersSkip = 0;
for (const p of EXAM_PAPERS) {
  const { data: ex } = await admin
    .from("exam_papers")
    .select("id")
    .eq("exam_type", p.exam_type)
    .eq("year", p.year)
    .eq("subject_slug", p.subject_slug)
    .eq("filiere", p.filiere)
    .maybeSingle();
  if (ex) { papersSkip++; continue; }
  const { error } = await admin.from("exam_papers").insert(p);
  if (!error) papersIns++; else console.log(`  ✗ paper: ${error.message}`);
}
console.log(`exam_papers: +${papersIns} (skipped ${papersSkip})`);

console.log("\n✓ Content expansion complete.");
