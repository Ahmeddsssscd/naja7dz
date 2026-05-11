"use client";

/**
 * Petits scientifiques — 12 illustrated home experiment cards.
 *
 * Each card: difficulty stars, time, materials list, step-by-step,
 * a "pourquoi ?" explanation, then a 2-3 question quiz. "J'ai essayé"
 * marks the experiment in localStorage. MascotCelebration on 6+ tried.
 *
 * Bilingual: every visible string has an FR and AR version. Locale-aware
 * rendering picks the right one with FR fallback.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Phase = "list" | "detail" | "quiz" | "result";

interface QuizQ { q: string; choices: string[]; answer: number }

interface Experiment {
  id: string;
  title: string;
  title_ar: string;
  emoji: string;
  /** 1-3 stars */
  difficulty: 1 | 2 | 3;
  /** minutes */
  time: number;
  category: "chimie" | "physique" | "biologie" | "astronomie";
  accent: string;
  materials: string[];
  materials_ar: string[];
  steps: string[];
  steps_ar: string[];
  why: string;
  why_ar: string;
  quiz: QuizQ[];
  quiz_ar: QuizQ[];
}

const CATEGORY_LABELS: Record<Experiment["category"], { label: string; label_ar: string; emoji: string; color: string }> = {
  chimie: { label: "Chimie", label_ar: "كيمياء", emoji: "🧪", color: "bg-violet-100 text-violet-900" },
  physique: { label: "Physique", label_ar: "فيزياء", emoji: "⚡", color: "bg-amber-100 text-amber-900" },
  biologie: { label: "Biologie", label_ar: "أحياء", emoji: "🌱", color: "bg-green-100 text-green-900" },
  astronomie: { label: "Astronomie", label_ar: "فلَك", emoji: "🔭", color: "bg-sky-100 text-sky-900" },
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "vinaigre-bicarbonate",
    title: "Vinaigre + bicarbonate",
    title_ar: "الخلّ وبيكربونات الصّوديوم",
    emoji: "🧪",
    difficulty: 1,
    time: 5,
    category: "chimie",
    accent: "from-violet-100 to-purple-50",
    materials: ["Un verre", "Du vinaigre blanc", "Une cuillère de bicarbonate de soude"],
    materials_ar: ["كأس", "خلّ أبيض", "ملعقة من بيكربونات الصّوديوم"],
    steps: [
      "Verse un peu de vinaigre dans le verre (jusqu'à la moitié).",
      "Ajoute une cuillère de bicarbonate de soude.",
      "Observe la mousse qui pétille et déborde !",
      "Sens-le : ça sent le vinaigre mais en plus doux.",
    ],
    steps_ar: [
      "اسكب قليلاً من الخلّ في الكأس (إلى منتصفه).",
      "أضِف ملعقةً من بيكربونات الصّوديوم.",
      "لاحظ الرّغوة وهي تفور وتفيض!",
      "اشتمَّها: تفوح منها رائحة الخلّ لكن ألطف.",
    ],
    why: "Le vinaigre est un acide et le bicarbonate est une base. Quand on les mélange, ils réagissent et fabriquent du gaz carbonique (CO₂) — les bulles que tu vois ! C'est ce qu'on appelle une réaction acide-base.",
    why_ar: "الخلّ حِمض وبيكربونات الصّوديوم قاعدة. عندما يختلطان يتفاعلان ويُنتجان غاز ثاني أكسيد الكربون (CO₂) ـ وهو الفقاعات الّتي تراها! يُسمّى ذلك تفاعلاً بين حمض وقاعدة.",
    quiz: [
      { q: "Quel gaz est libéré ?", choices: ["Oxygène (O₂)", "Gaz carbonique (CO₂)", "Hydrogène (H₂)"], answer: 1 },
      { q: "Le vinaigre est…", choices: ["Une base", "Un acide", "Un sel"], answer: 1 },
      { q: "Le bicarbonate est…", choices: ["Une base", "Un acide", "Un métal"], answer: 0 },
    ],
    quiz_ar: [
      { q: "ما الغاز الّذي يتحرّر؟", choices: ["الأكسجين (O₂)", "ثاني أكسيد الكربون (CO₂)", "الهيدروجين (H₂)"], answer: 1 },
      { q: "الخلّ…", choices: ["قاعدة", "حِمض", "مِلح"], answer: 1 },
      { q: "بيكربونات الصّوديوم…", choices: ["قاعدة", "حِمض", "معدن"], answer: 0 },
    ],
  },
  {
    id: "raisins-secs",
    title: "Danse des raisins secs",
    title_ar: "رقصة الزّبيب",
    emoji: "🍇",
    difficulty: 1,
    time: 3,
    category: "chimie",
    accent: "from-purple-100 to-fuchsia-50",
    materials: ["Un verre d'eau gazeuse transparente", "Quelques raisins secs"],
    materials_ar: ["كأس من الماء الغازيّ الشّفّاف", "حبّات قليلة من الزّبيب"],
    steps: [
      "Remplis un verre d'eau gazeuse fraîche.",
      "Laisse tomber 4 ou 5 raisins secs dedans.",
      "Attends une minute… les raisins montent et descendent comme s'ils dansaient !",
    ],
    steps_ar: [
      "املإ الكأس بماءٍ غازيّ بارد.",
      "ضَع 4 أو 5 حبّات من الزّبيب فيه.",
      "انتظر دقيقة… يصعد الزّبيب وينزل كأنّه يرقص!",
    ],
    why: "Des bulles de CO₂ se collent aux raisins secs et les soulèvent comme des petits ballons. À la surface, les bulles éclatent et les raisins redescendent. Ça recommence sans cesse !",
    why_ar: "تلتصق فقاعات ثاني أكسيد الكربون بحبّات الزّبيب فترفعها مثل بالوناتٍ صغيرة. وعند السّطح تنفجر الفقاعات فيهبط الزّبيب من جديد. ويتكرّر ذلك دون توقّف!",
    quiz: [
      { q: "Pourquoi les raisins montent ?", choices: ["Ils sont chauds", "Les bulles de gaz les soulèvent", "L'eau les pousse"], answer: 1 },
      { q: "Quel gaz est dans l'eau gazeuse ?", choices: ["Oxygène", "CO₂", "Hélium"], answer: 1 },
    ],
    quiz_ar: [
      { q: "لماذا يصعد الزّبيب؟", choices: ["لأنّه ساخن", "لأنّ فقاعات الغاز ترفعه", "لأنّ الماء يدفعه"], answer: 1 },
      { q: "ما الغاز الموجود في الماء الغازيّ؟", choices: ["الأكسجين", "ثاني أكسيد الكربون", "الهيليوم"], answer: 1 },
    ],
  },
  {
    id: "oeuf-flotte",
    title: "Œuf qui flotte",
    title_ar: "البيضة الطّافية",
    emoji: "🥚",
    difficulty: 2,
    time: 5,
    category: "physique",
    accent: "from-amber-100 to-yellow-50",
    materials: ["Un œuf cru", "Un grand verre d'eau", "Du sel (4-5 cuillères)", "Une cuillère"],
    materials_ar: ["بيضة نيّئة", "كأس كبير من الماء", "مِلح (4 إلى 5 ملاعق)", "ملعقة"],
    steps: [
      "Mets l'œuf dans un verre d'eau pure : il coule au fond.",
      "Sors l'œuf, ajoute beaucoup de sel et mélange bien.",
      "Remets l'œuf dans l'eau salée : il flotte !",
      "Astuce magique : verse délicatement de l'eau pure par-dessus, l'œuf reste suspendu au milieu.",
    ],
    steps_ar: [
      "ضَع البيضة في كأس ماءٍ عذب: ستهبط إلى القاع.",
      "أخرِج البيضة، أضِف كثيراً من المِلح وحرّك جيّداً.",
      "أعِد البيضة إلى الماء المالح: ستطفو!",
      "حيلة سحريّة: اسكب فوقها بلطفٍ ماءً عذباً، فتبقى البيضة معلّقةً في الوسط.",
    ],
    why: "L'eau salée est plus dense (plus lourde pour le même volume) que l'œuf, donc l'œuf flotte. C'est pour ça que c'est plus facile de flotter dans la mer Morte ou dans la Méditerranée que dans une piscine !",
    why_ar: "الماء المالح أكثر كثافةً (أثقل لنفس الحجم) من البيضة، لذلك تطفو فوقه. ولهذا السّبب يَسهُل الطّفو في البحر الميّت أو في البحر الأبيض المتوسّط أكثر منه في المسبح!",
    quiz: [
      { q: "Pourquoi l'œuf flotte dans l'eau salée ?", choices: ["L'eau salée est plus dense", "L'œuf devient léger", "Le sel pousse l'œuf"], answer: 0 },
      { q: "Dans quelle mer flotte-t-on facilement ?", choices: ["Une piscine", "La mer Morte", "Une rivière"], answer: 1 },
      { q: "Comment s'appelle cette propriété ?", choices: ["La densité", "La couleur", "La chaleur"], answer: 0 },
    ],
    quiz_ar: [
      { q: "لماذا تطفو البيضة في الماء المالح؟", choices: ["لأنّ الماء المالح أكثر كثافة", "لأنّ البيضة تصبح أخفّ", "لأنّ المِلح يدفع البيضة"], answer: 0 },
      { q: "في أيّ بحر يَسهل الطّفو؟", choices: ["المسبح", "البحر الميّت", "النّهر"], answer: 1 },
      { q: "ما اسم هذه الخاصّيّة؟", choices: ["الكثافة", "اللّون", "الحرارة"], answer: 0 },
    ],
  },
  {
    id: "lait-magique",
    title: "Lait magique",
    title_ar: "الحليب السّحريّ",
    emoji: "🥛",
    difficulty: 2,
    time: 5,
    category: "chimie",
    accent: "from-rose-100 to-pink-50",
    materials: ["Une assiette plate", "Du lait entier", "Quelques gouttes de colorant alimentaire", "Du liquide vaisselle", "Un coton-tige"],
    materials_ar: ["صحن مسطّح", "حليب كامل الدّسم", "بضع قطرات من الملوّن الغذائيّ", "سائل غسل الأواني", "عود قطن"],
    steps: [
      "Verse du lait dans l'assiette pour couvrir le fond.",
      "Dépose 4-5 gouttes de colorant de couleurs différentes.",
      "Trempe le coton-tige dans le liquide vaisselle puis touche le centre.",
      "Regarde les couleurs exploser et tourbillonner !",
    ],
    steps_ar: [
      "اسكب الحليب في الصّحن حتّى يغطّي قاعه.",
      "ضَع 4 أو 5 قطرات من الملوّن بألوانٍ مختلفة.",
      "اغمس عود القطن في سائل غسل الأواني ثمّ المس وسط الصّحن.",
      "شاهد الألوان تتفجّر وتدور!",
    ],
    why: "Le lait contient des graisses tenues ensemble par la tension superficielle (la peau invisible à la surface). Le savon brise cette tension et fait fuir les graisses dans tous les sens — c'est ça qui pousse les couleurs !",
    why_ar: "يحتوي الحليب على دهون يجمعها التّوتّر السّطحيّ (طبقة رقيقة غير مرئيّة على السّطح). يكسر الصّابون هذا التّوتّر فتنفر الدّهون في كلّ الاتّجاهات ـ وهذا ما يدفع الألوان للحركة!",
    quiz: [
      { q: "Que casse le savon ?", choices: ["Le lait", "La tension superficielle", "Le colorant"], answer: 1 },
      { q: "Que contient le lait ?", choices: ["Du gaz", "Des graisses", "Du métal"], answer: 1 },
    ],
    quiz_ar: [
      { q: "ماذا يكسر الصّابون؟", choices: ["الحليب", "التّوتّر السّطحيّ", "الملوّن"], answer: 1 },
      { q: "ماذا يحتوي الحليب؟", choices: ["غازاً", "دهوناً", "معدناً"], answer: 1 },
    ],
  },
  {
    id: "aimant-chercheur",
    title: "Aimant chercheur",
    title_ar: "المغناطيس الباحث",
    emoji: "🧲",
    difficulty: 1,
    time: 10,
    category: "physique",
    accent: "from-blue-100 to-cyan-50",
    materials: ["Un aimant (de frigo)", "Plusieurs petits objets : pièces, cuillère en métal, agrafe, plastique, papier, bois"],
    materials_ar: ["مغناطيس (من الثّلّاجة)", "أشياء صغيرة متنوّعة: قطع نقديّة، ملعقة معدنيّة، دبّاسة، بلاستيك، ورق، خشب"],
    steps: [
      "Mets tous les objets sur la table.",
      "Approche l'aimant de chaque objet, un par un.",
      "Note ceux qui sont attirés (ils sautent vers l'aimant !) et ceux qui ne le sont pas.",
      "Tu viens de classer les objets en deux familles !",
    ],
    steps_ar: [
      "ضَع كلّ الأشياء على الطّاولة.",
      "قرِّب المغناطيس من كلّ شيءٍ على حِدَة.",
      "سجّل ما يُجذَب (يقفز نحو المغناطيس!) وما لا يُجذَب.",
      "ها قد صنّفت الأشياء إلى فئتين!",
    ],
    why: "Les aimants attirent surtout le fer, le nickel et le cobalt. La plupart des cuillères et des pièces sont en acier (qui contient du fer), donc l'aimant les attire. Le plastique, le bois et l'aluminium ne sont pas attirés.",
    why_ar: "تجذب المغناطيسات الحديدَ والنّيكل والكوبلت بصفةٍ خاصّة. ومعظم الملاعق والقطع النّقديّة مصنوعة من الفولاذ (الّذي يحتوي على الحديد)، فلذلك يجذبها المغناطيس. أمّا البلاستيك والخشب والألمنيوم فلا تُجذَب.",
    quiz: [
      { q: "Quel métal est attiré par un aimant ?", choices: ["L'or", "Le fer", "L'aluminium"], answer: 1 },
      { q: "Le bois est-il attiré ?", choices: ["Oui", "Non"], answer: 1 },
    ],
    quiz_ar: [
      { q: "أيّ معدنٍ يُجذَب بالمغناطيس؟", choices: ["الذّهب", "الحديد", "الألمنيوم"], answer: 1 },
      { q: "هل يُجذَب الخشب؟", choices: ["نعم", "لا"], answer: 1 },
    ],
  },
  {
    id: "plante-couleur",
    title: "Plante qui boit en couleur",
    title_ar: "الزّهرة الّتي تشرب بالألوان",
    emoji: "🌷",
    difficulty: 2,
    time: 1440,
    category: "biologie",
    accent: "from-green-100 to-emerald-50",
    materials: ["Une fleur blanche (œillet ou marguerite)", "Un verre d'eau", "Du colorant alimentaire (rouge ou bleu)"],
    materials_ar: ["زهرة بيضاء (قرنفل أو أقحوان)", "كأس من الماء", "ملوّن غذائيّ (أحمر أو أزرق)"],
    steps: [
      "Remplis un verre d'eau et ajoute beaucoup de colorant (10-15 gouttes).",
      "Coupe la tige de la fleur en biais.",
      "Mets la fleur dans le verre.",
      "Attends quelques heures (ou une nuit) et regarde : les pétales prennent la couleur !",
    ],
    steps_ar: [
      "املإ الكأس بالماء وأضِف كميّةً كبيرة من الملوّن (10 إلى 15 قطرة).",
      "اقطع ساق الزّهرة قطعاً مائلاً.",
      "ضَع الزّهرة في الكأس.",
      "انتظر بضع ساعات (أو ليلةً كاملة) ثمّ انظر: تأخذ البتلات لون الماء!",
    ],
    why: "Les plantes boivent l'eau par leur tige grâce à de tout petits tuyaux. L'eau monte jusqu'aux pétales pour les nourrir. Comme l'eau est colorée, les pétales se colorent aussi ! C'est le même mécanisme qui amène l'eau jusqu'aux feuilles d'un arbre.",
    why_ar: "تشرب النّباتات الماء عن طريق ساقها بفضل أنابيب دقيقة جدّاً. فيصعد الماء إلى البتلات ليغذّيها. وبما أنّ الماء ملوّن فإنّ البتلات تتلوّن أيضاً! وهي الآليّة نفسها الّتي تنقل الماء إلى أوراق الشّجرة.",
    quiz: [
      { q: "Comment les plantes boivent ?", choices: ["Par les feuilles", "Par la tige", "Par les pétales"], answer: 1 },
      { q: "Pourquoi les pétales se colorent ?", choices: ["L'eau colorée monte jusqu'à eux", "Le colorant flotte", "Le soleil les colore"], answer: 0 },
    ],
    quiz_ar: [
      { q: "كيف تشرب النّباتات؟", choices: ["عن طريق الأوراق", "عن طريق السّاق", "عن طريق البتلات"], answer: 1 },
      { q: "لماذا تتلوّن البتلات؟", choices: ["لأنّ الماء الملوّن يصعد إليها", "لأنّ الملوّن يطفو", "لأنّ الشّمس تلوّنها"], answer: 0 },
    ],
  },
  {
    id: "volcan-sucre",
    title: "Volcan en sucre",
    title_ar: "بركان السّكّر",
    emoji: "🌋",
    difficulty: 2,
    time: 10,
    category: "chimie",
    accent: "from-orange-100 to-red-50",
    materials: ["Un petit pot ou bouteille", "Du bicarbonate de soude (3 cuillères)", "Du jus de citron", "Du colorant rouge (optionnel)", "Un peu de liquide vaisselle"],
    materials_ar: ["وعاء صغير أو قارورة", "بيكربونات الصّوديوم (3 ملاعق)", "عصير ليمون", "ملوّن أحمر (اختياريّ)", "قليل من سائل غسل الأواني"],
    steps: [
      "Mets le pot au milieu d'une assiette (pour récupérer la lave !).",
      "Verse le bicarbonate, quelques gouttes de vaisselle et le colorant dans le pot.",
      "Ajoute d'un coup le jus de citron.",
      "Mousse rouge qui déborde — éruption volcanique !",
    ],
    steps_ar: [
      "ضَع الوعاء في وسط صحن (لاستقبال الحمم!).",
      "اسكب البيكربونات وقطرات من سائل غسل الأواني والملوّن في الوعاء.",
      "أضِف عصير اللّيمون دفعةً واحدة.",
      "رغوة حمراء تفيض ـ ثوران بركانيّ!",
    ],
    why: "Le jus de citron est acide (comme le vinaigre). Avec le bicarbonate, il libère du CO₂ qui fait mousser le tout. Le savon retient la mousse et la rend bien dense — ça ressemble à de la lave !",
    why_ar: "عصير اللّيمون حِمض (كالخلّ). فإذا التقى بالبيكربونات حرّر غاز ثاني أكسيد الكربون الّذي يجعل الخليط يَرغو. ويحتجز الصّابون الرّغوة فيجعلها كثيفة ـ تشبه الحمم البركانيّة!",
    quiz: [
      { q: "Le citron est…", choices: ["Une base", "Un acide", "Du sucre"], answer: 1 },
      { q: "Quel gaz fait la mousse ?", choices: ["Oxygène", "CO₂", "Hélium"], answer: 1 },
      { q: "À quoi sert le savon ?", choices: ["Rendre la mousse dense", "Faire couler", "Sentir bon"], answer: 0 },
    ],
    quiz_ar: [
      { q: "اللّيمون…", choices: ["قاعدة", "حِمض", "سكّر"], answer: 1 },
      { q: "ما الغاز الّذي يصنع الرّغوة؟", choices: ["الأكسجين", "ثاني أكسيد الكربون", "الهيليوم"], answer: 1 },
      { q: "ما فائدة الصّابون؟", choices: ["جعل الرّغوة كثيفة", "إغراق الخليط", "جعله طيّب الرّائحة"], answer: 0 },
    ],
  },
  {
    id: "ombre-bouge",
    title: "Ombre qui bouge",
    title_ar: "الظّلّ المتحرّك",
    emoji: "☀️",
    difficulty: 1,
    time: 360,
    category: "astronomie",
    accent: "from-yellow-100 to-amber-50",
    materials: ["Un bâton ou un crayon", "De la pâte à modeler (ou du sable)", "Une feuille de papier", "Une journée ensoleillée"],
    materials_ar: ["عصا أو قلم", "صلصال (أو رمل)", "ورقة بيضاء", "يوم مشمس"],
    steps: [
      "Plante le bâton à la verticale au milieu d'une feuille, dehors au soleil.",
      "À 9h, marque l'ombre avec un trait.",
      "Reviens à 12h, à 15h et à 17h, marque à chaque fois.",
      "Tu as fabriqué un cadran solaire — comme ceux d'il y a 3000 ans !",
    ],
    steps_ar: [
      "اغرس العصا قائمةً في وسط الورقة، خارجاً تحت الشّمس.",
      "في السّاعة 9 صباحاً، ارسم خطّاً يحدّد مكان الظّلّ.",
      "ارجع في السّاعة 12 ظهراً، و3 و5 مساءً، وارسم في كلّ مرّة.",
      "لقد صنعت ساعةً شمسيّة ـ مثل تلك الّتي كانت تُستعمل قبل 3000 سنة!",
    ],
    why: "L'ombre bouge parce que la Terre tourne sur elle-même. Le matin, le soleil est à l'est, donc l'ombre pointe vers l'ouest. Le soir, c'est l'inverse. À midi, l'ombre est la plus courte parce que le soleil est le plus haut.",
    why_ar: "يتحرّك الظّلّ لأنّ الأرض تدور حول نفسها. في الصّباح تكون الشّمس في الشّرق، فيتّجه الظّلّ نحو الغرب. وفي المساء يحدث العكس. وفي الظّهيرة يكون الظّلّ أقصر ما يكون لأنّ الشّمس في أعلى نقطة.",
    quiz: [
      { q: "Pourquoi l'ombre bouge ?", choices: ["Le soleil bouge", "La Terre tourne", "Le bâton bouge"], answer: 1 },
      { q: "Quand l'ombre est-elle la plus courte ?", choices: ["Le matin", "À midi", "Le soir"], answer: 1 },
    ],
    quiz_ar: [
      { q: "لماذا يتحرّك الظّلّ؟", choices: ["لأنّ الشّمس تتحرّك", "لأنّ الأرض تدور", "لأنّ العصا تتحرّك"], answer: 1 },
      { q: "متى يكون الظّلّ أقصر ما يكون؟", choices: ["في الصّباح", "في الظّهيرة", "في المساء"], answer: 1 },
    ],
  },
  {
    id: "glace-flotte",
    title: "Glace qui flotte",
    title_ar: "الجليد الطّافي",
    emoji: "🧊",
    difficulty: 1,
    time: 5,
    category: "physique",
    accent: "from-cyan-100 to-blue-50",
    materials: ["Un verre d'eau", "Un glaçon"],
    materials_ar: ["كأس من الماء", "مكعّب جليد"],
    steps: [
      "Remplis le verre d'eau.",
      "Mets un glaçon dedans.",
      "Observe : le glaçon flotte, alors qu'il est solide !",
      "Marque le niveau de l'eau, attends que ça fonde, regarde le niveau ne change presque pas.",
    ],
    steps_ar: [
      "املإ الكأس بالماء.",
      "ضَع مكعّبَ جليدٍ فيه.",
      "لاحظ: يطفو المكعّب رغم أنّه صلب!",
      "ضَع علامةً على مستوى الماء، انتظر إلى أن يذوب، ولاحظ أنّ المستوى لا يتغيّر تقريباً.",
    ],
    why: "Quand l'eau gèle, ses molécules s'organisent en cristaux qui prennent plus de place. La glace est donc moins dense que l'eau liquide — c'est pour ça qu'elle flotte. C'est rare ! La plupart des choses, quand elles gèlent, deviennent plus denses et coulent.",
    why_ar: "عندما يتجمّد الماء تنتظم جزيئاته في بلّوراتٍ تشغل حيّزاً أكبر. لذلك يكون الجليد أقلّ كثافةً من الماء السّائل ـ ولهذا يطفو. وهذا أمر نادر! فأغلب الأشياء عندما تتجمّد تصبح أكثر كثافةً وتغرق.",
    quiz: [
      { q: "Pourquoi la glace flotte ?", choices: ["Elle est plus légère que l'eau pour le même volume", "Elle est chaude", "Elle est solide"], answer: 0 },
      { q: "L'eau qui gèle prend…", choices: ["Moins de place", "Plus de place", "La même place"], answer: 1 },
    ],
    quiz_ar: [
      { q: "لماذا يطفو الجليد؟", choices: ["لأنّه أخفّ من الماء لنفس الحجم", "لأنّه ساخن", "لأنّه صلب"], answer: 0 },
      { q: "الماء عند التّجمّد يأخذ…", choices: ["حيّزاً أقلّ", "حيّزاً أكبر", "نفس الحيّز"], answer: 1 },
    ],
  },
  {
    id: "limaille-fer",
    title: "Champ magnétique visible",
    title_ar: "الحقل المغناطيسيّ المرئيّ",
    emoji: "✨",
    difficulty: 3,
    time: 10,
    category: "physique",
    accent: "from-slate-100 to-gray-50",
    materials: ["De la limaille de fer (ou poudre de paille de fer frottée)", "Un aimant fort", "Une feuille de papier blanche"],
    materials_ar: ["برادة الحديد (أو مسحوق صوف الحديد بعد فركه)", "مغناطيس قويّ", "ورقة بيضاء"],
    steps: [
      "Pose la feuille sur l'aimant.",
      "Saupoudre doucement la limaille de fer sur la feuille.",
      "Tape légèrement sur le papier.",
      "Les particules dessinent les lignes du champ magnétique — magique !",
    ],
    steps_ar: [
      "ضَع الورقة فوق المغناطيس.",
      "انثر برادة الحديد برفق على الورقة.",
      "اطرق الورقة طرقاً خفيفاً.",
      "ترسم الحبيبات خطوط الحقل المغناطيسيّ ـ سحر!",
    ],
    why: "Un aimant n'attire pas qu'au contact : il a un champ magnétique invisible tout autour de lui. La limaille de fer s'aligne sur ces lignes invisibles et les rend visibles. Tu viens de voir ce qu'on ne voit pas !",
    why_ar: "لا يَجذِب المغناطيس عند التّماسّ فحسب: بل له حقل مغناطيسيّ غير مرئيّ يحيط به. تنتظم برادة الحديد على هذه الخطوط غير المرئيّة فتُظهرها للعِيان. لقد رأيتَ للتّوّ ما لا يُرى!",
    quiz: [
      { q: "Que dessine la limaille ?", choices: ["Le poids de l'aimant", "Les lignes du champ magnétique", "Une carte du trésor"], answer: 1 },
      { q: "Le champ magnétique est…", choices: ["Visible à l'œil nu", "Invisible normalement", "De la lumière"], answer: 1 },
    ],
    quiz_ar: [
      { q: "ماذا ترسم برادة الحديد؟", choices: ["وزن المغناطيس", "خطوط الحقل المغناطيسيّ", "خريطة كنز"], answer: 1 },
      { q: "الحقل المغناطيسيّ…", choices: ["مرئيّ بالعين المجرّدة", "غير مرئيّ في العادة", "ضوء"], answer: 1 },
    ],
  },
  {
    id: "ballon-gonfle",
    title: "Ballon qui se gonfle tout seul",
    title_ar: "البالون الّذي ينتفخ وحده",
    emoji: "🎈",
    difficulty: 2,
    time: 10,
    category: "chimie",
    accent: "from-pink-100 to-rose-50",
    materials: ["Une bouteille en plastique vide", "Du vinaigre", "Du bicarbonate de soude", "Un ballon de baudruche", "Un entonnoir"],
    materials_ar: ["قارورة بلاستيكيّة فارغة", "خلّ", "بيكربونات الصّوديوم", "بالون مطّاطيّ", "قمع"],
    steps: [
      "Verse 5 cm de vinaigre dans la bouteille.",
      "Avec l'entonnoir, mets 2 cuillères de bicarbonate dans le ballon.",
      "Enfile le ballon sur le goulot de la bouteille (sans renverser le bicarbonate).",
      "Soulève le ballon pour faire tomber la poudre dans le vinaigre — le ballon se gonfle !",
    ],
    steps_ar: [
      "اسكب 5 سنتيمترات من الخلّ في القارورة.",
      "بواسطة القمع، ضَع ملعقتين من البيكربونات في البالون.",
      "ركّب البالون على فوّهة القارورة (دون أن يسقط البيكربونات).",
      "ارفع البالون لإسقاط المسحوق في الخلّ ـ ينتفخ البالون!",
    ],
    why: "Comme avant, vinaigre + bicarbonate = CO₂. Mais cette fois, le gaz n'a pas où s'échapper : il monte dans le ballon et le gonfle, comme si tu soufflais dedans !",
    why_ar: "كما في التّجربة السّابقة: خلّ + بيكربونات = ثاني أكسيد الكربون. لكنّ الغاز هذه المرّة لا يجد منفذاً للهروب: فيصعد إلى البالون وينفخه، تماماً كأنّك تنفخ فيه!",
    quiz: [
      { q: "Qu'est-ce qui gonfle le ballon ?", choices: ["L'air de la pièce", "Le gaz CO₂", "L'eau"], answer: 1 },
      { q: "Si tu mets plus de bicarbonate, le ballon…", choices: ["Se gonfle plus", "Se gonfle moins", "Ne change pas"], answer: 0 },
    ],
    quiz_ar: [
      { q: "ما الّذي ينفخ البالون؟", choices: ["هواء الغرفة", "غاز ثاني أكسيد الكربون", "الماء"], answer: 1 },
      { q: "إذا وضعت كميّة أكبر من البيكربونات، البالون…", choices: ["ينتفخ أكثر", "ينتفخ أقلّ", "لا يتغيّر"], answer: 0 },
    ],
  },
  {
    id: "arc-en-ciel",
    title: "Pluie d'arc-en-ciel",
    title_ar: "مطر قوس قزح",
    emoji: "🌈",
    difficulty: 1,
    time: 5,
    category: "physique",
    accent: "from-fuchsia-100 to-violet-50",
    materials: ["Un vieux CD", "Une lampe de poche (ou le soleil)", "Un mur blanc"],
    materials_ar: ["قرص مدمج قديم (CD)", "مصباح يدويّ (أو الشّمس)", "جدار أبيض"],
    steps: [
      "Tiens le CD côté brillant face à la lampe.",
      "Oriente-le pour faire rebondir la lumière sur un mur blanc.",
      "Bouge doucement : un arc-en-ciel apparaît !",
      "Tu peux aussi essayer avec le soleil par la fenêtre.",
    ],
    steps_ar: [
      "أمسك القرص من الجهة اللّامعة في مواجهة المصباح.",
      "وجِّهه لكي ينعكس الضّوء على جدارٍ أبيض.",
      "حرّكه برفق: يظهر قوس قزح!",
      "يمكنك أيضاً تجربة ذلك مع الشّمس عبر النّافذة.",
    ],
    why: "La lumière blanche est en fait un mélange de toutes les couleurs : rouge, orange, jaune, vert, bleu, violet. Le CD a des micro-rainures qui séparent ces couleurs comme un prisme — c'est exactement comme l'arc-en-ciel après la pluie, séparé par les gouttes d'eau !",
    why_ar: "الضّوء الأبيض في الحقيقة مزيج من جميع الألوان: الأحمر والبرتقاليّ والأصفر والأخضر والأزرق والبنفسجيّ. وللقرص المدمج أخاديد دقيقة تفصل هذه الألوان كالمنشور ـ تماماً مثل قوس قزح بعد المطر، الّذي تفصله قطرات الماء!",
    quiz: [
      { q: "La lumière blanche contient…", choices: ["Une seule couleur", "Toutes les couleurs", "Aucune couleur"], answer: 1 },
      { q: "L'arc-en-ciel naturel se forme grâce à…", choices: ["La fumée", "Les gouttes d'eau", "Le vent"], answer: 1 },
      { q: "Combien de couleurs principales dans un arc-en-ciel ?", choices: ["3", "5", "7"], answer: 2 },
    ],
    quiz_ar: [
      { q: "الضّوء الأبيض يحتوي على…", choices: ["لونٍ واحد فقط", "كلّ الألوان", "لا شيء من الألوان"], answer: 1 },
      { q: "قوس قزح الطّبيعيّ يتكوّن بفضل…", choices: ["الدّخان", "قطرات الماء", "الرّيح"], answer: 1 },
      { q: "كم لوناً رئيسيّاً في قوس قزح؟", choices: ["3", "5", "7"], answer: 2 },
    ],
  },
];

