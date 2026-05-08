// Focused quiz expansion for the two highest-stakes years: Bac (3AS) and
// BEM (4AM). Adds 4 NEW chapters per (grade, subject) with 5 questions each.
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

// Focus: 3AS (Bac) and 4AM (BEM) — the years that matter most.
// 4 new chapters × 5 questions × 2 grades × ~7 subjects ≈ 280 new questions.
const SEED = {
  // ============================================================ 3AS (Bac)
  "3AS": {
    "Mathématiques": [
      {
        slug: "3as-integration",
        title_fr: "Intégration et primitives",
        title_ar: "التكامل والدوال الأصلية",
        questions: [
          { fr: "L'intégrale ∫₀¹ x dx vaut :", ar: "∫₀¹ x dx يساوي :", opts_fr: ["1/4", "1/2", "1", "2"], opts_ar: ["1/4", "1/2", "1", "2"], correct: 1 },
          { fr: "Une primitive de cos(x) est :", ar: "دالة أصلية لـ cos(x) هي :", opts_fr: ["−sin(x)", "sin(x)", "cos(x)", "tan(x)"], opts_ar: ["−sin(x)", "sin(x)", "cos(x)", "tan(x)"], correct: 1 },
          { fr: "L'intégrale ∫ 1/x dx est :", ar: "∫ 1/x dx هي :", opts_fr: ["ln|x| + C", "x² + C", "1/x² + C", "−1/x + C"], opts_ar: ["ln|x| + C", "x² + C", "1/x² + C", "−1/x + C"], correct: 0 },
          { fr: "L'aire sous la courbe y = x² entre 0 et 2 vaut :", ar: "المساحة تحت المنحنى y = x² بين 0 و 2 :", opts_fr: ["2/3", "4/3", "8/3", "16/3"], opts_ar: ["2/3", "4/3", "8/3", "16/3"], correct: 2 },
          { fr: "Une primitive de e^x est :", ar: "دالة أصلية لـ e^x :", opts_fr: ["e^x", "x·e^x", "ln(x)", "1/e^x"], opts_ar: ["e^x", "x·e^x", "ln(x)", "1/e^x"], correct: 0 },
        ],
      },
      {
        slug: "3as-equa-diff",
        title_fr: "Équations différentielles",
        title_ar: "المعادلات التفاضلية",
        questions: [
          { fr: "La solution générale de y' = 2y est :", ar: "الحل العام للمعادلة y' = 2y :", opts_fr: ["y = Ce^(2x)", "y = 2x + C", "y = e^(x/2)", "y = sin(2x)"], opts_ar: ["y = Ce^(2x)", "y = 2x + C", "y = e^(x/2)", "y = sin(2x)"], correct: 0 },
          { fr: "y' + y = 0 a pour solution :", ar: "حل المعادلة y' + y = 0 :", opts_fr: ["y = Ce^x", "y = Ce^(-x)", "y = sin(x)", "y = ln(x)"], opts_ar: ["y = Ce^x", "y = Ce^(-x)", "y = sin(x)", "y = ln(x)"], correct: 1 },
          { fr: "Une équation différentielle d'ordre 1 fait intervenir :", ar: "معادلة تفاضلية من الدرجة الأولى تحتوي على :", opts_fr: ["y'' seul", "y' au plus", "y''' au plus", "Aucune dérivée"], opts_ar: ["y'' فقط", "y' على الأكثر", "y''' على الأكثر", "بدون مشتقات"], correct: 1 },
          { fr: "Si y' = ky avec y(0) = y₀, alors y(x) = :", ar: "إذا كان y' = ky و y(0) = y₀، فإن y(x) :", opts_fr: ["y₀ · e^(kx)", "y₀ + kx", "kx · e^(y₀)", "y₀ · k^x"], opts_ar: ["y₀ · e^(kx)", "y₀ + kx", "kx · e^(y₀)", "y₀ · k^x"], correct: 0 },
          { fr: "L'équation y' = -3y modélise :", ar: "المعادلة y' = -3y تنمذج :", opts_fr: ["Une croissance", "Une décroissance exponentielle", "Une oscillation", "Une constante"], opts_ar: ["نمو", "تناقص أسي", "تذبذب", "ثابت"], correct: 1 },
        ],
      },
      {
        slug: "3as-geometrie-espace",
        title_fr: "Géométrie dans l'espace",
        title_ar: "الهندسة في الفضاء",
        questions: [
          { fr: "Le produit scalaire u·v = 0 signifie que u et v sont :", ar: "الجداء السلمي u·v = 0 يعني أن u و v :", opts_fr: ["Colinéaires", "Orthogonaux", "Égaux", "Opposés"], opts_ar: ["متوازيان", "متعامدان", "متساويان", "متقابلان"], correct: 1 },
          { fr: "La distance entre A(1,0,0) et B(0,1,0) est :", ar: "المسافة بين A(1,0,0) و B(0,1,0) :", opts_fr: ["1", "√2", "2", "√3"], opts_ar: ["1", "√2", "2", "√3"], correct: 1 },
          { fr: "Le produit vectoriel u∧v est nul ssi u et v sont :", ar: "الجداء الشعاعي u∧v = 0 إذا و فقط إذا :", opts_fr: ["Orthogonaux", "Colinéaires", "Unitaires", "De même direction"], opts_ar: ["متعامدان", "خطيان", "وحدويان", "نفس الاتجاه"], correct: 1 },
          { fr: "Le plan d'équation x + y + z = 0 passe par :", ar: "المستوي ذو المعادلة x + y + z = 0 يمر بـ :", opts_fr: ["(1,1,1)", "(0,0,0)", "(1,0,0)", "(2,2,2)"], opts_ar: ["(1,1,1)", "(0,0,0)", "(1,0,0)", "(2,2,2)"], correct: 1 },
          { fr: "Un vecteur normal au plan x + 2y + 3z = 5 est :", ar: "شعاع عمودي على المستوي x + 2y + 3z = 5 :", opts_fr: ["(1,1,1)", "(1,2,3)", "(5,0,0)", "(0,2,3)"], opts_ar: ["(1,1,1)", "(1,2,3)", "(5,0,0)", "(0,2,3)"], correct: 1 },
        ],
      },
      {
        slug: "3as-statistiques",
        title_fr: "Statistiques et estimation",
        title_ar: "الإحصاء والتقدير",
        questions: [
          { fr: "La moyenne de la série {2, 4, 6, 8} est :", ar: "متوسط السلسلة {2, 4, 6, 8} :", opts_fr: ["4", "5", "6", "8"], opts_ar: ["4", "5", "6", "8"], correct: 1 },
          { fr: "L'écart-type mesure :", ar: "الانحراف المعياري يقيس :", opts_fr: ["La moyenne", "La dispersion", "Le maximum", "La somme"], opts_ar: ["المتوسط", "التشتت", "الحد الأقصى", "المجموع"], correct: 1 },
          { fr: "La médiane de {1, 3, 5, 7, 9} est :", ar: "وسيط {1, 3, 5, 7, 9} :", opts_fr: ["3", "4", "5", "7"], opts_ar: ["3", "4", "5", "7"], correct: 2 },
          { fr: "Une fréquence relative est toujours :", ar: "التكرار النسبي دائماً :", opts_fr: ["Entre 0 et 1", "Supérieure à 1", "Négative", "Entière"], opts_ar: ["بين 0 و 1", "أكبر من 1", "سالبة", "عددة صحيحة"], correct: 0 },
          { fr: "Pour estimer une moyenne, on utilise :", ar: "لتقدير متوسط، نستخدم :", opts_fr: ["Le mode", "Un échantillon", "Le maximum", "Aucun calcul"], opts_ar: ["المنوال", "عيّنة", "الحد الأقصى", "لا حسابات"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "3as-cinematique",
        title_fr: "Cinématique avancée",
        title_ar: "الحركة المتقدمة",
        questions: [
          { fr: "L'unité de l'accélération est :", ar: "وحدة التسارع :", opts_fr: ["m/s", "m/s²", "kg·m/s", "N"], opts_ar: ["م/ث", "م/ث²", "كغ·م/ث", "نيوتن"], correct: 1 },
          { fr: "Un mouvement uniforme a une accélération :", ar: "الحركة المنتظمة لها تسارع :", opts_fr: ["Constante non nulle", "Nulle", "Variable", "Négative"], opts_ar: ["ثابت غير معدوم", "معدوم", "متغير", "سالب"], correct: 1 },
          { fr: "v = v₀ + at est l'équation horaire de :", ar: "v = v₀ + at هي معادلة :", opts_fr: ["MRU", "MRUV", "Mouvement circulaire", "Repos"], opts_ar: ["حركة منتظمة", "حركة منتظمة التغير", "حركة دائرية", "سكون"], correct: 1 },
          { fr: "Un corps en chute libre a une accélération de :", ar: "تسارع جسم في سقوط حر :", opts_fr: ["10 m/s²", "9.8 m/s² vers le bas", "0", "Variable"], opts_ar: ["10 م/ث²", "9.8 م/ث² نحو الأسفل", "0", "متغير"], correct: 1 },
          { fr: "La vitesse est la dérivée de :", ar: "السرعة هي مشتقة :", opts_fr: ["L'accélération", "La position", "La force", "Le temps"], opts_ar: ["التسارع", "الموضع", "القوة", "الزمن"], correct: 1 },
        ],
      },
      {
        slug: "3as-dynamique",
        title_fr: "Lois de Newton — applications",
        title_ar: "تطبيقات قوانين نيوتن",
        questions: [
          { fr: "La 2ème loi de Newton s'écrit :", ar: "القانون الثاني لنيوتن :", opts_fr: ["F = ma", "E = mc²", "F = mg", "F = qE"], opts_ar: ["F = ma", "E = mc²", "F = mg", "F = qE"], correct: 0 },
          { fr: "Le principe d'inertie dit qu'un corps isolé est :", ar: "مبدأ القصور الذاتي : جسم معزول يكون :", opts_fr: ["En accélération", "Au repos ou MRU", "En rotation", "En chute"], opts_ar: ["في تسارع", "ساكن أو حركة منتظمة", "في دوران", "في سقوط"], correct: 1 },
          { fr: "Si F = 0, alors :", ar: "إذا F = 0، إذن :", opts_fr: ["a = constante", "v = 0", "a = 0", "x = 0"], opts_ar: ["a ثابت", "v = 0", "a = 0", "x = 0"], correct: 2 },
          { fr: "Le poids d'un objet de 5 kg sur Terre vaut :", ar: "وزن جسم كتلته 5 كغ على الأرض :", opts_fr: ["5 N", "49 N", "100 N", "0.5 N"], opts_ar: ["5 ن", "49 ن", "100 ن", "0.5 ن"], correct: 1 },
          { fr: "Action et réaction sont :", ar: "الفعل وردّ الفعل :", opts_fr: ["Égales en intensité", "De même sens", "Sur le même corps", "Nulles"], opts_ar: ["متساويتان في الشدة", "نفس الاتجاه", "على نفس الجسم", "معدومتان"], correct: 0 },
        ],
      },
      {
        slug: "3as-energie",
        title_fr: "Énergies cinétique et potentielle",
        title_ar: "الطاقة الحركية والكامنة",
        questions: [
          { fr: "Ec = (1/2)mv². Si v double, Ec :", ar: "Ec = (1/2)mv². إذا تضاعفت v، Ec :", opts_fr: ["Double", "Triple", "Quadruple", "Reste"], opts_ar: ["تتضاعف", "تتثلث", "تتضاعف 4 مرات", "تبقى"], correct: 2 },
          { fr: "L'énergie potentielle de pesanteur Ep = :", ar: "طاقة الوضع للجاذبية Ep = :", opts_fr: ["mv²", "mgh", "1/2 kx²", "qV"], opts_ar: ["mv²", "mgh", "1/2 kx²", "qV"], correct: 1 },
          { fr: "L'énergie totale d'un système isolé :", ar: "الطاقة الكلية لجملة معزولة :", opts_fr: ["Augmente", "Diminue", "Se conserve", "Oscille"], opts_ar: ["تزيد", "تنقص", "تحفظ", "تتذبذب"], correct: 2 },
          { fr: "Le travail d'une force constante est W = :", ar: "عمل قوة ثابتة W = :", opts_fr: ["F·d·cos(θ)", "F/d", "F+d", "F·v"], opts_ar: ["F·d·cos(θ)", "F/d", "F+d", "F·v"], correct: 0 },
          { fr: "L'unité du joule équivaut à :", ar: "وحدة الجول تساوي :", opts_fr: ["N·m", "kg/m", "m/s²", "N/s"], opts_ar: ["ن·م", "كغ/م", "م/ث²", "ن/ث"], correct: 0 },
        ],
      },
      {
        slug: "3as-electromagnetisme",
        title_fr: "Champ électromagnétique",
        title_ar: "الحقل الكهرومغناطيسي",
        questions: [
          { fr: "L'unité de la charge électrique est :", ar: "وحدة الشحنة الكهربائية :", opts_fr: ["Volt", "Coulomb", "Ampère", "Watt"], opts_ar: ["فولت", "كولوم", "أمبير", "واط"], correct: 1 },
          { fr: "Le champ magnétique est mesuré en :", ar: "الحقل المغناطيسي يُقاس بـ :", opts_fr: ["Volt", "Tesla", "Hertz", "Pascal"], opts_ar: ["فولت", "تسلا", "هرتز", "باسكال"], correct: 1 },
          { fr: "La force de Lorentz s'applique à :", ar: "قوة لورنتز تُطبَّق على :", opts_fr: ["Toute particule", "Particules chargées en mouvement", "Photons", "Électrons au repos"], opts_ar: ["كل جسيم", "جسيمات مشحونة متحركة", "الفوتونات", "إلكترونات ساكنة"], correct: 1 },
          { fr: "Un courant continu crée un champ magnétique :", ar: "تيار مستمر يولّد حقلاً مغناطيسياً :", opts_fr: ["Variable", "Permanent", "Nul", "Oscillant"], opts_ar: ["متغير", "دائم", "معدوم", "متذبذب"], correct: 1 },
          { fr: "La loi de Faraday relie :", ar: "قانون فاراداي يربط :", opts_fr: ["Force et accélération", "Tension et flux magnétique", "Énergie et masse", "Charge et temps"], opts_ar: ["القوة والتسارع", "التوتر والتدفق المغناطيسي", "الطاقة والكتلة", "الشحنة والزمن"], correct: 1 },
        ],
      },
    ],
    "Philosophie": [
      {
        slug: "3as-conscience",
        title_fr: "La conscience et l'inconscient",
        title_ar: "الوعي واللاوعي",
        questions: [
          { fr: "L'inconscient selon Freud est :", ar: "اللاوعي حسب فرويد :", opts_fr: ["Conscient mais oublié", "Une zone psychique inaccessible directement", "Une illusion", "Identique à la mémoire"], opts_ar: ["وعي منسي", "منطقة نفسية لا تُدرك مباشرة", "وهم", "نفس الذاكرة"], correct: 1 },
          { fr: "« Je pense donc je suis » est de :", ar: "«أنا أفكر إذن أنا موجود» قالها :", opts_fr: ["Kant", "Nietzsche", "Descartes", "Sartre"], opts_ar: ["كانط", "نيتشه", "ديكارت", "سارتر"], correct: 2 },
          { fr: "Le ça, le moi, le surmoi sont les instances de :", ar: "الهو، الأنا، الأنا الأعلى هي ركائز نفسية لـ :", opts_fr: ["Platon", "Aristote", "Freud", "Hegel"], opts_ar: ["أفلاطون", "أرسطو", "فرويد", "هيغل"], correct: 2 },
          { fr: "L'introspection est une méthode :", ar: "الاستبطان هو منهج :", opts_fr: ["Expérimentale", "D'observation interne", "Statistique", "Comparative"], opts_ar: ["تجريبي", "ملاحظة داخلية", "إحصائي", "مقارن"], correct: 1 },
          { fr: "L'autrui me permet de :", ar: "الغير يسمح لي بـ :", opts_fr: ["M'isoler", "Prendre conscience de moi", "Oublier moi-même", "Disparaître"], opts_ar: ["العزلة", "إدراك ذاتي", "نسيان نفسي", "الاختفاء"], correct: 1 },
        ],
      },
      {
        slug: "3as-langage",
        title_fr: "Le langage et la pensée",
        title_ar: "اللغة والفكر",
        questions: [
          { fr: "Le langage selon Saussure est :", ar: "اللغة حسب سوسير :", opts_fr: ["Un système de signes", "Une simple convention", "Un instinct", "Un bruit"], opts_ar: ["نظام من العلامات", "اصطلاح بسيط", "غريزة", "ضجيج"], correct: 0 },
          { fr: "Le signe linguistique unit :", ar: "العلامة اللغوية تجمع :", opts_fr: ["Forme et idée", "Signifiant et signifié", "Mot et son", "Lettre et image"], opts_ar: ["شكلاً وفكرة", "دالاً ومدلولاً", "كلمة وصوت", "حرفاً وصورة"], correct: 1 },
          { fr: "Pour Wittgenstein, les limites de mon langage signifient :", ar: "حسب فيتغنشتاين، حدود لغتي تعني :", opts_fr: ["Mes limites de pensée", "Ma culture", "Mon âge", "Ma race"], opts_ar: ["حدود فكري", "ثقافتي", "عمري", "عرقي"], correct: 0 },
          { fr: "La langue est :", ar: "اللغة :", opts_fr: ["Individuelle", "Sociale", "Innée", "Aléatoire"], opts_ar: ["فردية", "اجتماعية", "فطرية", "عشوائية"], correct: 1 },
          { fr: "La rhétorique est l'art :", ar: "الخطابة فنّ :", opts_fr: ["De peindre", "De convaincre par la parole", "De compter", "De danser"], opts_ar: ["الرسم", "الإقناع بالكلام", "العد", "الرقص"], correct: 1 },
        ],
      },
      {
        slug: "3as-liberte",
        title_fr: "La liberté et la responsabilité",
        title_ar: "الحرية والمسؤولية",
        questions: [
          { fr: "Pour Sartre, l'homme est :", ar: "حسب سارتر، الإنسان :", opts_fr: ["Déterminé", "Condamné à être libre", "Esclave de la nature", "Sans choix"], opts_ar: ["محدّد", "محكوم عليه بالحرية", "عبد الطبيعة", "بلا خيار"], correct: 1 },
          { fr: "Le déterminisme nie :", ar: "الحتمية تنفي :", opts_fr: ["Le hasard", "Le libre arbitre", "Les sciences", "L'histoire"], opts_ar: ["الصدفة", "الإرادة الحرة", "العلوم", "التاريخ"], correct: 1 },
          { fr: "Pour être responsable il faut être :", ar: "لتكون مسؤولاً يجب أن تكون :", opts_fr: ["Riche", "Libre et conscient", "Vieux", "Religieux"], opts_ar: ["غنياً", "حراً وواعياً", "كبير السن", "متديناً"], correct: 1 },
          { fr: "Kant définit la liberté comme :", ar: "كانط يعرّف الحرية بأنها :", opts_fr: ["Faire ce qu'on veut", "Autonomie de la volonté", "Désordre", "Anarchie"], opts_ar: ["فعل ما نريد", "استقلالية الإرادة", "فوضى", "اللادولة"], correct: 1 },
          { fr: "La loi limite la liberté pour :", ar: "القانون يحدّ الحرية من أجل :", opts_fr: ["L'opprimer", "Garantir la coexistence", "Punir", "Empêcher tout"], opts_ar: ["قمعها", "ضمان التعايش", "العقاب", "منع كل شيء"], correct: 1 },
        ],
      },
      {
        slug: "3as-bonheur",
        title_fr: "Le bonheur et le devoir",
        title_ar: "السعادة والواجب",
        questions: [
          { fr: "Pour Aristote, le bonheur est :", ar: "حسب أرسطو، السعادة :", opts_fr: ["Le plaisir immédiat", "L'eudaimonia, vie accomplie", "La richesse", "L'absence d'effort"], opts_ar: ["لذة آنية", "الإيداومونيا، حياة كاملة", "الثروة", "غياب الجهد"], correct: 1 },
          { fr: "Le devoir kantien est :", ar: "الواجب الكانطي :", opts_fr: ["Conditionnel", "Catégorique", "Optionnel", "Subjectif"], opts_ar: ["مشروط", "مطلق", "اختياري", "ذاتي"], correct: 1 },
          { fr: "Pour Épicure, le bonheur vient de :", ar: "حسب أبيقور، السعادة تأتي من :", opts_fr: ["La gloire", "L'absence de troubles (ataraxie)", "Les dieux", "La richesse"], opts_ar: ["المجد", "غياب الاضطرابات (الأتاراكسيا)", "الآلهة", "الثروة"], correct: 1 },
          { fr: "L'utilitarisme dit qu'une action est bonne si :", ar: "النفعية تقول إن الفعل جيد إذا :", opts_fr: ["Elle est facile", "Elle maximise le bonheur global", "Elle est ancienne", "Elle est secrète"], opts_ar: ["كان سهلاً", "زاد السعادة العامة", "قديم", "سري"], correct: 1 },
          { fr: "Selon les Stoïciens, on doit :", ar: "حسب الرواقيين، يجب علينا :", opts_fr: ["Fuir les épreuves", "Accepter ce qui dépend de nous", "Ignorer la mort", "Détester la nature"], opts_ar: ["الهروب من المحن", "قبول ما يعتمد علينا", "تجاهل الموت", "كره الطبيعة"], correct: 1 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "3as-genetique",
        title_fr: "Génétique humaine",
        title_ar: "الوراثة البشرية",
        questions: [
          { fr: "L'ADN est composé de :", ar: "الـ ADN يتكون من :", opts_fr: ["3 nucléotides", "4 nucléotides", "5 acides aminés", "20 protéines"], opts_ar: ["3 نوكليوتيدات", "4 نوكليوتيدات", "5 أحماض أمينية", "20 بروتيناً"], correct: 1 },
          { fr: "Un gène code pour :", ar: "الجين يرمز لـ :", opts_fr: ["Une cellule", "Une protéine", "Un noyau", "Un chromosome"], opts_ar: ["خلية", "بروتين", "نواة", "صبغي"], correct: 1 },
          { fr: "La mitose produit :", ar: "الانقسام الخيطي ينتج :", opts_fr: ["4 cellules différentes", "2 cellules identiques", "Une seule cellule", "Aucune cellule"], opts_ar: ["4 خلايا مختلفة", "خليتين متطابقتين", "خلية واحدة", "لا شيء"], correct: 1 },
          { fr: "Les chromosomes sexuels chez l'homme sont :", ar: "الصبغيات الجنسية عند الرجل :", opts_fr: ["XX", "XY", "YY", "X seulement"], opts_ar: ["XX", "XY", "YY", "X فقط"], correct: 1 },
          { fr: "Une mutation est :", ar: "الطفرة :", opts_fr: ["Toujours nuisible", "Une modification du génome", "Un gène disparu", "Impossible"], opts_ar: ["دائماً ضارة", "تعديل في الجينوم", "جين مفقود", "مستحيلة"], correct: 1 },
        ],
      },
      {
        slug: "3as-immunite",
        title_fr: "Le système immunitaire",
        title_ar: "الجهاز المناعي",
        questions: [
          { fr: "Les anticorps sont produits par :", ar: "الأجسام المضادة تنتجها :", opts_fr: ["Les globules rouges", "Les lymphocytes B", "Les neurones", "Les muscles"], opts_ar: ["الكريات الحمراء", "اللمفاويات B", "الخلايا العصبية", "العضلات"], correct: 1 },
          { fr: "Un antigène est :", ar: "المستضد هو :", opts_fr: ["Une protéine reconnue comme étrangère", "Un anticorps", "Une cellule sanguine", "Une enzyme digestive"], opts_ar: ["بروتين يُعرف غريباً", "جسم مضاد", "خلية دموية", "إنزيم هضمي"], correct: 0 },
          { fr: "Le sida attaque :", ar: "السيدا يهاجم :", opts_fr: ["Le cœur", "Le système immunitaire", "Les os", "La peau"], opts_ar: ["القلب", "الجهاز المناعي", "العظام", "الجلد"], correct: 1 },
          { fr: "Un vaccin contient :", ar: "اللقاح يحتوي على :", opts_fr: ["Un antibiotique", "Un antigène atténué", "Un sucre", "Une vitamine"], opts_ar: ["مضاد حيوي", "مستضد مضعّف", "سكر", "فيتامين"], correct: 1 },
          { fr: "L'immunité acquise se développe :", ar: "المناعة المكتسبة تتطور :", opts_fr: ["À la naissance seulement", "Après contact avec un antigène", "Sans cause", "Avant la naissance"], opts_ar: ["عند الولادة فقط", "بعد التماس مع مستضد", "بدون سبب", "قبل الولادة"], correct: 1 },
        ],
      },
      {
        slug: "3as-neurologie",
        title_fr: "Système nerveux",
        title_ar: "الجهاز العصبي",
        questions: [
          { fr: "Le neurone transmet des :", ar: "الخلية العصبية تنقل :", opts_fr: ["Hormones", "Influx nerveux", "Sang", "Air"], opts_ar: ["هرمونات", "السيالة العصبية", "الدم", "الهواء"], correct: 1 },
          { fr: "Le cerveau pèse environ :", ar: "وزن الدماغ تقريباً :", opts_fr: ["200 g", "1.4 kg", "5 kg", "100 g"], opts_ar: ["200 غ", "1.4 كغ", "5 كغ", "100 غ"], correct: 1 },
          { fr: "La synapse est :", ar: "المشبك :", opts_fr: ["Une cellule", "La jonction entre 2 neurones", "Un nerf complet", "Un muscle"], opts_ar: ["خلية", "ملتقى عصبيين", "عصب كامل", "عضلة"], correct: 1 },
          { fr: "Le réflexe spinal passe par :", ar: "المنعكس النخاعي يمر عبر :", opts_fr: ["Le cerveau", "La moelle épinière", "Le foie", "Le cœur"], opts_ar: ["الدماغ", "النخاع الشوكي", "الكبد", "القلب"], correct: 1 },
          { fr: "Un neurotransmetteur est :", ar: "الناقل العصبي :", opts_fr: ["Un nerf", "Une molécule chimique", "Un os", "Un vaisseau"], opts_ar: ["عصب", "جزيء كيميائي", "عظم", "وعاء"], correct: 1 },
        ],
      },
      {
        slug: "3as-ecosystemes",
        title_fr: "Écosystèmes algériens",
        title_ar: "النظم البيئية الجزائرية",
        questions: [
          { fr: "L'écosystème saharien est caractérisé par :", ar: "النظام البيئي الصحراوي يتميز بـ :", opts_fr: ["Forte humidité", "Aridité extrême", "Pluies constantes", "Forêts denses"], opts_ar: ["رطوبة عالية", "جفاف شديد", "أمطار دائمة", "غابات كثيفة"], correct: 1 },
          { fr: "La chaîne alimentaire commence par :", ar: "السلسلة الغذائية تبدأ بـ :", opts_fr: ["Les carnivores", "Les producteurs", "Les décomposeurs", "Les herbivores"], opts_ar: ["اللواحم", "المنتجات", "المحللات", "العواشب"], correct: 1 },
          { fr: "La biodiversité algérienne inclut :", ar: "التنوع البيولوجي في الجزائر يشمل :", opts_fr: ["Seulement le désert", "Méditerranée + Sahara + montagnes", "Que les villes", "Que les côtes"], opts_ar: ["الصحراء فقط", "المتوسط + الصحراء + الجبال", "المدن فقط", "السواحل فقط"], correct: 1 },
          { fr: "Une espèce endémique est :", ar: "النوع المتوطن :", opts_fr: ["Trouvée partout", "Spécifique à une région", "Domestique", "Disparue"], opts_ar: ["يوجد في كل مكان", "خاص بمنطقة", "أليف", "منقرض"], correct: 1 },
          { fr: "La désertification menace :", ar: "التصحر يهدد :", opts_fr: ["Les côtes", "Le sud algérien et la steppe", "Que les forêts", "Rien"], opts_ar: ["السواحل", "جنوب الجزائر والسهوب", "الغابات فقط", "لا شيء"], correct: 1 },
        ],
      },
    ],
    "Arabe": [
      {
        slug: "3as-arabe-balagha",
        title_fr: "البلاغة (Rhétorique arabe)",
        title_ar: "البلاغة العربية",
        questions: [
          { fr: "علم البلاغة يدرس :", ar: "علم البلاغة يدرس :", opts_fr: ["النحو", "الأصوات", "الأساليب الأدبية", "الكتابة"], opts_ar: ["النحو", "الأصوات", "الأساليب الأدبية", "الكتابة"], correct: 2 },
          { fr: "البلاغة تنقسم إلى ثلاثة فروع رئيسية :", ar: "البلاغة تنقسم إلى :", opts_fr: ["المعاني والبيان والبديع", "النحو والصرف والإملاء", "الشعر والنثر والمسرح", "اللهجات"], opts_ar: ["المعاني والبيان والبديع", "النحو والصرف والإملاء", "الشعر والنثر والمسرح", "اللهجات"], correct: 0 },
          { fr: "التشبيه من علم :", ar: "التشبيه من علم :", opts_fr: ["المعاني", "البيان", "البديع", "النحو"], opts_ar: ["المعاني", "البيان", "البديع", "النحو"], correct: 1 },
          { fr: "الجناس من المحسنات :", ar: "الجناس من المحسنات :", opts_fr: ["المعنوية", "اللفظية", "النحوية", "الإملائية"], opts_ar: ["المعنوية", "اللفظية", "النحوية", "الإملائية"], correct: 1 },
          { fr: "الاستعارة فيها :", ar: "الاستعارة فيها :", opts_fr: ["تشبيه ظاهر", "تشبيه مضمر", "ترادف", "تضاد"], opts_ar: ["تشبيه ظاهر", "تشبيه مضمر", "ترادف", "تضاد"], correct: 1 },
        ],
      },
      {
        slug: "3as-arabe-naqd",
        title_fr: "النقد الأدبي",
        title_ar: "النقد الأدبي",
        questions: [
          { fr: "النقد الأدبي يهدف إلى :", ar: "النقد الأدبي يهدف إلى :", opts_fr: ["الذم", "تقييم النصوص الأدبية", "الكتابة", "النحو"], opts_ar: ["الذم", "تقييم النصوص الأدبية", "الكتابة", "النحو"], correct: 1 },
          { fr: "أشهر النقاد العرب :", ar: "أشهر النقاد العرب :", opts_fr: ["ابن سلام", "ابن خلدون", "الجاحظ", "كل ما سبق"], opts_ar: ["ابن سلام", "ابن خلدون", "الجاحظ", "كل ما سبق"], correct: 3 },
          { fr: "النقد الحديث يعتمد على :", ar: "النقد الحديث يعتمد على :", opts_fr: ["الذوق فقط", "مناهج علمية", "الحدس", "العاطفة"], opts_ar: ["الذوق فقط", "مناهج علمية", "الحدس", "العاطفة"], correct: 1 },
          { fr: "المنهج البنيوي يدرس :", ar: "المنهج البنيوي يدرس :", opts_fr: ["السيرة الذاتية", "البنية الداخلية للنص", "التاريخ", "السياسة"], opts_ar: ["السيرة الذاتية", "البنية الداخلية للنص", "التاريخ", "السياسة"], correct: 1 },
          { fr: "النقد الانطباعي يقوم على :", ar: "النقد الانطباعي يقوم على :", opts_fr: ["الإحصاء", "الانطباع الذاتي", "العلم", "التاريخ"], opts_ar: ["الإحصاء", "الانطباع الذاتي", "العلم", "التاريخ"], correct: 1 },
        ],
      },
      {
        slug: "3as-arabe-shi3r",
        title_fr: "الشعر الجاهلي والإسلامي",
        title_ar: "الشعر الجاهلي والإسلامي",
        questions: [
          { fr: "أشهر شعراء الجاهلية :", ar: "أشهر شعراء الجاهلية :", opts_fr: ["امرؤ القيس", "المتنبي", "أبو نواس", "البحتري"], opts_ar: ["امرؤ القيس", "المتنبي", "أبو نواس", "البحتري"], correct: 0 },
          { fr: "المعلقات عددها :", ar: "المعلقات عددها :", opts_fr: ["خمس", "سبع", "عشر", "خمس عشرة"], opts_ar: ["خمس", "سبع", "عشر", "خمس عشرة"], correct: 1 },
          { fr: "بحر الشعر هو :", ar: "بحر الشعر هو :", opts_fr: ["مكان البحر", "وزن إيقاعي", "نوع المعنى", "اسم شاعر"], opts_ar: ["مكان البحر", "وزن إيقاعي", "نوع المعنى", "اسم شاعر"], correct: 1 },
          { fr: "أبو الطيب المتنبي عاش في :", ar: "أبو الطيب المتنبي عاش في :", opts_fr: ["العصر الجاهلي", "العصر الأموي", "العصر العباسي", "العصر الحديث"], opts_ar: ["العصر الجاهلي", "العصر الأموي", "العصر العباسي", "العصر الحديث"], correct: 2 },
          { fr: "حسان بن ثابت لقّب بـ :", ar: "حسان بن ثابت لقّب بـ :", opts_fr: ["شاعر الرسول", "شاعر الجاهلية", "شاعر العصر", "أمير الشعراء"], opts_ar: ["شاعر الرسول", "شاعر الجاهلية", "شاعر العصر", "أمير الشعراء"], correct: 0 },
        ],
      },
      {
        slug: "3as-arabe-modern",
        title_fr: "الأدب العربي الحديث",
        title_ar: "الأدب العربي الحديث",
        questions: [
          { fr: "أحمد شوقي لقّب بـ :", ar: "أحمد شوقي لقّب بـ :", opts_fr: ["الشاعر الفيلسوف", "أمير الشعراء", "شاعر الجزائر", "شاعر النيل"], opts_ar: ["الشاعر الفيلسوف", "أمير الشعراء", "شاعر الجزائر", "شاعر النيل"], correct: 1 },
          { fr: "نجيب محفوظ نال جائزة :", ar: "نجيب محفوظ نال جائزة :", opts_fr: ["العويس", "نوبل للآداب", "البوكر", "الملك فيصل"], opts_ar: ["العويس", "نوبل للآداب", "البوكر", "الملك فيصل"], correct: 1 },
          { fr: "محمد ديب كاتب :", ar: "محمد ديب كاتب :", opts_fr: ["مصري", "جزائري", "سوري", "تونسي"], opts_ar: ["مصري", "جزائري", "سوري", "تونسي"], correct: 1 },
          { fr: "مدرسة الديوان من رواد التجديد في :", ar: "مدرسة الديوان من رواد التجديد في :", opts_fr: ["النثر", "الشعر العربي الحديث", "المسرح", "الرواية"], opts_ar: ["النثر", "الشعر العربي الحديث", "المسرح", "الرواية"], correct: 1 },
          { fr: "الشعر الحر تخلّى عن :", ar: "الشعر الحر تخلّى عن :", opts_fr: ["المعنى", "التفعيلة الواحدة المتكررة", "الكلمات", "اللغة"], opts_ar: ["المعنى", "التفعيلة الواحدة المتكررة", "الكلمات", "اللغة"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "3as-fr-figures-style",
        title_fr: "Figures de style",
        title_ar: "الأساليب البيانية",
        questions: [
          { fr: "« Cet homme est un lion » est :", ar: "«هذا الرجل أسد» هي :", opts_fr: ["Une comparaison", "Une métaphore", "Une métonymie", "Un euphémisme"], opts_ar: ["تشبيه", "استعارة", "كناية", "تلطيف"], correct: 1 },
          { fr: "« Boire un verre » est :", ar: "«شرب كأس» :", opts_fr: ["Une métaphore", "Une métonymie (le contenu pour le contenant)", "Une hyperbole", "Une antithèse"], opts_ar: ["استعارة", "كناية (المحتوى للحاوية)", "مبالغة", "طباق"], correct: 1 },
          { fr: "« Il pleut des cordes » est :", ar: "«تمطر حبالاً» :", opts_fr: ["Une hyperbole", "Une comparaison", "Un oxymore", "Une litote"], opts_ar: ["مبالغة", "تشبيه", "تناقض ظاهري", "تقليل"], correct: 0 },
          { fr: "L'antithèse oppose :", ar: "الطباق يعارض :", opts_fr: ["Deux idées contraires", "Deux mots identiques", "Trois objets", "Rien"], opts_ar: ["فكرتين متعارضتين", "كلمتين متطابقتين", "ثلاثة أشياء", "لا شيء"], correct: 0 },
          { fr: "« Va, je ne te hais point » est une :", ar: "«اذهب، لا أكرهك» :", opts_fr: ["Hyperbole", "Litote", "Métaphore", "Comparaison"], opts_ar: ["مبالغة", "تقليل (litote)", "استعارة", "تشبيه"], correct: 1 },
        ],
      },
      {
        slug: "3as-fr-genres",
        title_fr: "Genres littéraires",
        title_ar: "الأجناس الأدبية",
        questions: [
          { fr: "Le roman est un genre :", ar: "الرواية جنس :", opts_fr: ["Lyrique", "Narratif en prose", "Théâtral", "Poétique"], opts_ar: ["غنائي", "سردي نثري", "مسرحي", "شعري"], correct: 1 },
          { fr: "La tragédie classique respecte :", ar: "المأساة الكلاسيكية تحترم :", opts_fr: ["Les 3 unités", "5 actes obligatoires", "Aucune règle", "Le hasard"], opts_ar: ["الوحدات الثلاث", "5 فصول إجبارية", "لا قاعدة", "الصدفة"], correct: 0 },
          { fr: "Un sonnet a :", ar: "السوناتا (sonnet) لها :", opts_fr: ["12 vers", "14 vers", "10 vers", "20 vers"], opts_ar: ["12 بيت", "14 بيت", "10 بيت", "20 بيت"], correct: 1 },
          { fr: "Le naturalisme est représenté par :", ar: "الطبيعية يمثّلها :", opts_fr: ["Hugo", "Zola", "Baudelaire", "Verlaine"], opts_ar: ["هوغو", "زولا", "بودلير", "فيرلين"], correct: 1 },
          { fr: "L'autobiographie raconte :", ar: "السيرة الذاتية تحكي :", opts_fr: ["La vie d'un autre", "Sa propre vie", "Une fiction", "Une légende"], opts_ar: ["حياة الآخر", "حياة الكاتب نفسه", "خيال", "أسطورة"], correct: 1 },
        ],
      },
      {
        slug: "3as-fr-argumentation",
        title_fr: "L'argumentation",
        title_ar: "الحجاج",
        questions: [
          { fr: "Argumenter, c'est :", ar: "الحجاج هو :", opts_fr: ["Raconter", "Convaincre par des raisons", "Décrire", "Chanter"], opts_ar: ["السرد", "الإقناع بالحجج", "الوصف", "الإنشاد"], correct: 1 },
          { fr: "Une thèse est :", ar: "الأطروحة :", opts_fr: ["Un livre", "L'idée défendue", "Un personnage", "Un lieu"], opts_ar: ["كتاب", "الفكرة المُدافع عنها", "شخصية", "مكان"], correct: 1 },
          { fr: "Un argument peut être :", ar: "الحجة يمكن أن تكون :", opts_fr: ["Logique, exemple, autorité", "Visuel seulement", "Imaginaire", "Aucun"], opts_ar: ["منطقية، مثالاً، مرجعاً", "بصرية فقط", "خيالية", "لا شيء"], correct: 0 },
          { fr: "Un connecteur de cause est :", ar: "أداة سببية :", opts_fr: ["« puisque »", "« et »", "« mais »", "« ou »"], opts_ar: ["«بما أن»", "«و»", "«لكن»", "«أو»"], correct: 0 },
          { fr: "L'antithèse argumentative présente :", ar: "الأطروحة المضادة :", opts_fr: ["L'idée contraire", "L'idée appuyée", "Une description", "Un récit"], opts_ar: ["الفكرة المعاكسة", "الفكرة المدعومة", "وصف", "سرد"], correct: 0 },
        ],
      },
      {
        slug: "3as-fr-roman",
        title_fr: "Le roman du XXe siècle",
        title_ar: "الرواية في القرن العشرين",
        questions: [
          { fr: "« L'Étranger » est de :", ar: "«الغريب» تأليف :", opts_fr: ["Camus", "Sartre", "Flaubert", "Hugo"], opts_ar: ["كامو", "سارتر", "فلوبير", "هوغو"], correct: 0 },
          { fr: "L'absurde camusien dit que :", ar: "العبث الكامويّ يقول :", opts_fr: ["La vie a un sens clair", "L'existence n'a pas de sens donné", "Tout est joyeux", "Tout est rationnel"], opts_ar: ["الحياة لها معنى واضح", "الوجود بلا معنى مُسلَّم", "كل شيء فرح", "كل شيء عقلاني"], correct: 1 },
          { fr: "Mohammed Dib est l'auteur de :", ar: "محمد ديب مؤلف :", opts_fr: ["La Grande Maison", "Le Petit Prince", "Madame Bovary", "Les Misérables"], opts_ar: ["الدار الكبيرة", "الأمير الصغير", "مدام بوفاري", "البؤساء"], correct: 0 },
          { fr: "Kateb Yacine a écrit :", ar: "كاتب ياسين كتب :", opts_fr: ["Nedjma", "Germinal", "Candide", "Phèdre"], opts_ar: ["نجمة", "جيرمينال", "كانديد", "فيدرا"], correct: 0 },
          { fr: "Le narrateur omniscient sait :", ar: "الراوي العليم يعرف :", opts_fr: ["Rien", "Tout sur les personnages", "Seul le présent", "Sa propre histoire"], opts_ar: ["لا شيء", "كل شيء عن الشخصيات", "الحاضر فقط", "قصته الخاصة"], correct: 1 },
        ],
      },
    ],
  },

  // ============================================================ 4AM (BEM)
  "4AM": {
    "Mathématiques": [
      {
        slug: "4am-trigonometrie",
        title_fr: "Trigonométrie",
        title_ar: "علم المثلثات",
        questions: [
          { fr: "sin(30°) = ?", ar: "sin(30°) = ?", opts_fr: ["1/2", "√3/2", "√2/2", "1"], opts_ar: ["1/2", "√3/2", "√2/2", "1"], correct: 0 },
          { fr: "cos(60°) = ?", ar: "cos(60°) = ?", opts_fr: ["1/2", "√3/2", "0", "1"], opts_ar: ["1/2", "√3/2", "0", "1"], correct: 0 },
          { fr: "tan(45°) = ?", ar: "tan(45°) = ?", opts_fr: ["0", "1", "√3", "∞"], opts_ar: ["0", "1", "√3", "∞"], correct: 1 },
          { fr: "sin²(x) + cos²(x) = ?", ar: "sin²(x) + cos²(x) = ?", opts_fr: ["0", "1", "x", "2"], opts_ar: ["0", "1", "x", "2"], correct: 1 },
          { fr: "Dans un triangle rectangle, sin = ?", ar: "في مثلث قائم، sin = ?", opts_fr: ["côté opposé / hypoténuse", "côté adjacent / hypoténuse", "opposé / adjacent", "1"], opts_ar: ["الضلع المقابل / الوتر", "الضلع المجاور / الوتر", "المقابل / المجاور", "1"], correct: 0 },
        ],
      },
      {
        slug: "4am-statistiques",
        title_fr: "Statistiques de base",
        title_ar: "الإحصاء الأساسي",
        questions: [
          { fr: "La moyenne de {2, 4, 6} est :", ar: "متوسط {2, 4, 6} :", opts_fr: ["2", "4", "6", "12"], opts_ar: ["2", "4", "6", "12"], correct: 1 },
          { fr: "Le mode de {1, 2, 2, 3, 4} est :", ar: "منوال {1, 2, 2, 3, 4} :", opts_fr: ["1", "2", "3", "4"], opts_ar: ["1", "2", "3", "4"], correct: 1 },
          { fr: "L'étendue d'une série est :", ar: "المدى في سلسلة :", opts_fr: ["Max - Min", "Max + Min", "Moyenne", "Somme"], opts_ar: ["الحد الأقصى - الأدنى", "الحد الأقصى + الأدنى", "متوسط", "مجموع"], correct: 0 },
          { fr: "La fréquence de '5' dans {1,5,5,5,9} est :", ar: "تكرار '5' في {1,5,5,5,9} :", opts_fr: ["1", "2", "3", "5"], opts_ar: ["1", "2", "3", "5"], correct: 2 },
          { fr: "Un diagramme circulaire totalise :", ar: "الدائرة الإحصائية مجموعها :", opts_fr: ["100°", "180°", "270°", "360°"], opts_ar: ["100°", "180°", "270°", "360°"], correct: 3 },
        ],
      },
      {
        slug: "4am-fonctions-affines",
        title_fr: "Fonctions affines",
        title_ar: "الدوال التآلفية",
        questions: [
          { fr: "f(x) = 2x + 3, f(0) = ?", ar: "f(x) = 2x + 3، f(0) = ?", opts_fr: ["0", "2", "3", "5"], opts_ar: ["0", "2", "3", "5"], correct: 2 },
          { fr: "f(x) = 5x est une fonction :", ar: "f(x) = 5x دالة :", opts_fr: ["Constante", "Linéaire", "Quadratique", "Inverse"], opts_ar: ["ثابتة", "خطية", "تربيعية", "عكسية"], correct: 1 },
          { fr: "Le coefficient directeur de y = -3x + 2 est :", ar: "ميل y = -3x + 2 :", opts_fr: ["-3", "2", "3", "-2"], opts_ar: ["-3", "2", "3", "-2"], correct: 0 },
          { fr: "Si f(2) = 7 et f est affine de pente 2, alors f(0) = :", ar: "إذا f(2) = 7 و f تآلفية ميلها 2، إذن f(0) = :", opts_fr: ["3", "5", "7", "9"], opts_ar: ["3", "5", "7", "9"], correct: 0 },
          { fr: "La représentation graphique d'une fonction affine est :", ar: "التمثيل البياني لدالة تآلفية :", opts_fr: ["Une parabole", "Une droite", "Une hyperbole", "Un cercle"], opts_ar: ["قطع مكافئ", "مستقيم", "قطع زائد", "دائرة"], correct: 1 },
        ],
      },
      {
        slug: "4am-thales-applications",
        title_fr: "Théorème de Thalès",
        title_ar: "نظرية طاليس",
        questions: [
          { fr: "Le théorème de Thalès s'applique à :", ar: "نظرية طاليس تطبّق على :", opts_fr: ["Cercles", "Droites parallèles", "Angles droits", "Polygones"], opts_ar: ["الدوائر", "المستقيمات المتوازية", "الزوايا القائمة", "المضلعات"], correct: 1 },
          { fr: "Si AB/AD = AC/AE, alors (DE) est :", ar: "إذا AB/AD = AC/AE، إذن (DE) :", opts_fr: ["Perpendiculaire", "Parallèle à (BC)", "Égale à (BC)", "Sécante"], opts_ar: ["عمودي", "موازٍ لـ (BC)", "يساوي (BC)", "قاطع"], correct: 1 },
          { fr: "Si AB/AD = 2 et AC = 5, alors AE = ?", ar: "إذا AB/AD = 2 و AC = 5، إذن AE = ?", opts_fr: ["2.5", "5", "10", "7"], opts_ar: ["2.5", "5", "10", "7"], correct: 0 },
          { fr: "La réciproque de Thalès permet de prouver :", ar: "عكس نظرية طاليس يثبت :", opts_fr: ["L'égalité", "Le parallélisme", "L'angle droit", "La symétrie"], opts_ar: ["التساوي", "التوازي", "الزاوية القائمة", "التماثل"], correct: 1 },
          { fr: "Dans la configuration AM/AB = AN/AC, le rapport :", ar: "في الوضعية AM/AB = AN/AC، النسبة :", opts_fr: ["Vaut 0", "Vaut 1", "Est égale à MN/BC", "Est inutile"], opts_ar: ["تساوي 0", "تساوي 1", "تساوي MN/BC", "غير مفيدة"], correct: 2 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "4am-electricite",
        title_fr: "Électricité",
        title_ar: "الكهرباء",
        questions: [
          { fr: "L'unité de la tension est :", ar: "وحدة التوتر :", opts_fr: ["Ampère", "Volt", "Watt", "Ohm"], opts_ar: ["أمبير", "فولت", "واط", "أوم"], correct: 1 },
          { fr: "La loi d'Ohm est :", ar: "قانون أوم :", opts_fr: ["U = R·I", "U = R/I", "U = R + I", "U = R²"], opts_ar: ["U = R·I", "U = R/I", "U = R + I", "U = R²"], correct: 0 },
          { fr: "Une pile fournit une tension :", ar: "البطارية توفّر توتراً :", opts_fr: ["Variable", "Constante", "Nulle", "Sinusoïdale"], opts_ar: ["متغيراً", "ثابتاً", "معدوماً", "جيبياً"], correct: 1 },
          { fr: "En série, les résistances :", ar: "على التوالي، المقاومات :", opts_fr: ["S'additionnent", "Se multiplient", "Se divisent", "Restent égales"], opts_ar: ["تتجمع", "تتضاعف", "تنقسم", "تبقى متساوية"], correct: 0 },
          { fr: "Le court-circuit cause :", ar: "ماس كهربائي يسبّب :", opts_fr: ["Plus de lumière", "Une coupure ou incendie", "Rien", "Une économie"], opts_ar: ["مزيد من الضوء", "انقطاعاً أو حريقاً", "لا شيء", "اقتصاداً"], correct: 1 },
        ],
      },
      {
        slug: "4am-mecanique",
        title_fr: "Mouvement et vitesse",
        title_ar: "الحركة والسرعة",
        questions: [
          { fr: "La vitesse moyenne = ?", ar: "السرعة المتوسطة = ?", opts_fr: ["distance / temps", "temps / distance", "distance × temps", "force / masse"], opts_ar: ["المسافة / الزمن", "الزمن / المسافة", "المسافة × الزمن", "القوة / الكتلة"], correct: 0 },
          { fr: "120 km en 2 h : la vitesse =", ar: "120 كم في 2 ساعة : السرعة =", opts_fr: ["30 km/h", "60 km/h", "120 km/h", "240 km/h"], opts_ar: ["30 كم/س", "60 كم/س", "120 كم/س", "240 كم/س"], correct: 1 },
          { fr: "Le mouvement uniforme : la vitesse est :", ar: "الحركة المنتظمة : السرعة :", opts_fr: ["Variable", "Constante", "Nulle", "Imprévisible"], opts_ar: ["متغيرة", "ثابتة", "معدومة", "غير متوقعة"], correct: 1 },
          { fr: "L'unité internationale de vitesse :", ar: "الوحدة الدولية للسرعة :", opts_fr: ["km/h", "m/s", "cm/min", "mm/s"], opts_ar: ["كم/س", "م/ث", "سم/د", "ملم/ث"], correct: 1 },
          { fr: "Pour 50 km/h en m/s :", ar: "لـ 50 كم/س بـ م/ث :", opts_fr: ["10", "13.9", "50", "100"], opts_ar: ["10", "13.9", "50", "100"], correct: 1 },
        ],
      },
      {
        slug: "4am-energie",
        title_fr: "Énergie et puissance",
        title_ar: "الطاقة والاستطاعة",
        questions: [
          { fr: "L'unité de l'énergie est :", ar: "وحدة الطاقة :", opts_fr: ["Joule", "Watt", "Volt", "Newton"], opts_ar: ["جول", "واط", "فولت", "نيوتن"], correct: 0 },
          { fr: "P = E/t signifie que la puissance =", ar: "P = E/t يعني الاستطاعة =", opts_fr: ["énergie × temps", "énergie / temps", "tension × courant", "Aucune"], opts_ar: ["طاقة × زمن", "طاقة / زمن", "توتر × تيار", "لا شيء"], correct: 1 },
          { fr: "1 kWh =", ar: "1 كيلوواط ساعة =", opts_fr: ["1000 J", "3.6 MJ", "60 J", "100 J"], opts_ar: ["1000 J", "3.6 MJ", "60 J", "100 J"], correct: 1 },
          { fr: "L'énergie solaire est :", ar: "الطاقة الشمسية :", opts_fr: ["Fossile", "Renouvelable", "Polluante", "Rare"], opts_ar: ["أحفورية", "متجددة", "ملوّثة", "نادرة"], correct: 1 },
          { fr: "Pour économiser l'énergie, on peut :", ar: "لتوفير الطاقة، يمكن :", opts_fr: ["Tout laisser allumé", "Éteindre les appareils", "Augmenter la puissance", "Aucune action"], opts_ar: ["ترك كل شيء مضاءاً", "إطفاء الأجهزة", "زيادة الاستطاعة", "لا فعل"], correct: 1 },
        ],
      },
      {
        slug: "4am-chimie-base",
        title_fr: "Notions de chimie",
        title_ar: "مفاهيم في الكيمياء",
        questions: [
          { fr: "L'eau a pour formule :", ar: "صيغة الماء :", opts_fr: ["H2O", "CO2", "O2", "NaCl"], opts_ar: ["H2O", "CO2", "O2", "NaCl"], correct: 0 },
          { fr: "Un atome est composé de :", ar: "الذرة تتكون من :", opts_fr: ["Protons et neutrons seulement", "Protons, neutrons, électrons", "Électrons seulement", "Molécules"], opts_ar: ["بروتونات ونيوترونات فقط", "بروتونات، نيوترونات، إلكترونات", "إلكترونات فقط", "جزيئات"], correct: 1 },
          { fr: "Une molécule de O2 a :", ar: "جزيء O2 يحتوي :", opts_fr: ["1 atome", "2 atomes d'oxygène", "3 atomes", "Variable"], opts_ar: ["ذرة واحدة", "ذرتين من الأكسجين", "3 ذرات", "متغير"], correct: 1 },
          { fr: "Le pH de l'eau pure est :", ar: "pH الماء النقي :", opts_fr: ["0", "7 (neutre)", "14", "Variable"], opts_ar: ["0", "7 (محايد)", "14", "متغير"], correct: 1 },
          { fr: "Un acide a un pH :", ar: "الحمض pH :", opts_fr: ["Inférieur à 7", "Égal à 7", "Supérieur à 7", "Égal à 14"], opts_ar: ["أقل من 7", "يساوي 7", "أكبر من 7", "يساوي 14"], correct: 0 },
        ],
      },
    ],
  },
};

// Subject lookup helper.
const SUBJECT_FALLBACKS = {
  "Mathématiques": "Math%",
  "Sciences physiques": "%physiques",
  "Sciences naturelles": "%naturelles",
  "Philosophie": "%hilosophie",
  "Arabe": "Arabe",
  "Français": "Fran%ais%",
};

let chaptersCreated = 0;
let questionsCreated = 0;
let chaptersSkipped = 0;
let questionsSkipped = 0;
const failures = [];

for (const [grade, subjects] of Object.entries(SEED)) {
  for (const [subject, chapters] of Object.entries(subjects)) {
    const ilike = SUBJECT_FALLBACKS[subject] ?? subject;
    const { data: subj } = await admin
      .from("subjects")
      .select("id, name_fr")
      .eq("grade_code", grade)
      .ilike("name_fr", ilike)
      .maybeSingle();
    if (!subj) {
      failures.push(`${grade} / ${subject}`);
      continue;
    }
    for (const chSeed of chapters) {
      const { data: ex } = await admin
        .from("chapters")
        .select("id")
        .eq("subject_id", subj.id)
        .eq("slug", chSeed.slug)
        .maybeSingle();
      let chapterId;
      if (ex) {
        chapterId = ex.id;
        chaptersSkipped++;
      } else {
        const { data: ins, error } = await admin
          .from("chapters")
          .insert({
            subject_id: subj.id,
            slug: chSeed.slug,
            title_fr: chSeed.title_fr,
            title_ar: chSeed.title_ar,
            sort_order: 10, // sort after the existing chapters
          })
          .select("id")
          .single();
        if (error) {
          failures.push(`${grade} / ${subject} / ${chSeed.slug}: ${error.message}`);
          continue;
        }
        chapterId = ins.id;
        chaptersCreated++;
      }

      const { data: existQs } = await admin
        .from("quiz_questions")
        .select("id")
        .eq("chapter_id", chapterId)
        .eq("active", true);
      if ((existQs?.length ?? 0) >= 3) {
        questionsSkipped += chSeed.questions.length;
        continue;
      }

      const rows = chSeed.questions.map((q, i) => ({
        chapter_id: chapterId,
        prompt_fr: q.fr,
        prompt_ar: q.ar,
        options_fr: q.opts_fr,
        options_ar: q.opts_ar,
        correct_index: q.correct,
        difficulty: i === 0 ? "easy" : i < 3 ? "medium" : "hard",
        sort_order: i,
        active: true,
      }));
      const { error } = await admin.from("quiz_questions").insert(rows);
      if (error) {
        failures.push(`${grade} / ${subject} / ${chSeed.slug} questions: ${error.message}`);
        continue;
      }
      questionsCreated += rows.length;
    }
  }
}

console.log(`\n✓ Chapters: +${chaptersCreated} created, ${chaptersSkipped} already existed`);
console.log(`✓ Questions: +${questionsCreated} created, ${questionsSkipped} already existed`);
if (failures.length) {
  console.log(`\nFailures:`);
  for (const f of failures) console.log(`  ✗ ${f}`);
}
