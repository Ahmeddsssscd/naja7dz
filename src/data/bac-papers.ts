export type BacBranch = 'sciences' | 'math' | 'techniques' | 'lettres' | 'langues' | 'gestion';
export type BacSubject = 'mathematiques' | 'physique' | 'sciences_nat' | 'philosophie' | 'francais' | 'arabe' | 'anglais' | 'histoire_geo';

export type BacPaper = {
  year: number;
  branch: BacBranch;
  subject: BacSubject;
  subject_fr: string;
  subject_ar: string;
  type: 'sujet' | 'correction';
  external_url: string;
};

const BASE = 'https://bac-algerie.net/sujets.html';

function entries(years: number[], branch: BacBranch, subject: BacSubject, subject_fr: string, subject_ar: string, types: Array<'sujet' | 'correction'> = ['sujet', 'correction']): BacPaper[] {
  return years.flatMap(year => types.map(type => ({ year, branch, subject, subject_fr, subject_ar, type, external_url: BASE })));
}

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019] as const;

export const BAC_PAPERS: BacPaper[] = [
  // Sciences expérimentales
  ...entries([...YEARS], 'sciences', 'mathematiques',  'Mathématiques',        'الرياضيات'),
  ...entries([...YEARS], 'sciences', 'physique',        'Sciences physiques',   'العلوم الفيزيائية'),
  ...entries([...YEARS], 'sciences', 'sciences_nat',   'Sciences naturelles',  'علوم الطبيعة'),
  ...entries([...YEARS], 'sciences', 'philosophie',    'Philosophie',          'الفلسفة'),
  ...entries([...YEARS], 'sciences', 'francais',       'Français',             'اللغة الفرنسية'),
  ...entries([...YEARS], 'sciences', 'arabe',          'Langue arabe',         'اللغة العربية'),
  // Mathématiques
  ...entries([...YEARS], 'math', 'mathematiques',      'Mathématiques',        'الرياضيات'),
  ...entries([...YEARS], 'math', 'physique',           'Sciences physiques',   'العلوم الفيزيائية'),
  ...entries([...YEARS], 'math', 'philosophie',        'Philosophie',          'الفلسفة'),
  ...entries([...YEARS], 'math', 'francais',           'Français',             'اللغة الفرنسية'),
  ...entries([...YEARS], 'math', 'arabe',              'Langue arabe',         'اللغة العربية'),
  // Techniques
  ...entries([...YEARS], 'techniques', 'mathematiques', 'Mathématiques',       'الرياضيات'),
  ...entries([...YEARS], 'techniques', 'physique',      'Sciences physiques',  'العلوم الفيزيائية'),
  ...entries([...YEARS], 'techniques', 'arabe',         'Langue arabe',        'اللغة العربية'),
  ...entries([...YEARS], 'techniques', 'francais',      'Français',            'اللغة الفرنسية'),
  // Lettres
  ...entries([...YEARS], 'lettres', 'philosophie',     'Philosophie',          'الفلسفة'),
  ...entries([...YEARS], 'lettres', 'arabe',           'Langue arabe',         'اللغة العربية وآدابها'),
  ...entries([...YEARS], 'lettres', 'histoire_geo',    'Histoire-Géographie',  'التاريخ والجغرافيا'),
  ...entries([...YEARS], 'lettres', 'francais',        'Français',             'اللغة الفرنسية'),
  // Langues
  ...entries([...YEARS], 'langues', 'anglais',         'Anglais',              'اللغة الإنجليزية'),
  ...entries([...YEARS], 'langues', 'francais',        'Français',             'اللغة الفرنسية'),
  ...entries([...YEARS], 'langues', 'histoire_geo',    'Histoire-Géographie',  'التاريخ والجغرافيا'),
  ...entries([...YEARS], 'langues', 'arabe',           'Langue arabe',         'اللغة العربية'),
  // Gestion
  ...entries([...YEARS], 'gestion', 'mathematiques',   'Mathématiques',        'الرياضيات'),
  ...entries([...YEARS], 'gestion', 'histoire_geo',    'Histoire-Géographie',  'التاريخ والجغرافيا'),
  ...entries([...YEARS], 'gestion', 'arabe',           'Langue arabe',         'اللغة العربية'),
  ...entries([...YEARS], 'gestion', 'francais',        'Français',             'اللغة الفرنسية'),
];

export const BRANCH_LABELS: Record<BacBranch, { fr: string; ar: string }> = {
  sciences:   { fr: 'Sciences exp.',   ar: 'علوم تجريبية' },
  math:       { fr: 'Mathématiques',   ar: 'رياضيات'       },
  techniques: { fr: 'Techniques',      ar: 'تقني رياضي'   },
  lettres:    { fr: 'Lettres & Philo', ar: 'آداب وفلسفة'  },
  langues:    { fr: 'Langues',         ar: 'لغات أجنبية'  },
  gestion:    { fr: 'Gestion',         ar: 'تسيير واقتصاد'},
};

export const ALL_YEARS = [2024, 2023, 2022, 2021, 2020, 2019] as const;
export const ALL_BRANCHES = Object.keys(BRANCH_LABELS) as BacBranch[];
