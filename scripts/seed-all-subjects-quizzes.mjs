// Seeds chapters + quiz_questions for all non-Math subjects across grades.
// Idempotent: re-run safe — only inserts what's missing.
//
// Pattern: for each (grade, subject) we add 2 chapters with 4 questions each
// (>=3 questions threshold required by the player). Lookup subjects by
// `name_fr ILIKE 'Canonical%'` (same approach as seed-missing-grade-quizzes.mjs).
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

// --------------------------------------------------------------------------
// SEED DATA
// Structure: SEED[gradeCode][subjectKey] = [{ slug, title_fr, title_ar, questions:[...] }]
// subjectKey is matched against subjects.name_fr via ILIKE.
// --------------------------------------------------------------------------

// Subject canonical FR names — used as ILIKE pattern keys.
// Each KEY here MUST be the prefix to match `subjects.name_fr` for that subject.
const SUBJECT_PATTERNS = {
  Arabe: "Arabe%",
  "Français": "Fran%ais%",
  "Éveil scientifique": "%veil scientifique%",
  "Histoire-géographie": "Histoire%",
  Anglais: "Anglais%",
  "Sciences naturelles": "Sciences naturelles%",
  "Sciences physiques": "Sciences physiques%",
  Philosophie: "Philosophie%",
};

