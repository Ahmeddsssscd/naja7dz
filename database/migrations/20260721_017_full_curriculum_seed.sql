-- ===============================================================
-- Migration: 20260721_017_full_curriculum_seed
--
-- Full Algerian curriculum skeleton — 1AP through 3AS.
-- Sources cross-checked against the official 2nd-generation programs
-- as published on eddirasa.com / dzexams.com (chapter lists per level).
--
-- Adds:
--   1. chapters.lesson_fr / lesson_ar  — inline lesson content
--   2. subjects for every grade (previous seed only had 3AM/4AM/3AS)
--   3. chapters for the core subject/grade combinations
--   4. lesson content for flagship chapters
--   5. quiz_questions bank for flagship chapters (playable quizzes)
--
-- Idempotent: every insert is ON CONFLICT DO NOTHING or guarded by
-- WHERE NOT EXISTS.
-- ===============================================================

-- ===== 1. Lesson content columns =====
alter table public.chapters add column if not exists lesson_fr text;
alter table public.chapters add column if not exists lesson_ar text;

comment on column public.chapters.lesson_fr is
  'Inline lesson (plain text w/ line breaks) shown before the chapter quiz.';

-- ===== 2. Subjects for every grade =====

-- Primaire 1AP–2AP: arabic, maths, islamic and civic education
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AP', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 1),
  ('1AP', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 2),
  ('1AP', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 3),
  ('1AP', 'civique',    'Éducation civique',     'التربية المدنية',      'flag', 4),
  ('2AP', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 1),
  ('2AP', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 2),
  ('2AP', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 3),
  ('2AP', 'civique',    'Éducation civique',     'التربية المدنية',      'flag', 4)
on conflict (grade_code, slug) do nothing;

-- Primaire 3AP–4AP: French begins in 3AP, science awareness added
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('3AP', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 1),
  ('3AP', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 2),
  ('3AP', 'francais',   'Français',              'اللغة الفرنسية',       'book', 3),
  ('3AP', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 4),
  ('3AP', 'civique',    'Éducation civique',     'التربية المدنية',      'flag', 5),
  ('3AP', 'sciences',   'Éveil scientifique',    'التربية العلمية والتكنولوجية', 'leaf', 6),
  ('4AP', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 1),
  ('4AP', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 2),
  ('4AP', 'francais',   'Français',              'اللغة الفرنسية',       'book', 3),
  ('4AP', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 4),
  ('4AP', 'civique',    'Éducation civique',     'التربية المدنية',      'flag', 5),
  ('4AP', 'sciences',   'Éveil scientifique',    'التربية العلمية والتكنولوجية', 'leaf', 6),
  ('4AP', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7)
on conflict (grade_code, slug) do nothing;

-- 5AP — exam year (fin de cycle primaire)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('5AP', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 1),
  ('5AP', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 2),
  ('5AP', 'francais',   'Français',              'اللغة الفرنسية',       'book', 3),
  ('5AP', 'anglais',    'Anglais',               'اللغة الإنجليزية',     'globe', 4),
  ('5AP', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 5),
  ('5AP', 'civique',    'Éducation civique',     'التربية المدنية',      'flag', 6),
  ('5AP', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7),
  ('5AP', 'sciences',   'Éveil scientifique',    'التربية العلمية والتكنولوجية', 'leaf', 8)
on conflict (grade_code, slug) do nothing;

-- Moyen 1AM–2AM (3AM/4AM core subjects already seeded in migration 003)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AM', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 1),
  ('1AM', 'physique',   'Sciences physiques',    'العلوم الفيزيائية والتكنولوجيا', 'atom', 2),
  ('1AM', 'svt',        'Sciences naturelles',   'علوم الطبيعة والحياة', 'leaf', 3),
  ('1AM', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 4),
  ('1AM', 'francais',   'Français',              'اللغة الفرنسية',       'book', 5),
  ('1AM', 'anglais',    'Anglais',               'اللغة الإنجليزية',     'globe', 6),
  ('1AM', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7),
  ('1AM', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 8),
  ('2AM', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 1),
  ('2AM', 'physique',   'Sciences physiques',    'العلوم الفيزيائية والتكنولوجيا', 'atom', 2),
  ('2AM', 'svt',        'Sciences naturelles',   'علوم الطبيعة والحياة', 'leaf', 3),
  ('2AM', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 4),
  ('2AM', 'francais',   'Français',              'اللغة الفرنسية',       'book', 5),
  ('2AM', 'anglais',    'Anglais',               'اللغة الإنجليزية',     'globe', 6),
  ('2AM', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7),
  ('2AM', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 8)
on conflict (grade_code, slug) do nothing;

-- Fill gaps in 3AM / 4AM
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('3AM', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 8),
  ('4AM', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7),
  ('4AM', 'islamique',  'Éducation islamique',   'التربية الإسلامية',    'moon', 8)
on conflict (grade_code, slug) do nothing;