const STORAGE_KEY = "najah:science:tried";

interface TriedRecord {
  [id: string]: { tried: boolean; quizScore: number; date: string };
}

function loadTried(): TriedRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as TriedRecord; }
  catch { return {}; }
}

function saveTried(t: TriedRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* ignore */ }
}

function formatTime(min: number, isAr: boolean): string {
  if (isAr) {
    if (min < 60) return `${min} د`;
    if (min < 1440) return `${Math.round(min / 60)} سا`;
    return `${Math.round(min / 1440)} يوم`;
  }
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.round(min / 60)} h`;
  return `${Math.round(min / 1440)} j`;
}

// UI strings
const UI = {
  fr: {
    headerTitle: "Petits scientifiques",
    intro: (n: number) => `${n} expériences à faire à la maison. Lis, essaie, et fais le quiz !`,
    myExps: "Mes expériences",
    bigCelebrate: "⭐ Tu es un vrai petit scientifique !",
    bigCelebrateMsg: "Tu es un vrai petit scientifique !",
    all: "Tout",
    materials: "🧰 Matériel",
    steps: "📋 Étapes",
    why: "💡 Pourquoi ça marche ?",
    triedDone: "✓ J'ai essayé !",
    triedTodo: "🧪 J'ai essayé",
    quiz: "✨ Quiz",
    questionLabel: (i: number, n: number) => `Question ${i}/${n}`,
    backLabel: "Retour",
    list: "Liste",
    relire: "Relire",
    perfect: "Tu as tout compris !",
    keepGoing: "Continue à chercher !",
    triedBadge: "✓ Essayé",
  },
  ar: {
    headerTitle: "العلماء الصّغار",
    intro: (n: number) => `${n} تجربة لتقوم بها في البيت. اقرأ، جرّب، ثمّ أجب عن الاختبار!`,
    myExps: "تجاربي",
    bigCelebrate: "⭐ أنت عالم صغير حقّاً!",
    bigCelebrateMsg: "أنت عالم صغير حقّاً!",
    all: "الكلّ",
    materials: "🧰 الأدوات",
    steps: "📋 الخطوات",
    why: "💡 لماذا ينجح؟",
    triedDone: "✓ جرّبتها!",
    triedTodo: "🧪 جرّبت التّجربة",
    quiz: "✨ اختبار",
    questionLabel: (i: number, n: number) => `سؤال ${i}/${n}`,
    backLabel: "رجوع",
    list: "القائمة",
    relire: "إعادة القراءة",
    perfect: "أحسنت، لقد فهمت كلّ شيء!",
    keepGoing: "تابع البحث!",
    triedBadge: "✓ جُرِّبت",
  },
};

export function PetitsScientifiques() {
  const goBack = useGameBack();
  const locale = useLocale();
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const ui = isAr ? UI.ar : UI.fr;

  const [phase, setPhase] = useState<Phase>("list");
  const [expIdx, setExpIdx] = useState(0);
  const [filter, setFilter] = useState<Experiment["category"] | "all">("all");
  const [tried, setTried] = useState<TriedRecord>({});
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [bigCelebrate, setBigCelebrate] = useState(false);

  useEffect(() => { setTried(loadTried()); }, []);

  const exp = EXPERIMENTS[expIdx];
  const expTitle = isAr ? exp.title_ar : exp.title;
  const expMaterials = isAr ? exp.materials_ar : exp.materials;
  const expSteps = isAr ? exp.steps_ar : exp.steps;
  const expWhy = isAr ? exp.why_ar : exp.why;
  const expQuiz = isAr ? exp.quiz_ar : exp.quiz;

  const triedCount = Object.values(tried).filter((t) => t.tried).length;
  const visible = filter === "all" ? EXPERIMENTS : EXPERIMENTS.filter((e) => e.category === filter);

  const openExp = (id: string) => {
    const idx = EXPERIMENTS.findIndex((e) => e.id === id);
    if (idx >= 0) {
      setExpIdx(idx);
      setPhase("detail");
    }
  };

  const markTried = () => {
    const wasTried = tried[exp.id]?.tried ?? false;
    const next: TriedRecord = {
      ...tried,
      [exp.id]: { tried: true, quizScore: tried[exp.id]?.quizScore ?? 0, date: new Date().toISOString() },
    };
    setTried(next);
    saveTried(next);
    if (!wasTried) {
      const newCount = Object.values(next).filter((t) => t.tried).length;
      confetti({ particleCount: 60, spread: 80, colors: ["#D4A72C", "#0F1B33"] });
      if (newCount === 6) {
        setBigCelebrate(true);
        setTimeout(() => setBigCelebrate(false), 4000);
      }
    }
  };

  const startQuiz = () => {
    setQIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("quiz");
  };

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === expQuiz[qIdx].answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= expQuiz.length) {
        const finalScore = score + (correct ? 1 : 0);
        const next: TriedRecord = {
          ...tried,
          [exp.id]: { tried: tried[exp.id]?.tried ?? false, quizScore: Math.max(tried[exp.id]?.quizScore ?? 0, finalScore), date: new Date().toISOString() },
        };
        setTried(next);
        saveTried(next);
        setPhase("result");
      } else {
        setQIdx((j) => j + 1);
        setPicked(null);
      }
    }, 900);
  };

  // Chevron — flips for RTL.
  const Chevron = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {isAr
        ? <polyline points="9 18 15 12 9 6"/>
        : <polyline points="15 18 9 12 15 6"/>}
    </svg>
  );

  // ---------- Detail ----------
  if (phase === "detail") {
    const cat = CATEGORY_LABELS[exp.category];
    const catLabel = isAr ? cat.label_ar : cat.label;
    const isTried = tried[exp.id]?.tried;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={dir}>
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line sticky top-0 z-10">
          <button onClick={() => setPhase("list")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={ui.backLabel}>
            <Chevron />
          </button>
          <h1 className="text-base font-bold text-navy truncate px-2">{expTitle}</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
          <div className={`bg-gradient-to-br ${exp.accent} border-4 border-navy rounded-3xl p-6 text-center shadow-card mb-5`}>
            <div className="text-7xl mb-3">{exp.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{expTitle}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${cat.color}`}>{cat.emoji} {catLabel}</span>
              <span className="px-3 py-1 rounded-full bg-white/70 text-navy font-bold">⏱ {formatTime(exp.time, isAr)}</span>
              <span className="px-3 py-1 rounded-full bg-white/70 text-navy font-bold">
                {"⭐".repeat(exp.difficulty)}{"☆".repeat(3 - exp.difficulty)}
              </span>
            </div>
          </div>

          <section className="bg-surface border-2 border-pale-blue rounded-2xl p-5 mb-4 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-3">{ui.materials}</h3>
            <ul className="space-y-2">
              {expMaterials.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-navy">
                  <span className="text-gold mt-0.5">●</span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface border-2 border-pale-blue rounded-2xl p-5 mb-4 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-3">{ui.steps}</h3>
            <ol className="space-y-3">
              {expSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-navy">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">{i + 1}</span>
                  <span className="leading-relaxed pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-gold rounded-2xl p-5 mb-5 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-2">{ui.why}</h3>
            <p className="text-navy leading-relaxed">{expWhy}</p>
          </section>

          <div className="flex gap-3">
            <button
              onClick={markTried}
              className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all active:scale-95 ${
                isTried
                  ? "bg-green-100 border-green-400 text-green-900"
                  : "bg-surface border-pale-blue text-navy hover:border-gold"
              }`}
            >
              {isTried ? ui.triedDone : ui.triedTodo}
            </button>
            <button onClick={startQuiz} className="flex-1 btn btn-primary">
              {ui.quiz}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Quiz ----------
  if (phase === "quiz") {
    const question = expQuiz[qIdx];
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={dir}>
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line sticky top-0 z-10">
          <button onClick={() => setPhase("detail")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={ui.backLabel}>
            <Chevron />
          </button>
          <div className="text-sm font-bold text-navy">{ui.questionLabel(qIdx + 1, expQuiz.length)}</div>
          <div className="text-xs font-bold text-gold">⭐ {score}</div>
        </header>

        <main className="flex-1 px-5 py-6 max-w-xl mx-auto w-full flex flex-col">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{exp.emoji}</div>
            <div className="text-xs uppercase font-semibold text-fg-soft">{expTitle}</div>
          </div>

          <div className="bg-surface border-4 border-navy rounded-3xl p-6 mb-5 shadow-card">
            <div className="text-xl md:text-2xl font-bold text-navy text-center leading-snug">
              {question.q}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {question.choices.map((c, i) => {
              const isCorrect = i === question.answer;
              const isPicked = picked === i;
              const showResult = picked !== null;
              const className = showResult
                ? isCorrect
                  ? "bg-green-100 border-green-500 text-green-900"
                  : isPicked
                    ? "bg-rose-100 border-rose-500 text-rose-900"
                    : "bg-surface border-pale-blue text-navy/50"
                : "bg-surface border-pale-blue text-navy hover:border-gold";
              return (
                <button
                  key={i}
                  onClick={() => onPick(i)}
                  disabled={picked !== null}
                  className={`w-full text-left py-4 px-5 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${className}`}
                >
                  <span className={`font-bold ${isAr ? "ml-3" : "mr-3"}`}>{String.fromCharCode(65 + i)}.</span>
                  {c}
                  {showResult && isCorrect && <span className={isAr ? "float-left" : "float-right"}>✓</span>}
                  {showResult && isPicked && !isCorrect && <span className={isAr ? "float-left" : "float-right"}>✗</span>}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === "result") {
    const total = expQuiz.length;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5" dir={dir}>
        <MascotCelebration trigger={score === total} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === total ? "🏆" : score >= total - 1 ? "✨" : "📚"}</div>
          <h1 className="text-2xl font-bold text-navy mb-1">{expTitle}</h1>
          <div className="text-5xl font-bold text-gold mb-2 mt-3">{score}<span className="text-2xl text-fg-soft"> / {total}</span></div>
          <p className="text-fg-soft text-sm mb-6">
            {score === total ? ui.perfect : ui.keepGoing}
          </p>
          <div className="flex gap-3">
            <button onClick={() => setPhase("list")} className="btn btn-outline flex-1">{ui.list}</button>
            <button onClick={() => setPhase("detail")} className="btn btn-primary flex-1">{ui.relire}</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- List ----------
  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={dir}>
      <MascotCelebration trigger={bigCelebrate} locale={isAr ? "ar" : "fr"} message={ui.bigCelebrateMsg} />
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line sticky top-0 z-10">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={ui.backLabel}>
          <Chevron />
        </button>
        <h1 className="text-base font-bold text-navy">{ui.headerTitle}</h1>
        <div className="text-xs font-bold text-gold tabular-nums">🧪 {triedCount}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-3xl mx-auto w-full">
        <p className="text-fg-soft text-sm text-center mb-5">
          {ui.intro(EXPERIMENTS.length)}
        </p>

        {/* Progress bar */}
        <div className="bg-surface border-2 border-pale-blue rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-navy">{ui.myExps}</span>
            <span className="text-xs font-bold text-gold tabular-nums">{triedCount}/{EXPERIMENTS.length}</span>
          </div>
          <div className="h-3 bg-pale-blue rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-soft transition-all duration-500"
              style={{ width: `${(triedCount / EXPERIMENTS.length) * 100}%` }}
            />
          </div>
          {triedCount >= 6 && (
            <div className="mt-2 text-xs text-gold font-bold">{ui.bigCelebrate}</div>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${filter === "all" ? "bg-navy text-white border-navy" : "bg-surface border-pale-blue text-navy"}`}
          >
            {ui.all} ({EXPERIMENTS.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as Experiment["category"][]).map((c) => {
            const lbl = CATEGORY_LABELS[c];
            const tLabel = isAr ? lbl.label_ar : lbl.label;
            const count = EXPERIMENTS.filter((e) => e.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${filter === c ? "bg-navy text-white border-navy" : "bg-surface border-pale-blue text-navy"}`}
              >
                {lbl.emoji} {tLabel} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((e) => {
            const isTried = tried[e.id]?.tried;
            const cat = CATEGORY_LABELS[e.category];
            const tTitle = isAr ? e.title_ar : e.title;
            const tCat = isAr ? cat.label_ar : cat.label;
            return (
              <button
                key={e.id}
                onClick={() => openExp(e.id)}
                className={`text-left bg-gradient-to-br ${e.accent} border-2 ${isTried ? "border-gold" : "border-pale-blue"} rounded-2xl p-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all shadow-card relative`}
              >
                {isTried && (
                  <span className={`absolute top-2 ${isAr ? "left-2" : "right-2"} bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded-full`}>{ui.triedBadge}</span>
                )}
                <div className="text-4xl mb-2">{e.emoji}</div>
                <h3 className="font-bold text-navy text-sm md:text-base leading-tight mb-2">{tTitle}</h3>
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${cat.color}`}>{tCat}</span>
                  <span className="text-navy/60 font-bold">⏱ {formatTime(e.time, isAr)}</span>
                  <span className="text-gold font-bold">{"⭐".repeat(e.difficulty)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