const SEED = {
  // ============================================================
  // PRIMARY SCHOOL (1AP-5AP)
  // ============================================================
  "1AP": {
    Arabe: [
      {
        slug: "1ap-ar-alphabet",
        title_fr: "L'alphabet arabe",
        title_ar: "الحروف الهجائية",
        questions: [
          { fr: "Quelle est la première lettre de l'alphabet arabe ?", ar: "ما هو الحرف الأول من الحروف الهجائية ؟", opt_fr: ["ب","ا","ت","ث"], opt_ar: ["ب","ا","ت","ث"], correct: 1 },
          { fr: "Combien de lettres a l'alphabet arabe ?", ar: "كم عدد حروف اللغة العربية ؟", opt_fr: ["26","28","29","30"], opt_ar: ["26","28","29","30"], correct: 1 },
          { fr: "La lettre 'م' se prononce :", ar: "الحرف 'م' يُنطق :", opt_fr: ["Ba","Mim","Nun","Lam"], opt_ar: ["باء","ميم","نون","لام"], correct: 1 },
          { fr: "Quelle est la dernière lettre de l'alphabet ?", ar: "ما هو آخر حرف من الحروف الهجائية ؟", opt_fr: ["ه","و","ي","ن"], opt_ar: ["ه","و","ي","ن"], correct: 2 },
        ],
      },
      {
        slug: "1ap-ar-mots-simples",
        title_fr: "Mots simples et lecture",
        title_ar: "كلمات بسيطة والقراءة",
        questions: [
          { fr: "Le mot 'كتاب' signifie :", ar: "كلمة 'كتاب' تعني :", opt_fr: ["Stylo","Livre","Cahier","École"], opt_ar: ["قلم","كتاب","دفتر","مدرسة"], correct: 1 },
          { fr: "Le mot 'مدرسة' signifie :", ar: "كلمة 'مدرسة' تعني :", opt_fr: ["Maison","Mosquée","École","Marché"], opt_ar: ["بيت","مسجد","مدرسة","سوق"], correct: 2 },
          { fr: "Combien de lettres dans le mot 'قلم' ?", ar: "كم عدد حروف كلمة 'قلم' ؟", opt_fr: ["2","3","4","5"], opt_ar: ["2","3","4","5"], correct: 1 },
          { fr: "Le mot 'بيت' signifie :", ar: "كلمة 'بيت' تعني :", opt_fr: ["Maison","Voiture","Arbre","Jardin"], opt_ar: ["بيت","سيارة","شجرة","حديقة"], correct: 0 },
        ],
      },
    ],
    "Français": [
      {
        slug: "1ap-fr-alphabet",
        title_fr: "L'alphabet français",
        title_ar: "الحروف الفرنسية",
        questions: [
          { fr: "Combien y a-t-il de lettres dans l'alphabet français ?", ar: "كم عدد حروف الأبجدية الفرنسية ؟", opt_fr: ["24","25","26","28"], opt_ar: ["24","25","26","28"], correct: 2 },
          { fr: "Quelle lettre vient après 'B' ?", ar: "ما هو الحرف الذي يأتي بعد 'B' ؟", opt_fr: ["A","C","D","E"], opt_ar: ["A","C","D","E"], correct: 1 },
          { fr: "Combien de voyelles dans l'alphabet français ?", ar: "كم عدد الحروف المتحركة في الفرنسية ؟", opt_fr: ["5","6","7","10"], opt_ar: ["5","6","7","10"], correct: 1 },
          { fr: "Quelle est la première lettre de 'maman' ?", ar: "ما هو الحرف الأول من كلمة 'maman' ؟", opt_fr: ["a","m","n","p"], opt_ar: ["a","m","n","p"], correct: 1 },
        ],
      },
      {
        slug: "1ap-fr-mots-base",
        title_fr: "Mots de base",
        title_ar: "الكلمات الأساسية",
        questions: [
          { fr: "Comment dit-on 'كتاب' en français ?", ar: "كيف نقول 'كتاب' بالفرنسية ؟", opt_fr: ["cahier","livre","stylo","table"], opt_ar: ["cahier","livre","stylo","table"], correct: 1 },
          { fr: "Que veut dire 'école' ?", ar: "ماذا تعني كلمة 'école' ؟", opt_fr: ["مدرسة","بيت","سوق","حديقة"], opt_ar: ["مدرسة","بيت","سوق","حديقة"], correct: 0 },
          { fr: "'Bonjour' se dit le :", ar: "كلمة 'Bonjour' تُقال :", opt_fr: ["Matin","Soir","Nuit","Tout le temps"], opt_ar: ["صباحاً","مساءً","ليلاً","في كل وقت"], correct: 0 },
          { fr: "Que veut dire 'merci' ?", ar: "ماذا تعني كلمة 'merci' ؟", opt_fr: ["مرحباً","شكراً","وداعاً","نعم"], opt_ar: ["مرحباً","شكراً","وداعاً","نعم"], correct: 1 },
        ],
      },
    ],
    "Éveil scientifique": [
      {
        slug: "1ap-eveil-corps-humain",
        title_fr: "Mon corps",
        title_ar: "جسمي",
        questions: [
          { fr: "Avec quoi voyons-nous ?", ar: "بماذا نرى ؟", opt_fr: ["Les oreilles","Les yeux","Le nez","La bouche"], opt_ar: ["الأذنان","العينان","الأنف","الفم"], correct: 1 },
          { fr: "Combien de doigts a une main ?", ar: "كم عدد أصابع اليد ؟", opt_fr: ["3","4","5","6"], opt_ar: ["3","4","5","6"], correct: 2 },
          { fr: "Avec quoi entendons-nous ?", ar: "بماذا نسمع ؟", opt_fr: ["Les yeux","Les oreilles","Le nez","Les pieds"], opt_ar: ["العينان","الأذنان","الأنف","الرجلان"], correct: 1 },
          { fr: "Combien de pieds a un être humain ?", ar: "كم عدد أرجل الإنسان ؟", opt_fr: ["1","2","3","4"], opt_ar: ["1","2","3","4"], correct: 1 },
        ],
      },
      {
        slug: "1ap-eveil-animaux",
        title_fr: "Les animaux",
        title_ar: "الحيوانات",
        questions: [
          { fr: "Le chat dit :", ar: "القط يقول :", opt_fr: ["Wouaf","Miaou","Meuh","Cocorico"], opt_ar: ["واف","مياو","مو","كوكوريكو"], correct: 1 },
          { fr: "Combien de pattes a un chien ?", ar: "كم عدد أرجل الكلب ؟", opt_fr: ["2","3","4","6"], opt_ar: ["2","3","4","6"], correct: 2 },
          { fr: "L'oiseau peut :", ar: "الطائر يستطيع :", opt_fr: ["Nager seulement","Voler","Marcher seulement","Ne rien faire"], opt_ar: ["السباحة فقط","الطيران","المشي فقط","لا شيء"], correct: 1 },
          { fr: "Le poisson vit :", ar: "السمكة تعيش في :", opt_fr: ["Dans l'air","Dans l'eau","Dans le sable","Dans l'arbre"], opt_ar: ["الهواء","الماء","الرمل","الشجرة"], correct: 1 },
        ],
      },
    ],
  },

  "2AP": {
    Arabe: [
      {
        slug: "2ap-ar-harakat",
        title_fr: "Les voyelles courtes (harakat)",
        title_ar: "الحركات",
        questions: [
          { fr: "La fatha (َ) donne le son :", ar: "الفتحة (َ) تعطي الصوت :", opt_fr: ["A","I","OU","E"], opt_ar: ["أَ","إِ","أُ","أيْ"], correct: 0 },
          { fr: "La kasra (ِ) donne le son :", ar: "الكسرة (ِ) تعطي الصوت :", opt_fr: ["A","I","OU","E"], opt_ar: ["أَ","إِ","أُ","أيْ"], correct: 1 },
          { fr: "La damma (ُ) donne le son :", ar: "الضمة (ُ) تعطي الصوت :", opt_fr: ["A","I","OU","E"], opt_ar: ["أَ","إِ","أُ","أيْ"], correct: 2 },
          { fr: "Combien y a-t-il de harakat principales ?", ar: "كم عدد الحركات الأساسية ؟", opt_fr: ["2","3","4","5"], opt_ar: ["2","3","4","5"], correct: 1 },
        ],
      },
      {
        slug: "2ap-ar-phrases-simples",
        title_fr: "Phrases simples",
        title_ar: "الجمل البسيطة",
        questions: [
          { fr: "'هذا قلم' veut dire :", ar: "'هذا قلم' تعني :", opt_fr: ["C'est un livre","C'est un stylo","C'est une école","C'est une chaise"], opt_ar: ["هذا كتاب","هذا قلم","هذه مدرسة","هذا كرسي"], correct: 1 },
          { fr: "Le pluriel de 'كتاب' est :", ar: "جمع كلمة 'كتاب' هو :", opt_fr: ["كتب","كتاباً","كاتب","مكتوب"], opt_ar: ["كتب","كتاباً","كاتب","مكتوب"], correct: 0 },
          { fr: "'الباب' signifie :", ar: "'الباب' يعني :", opt_fr: ["La fenêtre","La porte","Le mur","Le toit"], opt_ar: ["النافذة","الباب","الجدار","السقف"], correct: 1 },
          { fr: "Le féminin de 'معلّم' est :", ar: "مؤنث كلمة 'معلّم' هو :", opt_fr: ["معلّمة","معلّمات","تعليم","مُتعلّم"], opt_ar: ["معلّمة","معلّمات","تعليم","مُتعلّم"], correct: 0 },
        ],
      },
    ],
    "Français": [
      {
        slug: "2ap-fr-articles",
        title_fr: "Les articles : le, la, les",
        title_ar: "أدوات التعريف : le, la, les",
        questions: [
          { fr: "On dit ___ table.", ar: "نقول ___ table.", opt_fr: ["le","la","les","l'"], opt_ar: ["le","la","les","l'"], correct: 1 },
          { fr: "On dit ___ livre.", ar: "نقول ___ livre.", opt_fr: ["le","la","les","l'"], opt_ar: ["le","la","les","l'"], correct: 0 },
          { fr: "On dit ___ enfants.", ar: "نقول ___ enfants.", opt_fr: ["le","la","les","l'"], opt_ar: ["le","la","les","l'"], correct: 2 },
          { fr: "On dit ___ école.", ar: "نقول ___ école.", opt_fr: ["le","la","les","l'"], opt_ar: ["le","la","les","l'"], correct: 3 },
        ],
      },
      {
        slug: "2ap-fr-couleurs",
        title_fr: "Les couleurs",
        title_ar: "الألوان",
        questions: [
          { fr: "Le ciel est :", ar: "السماء :", opt_fr: ["rouge","bleu","vert","jaune"], opt_ar: ["حمراء","زرقاء","خضراء","صفراء"], correct: 1 },
          { fr: "Le soleil est :", ar: "الشمس :", opt_fr: ["bleu","vert","jaune","noir"], opt_ar: ["زرقاء","خضراء","صفراء","سوداء"], correct: 2 },
          { fr: "L'herbe est :", ar: "العشب :", opt_fr: ["rouge","verte","bleue","grise"], opt_ar: ["أحمر","أخضر","أزرق","رمادي"], correct: 1 },
          { fr: "La nuit est :", ar: "الليل :", opt_fr: ["blanc","jaune","rouge","noir"], opt_ar: ["أبيض","أصفر","أحمر","أسود"], correct: 3 },
        ],
      },
    ],
  },

  "3AP": {
    Arabe: [
      {
        slug: "3ap-ar-types-mots",
        title_fr: "Nom, verbe, particule",
        title_ar: "الاسم والفعل والحرف",
        questions: [
          { fr: "'كتب' est :", ar: "'كتب' هو :", opt_fr: ["Un nom","Un verbe","Une particule","Un adjectif"], opt_ar: ["اسم","فعل","حرف","صفة"], correct: 1 },
          { fr: "'محمد' est :", ar: "'محمد' هو :", opt_fr: ["Un nom","Un verbe","Une particule","Un adverbe"], opt_ar: ["اسم","فعل","حرف","ظرف"], correct: 0 },
          { fr: "'في' est :", ar: "'في' هو :", opt_fr: ["Un nom","Un verbe","Une particule","Un pronom"], opt_ar: ["اسم","فعل","حرف","ضمير"], correct: 2 },
          { fr: "Le verbe 'يلعب' est au :", ar: "الفعل 'يلعب' في :", opt_fr: ["Passé","Présent","Impératif","Futur"], opt_ar: ["الماضي","المضارع","الأمر","المستقبل"], correct: 1 },
        ],
      },
      {
        slug: "3ap-ar-pluriel-singulier",
        title_fr: "Singulier et pluriel",
        title_ar: "المفرد والجمع",
        questions: [
          { fr: "Le pluriel de 'تلميذ' est :", ar: "جمع كلمة 'تلميذ' هو :", opt_fr: ["تلميذة","تلاميذ","تلميذان","يتلمذ"], opt_ar: ["تلميذة","تلاميذ","تلميذان","يتلمذ"], correct: 1 },
          { fr: "Le pluriel de 'بيت' est :", ar: "جمع كلمة 'بيت' هو :", opt_fr: ["بيوت","بيتان","بيتة","بائت"], opt_ar: ["بيوت","بيتان","بيتة","بائت"], correct: 0 },
          { fr: "Le duel de 'ولد' est :", ar: "مثنى كلمة 'ولد' هو :", opt_fr: ["أولاد","ولدان","ولدة","يلد"], opt_ar: ["أولاد","ولدان","ولدة","يلد"], correct: 1 },
          { fr: "Le pluriel de 'قلم' est :", ar: "جمع كلمة 'قلم' هو :", opt_fr: ["قلمان","أقلام","قلمة","قالم"], opt_ar: ["قلمان","أقلام","قلمة","قالم"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "3ap-fr-pluriel",
        title_fr: "Le pluriel des noms",
        title_ar: "جمع الأسماء",
        questions: [
          { fr: "Le pluriel de 'cheval' est :", ar: "جمع 'cheval' هو :", opt_fr: ["chevals","chevaux","chevales","chevau"], opt_ar: ["chevals","chevaux","chevales","chevau"], correct: 1 },
          { fr: "Le pluriel de 'jeu' est :", ar: "جمع 'jeu' هو :", opt_fr: ["jeus","jeux","jeues","jeut"], opt_ar: ["jeus","jeux","jeues","jeut"], correct: 1 },
          { fr: "Le pluriel de 'maison' est :", ar: "جمع 'maison' هو :", opt_fr: ["maison","maisons","maisones","maisonx"], opt_ar: ["maison","maisons","maisones","maisonx"], correct: 1 },
          { fr: "Le pluriel de 'animal' est :", ar: "جمع 'animal' هو :", opt_fr: ["animals","animaux","animales","animaus"], opt_ar: ["animals","animaux","animales","animaus"], correct: 1 },
        ],
      },
      {
        slug: "3ap-fr-conjugaison",
        title_fr: "Le présent : être et avoir",
        title_ar: "المضارع : être و avoir",
        questions: [
          { fr: "Je ___ élève.", ar: "Je ___ élève.", opt_fr: ["es","est","suis","ai"], opt_ar: ["es","est","suis","ai"], correct: 2 },
          { fr: "Tu ___ un livre.", ar: "Tu ___ un livre.", opt_fr: ["a","as","es","ai"], opt_ar: ["a","as","es","ai"], correct: 1 },
          { fr: "Il ___ grand.", ar: "Il ___ grand.", opt_fr: ["es","est","sont","êtes"], opt_ar: ["es","est","sont","êtes"], correct: 1 },
          { fr: "Nous ___ une voiture.", ar: "Nous ___ une voiture.", opt_fr: ["avons","avez","ont","sommes"], opt_ar: ["avons","avez","ont","sommes"], correct: 0 },
        ],
      },
    ],
    "Éveil scientifique": [
      {
        slug: "3ap-eveil-eau",
        title_fr: "L'eau et ses états",
        title_ar: "الماء وحالاته",
        questions: [
          { fr: "L'eau gelée s'appelle :", ar: "الماء المتجمد يُسمى :", opt_fr: ["Vapeur","Glace","Liquide","Brouillard"], opt_ar: ["بخار","ثلج","سائل","ضباب"], correct: 1 },
          { fr: "L'eau bout à :", ar: "الماء يغلي عند :", opt_fr: ["0°C","50°C","100°C","200°C"], opt_ar: ["0°م","50°م","100°م","200°م"], correct: 2 },
          { fr: "L'eau gèle à :", ar: "الماء يتجمد عند :", opt_fr: ["0°C","10°C","100°C","-100°C"], opt_ar: ["0°م","10°م","100°م","-100°م"], correct: 0 },
          { fr: "Combien d'états a l'eau ?", ar: "كم حالة للماء ؟", opt_fr: ["1","2","3","4"], opt_ar: ["1","2","3","4"], correct: 2 },
        ],
      },
      {
        slug: "3ap-eveil-plantes",
        title_fr: "Les plantes",
        title_ar: "النباتات",
        questions: [
          { fr: "Les plantes ont besoin de :", ar: "النباتات تحتاج إلى :", opt_fr: ["Lumière et eau","Eau seulement","Lumière seulement","Rien"], opt_ar: ["ضوء وماء","ماء فقط","ضوء فقط","لا شيء"], correct: 0 },
          { fr: "La partie qui absorbe l'eau est :", ar: "الجزء الذي يمتص الماء هو :", opt_fr: ["La feuille","La tige","La racine","La fleur"], opt_ar: ["الورقة","الساق","الجذر","الزهرة"], correct: 2 },
          { fr: "La photosynthèse se fait dans :", ar: "التركيب الضوئي يحدث في :", opt_fr: ["Les racines","Les feuilles","Les fleurs","Les fruits"], opt_ar: ["الجذور","الأوراق","الأزهار","الثمار"], correct: 1 },
          { fr: "Le fruit contient :", ar: "الثمرة تحتوي على :", opt_fr: ["Des feuilles","Des graines","Des racines","Du sable"], opt_ar: ["أوراق","بذور","جذور","رمل"], correct: 1 },
        ],
      },
    ],
  },

  "4AP": {
    Arabe: [
      {
        slug: "4ap-ar-grammaire-base",
        title_fr: "Grammaire de base",
        title_ar: "قواعد أساسية",
        questions: [
          { fr: "Le sujet de la phrase 'يلعبُ الولدُ' est :", ar: "الفاعل في جملة 'يلعبُ الولدُ' هو :", opt_fr: ["يلعب","الولد","ـُ","لا شيء"], opt_ar: ["يلعب","الولد","ـُ","لا شيء"], correct: 1 },
          { fr: "Le verbe dans 'كتب التلميذ الدرس' est :", ar: "الفعل في 'كتب التلميذ الدرس' هو :", opt_fr: ["كتب","التلميذ","الدرس","كل ما سبق"], opt_ar: ["كتب","التلميذ","الدرس","كل ما سبق"], correct: 0 },
          { fr: "Le complément d'objet dans 'يقرأُ محمدٌ القصةَ' est :", ar: "المفعول به في 'يقرأُ محمدٌ القصةَ' هو :", opt_fr: ["يقرأ","محمد","القصة","لا يوجد"], opt_ar: ["يقرأ","محمد","القصة","لا يوجد"], correct: 2 },
          { fr: "La phrase nominale commence par :", ar: "الجملة الاسمية تبدأ بـ :", opt_fr: ["Un verbe","Un nom","Une particule","Un adjectif"], opt_ar: ["فعل","اسم","حرف","صفة"], correct: 1 },
        ],
      },
      {
        slug: "4ap-ar-conjugaison",
        title_fr: "Conjugaison : passé et présent",
        title_ar: "التصريف : الماضي والمضارع",
        questions: [
          { fr: "Le présent de 'كتبَ' avec 'هو' est :", ar: "مضارع 'كتبَ' مع 'هو' :", opt_fr: ["يكتُب","كاتب","مكتوب","اكتُب"], opt_ar: ["يكتُب","كاتب","مكتوب","اكتُب"], correct: 0 },
          { fr: "Le passé de 'يقرأ' avec 'هي' est :", ar: "ماضي 'يقرأ' مع 'هي' :", opt_fr: ["قرأَ","قرأَتْ","تقرأ","اقرأي"], opt_ar: ["قرأَ","قرأَتْ","تقرأ","اقرأي"], correct: 1 },
          { fr: "L'impératif de 'يلعب' est :", ar: "الأمر من 'يلعب' :", opt_fr: ["لعب","يلعب","العب","لاعب"], opt_ar: ["لعب","يلعب","العب","لاعب"], correct: 2 },
          { fr: "'سأذهبُ' indique :", ar: "'سأذهبُ' تدل على :", opt_fr: ["Le passé","Le présent","Le futur","L'impératif"], opt_ar: ["الماضي","المضارع","المستقبل","الأمر"], correct: 2 },
        ],
      },
    ],
    "Français": [
      {
        slug: "4ap-fr-passe-compose",
        title_fr: "Le passé composé",
        title_ar: "زمن الماضي المركّب",
        questions: [
          { fr: "Le passé composé est formé de :", ar: "الماضي المركب يتكوّن من :", opt_fr: ["1 verbe","Auxiliaire + participe passé","2 noms","2 adjectifs"], opt_ar: ["فعل واحد","فعل مساعد + اسم مفعول","اسمين","صفتين"], correct: 1 },
          { fr: "Choisis le bon : J'___ mangé.", ar: "اختر الصحيح : J'___ mangé.", opt_fr: ["suis","ai","es","as"], opt_ar: ["suis","ai","es","as"], correct: 1 },
          { fr: "Choisis le bon : Elle ___ partie.", ar: "اختر الصحيح : Elle ___ partie.", opt_fr: ["a","as","est","ont"], opt_ar: ["a","as","est","ont"], correct: 2 },
          { fr: "Le passé composé du verbe 'finir' avec 'nous' :", ar: "ماضي مركب للفعل 'finir' مع 'nous' :", opt_fr: ["nous finissons","nous avons fini","nous finirons","nous finîmes"], opt_ar: ["nous finissons","nous avons fini","nous finirons","nous finîmes"], correct: 1 },
        ],
      },
      {
        slug: "4ap-fr-types-phrases",
        title_fr: "Les types de phrases",
        title_ar: "أنواع الجمل",
        questions: [
          { fr: "'Quelle belle journée !' est une phrase :", ar: "'Quelle belle journée !' جملة :", opt_fr: ["Déclarative","Interrogative","Exclamative","Impérative"], opt_ar: ["خبرية","استفهامية","تعجبية","أمرية"], correct: 2 },
          { fr: "'Va à l'école !' est une phrase :", ar: "'Va à l'école !' جملة :", opt_fr: ["Déclarative","Interrogative","Exclamative","Impérative"], opt_ar: ["خبرية","استفهامية","تعجبية","أمرية"], correct: 3 },
          { fr: "'Comment t'appelles-tu ?' est :", ar: "'Comment t'appelles-tu ?' جملة :", opt_fr: ["Déclarative","Interrogative","Exclamative","Impérative"], opt_ar: ["خبرية","استفهامية","تعجبية","أمرية"], correct: 1 },
          { fr: "'Le soleil brille.' est :", ar: "'Le soleil brille.' جملة :", opt_fr: ["Déclarative","Interrogative","Exclamative","Impérative"], opt_ar: ["خبرية","استفهامية","تعجبية","أمرية"], correct: 0 },
        ],
      },
    ],
    "Éveil scientifique": [
      {
        slug: "4ap-eveil-systeme-solaire",
        title_fr: "Le système solaire",
        title_ar: "النظام الشمسي",
        questions: [
          { fr: "Combien de planètes dans le système solaire ?", ar: "كم عدد الكواكب في النظام الشمسي ؟", opt_fr: ["7","8","9","10"], opt_ar: ["7","8","9","10"], correct: 1 },
          { fr: "La planète la plus proche du Soleil est :", ar: "أقرب كوكب إلى الشمس هو :", opt_fr: ["Vénus","Terre","Mercure","Mars"], opt_ar: ["الزهرة","الأرض","عطارد","المريخ"], correct: 2 },
          { fr: "La Terre tourne autour de :", ar: "الأرض تدور حول :", opt_fr: ["La Lune","Le Soleil","Mars","Une étoile"], opt_ar: ["القمر","الشمس","المريخ","نجم"], correct: 1 },
          { fr: "Combien de temps met la Terre pour tourner sur elle-même ?", ar: "كم تستغرق الأرض لتدور حول نفسها ؟", opt_fr: ["1 heure","12 heures","24 heures","1 mois"], opt_ar: ["ساعة","12 ساعة","24 ساعة","شهر"], correct: 2 },
        ],
      },
      {
        slug: "4ap-eveil-electricite",
        title_fr: "L'électricité",
        title_ar: "الكهرباء",
        questions: [
          { fr: "Pour faire briller une ampoule, il faut :", ar: "لإضاءة المصباح نحتاج إلى :", opt_fr: ["De l'eau","Un circuit fermé","Du sable","Du papier"], opt_ar: ["ماء","دائرة مغلقة","رمل","ورق"], correct: 1 },
          { fr: "Un objet qui laisse passer le courant est :", ar: "الجسم الذي يسمح بمرور التيار يُسمى :", opt_fr: ["Isolant","Conducteur","Magnétique","Liquide"], opt_ar: ["عازل","ناقل","مغناطيسي","سائل"], correct: 1 },
          { fr: "Le bois est :", ar: "الخشب :", opt_fr: ["Conducteur","Isolant","Liquide","Métal"], opt_ar: ["ناقل","عازل","سائل","معدن"], correct: 1 },
          { fr: "Le métal est :", ar: "المعدن :", opt_fr: ["Isolant","Conducteur","Plastique","Bois"], opt_ar: ["عازل","ناقل","بلاستيك","خشب"], correct: 1 },
        ],
      },
    ],
    "Histoire-géographie": [
      {
        slug: "4ap-hg-algerie-geo",
        title_fr: "Géographie de l'Algérie",
        title_ar: "جغرافيا الجزائر",
        questions: [
          { fr: "La capitale de l'Algérie est :", ar: "عاصمة الجزائر هي :", opt_fr: ["Oran","Alger","Constantine","Annaba"], opt_ar: ["وهران","الجزائر","قسنطينة","عنابة"], correct: 1 },
          { fr: "Au nord de l'Algérie se trouve :", ar: "في شمال الجزائر يوجد :", opt_fr: ["Le Sahara","La mer Méditerranée","Le Maroc","La Tunisie"], opt_ar: ["الصحراء","البحر المتوسط","المغرب","تونس"], correct: 1 },
          { fr: "Le grand désert au sud s'appelle :", ar: "الصحراء الكبرى في الجنوب تُسمى :", opt_fr: ["Le Tell","Les Hauts plateaux","Le Sahara","La Kabylie"], opt_ar: ["التل","الهضاب العليا","الصحراء","القبائل"], correct: 2 },
          { fr: "L'Algérie est en :", ar: "الجزائر تقع في :", opt_fr: ["Europe","Asie","Afrique du Nord","Amérique"], opt_ar: ["أوروبا","آسيا","شمال إفريقيا","أمريكا"], correct: 2 },
        ],
      },
      {
        slug: "4ap-hg-revolution",
        title_fr: "La Révolution algérienne",
        title_ar: "الثورة الجزائرية",
        questions: [
          { fr: "La Révolution algérienne a commencé en :", ar: "بدأت الثورة الجزائرية في :", opt_fr: ["1945","1954","1962","1830"], opt_ar: ["1945","1954","1962","1830"], correct: 1 },
          { fr: "L'indépendance de l'Algérie a été proclamée en :", ar: "أُعلن استقلال الجزائر في :", opt_fr: ["1830","1945","1954","1962"], opt_ar: ["1830","1945","1954","1962"], correct: 3 },
          { fr: "Le 1er novembre 1954, le déclencheur fut :", ar: "في 1 نوفمبر 1954 كان منطلق :", opt_fr: ["L'indépendance","La Révolution","La colonisation","Une fête"], opt_ar: ["الاستقلال","الثورة","الاستعمار","عيد"], correct: 1 },
          { fr: "Combien d'années a duré la colonisation française ?", ar: "كم سنة دامت الاستعمار الفرنسي ؟", opt_fr: ["50","100","132","200"], opt_ar: ["50","100","132","200"], correct: 2 },
        ],
      },
    ],
  },

  "5AP": {
    Arabe: [
      {
        slug: "5ap-ar-grammaire-avancee",
        title_fr: "Grammaire avancée",
        title_ar: "قواعد متقدّمة",
        questions: [
          { fr: "Le 'مرفوع' (nominatif) prend la marque :", ar: "المرفوع علامته :", opt_fr: ["الفتحة","الضمة","الكسرة","السكون"], opt_ar: ["الفتحة","الضمة","الكسرة","السكون"], correct: 1 },
          { fr: "Le 'منصوب' (accusatif) prend la marque :", ar: "المنصوب علامته :", opt_fr: ["الفتحة","الضمة","الكسرة","السكون"], opt_ar: ["الفتحة","الضمة","الكسرة","السكون"], correct: 0 },
          { fr: "Le 'مجرور' (génitif) prend la marque :", ar: "المجرور علامته :", opt_fr: ["الفتحة","الضمة","الكسرة","السكون"], opt_ar: ["الفتحة","الضمة","الكسرة","السكون"], correct: 2 },
          { fr: "Dans 'كتبتُ الدرسَ', الدرسَ est :", ar: "في 'كتبتُ الدرسَ', 'الدرسَ' هو :", opt_fr: ["فاعل","مفعول به","مبتدأ","خبر"], opt_ar: ["فاعل","مفعول به","مبتدأ","خبر"], correct: 1 },
        ],
      },
      {
        slug: "5ap-ar-vocabulaire",
        title_fr: "Vocabulaire et synonymes",
        title_ar: "المفردات والمرادفات",
        questions: [
          { fr: "Le synonyme de 'جميل' est :", ar: "مرادف 'جميل' :", opt_fr: ["قبيح","حسن","صغير","كبير"], opt_ar: ["قبيح","حسن","صغير","كبير"], correct: 1 },
          { fr: "Le contraire de 'كبير' est :", ar: "ضد 'كبير' :", opt_fr: ["ضخم","واسع","صغير","طويل"], opt_ar: ["ضخم","واسع","صغير","طويل"], correct: 2 },
          { fr: "Le synonyme de 'سعيد' est :", ar: "مرادف 'سعيد' :", opt_fr: ["حزين","فرح","غاضب","خائف"], opt_ar: ["حزين","فرح","غاضب","خائف"], correct: 1 },
          { fr: "Le contraire de 'نهار' est :", ar: "ضد 'نهار' :", opt_fr: ["شمس","ليل","صباح","ظهر"], opt_ar: ["شمس","ليل","صباح","ظهر"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "5ap-fr-temps-verbaux",
        title_fr: "Les temps verbaux",
        title_ar: "الأزمنة الفعلية",
        questions: [
          { fr: "'Hier, j'ai mangé' est au :", ar: "'Hier, j'ai mangé' في :", opt_fr: ["Présent","Passé composé","Futur","Imparfait"], opt_ar: ["المضارع","الماضي المركب","المستقبل","الماضي الناقص"], correct: 1 },
          { fr: "'Je mangerai demain' est au :", ar: "'Je mangerai demain' في :", opt_fr: ["Présent","Passé","Futur simple","Imparfait"], opt_ar: ["المضارع","الماضي","المستقبل البسيط","الماضي الناقص"], correct: 2 },
          { fr: "'Quand j'étais petit, je jouais' utilise l'imparfait dans :", ar: "'Quand j'étais petit, je jouais' الماضي الناقص في :", opt_fr: ["étais","jouais","les deux","aucun"], opt_ar: ["étais","jouais","الاثنان","لا أحد"], correct: 2 },
          { fr: "Le futur simple de 'finir' avec 'nous' :", ar: "المستقبل البسيط لـ 'finir' مع 'nous' :", opt_fr: ["nous finirons","nous avons fini","nous finissions","nous finir"], opt_ar: ["nous finirons","nous avons fini","nous finissions","nous finir"], correct: 0 },
        ],
      },
      {
        slug: "5ap-fr-cod-coi",
        title_fr: "COD et COI",
        title_ar: "المفعول المباشر وغير المباشر",
        questions: [
          { fr: "Dans 'Je lis un livre', 'un livre' est :", ar: "في 'Je lis un livre', 'un livre' :", opt_fr: ["Sujet","COD","COI","CC"], opt_ar: ["فاعل","مفعول مباشر","مفعول غير مباشر","ظرف"], correct: 1 },
          { fr: "Dans 'Je parle à mon ami', 'à mon ami' est :", ar: "في 'Je parle à mon ami', 'à mon ami' :", opt_fr: ["Sujet","COD","COI","Verbe"], opt_ar: ["فاعل","مفعول مباشر","مفعول غير مباشر","فعل"], correct: 2 },
          { fr: "Le COD répond à la question :", ar: "المفعول المباشر يجيب عن :", opt_fr: ["Où ?","Quand ?","Quoi ? Qui ?","Comment ?"], opt_ar: ["أين ؟","متى ؟","ماذا ؟ من ؟","كيف ؟"], correct: 2 },
          { fr: "Le COI commence par :", ar: "المفعول غير المباشر يبدأ بـ :", opt_fr: ["Un nom seul","Une préposition","Un adjectif","Un adverbe"], opt_ar: ["اسم وحده","حرف جر","صفة","ظرف"], correct: 1 },
        ],
      },
    ],
    "Éveil scientifique": [
      {
        slug: "5ap-eveil-digestion",
        title_fr: "La digestion",
        title_ar: "الهضم",
        questions: [
          { fr: "La digestion commence dans :", ar: "يبدأ الهضم في :", opt_fr: ["L'estomac","La bouche","L'intestin","Le foie"], opt_ar: ["المعدة","الفم","الأمعاء","الكبد"], correct: 1 },
          { fr: "Les dents servent à :", ar: "الأسنان تستخدم لـ :", opt_fr: ["Voir","Mastiquer","Respirer","Entendre"], opt_ar: ["الرؤية","المضغ","التنفس","السمع"], correct: 1 },
          { fr: "L'organe qui produit la bile est :", ar: "العضو الذي ينتج العصارة الصفراوية :", opt_fr: ["Le cœur","Le foie","L'estomac","Le poumon"], opt_ar: ["القلب","الكبد","المعدة","الرئة"], correct: 1 },
          { fr: "Les nutriments sont absorbés dans :", ar: "تُمتص العناصر الغذائية في :", opt_fr: ["L'estomac","L'intestin grêle","Le gros intestin","La bouche"], opt_ar: ["المعدة","الأمعاء الدقيقة","الأمعاء الغليظة","الفم"], correct: 1 },
        ],
      },
      {
        slug: "5ap-eveil-respiration",
        title_fr: "La respiration",
        title_ar: "التنفس",
        questions: [
          { fr: "Les organes de la respiration sont :", ar: "أعضاء التنفس :", opt_fr: ["Le cœur","Les poumons","L'estomac","Les reins"], opt_ar: ["القلب","الرئتان","المعدة","الكليتان"], correct: 1 },
          { fr: "On inspire de :", ar: "نستنشق :", opt_fr: ["L'oxygène","Le dioxyde de carbone","L'azote","L'eau"], opt_ar: ["الأكسجين","ثاني أكسيد الكربون","النيتروجين","الماء"], correct: 0 },
          { fr: "On expire :", ar: "نُخرج :", opt_fr: ["L'oxygène","Le dioxyde de carbone","L'eau","L'azote"], opt_ar: ["الأكسجين","ثاني أكسيد الكربون","الماء","النيتروجين"], correct: 1 },
          { fr: "Les poumons sont protégés par :", ar: "الرئتان محميتان بـ :", opt_fr: ["Le crâne","La cage thoracique","La colonne vertébrale","Le bassin"], opt_ar: ["الجمجمة","القفص الصدري","العمود الفقري","الحوض"], correct: 1 },
        ],
      },
    ],
  },

  // ============================================================
  // MIDDLE SCHOOL (1AM-4AM)
  // ============================================================
  "1AM": {
    Anglais: [
      {
        slug: "1am-en-greetings",
        title_fr: "Greetings & introductions",
        title_ar: "التحيات والتقديم",
        questions: [
          { fr: "How do you say 'Bonjour' in English?", ar: "كيف نقول 'صباح الخير' بالإنجليزية ؟", opt_fr: ["Goodbye","Hello","Thanks","Please"], opt_ar: ["Goodbye","Hello","Thanks","Please"], correct: 1 },
          { fr: "'My name ___ Ahmed.'", ar: "'My name ___ Ahmed.'", opt_fr: ["am","is","are","be"], opt_ar: ["am","is","are","be"], correct: 1 },
          { fr: "'How ___ you?' — 'I am fine.'", ar: "'How ___ you?' — 'I am fine.'", opt_fr: ["am","is","are","be"], opt_ar: ["am","is","are","be"], correct: 2 },
          { fr: "Translate: 'وداعاً'", ar: "ترجم : 'وداعاً'", opt_fr: ["Hello","Goodbye","Thanks","Sorry"], opt_ar: ["Hello","Goodbye","Thanks","Sorry"], correct: 1 },
        ],
      },
      {
        slug: "1am-en-pronouns",
        title_fr: "Personal pronouns",
        title_ar: "الضمائر الشخصية",
        questions: [
          { fr: "'___ am a student.'", ar: "'___ am a student.'", opt_fr: ["He","She","I","They"], opt_ar: ["He","She","I","They"], correct: 2 },
          { fr: "Pronoun for 'Mary':", ar: "الضمير لـ 'Mary' :", opt_fr: ["He","She","It","They"], opt_ar: ["He","She","It","They"], correct: 1 },
          { fr: "Pronoun for 'a book':", ar: "الضمير لـ 'a book' :", opt_fr: ["He","She","It","We"], opt_ar: ["He","She","It","We"], correct: 2 },
          { fr: "'___ are my friends.'", ar: "'___ are my friends.'", opt_fr: ["He","She","It","They"], opt_ar: ["He","She","It","They"], correct: 3 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "1am-ar-jumla-ismiya",
        title_fr: "La phrase nominale",
        title_ar: "الجملة الاسمية",
        questions: [
          { fr: "Le 'مبتدأ' est généralement :", ar: "المبتدأ عادةً :", opt_fr: ["مرفوع","منصوب","مجرور","مجزوم"], opt_ar: ["مرفوع","منصوب","مجرور","مجزوم"], correct: 0 },
          { fr: "Dans 'الجوُّ صافٍ', le مبتدأ est :", ar: "في 'الجوُّ صافٍ', المبتدأ هو :", opt_fr: ["الجوّ","صافٍ","لا شيء","الاثنان"], opt_ar: ["الجوّ","صافٍ","لا شيء","الاثنان"], correct: 0 },
          { fr: "Le 'خبر' est :", ar: "الخبر :", opt_fr: ["مرفوع","منصوب","مجرور","مجزوم"], opt_ar: ["مرفوع","منصوب","مجرور","مجزوم"], correct: 0 },
          { fr: "La phrase nominale commence par :", ar: "الجملة الاسمية تبدأ بـ :", opt_fr: ["فعل","اسم","حرف","ضمير منفصل فقط"], opt_ar: ["فعل","اسم","حرف","ضمير منفصل فقط"], correct: 1 },
        ],
      },
      {
        slug: "1am-ar-figures-style",
        title_fr: "Figures de style",
        title_ar: "الصور البلاغية",
        questions: [
          { fr: "Une 'تشبيه' est :", ar: "التشبيه هو :", opt_fr: ["Un nom","Une comparaison","Un verbe","Une particule"], opt_ar: ["اسم","تشبيه","فعل","حرف"], correct: 1 },
          { fr: "'كأنّ' est une particule de :", ar: "'كأنّ' حرف :", opt_fr: ["Nasb","Jazm","Tashbih","Istifham"], opt_ar: ["نصب","جزم","تشبيه","استفهام"], correct: 2 },
          { fr: "'الاستعارة' est basée sur :", ar: "الاستعارة تقوم على :", opt_fr: ["تشبيه","تشبيه محذوف الطرفين","تكرار","ترادف"], opt_ar: ["تشبيه","تشبيه محذوف الطرفين","تكرار","ترادف"], correct: 1 },
          { fr: "'كالأسد في الشجاعة' est :", ar: "'كالأسد في الشجاعة' :", opt_fr: ["تشبيه","استعارة","كناية","سجع"], opt_ar: ["تشبيه","استعارة","كناية","سجع"], correct: 0 },
        ],
      },
    ],
    "Français": [
      {
        slug: "1am-fr-types-textes",
        title_fr: "Types de textes",
        title_ar: "أنواع النصوص",
        questions: [
          { fr: "Une recette de cuisine est un texte :", ar: "وصفة طبخ نصّ :", opt_fr: ["Narratif","Descriptif","Prescriptif","Argumentatif"], opt_ar: ["سردي","وصفي","توجيهي","حجاجي"], correct: 2 },
          { fr: "Un conte est un texte :", ar: "الحكاية نصّ :", opt_fr: ["Narratif","Descriptif","Prescriptif","Informatif"], opt_ar: ["سردي","وصفي","توجيهي","إخباري"], correct: 0 },
          { fr: "Un texte qui décrit un paysage est :", ar: "نص يصف منظراً هو :", opt_fr: ["Narratif","Descriptif","Argumentatif","Dialogue"], opt_ar: ["سردي","وصفي","حجاجي","حوار"], correct: 1 },
          { fr: "Un texte avec arguments pour convaincre est :", ar: "نص بحجج للإقناع هو :", opt_fr: ["Narratif","Descriptif","Argumentatif","Dialogue"], opt_ar: ["سردي","وصفي","حجاجي","حوار"], correct: 2 },
        ],
      },
      {
        slug: "1am-fr-conjugaison-imparfait",
        title_fr: "L'imparfait",
        title_ar: "الماضي الناقص",
        questions: [
          { fr: "Imparfait de 'aimer' avec 'je' :", ar: "الماضي الناقص لـ 'aimer' مع 'je' :", opt_fr: ["aime","aimais","aimerai","aimé"], opt_ar: ["aime","aimais","aimerai","aimé"], correct: 1 },
          { fr: "Imparfait de 'finir' avec 'nous' :", ar: "الماضي الناقص لـ 'finir' مع 'nous' :", opt_fr: ["finissons","finissions","finîmes","finirons"], opt_ar: ["finissons","finissions","finîmes","finirons"], correct: 1 },
          { fr: "L'imparfait exprime :", ar: "الماضي الناقص يعبر عن :", opt_fr: ["Le futur","Une action passée habituelle","Un ordre","Un souhait"], opt_ar: ["المستقبل","عمل ماضٍ معتاد","أمراً","تمنياً"], correct: 1 },
          { fr: "Imparfait de 'être' avec 'il' :", ar: "الماضي الناقص لـ 'être' مع 'il' :", opt_fr: ["est","était","sera","fût"], opt_ar: ["est","était","sera","fût"], correct: 1 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "1am-svt-cellule",
        title_fr: "La cellule",
        title_ar: "الخلية",
        questions: [
          { fr: "L'unité de base du vivant est :", ar: "الوحدة الأساسية للكائن الحي :", opt_fr: ["L'atome","La cellule","La molécule","Le tissu"], opt_ar: ["الذرة","الخلية","الجزيء","النسيج"], correct: 1 },
          { fr: "Le noyau contient :", ar: "النواة تحتوي على :", opt_fr: ["L'eau","L'ADN","Le sang","L'air"], opt_ar: ["ماء","الحمض النووي","دم","هواء"], correct: 1 },
          { fr: "Les cellules végétales ont une :", ar: "الخلايا النباتية تحتوي على :", opt_fr: ["Coquille","Paroi cellulaire","Carapace","Squelette"], opt_ar: ["قشرة","جدار خلوي","صدفة","هيكل"], correct: 1 },
          { fr: "On observe la cellule avec :", ar: "نلاحظ الخلية بـ :", opt_fr: ["Une loupe","Un microscope","Un télescope","Les yeux"], opt_ar: ["عدسة","مجهر","منظار","العين"], correct: 1 },
        ],
      },
      {
        slug: "1am-svt-classification",
        title_fr: "Classification des êtres vivants",
        title_ar: "تصنيف الكائنات الحية",
        questions: [
          { fr: "Le chien est un :", ar: "الكلب :", opt_fr: ["Reptile","Oiseau","Mammifère","Poisson"], opt_ar: ["زاحف","طائر","ثديي","سمكة"], correct: 2 },
          { fr: "Les serpents sont des :", ar: "الثعابين :", opt_fr: ["Mammifères","Reptiles","Oiseaux","Amphibiens"], opt_ar: ["ثدييات","زواحف","طيور","برمائيات"], correct: 1 },
          { fr: "La grenouille est :", ar: "الضفدع :", opt_fr: ["Mammifère","Reptile","Amphibien","Poisson"], opt_ar: ["ثديي","زاحف","برمائي","سمكة"], correct: 2 },
          { fr: "Les abeilles sont des :", ar: "النحل :", opt_fr: ["Mammifères","Insectes","Reptiles","Poissons"], opt_ar: ["ثدييات","حشرات","زواحف","أسماك"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "1am-phy-matiere",
        title_fr: "États de la matière",
        title_ar: "حالات المادة",
        questions: [
          { fr: "L'eau est dans l'état :", ar: "الماء في الحالة :", opt_fr: ["Solide","Liquide","Gazeux","Tous"], opt_ar: ["صلبة","سائلة","غازية","الكل"], correct: 1 },
          { fr: "La glace est :", ar: "الجليد :", opt_fr: ["Solide","Liquide","Gazeux","Plasma"], opt_ar: ["صلب","سائل","غاز","بلازما"], correct: 0 },
          { fr: "L'air est :", ar: "الهواء :", opt_fr: ["Solide","Liquide","Gazeux","Plasma"], opt_ar: ["صلب","سائل","غاز","بلازما"], correct: 2 },
          { fr: "Le passage de liquide à gaz s'appelle :", ar: "الانتقال من سائل إلى غاز يُسمى :", opt_fr: ["Fusion","Vaporisation","Solidification","Condensation"], opt_ar: ["انصهار","تبخر","تجمد","تكاثف"], correct: 1 },
        ],
      },
      {
        slug: "1am-phy-volume",
        title_fr: "Volume et mesure",
        title_ar: "الحجم والقياس",
        questions: [
          { fr: "L'unité du volume au SI est :", ar: "وحدة الحجم في النظام الدولي :", opt_fr: ["Mètre","Mètre cube","Litre","Gramme"], opt_ar: ["متر","متر مكعب","لتر","غرام"], correct: 1 },
          { fr: "1 L = combien de cm³ ?", ar: "1 لتر = كم سم³ ؟", opt_fr: ["10","100","1000","10000"], opt_ar: ["10","100","1000","10000"], correct: 2 },
          { fr: "On mesure le volume d'un liquide avec :", ar: "نقيس حجم سائل بـ :", opt_fr: ["Une règle","Un thermomètre","Une éprouvette graduée","Une balance"], opt_ar: ["مسطرة","ميزان حرارة","مخبار مدرج","ميزان"], correct: 2 },
          { fr: "1 m³ = combien de L ?", ar: "1 م³ = كم لتر ؟", opt_fr: ["10","100","1000","10000"], opt_ar: ["10","100","1000","10000"], correct: 2 },
        ],
      },
    ],
  },

  "2AM": {
    Anglais: [
      {
        slug: "2am-en-present-simple",
        title_fr: "Present simple",
        title_ar: "المضارع البسيط",
        questions: [
          { fr: "'She ___ to school every day.'", ar: "'She ___ to school every day.'", opt_fr: ["go","goes","going","gone"], opt_ar: ["go","goes","going","gone"], correct: 1 },
          { fr: "'They ___ football.'", ar: "'They ___ football.'", opt_fr: ["play","plays","played","playing"], opt_ar: ["play","plays","played","playing"], correct: 0 },
          { fr: "Negative: 'He ___ like coffee.'", ar: "النفي : 'He ___ like coffee.'", opt_fr: ["don't","doesn't","didn't","not"], opt_ar: ["don't","doesn't","didn't","not"], correct: 1 },
          { fr: "Question: '___ you speak English?'", ar: "سؤال : '___ you speak English?'", opt_fr: ["Are","Is","Do","Does"], opt_ar: ["Are","Is","Do","Does"], correct: 2 },
        ],
      },
      {
        slug: "2am-en-vocabulary-family",
        title_fr: "Family vocabulary",
        title_ar: "مفردات العائلة",
        questions: [
          { fr: "My mother's brother is my:", ar: "أخو أمي هو :", opt_fr: ["Cousin","Uncle","Father","Nephew"], opt_ar: ["Cousin","Uncle","Father","Nephew"], correct: 1 },
          { fr: "My father's mother is my:", ar: "أم أبي هي :", opt_fr: ["Aunt","Sister","Grandmother","Cousin"], opt_ar: ["Aunt","Sister","Grandmother","Cousin"], correct: 2 },
          { fr: "My sister's daughter is my:", ar: "بنت أختي هي :", opt_fr: ["Cousin","Niece","Aunt","Sister"], opt_ar: ["Cousin","Niece","Aunt","Sister"], correct: 1 },
          { fr: "Translate 'parents':", ar: "ترجم 'parents' :", opt_fr: ["إخوة","أبناء","والدان","أعمام"], opt_ar: ["إخوة","أبناء","والدان","أعمام"], correct: 2 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "2am-ar-jumla-filiya",
        title_fr: "La phrase verbale",
        title_ar: "الجملة الفعلية",
        questions: [
          { fr: "Dans 'كتب الطالبُ الدرسَ', le فاعل est :", ar: "في 'كتب الطالبُ الدرسَ', الفاعل :", opt_fr: ["كتب","الطالب","الدرس","لا شيء"], opt_ar: ["كتب","الطالب","الدرس","لا شيء"], correct: 1 },
          { fr: "Le فاعل est :", ar: "الفاعل :", opt_fr: ["مرفوع","منصوب","مجرور","ساكن"], opt_ar: ["مرفوع","منصوب","مجرور","ساكن"], correct: 0 },
          { fr: "La phrase verbale commence par :", ar: "الجملة الفعلية تبدأ بـ :", opt_fr: ["اسم","فعل","حرف","صفة"], opt_ar: ["اسم","فعل","حرف","صفة"], correct: 1 },
          { fr: "Le مفعول به est :", ar: "المفعول به :", opt_fr: ["مرفوع","منصوب","مجرور","ساكن"], opt_ar: ["مرفوع","منصوب","مجرور","ساكن"], correct: 1 },
        ],
      },
      {
        slug: "2am-ar-mathna-jam3",
        title_fr: "Duel et pluriel",
        title_ar: "المثنى والجمع",
        questions: [
          { fr: "Le duel se forme en ajoutant :", ar: "المثنى يتكوّن بإضافة :", opt_fr: ["ون / ين","ان / ين","ات","ـة"], opt_ar: ["ون / ين","ان / ين","ات","ـة"], correct: 1 },
          { fr: "Le pluriel masculin sain ajoute :", ar: "جمع المذكر السالم يضيف :", opt_fr: ["ون / ين","ان / ين","ات","ـة"], opt_ar: ["ون / ين","ان / ين","ات","ـة"], correct: 0 },
          { fr: "Le pluriel féminin sain ajoute :", ar: "جمع المؤنث السالم يضيف :", opt_fr: ["ون / ين","ان / ين","ات","ـة"], opt_ar: ["ون / ين","ان / ين","ات","ـة"], correct: 2 },
          { fr: "'كتب' (pluriel de كتاب) est un :", ar: "'كتب' (جمع كتاب) :", opt_fr: ["Pluriel sain","Pluriel brisé","Duel","Singulier"], opt_ar: ["جمع سالم","جمع تكسير","مثنى","مفرد"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "2am-fr-narration",
        title_fr: "Le texte narratif",
        title_ar: "النص السردي",
        questions: [
          { fr: "Les temps du récit sont :", ar: "أزمنة السرد :", opt_fr: ["Présent","Passé simple et imparfait","Futur","Conditionnel"], opt_ar: ["مضارع","ماضٍ بسيط وناقص","مستقبل","شرطي"], correct: 1 },
          { fr: "Le schéma narratif a combien d'étapes ?", ar: "البنية السردية كم مرحلة ؟", opt_fr: ["3","4","5","6"], opt_ar: ["3","4","5","6"], correct: 2 },
          { fr: "La 1ère étape du schéma narratif :", ar: "أول مرحلة في البنية السردية :", opt_fr: ["Élément perturbateur","Situation initiale","Dénouement","Péripéties"], opt_ar: ["عنصر مفجّر","وضعية أولية","حلّ","أحداث"], correct: 1 },
          { fr: "Le narrateur est :", ar: "السارد :", opt_fr: ["Le héros","Celui qui raconte","L'auteur seul","Le lecteur"], opt_ar: ["البطل","الذي يروي","المؤلف فقط","القارئ"], correct: 1 },
        ],
      },
      {
        slug: "2am-fr-passe-simple",
        title_fr: "Le passé simple",
        title_ar: "الماضي البسيط",
        questions: [
          { fr: "Passé simple de 'chanter' avec 'il' :", ar: "ماضي بسيط 'chanter' مع 'il' :", opt_fr: ["chanta","chantait","chante","chantera"], opt_ar: ["chanta","chantait","chante","chantera"], correct: 0 },
          { fr: "Passé simple de 'finir' avec 'elle' :", ar: "ماضي بسيط 'finir' مع 'elle' :", opt_fr: ["finissait","finit","finira","finie"], opt_ar: ["finissait","finit","finira","finie"], correct: 1 },
          { fr: "Le passé simple est utilisé surtout :", ar: "الماضي البسيط يُستعمل خاصة :", opt_fr: ["À l'oral","À l'écrit (récit)","Dans la conversation","Jamais"], opt_ar: ["شفويا","كتابيا (السرد)","في المحادثة","أبدا"], correct: 1 },
          { fr: "Passé simple de 'être' avec 'il' :", ar: "ماضي بسيط 'être' مع 'il' :", opt_fr: ["est","était","fut","sera"], opt_ar: ["est","était","fut","sera"], correct: 2 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "2am-svt-respiration",
        title_fr: "La respiration humaine",
        title_ar: "التنفس عند الإنسان",
        questions: [
          { fr: "L'organe principal de la respiration :", ar: "العضو الرئيسي للتنفس :", opt_fr: ["Le cœur","Les poumons","Les reins","Le foie"], opt_ar: ["القلب","الرئتان","الكليتان","الكبد"], correct: 1 },
          { fr: "On inspire surtout :", ar: "نستنشق خاصة :", opt_fr: ["O₂","CO₂","N₂","H₂O"], opt_ar: ["O₂","CO₂","N₂","H₂O"], correct: 0 },
          { fr: "L'échange gazeux se fait dans :", ar: "التبادل الغازي يحدث في :", opt_fr: ["La trachée","Les bronches","Les alvéoles","Le nez"], opt_ar: ["الرغامى","القصبات","الأسناخ","الأنف"], correct: 2 },
          { fr: "Le diaphragme est :", ar: "الحجاب الحاجز :", opt_fr: ["Un os","Un muscle","Une glande","Un nerf"], opt_ar: ["عظم","عضلة","غدة","عصب"], correct: 1 },
        ],
      },
      {
        slug: "2am-svt-nutrition",
        title_fr: "Nutrition et alimentation",
        title_ar: "التغذية والأكل",
        questions: [
          { fr: "Les protéines servent à :", ar: "البروتينات تستخدم لـ :", opt_fr: ["Donner de l'énergie","Construire le corps","Hydrater","Respirer"], opt_ar: ["إعطاء الطاقة","بناء الجسم","الترطيب","التنفس"], correct: 1 },
          { fr: "Les glucides donnent surtout :", ar: "السكريات تعطي خاصة :", opt_fr: ["De l'énergie","Du sang","Des os","Du muscle"], opt_ar: ["طاقة","دماً","عظاماً","عضلاً"], correct: 0 },
          { fr: "Les vitamines sont :", ar: "الفيتامينات :", opt_fr: ["Inutiles","Indispensables","Toxiques","Caloriques"], opt_ar: ["عديمة الفائدة","ضرورية","سامة","عالية السعرات"], correct: 1 },
          { fr: "Une alimentation équilibrée doit être :", ar: "التغذية المتوازنة يجب أن تكون :", opt_fr: ["Variée","Monotone","Sucrée","Grasse"], opt_ar: ["متنوعة","رتيبة","حلوة","دهنية"], correct: 0 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "2am-phy-electricite",
        title_fr: "Circuits électriques",
        title_ar: "الدارات الكهربائية",
        questions: [
          { fr: "Pour qu'une lampe s'allume, le circuit doit être :", ar: "لإضاءة المصباح يجب أن تكون الدارة :", opt_fr: ["Ouvert","Fermé","Cassé","Vide"], opt_ar: ["مفتوحة","مغلقة","مقطوعة","فارغة"], correct: 1 },
          { fr: "Le générateur fournit :", ar: "المولد يزود :", opt_fr: ["De la lumière","De l'eau","Du courant","Du son"], opt_ar: ["ضوءاً","ماء","تياراً","صوتاً"], correct: 2 },
          { fr: "Les piles sont :", ar: "البطاريات :", opt_fr: ["Des récepteurs","Des générateurs","Des fils","Des interrupteurs"], opt_ar: ["مستقبلات","مولدات","أسلاك","قواطع"], correct: 1 },
          { fr: "Le sens conventionnel du courant va :", ar: "الاتجاه الاصطلاحي للتيار من :", opt_fr: ["Du - au +","Du + au -","Aléatoire","Aucun"], opt_ar: ["السالب إلى الموجب","الموجب إلى السالب","عشوائي","لا اتجاه"], correct: 1 },
        ],
      },
      {
        slug: "2am-phy-lumiere",
        title_fr: "La lumière",
        title_ar: "الضوء",
        questions: [
          { fr: "La lumière se propage en :", ar: "الضوء ينتشر في :", opt_fr: ["Courbe","Ligne droite","Cercle","Spirale"], opt_ar: ["منحنى","خط مستقيم","دائرة","حلزون"], correct: 1 },
          { fr: "Une source primaire de lumière :", ar: "مصدر أوّلي للضوء :", opt_fr: ["La Lune","Le Soleil","Un miroir","Une feuille"], opt_ar: ["القمر","الشمس","مرآة","ورقة"], correct: 1 },
          { fr: "L'ombre est due :", ar: "الظل ناتج عن :", opt_fr: ["À la chaleur","À un objet opaque","Au vent","Au bruit"], opt_ar: ["الحرارة","جسم معتم","الرياح","الضجيج"], correct: 1 },
          { fr: "La vitesse de la lumière est environ :", ar: "سرعة الضوء تقريباً :", opt_fr: ["300 km/s","3 000 km/s","300 000 km/s","3 km/s"], opt_ar: ["300 كم/ث","3 000 كم/ث","300 000 كم/ث","3 كم/ث"], correct: 2 },
        ],
      },
    ],
  },

  "3AM": {
    Anglais: [
      {
        slug: "3am-en-past-simple",
        title_fr: "Past simple",
        title_ar: "الماضي البسيط",
        questions: [
          { fr: "'I ___ to the cinema yesterday.'", ar: "'I ___ to the cinema yesterday.'", opt_fr: ["go","goes","went","going"], opt_ar: ["go","goes","went","going"], correct: 2 },
          { fr: "Past of 'eat':", ar: "ماضي 'eat' :", opt_fr: ["eated","ate","eaten","eating"], opt_ar: ["eated","ate","eaten","eating"], correct: 1 },
          { fr: "'She ___ TV last night.'", ar: "'She ___ TV last night.'", opt_fr: ["watch","watches","watched","watching"], opt_ar: ["watch","watches","watched","watching"], correct: 2 },
          { fr: "Negative: 'They ___ come.'", ar: "النفي : 'They ___ come.'", opt_fr: ["doesn't","didn't","don't","wasn't"], opt_ar: ["doesn't","didn't","don't","wasn't"], correct: 1 },
        ],
      },
      {
        slug: "3am-en-comparatives",
        title_fr: "Comparatives & superlatives",
        title_ar: "المقارنات والتفضيل",
        questions: [
          { fr: "'Big' comparative:", ar: "مقارن 'big' :", opt_fr: ["bigger","more big","biggest","more bigger"], opt_ar: ["bigger","more big","biggest","more bigger"], correct: 0 },
          { fr: "'Good' comparative:", ar: "مقارن 'good' :", opt_fr: ["gooder","more good","better","best"], opt_ar: ["gooder","more good","better","best"], correct: 2 },
          { fr: "'Beautiful' superlative:", ar: "تفضيل 'beautiful' :", opt_fr: ["beautifuler","most beautiful","more beautiful","beautifulest"], opt_ar: ["beautifuler","most beautiful","more beautiful","beautifulest"], correct: 1 },
          { fr: "'This book is ___ than that one.'", ar: "'This book is ___ than that one.'", opt_fr: ["interesting","more interesting","most interesting","interestinger"], opt_ar: ["interesting","more interesting","most interesting","interestinger"], correct: 1 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "3am-ar-balagha",
        title_fr: "Rhétorique : tashbih, isti3ara",
        title_ar: "البلاغة : التشبيه والاستعارة",
        questions: [
          { fr: "Le تشبيه a combien d'éléments principaux ?", ar: "التشبيه له كم ركن أساسي ؟", opt_fr: ["2","3","4","5"], opt_ar: ["2","3","4","5"], correct: 2 },
          { fr: "L'استعارة est un :", ar: "الاستعارة :", opt_fr: ["تشبيه كامل","تشبيه حُذف أحد طرفيه","ترادف","تضاد"], opt_ar: ["تشبيه كامل","تشبيه حُذف أحد طرفيه","ترادف","تضاد"], correct: 1 },
          { fr: "Dans 'الجندي أسد', il s'agit de :", ar: "في 'الجندي أسد' هذا :", opt_fr: ["تشبيه بليغ","استعارة مكنية","استعارة تصريحية","كناية"], opt_ar: ["تشبيه بليغ","استعارة مكنية","استعارة تصريحية","كناية"], correct: 0 },
          { fr: "'وجه القمر' (en parlant d'un humain) :", ar: "'وجه القمر' (للإنسان) :", opt_fr: ["تشبيه","استعارة","كناية","سجع"], opt_ar: ["تشبيه","استعارة","كناية","سجع"], correct: 1 },
        ],
      },
      {
        slug: "3am-ar-i3rab",
        title_fr: "Analyse grammaticale (i3rab)",
        title_ar: "الإعراب",
        questions: [
          { fr: "Dans 'الكتابُ مفيدٌ', الكتاب est :", ar: "في 'الكتابُ مفيدٌ', الكتاب :", opt_fr: ["مبتدأ مرفوع","خبر مرفوع","فاعل","مفعول به"], opt_ar: ["مبتدأ مرفوع","خبر مرفوع","فاعل","مفعول به"], correct: 0 },
          { fr: "Dans 'إنّ الطالبَ مجتهدٌ', الطالب est :", ar: "في 'إنّ الطالبَ مجتهدٌ', الطالب :", opt_fr: ["مرفوع","منصوب (اسم إنّ)","مجرور","فاعل"], opt_ar: ["مرفوع","منصوب (اسم إنّ)","مجرور","فاعل"], correct: 1 },
          { fr: "Le نعت suit son منعوت en :", ar: "النعت يتبع منعوته في :", opt_fr: ["Le genre seulement","Le nombre seulement","Genre, nombre, cas, déterminé","Rien"], opt_ar: ["النوع فقط","العدد فقط","النوع والعدد والإعراب والتعريف","لا شيء"], correct: 2 },
          { fr: "Après 'في', le mot est :", ar: "بعد 'في' الاسم :", opt_fr: ["مرفوع","منصوب","مجرور","ساكن"], opt_ar: ["مرفوع","منصوب","مجرور","ساكن"], correct: 2 },
        ],
      },
    ],
    "Français": [
      {
        slug: "3am-fr-argumentation",
        title_fr: "Le texte argumentatif",
        title_ar: "النص الحجاجي",
        questions: [
          { fr: "Le but du texte argumentatif est de :", ar: "هدف النص الحجاجي :", opt_fr: ["Raconter","Décrire","Convaincre","Faire rire"], opt_ar: ["السرد","الوصف","الإقناع","الإضحاك"], correct: 2 },
          { fr: "Une thèse est :", ar: "الأطروحة :", opt_fr: ["Un récit","Une opinion défendue","Une description","Un dialogue"], opt_ar: ["سرد","رأي يُدافع عنه","وصف","حوار"], correct: 1 },
          { fr: "Un argument est appuyé par :", ar: "الحجة تُدعّم بـ :", opt_fr: ["Une rime","Un exemple","Un dessin","Une chanson"], opt_ar: ["قافية","مثال","رسم","أغنية"], correct: 1 },
          { fr: "'Cependant' est un connecteur :", ar: "'Cependant' أداة :", opt_fr: ["D'addition","D'opposition","De cause","De temps"], opt_ar: ["إضافة","معارضة","سببية","زمنية"], correct: 1 },
        ],
      },
      {
        slug: "3am-fr-subjonctif",
        title_fr: "Le subjonctif présent",
        title_ar: "صيغة المضارع المُلْزِم (subjonctif)",
        questions: [
          { fr: "'Il faut que je ___ '(faire)':", ar: "'Il faut que je ___ '(faire)' :", opt_fr: ["fais","fasse","faisais","ferai"], opt_ar: ["fais","fasse","faisais","ferai"], correct: 1 },
          { fr: "'Que tu ___' (être) ':", ar: "'Que tu ___' (être) :", opt_fr: ["es","sois","étais","seras"], opt_ar: ["es","sois","étais","seras"], correct: 1 },
          { fr: "Le subjonctif s'emploie après :", ar: "المضارع المُلْزِم يُستعمل بعد :", opt_fr: ["'parce que'","'que' (volonté/doute)","'donc'","'mais'"], opt_ar: ["'parce que'","'que' (إرادة/شك)","'donc'","'mais'"], correct: 1 },
          { fr: "'Que nous ___' (avoir) ':", ar: "'Que nous ___' (avoir) :", opt_fr: ["avons","ayons","avions","aurons"], opt_ar: ["avons","ayons","avions","aurons"], correct: 1 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "3am-svt-reproduction",
        title_fr: "Reproduction humaine",
        title_ar: "التكاثر عند الإنسان",
        questions: [
          { fr: "La cellule reproductrice masculine :", ar: "الخلية التناسلية الذكرية :", opt_fr: ["L'ovule","Le spermatozoïde","Le zygote","L'embryon"], opt_ar: ["البويضة","النطفة","البيضة الملقحة","الجنين"], correct: 1 },
          { fr: "La fécondation est la rencontre :", ar: "الإلقاح هو لقاء :", opt_fr: ["De 2 ovules","Spermatozoïde + ovule","De 2 spermatozoïdes","De 2 cellules quelconques"], opt_ar: ["بويضتين","نطفة + بويضة","نطفتين","خليتين أيًا كان نوعهما"], correct: 1 },
          { fr: "La grossesse dure environ :", ar: "الحمل يدوم تقريباً :", opt_fr: ["3 mois","6 mois","9 mois","12 mois"], opt_ar: ["3 أشهر","6 أشهر","9 أشهر","12 شهراً"], correct: 2 },
          { fr: "L'embryon se développe dans :", ar: "الجنين يتطوّر في :", opt_fr: ["L'ovaire","L'utérus","Les trompes","Le placenta"], opt_ar: ["المبيض","الرحم","قناتي فالوب","المشيمة"], correct: 1 },
        ],
      },
      {
        slug: "3am-svt-systeme-nerveux",
        title_fr: "Le système nerveux",
        title_ar: "الجهاز العصبي",
        questions: [
          { fr: "L'organe central du système nerveux :", ar: "العضو المركزي للجهاز العصبي :", opt_fr: ["Le cœur","Le cerveau","Le foie","Les poumons"], opt_ar: ["القلب","الدماغ","الكبد","الرئتان"], correct: 1 },
          { fr: "Le nerf transmet :", ar: "العصب ينقل :", opt_fr: ["Du sang","Des signaux électriques","De l'oxygène","De l'eau"], opt_ar: ["دم","إشارات كهربائية","أكسجين","ماء"], correct: 1 },
          { fr: "Le réflexe est :", ar: "المنعكس :", opt_fr: ["Volontaire","Involontaire","Mémorisé","Choisi"], opt_ar: ["إرادي","لا إرادي","محفوظ","مختار"], correct: 1 },
          { fr: "La cellule nerveuse s'appelle :", ar: "الخلية العصبية تُسمى :", opt_fr: ["Globule","Neurone","Tissu","Synapse"], opt_ar: ["كرية","عصبون","نسيج","مشبك"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "3am-phy-tension",
        title_fr: "Tension électrique",
        title_ar: "التوتر الكهربائي",
        questions: [
          { fr: "L'unité de la tension est :", ar: "وحدة التوتر :", opt_fr: ["Ampère","Volt","Ohm","Watt"], opt_ar: ["أمبير","فولط","أوم","واط"], correct: 1 },
          { fr: "On mesure la tension avec :", ar: "نقيس التوتر بـ :", opt_fr: ["Ampèremètre","Voltmètre","Ohmmètre","Wattmètre"], opt_ar: ["أمبيرمتر","فولطمتر","أوممتر","واطمتر"], correct: 1 },
          { fr: "Le voltmètre se branche en :", ar: "الفولطمتر يُربط على :", opt_fr: ["Série","Dérivation","Aucun","Parallèle au générateur uniquement"], opt_ar: ["تسلسل","توازي","لا شيء","موازياً للمولد فقط"], correct: 1 },
          { fr: "Tension d'une pile plate standard :", ar: "توتر بطارية مسطحة عادية :", opt_fr: ["1,5 V","4,5 V","9 V","12 V"], opt_ar: ["1,5 V","4,5 V","9 V","12 V"], correct: 1 },
        ],
      },
      {
        slug: "3am-phy-air",
        title_fr: "L'air et sa composition",
        title_ar: "الهواء وتركيبه",
        questions: [
          { fr: "L'air contient surtout :", ar: "الهواء يحتوي خاصة على :", opt_fr: ["Oxygène","Azote","Hydrogène","CO₂"], opt_ar: ["الأكسجين","النيتروجين","الهيدروجين","CO₂"], correct: 1 },
          { fr: "Pourcentage d'oxygène dans l'air :", ar: "نسبة الأكسجين في الهواء :", opt_fr: ["~10%","~21%","~50%","~78%"], opt_ar: ["~10%","~21%","~50%","~78%"], correct: 1 },
          { fr: "Le gaz qu'on rejette en respirant :", ar: "الغاز الذي نطرحه عند التنفس :", opt_fr: ["O₂","CO₂","N₂","H₂"], opt_ar: ["O₂","CO₂","N₂","H₂"], correct: 1 },
          { fr: "L'air a une masse :", ar: "الهواء له كتلة :", opt_fr: ["Nulle","Mesurable","Négative","Infinie"], opt_ar: ["معدومة","قابلة للقياس","سالبة","لانهائية"], correct: 1 },
        ],
      },
    ],
    "Histoire-géographie": [
      {
        slug: "3am-hg-monde-arabe",
        title_fr: "Le monde arabe",
        title_ar: "العالم العربي",
        questions: [
          { fr: "Combien de pays arabes y a-t-il (Ligue arabe) ?", ar: "كم عدد الدول العربية في الجامعة العربية ؟", opt_fr: ["18","22","25","30"], opt_ar: ["18","22","25","30"], correct: 1 },
          { fr: "Le plus grand pays arabe par superficie :", ar: "أكبر دولة عربية مساحة :", opt_fr: ["Égypte","Arabie saoudite","Algérie","Soudan"], opt_ar: ["مصر","السعودية","الجزائر","السودان"], correct: 2 },
          { fr: "Le canal de Suez est en :", ar: "قناة السويس في :", opt_fr: ["Algérie","Égypte","Maroc","Tunisie"], opt_ar: ["الجزائر","مصر","المغرب","تونس"], correct: 1 },
          { fr: "La langue officielle du monde arabe :", ar: "اللغة الرسمية للعالم العربي :", opt_fr: ["Berbère","Arabe","Anglais","Français"], opt_ar: ["الأمازيغية","العربية","الإنجليزية","الفرنسية"], correct: 1 },
        ],
      },
      {
        slug: "3am-hg-emir-abdelkader",
        title_fr: "L'Émir Abdelkader",
        title_ar: "الأمير عبد القادر",
        questions: [
          { fr: "L'Émir Abdelkader a résisté contre :", ar: "الأمير عبد القادر قاوم ضد :", opt_fr: ["Les Ottomans","La colonisation française","Les Espagnols","Les Britanniques"], opt_ar: ["العثمانيين","الاستعمار الفرنسي","الإسبان","البريطانيين"], correct: 1 },
          { fr: "Il a été proclamé Émir en :", ar: "بويع أميراً سنة :", opt_fr: ["1830","1832","1840","1847"], opt_ar: ["1830","1832","1840","1847"], correct: 1 },
          { fr: "Sa résistance a duré environ :", ar: "دامت مقاومته تقريباً :", opt_fr: ["5 ans","10 ans","15 ans","30 ans"], opt_ar: ["5 سنوات","10 سنوات","15 سنة","30 سنة"], correct: 2 },
          { fr: "Il s'est rendu en :", ar: "استسلم سنة :", opt_fr: ["1832","1840","1847","1870"], opt_ar: ["1832","1840","1847","1870"], correct: 2 },
        ],
      },
    ],
  },

  "4AM": {
    Anglais: [
      {
        slug: "4am-en-present-perfect",
        title_fr: "Present perfect",
        title_ar: "المضارع التام",
        questions: [
          { fr: "'I ___ never been to London.'", ar: "'I ___ never been to London.'", opt_fr: ["am","have","has","had"], opt_ar: ["am","have","has","had"], correct: 1 },
          { fr: "Past participle of 'go':", ar: "اسم المفعول لـ 'go' :", opt_fr: ["went","gone","going","goed"], opt_ar: ["went","gone","going","goed"], correct: 1 },
          { fr: "'She ___ already finished.'", ar: "'She ___ already finished.'", opt_fr: ["have","has","had","is"], opt_ar: ["have","has","had","is"], correct: 1 },
          { fr: "Use present perfect for:", ar: "نستعمل المضارع التام للتعبير عن :", opt_fr: ["Future events","Past actions with present effect","Habits","Permanent states"], opt_ar: ["أحداث مستقبلية","عمل ماضٍ ذو أثر حالي","عادات","حالات دائمة"], correct: 1 },
        ],
      },
      {
        slug: "4am-en-conditionals",
        title_fr: "Conditionals (1st & 2nd)",
        title_ar: "الجمل الشرطية",
        questions: [
          { fr: "'If it rains, I ___ stay home.'", ar: "'If it rains, I ___ stay home.'", opt_fr: ["will","would","wouldn't","am"], opt_ar: ["will","would","wouldn't","am"], correct: 0 },
          { fr: "'If I ___ rich, I would travel.'", ar: "'If I ___ rich, I would travel.'", opt_fr: ["am","was","were","be"], opt_ar: ["am","was","were","be"], correct: 2 },
          { fr: "1st conditional uses:", ar: "الشرط الأول يستعمل :", opt_fr: ["if + past","if + present, will","if + would","if + present perfect"], opt_ar: ["if + past","if + present, will","if + would","if + present perfect"], correct: 1 },
          { fr: "2nd conditional expresses:", ar: "الشرط الثاني يعبّر عن :", opt_fr: ["Real situation","Imaginary/unreal situation","Habit","Past fact"], opt_ar: ["وضعية حقيقية","وضعية خيالية","عادة","حقيقة ماضية"], correct: 1 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "4am-ar-iqtibas",
        title_fr: "Argumentation et figures",
        title_ar: "الحجاج والصور البيانية",
        questions: [
          { fr: "L'enseignement religieux et littéraire transmet :", ar: "الموروث الديني والأدبي يحمل :", opt_fr: ["Une seule idée","Des valeurs","Rien","Des chiffres"], opt_ar: ["فكرة واحدة","قيماً","لا شيء","أرقاماً"], correct: 1 },
          { fr: "L'الكناية est :", ar: "الكناية :", opt_fr: ["تشبيه","استعارة","تعبير غير مباشر","ترادف"], opt_ar: ["تشبيه","استعارة","تعبير غير مباشر","ترادف"], correct: 2 },
          { fr: "Dans 'فلان نظيف اليد' (cleanhanded), c'est :", ar: "'فلان نظيف اليد' :", opt_fr: ["تشبيه","استعارة","كناية عن النزاهة","سجع"], opt_ar: ["تشبيه","استعارة","كناية عن النزاهة","سجع"], correct: 2 },
          { fr: "Le السجع est :", ar: "السجع :", opt_fr: ["Rime à la fin de phrases","Comparaison","Métaphore","Argument"], opt_ar: ["توافق نهاية الجمل","تشبيه","استعارة","حجة"], correct: 0 },
        ],
      },
      {
        slug: "4am-ar-i3rab-avance",
        title_fr: "Analyse syntaxique avancée",
        title_ar: "الإعراب المتقدّم",
        questions: [
          { fr: "Dans 'كان الجوُّ جميلاً', الجو est :", ar: "في 'كان الجوُّ جميلاً', الجو :", opt_fr: ["مبتدأ","اسم كان مرفوع","خبر كان منصوب","فاعل"], opt_ar: ["مبتدأ","اسم كان مرفوع","خبر كان منصوب","فاعل"], correct: 1 },
          { fr: "Dans 'كان الجوُّ جميلاً', جميلاً est :", ar: "في 'كان الجوُّ جميلاً', جميلاً :", opt_fr: ["مبتدأ","اسم كان","خبر كان منصوب","فاعل"], opt_ar: ["مبتدأ","اسم كان","خبر كان منصوب","فاعل"], correct: 2 },
          { fr: "L'حال décrit :", ar: "الحال يصف :", opt_fr: ["Le moment de l'action","L'état du sujet/objet","Le lieu","La cause"], opt_ar: ["زمن الفعل","هيئة الفاعل/المفعول","المكان","السبب"], correct: 1 },
          { fr: "L'حال est :", ar: "الحال :", opt_fr: ["مرفوع","منصوب","مجرور","ساكن"], opt_ar: ["مرفوع","منصوب","مجرور","ساكن"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "4am-fr-discours-rapporte",
        title_fr: "Le discours rapporté",
        title_ar: "الكلام المنقول",
        questions: [
          { fr: "Direct: 'Je suis fatigué.' Indirect: 'Il dit ___ fatigué.'", ar: "مباشر : 'Je suis fatigué.' غير مباشر : 'Il dit ___ fatigué.'", opt_fr: ["que je suis","qu'il est","qu'il était","de l'être"], opt_ar: ["que je suis","qu'il est","qu'il était","de l'être"], correct: 1 },
          { fr: "Pour rapporter une question, on utilise :", ar: "لنقل السؤال نستعمل :", opt_fr: ["'que'","'si' (oui/non)","'parce que'","'donc'"], opt_ar: ["'que'","'si' (نعم/لا)","'parce que'","'donc'"], correct: 1 },
          { fr: "Direct: 'Pars !' → Indirect:", ar: "مباشر : 'Pars !' → غير مباشر :", opt_fr: ["Il dit que part","Il lui dit de partir","Il part","Il a dit pars"], opt_ar: ["Il dit que part","Il lui dit de partir","Il part","Il a dit pars"], correct: 1 },
          { fr: "Au passé, 'aujourd'hui' devient :", ar: "في الماضي 'aujourd'hui' تصبح :", opt_fr: ["aujourd'hui","ce jour-là","demain","hier"], opt_ar: ["aujourd'hui","ce jour-là","demain","hier"], correct: 1 },
        ],
      },
      {
        slug: "4am-fr-conditionnel",
        title_fr: "Le conditionnel",
        title_ar: "الصيغة الشرطية",
        questions: [
          { fr: "Conditionnel présent de 'aimer' avec 'je' :", ar: "الشرط الحاضر لـ 'aimer' مع 'je' :", opt_fr: ["aime","aimais","aimerais","aimerai"], opt_ar: ["aime","aimais","aimerais","aimerai"], correct: 2 },
          { fr: "'Si j'avais de l'argent, je ___ ' (acheter):", ar: "'Si j'avais de l'argent, je ___ ' (acheter) :", opt_fr: ["achète","achèterai","achèterais","achetais"], opt_ar: ["achète","achèterai","achèterais","achetais"], correct: 2 },
          { fr: "Le conditionnel exprime souvent :", ar: "الشرطي يعبر غالباً عن :", opt_fr: ["Une certitude","Une condition / souhait","Un ordre","Un fait passé"], opt_ar: ["يقين","شرط / تمنّي","أمر","حقيقة ماضية"], correct: 1 },
          { fr: "Conditionnel de 'être' avec 'il' :", ar: "شرطي 'être' مع 'il' :", opt_fr: ["est","était","sera","serait"], opt_ar: ["est","était","sera","serait"], correct: 3 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "4am-svt-genetique",
        title_fr: "Notions de génétique",
        title_ar: "أساسيات علم الوراثة",
        questions: [
          { fr: "L'information génétique est portée par :", ar: "المعلومة الوراثية محمولة في :", opt_fr: ["Le sang","L'ADN","La salive","La peau"], opt_ar: ["الدم","الحمض النووي","اللعاب","الجلد"], correct: 1 },
          { fr: "Combien de chromosomes chez l'humain ?", ar: "كم عدد الصبغيات عند الإنسان ؟", opt_fr: ["23","44","46","48"], opt_ar: ["23","44","46","48"], correct: 2 },
          { fr: "Les chromosomes sexuels chez l'homme :", ar: "الصبغيات الجنسية عند الذكر :", opt_fr: ["XX","XY","YY","XO"], opt_ar: ["XX","XY","YY","XO"], correct: 1 },
          { fr: "Un gène est :", ar: "المورّثة (الجين) :", opt_fr: ["Une cellule","Un fragment d'ADN","Un organe","Un nutriment"], opt_ar: ["خلية","قطعة من DNA","عضو","مادة غذائية"], correct: 1 },
        ],
      },
      {
        slug: "4am-svt-immunite",
        title_fr: "Le système immunitaire",
        title_ar: "الجهاز المناعي",
        questions: [
          { fr: "Les globules blancs servent à :", ar: "الكريات البيضاء تستخدم لـ :", opt_fr: ["Transporter O₂","Défendre l'organisme","Coaguler le sang","Digérer"], opt_ar: ["نقل O₂","الدفاع عن الجسم","تجلط الدم","الهضم"], correct: 1 },
          { fr: "Un antigène est :", ar: "المستضد :", opt_fr: ["Une cellule du corps","Un élément étranger","Un médicament","Un sucre"], opt_ar: ["خلية من الجسم","عنصر أجنبي","دواء","سكر"], correct: 1 },
          { fr: "La vaccination prépare le corps à :", ar: "التلقيح يهيئ الجسم لـ :", opt_fr: ["Se reposer","Reconnaître l'antigène","Manger","Dormir"], opt_ar: ["الراحة","التعرّف على المستضد","الأكل","النوم"], correct: 1 },
          { fr: "Les anticorps sont produits par :", ar: "الأجسام المضادة تنتجها :", opt_fr: ["Les globules rouges","Les lymphocytes B","Les plaquettes","Les neurones"], opt_ar: ["الكريات الحمراء","اللمفاويات B","الصفائح","العصبونات"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "4am-phy-force",
        title_fr: "Force et mouvement",
        title_ar: "القوة والحركة",
        questions: [
          { fr: "L'unité de mesure de la force est :", ar: "وحدة قياس القوة :", opt_fr: ["Watt","Joule","Newton","Volt"], opt_ar: ["واط","جول","نيوتن","فولط"], correct: 2 },
          { fr: "On mesure une force avec :", ar: "نقيس القوة بـ :", opt_fr: ["Un dynamomètre","Une balance","Un thermomètre","Un voltmètre"], opt_ar: ["دينامومتر","ميزان","ميزان حرارة","فولطمتر"], correct: 0 },
          { fr: "Le poids est une force dirigée :", ar: "الوزن قوة موجهة :", opt_fr: ["Vers le haut","Vers le bas","Horizontalement","Aléatoirement"], opt_ar: ["إلى الأعلى","إلى الأسفل","أفقياً","عشوائياً"], correct: 1 },
          { fr: "Le poids et la masse sont :", ar: "الوزن والكتلة :", opt_fr: ["Identiques","Différents","Sans rapport","Égaux toujours"], opt_ar: ["متطابقان","مختلفان","لا علاقة","متساويان دوماً"], correct: 1 },
        ],
      },
      {
        slug: "4am-phy-energie",
        title_fr: "L'énergie",
        title_ar: "الطاقة",
        questions: [
          { fr: "L'unité de l'énergie est :", ar: "وحدة الطاقة :", opt_fr: ["Newton","Joule","Watt","Volt"], opt_ar: ["نيوتن","جول","واط","فولط"], correct: 1 },
          { fr: "L'énergie se ___ d'une forme à une autre :", ar: "الطاقة ___ من شكل لآخر :", opt_fr: ["Se crée","Se transforme","Disparaît","Se vide"], opt_ar: ["تُخلق","تتحوّل","تختفي","تفرغ"], correct: 1 },
          { fr: "Une lampe transforme l'énergie électrique en :", ar: "المصباح يحوّل الطاقة الكهربائية إلى :", opt_fr: ["Mécanique","Lumineuse + thermique","Chimique","Sonore"], opt_ar: ["ميكانيكية","ضوئية + حرارية","كيميائية","صوتية"], correct: 1 },
          { fr: "Le soleil est une source d'énergie :", ar: "الشمس مصدر طاقة :", opt_fr: ["Fossile","Renouvelable","Nucléaire (interne)","Chimique"], opt_ar: ["أحفورية","متجددة","نووية (داخلية)","كيميائية"], correct: 1 },
        ],
      },
    ],
  },

  // ============================================================
  // HIGH SCHOOL (1AS-3AS)
  // ============================================================
  "1AS": {
    Anglais: [
      {
        slug: "1as-en-tenses-review",
        title_fr: "Tenses review",
        title_ar: "مراجعة الأزمنة",
        questions: [
          { fr: "Choose the right tense: 'He ___ to Paris last year.'", ar: "اختر الزمن : 'He ___ to Paris last year.'", opt_fr: ["goes","went","has gone","is going"], opt_ar: ["goes","went","has gone","is going"], correct: 1 },
          { fr: "'She ___ for two hours now.'", ar: "'She ___ for two hours now.'", opt_fr: ["studies","is studying","has been studying","studied"], opt_ar: ["studies","is studying","has been studying","studied"], correct: 2 },
          { fr: "Past continuous: 'They ___ when I called.'", ar: "ماضٍ مستمر : 'They ___ when I called.'", opt_fr: ["sleep","slept","were sleeping","have slept"], opt_ar: ["sleep","slept","were sleeping","have slept"], correct: 2 },
          { fr: "Future: 'I ___ help you tomorrow.'", ar: "مستقبل : 'I ___ help you tomorrow.'", opt_fr: ["will","would","am","have"], opt_ar: ["will","would","am","have"], correct: 0 },
        ],
      },
      {
        slug: "1as-en-passive",
        title_fr: "Passive voice",
        title_ar: "المبني للمجهول",
        questions: [
          { fr: "Passive of 'They build houses':", ar: "مبني للمجهول لـ 'They build houses' :", opt_fr: ["Houses are built","Houses build","Houses building","Houses been built"], opt_ar: ["Houses are built","Houses build","Houses building","Houses been built"], correct: 0 },
          { fr: "Past passive: 'The book ___ written in 1900.'", ar: "ماضٍ مجهول : 'The book ___ written in 1900.'", opt_fr: ["is","was","has","were"], opt_ar: ["is","was","has","were"], correct: 1 },
          { fr: "Passive structure:", ar: "بنية المبني للمجهول :", opt_fr: ["be + V-ing","be + past participle","have + V","do + V"], opt_ar: ["be + V-ing","be + past participle","have + V","do + V"], correct: 1 },
          { fr: "'The cake ___ by my mother.'", ar: "'The cake ___ by my mother.'", opt_fr: ["makes","is making","was made","has make"], opt_ar: ["makes","is making","was made","has make"], correct: 2 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "1as-ar-3aroud",
        title_fr: "Initiation à la prosodie",
        title_ar: "مدخل إلى العروض",
        questions: [
          { fr: "L'علم العروض étudie :", ar: "علم العروض يدرس :", opt_fr: ["النحو","الموسيقى الشعرية","البلاغة","الإملاء"], opt_ar: ["النحو","الموسيقى الشعرية","البلاغة","الإملاء"], correct: 1 },
          { fr: "Le fondateur de la prosodie arabe :", ar: "مؤسس علم العروض :", opt_fr: ["سيبويه","الخليل بن أحمد","ابن مالك","الجاحظ"], opt_ar: ["سيبويه","الخليل بن أحمد","ابن مالك","الجاحظ"], correct: 1 },
          { fr: "Combien de بحور principales en arabe ?", ar: "كم بحراً رئيسياً في الشعر العربي ؟", opt_fr: ["8","12","15","16"], opt_ar: ["8","12","15","16"], correct: 3 },
          { fr: "Le تفعيلة 'فاعلن' appartient au بحر :", ar: "تفعيلة 'فاعلن' من بحر :", opt_fr: ["الكامل","الطويل","المتدارك","البسيط"], opt_ar: ["الكامل","الطويل","المتدارك","البسيط"], correct: 2 },
        ],
      },
      {
        slug: "1as-ar-litterature-jahili",
        title_fr: "Littérature préislamique",
        title_ar: "الأدب الجاهلي",
        questions: [
          { fr: "Les معلقات sont :", ar: "المعلقات :", opt_fr: ["Des contes","Des poèmes longs anciens","Des lettres","Des proverbes"], opt_ar: ["قصص","قصائد طويلة قديمة","رسائل","أمثال"], correct: 1 },
          { fr: "Le poète d'imru' al-Qays est :", ar: "امرؤ القيس شاعر :", opt_fr: ["جاهلي","إسلامي","أموي","عباسي"], opt_ar: ["جاهلي","إسلامي","أموي","عباسي"], correct: 0 },
          { fr: "Le thème typique du مطلع est :", ar: "الموضوع التقليدي للمطلع :", opt_fr: ["السياسة","الأطلال والحبيبة","العلم","الدين"], opt_ar: ["السياسة","الأطلال والحبيبة","العلم","الدين"], correct: 1 },
          { fr: "Antara b. Shaddad est célèbre pour :", ar: "عنترة بن شدّاد اشتُهر بـ :", opt_fr: ["العلم","الفروسية والشعر","التجارة","الرحلات"], opt_ar: ["العلم","الفروسية والشعر","التجارة","الرحلات"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "1as-fr-vulgarisation",
        title_fr: "Texte de vulgarisation scientifique",
        title_ar: "نص التبسيط العلمي",
        questions: [
          { fr: "Le but de la vulgarisation est :", ar: "هدف التبسيط :", opt_fr: ["Convaincre","Faire rire","Rendre la science accessible","Émouvoir"], opt_ar: ["الإقناع","الإضحاك","تقريب العلم","الإمتاع"], correct: 2 },
          { fr: "Le vocabulaire d'un texte vulgarisé est :", ar: "معجم النص المبسّط :", opt_fr: ["Très technique","Simple et explicatif","Poétique","Argotique"], opt_ar: ["تقني جداً","بسيط وشارح","شعري","عامي"], correct: 1 },
          { fr: "Les exemples servent à :", ar: "الأمثلة تستخدم لـ :", opt_fr: ["Compliquer","Illustrer","Décorer","Allonger"], opt_ar: ["التعقيد","التوضيح","الزينة","الإطالة"], correct: 1 },
          { fr: "Un schéma sert à :", ar: "المخطط يستخدم لـ :", opt_fr: ["Distraire","Aider à visualiser","Rallonger","Confondre"], opt_ar: ["الإلهاء","المساعدة على التصور","الإطالة","الإرباك"], correct: 1 },
        ],
      },
      {
        slug: "1as-fr-connecteurs",
        title_fr: "Connecteurs logiques",
        title_ar: "أدوات الربط المنطقية",
        questions: [
          { fr: "'Donc' exprime :", ar: "'Donc' تعبر عن :", opt_fr: ["L'opposition","La conséquence","La cause","Le but"], opt_ar: ["معارضة","نتيجة","سبب","هدف"], correct: 1 },
          { fr: "'Parce que' exprime :", ar: "'Parce que' تعبر عن :", opt_fr: ["L'opposition","La conséquence","La cause","Le temps"], opt_ar: ["معارضة","نتيجة","سبب","زمن"], correct: 2 },
          { fr: "'Cependant' exprime :", ar: "'Cependant' تعبر عن :", opt_fr: ["L'opposition","La cause","L'addition","Le but"], opt_ar: ["معارضة","سبب","إضافة","هدف"], correct: 0 },
          { fr: "'Afin de' exprime :", ar: "'Afin de' تعبر عن :", opt_fr: ["La cause","La conséquence","Le but","Le temps"], opt_ar: ["سبب","نتيجة","هدف","زمن"], correct: 2 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "1as-svt-cellule-eucaryote",
        title_fr: "La cellule eucaryote",
        title_ar: "الخلية حقيقية النواة",
        questions: [
          { fr: "Les mitochondries servent à :", ar: "الميتوكوندريا تستخدم لـ :", opt_fr: ["Synthèse protéique","Production d'énergie (ATP)","Stockage d'eau","Photosynthèse"], opt_ar: ["تركيب البروتين","إنتاج الطاقة (ATP)","تخزين الماء","التركيب الضوئي"], correct: 1 },
          { fr: "Les ribosomes synthétisent :", ar: "الريبوزومات تركّب :", opt_fr: ["Lipides","ADN","Protéines","Glucides"], opt_ar: ["الدهون","الـ DNA","البروتينات","السكريات"], correct: 2 },
          { fr: "La photosynthèse a lieu dans :", ar: "التركيب الضوئي يحدث في :", opt_fr: ["Mitochondrie","Chloroplaste","Noyau","Ribosome"], opt_ar: ["الميتوكوندريا","البلاستيدة الخضراء","النواة","الريبوزوم"], correct: 1 },
          { fr: "L'ADN se trouve dans :", ar: "الـ DNA يوجد في :", opt_fr: ["Cytoplasme","Noyau (et mitochondries/chloroplastes)","Membrane","Vacuole"], opt_ar: ["السيتوبلازم","النواة (والميتوكوندريا/البلاستيدات)","الغشاء","الفجوة"], correct: 1 },
        ],
      },
      {
        slug: "1as-svt-enzymes",
        title_fr: "Les enzymes",
        title_ar: "الأنزيمات",
        questions: [
          { fr: "Les enzymes sont de nature :", ar: "الأنزيمات طبيعتها :", opt_fr: ["Glucidique","Lipidique","Protéique","Minérale"], opt_ar: ["سكرية","دهنية","بروتينية","معدنية"], correct: 2 },
          { fr: "Une enzyme agit sur :", ar: "الأنزيم يعمل على :", opt_fr: ["Tout substrat","Un substrat spécifique","Aucun","L'ADN seulement"], opt_ar: ["أي مادة","مادة نوعية","لا شيء","الـ DNA فقط"], correct: 1 },
          { fr: "Les enzymes sont :", ar: "الأنزيمات :", opt_fr: ["Consommées","Catalyseurs (non consommés)","Détruites par la réaction","Sans effet"], opt_ar: ["تُستهلك","عوامل حفازة (لا تُستهلك)","تُدمَّر","بلا تأثير"], correct: 1 },
          { fr: "L'amylase digère :", ar: "الأميلاز يهضم :", opt_fr: ["Protéines","Lipides","Amidon","Cellulose"], opt_ar: ["البروتينات","الدهون","النشاء","السيليلوز"], correct: 2 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "1as-phy-mole",
        title_fr: "La mole et grandeurs",
        title_ar: "المول والمقادير",
        questions: [
          { fr: "Le nombre d'Avogadro vaut environ :", ar: "ثابت أفوجادرو يساوي تقريباً :", opt_fr: ["6,02 × 10²³","6,02 × 10¹⁰","3 × 10⁸","9,8"], opt_ar: ["6,02 × 10²³","6,02 × 10¹⁰","3 × 10⁸","9,8"], correct: 0 },
          { fr: "La masse molaire de l'eau (H₂O) est :", ar: "الكتلة المولية للماء (H₂O) :", opt_fr: ["8 g/mol","16 g/mol","18 g/mol","32 g/mol"], opt_ar: ["8 غ/مول","16 غ/مول","18 غ/مول","32 غ/مول"], correct: 2 },
          { fr: "1 mole contient combien d'entités ?", ar: "1 مول كم وحدة يحتوي ؟", opt_fr: ["10²³","6,02 × 10²³","10⁶","10⁹"], opt_ar: ["10²³","6,02 × 10²³","10⁶","10⁹"], correct: 1 },
          { fr: "Si M = 18 g/mol et m = 36 g, n = ?", ar: "إذا كان M = 18 غ/مول و m = 36 غ، فإن n = ؟", opt_fr: ["0,5 mol","1 mol","2 mol","18 mol"], opt_ar: ["0,5 مول","1 مول","2 مول","18 مول"], correct: 2 },
        ],
      },
      {
        slug: "1as-phy-cinematique",
        title_fr: "Mouvement et vitesse",
        title_ar: "الحركة والسرعة",
        questions: [
          { fr: "L'unité de la vitesse au SI est :", ar: "وحدة السرعة في SI :", opt_fr: ["km/h","m/s","cm/s","m/min"], opt_ar: ["كم/سا","م/ث","سم/ث","م/د"], correct: 1 },
          { fr: "v = d/t. Si d = 100 m et t = 20 s, v = ?", ar: "v = d/t. إذا d = 100 م و t = 20 ث، v = ؟", opt_fr: ["2 m/s","5 m/s","10 m/s","20 m/s"], opt_ar: ["2 م/ث","5 م/ث","10 م/ث","20 م/ث"], correct: 1 },
          { fr: "Un mouvement est rectiligne uniforme si :", ar: "الحركة مستقيمة منتظمة إذا :", opt_fr: ["v change","v est constante et trajectoire droite","Il accélère","Il ralentit"], opt_ar: ["تتغير v","v ثابتة والمسار مستقيم","يُسرّع","يبطئ"], correct: 1 },
          { fr: "72 km/h = combien de m/s ?", ar: "72 كم/سا = كم م/ث ؟", opt_fr: ["10","15","20","25"], opt_ar: ["10","15","20","25"], correct: 2 },
        ],
      },
    ],
  },

  "2AS": {
    Arabe: [
      {
        slug: "2as-ar-litterature-abbasside",
        title_fr: "Littérature abbasside",
        title_ar: "الأدب العباسي",
        questions: [
          { fr: "L'âge d'or de la littérature arabe est l'époque :", ar: "العصر الذهبي للأدب العربي :", opt_fr: ["الجاهلية","الأموية","العباسية","الحديثة"], opt_ar: ["الجاهلية","الأموية","العباسية","الحديثة"], correct: 2 },
          { fr: "أبو نواس est célèbre pour :", ar: "أبو نواس مشهور بـ :", opt_fr: ["شعر الحماسة","شعر الخمر والمجون","شعر الزهد","شعر الرثاء"], opt_ar: ["شعر الحماسة","شعر الخمر والمجون","شعر الزهد","شعر الرثاء"], correct: 1 },
          { fr: "المتنبي est connu pour :", ar: "المتنبي عُرف بـ :", opt_fr: ["شعر الحكمة والمدح","الكتابة","الترجمة","الفقه"], opt_ar: ["شعر الحكمة والمدح","الكتابة","الترجمة","الفقه"], correct: 0 },
          { fr: "الجاحظ est connu pour :", ar: "الجاحظ عُرف بـ :", opt_fr: ["النثر والكتب الموسوعية","الشعر","الخطابة","الفلسفة"], opt_ar: ["النثر والكتب الموسوعية","الشعر","الخطابة","الفلسفة"], correct: 0 },
        ],
      },
      {
        slug: "2as-ar-balagha-avancee",
        title_fr: "Rhétorique avancée",
        title_ar: "البلاغة المتقدّمة",
        questions: [
          { fr: "علم البديع s'occupe de :", ar: "علم البديع يهتم بـ :", opt_fr: ["تركيب الجملة","المحسنات اللفظية والمعنوية","المعاني المباشرة","الإعراب فقط"], opt_ar: ["تركيب الجملة","المحسنات اللفظية والمعنوية","المعاني المباشرة","الإعراب فقط"], correct: 1 },
          { fr: "الطباق est :", ar: "الطباق :", opt_fr: ["تشبيه","تضاد بين كلمتين","ترادف","سجع"], opt_ar: ["تشبيه","تضاد بين كلمتين","ترادف","سجع"], correct: 1 },
          { fr: "الجناس est :", ar: "الجناس :", opt_fr: ["تشابه لفظي مع اختلاف معنى","تطابق المعنى","تشبيه","استعارة"], opt_ar: ["تشابه لفظي مع اختلاف معنى","تطابق المعنى","تشبيه","استعارة"], correct: 0 },
          { fr: "علم المعاني étudie :", ar: "علم المعاني يدرس :", opt_fr: ["المفردات","تركيب الجملة وأغراضها","الأصوات","الإملاء"], opt_ar: ["المفردات","تركيب الجملة وأغراضها","الأصوات","الإملاء"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "2as-fr-recit-fantastique",
        title_fr: "Le récit fantastique",
        title_ar: "النص العجائبي",
        questions: [
          { fr: "Le fantastique repose sur :", ar: "العجائبي يقوم على :", opt_fr: ["Des faits réels","L'hésitation entre réel et surnaturel","La science","Le rire"], opt_ar: ["وقائع حقيقية","التردد بين الواقعي وما فوق الطبيعي","العلم","السخرية"], correct: 1 },
          { fr: "Maupassant est célèbre pour :", ar: "موباسان اشتُهر بـ :", opt_fr: ["Romans historiques","Contes fantastiques","Théâtre","Poésie"], opt_ar: ["روايات تاريخية","قصص عجائبية","المسرح","الشعر"], correct: 1 },
          { fr: "Le fantastique introduit :", ar: "العجائبي يُدخل :", opt_fr: ["Des faits scientifiques","Un événement étrange","Des arguments","Des chiffres"], opt_ar: ["وقائع علمية","حدثاً غريباً","حججاً","أرقاماً"], correct: 1 },
          { fr: "Le merveilleux diffère du fantastique car :", ar: "العجيب يختلف عن العجائبي لأنه :", opt_fr: ["Identique","Le surnaturel est accepté","Plus court","Plus drôle"], opt_ar: ["متطابقان","يُقبل ما فوق الطبيعي","أقصر","أكثر هزلاً"], correct: 1 },
        ],
      },
      {
        slug: "2as-fr-figures-style",
        title_fr: "Figures de style",
        title_ar: "الصور البلاغية",
        questions: [
          { fr: "'Doux comme un agneau' est :", ar: "'Doux comme un agneau' :", opt_fr: ["Métaphore","Comparaison","Personnification","Hyperbole"], opt_ar: ["استعارة","تشبيه","تشخيص","مبالغة"], correct: 1 },
          { fr: "'Cet homme est un lion' est :", ar: "'Cet homme est un lion' :", opt_fr: ["Métaphore","Comparaison","Antithèse","Litote"], opt_ar: ["استعارة","تشبيه","طباق","تلطيف"], correct: 0 },
          { fr: "'Le vent murmurait' est :", ar: "'Le vent murmurait' :", opt_fr: ["Hyperbole","Personnification","Litote","Antithèse"], opt_ar: ["مبالغة","تشخيص","تلطيف","طباق"], correct: 1 },
          { fr: "'Je meurs de faim' est :", ar: "'Je meurs de faim' :", opt_fr: ["Hyperbole","Litote","Allégorie","Métonymie"], opt_ar: ["مبالغة","تلطيف","رمز","مجاز مرسل"], correct: 0 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "2as-svt-systeme-immunitaire",
        title_fr: "Système immunitaire avancé",
        title_ar: "الجهاز المناعي المتقدم",
        questions: [
          { fr: "Les lymphocytes B produisent :", ar: "اللمفاويات B تنتج :", opt_fr: ["Les globules rouges","Les anticorps","L'insuline","L'hémoglobine"], opt_ar: ["الكريات الحمراء","الأجسام المضادة","الأنسولين","الهيموغلوبين"], correct: 1 },
          { fr: "Les lymphocytes T cytotoxiques :", ar: "اللمفاويات T القاتلة :", opt_fr: ["Produisent des anticorps","Détruisent les cellules infectées","Digèrent","Coagulent"], opt_ar: ["تنتج أجسام مضادة","تدمّر الخلايا المصابة","تهضم","تجلط"], correct: 1 },
          { fr: "La réaction immunitaire spécifique cible :", ar: "الاستجابة المناعية النوعية تستهدف :", opt_fr: ["Tout antigène","Un antigène précis","Aucun","Plusieurs sans distinction"], opt_ar: ["أي مستضد","مستضداً محدداً","لا شيء","الجميع دون تمييز"], correct: 1 },
          { fr: "Le VIH attaque :", ar: "فيروس VIH يهاجم :", opt_fr: ["Les globules rouges","Les lymphocytes T4","Le foie","Le cerveau"], opt_ar: ["الكريات الحمراء","لمفاويات T4","الكبد","الدماغ"], correct: 1 },
        ],
      },
      {
        slug: "2as-svt-genetique",
        title_fr: "Génétique mendélienne",
        title_ar: "الوراثة المندلية",
        questions: [
          { fr: "Mendel a travaillé sur :", ar: "مندل عمل على :", opt_fr: ["Les bactéries","Les pois","Les souris","Les hommes"], opt_ar: ["البكتيريا","البازلاء","الفئران","البشر"], correct: 1 },
          { fr: "Un gène a généralement :", ar: "المورّثة عادةً لها :", opt_fr: ["1 allèle","2 allèles ou plus","Aucun","100 allèles"], opt_ar: ["أليل واحد","أليلان أو أكثر","لا شيء","100 أليل"], correct: 1 },
          { fr: "Génotype Aa exprime :", ar: "النمط Aa يُظهر :", opt_fr: ["Récessif","Dominant","Co-dominance possible","Aucun"], opt_ar: ["متنحٍ","سائد","قد تكون سيادة مشتركة","لا شيء"], correct: 1 },
          { fr: "Le croisement Aa × Aa donne :", ar: "تزاوج Aa × Aa يعطي :", opt_fr: ["100% AA","3/4 dominant 1/4 récessif","100% aa","50/50"], opt_ar: ["100% AA","3/4 سائد 1/4 متنحٍ","100% aa","50/50"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "2as-phy-chimie-organique",
        title_fr: "Introduction à la chimie organique",
        title_ar: "مدخل إلى الكيمياء العضوية",
        questions: [
          { fr: "Les composés organiques contiennent toujours :", ar: "المركبات العضوية تحتوي دائماً على :", opt_fr: ["Azote","Carbone","Soufre","Fer"], opt_ar: ["نيتروجين","كربون","كبريت","حديد"], correct: 1 },
          { fr: "Le méthane a pour formule :", ar: "صيغة الميثان :", opt_fr: ["CH₂","CH₃","CH₄","C₂H₄"], opt_ar: ["CH₂","CH₃","CH₄","C₂H₄"], correct: 2 },
          { fr: "Les alcanes ont pour formule générale :", ar: "الصيغة العامة للألكانات :", opt_fr: ["CₙH₂ₙ","CₙH₂ₙ₊₂","CₙH₂ₙ₋₂","CₙHₙ"], opt_ar: ["CₙH₂ₙ","CₙH₂ₙ₊₂","CₙH₂ₙ₋₂","CₙHₙ"], correct: 1 },
          { fr: "L'éthanol a pour formule :", ar: "صيغة الإيثانول :", opt_fr: ["CH₃OH","C₂H₅OH","C₃H₇OH","CH₄O"], opt_ar: ["CH₃OH","C₂H₅OH","C₃H₇OH","CH₄O"], correct: 1 },
        ],
      },
      {
        slug: "2as-phy-electromagnetisme",
        title_fr: "Électricité et magnétisme",
        title_ar: "الكهرباء والمغناطيسية",
        questions: [
          { fr: "La loi d'Ohm s'écrit :", ar: "قانون أوم :", opt_fr: ["U = R·I","U = R + I","U = R - I","U = R/I"], opt_ar: ["U = R·I","U = R + I","U = R - I","U = R/I"], correct: 0 },
          { fr: "L'unité de la résistance est :", ar: "وحدة المقاومة :", opt_fr: ["Volt","Ampère","Ohm","Watt"], opt_ar: ["فولط","أمبير","أوم","واط"], correct: 2 },
          { fr: "Un aimant a :", ar: "للمغناطيس :", opt_fr: ["1 pôle","2 pôles","3 pôles","Aucun"], opt_ar: ["قطب واحد","قطبان","ثلاثة أقطاب","لا أقطاب"], correct: 1 },
          { fr: "Pôles identiques :", ar: "الأقطاب المتشابهة :", opt_fr: ["S'attirent","Se repoussent","Sont neutres","Disparaissent"], opt_ar: ["تتجاذب","تتنافر","محايدة","تختفي"], correct: 1 },
        ],
      },
    ],
  },

  "3AS": {
    Anglais: [
      {
        slug: "3as-en-modal-verbs",
        title_fr: "Modal verbs",
        title_ar: "الأفعال الناقصة",
        questions: [
          { fr: "'You ___ wear a uniform at school.'", ar: "'You ___ wear a uniform at school.'", opt_fr: ["can","must","might","could"], opt_ar: ["can","must","might","could"], correct: 1 },
          { fr: "'I ___ swim when I was 5.'", ar: "'I ___ swim when I was 5.'", opt_fr: ["can","could","must","should"], opt_ar: ["can","could","must","should"], correct: 1 },
          { fr: "'You ___ smoke here.'", ar: "'You ___ smoke here.'", opt_fr: ["mustn't","don't","won't","aren't"], opt_ar: ["mustn't","don't","won't","aren't"], correct: 0 },
          { fr: "'It ___ rain tomorrow.'", ar: "'It ___ rain tomorrow.'", opt_fr: ["must","might","should","would"], opt_ar: ["must","might","should","would"], correct: 1 },
        ],
      },
      {
        slug: "3as-en-reported-speech",
        title_fr: "Reported speech",
        title_ar: "الكلام المنقول",
        questions: [
          { fr: "Direct: 'I am happy.' Reported: 'He said he ___ happy.'", ar: "مباشر : 'I am happy.' منقول : 'He said he ___ happy.'", opt_fr: ["am","is","was","be"], opt_ar: ["am","is","was","be"], correct: 2 },
          { fr: "Direct: 'I will go.' Reported: 'She said she ___ go.'", ar: "مباشر : 'I will go.' منقول : 'She said she ___ go.'", opt_fr: ["will","would","won't","goes"], opt_ar: ["will","would","won't","goes"], correct: 1 },
          { fr: "'Today' in reported speech becomes:", ar: "'Today' في الكلام المنقول تصبح :", opt_fr: ["today","yesterday","that day","tomorrow"], opt_ar: ["today","yesterday","that day","tomorrow"], correct: 2 },
          { fr: "Direct: 'Where do you live?' Reported: 'He asked where I ___.'", ar: "مباشر : 'Where do you live?' منقول : 'He asked where I ___.'", opt_fr: ["live","lived","do live","living"], opt_ar: ["live","lived","do live","living"], correct: 1 },
        ],
      },
    ],
    Arabe: [
      {
        slug: "3as-ar-litterature-moderne",
        title_fr: "Littérature arabe moderne",
        title_ar: "الأدب العربي الحديث",
        questions: [
          { fr: "النهضة الأدبية الحديثة بدأت في :", ar: "بدأت النهضة الأدبية الحديثة في :", opt_fr: ["القرن 17","القرن 19","القرن 20","القرن 21"], opt_ar: ["القرن 17","القرن 19","القرن 20","القرن 21"], correct: 1 },
          { fr: "نجيب محفوظ حصل على :", ar: "نجيب محفوظ حصل على :", opt_fr: ["جائزة الأوسكار","جائزة نوبل للآداب","جائزة بوكر","لا شيء"], opt_ar: ["جائزة الأوسكار","جائزة نوبل للآداب","جائزة بوكر","لا شيء"], correct: 1 },
          { fr: "محمود درويش هو :", ar: "محمود درويش :", opt_fr: ["روائي مصري","شاعر فلسطيني","فيلسوف","مؤرخ"], opt_ar: ["روائي مصري","شاعر فلسطيني","فيلسوف","مؤرخ"], correct: 1 },
          { fr: "مصطلح 'الشعر الحرّ' يرتبط بـ :", ar: "'الشعر الحرّ' يرتبط بـ :", opt_fr: ["نازك الملائكة","المتنبي","امرؤ القيس","ابن خلدون"], opt_ar: ["نازك الملائكة","المتنبي","امرؤ القيس","ابن خلدون"], correct: 0 },
        ],
      },
      {
        slug: "3as-ar-naqd",
        title_fr: "Critique littéraire",
        title_ar: "النقد الأدبي",
        questions: [
          { fr: "النقد الأدبي يدرس :", ar: "النقد الأدبي يدرس :", opt_fr: ["الرياضيات","النصوص الأدبية","الفلك","التاريخ فقط"], opt_ar: ["الرياضيات","النصوص الأدبية","الفلك","التاريخ فقط"], correct: 1 },
          { fr: "ابن خلدون اشتُهر بـ :", ar: "ابن خلدون اشتهر بـ :", opt_fr: ["المقدمة","ديوان شعر","رواية","ترجمة"], opt_ar: ["المقدمة","ديوان شعر","رواية","ترجمة"], correct: 0 },
          { fr: "النقد الانطباعي يعتمد على :", ar: "النقد الانطباعي يعتمد على :", opt_fr: ["الإحساس الذاتي","المنهج العلمي","الإحصاء","الترجمة"], opt_ar: ["الإحساس الذاتي","المنهج العلمي","الإحصاء","الترجمة"], correct: 0 },
          { fr: "المنهج البنيوي يهتم بـ :", ar: "المنهج البنيوي يهتم بـ :", opt_fr: ["السيرة","البنية الداخلية للنص","التاريخ","الجمهور"], opt_ar: ["السيرة","البنية الداخلية للنص","التاريخ","الجمهور"], correct: 1 },
        ],
      },
    ],
    "Français": [
      {
        slug: "3as-fr-genres-litteraires",
        title_fr: "Genres littéraires",
        title_ar: "الأجناس الأدبية",
        questions: [
          { fr: "Le théâtre est destiné à :", ar: "المسرح موجّه لـ :", opt_fr: ["La lecture seule","La représentation","La récitation","La musique"], opt_ar: ["القراءة فقط","التمثيل","الإلقاء","الموسيقى"], correct: 1 },
          { fr: "Un sonnet a :", ar: "السوناتة لها :", opt_fr: ["10 vers","12 vers","14 vers","20 vers"], opt_ar: ["10 أبيات","12 بيتاً","14 بيتاً","20 بيتاً"], correct: 2 },
          { fr: "Le roman est :", ar: "الرواية :", opt_fr: ["Court","Long et narratif","Poétique","Théâtral"], opt_ar: ["قصير","طويل وسردي","شعري","مسرحي"], correct: 1 },
          { fr: "Une nouvelle est :", ar: "الأقصوصة (nouvelle) :", opt_fr: ["Plus longue qu'un roman","Plus courte qu'un roman","Identique","Un poème"], opt_ar: ["أطول من الرواية","أقصر من الرواية","مماثلة","قصيدة"], correct: 1 },
        ],
      },
      {
        slug: "3as-fr-mouvements",
        title_fr: "Mouvements littéraires",
        title_ar: "التيارات الأدبية",
        questions: [
          { fr: "Victor Hugo est un auteur :", ar: "فيكتور هوغو كاتب :", opt_fr: ["Classique","Romantique","Symboliste","Surréaliste"], opt_ar: ["كلاسيكي","رومانسي","رمزي","سريالي"], correct: 1 },
          { fr: "Le réalisme cherche à :", ar: "الواقعية تسعى إلى :", opt_fr: ["Idéaliser","Représenter le réel","Rêver","Mélanger"], opt_ar: ["المثالية","تمثيل الواقع","الخيال","المزج"], correct: 1 },
          { fr: "Émile Zola est représentant du :", ar: "إميل زولا ممثل :", opt_fr: ["Romantisme","Naturalisme","Surréalisme","Classicisme"], opt_ar: ["الرومانسية","الطبيعية","السريالية","الكلاسيكية"], correct: 1 },
          { fr: "Le surréalisme privilégie :", ar: "السريالية تركّز على :", opt_fr: ["La raison","Le rêve / l'inconscient","La logique","Les chiffres"], opt_ar: ["العقل","الحلم / اللاشعور","المنطق","الأرقام"], correct: 1 },
        ],
      },
    ],
    "Sciences naturelles": [
      {
        slug: "3as-svt-genetique-mol",
        title_fr: "Génétique moléculaire",
        title_ar: "الوراثة الجزيئية",
        questions: [
          { fr: "L'ADN est constitué de :", ar: "الـ DNA يتكوّن من :", opt_fr: ["3 nucléotides","4 nucléotides","20 acides aminés","2 brins seulement"], opt_ar: ["3 نيوكليوتيدات","4 نيوكليوتيدات","20 حمضاً أمينياً","شريطين فقط"], correct: 1 },
          { fr: "Les bases A et T s'apparient par :", ar: "القاعدتان A و T ترتبطان بـ :", opt_fr: ["1 liaison H","2 liaisons H","3 liaisons H","4 liaisons H"], opt_ar: ["رابطة هيدروجينية واحدة","رابطتان هيدروجينيتان","ثلاث روابط","أربع روابط"], correct: 1 },
          { fr: "La transcription donne :", ar: "النسخ يعطي :", opt_fr: ["ADN → ADN","ADN → ARN","ARN → protéine","protéine → ADN"], opt_ar: ["DNA → DNA","DNA → RNA","RNA → بروتين","بروتين → DNA"], correct: 1 },
          { fr: "La traduction se fait dans :", ar: "الترجمة تحدث في :", opt_fr: ["Le noyau","Les ribosomes","Les mitochondries","La membrane"], opt_ar: ["النواة","الريبوزومات","الميتوكوندريا","الغشاء"], correct: 1 },
        ],
      },
      {
        slug: "3as-svt-neuro",
        title_fr: "Communication nerveuse",
        title_ar: "التواصل العصبي",
        questions: [
          { fr: "Le potentiel d'action est :", ar: "كمون الفعل :", opt_fr: ["Statique","Une variation rapide de tension membranaire","De l'eau","Un sucre"], opt_ar: ["ساكن","تغير سريع في توتر الغشاء","ماء","سكر"], correct: 1 },
          { fr: "La synapse est :", ar: "المشبك العصبي :", opt_fr: ["Une cellule","Une jonction entre 2 neurones","Un muscle","Un os"], opt_ar: ["خلية","نقطة اتصال بين عصبونين","عضلة","عظم"], correct: 1 },
          { fr: "Un neurotransmetteur est :", ar: "الناقل العصبي :", opt_fr: ["Un sucre","Une molécule chimique","Une enzyme","Un sel"], opt_ar: ["سكر","جزيء كيميائي","أنزيم","ملح"], correct: 1 },
          { fr: "La loi du tout ou rien concerne :", ar: "قانون الكل أو لا شيء يخص :", opt_fr: ["La synapse","Le potentiel d'action","Le sang","Les enzymes"], opt_ar: ["المشبك","كمون الفعل","الدم","الأنزيمات"], correct: 1 },
        ],
      },
    ],
    "Sciences physiques": [
      {
        slug: "3as-phy-mecanique",
        title_fr: "Mécanique : lois de Newton",
        title_ar: "الميكانيك : قوانين نيوتن",
        questions: [
          { fr: "La 2ᵉ loi de Newton s'écrit :", ar: "القانون الثاني لنيوتن :", opt_fr: ["F = m·a","F = m·v","F = m + a","F = m/a"], opt_ar: ["F = m·a","F = m·v","F = m + a","F = m/a"], correct: 0 },
          { fr: "L'unité de l'accélération est :", ar: "وحدة التسارع :", opt_fr: ["m/s","m/s²","m·s","kg/s"], opt_ar: ["م/ث","م/ث²","م·ث","كغ/ث"], correct: 1 },
          { fr: "Le principe d'inertie : si ΣF = 0 alors :", ar: "مبدأ العطالة : إذا ΣF = 0 فإن :", opt_fr: ["a = ∞","a = 0","v = 0 obligatoirement","Le corps disparaît"], opt_ar: ["a = ∞","a = 0","v = 0 إلزاماً","الجسم يختفي"], correct: 1 },
          { fr: "Action–réaction est :", ar: "الفعل ورد الفعل :", opt_fr: ["1ʳᵉ loi","2ᵉ loi","3ᵉ loi","Loi de gravité"], opt_ar: ["القانون 1","القانون 2","القانون 3","قانون الجاذبية"], correct: 2 },
        ],
      },
      {
        slug: "3as-phy-cinetique-chimique",
        title_fr: "Cinétique chimique",
        title_ar: "الكنتيك الكيميائي",
        questions: [
          { fr: "La cinétique chimique étudie :", ar: "الكنتيك الكيميائي يدرس :", opt_fr: ["L'équilibre","La vitesse des réactions","Les ions","Les gaz"], opt_ar: ["التوازن","سرعة التفاعلات","الشوارد","الغازات"], correct: 1 },
          { fr: "Un catalyseur :", ar: "العامل الحفاز :", opt_fr: ["Bloque la réaction","Accélère la réaction","Crée un produit nouveau","Disparaît toujours"], opt_ar: ["يمنع التفاعل","يُسرّع التفاعل","يُنشئ ناتجاً جديداً","يختفي دوماً"], correct: 1 },
          { fr: "La température, en général :", ar: "درجة الحرارة عموماً :", opt_fr: ["Ralentit la réaction","Accélère la réaction","Sans effet","Inverse"], opt_ar: ["تبطئ التفاعل","تُسرّعه","بلا أثر","تعكسه"], correct: 1 },
          { fr: "La concentration des réactifs ↑ :", ar: "زيادة تركيز المتفاعلات :", opt_fr: ["Ralentit","Accélère la réaction","Sans effet","Stoppe"], opt_ar: ["تبطئ","تُسرّع","بلا أثر","توقف"], correct: 1 },
        ],
      },
    ],
    Philosophie: [
      {
        slug: "3as-phi-conscience",
        title_fr: "La conscience",
        title_ar: "الوعي",
        questions: [
          { fr: "Le 'cogito' est associé à :", ar: "'الكوجيتو' مرتبط بـ :", opt_fr: ["Kant","Nietzsche","Descartes","Sartre"], opt_ar: ["كانط","نيتشه","ديكارت","سارتر"], correct: 2 },
          { fr: "'Je pense, donc je suis' est de :", ar: "'أنا أفكر، إذن أنا موجود' لـ :", opt_fr: ["Platon","Descartes","Aristote","Hegel"], opt_ar: ["أفلاطون","ديكارت","أرسطو","هيغل"], correct: 1 },
          { fr: "L'inconscient a été théorisé par :", ar: "اللاشعور نظَّر له :", opt_fr: ["Descartes","Freud","Kant","Nietzsche"], opt_ar: ["ديكارت","فرويد","كانط","نيتشه"], correct: 1 },
          { fr: "La conscience morale est :", ar: "الوعي الأخلاقي :", opt_fr: ["Le sens du bien et du mal","La perception","La mémoire","La rêverie"], opt_ar: ["تمييز الخير والشر","الإدراك","الذاكرة","التخيّل"], correct: 0 },
        ],
      },
      {
        slug: "3as-phi-verite-liberte",
        title_fr: "Vérité et liberté",
        title_ar: "الحقيقة والحرية",
        questions: [
          { fr: "Pour Kant, l'humain est libre quand il :", ar: "حسب كانط، الإنسان حرّ حين :", opt_fr: ["Suit ses désirs","Agit par devoir et raison","Obéit aveuglément","Reste seul"], opt_ar: ["يتبع رغباته","يتصرف بالواجب والعقل","يطيع عمياً","يبقى وحده"], correct: 1 },
          { fr: "L'allégorie de la caverne est de :", ar: "أسطورة الكهف لـ :", opt_fr: ["Aristote","Platon","Socrate","Kant"], opt_ar: ["أرسطو","أفلاطون","سقراط","كانط"], correct: 1 },
          { fr: "Pour Sartre, l'homme est :", ar: "حسب سارتر، الإنسان :", opt_fr: ["Déterminé totalement","Condamné à être libre","Sans conscience","Une machine"], opt_ar: ["محدّد تماماً","محكوم عليه بأن يكون حرًا","بلا وعي","آلة"], correct: 1 },
          { fr: "La vérité scientifique est :", ar: "الحقيقة العلمية :", opt_fr: ["Définitive","Provisoire et révisable","Subjective seulement","Sans preuve"], opt_ar: ["نهائية","مؤقتة وقابلة للمراجعة","ذاتية فقط","بلا برهان"], correct: 1 },
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// Resolver
// --------------------------------------------------------------------------

async function findSubjectByPattern(grade, subjectKey) {
  const pattern = SUBJECT_PATTERNS[subjectKey];
  if (!pattern) return null;
  const { data } = await admin
    .from("subjects")
    .select("id, name_fr")
    .eq("grade_code", grade)
    .ilike("name_fr", pattern)
    .maybeSingle();
  return data;
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

let chaptersCreated = 0;
let questionsCreated = 0;
let chaptersSkipped = 0;
let questionsSkipped = 0;
const unresolvedSubjects = [];
const summary = []; // { grade, subject, chapters, questions, skipped }

for (const [grade, subjects] of Object.entries(SEED)) {
  for (const [subjectKey, chapters] of Object.entries(subjects)) {
    const subject = await findSubjectByPattern(grade, subjectKey);
    if (!subject) {
      console.warn(`[${grade}] no '${subjectKey}' subject — skipping`);
      unresolvedSubjects.push(`${grade}/${subjectKey}`);
      continue;
    }

    let gradeSubjectChapters = 0;
    let gradeSubjectQuestions = 0;
    let gradeSubjectChaptersSkipped = 0;

    for (const chSeed of chapters) {
      // Idempotent: insert by slug, get id back.
      const { data: existing } = await admin
        .from("chapters")
        .select("id")
        .eq("subject_id", subject.id)
        .eq("slug", chSeed.slug)
        .maybeSingle();

      let chapterId;
      let isNewChapter = false;
      if (existing) {
        chapterId = existing.id;
        chaptersSkipped++;
        gradeSubjectChaptersSkipped++;
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
        if (error) {
          console.error(`[${grade}/${subjectKey}] chapter insert failed:`, error.message);
          continue;
        }
        chapterId = ins.id;
        chaptersCreated++;
        gradeSubjectChapters++;
        isNewChapter = true;
      }

      // Count existing active questions — only insert if <3.
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
      if (error) {
        console.error(`[${grade}/${subjectKey}/${chSeed.slug}] questions insert failed:`, error.message);
        continue;
      }
      questionsCreated += rows.length;
      gradeSubjectQuestions += rows.length;
    }

    summary.push({
      grade,
      subject: subjectKey,
      chaptersCreated: gradeSubjectChapters,
      chaptersSkipped: gradeSubjectChaptersSkipped,
      questionsCreated: gradeSubjectQuestions,
    });
  }
}

console.log(`\n========================================`);
console.log(`SEED COMPLETE`);
console.log(`========================================`);
console.log(`Chapters: ${chaptersCreated} created, ${chaptersSkipped} already existed`);
console.log(`Questions: ${questionsCreated} created, ${questionsSkipped} already existed`);
if (unresolvedSubjects.length > 0) {
  console.log(`\nUnresolved subjects (no matching row):`);
  for (const u of unresolvedSubjects) console.log(`  - ${u}`);
} else {
  console.log(`\nAll subjects resolved successfully.`);
}

console.log(`\n========================================`);
console.log(`PER-GRADE × SUBJECT SUMMARY`);
console.log(`========================================`);
const byGrade = summary.reduce((m, r) => {
  (m[r.grade] ||= []).push(r);
  return m;
}, {});
for (const g of Object.keys(byGrade).sort()) {
  console.log(`\n[${g}]`);
  for (const r of byGrade[g]) {
    console.log(`  ${r.subject.padEnd(22)} chapters: +${r.chaptersCreated} (${r.chaptersSkipped} existed), questions: +${r.questionsCreated}`);
  }
}