-- Secondaire 1AS–2AS (3AS core subjects already seeded)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AS', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 1),
  ('1AS', 'physique',   'Sciences physiques',    'العلوم الفيزيائية',    'atom', 2),
  ('1AS', 'svt',        'Sciences naturelles',   'علوم الطبيعة والحياة', 'leaf', 3),
  ('1AS', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 4),
  ('1AS', 'francais',   'Français',              'اللغة الفرنسية',       'book', 5),
  ('1AS', 'anglais',    'Anglais',               'اللغة الإنجليزية',     'globe', 6),
  ('1AS', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 7),
  ('1AS', 'informatique', 'Informatique',        'الإعلام الآلي',        'cpu', 8),
  ('2AS', 'mathematiques', 'Mathématiques',      'الرياضيات',            'sigma', 1),
  ('2AS', 'physique',   'Sciences physiques',    'العلوم الفيزيائية',    'atom', 2),
  ('2AS', 'svt',        'Sciences naturelles',   'علوم الطبيعة والحياة', 'leaf', 3),
  ('2AS', 'arabe',      'Langue arabe',          'اللغة العربية',        'book-arabic', 4),
  ('2AS', 'francais',   'Français',              'اللغة الفرنسية',       'book', 5),
  ('2AS', 'anglais',    'Anglais',               'اللغة الإنجليزية',     'globe', 6),
  ('2AS', 'philosophie','Philosophie',           'الفلسفة',              'lightbulb', 7),
  ('2AS', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 8),
  ('3AS', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا',   'map', 8),
  ('3AS', 'islamique',  'Sciences islamiques',   'العلوم الإسلامية',     'moon', 9)
on conflict (grade_code, slug) do nothing;

-- ===== 3. Chapters =====
-- Pattern: insert..select joined on (grade_code, slug) so this works
-- regardless of the generated subject UUIDs.

-- ---- 5AP Mathématiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('grands-nombres',   'Les grands nombres',                'الأعداد الكبيرة',                'Lire, écrire et comparer les nombres jusqu''aux millions.', 1),
  ('fractions',        'Les fractions',                     'الكسور',                          'Représenter, comparer et additionner des fractions simples.', 2),
  ('nombres-decimaux', 'Les nombres décimaux',              'الأعداد العشرية',                'Écriture décimale, comparaison et opérations.', 3),
  ('proportionnalite', 'La proportionnalité',               'التناسبية',                       'Tableaux de proportionnalité et règle de trois.', 4),
  ('mesures',          'Les mesures',                       'القياس: الأطوال والكتل والسعات', 'Longueurs, masses, capacités et conversions.', 5),
  ('perimetres-aires', 'Périmètres et aires',               'المحيطات والمساحات',             'Périmètre et aire du carré, rectangle et triangle.', 6),
  ('geometrie',        'Figures et solides',                'الأشكال الهندسية والمجسمات',     'Polygones, cercle, cube, pavé droit.', 7),
  ('problemes',        'Résolution de problèmes',           'حل المشكلات',                    'Démarches pour résoudre des problèmes de la vie courante.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 5AP Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('comprehension-oral',  'Compréhension de l''oral',   'فهم المنطوق والتعبير الشفوي', 'Écouter, comprendre et restituer un texte oral.', 1),
  ('lecture',             'Lecture et compréhension',   'القراءة وفهم المكتوب',        'Lire couramment et comprendre des textes variés.', 2),
  ('grammaire',           'Grammaire (نحو)',            'الظواهر النحوية',             'La phrase nominale et verbale, les compléments.', 3),
  ('conjugaison',         'Morphologie (صرف)',          'الظواهر الصرفية',             'Conjugaison des verbes au passé, présent et impératif.', 4),
  ('orthographe',         'Orthographe (إملاء)',        'الإملاء',                     'Hamza, ta marbouta et règles d''écriture.', 5),
  ('production-ecrite',   'Production écrite',          'الإنتاج الكتابي',             'Rédiger des textes courts structurés.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ---- 5AP Français ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-documentaire', 'Projet 1 · Le texte documentaire', 'النص الوثائقي',    'Lire et produire un texte qui informe.', 1),
  ('conte',              'Projet 2 · Le conte',              'النص السردي',      'Lire et raconter une histoire (schéma narratif).', 2),
  ('texte-explicatif',   'Projet 3 · Le texte explicatif',   'النص التفسيري',    'Comprendre et produire un texte qui explique.', 3),
  ('grammaire',          'Grammaire',                        'القواعد',          'La phrase, ses types et ses constituants.', 4),
  ('conjugaison',        'Conjugaison',                      'التصريف',          'Présent, passé composé et futur des verbes usuels.', 5),
  ('orthographe-vocab',  'Orthographe et vocabulaire',       'الإملاء والمفردات','Accords, homophones et enrichissement du lexique.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 1AM Mathématiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('entiers-decimaux', 'Nombres entiers et décimaux',   'الأعداد الطبيعية والعشرية', 'Lecture, écriture, comparaison et repérage.', 1),
  ('operations',       'Opérations',                    'العمليات على الأعداد',       'Addition, soustraction, multiplication, division.', 2),
  ('fractions',        'Fractions',                     'الكسور',                     'Sens de la fraction, comparaison, opérations simples.', 3),
  ('relatifs',         'Nombres relatifs',              'الأعداد النسبية',            'Découverte des nombres négatifs et repérage.', 4),
  ('proportionnalite', 'Proportionnalité',              'التناسبية',                  'Situations proportionnelles et pourcentages.', 5),
  ('droites-angles',   'Droites et angles',             'المستقيمات والزوايا',        'Parallèles, perpendiculaires, mesure d''angles.', 6),
  ('triangles-quadri', 'Triangles et quadrilatères',    'المثلثات والرباعيات',        'Construction et propriétés des figures usuelles.', 7),
  ('aires-perimetres', 'Aires et périmètres',           'المساحات والمحيطات',         'Calculs d''aires et de périmètres.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 2AM Mathématiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('relatifs-operations', 'Nombres relatifs — opérations', 'العمليات على الأعداد النسبية', 'Addition, soustraction et multiplication des relatifs.', 1),
  ('fractions-operations','Fractions — opérations',        'العمليات على الكسور',          'Somme, différence et produit de fractions.', 2),
  ('calcul-litteral',     'Calcul littéral (initiation)',  'الحساب الحرفي',                'Expressions littérales, réduction et distributivité.', 3),
  ('proportionnalite',    'Proportionnalité et pourcentages','التناسبية والنسب المئوية',   'Échelle, vitesse moyenne, pourcentages.', 4),
  ('symetrie-centrale',   'Symétrie centrale',             'التناظر المركزي',              'Construction du symétrique d''une figure par rapport à un point.', 5),
  ('angles-parallelisme', 'Angles et parallélisme',        'الزوايا والتوازي',             'Angles alternes-internes et correspondants.', 6),
  ('triangles',           'Triangles — droites remarquables','المثلثات والمستقيمات الخاصة','Médiatrices, hauteurs, médianes et bissectrices.', 7),
  ('statistiques',        'Statistiques (initiation)',     'الإحصاء',                      'Effectifs, fréquences et diagrammes.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AM Mathématiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('rationnels',       'Nombres rationnels — opérations', 'العمليات على الأعداد الناطقة', 'Quotients, écritures fractionnaires et calculs.', 1),
  ('puissances',       'Puissances',                      'القوى',                        'Puissances d''exposant entier, notation scientifique.', 2),
  ('calcul-litteral',  'Calcul littéral',                 'الحساب الحرفي',                'Développement, factorisation, distributivité double.', 3),
  ('equations',        'Équations du 1er degré',          'المعادلات من الدرجة الأولى',   'Mise en équation et résolution de problèmes.', 4),
  ('proportionnalite', 'Proportionnalité et vitesse',     'التناسبية والسرعة',            'Vitesse moyenne, échelles et grandeurs composées.', 5),
  ('statistiques',     'Statistiques',                    'الإحصاء',                      'Moyennes, fréquences et représentations graphiques.', 6),
  ('droites-triangle', 'Droites remarquables du triangle','المستقيمات الخاصة في المثلث',  'Médiatrices, médianes, hauteurs et cercle circonscrit.', 7),
  ('cercle-triangle',  'Cercle et triangle rectangle',    'الدائرة والمثلث القائم',       'Triangle rectangle inscrit dans un demi-cercle.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Mathématiques (année du BEM) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('rationnels',        'Nombres rationnels',                'الأعداد الناطقة',              'Calculs sur les rationnels, priorités et simplifications.', 1),
  ('calcul-litteral',   'Calcul littéral et identités',      'الحساب الحرفي والمتطابقات الشهيرة', 'Développement, factorisation, identités remarquables.', 2),
  ('equations',         'Équations et inéquations',          'المعادلات والمتراجحات',        'Résolution d''équations et d''inéquations du 1er degré.', 3),
  ('systemes',          'Systèmes d''équations',             'جملة معادلتين',                'Résolution par substitution et par combinaison.', 4),
  ('fonctions',         'Fonctions linéaires et affines',    'الدوال الخطية والتآلفية',      'Représentation graphique, coefficient directeur.', 5),
  ('statistiques',      'Statistiques',                      'الإحصاء',                      'Moyenne pondérée, médiane et étendue.', 6),
  ('thales',            'Théorème de Thalès',                'مبرهنة طالس',                  'Configuration de Thalès, agrandissement et réduction.', 7),
  ('pythagore',         'Propriété de Pythagore',            'خاصية فيثاغورث',               'Calculer une longueur dans un triangle rectangle.', 8),
  ('trigonometrie',     'Trigonométrie',                     'حساب المثلثات',                'Cosinus, sinus et tangente d''un angle aigu.', 9),
  ('geometrie-espace',  'Géométrie dans l''espace',          'الهندسة في الفضاء',            'Pyramide, cône, sphère — aires et volumes.', 10)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Physique ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('phenomenes-electriques', 'Phénomènes électriques',      'الظواهر الكهربائية',  'Tension, intensité, loi d''Ohm, sécurité électrique.', 1),
  ('phenomenes-lumineux',    'Phénomènes lumineux',         'الظواهر الضوئية',     'Propagation, réflexion, lentilles et images.', 2),
  ('phenomenes-mecaniques',  'Phénomènes mécaniques',       'الظواهر الميكانيكية', 'Mouvement, vitesse, forces et équilibre.', 3),
  ('matiere-transformations','Matière et transformations',  'المادة وتحولاتها',    'Réactions chimiques, combustions, atomes et ions.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'physique'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM SVT ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('coordination-nerveuse',  'La coordination nerveuse',    'التنسيق العصبي',      'Neurones, message nerveux et réflexes.', 1),
  ('coordination-hormonale', 'La coordination hormonale',   'التنسيق الهرموني',    'Glandes, hormones et régulation.', 2),
  ('immunite',               'L''immunité',                 'المناعة',             'Défenses de l''organisme, vaccination.', 3),
  ('genetique',              'La transmission des caractères','وراثة الصفات',      'Chromosomes, gènes et hérédité.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'svt'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Français ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-argumentatif', 'Le texte argumentatif',        'النص الحجاجي',        'Thèse, arguments et exemples — argumenter à l''écrit.', 1),
  ('grammaire',          'Grammaire — subordonnées',     'القواعد',             'Subordonnées relatives, complétives et circonstancielles.', 2),
  ('conjugaison',        'Conjugaison',                  'التصريف',             'Subjonctif présent, conditionnel et concordance.', 3),
  ('vocabulaire',        'Vocabulaire de l''argumentation','مفردات الحجاج',     'Connecteurs logiques et verbes d''opinion.', 4),
  ('production-ecrite',  'Production écrite',            'الإنتاج الكتابي',     'Rédiger un texte argumentatif structuré (sujet BEM).', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('textes',            'Textes et compréhension',  'النصوص الأدبية وفهم المكتوب', 'Étude de textes littéraires et documentaires.', 1),
  ('grammaire',         'Grammaire (نحو)',          'القواعد النحوية',             'Les fonctions, l''i''rab et la phrase complexe.', 2),
  ('conjugaison',       'Morphologie (صرف)',        'الصرف والتحويل',              'Dérivation, formes verbales et transformation.', 3),
  ('expression-ecrite', 'Expression écrite',        'التعبير الكتابي',             'Techniques de rédaction (sujet BEM).', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Anglais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('people-experiences', 'People and experiences',  'الأشخاص والتجارب',  'Talking about past experiences and biographies.', 1),
  ('grammar',            'Grammar essentials',      'أساسيات القواعد',   'Tenses, comparatives, conditionals type 1.', 2),
  ('reading',            'Reading comprehension',   'فهم المقروء',       'Reading strategies for the BEM exam.', 3),
  ('writing',            'Writing skills',          'مهارات الكتابة',    'Writing short paragraphs and emails.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'anglais'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Histoire-Géo ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('mouvement-national', 'Le mouvement national algérien',  'الحركة الوطنية الجزائرية', '1919-1954 : naissance et évolution du mouvement national.', 1),
  ('revolution',         'La révolution de 1954',           'الثورة التحريرية الكبرى',  'Déclenchement, organisation et victoire (1954-1962).', 2),
  ('algerie-geographie', 'Géographie de l''Algérie',        'جغرافيا الجزائر',          'Situation, relief, climat et population.', 3),
  ('economie-algerie',   'Économie de l''Algérie',          'اقتصاد الجزائر',           'Ressources, agriculture, industrie et défis.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'histoire-geo'
on conflict (subject_id, slug) do nothing;

-- ---- 1AS Mathématiques (tronc commun) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres',          'Les ensembles de nombres',     'المجموعات العددية',       'N, Z, D, Q, R — intervalles et valeur absolue.', 1),
  ('calcul-litteral',  'Calcul littéral et identités', 'الحساب الحرفي',           'Identités remarquables et factorisation.', 2),
  ('equations',        'Équations et inéquations',     'المعادلات والمتراجحات',   'Premier degré, tableaux de signes.', 3),
  ('fonctions-general','Généralités sur les fonctions','عموميات حول الدوال',      'Domaine, image, courbe représentative, variations.', 4),
  ('fonctions-ref',    'Fonctions de référence',       'الدوال المرجعية',         'Carré, inverse, racine — allures des courbes.', 5),
  ('statistiques',     'Statistiques',                 'الإحصاء',                 'Paramètres de position et de dispersion.', 6),
  ('vecteurs',         'Géométrie vectorielle',        'الهندسة الشعاعية',        'Vecteurs, colinéarité et repères.', 7),
  ('trigonometrie',    'Trigonométrie',                'حساب المثلثات',           'Cercle trigonométrique, sinus et cosinus.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 2AS Mathématiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('second-degre',   'Polynômes et second degré',     'كثيرات الحدود والدرجة الثانية', 'Trinôme, discriminant, factorisation et signe.', 1),
  ('fonctions',      'Étude de fonctions',            'دراسة الدوال',                  'Sens de variation, extremums, représentations.', 2),
  ('suites',         'Suites numériques (initiation)','المتتاليات العددية',            'Suites arithmétiques et géométriques.', 3),
  ('trigonometrie',  'Trigonométrie',                 'حساب المثلثات',                 'Formules et équations trigonométriques.', 4),
  ('geometrie-espace','Géométrie dans l''espace',     'الهندسة في الفضاء',             'Positions relatives, droites et plans.', 5),
  ('probabilites',   'Probabilités (initiation)',     'الاحتمالات',                    'Dénombrement et probabilité d''un événement.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Mathématiques (sciences — année du BAC) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('limites-continuite', 'Limites et continuité',       'النهايات والاستمرارية',   'Limites de fonctions, asymptotes, continuité.', 1),
  ('derivation',         'Dérivation et étude de fonctions','الاشتقاقية ودراسة الدوال', 'Dérivées, variations, extremums, tracé de courbes.', 2),
  ('suites-numeriques',  'Suites numériques',           'المتتاليات العددية',      'Récurrence, limites, suites arithmétiques et géométriques.', 3),
  ('exponentielle',      'Fonction exponentielle',      'الدالة الأسية',           'Propriétés, dérivée, limites et équations.', 4),
  ('logarithme',         'Fonction logarithme',         'الدالة اللوغاريتمية',     'ln x — propriétés algébriques et étude.', 5),
  ('integrales',         'Calcul intégral',             'الحساب التكاملي',         'Primitives, intégrale définie, aires.', 6),
  ('probabilites',       'Probabilités',                'الاحتمالات',              'Conditionnement, indépendance, loi binomiale.', 7),
  ('complexes',          'Nombres complexes',           'الأعداد المركبة',         'Forme algébrique, module, argument, forme exponentielle.', 8),
  ('geometrie-espace',   'Géométrie dans l''espace',    'الهندسة في الفضاء',       'Droites, plans, produit scalaire dans l''espace.', 9)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Physique ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('cinetique',        'Suivi temporel d''une réaction', 'المتابعة الزمنية لتحول كيميائي', 'Vitesse de réaction, facteurs cinétiques, temps de demi-réaction.', 1),
  ('mecanique',        'Évolution d''un système mécanique','تطور جملة ميكانيكية',          'Lois de Newton, chute libre, mouvements plans.', 2),
  ('electricite',      'Dipôles RC et RL',               'الظواهر الكهربائية RC وRL',      'Charge du condensateur, établissement du courant.', 3),
  ('nucleaire',        'Transformations nucléaires',     'التحولات النووية',               'Radioactivité, décroissance, datation, E = mc².', 4),
  ('equilibre-chimique','Équilibre chimique',            'التحولات الكيميائية غير التامة', 'Quotient de réaction, constante d''équilibre.', 5),
  ('controle-evolution','Contrôle de l''évolution',      'التطورات المرتقبة لجملة كيميائية','Estérification, piles et électrolyse.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'physique'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS SVT ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('gene-proteine',   'Du gène à la protéine',           'العلاقة بين المورثات والبروتينات', 'Transcription, traduction, code génétique.', 1),
  ('enzymes',         'Activité enzymatique',            'النشاط الأنزيمي للبروتينات',       'Spécificité enzymatique, complexe enzyme-substrat.', 2),
  ('energie',         'Conversion de l''énergie',        'تحويل الطاقة',                     'Respiration, fermentation, photosynthèse, ATP.', 3),
  ('communication-nerveuse','La communication nerveuse', 'الاتصال العصبي',                   'Potentiel d''action, synapse, intégration.', 4),
  ('immunite',        'L''immunité — soi et non-soi',    'المناعة — الذات واللاذات',         'Réponse immunitaire, LB, LT, vaccination.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'svt'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Philosophie ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('probleme-philosophique','Le problème philosophique', 'الإشكالية الفلسفية',  'La question philosophique et la démarche de réflexion.', 1),
  ('science-verite',        'La science et la vérité',   'العلم والحقيقة',      'Les mathématiques, les sciences expérimentales et la vérité.', 2),
  ('liberte',               'La liberté et la responsabilité','الحرية والمسؤولية','Déterminisme, libre arbitre et responsabilité morale.', 3),
  ('justice-etat',          'La justice et l''État',     'العدالة والدولة',     'Le droit, la justice sociale et le rôle de l''État.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'philosophie'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Français ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-historique', 'Projet 1 · Le texte historique', 'النص التاريخي',  'Documents et témoignages — l''Histoire au BAC.', 1),
  ('debat-idees',      'Projet 2 · Le débat d''idées',   'مناقشة الأفكار', 'Argumenter, réfuter et concéder.', 2),
  ('appel',            'Projet 3 · L''appel',            'نص النداء',      'Le texte exhortatif — lancer un appel.', 3),
  ('techniques-bac',   'Techniques de l''épreuve',       'منهجية الاختبار','Compte rendu, synthèse et production écrite au BAC.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Anglais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('ethics',    'Ethics in business',        'أخلاقيات الأعمال', 'Unit 1 — corruption, counterfeiting and business ethics.', 1),
  ('safety',    'Safety first',              'السلامة أولاً',    'Unit 2 — food safety and consumer protection.', 2),
  ('astronomy', 'Astronomy and the solar system','علم الفلك',    'Unit 3 — space exploration and the solar system.', 3),
  ('feelings',  'Feelings and emotions',     'المشاعر والعواطف', 'Unit 4 — expressing feelings, arts and music.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'anglais'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('adab-hadith',  'Littérature moderne',   'الأدب العربي الحديث',  'Poésie et prose de la Nahda à nos jours.', 1),
  ('qawaid',       'Grammaire et i''rab',   'القواعد والإعراب',     'Analyse grammaticale des textes du programme.', 2),
  ('balagha-naqd', 'Rhétorique et critique','البلاغة والنقد الأدبي','Figures de style et critique littéraire.', 3),
  ('taabir',       'Expression écrite',     'التعبير الكتابي',      'Méthodologie de la production écrite au BAC.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ===== 4. Lesson content for flagship chapters =====

update public.chapters c set
  lesson_fr = 'UNE FRACTION, C''EST QUOI ?

Une fraction représente une partie d''un tout. Dans la fraction 3/4 :
• 3 est le NUMÉRATEUR — le nombre de parts que l''on prend.
• 4 est le DÉNOMINATEUR — le nombre de parts égales du tout.

Exemple : une pizza coupée en 4 parts égales. Si tu manges 3 parts, tu as mangé 3/4 de la pizza.

COMPARER DES FRACTIONS
• Même dénominateur → la plus grande est celle qui a le plus grand numérateur : 5/8 > 3/8.
• Une fraction égale à 1 → numérateur = dénominateur : 4/4 = 1.
• Plus le dénominateur est grand (à numérateur égal), plus la part est petite : 1/8 < 1/4.

ADDITIONNER (même dénominateur)
On additionne les numérateurs, le dénominateur ne change pas :
2/6 + 3/6 = 5/6.

À RETENIR : le dénominateur indique en combien de parts on coupe, le numérateur combien on en prend.',
  lesson_ar = 'ما هو الكسر؟

الكسر يمثل جزءًا من كل. في الكسر 3/4:
• 3 هو البسط — عدد الأجزاء التي نأخذها.
• 4 هو المقام — عدد الأجزاء المتساوية للكل.

مثال: بيتزا مقسومة إلى 4 أجزاء متساوية. إذا أكلت 3 أجزاء، فقد أكلت 3/4 من البيتزا.

مقارنة الكسور
• نفس المقام ← الأكبر هو صاحب البسط الأكبر: 5/8 > 3/8.
• الكسر يساوي 1 عندما يتساوى البسط والمقام: 4/4 = 1.

جمع الكسور (نفس المقام)
نجمع البسطين ويبقى المقام نفسه: 2/6 + 3/6 = 5/6.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'fractions';

update public.chapters c set
  lesson_fr = 'LA PROPRIÉTÉ DE PYTHAGORE

Dans un triangle RECTANGLE, le carré de l''hypoténuse est égal à la somme des carrés des deux autres côtés.

Si ABC est rectangle en A :  BC² = AB² + AC²

(BC est l''hypoténuse — le côté le plus long, opposé à l''angle droit.)

CALCULER L''HYPOTÉNUSE
AB = 3 cm, AC = 4 cm.
BC² = 3² + 4² = 9 + 16 = 25, donc BC = √25 = 5 cm.

CALCULER UN AUTRE CÔTÉ
BC = 13 cm, AB = 5 cm.
AC² = BC² − AB² = 169 − 25 = 144, donc AC = 12 cm.

LA RÉCIPROQUE
Si BC² = AB² + AC², alors le triangle est rectangle en A. Sinon, il n''est pas rectangle.

À RETENIR : Pythagore ne s''applique QUE dans un triangle rectangle, et l''hypoténuse est toujours en face de l''angle droit.',
  lesson_ar = 'خاصية فيثاغورث

في المثلث القائم، مربع الوتر يساوي مجموع مربعي الضلعين الآخرين.

إذا كان ABC قائمًا في A:  BC² = AB² + AC²

(BC هو الوتر — الضلع الأطول المقابل للزاوية القائمة.)

حساب الوتر
AB = 3 سم، AC = 4 سم.
BC² = 9 + 16 = 25، إذن BC = 5 سم.

حساب ضلع آخر
BC = 13 سم، AB = 5 سم.
AC² = 169 − 25 = 144، إذن AC = 12 سم.

العكس: إذا تحققت العلاقة فالمثلث قائم، وإلا فهو غير قائم.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'pythagore';

update public.chapters c set
  lesson_fr = 'LES NOMBRES RATIONNELS

Un nombre rationnel est un nombre qui peut s''écrire sous la forme a/b où a et b sont des entiers (b ≠ 0).
Exemples : 3/4 ; −5/2 ; 7 (= 7/1) ; 0,25 (= 1/4).

RÈGLES DES SIGNES (multiplication et division)
• (+) × (+) = (+)    • (−) × (−) = (+)
• (+) × (−) = (−)    • (−) × (+) = (−)

ADDITION DE FRACTIONS
Mettre au même dénominateur d''abord :
1/3 + 1/4 = 4/12 + 3/12 = 7/12.

MULTIPLICATION
On multiplie les numérateurs entre eux et les dénominateurs entre eux :
2/3 × 5/7 = 10/21.

DIVISION
Diviser par une fraction = multiplier par son inverse :
2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.

PRIORITÉS DE CALCUL : parenthèses → puissances → × et ÷ → + et −.',
  lesson_ar = 'الأعداد الناطقة

العدد الناطق هو كل عدد يمكن كتابته على شكل a/b حيث a وb عددان صحيحان (b ≠ 0).
أمثلة: 3/4 ؛ −5/2 ؛ 7 ؛ 0.25.

قاعدة الإشارات (الضرب والقسمة)
• (+) × (+) = (+)    • (−) × (−) = (+)
• (+) × (−) = (−)

جمع الكسور: نوحّد المقامات أولاً:
1/3 + 1/4 = 4/12 + 3/12 = 7/12.

الضرب: نضرب البسط في البسط والمقام في المقام.
القسمة: القسمة على كسر = الضرب في مقلوبه.

أولويات الحساب: الأقواس ← القوى ← الضرب والقسمة ← الجمع والطرح.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'rationnels';

update public.chapters c set
  lesson_fr = 'LES SUITES NUMÉRIQUES

Une suite (Un) associe à chaque entier naturel n un nombre réel Un.

SUITE ARITHMÉTIQUE (raison r)
Chaque terme s''obtient en AJOUTANT r :  U(n+1) = Un + r
Terme général : Un = U0 + n·r
Somme : U0 + U1 + … + Un = (n+1)(U0 + Un)/2

SUITE GÉOMÉTRIQUE (raison q)
Chaque terme s''obtient en MULTIPLIANT par q :  U(n+1) = q·Un
Terme général : Un = U0 · qⁿ
Somme : U0 · (1 − qⁿ⁺¹)/(1 − q)  (q ≠ 1)

LIMITES
• Si −1 < q < 1 alors qⁿ → 0.
• Si q > 1 alors qⁿ → +∞.

RAISONNEMENT PAR RÉCURRENCE
Pour prouver qu''une propriété P(n) est vraie pour tout n :
1. INITIALISATION : vérifier P(0).
2. HÉRÉDITÉ : supposer P(n) vraie, montrer P(n+1).
3. CONCLUSION : P(n) est vraie pour tout n.',
  lesson_ar = 'المتتاليات العددية

المتتالية (Un) تربط كل عدد طبيعي n بعدد حقيقي Un.

المتتالية الحسابية (الأساس r)
كل حد يُحصل عليه بإضافة r:  U(n+1) = Un + r
الحد العام: Un = U0 + n·r

المتتالية الهندسية (الأساس q)
كل حد يُحصل عليه بالضرب في q:  U(n+1) = q·Un
الحد العام: Un = U0 · qⁿ

النهايات
• إذا كان −1 < q < 1 فإن qⁿ → 0.
• إذا كان q > 1 فإن qⁿ → +∞.

البرهان بالتراجع: التحقق من P(0)، ثم افتراض P(n) وإثبات P(n+1)، ثم الاستنتاج.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'suites-numeriques';

update public.chapters c set
  lesson_fr = 'LES ÉQUATIONS DU PREMIER DEGRÉ

Une équation est une égalité contenant une inconnue (souvent x).
Résoudre = trouver la valeur de x qui rend l''égalité vraie.

MÉTHODE
1. Développer et réduire chaque membre.
2. Regrouper les x d''un côté, les nombres de l''autre (en changeant de signe quand on change de côté).
3. Diviser par le coefficient de x.

EXEMPLE
5x − 7 = 2x + 8
5x − 2x = 8 + 7
3x = 15
x = 5      Vérification : 5×5−7 = 18 et 2×5+8 = 18 ✓

MISE EN ÉQUATION D''UN PROBLÈME
« Ahmed a 3 fois l''âge de son frère. À eux deux ils ont 48 ans. »
Soit x l''âge du frère : x + 3x = 48 → 4x = 48 → x = 12.
Le frère a 12 ans, Ahmed a 36 ans.',
  lesson_ar = 'المعادلات من الدرجة الأولى

المعادلة هي مساواة تحتوي على مجهول (غالبًا x).
حل المعادلة = إيجاد قيمة x التي تجعل المساواة صحيحة.

الطريقة
1. ننشر ونختزل كل طرف.
2. نجمع حدود x في طرف والأعداد في الطرف الآخر (مع تغيير الإشارة عند تغيير الطرف).
3. نقسم على معامل x.

مثال
5x − 7 = 2x + 8
3x = 15
x = 5      التحقق: 5×5−7 = 18 و 2×5+8 = 18 ✓'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AM' and s.slug = 'mathematiques' and c.slug = 'equations';

-- ===== 5. Quiz questions for flagship chapters =====

-- 5AP maths / fractions
insert into public.quiz_questions
  (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.p_fr, v.p_ar, v.o_fr::jsonb, v.o_ar::jsonb, v.ci, v.e_fr, v.e_ar, v.diff, v.ord
from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une pizza est coupée en 8 parts égales. Tu manges 3 parts. Quelle fraction as-tu mangée ?',
   'قُسمت بيتزا إلى 8 أجزاء متساوية. أكلتَ 3 أجزاء. ما الكسر الذي أكلته؟',
   '["3/8","8/3","3/5","5/8"]', '["3/8","8/3","3/5","5/8"]', 0,
   'On prend 3 parts sur 8 parts égales : 3/8.', 'أخذنا 3 أجزاء من 8 أجزاء متساوية: 3/8.', 'easy', 1),
  ('Quelle fraction est égale à 1 ?',
   'أي كسر يساوي 1؟',
   '["4/4","1/4","4/1","2/4"]', '["4/4","1/4","4/1","2/4"]', 0,
   'Quand le numérateur égale le dénominateur, la fraction vaut 1.', 'عندما يتساوى البسط والمقام، يساوي الكسر 1.', 'easy', 2),
  ('Compare : 5/8 … 3/8',
   'قارن: 5/8 … 3/8',
   '["5/8 > 3/8","5/8 < 3/8","5/8 = 3/8","On ne peut pas comparer"]',
   '["5/8 > 3/8","5/8 < 3/8","5/8 = 3/8","لا يمكن المقارنة"]', 0,
   'Même dénominateur : on compare les numérateurs. 5 > 3.', 'نفس المقام: نقارن البسطين. 5 > 3.', 'easy', 3),
  ('Calcule : 2/6 + 3/6',
   'احسب: 2/6 + 3/6',
   '["5/6","5/12","6/6","1/6"]', '["5/6","5/12","6/6","1/6"]', 0,
   'Même dénominateur : on additionne les numérateurs. 2+3 = 5, donc 5/6.', 'نفس المقام: نجمع البسطين. 2+3 = 5، إذن 5/6.', 'medium', 4),
  ('Quelle est la moitié de 1/2 ?',
   'ما هو نصف 1/2؟',
   '["1/4","1/3","2/2","1/8"]', '["1/4","1/3","2/2","1/8"]', 0,
   'La moitié de 1/2 est 1/4 : on coupe la moitié en deux.', 'نصف 1/2 هو 1/4: نقسم النصف إلى جزأين.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'fractions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 4AM maths / pythagore
insert into public.quiz_questions
  (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.p_fr, v.p_ar, v.o_fr::jsonb, v.o_ar::jsonb, v.ci, v.e_fr, v.e_ar, v.diff, v.ord
from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('ABC est rectangle en A avec AB = 3 cm et AC = 4 cm. Que vaut BC ?',
   'ABC قائم في A حيث AB = 3 سم و AC = 4 سم. كم يساوي BC؟',
   '["5 cm","7 cm","25 cm","6 cm"]', '["5 سم","7 سم","25 سم","6 سم"]', 0,
   'BC² = 3² + 4² = 9 + 16 = 25, donc BC = √25 = 5 cm.', 'BC² = 9 + 16 = 25، إذن BC = 5 سم.', 'easy', 1),
  ('Dans un triangle rectangle, l''hypoténuse est…',
   'في المثلث القائم، الوتر هو…',
   '["le côté opposé à l''angle droit","le plus petit côté","un côté de l''angle droit","la hauteur"]',
   '["الضلع المقابل للزاوية القائمة","أصغر ضلع","ضلع الزاوية القائمة","الارتفاع"]', 0,
   'L''hypoténuse est le côté le plus long, face à l''angle droit.', 'الوتر هو الضلع الأطول المقابل للزاوية القائمة.', 'easy', 2),
  ('ABC est rectangle en A. BC = 13 cm, AB = 5 cm. Que vaut AC ?',
   'ABC قائم في A. BC = 13 سم و AB = 5 سم. كم يساوي AC؟',
   '["12 cm","8 cm","18 cm","144 cm"]', '["12 سم","8 سم","18 سم","144 سم"]', 0,
   'AC² = BC² − AB² = 169 − 25 = 144, donc AC = 12 cm.', 'AC² = 169 − 25 = 144، إذن AC = 12 سم.', 'medium', 3),
  ('Un triangle a des côtés de 6, 8 et 10 cm. Est-il rectangle ?',
   'مثلث أضلاعه 6 و8 و10 سم. هل هو قائم؟',
   '["Oui, car 6² + 8² = 10²","Non","Oui, car 6 + 8 > 10","On ne peut pas savoir"]',
   '["نعم، لأن 6² + 8² = 10²","لا","نعم، لأن 6 + 8 > 10","لا يمكن المعرفة"]', 0,
   '36 + 64 = 100 = 10². La réciproque de Pythagore s''applique.', '36 + 64 = 100 = 10². حسب عكس خاصية فيثاغورث.', 'medium', 4),
  ('Une échelle de 5 m est posée contre un mur, son pied à 3 m du mur. À quelle hauteur touche-t-elle le mur ?',
   'سلم طوله 5 أمتار مستند إلى جدار، قاعدته على بعد 3 أمتار. على أي ارتفاع يلمس الجدار؟',
   '["4 m","2 m","5,8 m","3,5 m"]', '["4 م","2 م","5.8 م","3.5 م"]', 0,
   'h² = 5² − 3² = 25 − 9 = 16, donc h = 4 m.', 'h² = 25 − 9 = 16، إذن h = 4 م.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'pythagore'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 4AM maths / rationnels
insert into public.quiz_questions
  (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.p_fr, v.p_ar, v.o_fr::jsonb, v.o_ar::jsonb, v.ci, v.e_fr, v.e_ar, v.diff, v.ord
from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : (−3) × (−5)',
   'احسب: (−3) × (−5)',
   '["15","−15","−8","8"]', '["15","−15","−8","8"]', 0,
   'Moins par moins donne plus : (−3)×(−5) = +15.', 'سالب في سالب يعطي موجبًا: 15+.', 'easy', 1),
  ('Calcule : 1/3 + 1/4',
   'احسب: 1/3 + 1/4',
   '["7/12","2/7","1/7","2/12"]', '["7/12","2/7","1/7","2/12"]', 0,
   'Même dénominateur 12 : 4/12 + 3/12 = 7/12.', 'نوحد المقام 12: 4/12 + 3/12 = 7/12.', 'medium', 2),
  ('Calcule : 2/3 ÷ 4/5',
   'احسب: 2/3 ÷ 4/5',
   '["5/6","8/15","10/12","3/10"]', '["5/6","8/15","10/12","3/10"]', 0,
   'Diviser = multiplier par l''inverse : 2/3 × 5/4 = 10/12 = 5/6.', 'القسمة = الضرب في المقلوب: 2/3 × 5/4 = 5/6.', 'medium', 3),
  ('Quelle est l''écriture décimale de 3/4 ?',
   'ما الكتابة العشرية للكسر 3/4؟',
   '["0,75","0,34","1,33","0,25"]', '["0.75","0.34","1.33","0.25"]', 0,
   '3 ÷ 4 = 0,75.', '3 ÷ 4 = 0.75.', 'easy', 4),
  ('Calcule : 5 − 3 × (−2)',
   'احسب: 5 − 3 × (−2)',
   '["11","4","−1","16"]', '["11","4","−1","16"]', 0,
   'La multiplication d''abord : 3×(−2) = −6, puis 5−(−6) = 11.', 'الضرب أولاً: 3×(−2) = −6، ثم 5−(−6) = 11.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'rationnels'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 3AM maths / equations
insert into public.quiz_questions
  (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.p_fr, v.p_ar, v.o_fr::jsonb, v.o_ar::jsonb, v.ci, v.e_fr, v.e_ar, v.diff, v.ord
from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Résous : x + 7 = 12',
   'حل: x + 7 = 12',
   '["x = 5","x = 19","x = −5","x = 7"]', '["x = 5","x = 19","x = −5","x = 7"]', 0,
   'x = 12 − 7 = 5.', 'x = 12 − 7 = 5.', 'easy', 1),
  ('Résous : 3x = 21',
   'حل: 3x = 21',
   '["x = 7","x = 18","x = 63","x = 24"]', '["x = 7","x = 18","x = 63","x = 24"]', 0,
   'x = 21 ÷ 3 = 7.', 'x = 21 ÷ 3 = 7.', 'easy', 2),
  ('Résous : 5x − 7 = 2x + 8',
   'حل: 5x − 7 = 2x + 8',
   '["x = 5","x = 3","x = 15","x = 1"]', '["x = 5","x = 3","x = 15","x = 1"]', 0,
   '5x − 2x = 8 + 7 → 3x = 15 → x = 5.', '5x − 2x = 8 + 7 ← 3x = 15 ← x = 5.', 'medium', 3),
  ('Ahmed a 3 fois l''âge de son frère. Ensemble ils ont 48 ans. Quel âge a le frère ?',
   'عمر أحمد 3 أضعاف عمر أخيه. مجموع عمريهما 48 سنة. كم عمر الأخ؟',
   '["12 ans","16 ans","36 ans","24 ans"]', '["12 سنة","16 سنة","36 سنة","24 سنة"]', 0,
   'x + 3x = 48 → 4x = 48 → x = 12.', 'x + 3x = 48 ← 4x = 48 ← x = 12.', 'medium', 4),
  ('Résous : 2(x − 3) = 10',
   'حل: 2(x − 3) = 10',
   '["x = 8","x = 5","x = 2","x = 13"]', '["x = 8","x = 5","x = 2","x = 13"]', 0,
   '2x − 6 = 10 → 2x = 16 → x = 8.', '2x − 6 = 10 ← 2x = 16 ← x = 8.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AM' and s.slug = 'mathematiques' and c.slug = 'equations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 3AS maths / suites-numeriques
insert into public.quiz_questions
  (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.p_fr, v.p_ar, v.o_fr::jsonb, v.o_ar::jsonb, v.ci, v.e_fr, v.e_ar, v.diff, v.ord
from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('(Un) est arithmétique avec U0 = 3 et r = 4. Que vaut U5 ?',
   '(Un) حسابية حيث U0 = 3 و r = 4. كم يساوي U5؟',
   '["23","20","27","35"]', '["23","20","27","35"]', 0,
   'Un = U0 + n·r → U5 = 3 + 5×4 = 23.', 'Un = U0 + n·r ← U5 = 3 + 20 = 23.', 'easy', 1),
  ('(Vn) est géométrique avec V0 = 2 et q = 3. Que vaut V3 ?',
   '(Vn) هندسية حيث V0 = 2 و q = 3. كم يساوي V3؟',
   '["54","18","24","6"]', '["54","18","24","6"]', 0,
   'Vn = V0·qⁿ → V3 = 2×27 = 54.', 'Vn = V0·qⁿ ← V3 = 2×27 = 54.', 'easy', 2),
  ('Si 0 < q < 1, alors la limite de qⁿ quand n → +∞ est…',
   'إذا كان 0 < q < 1 فإن نهاية qⁿ لما n → +∞ هي…',
   '["0","+∞","1","q"]', '["0","+∞","1","q"]', 0,
   'Une puissance d''un nombre entre 0 et 1 tend vers 0.', 'قوة عدد محصور بين 0 و1 تؤول إلى 0.', 'medium', 3),
  ('La somme 1 + 2 + 3 + … + 100 vaut…',
   'المجموع 1 + 2 + 3 + … + 100 يساوي…',
   '["5050","10100","5000","4950"]', '["5050","10100","5000","4950"]', 0,
   'S = n(n+1)/2 = 100×101/2 = 5050.', 'S = n(n+1)/2 = 100×101/2 = 5050.', 'medium', 4),
  ('Une suite définie par U(n+1) = Un + 5 est…',
   'المتتالية المعرفة بـ U(n+1) = Un + 5 هي…',
   '["arithmétique de raison 5","géométrique de raison 5","ni l''une ni l''autre","constante"]',
   '["حسابية أساسها 5","هندسية أساسها 5","لا هذه ولا تلك","ثابتة"]', 0,
   'On ajoute toujours le même nombre : suite arithmétique de raison 5.', 'نضيف دائمًا نفس العدد: متتالية حسابية أساسها 5.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'suites-numeriques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
