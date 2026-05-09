/**
 * Algerian university catalogue — names + a short description + the
 * filières each one is famous for + the moyenne du Bac usually required
 * (rough public-domain numbers from past years; for guidance only).
 *
 * Used by the diagnostic to recommend universities matching the student's
 * Bac stream + interests, and by the catalogue page on /fac/universites.
 */

export type Domain =
  | "medecine" | "pharmacie" | "dentiste" | "veto"
  | "ingenieur" | "informatique" | "math-physique"
  | "architecture" | "genie-civil" | "agronomie"
  | "droit" | "economie" | "lettres" | "langues"
  | "sciences-naturelles" | "sport" | "art" | "communication";

export type BacStream =
  | "sciences-experimentales"
  | "mathematiques"
  | "techniques-mathematiques"
  | "lettres-philosophie"
  | "lettres-langues"
  | "gestion-economie";

export interface University {
  slug: string;
  name_fr: string;
  name_ar: string;
  short: string;
  city: string;
  domains: Domain[];
  /** Indicative Bac average that's typically competitive (not a rule). */
  min_avg?: number;
  /** Best-fit Bac streams. */
  streams: BacStream[];
  /** Quick "why come here" sentence. */
  highlight_fr: string;
  highlight_ar: string;
  /** Optional emoji used as the avatar in tile views. */
  emoji?: string;
}

