/**
 * Blog articles — stored in code (no CMS yet). Each article has bilingual
 * metadata and a French body split into sections. The blog list and the
 * [slug] detail page both read from here.
 *
 * To add an article: append an object to ARTICLES. Keep `slug` URL-safe and
 * unique. `date` is ISO (YYYY-MM-DD). Sections render as heading + paragraphs.
 */

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO
  readMinutes: number;
  emoji: string;
  sections: ArticleSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: "reussir-le-bem",
    category: "Collège · BEM",
    title: "Comment aider votre enfant à réussir le BEM",
    excerpt:
      "Le Brevet d'Enseignement Moyen marque la fin du cycle collégial. Voici un plan concret pour accompagner votre enfant vers la réussite, sans stress inutile.",
    author: "L'équipe Najaح",
    date: "2026-06-15",
    readMinutes: 6,
    emoji: "📘",
    sections: [
      {
        heading: "Comprendre l'épreuve",
        paragraphs: [
          "Le BEM porte sur les matières fondamentales de la 4ème année moyenne : mathématiques, sciences physiques, sciences naturelles, langue arabe, français, anglais et histoire-géographie. La moyenne de passage combine la note de l'examen et la moyenne annuelle de l'élève.",
          "La première étape, souvent négligée, est de bien connaître le format de chaque épreuve : durée, barème, type de questions. Un élève qui sait à quoi s'attendre aborde l'examen avec beaucoup moins d'anxiété.",
        ],
      },
      {
        heading: "Établir un calendrier de révision réaliste",
        paragraphs: [
          "Trois mois avant l'examen, aidez votre enfant à répartir les chapitres sur un planning hebdomadaire. L'erreur classique est de tout réviser à la dernière minute : la mémoire à long terme se construit par des révisions espacées.",
          "Alternez les matières dans la même journée plutôt que de bloquer une journée entière sur une seule. Le cerveau retient mieux quand il change de contexte régulièrement.",
        ],
      },
      {
        heading: "Privilégier les annales et les quiz",
        paragraphs: [
          "Rien ne remplace l'entraînement sur des sujets réels. Faites travailler votre enfant sur les sujets du BEM des années précédentes, en conditions chronométrées. C'est le meilleur moyen de repérer les lacunes qui restent.",
          "Les quiz courts par chapitre sont aussi très efficaces : ils transforment la révision passive (relire le cours) en révision active (se tester), qui est prouvée bien plus efficace pour la mémorisation.",
        ],
      },
      {
        heading: "Le rôle du parent : soutenir, pas remplacer",
        paragraphs: [
          "Votre rôle n'est pas de faire les exercices à la place de votre enfant, mais de créer les conditions de la réussite : un coin calme pour travailler, un sommeil suffisant, une alimentation équilibrée, et surtout un climat de confiance.",
          "Félicitez les efforts autant que les résultats. Un enfant qui se sent soutenu ose demander de l'aide quand il bloque, au lieu de cacher ses difficultés jusqu'à ce qu'il soit trop tard.",
        ],
      },
    ],
  },
  {
    slug: "motiver-enfant-mathematiques",
    category: "Conseils · Motivation",
    title: "5 astuces pour motiver un enfant qui n'aime pas les maths",
    excerpt:
      "« Je suis nul en maths » est une phrase qu'aucun parent ne devrait accepter. La bosse des maths n'existe pas : voici comment redonner confiance à votre enfant.",
    author: "L'équipe Najaح",
    date: "2026-06-28",
    readMinutes: 5,
    emoji: "🧮",
    sections: [
      {
        heading: "1. Relier les maths à la vie réelle",
        paragraphs: [
          "Les fractions au marché, les pourcentages sur les soldes, la géométrie dans les motifs du zellige : les mathématiques sont partout autour de nous. Un enfant comprend mieux quand il voit à quoi ça sert concrètement.",
          "Impliquez-le dans les calculs du quotidien : compter la monnaie, doubler une recette, estimer un temps de trajet. Ce sont des maths déguisées, et elles ancrent les notions bien mieux qu'un exercice abstrait.",
        ],
      },
      {
        heading: "2. Transformer l'échec en information",
        paragraphs: [
          "Une erreur n'est pas une catastrophe : c'est une indication précise de ce qui n'est pas encore acquis. Apprenez à votre enfant à analyser ses fautes plutôt qu'à les subir.",
          "La correction détaillée d'un quiz, où l'on comprend POURQUOI la bonne réponse est la bonne, vaut dix exercices faits sans retour.",
        ],
      },
      {
        heading: "3. Jouer pour apprendre",
        paragraphs: [
          "Les jeux de calcul mental, les défis chronométrés, les énigmes logiques transforment une corvée en plaisir. Un enfant qui joue avec les nombres développe une aisance qui se transfère directement aux exercices scolaires.",
          "L'important est de doser la difficulté : ni trop facile (ennui), ni trop dur (découragement). L'objectif est cet état où l'enfant est concentré et absorbé.",
        ],
      },
      {
        heading: "4. Célébrer les petites victoires",
        paragraphs: [
          "La confiance se construit par accumulation de réussites. Fixez des objectifs atteignables : maîtriser une table de multiplication, réussir un type d'exercice précis. Chaque victoire nourrit la motivation pour la suivante.",
        ],
      },
      {
        heading: "5. Bannir la phrase « je suis nul en maths »",
        paragraphs: [
          "Les recherches en pédagogie sont claires : le talent inné compte moins que le travail régulier. Remplacez « je n'y arrive pas » par « je n'y arrive pas ENCORE ». Ce simple mot change tout dans la tête d'un enfant.",
        ],
      },
    ],
  },
  {
    slug: "calendrier-revision-bac",
    category: "Lycée · BAC",
    title: "Préparer le BAC algérien : le calendrier de révision idéal",
    excerpt:
      "Réussir le baccalauréat ne se joue pas dans les deux dernières semaines. Voici comment organiser une année de terminale efficace, mois par mois.",
    author: "L'équipe Najaح",
    date: "2026-07-05",
    readMinutes: 7,
    emoji: "🎓",
    sections: [
      {
        heading: "De septembre à décembre : construire les bases",
        paragraphs: [
          "Le premier trimestre n'est pas un échauffement : c'est là que se posent les fondations. Chaque chapitre non compris en octobre devient un handicap en mai. L'objectif de cette période est de ne laisser aucune notion importante dans le flou.",
          "Prenez l'habitude, dès le début de l'année, de faire une fiche de synthèse par chapitre. Ces fiches seront votre trésor au moment des révisions finales.",
        ],
      },
      {
        heading: "De janvier à mars : approfondir et s'entraîner",
        paragraphs: [
          "Le deuxième trimestre est celui de la pratique intensive. C'est le moment d'attaquer les annales du BAC, filière par filière. Un sujet complet par semaine, corrigé sérieusement, fait progresser énormément.",
          "Repérez les chapitres qui reviennent le plus souvent aux examens et concentrez-y vos efforts. En mathématiques comme en sciences, certaines notions sont quasiment systématiques.",
        ],
      },
      {
        heading: "Avril : les examens blancs",
        paragraphs: [
          "Passez de vrais examens blancs, en conditions réelles : même durée, même silence, sans notes. C'est le seul moyen de préparer votre endurance et votre gestion du temps, deux facteurs qui font perdre beaucoup de points le jour J.",
          "Après chaque examen blanc, analysez froidement : où avez-vous perdu des points ? Par manque de connaissances, d'entraînement, ou de temps ? La réponse oriente vos dernières semaines de révision.",
        ],
      },
      {
        heading: "Mai : consolider, pas découvrir",
        paragraphs: [
          "Les dernières semaines ne servent PAS à apprendre de nouvelles choses, mais à consolider ce qui est déjà su. Relisez vos fiches, refaites les exercices-types, dormez suffisamment.",
          "La veille de l'épreuve, arrêtez de réviser en début de soirée. Un cerveau reposé restitue infiniment mieux qu'un cerveau épuisé par une nuit blanche. La confiance, à ce stade, vaut plus qu'un chapitre de plus.",
        ],
      },
    ],
  },
  {
    slug: "bilinguisme-arabe-francais",
    category: "Éducation · Langues",
    title: "Le bilinguisme arabe-français : un atout pour votre enfant",
    excerpt:
      "En Algérie, les élèves jonglent entre l'arabe et le français dès le primaire. Loin d'être un obstacle, ce bilinguisme est une richesse cognitive à cultiver.",
    author: "L'équipe Najaح",
    date: "2026-07-12",
    readMinutes: 5,
    emoji: "🗣️",
    sections: [
      {
        heading: "Deux langues, deux façons de penser",
        paragraphs: [
          "Les enfants bilingues développent une flexibilité mentale supérieure : ils passent plus facilement d'une tâche à l'autre et repèrent mieux les nuances. Maîtriser à la fois l'arabe et le français, c'est disposer de deux clés pour ouvrir le monde.",
          "En Algérie, cette double compétence est un véritable atout scolaire et professionnel. Les sciences s'enseignent souvent avec un vocabulaire français, tandis que la richesse littéraire arabe nourrit l'expression et la culture.",
        ],
      },
      {
        heading: "Ne pas opposer les deux langues",
        paragraphs: [
          "L'erreur serait de considérer une langue comme « sérieuse » et l'autre comme secondaire. Les deux méritent le même soin. Un enfant qui lit régulièrement dans les deux langues enrichit son vocabulaire global, pas seulement celui d'une langue.",
          "Encouragez la lecture plaisir dans les deux langues : contes en arabe, bandes dessinées en français, peu importe le support tant que l'enfant y prend goût.",
        ],
      },
      {
        heading: "Ajouter l'anglais au bon moment",
        paragraphs: [
          "L'anglais, désormais introduit dès le primaire, vient compléter ce socle. Un enfant déjà habitué à jongler entre deux langues intègre une troisième bien plus naturellement qu'on ne le croit.",
          "La clé est la régularité plutôt que l'intensité : quelques minutes chaque jour valent mieux qu'une longue séance hebdomadaire. Des jeux de vocabulaire courts entretiennent l'acquis sans lasser.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