export const UNIVERSITIES: University[] = [
  {
    slug: "usthb",
    name_fr: "USTHB — Houari-Boumédiène",
    name_ar: "USTHB — هواري بومدين",
    short: "USTHB",
    city: "Bab Ezzouar, Alger",
    domains: ["math-physique", "informatique", "sciences-naturelles", "ingenieur"],
    min_avg: 12,
    streams: ["sciences-experimentales", "mathematiques", "techniques-mathematiques"],
    highlight_fr: "La plus grande fac scientifique du pays. Maths, info, physique, biologie.",
    highlight_ar: "أكبر جامعة علمية في البلاد. رياضيات وإعلام آلي وفيزياء وبيولوجيا.",
    emoji: "🔬",
  },
  {
    slug: "enp",
    name_fr: "ENP — École Nationale Polytechnique",
    name_ar: "ENP — المدرسة الوطنية المتعددة التقنيات",
    short: "ENP",
    city: "El Harrach, Alger",
    domains: ["ingenieur", "informatique", "genie-civil"],
    min_avg: 16,
    streams: ["mathematiques", "techniques-mathematiques", "sciences-experimentales"],
    highlight_fr: "L'élite des écoles d'ingénieurs. Concours après prépas, très sélectif.",
    highlight_ar: "نخبة مدارس الهندسة. مسابقة بعد التحضيري، انتقائية جداً.",
    emoji: "⚙️",
  },
  {
    slug: "ensia",
    name_fr: "ENSIA — Sup. d'Intelligence Artificielle",
    name_ar: "ENSIA — العليا للذكاء الاصطناعي",
    short: "ENSIA",
    city: "Mahelma, Alger",
    domains: ["informatique"],
    min_avg: 17,
    streams: ["mathematiques", "techniques-mathematiques"],
    highlight_fr: "École spécialisée IA, créée en 2021. Très sélective, débouchés tech.",
    highlight_ar: "مدرسة متخصصة في الذكاء الاصطناعي، أُسّست ٢٠٢١. انتقائية جداً.",
    emoji: "🤖",
  },
  {
    slug: "ens-kouba",
    name_fr: "ENS Kouba — École Normale Supérieure",
    name_ar: "ENS الكويبة",
    short: "ENS Kouba",
    city: "Kouba, Alger",
    domains: ["lettres", "langues", "math-physique"],
    min_avg: 14,
    streams: ["lettres-philosophie", "lettres-langues", "sciences-experimentales", "mathematiques"],
    highlight_fr: "Forme les futurs profs. Bourse + emploi garanti à la sortie.",
    highlight_ar: "تكوّن أساتذة المستقبل. منحة + توظيف مضمون.",
    emoji: "📚",
  },
  {
    slug: "alger-1-medecine",
    name_fr: "Faculté de médecine d'Alger",
    name_ar: "كلية الطب — الجزائر",
    short: "Médecine Alger",
    city: "Alger Centre",
    domains: ["medecine", "pharmacie", "dentiste"],
    min_avg: 16,
    streams: ["sciences-experimentales"],
    highlight_fr: "La voie royale pour devenir médecin. 7 ans d'études, sélection au Bac.",
    highlight_ar: "الطريق الملكي للطب. ٧ سنوات دراسة، انتقاء في البكالوريا.",
    emoji: "🩺",
  },
  {
    slug: "saidhamdine-architecture",
    name_fr: "EPAU Saïd Hamdine (Architecture)",
    name_ar: "EPAU سعيد حمدين (هندسة معمارية)",
    short: "EPAU",
    city: "Saïd Hamdine, Alger",
    domains: ["architecture"],
    min_avg: 14,
    streams: ["mathematiques", "techniques-mathematiques", "sciences-experimentales"],
    highlight_fr: "École polytechnique d'architecture et d'urbanisme. Référence en archi.",
    highlight_ar: "المدرسة المتعددة التقنيات للهندسة المعمارية والتعمير.",
    emoji: "🏛️",
  },
  {
    slug: "ina-agronomie",
    name_fr: "INA — École nationale supérieure agronomique",
    name_ar: "INA — المدرسة العليا للفلاحة",
    short: "INA",
    city: "El Harrach, Alger",
    domains: ["agronomie", "sciences-naturelles", "veto"],
    min_avg: 13,
    streams: ["sciences-experimentales"],
    highlight_fr: "Agronomie, écologie, sécurité alimentaire. Beaux campus, terrain.",
    highlight_ar: "زراعة وبيئة وأمن غذائي. حرم جامعي جميل وميدان.",
    emoji: "🌾",
  },
  {
    slug: "constantine-medecine",
    name_fr: "Faculté de médecine de Constantine",
    name_ar: "كلية الطب — قسنطينة",
    short: "Méd. Constantine",
    city: "Constantine",
    domains: ["medecine", "pharmacie"],
    min_avg: 15.5,
    streams: ["sciences-experimentales"],
    highlight_fr: "Médecine pour la région Est. Hôpital CHU sur place pour les stages.",
    highlight_ar: "كلية الطب للشرق. مستشفى جامعي للتربصات.",
    emoji: "🏥",
  },
  {
    slug: "oran-USTO",
    name_fr: "USTO — Mohamed Boudiaf",
    name_ar: "USTO — محمد بوضياف",
    short: "USTO",
    city: "Oran",
    domains: ["ingenieur", "informatique", "math-physique"],
    min_avg: 12.5,
    streams: ["sciences-experimentales", "mathematiques", "techniques-mathematiques"],
    highlight_fr: "Référence scientifique de l'Ouest algérien. Ingénierie, info, sciences.",
    highlight_ar: "مرجع الغرب العلمي. هندسة وإعلام آلي وعلوم.",
    emoji: "🔧",
  },
  {
    slug: "annaba-badji",
    name_fr: "Université Badji Mokhtar — Annaba",
    name_ar: "جامعة باجي مختار — عنابة",
    short: "Annaba",
    city: "Annaba",
    domains: ["medecine", "ingenieur", "lettres", "droit"],
    min_avg: 11,
    streams: ["sciences-experimentales", "mathematiques", "lettres-philosophie", "lettres-langues", "gestion-economie"],
    highlight_fr: "Pluridisciplinaire, grande université de l'Est, beaucoup de filières.",
    highlight_ar: "جامعة متعددة التخصصات، كبيرة في الشرق.",
    emoji: "🎓",
  },
  {
    slug: "tlemcen",
    name_fr: "Université Aboubekr Belkaïd — Tlemcen",
    name_ar: "جامعة أبو بكر بلقايد — تلمسان",
    short: "Tlemcen",
    city: "Tlemcen",
    domains: ["medecine", "lettres", "droit", "agronomie"],
    min_avg: 11,
    streams: ["sciences-experimentales", "lettres-philosophie", "lettres-langues", "gestion-economie"],
    highlight_fr: "Cadre paisible, médecine, lettres et droit bien classés.",
    highlight_ar: "محيط هادئ، الطب والآداب والقانون مصنّفة جيداً.",
    emoji: "🌿",
  },
  {
    slug: "alger-3-eco",
    name_fr: "Université d'Alger 3 — Sciences éco. & gestion",
    name_ar: "جامعة الجزائر ٣ — الاقتصاد والتسيير",
    short: "Alger 3",
    city: "Dely Brahim, Alger",
    domains: ["economie", "communication"],
    min_avg: 11,
    streams: ["gestion-economie", "lettres-philosophie", "mathematiques"],
    highlight_fr: "Éco, gestion, finance, communication. Un classique pour les filières gestion.",
    highlight_ar: "اقتصاد وتسيير ومالية وإعلام. تقليدي لشُعب التسيير.",
    emoji: "📊",
  },
  {
    slug: "alger-droit",
    name_fr: "Faculté de droit — Alger 1",
    name_ar: "كلية الحقوق — الجزائر ١",
    short: "Droit Alger",
    city: "Ben Aknoun, Alger",
    domains: ["droit"],
    min_avg: 11,
    streams: ["lettres-philosophie", "lettres-langues", "gestion-economie"],
    highlight_fr: "La fac de droit historique. Avocats, magistrats, notaires en sortent.",
    highlight_ar: "كلية الحقوق التاريخية. منها يخرج المحامون والقضاة.",
    emoji: "⚖️",
  },
  {
    slug: "iste-batna",
    name_fr: "Université de Batna — Sciences",
    name_ar: "جامعة باتنة — العلوم",
    short: "Batna",
    city: "Batna",
    domains: ["math-physique", "informatique", "sciences-naturelles"],
    min_avg: 11,
    streams: ["sciences-experimentales", "mathematiques", "techniques-mathematiques"],
    highlight_fr: "Bonne fac de sciences pour les Aurès et l'Est. Bourse étudiante généreuse.",
    highlight_ar: "كلية علوم جيّدة لمنطقة الأوراس. منحة طلابية سخية.",
    emoji: "🧪",
  },
  {
    slug: "ensp",
    name_fr: "ENSSP — Santé publique",
    name_ar: "ENSSP — الصحة العمومية",
    short: "ENSSP",
    city: "Alger",
    domains: ["medecine"],
    min_avg: 13,
    streams: ["sciences-experimentales"],
    highlight_fr: "Santé publique, épidémiologie, gestion hospitalière. Niche mais utile.",
    highlight_ar: "صحة عمومية وعلم الوبائيات وتسيير المستشفيات.",
    emoji: "💉",
  },
  {
    slug: "esiste",
    name_fr: "ESI — École supérieure d'informatique",
    name_ar: "ESI — المدرسة العليا للإعلام الآلي",
    short: "ESI",
    city: "Oued Smar, Alger",
    domains: ["informatique"],
    min_avg: 16,
    streams: ["mathematiques", "techniques-mathematiques", "sciences-experimentales"],
    highlight_fr: "L'école d'informatique la plus connue. Concours après prépas.",
    highlight_ar: "أشهر مدرسة للإعلام الآلي. مسابقة بعد التحضيري.",
    emoji: "💻",
  },
];
