-- ===============================================================
-- Migration: 20260721_017_full_curriculum_seed
--
-- Full Algerian curriculum skeleton â€” 1AP through 3AS.
-- Sources cross-checked against the official 2nd-generation programs
-- as published on eddirasa.com / dzexams.com (chapter lists per level).
--
-- Adds:
--   1. chapters.lesson_fr / lesson_ar  â€” inline lesson content
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

-- Primaire 1APâ€“2AP: arabic, maths, islamic and civic education
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AP', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 1),
  ('1AP', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 2),
  ('1AP', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 3),
  ('1AP', 'civique',    'Ã‰ducation civique',     'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©',      'flag', 4),
  ('2AP', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 1),
  ('2AP', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 2),
  ('2AP', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 3),
  ('2AP', 'civique',    'Ã‰ducation civique',     'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©',      'flag', 4)
on conflict (grade_code, slug) do nothing;

-- Primaire 3APâ€“4AP: French begins in 3AP, science awareness added
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('3AP', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 1),
  ('3AP', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 2),
  ('3AP', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 3),
  ('3AP', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 4),
  ('3AP', 'civique',    'Ã‰ducation civique',     'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©',      'flag', 5),
  ('3AP', 'sciences',   'Ã‰veil scientifique',    'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¹Ù„Ù…ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ©', 'leaf', 6),
  ('4AP', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 1),
  ('4AP', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 2),
  ('4AP', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 3),
  ('4AP', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 4),
  ('4AP', 'civique',    'Ã‰ducation civique',     'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©',      'flag', 5),
  ('4AP', 'sciences',   'Ã‰veil scientifique',    'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¹Ù„Ù…ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ©', 'leaf', 6),
  ('4AP', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7)
on conflict (grade_code, slug) do nothing;

-- 5AP â€” exam year (fin de cycle primaire)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('5AP', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 1),
  ('5AP', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 2),
  ('5AP', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 3),
  ('5AP', 'anglais',    'Anglais',               'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©',     'globe', 4),
  ('5AP', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 5),
  ('5AP', 'civique',    'Ã‰ducation civique',     'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©',      'flag', 6),
  ('5AP', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7),
  ('5AP', 'sciences',   'Ã‰veil scientifique',    'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¹Ù„Ù…ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ©', 'leaf', 8)
on conflict (grade_code, slug) do nothing;

-- Moyen 1AMâ€“2AM (3AM/4AM core subjects already seeded in migration 003)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AM', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 1),
  ('1AM', 'physique',   'Sciences physiques',    'Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„ÙÙŠØ²ÙŠØ§Ø¦ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§', 'atom', 2),
  ('1AM', 'svt',        'Sciences naturelles',   'Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© ÙˆØ§Ù„Ø­ÙŠØ§Ø©', 'leaf', 3),
  ('1AM', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 4),
  ('1AM', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 5),
  ('1AM', 'anglais',    'Anglais',               'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©',     'globe', 6),
  ('1AM', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7),
  ('1AM', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 8),
  ('2AM', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 1),
  ('2AM', 'physique',   'Sciences physiques',    'Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„ÙÙŠØ²ÙŠØ§Ø¦ÙŠØ© ÙˆØ§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§', 'atom', 2),
  ('2AM', 'svt',        'Sciences naturelles',   'Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© ÙˆØ§Ù„Ø­ÙŠØ§Ø©', 'leaf', 3),
  ('2AM', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 4),
  ('2AM', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 5),
  ('2AM', 'anglais',    'Anglais',               'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©',     'globe', 6),
  ('2AM', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7),
  ('2AM', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 8)
on conflict (grade_code, slug) do nothing;

-- Fill gaps in 3AM / 4AM
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('3AM', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 8),
  ('4AM', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7),
  ('4AM', 'islamique',  'Ã‰ducation islamique',   'Ø§Ù„ØªØ±Ø¨ÙŠØ© Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',    'moon', 8)
on conflict (grade_code, slug) do nothing;

-- Secondaire 1ASâ€“2AS (3AS core subjects already seeded)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AS', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 1),
  ('1AS', 'physique',   'Sciences physiques',    'Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„ÙÙŠØ²ÙŠØ§Ø¦ÙŠØ©',    'atom', 2),
  ('1AS', 'svt',        'Sciences naturelles',   'Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© ÙˆØ§Ù„Ø­ÙŠØ§Ø©', 'leaf', 3),
  ('1AS', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 4),
  ('1AS', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 5),
  ('1AS', 'anglais',    'Anglais',               'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©',     'globe', 6),
  ('1AS', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 7),
  ('1AS', 'informatique', 'Informatique',        'Ø§Ù„Ø¥Ø¹Ù„Ø§Ù… Ø§Ù„Ø¢Ù„ÙŠ',        'cpu', 8),
  ('2AS', 'mathematiques', 'MathÃ©matiques',      'Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª',            'sigma', 1),
  ('2AS', 'physique',   'Sciences physiques',    'Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„ÙÙŠØ²ÙŠØ§Ø¦ÙŠØ©',    'atom', 2),
  ('2AS', 'svt',        'Sciences naturelles',   'Ø¹Ù„ÙˆÙ… Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© ÙˆØ§Ù„Ø­ÙŠØ§Ø©', 'leaf', 3),
  ('2AS', 'arabe',      'Langue arabe',          'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©',        'book-arabic', 4),
  ('2AS', 'francais',   'FranÃ§ais',              'Ø§Ù„Ù„ØºØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',       'book', 5),
  ('2AS', 'anglais',    'Anglais',               'Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©',     'globe', 6),
  ('2AS', 'philosophie','Philosophie',           'Ø§Ù„ÙÙ„Ø³ÙØ©',              'lightbulb', 7),
  ('2AS', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 8),
  ('3AS', 'histoire-geo', 'Histoire-gÃ©ographie', 'Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§',   'map', 8),
  ('3AS', 'islamique',  'Sciences islamiques',   'Ø§Ù„Ø¹Ù„ÙˆÙ… Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ©',     'moon', 9)
on conflict (grade_code, slug) do nothing;

-- ===== 3. Chapters =====
-- Pattern: insert..select joined on (grade_code, slug) so this works
-- regardless of the generated subject UUIDs.

-- ---- 5AP MathÃ©matiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('grands-nombres',   'Les grands nombres',                'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ±Ø©',                'Lire, Ã©crire et comparer les nombres jusqu''aux millions.', 1),
  ('fractions',        'Les fractions',                     'Ø§Ù„ÙƒØ³ÙˆØ±',                          'ReprÃ©senter, comparer et additionner des fractions simples.', 2),
  ('nombres-decimaux', 'Les nombres dÃ©cimaux',              'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠØ©',                'Ã‰criture dÃ©cimale, comparaison et opÃ©rations.', 3),
  ('proportionnalite', 'La proportionnalitÃ©',               'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ©',                       'Tableaux de proportionnalitÃ© et rÃ¨gle de trois.', 4),
  ('mesures',          'Les mesures',                       'Ø§Ù„Ù‚ÙŠØ§Ø³: Ø§Ù„Ø£Ø·ÙˆØ§Ù„ ÙˆØ§Ù„ÙƒØªÙ„ ÙˆØ§Ù„Ø³Ø¹Ø§Øª', 'Longueurs, masses, capacitÃ©s et conversions.', 5),
  ('perimetres-aires', 'PÃ©rimÃ¨tres et aires',               'Ø§Ù„Ù…Ø­ÙŠØ·Ø§Øª ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø§Øª',             'PÃ©rimÃ¨tre et aire du carrÃ©, rectangle et triangle.', 6),
  ('geometrie',        'Figures et solides',                'Ø§Ù„Ø£Ø´ÙƒØ§Ù„ Ø§Ù„Ù‡Ù†Ø¯Ø³ÙŠØ© ÙˆØ§Ù„Ù…Ø¬Ø³Ù…Ø§Øª',     'Polygones, cercle, cube, pavÃ© droit.', 7),
  ('problemes',        'RÃ©solution de problÃ¨mes',           'Ø­Ù„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø§Øª',                    'DÃ©marches pour rÃ©soudre des problÃ¨mes de la vie courante.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 5AP Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('comprehension-oral',  'ComprÃ©hension de l''oral',   'ÙÙ‡Ù… Ø§Ù„Ù…Ù†Ø·ÙˆÙ‚ ÙˆØ§Ù„ØªØ¹Ø¨ÙŠØ± Ø§Ù„Ø´ÙÙˆÙŠ', 'Ã‰couter, comprendre et restituer un texte oral.', 1),
  ('lecture',             'Lecture et comprÃ©hension',   'Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© ÙˆÙÙ‡Ù… Ø§Ù„Ù…ÙƒØªÙˆØ¨',        'Lire couramment et comprendre des textes variÃ©s.', 2),
  ('grammaire',           'Grammaire (Ù†Ø­Ùˆ)',            'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„Ù†Ø­ÙˆÙŠØ©',             'La phrase nominale et verbale, les complÃ©ments.', 3),
  ('conjugaison',         'Morphologie (ØµØ±Ù)',          'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„ØµØ±ÙÙŠØ©',             'Conjugaison des verbes au passÃ©, prÃ©sent et impÃ©ratif.', 4),
  ('orthographe',         'Orthographe (Ø¥Ù…Ù„Ø§Ø¡)',        'Ø§Ù„Ø¥Ù…Ù„Ø§Ø¡',                     'Hamza, ta marbouta et rÃ¨gles d''Ã©criture.', 5),
  ('production-ecrite',   'Production Ã©crite',          'Ø§Ù„Ø¥Ù†ØªØ§Ø¬ Ø§Ù„ÙƒØªØ§Ø¨ÙŠ',             'RÃ©diger des textes courts structurÃ©s.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ---- 5AP FranÃ§ais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-documentaire', 'Projet 1 Â· Le texte documentaire', 'Ø§Ù„Ù†Øµ Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ÙŠ',    'Lire et produire un texte qui informe.', 1),
  ('conte',              'Projet 2 Â· Le conte',              'Ø§Ù„Ù†Øµ Ø§Ù„Ø³Ø±Ø¯ÙŠ',      'Lire et raconter une histoire (schÃ©ma narratif).', 2),
  ('texte-explicatif',   'Projet 3 Â· Le texte explicatif',   'Ø§Ù„Ù†Øµ Ø§Ù„ØªÙØ³ÙŠØ±ÙŠ',    'Comprendre et produire un texte qui explique.', 3),
  ('grammaire',          'Grammaire',                        'Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯',          'La phrase, ses types et ses constituants.', 4),
  ('conjugaison',        'Conjugaison',                      'Ø§Ù„ØªØµØ±ÙŠÙ',          'PrÃ©sent, passÃ© composÃ© et futur des verbes usuels.', 5),
  ('orthographe-vocab',  'Orthographe et vocabulaire',       'Ø§Ù„Ø¥Ù…Ù„Ø§Ø¡ ÙˆØ§Ù„Ù…ÙØ±Ø¯Ø§Øª','Accords, homophones et enrichissement du lexique.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '5AP' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 1AM MathÃ©matiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('entiers-decimaux', 'Nombres entiers et dÃ©cimaux',   'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ© ÙˆØ§Ù„Ø¹Ø´Ø±ÙŠØ©', 'Lecture, Ã©criture, comparaison et repÃ©rage.', 1),
  ('operations',       'OpÃ©rations',                    'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯',       'Addition, soustraction, multiplication, division.', 2),
  ('fractions',        'Fractions',                     'Ø§Ù„ÙƒØ³ÙˆØ±',                     'Sens de la fraction, comparaison, opÃ©rations simples.', 3),
  ('relatifs',         'Nombres relatifs',              'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©',            'DÃ©couverte des nombres nÃ©gatifs et repÃ©rage.', 4),
  ('proportionnalite', 'ProportionnalitÃ©',              'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ©',                  'Situations proportionnelles et pourcentages.', 5),
  ('droites-angles',   'Droites et angles',             'Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª ÙˆØ§Ù„Ø²ÙˆØ§ÙŠØ§',        'ParallÃ¨les, perpendiculaires, mesure d''angles.', 6),
  ('triangles-quadri', 'Triangles et quadrilatÃ¨res',    'Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª ÙˆØ§Ù„Ø±Ø¨Ø§Ø¹ÙŠØ§Øª',        'Construction et propriÃ©tÃ©s des figures usuelles.', 7),
  ('aires-perimetres', 'Aires et pÃ©rimÃ¨tres',           'Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª ÙˆØ§Ù„Ù…Ø­ÙŠØ·Ø§Øª',         'Calculs d''aires et de pÃ©rimÃ¨tres.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 2AM MathÃ©matiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('relatifs-operations', 'Nombres relatifs â€” opÃ©rations', 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©', 'Addition, soustraction et multiplication des relatifs.', 1),
  ('fractions-operations','Fractions â€” opÃ©rations',        'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„ÙƒØ³ÙˆØ±',          'Somme, diffÃ©rence et produit de fractions.', 2),
  ('calcul-litteral',     'Calcul littÃ©ral (initiation)',  'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ',                'Expressions littÃ©rales, rÃ©duction et distributivitÃ©.', 3),
  ('proportionnalite',    'ProportionnalitÃ© et pourcentages','Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ© ÙˆØ§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø¦ÙˆÙŠØ©',   'Ã‰chelle, vitesse moyenne, pourcentages.', 4),
  ('symetrie-centrale',   'SymÃ©trie centrale',             'Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ',              'Construction du symÃ©trique d''une figure par rapport Ã  un point.', 5),
  ('angles-parallelisme', 'Angles et parallÃ©lisme',        'Ø§Ù„Ø²ÙˆØ§ÙŠØ§ ÙˆØ§Ù„ØªÙˆØ§Ø²ÙŠ',             'Angles alternes-internes et correspondants.', 6),
  ('triangles',           'Triangles â€” droites remarquables','Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª ÙˆØ§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª Ø§Ù„Ø®Ø§ØµØ©','MÃ©diatrices, hauteurs, mÃ©dianes et bissectrices.', 7),
  ('statistiques',        'Statistiques (initiation)',     'Ø§Ù„Ø¥Ø­ØµØ§Ø¡',                      'Effectifs, frÃ©quences et diagrammes.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AM MathÃ©matiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('rationnels',       'Nombres rationnels â€” opÃ©rations', 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø§Ø·Ù‚Ø©', 'Quotients, Ã©critures fractionnaires et calculs.', 1),
  ('puissances',       'Puissances',                      'Ø§Ù„Ù‚ÙˆÙ‰',                        'Puissances d''exposant entier, notation scientifique.', 2),
  ('calcul-litteral',  'Calcul littÃ©ral',                 'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ',                'DÃ©veloppement, factorisation, distributivitÃ© double.', 3),
  ('equations',        'Ã‰quations du 1er degrÃ©',          'Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª Ù…Ù† Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰',   'Mise en Ã©quation et rÃ©solution de problÃ¨mes.', 4),
  ('proportionnalite', 'ProportionnalitÃ© et vitesse',     'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ© ÙˆØ§Ù„Ø³Ø±Ø¹Ø©',            'Vitesse moyenne, Ã©chelles et grandeurs composÃ©es.', 5),
  ('statistiques',     'Statistiques',                    'Ø§Ù„Ø¥Ø­ØµØ§Ø¡',                      'Moyennes, frÃ©quences et reprÃ©sentations graphiques.', 6),
  ('droites-triangle', 'Droites remarquables du triangle','Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª Ø§Ù„Ø®Ø§ØµØ© ÙÙŠ Ø§Ù„Ù…Ø«Ù„Ø«',  'MÃ©diatrices, mÃ©dianes, hauteurs et cercle circonscrit.', 7),
  ('cercle-triangle',  'Cercle et triangle rectangle',    'Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© ÙˆØ§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù‚Ø§Ø¦Ù…',       'Triangle rectangle inscrit dans un demi-cercle.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM MathÃ©matiques (annÃ©e du BEM) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('rationnels',        'Nombres rationnels',                'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø§Ø·Ù‚Ø©',              'Calculs sur les rationnels, prioritÃ©s et simplifications.', 1),
  ('calcul-litteral',   'Calcul littÃ©ral et identitÃ©s',      'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ ÙˆØ§Ù„Ù…ØªØ·Ø§Ø¨Ù‚Ø§Øª Ø§Ù„Ø´Ù‡ÙŠØ±Ø©', 'DÃ©veloppement, factorisation, identitÃ©s remarquables.', 2),
  ('equations',         'Ã‰quations et inÃ©quations',          'Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª ÙˆØ§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø§Øª',        'RÃ©solution d''Ã©quations et d''inÃ©quations du 1er degrÃ©.', 3),
  ('systemes',          'SystÃ¨mes d''Ã©quations',             'Ø¬Ù…Ù„Ø© Ù…Ø¹Ø§Ø¯Ù„ØªÙŠÙ†',                'RÃ©solution par substitution et par combinaison.', 4),
  ('fonctions',         'Fonctions linÃ©aires et affines',    'Ø§Ù„Ø¯ÙˆØ§Ù„ Ø§Ù„Ø®Ø·ÙŠØ© ÙˆØ§Ù„ØªØ¢Ù„ÙÙŠØ©',      'ReprÃ©sentation graphique, coefficient directeur.', 5),
  ('statistiques',      'Statistiques',                      'Ø§Ù„Ø¥Ø­ØµØ§Ø¡',                      'Moyenne pondÃ©rÃ©e, mÃ©diane et Ã©tendue.', 6),
  ('thales',            'ThÃ©orÃ¨me de ThalÃ¨s',                'Ù…Ø¨Ø±Ù‡Ù†Ø© Ø·Ø§Ù„Ø³',                  'Configuration de ThalÃ¨s, agrandissement et rÃ©duction.', 7),
  ('pythagore',         'PropriÃ©tÃ© de Pythagore',            'Ø®Ø§ØµÙŠØ© ÙÙŠØ«Ø§ØºÙˆØ±Ø«',               'Calculer une longueur dans un triangle rectangle.', 8),
  ('trigonometrie',     'TrigonomÃ©trie',                     'Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª',                'Cosinus, sinus et tangente d''un angle aigu.', 9),
  ('geometrie-espace',  'GÃ©omÃ©trie dans l''espace',          'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡',            'Pyramide, cÃ´ne, sphÃ¨re â€” aires et volumes.', 10)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Physique ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('phenomenes-electriques', 'PhÃ©nomÃ¨nes Ã©lectriques',      'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©',  'Tension, intensitÃ©, loi d''Ohm, sÃ©curitÃ© Ã©lectrique.', 1),
  ('phenomenes-lumineux',    'PhÃ©nomÃ¨nes lumineux',         'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„Ø¶ÙˆØ¦ÙŠØ©',     'Propagation, rÃ©flexion, lentilles et images.', 2),
  ('phenomenes-mecaniques',  'PhÃ©nomÃ¨nes mÃ©caniques',       'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„Ù…ÙŠÙƒØ§Ù†ÙŠÙƒÙŠØ©', 'Mouvement, vitesse, forces et Ã©quilibre.', 3),
  ('matiere-transformations','MatiÃ¨re et transformations',  'Ø§Ù„Ù…Ø§Ø¯Ø© ÙˆØªØ­ÙˆÙ„Ø§ØªÙ‡Ø§',    'RÃ©actions chimiques, combustions, atomes et ions.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'physique'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM SVT ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('coordination-nerveuse',  'La coordination nerveuse',    'Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø¹ØµØ¨ÙŠ',      'Neurones, message nerveux et rÃ©flexes.', 1),
  ('coordination-hormonale', 'La coordination hormonale',   'Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ',    'Glandes, hormones et rÃ©gulation.', 2),
  ('immunite',               'L''immunitÃ©',                 'Ø§Ù„Ù…Ù†Ø§Ø¹Ø©',             'DÃ©fenses de l''organisme, vaccination.', 3),
  ('genetique',              'La transmission des caractÃ¨res','ÙˆØ±Ø§Ø«Ø© Ø§Ù„ØµÙØ§Øª',      'Chromosomes, gÃ¨nes et hÃ©rÃ©ditÃ©.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'svt'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM FranÃ§ais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-argumentatif', 'Le texte argumentatif',        'Ø§Ù„Ù†Øµ Ø§Ù„Ø­Ø¬Ø§Ø¬ÙŠ',        'ThÃ¨se, arguments et exemples â€” argumenter Ã  l''Ã©crit.', 1),
  ('grammaire',          'Grammaire â€” subordonnÃ©es',     'Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯',             'SubordonnÃ©es relatives, complÃ©tives et circonstancielles.', 2),
  ('conjugaison',        'Conjugaison',                  'Ø§Ù„ØªØµØ±ÙŠÙ',             'Subjonctif prÃ©sent, conditionnel et concordance.', 3),
  ('vocabulaire',        'Vocabulaire de l''argumentation','Ù…ÙØ±Ø¯Ø§Øª Ø§Ù„Ø­Ø¬Ø§Ø¬',     'Connecteurs logiques et verbes d''opinion.', 4),
  ('production-ecrite',  'Production Ã©crite',            'Ø§Ù„Ø¥Ù†ØªØ§Ø¬ Ø§Ù„ÙƒØªØ§Ø¨ÙŠ',     'RÃ©diger un texte argumentatif structurÃ© (sujet BEM).', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('textes',            'Textes et comprÃ©hension',  'Ø§Ù„Ù†ØµÙˆØµ Ø§Ù„Ø£Ø¯Ø¨ÙŠØ© ÙˆÙÙ‡Ù… Ø§Ù„Ù…ÙƒØªÙˆØ¨', 'Ã‰tude de textes littÃ©raires et documentaires.', 1),
  ('grammaire',         'Grammaire (Ù†Ø­Ùˆ)',          'Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ø§Ù„Ù†Ø­ÙˆÙŠØ©',             'Les fonctions, l''i''rab et la phrase complexe.', 2),
  ('conjugaison',       'Morphologie (ØµØ±Ù)',        'Ø§Ù„ØµØ±Ù ÙˆØ§Ù„ØªØ­ÙˆÙŠÙ„',              'DÃ©rivation, formes verbales et transformation.', 3),
  ('expression-ecrite', 'Expression Ã©crite',        'Ø§Ù„ØªØ¹Ø¨ÙŠØ± Ø§Ù„ÙƒØªØ§Ø¨ÙŠ',             'Techniques de rÃ©daction (sujet BEM).', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Anglais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('people-experiences', 'People and experiences',  'Ø§Ù„Ø£Ø´Ø®Ø§Øµ ÙˆØ§Ù„ØªØ¬Ø§Ø±Ø¨',  'Talking about past experiences and biographies.', 1),
  ('grammar',            'Grammar essentials',      'Ø£Ø³Ø§Ø³ÙŠØ§Øª Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯',   'Tenses, comparatives, conditionals type 1.', 2),
  ('reading',            'Reading comprehension',   'ÙÙ‡Ù… Ø§Ù„Ù…Ù‚Ø±ÙˆØ¡',       'Reading strategies for the BEM exam.', 3),
  ('writing',            'Writing skills',          'Ù…Ù‡Ø§Ø±Ø§Øª Ø§Ù„ÙƒØªØ§Ø¨Ø©',    'Writing short paragraphs and emails.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'anglais'
on conflict (subject_id, slug) do nothing;

-- ---- 4AM Histoire-GÃ©o ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('mouvement-national', 'Le mouvement national algÃ©rien',  'Ø§Ù„Ø­Ø±ÙƒØ© Ø§Ù„ÙˆØ·Ù†ÙŠØ© Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±ÙŠØ©', '1919-1954 : naissance et Ã©volution du mouvement national.', 1),
  ('revolution',         'La rÃ©volution de 1954',           'Ø§Ù„Ø«ÙˆØ±Ø© Ø§Ù„ØªØ­Ø±ÙŠØ±ÙŠØ© Ø§Ù„ÙƒØ¨Ø±Ù‰',  'DÃ©clenchement, organisation et victoire (1954-1962).', 2),
  ('algerie-geographie', 'GÃ©ographie de l''AlgÃ©rie',        'Ø¬ØºØ±Ø§ÙÙŠØ§ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±',          'Situation, relief, climat et population.', 3),
  ('economie-algerie',   'Ã‰conomie de l''AlgÃ©rie',          'Ø§Ù‚ØªØµØ§Ø¯ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±',           'Ressources, agriculture, industrie et dÃ©fis.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AM' and s.slug = 'histoire-geo'
on conflict (subject_id, slug) do nothing;

-- ---- 1AS MathÃ©matiques (tronc commun) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres',          'Les ensembles de nombres',     'Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ø¹Ø¯Ø¯ÙŠØ©',       'N, Z, D, Q, R â€” intervalles et valeur absolue.', 1),
  ('calcul-litteral',  'Calcul littÃ©ral et identitÃ©s', 'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ',           'IdentitÃ©s remarquables et factorisation.', 2),
  ('equations',        'Ã‰quations et inÃ©quations',     'Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª ÙˆØ§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø§Øª',   'Premier degrÃ©, tableaux de signes.', 3),
  ('fonctions-general','GÃ©nÃ©ralitÃ©s sur les fonctions','Ø¹Ù…ÙˆÙ…ÙŠØ§Øª Ø­ÙˆÙ„ Ø§Ù„Ø¯ÙˆØ§Ù„',      'Domaine, image, courbe reprÃ©sentative, variations.', 4),
  ('fonctions-ref',    'Fonctions de rÃ©fÃ©rence',       'Ø§Ù„Ø¯ÙˆØ§Ù„ Ø§Ù„Ù…Ø±Ø¬Ø¹ÙŠØ©',         'CarrÃ©, inverse, racine â€” allures des courbes.', 5),
  ('statistiques',     'Statistiques',                 'Ø§Ù„Ø¥Ø­ØµØ§Ø¡',                 'ParamÃ¨tres de position et de dispersion.', 6),
  ('vecteurs',         'GÃ©omÃ©trie vectorielle',        'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© Ø§Ù„Ø´Ø¹Ø§Ø¹ÙŠØ©',        'Vecteurs, colinÃ©aritÃ© et repÃ¨res.', 7),
  ('trigonometrie',    'TrigonomÃ©trie',                'Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª',           'Cercle trigonomÃ©trique, sinus et cosinus.', 8)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 2AS MathÃ©matiques ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('second-degre',   'PolynÃ´mes et second degrÃ©',     'ÙƒØ«ÙŠØ±Ø§Øª Ø§Ù„Ø­Ø¯ÙˆØ¯ ÙˆØ§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø«Ø§Ù†ÙŠØ©', 'TrinÃ´me, discriminant, factorisation et signe.', 1),
  ('fonctions',      'Ã‰tude de fonctions',            'Ø¯Ø±Ø§Ø³Ø© Ø§Ù„Ø¯ÙˆØ§Ù„',                  'Sens de variation, extremums, reprÃ©sentations.', 2),
  ('suites',         'Suites numÃ©riques (initiation)','Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ§Øª Ø§Ù„Ø¹Ø¯Ø¯ÙŠØ©',            'Suites arithmÃ©tiques et gÃ©omÃ©triques.', 3),
  ('trigonometrie',  'TrigonomÃ©trie',                 'Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª',                 'Formules et Ã©quations trigonomÃ©triques.', 4),
  ('geometrie-espace','GÃ©omÃ©trie dans l''espace',     'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡',             'Positions relatives, droites et plans.', 5),
  ('probabilites',   'ProbabilitÃ©s (initiation)',     'Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª',                    'DÃ©nombrement et probabilitÃ© d''un Ã©vÃ©nement.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS MathÃ©matiques (sciences â€” annÃ©e du BAC) ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('limites-continuite', 'Limites et continuitÃ©',       'Ø§Ù„Ù†Ù‡Ø§ÙŠØ§Øª ÙˆØ§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ©',   'Limites de fonctions, asymptotes, continuitÃ©.', 1),
  ('derivation',         'DÃ©rivation et Ã©tude de fonctions','Ø§Ù„Ø§Ø´ØªÙ‚Ø§Ù‚ÙŠØ© ÙˆØ¯Ø±Ø§Ø³Ø© Ø§Ù„Ø¯ÙˆØ§Ù„', 'DÃ©rivÃ©es, variations, extremums, tracÃ© de courbes.', 2),
  ('suites-numeriques',  'Suites numÃ©riques',           'Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ§Øª Ø§Ù„Ø¹Ø¯Ø¯ÙŠØ©',      'RÃ©currence, limites, suites arithmÃ©tiques et gÃ©omÃ©triques.', 3),
  ('exponentielle',      'Fonction exponentielle',      'Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ø£Ø³ÙŠØ©',           'PropriÃ©tÃ©s, dÃ©rivÃ©e, limites et Ã©quations.', 4),
  ('logarithme',         'Fonction logarithme',         'Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ù„ÙˆØºØ§Ø±ÙŠØªÙ…ÙŠØ©',     'ln x â€” propriÃ©tÃ©s algÃ©briques et Ã©tude.', 5),
  ('integrales',         'Calcul intÃ©gral',             'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„ØªÙƒØ§Ù…Ù„ÙŠ',         'Primitives, intÃ©grale dÃ©finie, aires.', 6),
  ('probabilites',       'ProbabilitÃ©s',                'Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª',              'Conditionnement, indÃ©pendance, loi binomiale.', 7),
  ('complexes',          'Nombres complexes',           'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø±ÙƒØ¨Ø©',         'Forme algÃ©brique, module, argument, forme exponentielle.', 8),
  ('geometrie-espace',   'GÃ©omÃ©trie dans l''espace',    'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡',       'Droites, plans, produit scalaire dans l''espace.', 9)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Physique ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('cinetique',        'Suivi temporel d''une rÃ©action', 'Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø²Ù…Ù†ÙŠØ© Ù„ØªØ­ÙˆÙ„ ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ', 'Vitesse de rÃ©action, facteurs cinÃ©tiques, temps de demi-rÃ©action.', 1),
  ('mecanique',        'Ã‰volution d''un systÃ¨me mÃ©canique','ØªØ·ÙˆØ± Ø¬Ù…Ù„Ø© Ù…ÙŠÙƒØ§Ù†ÙŠÙƒÙŠØ©',          'Lois de Newton, chute libre, mouvements plans.', 2),
  ('electricite',      'DipÃ´les RC et RL',               'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ© RC ÙˆRL',      'Charge du condensateur, Ã©tablissement du courant.', 3),
  ('nucleaire',        'Transformations nuclÃ©aires',     'Ø§Ù„ØªØ­ÙˆÙ„Ø§Øª Ø§Ù„Ù†ÙˆÙˆÙŠØ©',               'RadioactivitÃ©, dÃ©croissance, datation, E = mcÂ².', 4),
  ('equilibre-chimique','Ã‰quilibre chimique',            'Ø§Ù„ØªØ­ÙˆÙ„Ø§Øª Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ© ØºÙŠØ± Ø§Ù„ØªØ§Ù…Ø©', 'Quotient de rÃ©action, constante d''Ã©quilibre.', 5),
  ('controle-evolution','ContrÃ´le de l''Ã©volution',      'Ø§Ù„ØªØ·ÙˆØ±Ø§Øª Ø§Ù„Ù…Ø±ØªÙ‚Ø¨Ø© Ù„Ø¬Ù…Ù„Ø© ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ©','EstÃ©rification, piles et Ã©lectrolyse.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'physique'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS SVT ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('gene-proteine',   'Du gÃ¨ne Ã  la protÃ©ine',           'Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø¨ÙŠÙ† Ø§Ù„Ù…ÙˆØ±Ø«Ø§Øª ÙˆØ§Ù„Ø¨Ø±ÙˆØªÙŠÙ†Ø§Øª', 'Transcription, traduction, code gÃ©nÃ©tique.', 1),
  ('enzymes',         'ActivitÃ© enzymatique',            'Ø§Ù„Ù†Ø´Ø§Ø· Ø§Ù„Ø£Ù†Ø²ÙŠÙ…ÙŠ Ù„Ù„Ø¨Ø±ÙˆØªÙŠÙ†Ø§Øª',       'SpÃ©cificitÃ© enzymatique, complexe enzyme-substrat.', 2),
  ('energie',         'Conversion de l''Ã©nergie',        'ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ø·Ø§Ù‚Ø©',                     'Respiration, fermentation, photosynthÃ¨se, ATP.', 3),
  ('communication-nerveuse','La communication nerveuse', 'Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ø¹ØµØ¨ÙŠ',                   'Potentiel d''action, synapse, intÃ©gration.', 4),
  ('immunite',        'L''immunitÃ© â€” soi et non-soi',    'Ø§Ù„Ù…Ù†Ø§Ø¹Ø© â€” Ø§Ù„Ø°Ø§Øª ÙˆØ§Ù„Ù„Ø§Ø°Ø§Øª',         'RÃ©ponse immunitaire, LB, LT, vaccination.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'svt'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Philosophie ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('probleme-philosophique','Le problÃ¨me philosophique', 'Ø§Ù„Ø¥Ø´ÙƒØ§Ù„ÙŠØ© Ø§Ù„ÙÙ„Ø³ÙÙŠØ©',  'La question philosophique et la dÃ©marche de rÃ©flexion.', 1),
  ('science-verite',        'La science et la vÃ©ritÃ©',   'Ø§Ù„Ø¹Ù„Ù… ÙˆØ§Ù„Ø­Ù‚ÙŠÙ‚Ø©',      'Les mathÃ©matiques, les sciences expÃ©rimentales et la vÃ©ritÃ©.', 2),
  ('liberte',               'La libertÃ© et la responsabilitÃ©','Ø§Ù„Ø­Ø±ÙŠØ© ÙˆØ§Ù„Ù…Ø³Ø¤ÙˆÙ„ÙŠØ©','DÃ©terminisme, libre arbitre et responsabilitÃ© morale.', 3),
  ('justice-etat',          'La justice et l''Ã‰tat',     'Ø§Ù„Ø¹Ø¯Ø§Ù„Ø© ÙˆØ§Ù„Ø¯ÙˆÙ„Ø©',     'Le droit, la justice sociale et le rÃ´le de l''Ã‰tat.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'philosophie'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS FranÃ§ais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('texte-historique', 'Projet 1 Â· Le texte historique', 'Ø§Ù„Ù†Øµ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠ',  'Documents et tÃ©moignages â€” l''Histoire au BAC.', 1),
  ('debat-idees',      'Projet 2 Â· Le dÃ©bat d''idÃ©es',   'Ù…Ù†Ø§Ù‚Ø´Ø© Ø§Ù„Ø£ÙÙƒØ§Ø±', 'Argumenter, rÃ©futer et concÃ©der.', 2),
  ('appel',            'Projet 3 Â· L''appel',            'Ù†Øµ Ø§Ù„Ù†Ø¯Ø§Ø¡',      'Le texte exhortatif â€” lancer un appel.', 3),
  ('techniques-bac',   'Techniques de l''Ã©preuve',       'Ù…Ù†Ù‡Ø¬ÙŠØ© Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±','Compte rendu, synthÃ¨se et production Ã©crite au BAC.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'francais'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Anglais ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('ethics',    'Ethics in business',        'Ø£Ø®Ù„Ø§Ù‚ÙŠØ§Øª Ø§Ù„Ø£Ø¹Ù…Ø§Ù„', 'Unit 1 â€” corruption, counterfeiting and business ethics.', 1),
  ('safety',    'Safety first',              'Ø§Ù„Ø³Ù„Ø§Ù…Ø© Ø£ÙˆÙ„Ø§Ù‹',    'Unit 2 â€” food safety and consumer protection.', 2),
  ('astronomy', 'Astronomy and the solar system','Ø¹Ù„Ù… Ø§Ù„ÙÙ„Ùƒ',    'Unit 3 â€” space exploration and the solar system.', 3),
  ('feelings',  'Feelings and emotions',     'Ø§Ù„Ù…Ø´Ø§Ø¹Ø± ÙˆØ§Ù„Ø¹ÙˆØ§Ø·Ù', 'Unit 4 â€” expressing feelings, arts and music.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'anglais'
on conflict (subject_id, slug) do nothing;

-- ---- 3AS Arabe ----
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('adab-hadith',  'LittÃ©rature moderne',   'Ø§Ù„Ø£Ø¯Ø¨ Ø§Ù„Ø¹Ø±Ø¨ÙŠ Ø§Ù„Ø­Ø¯ÙŠØ«',  'PoÃ©sie et prose de la Nahda Ã  nos jours.', 1),
  ('qawaid',       'Grammaire et i''rab',   'Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ ÙˆØ§Ù„Ø¥Ø¹Ø±Ø§Ø¨',     'Analyse grammaticale des textes du programme.', 2),
  ('balagha-naqd', 'RhÃ©torique et critique','Ø§Ù„Ø¨Ù„Ø§ØºØ© ÙˆØ§Ù„Ù†Ù‚Ø¯ Ø§Ù„Ø£Ø¯Ø¨ÙŠ','Figures de style et critique littÃ©raire.', 3),
  ('taabir',       'Expression Ã©crite',     'Ø§Ù„ØªØ¹Ø¨ÙŠØ± Ø§Ù„ÙƒØªØ§Ø¨ÙŠ',      'MÃ©thodologie de la production Ã©crite au BAC.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AS' and s.slug = 'arabe'
on conflict (subject_id, slug) do nothing;

-- ===== 4. Lesson content for flagship chapters =====

update public.chapters c set
  lesson_fr = 'UNE FRACTION, C''EST QUOI ?

Une fraction reprÃ©sente une partie d''un tout. Dans la fraction 3/4 :
â€¢ 3 est le NUMÃ‰RATEUR â€” le nombre de parts que l''on prend.
â€¢ 4 est le DÃ‰NOMINATEUR â€” le nombre de parts Ã©gales du tout.

Exemple : une pizza coupÃ©e en 4 parts Ã©gales. Si tu manges 3 parts, tu as mangÃ© 3/4 de la pizza.

COMPARER DES FRACTIONS
â€¢ MÃªme dÃ©nominateur â†’ la plus grande est celle qui a le plus grand numÃ©rateur : 5/8 > 3/8.
â€¢ Une fraction Ã©gale Ã  1 â†’ numÃ©rateur = dÃ©nominateur : 4/4 = 1.
â€¢ Plus le dÃ©nominateur est grand (Ã  numÃ©rateur Ã©gal), plus la part est petite : 1/8 < 1/4.

ADDITIONNER (mÃªme dÃ©nominateur)
On additionne les numÃ©rateurs, le dÃ©nominateur ne change pas :
2/6 + 3/6 = 5/6.

Ã€ RETENIR : le dÃ©nominateur indique en combien de parts on coupe, le numÃ©rateur combien on en prend.',
  lesson_ar = 'Ù…Ø§ Ù‡Ùˆ Ø§Ù„ÙƒØ³Ø±ØŸ

Ø§Ù„ÙƒØ³Ø± ÙŠÙ…Ø«Ù„ Ø¬Ø²Ø¡Ù‹Ø§ Ù…Ù† ÙƒÙ„. ÙÙŠ Ø§Ù„ÙƒØ³Ø± 3/4:
â€¢ 3 Ù‡Ùˆ Ø§Ù„Ø¨Ø³Ø· â€” Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„ØªÙŠ Ù†Ø£Ø®Ø°Ù‡Ø§.
â€¢ 4 Ù‡Ùˆ Ø§Ù„Ù…Ù‚Ø§Ù… â€” Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„Ù…ØªØ³Ø§ÙˆÙŠØ© Ù„Ù„ÙƒÙ„.

Ù…Ø«Ø§Ù„: Ø¨ÙŠØªØ²Ø§ Ù…Ù‚Ø³ÙˆÙ…Ø© Ø¥Ù„Ù‰ 4 Ø£Ø¬Ø²Ø§Ø¡ Ù…ØªØ³Ø§ÙˆÙŠØ©. Ø¥Ø°Ø§ Ø£ÙƒÙ„Øª 3 Ø£Ø¬Ø²Ø§Ø¡ØŒ ÙÙ‚Ø¯ Ø£ÙƒÙ„Øª 3/4 Ù…Ù† Ø§Ù„Ø¨ÙŠØªØ²Ø§.

Ù…Ù‚Ø§Ø±Ù†Ø© Ø§Ù„ÙƒØ³ÙˆØ±
â€¢ Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù… â† Ø§Ù„Ø£ÙƒØ¨Ø± Ù‡Ùˆ ØµØ§Ø­Ø¨ Ø§Ù„Ø¨Ø³Ø· Ø§Ù„Ø£ÙƒØ¨Ø±: 5/8 > 3/8.
â€¢ Ø§Ù„ÙƒØ³Ø± ÙŠØ³Ø§ÙˆÙŠ 1 Ø¹Ù†Ø¯Ù…Ø§ ÙŠØªØ³Ø§ÙˆÙ‰ Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù…: 4/4 = 1.

Ø¬Ù…Ø¹ Ø§Ù„ÙƒØ³ÙˆØ± (Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…)
Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø¨Ø³Ø·ÙŠÙ† ÙˆÙŠØ¨Ù‚Ù‰ Ø§Ù„Ù…Ù‚Ø§Ù… Ù†ÙØ³Ù‡: 2/6 + 3/6 = 5/6.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'fractions';

update public.chapters c set
  lesson_fr = 'LA PROPRIÃ‰TÃ‰ DE PYTHAGORE

Dans un triangle RECTANGLE, le carrÃ© de l''hypotÃ©nuse est Ã©gal Ã  la somme des carrÃ©s des deux autres cÃ´tÃ©s.

Si ABC est rectangle en A :  BCÂ² = ABÂ² + ACÂ²

(BC est l''hypotÃ©nuse â€” le cÃ´tÃ© le plus long, opposÃ© Ã  l''angle droit.)

CALCULER L''HYPOTÃ‰NUSE
AB = 3 cm, AC = 4 cm.
BCÂ² = 3Â² + 4Â² = 9 + 16 = 25, donc BC = âˆš25 = 5 cm.

CALCULER UN AUTRE CÃ”TÃ‰
BC = 13 cm, AB = 5 cm.
ACÂ² = BCÂ² âˆ’ ABÂ² = 169 âˆ’ 25 = 144, donc AC = 12 cm.

LA RÃ‰CIPROQUE
Si BCÂ² = ABÂ² + ACÂ², alors le triangle est rectangle en A. Sinon, il n''est pas rectangle.

Ã€ RETENIR : Pythagore ne s''applique QUE dans un triangle rectangle, et l''hypotÃ©nuse est toujours en face de l''angle droit.',
  lesson_ar = 'Ø®Ø§ØµÙŠØ© ÙÙŠØ«Ø§ØºÙˆØ±Ø«

ÙÙŠ Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù‚Ø§Ø¦Ù…ØŒ Ù…Ø±Ø¨Ø¹ Ø§Ù„ÙˆØªØ± ÙŠØ³Ø§ÙˆÙŠ Ù…Ø¬Ù…ÙˆØ¹ Ù…Ø±Ø¨Ø¹ÙŠ Ø§Ù„Ø¶Ù„Ø¹ÙŠÙ† Ø§Ù„Ø¢Ø®Ø±ÙŠÙ†.

Ø¥Ø°Ø§ ÙƒØ§Ù† ABC Ù‚Ø§Ø¦Ù…Ù‹Ø§ ÙÙŠ A:  BCÂ² = ABÂ² + ACÂ²

(BC Ù‡Ùˆ Ø§Ù„ÙˆØªØ± â€” Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ø£Ø·ÙˆÙ„ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ù„Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.)

Ø­Ø³Ø§Ø¨ Ø§Ù„ÙˆØªØ±
AB = 3 Ø³Ù…ØŒ AC = 4 Ø³Ù….
BCÂ² = 9 + 16 = 25ØŒ Ø¥Ø°Ù† BC = 5 Ø³Ù….

Ø­Ø³Ø§Ø¨ Ø¶Ù„Ø¹ Ø¢Ø®Ø±
BC = 13 Ø³Ù…ØŒ AB = 5 Ø³Ù….
ACÂ² = 169 âˆ’ 25 = 144ØŒ Ø¥Ø°Ù† AC = 12 Ø³Ù….

Ø§Ù„Ø¹ÙƒØ³: Ø¥Ø°Ø§ ØªØ­Ù‚Ù‚Øª Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© ÙØ§Ù„Ù…Ø«Ù„Ø« Ù‚Ø§Ø¦Ù…ØŒ ÙˆØ¥Ù„Ø§ ÙÙ‡Ùˆ ØºÙŠØ± Ù‚Ø§Ø¦Ù….'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'pythagore';

update public.chapters c set
  lesson_fr = 'LES NOMBRES RATIONNELS

Un nombre rationnel est un nombre qui peut s''Ã©crire sous la forme a/b oÃ¹ a et b sont des entiers (b â‰  0).
Exemples : 3/4 ; âˆ’5/2 ; 7 (= 7/1) ; 0,25 (= 1/4).

RÃˆGLES DES SIGNES (multiplication et division)
â€¢ (+) Ã— (+) = (+)    â€¢ (âˆ’) Ã— (âˆ’) = (+)
â€¢ (+) Ã— (âˆ’) = (âˆ’)    â€¢ (âˆ’) Ã— (+) = (âˆ’)

ADDITION DE FRACTIONS
Mettre au mÃªme dÃ©nominateur d''abord :
1/3 + 1/4 = 4/12 + 3/12 = 7/12.

MULTIPLICATION
On multiplie les numÃ©rateurs entre eux et les dÃ©nominateurs entre eux :
2/3 Ã— 5/7 = 10/21.

DIVISION
Diviser par une fraction = multiplier par son inverse :
2/3 Ã· 4/5 = 2/3 Ã— 5/4 = 10/12 = 5/6.

PRIORITÃ‰S DE CALCUL : parenthÃ¨ses â†’ puissances â†’ Ã— et Ã· â†’ + et âˆ’.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø§Ø·Ù‚Ø©

Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ù†Ø§Ø·Ù‚ Ù‡Ùˆ ÙƒÙ„ Ø¹Ø¯Ø¯ ÙŠÙ…ÙƒÙ† ÙƒØªØ§Ø¨ØªÙ‡ Ø¹Ù„Ù‰ Ø´ÙƒÙ„ a/b Ø­ÙŠØ« a Ùˆb Ø¹Ø¯Ø¯Ø§Ù† ØµØ­ÙŠØ­Ø§Ù† (b â‰  0).
Ø£Ù…Ø«Ù„Ø©: 3/4 Ø› âˆ’5/2 Ø› 7 Ø› 0.25.

Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¥Ø´Ø§Ø±Ø§Øª (Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø©)
â€¢ (+) Ã— (+) = (+)    â€¢ (âˆ’) Ã— (âˆ’) = (+)
â€¢ (+) Ã— (âˆ’) = (âˆ’)

Ø¬Ù…Ø¹ Ø§Ù„ÙƒØ³ÙˆØ±: Ù†ÙˆØ­Ù‘Ø¯ Ø§Ù„Ù…Ù‚Ø§Ù…Ø§Øª Ø£ÙˆÙ„Ø§Ù‹:
1/3 + 1/4 = 4/12 + 3/12 = 7/12.

Ø§Ù„Ø¶Ø±Ø¨: Ù†Ø¶Ø±Ø¨ Ø§Ù„Ø¨Ø³Ø· ÙÙŠ Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù… ÙÙŠ Ø§Ù„Ù…Ù‚Ø§Ù….
Ø§Ù„Ù‚Ø³Ù…Ø©: Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ ÙƒØ³Ø± = Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ Ù…Ù‚Ù„ÙˆØ¨Ù‡.

Ø£ÙˆÙ„ÙˆÙŠØ§Øª Ø§Ù„Ø­Ø³Ø§Ø¨: Ø§Ù„Ø£Ù‚ÙˆØ§Ø³ â† Ø§Ù„Ù‚ÙˆÙ‰ â† Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© â† Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'rationnels';

update public.chapters c set
  lesson_fr = 'LES SUITES NUMÃ‰RIQUES

Une suite (Un) associe Ã  chaque entier naturel n un nombre rÃ©el Un.

SUITE ARITHMÃ‰TIQUE (raison r)
Chaque terme s''obtient en AJOUTANT r :  U(n+1) = Un + r
Terme gÃ©nÃ©ral : Un = U0 + nÂ·r
Somme : U0 + U1 + â€¦ + Un = (n+1)(U0 + Un)/2

SUITE GÃ‰OMÃ‰TRIQUE (raison q)
Chaque terme s''obtient en MULTIPLIANT par q :  U(n+1) = qÂ·Un
Terme gÃ©nÃ©ral : Un = U0 Â· qâ¿
Somme : U0 Â· (1 âˆ’ qâ¿âºÂ¹)/(1 âˆ’ q)  (q â‰  1)

LIMITES
â€¢ Si âˆ’1 < q < 1 alors qâ¿ â†’ 0.
â€¢ Si q > 1 alors qâ¿ â†’ +âˆž.

RAISONNEMENT PAR RÃ‰CURRENCE
Pour prouver qu''une propriÃ©tÃ© P(n) est vraie pour tout n :
1. INITIALISATION : vÃ©rifier P(0).
2. HÃ‰RÃ‰DITÃ‰ : supposer P(n) vraie, montrer P(n+1).
3. CONCLUSION : P(n) est vraie pour tout n.',
  lesson_ar = 'Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ§Øª Ø§Ù„Ø¹Ø¯Ø¯ÙŠØ©

Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ© (Un) ØªØ±Ø¨Ø· ÙƒÙ„ Ø¹Ø¯Ø¯ Ø·Ø¨ÙŠØ¹ÙŠ n Ø¨Ø¹Ø¯Ø¯ Ø­Ù‚ÙŠÙ‚ÙŠ Un.

Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ© Ø§Ù„Ø­Ø³Ø§Ø¨ÙŠØ© (Ø§Ù„Ø£Ø³Ø§Ø³ r)
ÙƒÙ„ Ø­Ø¯ ÙŠÙØ­ØµÙ„ Ø¹Ù„ÙŠÙ‡ Ø¨Ø¥Ø¶Ø§ÙØ© r:  U(n+1) = Un + r
Ø§Ù„Ø­Ø¯ Ø§Ù„Ø¹Ø§Ù…: Un = U0 + nÂ·r

Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ© Ø§Ù„Ù‡Ù†Ø¯Ø³ÙŠØ© (Ø§Ù„Ø£Ø³Ø§Ø³ q)
ÙƒÙ„ Ø­Ø¯ ÙŠÙØ­ØµÙ„ Ø¹Ù„ÙŠÙ‡ Ø¨Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ q:  U(n+1) = qÂ·Un
Ø§Ù„Ø­Ø¯ Ø§Ù„Ø¹Ø§Ù…: Un = U0 Â· qâ¿

Ø§Ù„Ù†Ù‡Ø§ÙŠØ§Øª
â€¢ Ø¥Ø°Ø§ ÙƒØ§Ù† âˆ’1 < q < 1 ÙØ¥Ù† qâ¿ â†’ 0.
â€¢ Ø¥Ø°Ø§ ÙƒØ§Ù† q > 1 ÙØ¥Ù† qâ¿ â†’ +âˆž.

Ø§Ù„Ø¨Ø±Ù‡Ø§Ù† Ø¨Ø§Ù„ØªØ±Ø§Ø¬Ø¹: Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† P(0)ØŒ Ø«Ù… Ø§ÙØªØ±Ø§Ø¶ P(n) ÙˆØ¥Ø«Ø¨Ø§Øª P(n+1)ØŒ Ø«Ù… Ø§Ù„Ø§Ø³ØªÙ†ØªØ§Ø¬.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'suites-numeriques';

update public.chapters c set
  lesson_fr = 'LES Ã‰QUATIONS DU PREMIER DEGRÃ‰

Une Ã©quation est une Ã©galitÃ© contenant une inconnue (souvent x).
RÃ©soudre = trouver la valeur de x qui rend l''Ã©galitÃ© vraie.

MÃ‰THODE
1. DÃ©velopper et rÃ©duire chaque membre.
2. Regrouper les x d''un cÃ´tÃ©, les nombres de l''autre (en changeant de signe quand on change de cÃ´tÃ©).
3. Diviser par le coefficient de x.

EXEMPLE
5x âˆ’ 7 = 2x + 8
5x âˆ’ 2x = 8 + 7
3x = 15
x = 5      VÃ©rification : 5Ã—5âˆ’7 = 18 et 2Ã—5+8 = 18 âœ“

MISE EN Ã‰QUATION D''UN PROBLÃˆME
Â« Ahmed a 3 fois l''Ã¢ge de son frÃ¨re. Ã€ eux deux ils ont 48 ans. Â»
Soit x l''Ã¢ge du frÃ¨re : x + 3x = 48 â†’ 4x = 48 â†’ x = 12.
Le frÃ¨re a 12 ans, Ahmed a 36 ans.',
  lesson_ar = 'Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª Ù…Ù† Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰

Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© Ù‡ÙŠ Ù…Ø³Ø§ÙˆØ§Ø© ØªØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ù…Ø¬Ù‡ÙˆÙ„ (ØºØ§Ù„Ø¨Ù‹Ø§ x).
Ø­Ù„ Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© = Ø¥ÙŠØ¬Ø§Ø¯ Ù‚ÙŠÙ…Ø© x Ø§Ù„ØªÙŠ ØªØ¬Ø¹Ù„ Ø§Ù„Ù…Ø³Ø§ÙˆØ§Ø© ØµØ­ÙŠØ­Ø©.

Ø§Ù„Ø·Ø±ÙŠÙ‚Ø©
1. Ù†Ù†Ø´Ø± ÙˆÙ†Ø®ØªØ²Ù„ ÙƒÙ„ Ø·Ø±Ù.
2. Ù†Ø¬Ù…Ø¹ Ø­Ø¯ÙˆØ¯ x ÙÙŠ Ø·Ø±Ù ÙˆØ§Ù„Ø£Ø¹Ø¯Ø§Ø¯ ÙÙŠ Ø§Ù„Ø·Ø±Ù Ø§Ù„Ø¢Ø®Ø± (Ù…Ø¹ ØªØºÙŠÙŠØ± Ø§Ù„Ø¥Ø´Ø§Ø±Ø© Ø¹Ù†Ø¯ ØªØºÙŠÙŠØ± Ø§Ù„Ø·Ø±Ù).
3. Ù†Ù‚Ø³Ù… Ø¹Ù„Ù‰ Ù…Ø¹Ø§Ù…Ù„ x.

Ù…Ø«Ø§Ù„
5x âˆ’ 7 = 2x + 8
3x = 15
x = 5      Ø§Ù„ØªØ­Ù‚Ù‚: 5Ã—5âˆ’7 = 18 Ùˆ 2Ã—5+8 = 18 âœ“'
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
  ('Une pizza est coupÃ©e en 8 parts Ã©gales. Tu manges 3 parts. Quelle fraction as-tu mangÃ©e ?',
   'Ù‚ÙØ³Ù…Øª Ø¨ÙŠØªØ²Ø§ Ø¥Ù„Ù‰ 8 Ø£Ø¬Ø²Ø§Ø¡ Ù…ØªØ³Ø§ÙˆÙŠØ©. Ø£ÙƒÙ„ØªÙŽ 3 Ø£Ø¬Ø²Ø§Ø¡. Ù…Ø§ Ø§Ù„ÙƒØ³Ø± Ø§Ù„Ø°ÙŠ Ø£ÙƒÙ„ØªÙ‡ØŸ',
   '["3/8","8/3","3/5","5/8"]', '["3/8","8/3","3/5","5/8"]', 0,
   'On prend 3 parts sur 8 parts Ã©gales : 3/8.', 'Ø£Ø®Ø°Ù†Ø§ 3 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† 8 Ø£Ø¬Ø²Ø§Ø¡ Ù…ØªØ³Ø§ÙˆÙŠØ©: 3/8.', 'easy', 1),
  ('Quelle fraction est Ã©gale Ã  1 ?',
   'Ø£ÙŠ ÙƒØ³Ø± ÙŠØ³Ø§ÙˆÙŠ 1ØŸ',
   '["4/4","1/4","4/1","2/4"]', '["4/4","1/4","4/1","2/4"]', 0,
   'Quand le numÃ©rateur Ã©gale le dÃ©nominateur, la fraction vaut 1.', 'Ø¹Ù†Ø¯Ù…Ø§ ÙŠØªØ³Ø§ÙˆÙ‰ Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù…ØŒ ÙŠØ³Ø§ÙˆÙŠ Ø§Ù„ÙƒØ³Ø± 1.', 'easy', 2),
  ('Compare : 5/8 â€¦ 3/8',
   'Ù‚Ø§Ø±Ù†: 5/8 â€¦ 3/8',
   '["5/8 > 3/8","5/8 < 3/8","5/8 = 3/8","On ne peut pas comparer"]',
   '["5/8 > 3/8","5/8 < 3/8","5/8 = 3/8","Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©"]', 0,
   'MÃªme dÃ©nominateur : on compare les numÃ©rateurs. 5 > 3.', 'Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…: Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ø¨Ø³Ø·ÙŠÙ†. 5 > 3.', 'easy', 3),
  ('Calcule : 2/6 + 3/6',
   'Ø§Ø­Ø³Ø¨: 2/6 + 3/6',
   '["5/6","5/12","6/6","1/6"]', '["5/6","5/12","6/6","1/6"]', 0,
   'MÃªme dÃ©nominateur : on additionne les numÃ©rateurs. 2+3 = 5, donc 5/6.', 'Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…: Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø¨Ø³Ø·ÙŠÙ†. 2+3 = 5ØŒ Ø¥Ø°Ù† 5/6.', 'medium', 4),
  ('Quelle est la moitiÃ© de 1/2 ?',
   'Ù…Ø§ Ù‡Ùˆ Ù†ØµÙ 1/2ØŸ',
   '["1/4","1/3","2/2","1/8"]', '["1/4","1/3","2/2","1/8"]', 0,
   'La moitiÃ© de 1/2 est 1/4 : on coupe la moitiÃ© en deux.', 'Ù†ØµÙ 1/2 Ù‡Ùˆ 1/4: Ù†Ù‚Ø³Ù… Ø§Ù„Ù†ØµÙ Ø¥Ù„Ù‰ Ø¬Ø²Ø£ÙŠÙ†.', 'medium', 5)
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
   'ABC Ù‚Ø§Ø¦Ù… ÙÙŠ A Ø­ÙŠØ« AB = 3 Ø³Ù… Ùˆ AC = 4 Ø³Ù…. ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ BCØŸ',
   '["5 cm","7 cm","25 cm","6 cm"]', '["5 Ø³Ù…","7 Ø³Ù…","25 Ø³Ù…","6 Ø³Ù…"]', 0,
   'BCÂ² = 3Â² + 4Â² = 9 + 16 = 25, donc BC = âˆš25 = 5 cm.', 'BCÂ² = 9 + 16 = 25ØŒ Ø¥Ø°Ù† BC = 5 Ø³Ù….', 'easy', 1),
  ('Dans un triangle rectangle, l''hypotÃ©nuse estâ€¦',
   'ÙÙŠ Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù‚Ø§Ø¦Ù…ØŒ Ø§Ù„ÙˆØªØ± Ù‡Ùˆâ€¦',
   '["le cÃ´tÃ© opposÃ© Ã  l''angle droit","le plus petit cÃ´tÃ©","un cÃ´tÃ© de l''angle droit","la hauteur"]',
   '["Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ù„Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©","Ø£ØµØºØ± Ø¶Ù„Ø¹","Ø¶Ù„Ø¹ Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©","Ø§Ù„Ø§Ø±ØªÙØ§Ø¹"]', 0,
   'L''hypotÃ©nuse est le cÃ´tÃ© le plus long, face Ã  l''angle droit.', 'Ø§Ù„ÙˆØªØ± Ù‡Ùˆ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ø£Ø·ÙˆÙ„ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ù„Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.', 'easy', 2),
  ('ABC est rectangle en A. BC = 13 cm, AB = 5 cm. Que vaut AC ?',
   'ABC Ù‚Ø§Ø¦Ù… ÙÙŠ A. BC = 13 Ø³Ù… Ùˆ AB = 5 Ø³Ù…. ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ ACØŸ',
   '["12 cm","8 cm","18 cm","144 cm"]', '["12 Ø³Ù…","8 Ø³Ù…","18 Ø³Ù…","144 Ø³Ù…"]', 0,
   'ACÂ² = BCÂ² âˆ’ ABÂ² = 169 âˆ’ 25 = 144, donc AC = 12 cm.', 'ACÂ² = 169 âˆ’ 25 = 144ØŒ Ø¥Ø°Ù† AC = 12 Ø³Ù….', 'medium', 3),
  ('Un triangle a des cÃ´tÃ©s de 6, 8 et 10 cm. Est-il rectangle ?',
   'Ù…Ø«Ù„Ø« Ø£Ø¶Ù„Ø§Ø¹Ù‡ 6 Ùˆ8 Ùˆ10 Ø³Ù…. Ù‡Ù„ Ù‡Ùˆ Ù‚Ø§Ø¦Ù…ØŸ',
   '["Oui, car 6Â² + 8Â² = 10Â²","Non","Oui, car 6 + 8 > 10","On ne peut pas savoir"]',
   '["Ù†Ø¹Ù…ØŒ Ù„Ø£Ù† 6Â² + 8Â² = 10Â²","Ù„Ø§","Ù†Ø¹Ù…ØŒ Ù„Ø£Ù† 6 + 8 > 10","Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„Ù…Ø¹Ø±ÙØ©"]', 0,
   '36 + 64 = 100 = 10Â². La rÃ©ciproque de Pythagore s''applique.', '36 + 64 = 100 = 10Â². Ø­Ø³Ø¨ Ø¹ÙƒØ³ Ø®Ø§ØµÙŠØ© ÙÙŠØ«Ø§ØºÙˆØ±Ø«.', 'medium', 4),
  ('Une Ã©chelle de 5 m est posÃ©e contre un mur, son pied Ã  3 m du mur. Ã€ quelle hauteur touche-t-elle le mur ?',
   'Ø³Ù„Ù… Ø·ÙˆÙ„Ù‡ 5 Ø£Ù…ØªØ§Ø± Ù…Ø³ØªÙ†Ø¯ Ø¥Ù„Ù‰ Ø¬Ø¯Ø§Ø±ØŒ Ù‚Ø§Ø¹Ø¯ØªÙ‡ Ø¹Ù„Ù‰ Ø¨Ø¹Ø¯ 3 Ø£Ù…ØªØ§Ø±. Ø¹Ù„Ù‰ Ø£ÙŠ Ø§Ø±ØªÙØ§Ø¹ ÙŠÙ„Ù…Ø³ Ø§Ù„Ø¬Ø¯Ø§Ø±ØŸ',
   '["4 m","2 m","5,8 m","3,5 m"]', '["4 Ù…","2 Ù…","5.8 Ù…","3.5 Ù…"]', 0,
   'hÂ² = 5Â² âˆ’ 3Â² = 25 âˆ’ 9 = 16, donc h = 4 m.', 'hÂ² = 25 âˆ’ 9 = 16ØŒ Ø¥Ø°Ù† h = 4 Ù….', 'hard', 5)
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
  ('Calcule : (âˆ’3) Ã— (âˆ’5)',
   'Ø§Ø­Ø³Ø¨: (âˆ’3) Ã— (âˆ’5)',
   '["15","âˆ’15","âˆ’8","8"]', '["15","âˆ’15","âˆ’8","8"]', 0,
   'Moins par moins donne plus : (âˆ’3)Ã—(âˆ’5) = +15.', 'Ø³Ø§Ù„Ø¨ ÙÙŠ Ø³Ø§Ù„Ø¨ ÙŠØ¹Ø·ÙŠ Ù…ÙˆØ¬Ø¨Ù‹Ø§: 15+.', 'easy', 1),
  ('Calcule : 1/3 + 1/4',
   'Ø§Ø­Ø³Ø¨: 1/3 + 1/4',
   '["7/12","2/7","1/7","2/12"]', '["7/12","2/7","1/7","2/12"]', 0,
   'MÃªme dÃ©nominateur 12 : 4/12 + 3/12 = 7/12.', 'Ù†ÙˆØ­Ø¯ Ø§Ù„Ù…Ù‚Ø§Ù… 12: 4/12 + 3/12 = 7/12.', 'medium', 2),
  ('Calcule : 2/3 Ã· 4/5',
   'Ø§Ø­Ø³Ø¨: 2/3 Ã· 4/5',
   '["5/6","8/15","10/12","3/10"]', '["5/6","8/15","10/12","3/10"]', 0,
   'Diviser = multiplier par l''inverse : 2/3 Ã— 5/4 = 10/12 = 5/6.', 'Ø§Ù„Ù‚Ø³Ù…Ø© = Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ Ø§Ù„Ù…Ù‚Ù„ÙˆØ¨: 2/3 Ã— 5/4 = 5/6.', 'medium', 3),
  ('Quelle est l''Ã©criture dÃ©cimale de 3/4 ?',
   'Ù…Ø§ Ø§Ù„ÙƒØªØ§Ø¨Ø© Ø§Ù„Ø¹Ø´Ø±ÙŠØ© Ù„Ù„ÙƒØ³Ø± 3/4ØŸ',
   '["0,75","0,34","1,33","0,25"]', '["0.75","0.34","1.33","0.25"]', 0,
   '3 Ã· 4 = 0,75.', '3 Ã· 4 = 0.75.', 'easy', 4),
  ('Calcule : 5 âˆ’ 3 Ã— (âˆ’2)',
   'Ø§Ø­Ø³Ø¨: 5 âˆ’ 3 Ã— (âˆ’2)',
   '["11","4","âˆ’1","16"]', '["11","4","âˆ’1","16"]', 0,
   'La multiplication d''abord : 3Ã—(âˆ’2) = âˆ’6, puis 5âˆ’(âˆ’6) = 11.', 'Ø§Ù„Ø¶Ø±Ø¨ Ø£ÙˆÙ„Ø§Ù‹: 3Ã—(âˆ’2) = âˆ’6ØŒ Ø«Ù… 5âˆ’(âˆ’6) = 11.', 'hard', 5)
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
  ('RÃ©sous : x + 7 = 12',
   'Ø­Ù„: x + 7 = 12',
   '["x = 5","x = 19","x = âˆ’5","x = 7"]', '["x = 5","x = 19","x = âˆ’5","x = 7"]', 0,
   'x = 12 âˆ’ 7 = 5.', 'x = 12 âˆ’ 7 = 5.', 'easy', 1),
  ('RÃ©sous : 3x = 21',
   'Ø­Ù„: 3x = 21',
   '["x = 7","x = 18","x = 63","x = 24"]', '["x = 7","x = 18","x = 63","x = 24"]', 0,
   'x = 21 Ã· 3 = 7.', 'x = 21 Ã· 3 = 7.', 'easy', 2),
  ('RÃ©sous : 5x âˆ’ 7 = 2x + 8',
   'Ø­Ù„: 5x âˆ’ 7 = 2x + 8',
   '["x = 5","x = 3","x = 15","x = 1"]', '["x = 5","x = 3","x = 15","x = 1"]', 0,
   '5x âˆ’ 2x = 8 + 7 â†’ 3x = 15 â†’ x = 5.', '5x âˆ’ 2x = 8 + 7 â† 3x = 15 â† x = 5.', 'medium', 3),
  ('Ahmed a 3 fois l''Ã¢ge de son frÃ¨re. Ensemble ils ont 48 ans. Quel Ã¢ge a le frÃ¨re ?',
   'Ø¹Ù…Ø± Ø£Ø­Ù…Ø¯ 3 Ø£Ø¶Ø¹Ø§Ù Ø¹Ù…Ø± Ø£Ø®ÙŠÙ‡. Ù…Ø¬Ù…ÙˆØ¹ Ø¹Ù…Ø±ÙŠÙ‡Ù…Ø§ 48 Ø³Ù†Ø©. ÙƒÙ… Ø¹Ù…Ø± Ø§Ù„Ø£Ø®ØŸ',
   '["12 ans","16 ans","36 ans","24 ans"]', '["12 Ø³Ù†Ø©","16 Ø³Ù†Ø©","36 Ø³Ù†Ø©","24 Ø³Ù†Ø©"]', 0,
   'x + 3x = 48 â†’ 4x = 48 â†’ x = 12.', 'x + 3x = 48 â† 4x = 48 â† x = 12.', 'medium', 4),
  ('RÃ©sous : 2(x âˆ’ 3) = 10',
   'Ø­Ù„: 2(x âˆ’ 3) = 10',
   '["x = 8","x = 5","x = 2","x = 13"]', '["x = 8","x = 5","x = 2","x = 13"]', 0,
   '2x âˆ’ 6 = 10 â†’ 2x = 16 â†’ x = 8.', '2x âˆ’ 6 = 10 â† 2x = 16 â† x = 8.', 'hard', 5)
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
  ('(Un) est arithmÃ©tique avec U0 = 3 et r = 4. Que vaut U5 ?',
   '(Un) Ø­Ø³Ø§Ø¨ÙŠØ© Ø­ÙŠØ« U0 = 3 Ùˆ r = 4. ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ U5ØŸ',
   '["23","20","27","35"]', '["23","20","27","35"]', 0,
   'Un = U0 + nÂ·r â†’ U5 = 3 + 5Ã—4 = 23.', 'Un = U0 + nÂ·r â† U5 = 3 + 20 = 23.', 'easy', 1),
  ('(Vn) est gÃ©omÃ©trique avec V0 = 2 et q = 3. Que vaut V3 ?',
   '(Vn) Ù‡Ù†Ø¯Ø³ÙŠØ© Ø­ÙŠØ« V0 = 2 Ùˆ q = 3. ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ V3ØŸ',
   '["54","18","24","6"]', '["54","18","24","6"]', 0,
   'Vn = V0Â·qâ¿ â†’ V3 = 2Ã—27 = 54.', 'Vn = V0Â·qâ¿ â† V3 = 2Ã—27 = 54.', 'easy', 2),
  ('Si 0 < q < 1, alors la limite de qâ¿ quand n â†’ +âˆž estâ€¦',
   'Ø¥Ø°Ø§ ÙƒØ§Ù† 0 < q < 1 ÙØ¥Ù† Ù†Ù‡Ø§ÙŠØ© qâ¿ Ù„Ù…Ø§ n â†’ +âˆž Ù‡ÙŠâ€¦',
   '["0","+âˆž","1","q"]', '["0","+âˆž","1","q"]', 0,
   'Une puissance d''un nombre entre 0 et 1 tend vers 0.', 'Ù‚ÙˆØ© Ø¹Ø¯Ø¯ Ù…Ø­ØµÙˆØ± Ø¨ÙŠÙ† 0 Ùˆ1 ØªØ¤ÙˆÙ„ Ø¥Ù„Ù‰ 0.', 'medium', 3),
  ('La somme 1 + 2 + 3 + â€¦ + 100 vautâ€¦',
   'Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ 1 + 2 + 3 + â€¦ + 100 ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["5050","10100","5000","4950"]', '["5050","10100","5000","4950"]', 0,
   'S = n(n+1)/2 = 100Ã—101/2 = 5050.', 'S = n(n+1)/2 = 100Ã—101/2 = 5050.', 'medium', 4),
  ('Une suite dÃ©finie par U(n+1) = Un + 5 estâ€¦',
   'Ø§Ù„Ù…ØªØªØ§Ù„ÙŠØ© Ø§Ù„Ù…Ø¹Ø±ÙØ© Ø¨Ù€ U(n+1) = Un + 5 Ù‡ÙŠâ€¦',
   '["arithmÃ©tique de raison 5","gÃ©omÃ©trique de raison 5","ni l''une ni l''autre","constante"]',
   '["Ø­Ø³Ø§Ø¨ÙŠØ© Ø£Ø³Ø§Ø³Ù‡Ø§ 5","Ù‡Ù†Ø¯Ø³ÙŠØ© Ø£Ø³Ø§Ø³Ù‡Ø§ 5","Ù„Ø§ Ù‡Ø°Ù‡ ÙˆÙ„Ø§ ØªÙ„Ùƒ","Ø«Ø§Ø¨ØªØ©"]', 0,
   'On ajoute toujours le mÃªme nombre : suite arithmÃ©tique de raison 5.', 'Ù†Ø¶ÙŠÙ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯: Ù…ØªØªØ§Ù„ÙŠØ© Ø­Ø³Ø§Ø¨ÙŠØ© Ø£Ø³Ø§Ø³Ù‡Ø§ 5.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'suites-numeriques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);


-- ===============================================================
-- Migration: 20260721_018_lessons_maths_exam_years
--
-- Bilingual lessons (FR + AR) for every remaining maths chapter of the
-- three exam years: 5AP (fin de cycle), 4AM (BEM), 3AS (BAC).
-- Complements migration 017 which seeded fractions/pythagore/rationnels/
-- equations/suites. Idempotent: plain UPDATEs, safe to re-run.
-- ===============================================================

-- ============ 5AP ============

update public.chapters c set
  lesson_fr = 'LES GRANDS NOMBRES

Un nombre s''Ã©crit avec des CLASSES de 3 chiffres :
â€¦ millions | milliers | unitÃ©s simples
Exemple : 4 256 807 se lit Â« quatre millions deux cent cinquante-six mille huit cent sept Â».

TABLEAU DE NUMÃ‰RATION
Chaque chiffre a une valeur selon sa position :
Dans 4 256 807 â†’ le 2 vaut 200 000 (centaines de mille).

COMPARER DEUX GRANDS NOMBRES
1. Celui qui a le PLUS de chiffres est le plus grand.
2. Ã€ nombre de chiffres Ã©gal, on compare chiffre par chiffre en partant de la gauche.
Exemple : 530 200 > 529 999 car 3 > 2 au rang des dizaines de mille.

Ã€ RETENIR : on regroupe les chiffres par 3 depuis la droite pour lire facilement.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ±Ø©

ÙŠÙÙƒØªØ¨ Ø§Ù„Ø¹Ø¯Ø¯ Ø¨Ø£Ù‚Ø³Ø§Ù… Ù…Ù† 3 Ø£Ø±Ù‚Ø§Ù…:
â€¦ Ø§Ù„Ù…Ù„Ø§ÙŠÙŠÙ† | Ø§Ù„Ø¢Ù„Ø§Ù | Ø§Ù„ÙˆØ­Ø¯Ø§Øª Ø§Ù„Ø¨Ø³ÙŠØ·Ø©
Ù…Ø«Ø§Ù„: 4 256 807 ÙŠÙÙ‚Ø±Ø£ Â«Ø£Ø±Ø¨Ø¹Ø© Ù…Ù„Ø§ÙŠÙŠÙ† ÙˆÙ…Ø¦ØªØ§Ù† ÙˆØ³ØªØ© ÙˆØ®Ù…Ø³ÙˆÙ† Ø£Ù„ÙÙ‹Ø§ ÙˆØ«Ù…Ø§Ù†Ù…Ø¦Ø© ÙˆØ³Ø¨Ø¹Ø©Â».

Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ù…Ø±Ø§ØªØ¨: Ù„ÙƒÙ„ Ø±Ù‚Ù… Ù‚ÙŠÙ…Ø© Ø­Ø³Ø¨ Ù…ÙˆÙ‚Ø¹Ù‡.
ÙÙŠ 4 256 807 â† Ø§Ù„Ø±Ù‚Ù… 2 ÙŠØ³Ø§ÙˆÙŠ 200 000.

Ù…Ù‚Ø§Ø±Ù†Ø© Ø¹Ø¯Ø¯ÙŠÙ† ÙƒØ¨ÙŠØ±ÙŠÙ†
1. Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø°ÙŠ ÙŠÙ…Ù„Ùƒ Ø£Ø±Ù‚Ø§Ù…Ù‹Ø§ Ø£ÙƒØ«Ø± Ù‡Ùˆ Ø§Ù„Ø£ÙƒØ¨Ø±.
2. Ø¹Ù†Ø¯ Ø§Ù„ØªØ³Ø§ÙˆÙŠ Ù†Ù‚Ø§Ø±Ù† Ø±Ù‚Ù…Ù‹Ø§ Ø±Ù‚Ù…Ù‹Ø§ Ù…Ù† Ø§Ù„ÙŠØ³Ø§Ø±.
Ù…Ø«Ø§Ù„: 530 200 > 529 999.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres';

update public.chapters c set
  lesson_fr = 'LES NOMBRES DÃ‰CIMAUX

Un nombre dÃ©cimal a une PARTIE ENTIÃˆRE et une PARTIE DÃ‰CIMALE sÃ©parÃ©es par une virgule :
12,45 â†’ 12 est la partie entiÃ¨re, 45 la partie dÃ©cimale.
4 = 4 dixiÃ¨mes (0,4) ; 5 = 5 centiÃ¨mes (0,05).

COMPARER
On compare d''abord les parties entiÃ¨res, puis chiffre par chiffre aprÃ¨s la virgule :
3,25 < 3,4 car 2 dixiÃ¨mes < 4 dixiÃ¨mes.
Attention : 3,4 = 3,40 (on peut ajouter des zÃ©ros Ã  droite).

ADDITIONNER / SOUSTRAIRE
On aligne les virgules l''une sous l''autre :
  12,45
+  3,80
= 16,25

Ã€ RETENIR : la virgule sÃ©pare les unitÃ©s des dixiÃ¨mes â€” bien l''aligner dans les opÃ©rations.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠØ©

Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠ Ù„Ù‡ Ø¬Ø²Ø¡ ØµØ­ÙŠØ­ ÙˆØ¬Ø²Ø¡ Ø¹Ø´Ø±ÙŠ ØªÙØµÙ„ Ø¨ÙŠÙ†Ù‡Ù…Ø§ ÙØ§ØµÙ„Ø©:
12.45 â† 12 Ù‡Ùˆ Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØµØ­ÙŠØ­ Ùˆ45 Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø¹Ø´Ø±ÙŠ.
4 = 4 Ø£Ø¹Ø´Ø§Ø± (0.4) Ø› 5 = 5 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø© (0.05).

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ø¬Ø²Ø£ÙŠÙ† Ø§Ù„ØµØ­ÙŠØ­ÙŠÙ† Ø£ÙˆÙ„Ø§Ù‹ØŒ Ø«Ù… Ø±Ù‚Ù…Ù‹Ø§ Ø±Ù‚Ù…Ù‹Ø§ Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø©:
3.25 < 3.4 Ù„Ø£Ù† Ø¹ÙØ´Ø±ÙŠÙ† < 4 Ø£Ø¹Ø´Ø§Ø±.
Ù…Ù„Ø§Ø­Ø¸Ø©: 3.4 = 3.40.

Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­: Ù†ÙØ­Ø§Ø°ÙŠ Ø§Ù„ÙØ§ØµÙ„Ø© ØªØ­Øª Ø§Ù„ÙØ§ØµÙ„Ø© Ø«Ù… Ù†Ø­Ø³Ø¨.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'nombres-decimaux';

update public.chapters c set
  lesson_fr = 'LA PROPORTIONNALITÃ‰

Deux grandeurs sont PROPORTIONNELLES quand on passe de l''une Ã  l''autre en multipliant toujours par le mÃªme nombre (le coefficient).

Exemple : 1 baguette coÃ»te 15 DA.
2 baguettes â†’ 30 DA, 5 baguettes â†’ 75 DA. Le coefficient est 15.

LA RÃˆGLE DE TROIS
3 cahiers coÃ»tent 120 DA. Combien coÃ»tent 7 cahiers ?
1. Prix d''un cahier : 120 Ã· 3 = 40 DA (passage Ã  l''unitÃ©).
2. Prix de 7 cahiers : 40 Ã— 7 = 280 DA.

RECONNAÃŽTRE UN TABLEAU PROPORTIONNEL
Les quotients colonne par colonne doivent Ãªtre Ã‰GAUX :
2â†’10, 3â†’15, 5â†’25 : oui (Ã—5 partout).
2â†’10, 3â†’14 : non (Ã—5 puis Ã—4,67).

Ã€ RETENIR : proportionnel = mÃªme multiplicateur partout.',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ©

Ù…Ù‚Ø¯Ø§Ø±Ø§Ù† Ù…ØªÙ†Ø§Ø³Ø¨Ø§Ù† Ø¥Ø°Ø§ Ø§Ù†ØªÙ‚Ù„Ù†Ø§ Ù…Ù† Ø§Ù„Ø£ÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø«Ø§Ù†ÙŠ Ø¨Ø§Ù„Ø¶Ø±Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ ÙÙŠ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯ (Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„ØªÙ†Ø§Ø³Ø¨).

Ù…Ø«Ø§Ù„: Ø®Ø¨Ø²Ø© ÙˆØ§Ø­Ø¯Ø© Ø¨Ù€ 15 Ø¯Ø¬.
Ø®Ø¨Ø²ØªØ§Ù† â† 30 Ø¯Ø¬ØŒ 5 Ø®Ø¨Ø²Ø§Øª â† 75 Ø¯Ø¬. Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ù‡Ùˆ 15.

Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø«Ù„Ø§Ø«Ø© (Ø§Ù„Ù…Ø±ÙˆØ± Ø¨Ø§Ù„ÙˆØ­Ø¯Ø©)
3 ÙƒØ±Ø§Ø±ÙŠØ³ Ø¨Ù€ 120 Ø¯Ø¬. ÙƒÙ… Ø«Ù…Ù† 7 ÙƒØ±Ø§Ø±ÙŠØ³ØŸ
1. Ø«Ù…Ù† Ø§Ù„ÙƒØ±Ø§Ø³: 120 Ã· 3 = 40 Ø¯Ø¬.
2. Ø«Ù…Ù† 7 ÙƒØ±Ø§Ø±ÙŠØ³: 40 Ã— 7 = 280 Ø¯Ø¬.

Ø¬Ø¯ÙˆÙ„ ØªÙ†Ø§Ø³Ø¨ÙŠ: Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ø³Ù…Ø© Ù…ØªØ³Ø§ÙˆÙ ÙÙŠ ÙƒÙ„ Ø§Ù„Ø£Ø¹Ù…Ø¯Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

update public.chapters c set
  lesson_fr = 'LES MESURES

LONGUEURS â€” unitÃ© principale : le mÃ¨tre (m)
km | hm | dam | m | dm | cm | mm
1 km = 1 000 m ; 1 m = 100 cm.
Pour convertir : on dÃ©cale la virgule d''un rang par colonne.
3,5 km = 3 500 m.

MASSES â€” unitÃ© principale : le gramme (g)
kg | hg | dag | g | dg | cg | mg
1 kg = 1 000 g. Une pastÃ¨que â‰ˆ 4 kg, une piÃ¨ce de monnaie â‰ˆ 7 g.

CAPACITÃ‰S â€” unitÃ© principale : le litre (L)
1 L = 100 cL = 1 000 mL. Une bouteille d''eau = 1,5 L.

Ã€ RETENIR : toujours vÃ©rifier que les deux mesures sont dans la MÃŠME unitÃ© avant de comparer ou d''additionner.',
  lesson_ar = 'Ø§Ù„Ù‚ÙŠØ§Ø³

Ø§Ù„Ø£Ø·ÙˆØ§Ù„ â€” Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©: Ø§Ù„Ù…ØªØ± (Ù…)
ÙƒÙ… | Ù‡Ù… | Ø¯Ø§Ù… | Ù… | Ø¯Ø³Ù… | Ø³Ù… | Ù…Ù„Ù…
1 ÙƒÙ… = 1000 Ù… Ø› 1 Ù… = 100 Ø³Ù….
Ù„Ù„ØªØ­ÙˆÙŠÙ„ Ù†Ù†Ù‚Ù„ Ø§Ù„ÙØ§ØµÙ„Ø© Ø±ØªØ¨Ø© ÙˆØ§Ø­Ø¯Ø© Ù„ÙƒÙ„ Ø¹Ù…ÙˆØ¯: 3.5 ÙƒÙ… = 3500 Ù….

Ø§Ù„ÙƒØªÙ„ â€” Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©: Ø§Ù„ØºØ±Ø§Ù… (Øº)
1 ÙƒØº = 1000 Øº. Ø¯Ù„Ø§Ø¹Ø© â‰ˆ 4 ÙƒØºØŒ Ù‚Ø·Ø¹Ø© Ù†Ù‚Ø¯ÙŠØ© â‰ˆ 7 Øº.

Ø§Ù„Ø³Ø¹Ø§Øª â€” Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©: Ø§Ù„Ù„ØªØ± (Ù„)
1 Ù„ = 100 Ø³Ù„ = 1000 Ù…Ù„.

ØªØ°ÙƒØ±: Ù‚Ø¨Ù„ Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø£Ùˆ Ø§Ù„Ø¬Ù…Ø¹ Ù†ÙˆØ­Ù‘Ø¯ Ø§Ù„ÙˆØ­Ø¯Ø© Ø¯Ø§Ø¦Ù…Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'mesures';

update public.chapters c set
  lesson_fr = 'PÃ‰RIMÃˆTRES ET AIRES

LE PÃ‰RIMÃˆTRE = la longueur du tour d''une figure (en m, cmâ€¦).
â€¢ CarrÃ© de cÃ´tÃ© c : P = 4 Ã— c
â€¢ Rectangle : P = 2 Ã— (L + l)
Exemple : rectangle de 8 cm sur 5 cm â†’ P = 2 Ã— 13 = 26 cm.

L''AIRE = la surface occupÃ©e (en mÂ², cmÂ²â€¦).
â€¢ CarrÃ© : A = c Ã— c
â€¢ Rectangle : A = L Ã— l
â€¢ Triangle : A = (base Ã— hauteur) Ã· 2
Exemple : rectangle 8 Ã— 5 â†’ A = 40 cmÂ².

NE PAS CONFONDRE
Le pÃ©rimÃ¨tre se mesure en cm, l''aire en cmÂ².
Deux figures peuvent avoir le mÃªme pÃ©rimÃ¨tre et des aires diffÃ©rentes !

Ã€ RETENIR : pÃ©rimÃ¨tre = le tour ; aire = l''intÃ©rieur.',
  lesson_ar = 'Ø§Ù„Ù…Ø­ÙŠØ·Ø§Øª ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø§Øª

Ø§Ù„Ù…Ø­ÙŠØ· = Ø·ÙˆÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Ù† Ø­ÙˆÙ„ Ø§Ù„Ø´ÙƒÙ„ (Ø¨Ø§Ù„Ù…ØªØ± Ø£Ùˆ Ø§Ù„Ø³Ù…).
â€¢ Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ c: Ø§Ù„Ù…Ø­ÙŠØ· = 4 Ã— c
â€¢ Ù…Ø³ØªØ·ÙŠÙ„: Ø§Ù„Ù…Ø­ÙŠØ· = 2 Ã— (Ø§Ù„Ø·ÙˆÙ„ + Ø§Ù„Ø¹Ø±Ø¶)
Ù…Ø«Ø§Ù„: Ù…Ø³ØªØ·ÙŠÙ„ 8 Ø³Ù… Ã— 5 Ø³Ù… â† Ø§Ù„Ù…Ø­ÙŠØ· = 26 Ø³Ù….

Ø§Ù„Ù…Ø³Ø§Ø­Ø© = Ø§Ù„Ø³Ø·Ø­ Ø§Ù„Ù…Ø´ØºÙˆÙ„ (Ø¨Ø§Ù„Ù…Â² Ø£Ùˆ Ø§Ù„Ø³Ù…Â²).
â€¢ Ø§Ù„Ù…Ø±Ø¨Ø¹: c Ã— c
â€¢ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„: Ø§Ù„Ø·ÙˆÙ„ Ã— Ø§Ù„Ø¹Ø±Ø¶
â€¢ Ø§Ù„Ù…Ø«Ù„Ø«: (Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹) Ã· 2
Ù…Ø«Ø§Ù„: Ù…Ø³ØªØ·ÙŠÙ„ 8 Ã— 5 â† Ø§Ù„Ù…Ø³Ø§Ø­Ø© = 40 Ø³Ù…Â².

Ù„Ø§ ØªØ®Ù„Ø·: Ø§Ù„Ù…Ø­ÙŠØ· Ø¨Ø§Ù„Ø³Ù… ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø© Ø¨Ø§Ù„Ø³Ù…Â².'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'perimetres-aires';

update public.chapters c set
  lesson_fr = 'FIGURES ET SOLIDES

LES POLYGONES (figures Ã  cÃ´tÃ©s droits)
â€¢ Triangle : 3 cÃ´tÃ©s â€” Ã©quilatÃ©ral (3 Ã©gaux), isocÃ¨le (2 Ã©gaux), rectangle (1 angle droit).
â€¢ QuadrilatÃ¨res : carrÃ© (4 cÃ´tÃ©s Ã©gaux + 4 angles droits), rectangle, losange.

LE CERCLE
â€¢ Centre O, RAYON r (du centre au bord), DIAMÃˆTRE d = 2 Ã— r.

LES SOLIDES
â€¢ Cube : 6 faces carrÃ©es, 8 sommets, 12 arÃªtes.
â€¢ PavÃ© droit : 6 faces rectangulaires.
â€¢ Cylindre, cÃ´ne, boule : surfaces courbes.

VOCABULAIRE : face (surface plate), arÃªte (segment entre 2 faces), sommet (point de rencontre).

Ã€ RETENIR : un carrÃ© est aussi un rectangle ET un losange particulier.',
  lesson_ar = 'Ø§Ù„Ø£Ø´ÙƒØ§Ù„ Ø§Ù„Ù‡Ù†Ø¯Ø³ÙŠØ© ÙˆØ§Ù„Ù…Ø¬Ø³Ù…Ø§Øª

Ø§Ù„Ù…Ø¶Ù„Ø¹Ø§Øª
â€¢ Ø§Ù„Ù…Ø«Ù„Ø«: 3 Ø£Ø¶Ù„Ø§Ø¹ â€” Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹ØŒ Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ†ØŒ Ù‚Ø§Ø¦Ù….
â€¢ Ø§Ù„Ø±Ø¨Ø§Ø¹ÙŠØ§Øª: Ø§Ù„Ù…Ø±Ø¨Ø¹ (4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªÙ‚Ø§ÙŠØ³Ø© + 4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©)ØŒ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„ØŒ Ø§Ù„Ù…Ø¹ÙŠÙ‘Ù†.

Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©
Ø§Ù„Ù…Ø±ÙƒØ² OØŒ Ù†ØµÙ Ø§Ù„Ù‚Ø·Ø± rØŒ Ø§Ù„Ù‚Ø·Ø± = 2 Ã— r.

Ø§Ù„Ù…Ø¬Ø³Ù…Ø§Øª
â€¢ Ø§Ù„Ù…ÙƒØ¹Ø¨: 6 Ø£ÙˆØ¬Ù‡ Ù…Ø±Ø¨Ø¹Ø©ØŒ 8 Ø±Ø¤ÙˆØ³ØŒ 12 Ø­Ø±ÙÙ‹Ø§.
â€¢ Ù…ØªÙˆØ§Ø²ÙŠ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„Ø§Øª: 6 Ø£ÙˆØ¬Ù‡ Ù…Ø³ØªØ·ÙŠÙ„Ø©.
â€¢ Ø§Ù„Ø£Ø³Ø·ÙˆØ§Ù†Ø© ÙˆØ§Ù„Ù…Ø®Ø±ÙˆØ· ÙˆØ§Ù„ÙƒØ±Ø©: Ø³Ø·ÙˆØ­ Ù…Ù†Ø­Ù†ÙŠØ©.

ØªØ°ÙƒØ±: Ø§Ù„Ù…Ø±Ø¨Ø¹ Ù‡Ùˆ Ù…Ø³ØªØ·ÙŠÙ„ Ø®Ø§Øµ ÙˆÙ…Ø¹ÙŠÙ‘Ù† Ø®Ø§Øµ ÙÙŠ Ø¢Ù† ÙˆØ§Ø­Ø¯.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'geometrie';

update public.chapters c set
  lesson_fr = 'RÃ‰SOUDRE UN PROBLÃˆME â€” LA MÃ‰THODE

Ã‰TAPE 1 â€” LIRE
Lire l''Ã©noncÃ© DEUX fois. Souligner la question.

Ã‰TAPE 2 â€” CHERCHER LES DONNÃ‰ES
Quelles informations sont utiles ? Y en a-t-il d''inutiles ?

Ã‰TAPE 3 â€” CHOISIR L''OPÃ‰RATION
â€¢ Â« en tout Â», Â« ensemble Â» â†’ addition
â€¢ Â« reste Â», Â« diffÃ©rence Â», Â« de plus que Â» â†’ soustraction
â€¢ Â« chacun â€¦ fois Â», Â« par paquet de Â» â†’ multiplication
â€¢ Â« partager Â», Â« rÃ©partir Â» â†’ division

Ã‰TAPE 4 â€” CALCULER PUIS VÃ‰RIFIER
Poser l''opÃ©ration, Ã©crire la PHRASE RÃ‰PONSE avec l''unitÃ©.
Se demander : Â« ma rÃ©ponse est-elle logique ? Â»

EXEMPLE : Un car transporte 4 groupes de 27 Ã©lÃ¨ves. Combien d''Ã©lÃ¨ves en tout ?
4 Ã— 27 = 108. â†’ Le car transporte 108 Ã©lÃ¨ves.',
  lesson_ar = 'Ø­Ù„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø§Øª â€” Ø§Ù„Ø·Ø±ÙŠÙ‚Ø©

Ø§Ù„Ø®Ø·ÙˆØ© 1 â€” Ø§Ù„Ù‚Ø±Ø§Ø¡Ø©: Ù†Ù‚Ø±Ø£ Ø§Ù„Ù†Øµ Ù…Ø±ØªÙŠÙ† ÙˆÙ†Ø³Ø·Ù‘Ø± ØªØ­Øª Ø§Ù„Ø³Ø¤Ø§Ù„.

Ø§Ù„Ø®Ø·ÙˆØ© 2 â€” Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„Ù…Ø¹Ø·ÙŠØ§Øª Ø§Ù„Ù…ÙÙŠØ¯Ø©.

Ø§Ù„Ø®Ø·ÙˆØ© 3 â€” Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¹Ù…Ù„ÙŠØ©
â€¢ Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â»ØŒ Â«Ù…Ø¹Ù‹Ø§Â» â† Ø§Ù„Ø¬Ù…Ø¹
â€¢ Â«Ø§Ù„Ø¨Ø§Ù‚ÙŠÂ»ØŒ Â«Ø§Ù„ÙØ±Ù‚Â» â† Ø§Ù„Ø·Ø±Ø­
â€¢ Â«ÙƒÙ„ ÙˆØ§Ø­Ø¯ â€¦ Ù…Ø±Ø©Â» â† Ø§Ù„Ø¶Ø±Ø¨
â€¢ Â«Ù†Ù‚Ø³Ù…Â»ØŒ Â«Ù†ÙˆØ²Ø¹Â» â† Ø§Ù„Ù‚Ø³Ù…Ø©

Ø§Ù„Ø®Ø·ÙˆØ© 4 â€” Ø§Ù„Ø­Ø³Ø§Ø¨ Ø«Ù… Ø§Ù„ØªØ­Ù‚Ù‚
Ù†Ù†Ø¬Ø² Ø§Ù„Ø¹Ù…Ù„ÙŠØ© ÙˆÙ†ÙƒØªØ¨ Ø¬Ù…Ù„Ø© Ø§Ù„Ø¬ÙˆØ§Ø¨ Ù…Ø¹ Ø§Ù„ÙˆØ­Ø¯Ø©ØŒ ÙˆÙ†ØªØ³Ø§Ø¡Ù„: Ù‡Ù„ Ø§Ù„Ø¬ÙˆØ§Ø¨ Ù…Ù†Ø·Ù‚ÙŠØŸ

Ù…Ø«Ø§Ù„: Ø­Ø§ÙÙ„Ø© ØªÙ†Ù‚Ù„ 4 Ø£ÙÙˆØ§Ø¬ Ù…Ù† 27 ØªÙ„Ù…ÙŠØ°Ù‹Ø§. ÙƒÙ… ØªÙ„Ù…ÙŠØ°Ù‹Ø§ ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸ
4 Ã— 27 = 108 ØªÙ„Ù…ÙŠØ°Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'problemes';

-- ============ 4AM ============

update public.chapters c set
  lesson_fr = 'CALCUL LITTÃ‰RAL ET IDENTITÃ‰S REMARQUABLES

DÃ‰VELOPPER = transformer un produit en somme.
â€¢ Simple distributivitÃ© : k(a + b) = ka + kb
â€¢ Double distributivitÃ© : (a + b)(c + d) = ac + ad + bc + bd

LES 3 IDENTITÃ‰S REMARQUABLES
â€¢ (a + b)Â² = aÂ² + 2ab + bÂ²
â€¢ (a âˆ’ b)Â² = aÂ² âˆ’ 2ab + bÂ²
â€¢ (a + b)(a âˆ’ b) = aÂ² âˆ’ bÂ²

Exemples :
(x + 3)Â² = xÂ² + 6x + 9
(2x âˆ’ 5)Â² = 4xÂ² âˆ’ 20x + 25
(x + 4)(x âˆ’ 4) = xÂ² âˆ’ 16

FACTORISER = transformer une somme en produit (sens inverse).
â€¢ Facteur commun : 3xÂ² + 6x = 3x(x + 2)
â€¢ Avec les identitÃ©s : xÂ² âˆ’ 25 = (x + 5)(x âˆ’ 5)

Ã€ RETENIR AU BEM : reconnaÃ®tre aÂ² âˆ’ bÂ² est le rÃ©flexe le plus payant.',
  lesson_ar = 'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ ÙˆØ§Ù„Ù…ØªØ·Ø§Ø¨Ù‚Ø§Øª Ø§Ù„Ø´Ù‡ÙŠØ±Ø©

Ø§Ù„Ù†Ø´Ø± = ØªØ­ÙˆÙŠÙ„ Ø¬Ø¯Ø§Ø¡ Ø¥Ù„Ù‰ Ù…Ø¬Ù…ÙˆØ¹.
â€¢ Ø§Ù„ØªÙˆØ²ÙŠØ¹ÙŠØ© Ø§Ù„Ø¨Ø³ÙŠØ·Ø©: k(a + b) = ka + kb
â€¢ Ø§Ù„ØªÙˆØ²ÙŠØ¹ÙŠØ© Ø§Ù„Ù…Ø¶Ø§Ø¹ÙØ©: (a + b)(c + d) = ac + ad + bc + bd

Ø§Ù„Ù…ØªØ·Ø§Ø¨Ù‚Ø§Øª Ø§Ù„Ø´Ù‡ÙŠØ±Ø© Ø§Ù„Ø«Ù„Ø§Ø«
â€¢ (a + b)Â² = aÂ² + 2ab + bÂ²
â€¢ (a âˆ’ b)Â² = aÂ² âˆ’ 2ab + bÂ²
â€¢ (a + b)(a âˆ’ b) = aÂ² âˆ’ bÂ²

Ø£Ù…Ø«Ù„Ø©:
(x + 3)Â² = xÂ² + 6x + 9
(x + 4)(x âˆ’ 4) = xÂ² âˆ’ 16

Ø§Ù„ØªØ­Ù„ÙŠÙ„ = ØªØ­ÙˆÙŠÙ„ Ù…Ø¬Ù…ÙˆØ¹ Ø¥Ù„Ù‰ Ø¬Ø¯Ø§Ø¡.
â€¢ Ø§Ù„Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…Ø´ØªØ±Ùƒ: 3xÂ² + 6x = 3x(x + 2)
â€¢ Ø¨Ø§Ù„Ù…ØªØ·Ø§Ø¨Ù‚Ø§Øª: xÂ² âˆ’ 25 = (x + 5)(x âˆ’ 5)'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral';

update public.chapters c set
  lesson_fr = 'Ã‰QUATIONS ET INÃ‰QUATIONS DU 1er DEGRÃ‰

RÃ‰SOUDRE UNE Ã‰QUATION
Isoler x en faisant la mÃªme opÃ©ration des deux cÃ´tÃ©s :
7x âˆ’ 4 = 3x + 12
7x âˆ’ 3x = 12 + 4
4x = 16 â†’ x = 4

Ã‰QUATION PRODUIT NUL
Un produit est nul si l''un des facteurs est nul :
(x âˆ’ 2)(x + 5) = 0 â†’ x = 2 ou x = âˆ’5

LES INÃ‰QUATIONS
MÃªmes rÃ¨gles, avec UNE exception capitale :
quand on multiplie ou divise par un nombre NÃ‰GATIF, on CHANGE le sens de l''inÃ©galitÃ©.
âˆ’2x < 10 â†’ x > âˆ’5

On reprÃ©sente les solutions sur une droite graduÃ©e (crochet vers les solutions).

Ã€ RETENIR : toujours vÃ©rifier la solution en la remplaÃ§ant dans l''Ã©quation de dÃ©part.',
  lesson_ar = 'Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª ÙˆØ§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø§Øª Ù…Ù† Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰

Ø­Ù„ Ù…Ø¹Ø§Ø¯Ù„Ø©: Ù†Ø¹Ø²Ù„ x Ø¨Ø¥Ø¬Ø±Ø§Ø¡ Ù†ÙØ³ Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø¹Ù„Ù‰ Ø§Ù„Ø·Ø±ÙÙŠÙ†:
7x âˆ’ 4 = 3x + 12
4x = 16 â† x = 4

Ù…Ø¹Ø§Ø¯Ù„Ø© Ø¬Ø¯Ø§Ø¡ Ù…Ø¹Ø¯ÙˆÙ…
Ø§Ù„Ø¬Ø¯Ø§Ø¡ Ù…Ø¹Ø¯ÙˆÙ… Ø¥Ø°Ø§ Ø§Ù†Ø¹Ø¯Ù… Ø£Ø­Ø¯ Ø¹ÙˆØ§Ù…Ù„Ù‡:
(x âˆ’ 2)(x + 5) = 0 â† x = 2 Ø£Ùˆ x = âˆ’5

Ø§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø§Øª
Ù†ÙØ³ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ù…Ø¹ Ø§Ø³ØªØ«Ù†Ø§Ø¡ Ù…Ù‡Ù…:
Ø¹Ù†Ø¯ Ø§Ù„Ø¶Ø±Ø¨ Ø£Ùˆ Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ Ø¹Ø¯Ø¯ Ø³Ø§Ù„Ø¨ Ù†ØºÙŠÙ‘Ø± Ø§ØªØ¬Ø§Ù‡ Ø§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø©.
âˆ’2x < 10 â† x > âˆ’5

Ù†Ù…Ø«Ù„ Ø§Ù„Ø­Ù„ÙˆÙ„ Ø¹Ù„Ù‰ Ù…Ø³ØªÙ‚ÙŠÙ… Ù…Ø¯Ø±Ø¬.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'equations';

update public.chapters c set
  lesson_fr = 'SYSTÃˆMES DE DEUX Ã‰QUATIONS

Un systÃ¨me : trouver x ET y qui vÃ©rifient DEUX Ã©quations Ã  la fois.
{ x + y = 10
{ 2x âˆ’ y = 2

MÃ‰THODE PAR SUBSTITUTION
1. Isoler une inconnue : y = 10 âˆ’ x.
2. Remplacer dans l''autre Ã©quation : 2x âˆ’ (10 âˆ’ x) = 2 â†’ 3x = 12 â†’ x = 4.
3. En dÃ©duire y = 10 âˆ’ 4 = 6.

MÃ‰THODE PAR COMBINAISON
On additionne les deux Ã©quations pour Ã©liminer y :
(x + y) + (2x âˆ’ y) = 10 + 2 â†’ 3x = 12 â†’ x = 4, puis y = 6.

VÃ‰RIFICATION : 4 + 6 = 10 âœ“ et 2Ã—4 âˆ’ 6 = 2 âœ“

PROBLÃˆMES TYPES BEM : Â« 5 stylos et 3 cahiers coÃ»tent 310 DAâ€¦ Â» â†’
poser x = prix du stylo, y = prix du cahier, traduire en 2 Ã©quations.',
  lesson_ar = 'Ø¬Ù…Ù„Ø© Ù…Ø¹Ø§Ø¯Ù„ØªÙŠÙ† Ù…Ù† Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰

Ø§Ù„Ø¬Ù…Ù„Ø©: Ø¥ÙŠØ¬Ø§Ø¯ x Ùˆy ÙŠØ­Ù‚Ù‚Ø§Ù† Ù…Ø¹Ø§Ø¯Ù„ØªÙŠÙ† Ù…Ø¹Ù‹Ø§.
{ x + y = 10
{ 2x âˆ’ y = 2

Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªØ¹ÙˆÙŠØ¶
1. Ù†Ø¹Ø²Ù„ Ù…Ø¬Ù‡ÙˆÙ„Ø§Ù‹: y = 10 âˆ’ x.
2. Ù†Ø¹ÙˆØ¶ ÙÙŠ Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ø£Ø®Ø±Ù‰: 2x âˆ’ (10 âˆ’ x) = 2 â† 3x = 12 â† x = 4.
3. Ù†Ø³ØªÙ†ØªØ¬ y = 6.

Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¬Ù…Ø¹ (Ø§Ù„ØªØ¢Ù„Ù)
Ù†Ø¬Ù…Ø¹ Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„ØªÙŠÙ† Ù„Ø­Ø°Ù y:
3x = 12 â† x = 4 Ø«Ù… y = 6.

Ø§Ù„ØªØ­Ù‚Ù‚: 4 + 6 = 10 âœ“ Ùˆ 8 âˆ’ 6 = 2 âœ“'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'systemes';

update public.chapters c set
  lesson_fr = 'FONCTIONS LINÃ‰AIRES ET AFFINES

FONCTION LINÃ‰AIRE : f(x) = aÂ·x
â€¢ Traduit une situation de PROPORTIONNALITÃ‰.
â€¢ ReprÃ©sentation : droite passant par l''ORIGINE.
â€¢ a est le coefficient : f(x) = 3x â†’ f(5) = 15.

FONCTION AFFINE : f(x) = aÂ·x + b
â€¢ Droite ne passant pas forcÃ©ment par l''origine.
â€¢ a = COEFFICIENT DIRECTEUR (la pente) ; b = ORDONNÃ‰E Ã€ L''ORIGINE.
â€¢ f(x) = 2x + 3 : la droite coupe l''axe des ordonnÃ©es en 3.

CALCULER a Ã€ PARTIR DE DEUX POINTS
a = (f(xâ‚‚) âˆ’ f(xâ‚)) Ã· (xâ‚‚ âˆ’ xâ‚)

LIRE UN GRAPHIQUE
â€¢ Image de 2 : la valeur de f(2) (on lit verticalement).
â€¢ AntÃ©cÃ©dent de 5 : le x tel que f(x) = 5 (on lit horizontalement).

Ã€ RETENIR : linÃ©aire = proportionnalitÃ© = droite par l''origine.',
  lesson_ar = 'Ø§Ù„Ø¯ÙˆØ§Ù„ Ø§Ù„Ø®Ø·ÙŠØ© ÙˆØ§Ù„ØªØ¢Ù„ÙÙŠØ©

Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ø®Ø·ÙŠØ©: f(x) = aÂ·x
â€¢ ØªØ¹Ø¨Ù‘Ø± Ø¹Ù† ÙˆØ¶Ø¹ÙŠØ© ØªÙ†Ø§Ø³Ø¨ÙŠØ©.
â€¢ ØªÙ…Ø«ÙŠÙ„Ù‡Ø§ Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙ…Ø± Ø¨Ø§Ù„Ù…Ø¨Ø¯Ø£.
â€¢ a Ù‡Ùˆ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„: f(x) = 3x â† f(5) = 15.

Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„ØªØ¢Ù„ÙÙŠØ©: f(x) = aÂ·x + b
â€¢ Ù…Ø³ØªÙ‚ÙŠÙ… Ù„Ø§ ÙŠÙ…Ø± Ø¨Ø§Ù„Ø¶Ø±ÙˆØ±Ø© Ø¨Ø§Ù„Ù…Ø¨Ø¯Ø£.
â€¢ a Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…ÙˆØ¬Ù‡ (Ø§Ù„Ù…ÙŠÙ„) Ùˆ b Ø§Ù„ØªØ±ØªÙŠØ¨ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø¨Ø¯Ø£.

Ø­Ø³Ø§Ø¨ a Ù…Ù† Ù†Ù‚Ø·ØªÙŠÙ†:
a = (f(xâ‚‚) âˆ’ f(xâ‚)) Ã· (xâ‚‚ âˆ’ xâ‚)

Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø¨ÙŠØ§Ù†:
â€¢ ØµÙˆØ±Ø© 2 Ù‡ÙŠ f(2). â€¢ Ø³Ø§Ø¨Ù‚Ø© 5 Ù‡ÙŠ x Ø­ÙŠØ« f(x) = 5.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'fonctions';

update public.chapters c set
  lesson_fr = 'STATISTIQUES

VOCABULAIRE
â€¢ Effectif : nombre de fois qu''une valeur apparaÃ®t.
â€¢ Effectif total N : somme de tous les effectifs.
â€¢ FrÃ©quence = effectif Ã· N (en fraction, dÃ©cimal ou %).

MOYENNE PONDÃ‰RÃ‰E
Notes : 12 (coef 2) et 15 (coef 3).
Moyenne = (12Ã—2 + 15Ã—3) Ã· (2+3) = 69 Ã· 5 = 13,8.

MÃ‰DIANE
La valeur qui partage la sÃ©rie ORDONNÃ‰E en deux moitiÃ©s.
SÃ©rie : 8, 10, 12, 15, 19 â†’ mÃ©diane = 12.
(Avec un nombre pair de valeurs : moyenne des deux du milieu.)

Ã‰TENDUE = valeur max âˆ’ valeur min.
SÃ©rie ci-dessus : 19 âˆ’ 8 = 11.

Ã€ RETENIR : toujours ORDONNER la sÃ©rie avant de chercher la mÃ©diane.',
  lesson_ar = 'Ø§Ù„Ø¥Ø­ØµØ§Ø¡

Ù…ØµØ·Ù„Ø­Ø§Øª
â€¢ Ø§Ù„ØªÙƒØ±Ø§Ø±: Ø¹Ø¯Ø¯ Ù…Ø±Ø§Øª Ø¸Ù‡ÙˆØ± Ø§Ù„Ù‚ÙŠÙ…Ø©.
â€¢ Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„ÙƒÙ„ÙŠ N: Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ØªÙƒØ±Ø§Ø±Ø§Øª.
â€¢ Ø§Ù„ØªÙˆØ§ØªØ± = Ø§Ù„ØªÙƒØ±Ø§Ø± Ã· N (ÙƒØ³Ø± Ø£Ùˆ Ù†Ø³Ø¨Ø© Ù…Ø¦ÙˆÙŠØ©).

Ø§Ù„Ù…Ø¹Ø¯Ù„ Ø§Ù„Ù…ØªÙˆØ§Ø²Ù†
Ø¹Ù„Ø§Ù…ØªØ§Ù†: 12 (Ù…Ø¹Ø§Ù…Ù„ 2) Ùˆ15 (Ù…Ø¹Ø§Ù…Ù„ 3).
Ø§Ù„Ù…Ø¹Ø¯Ù„ = (12Ã—2 + 15Ã—3) Ã· 5 = 13.8.

Ø§Ù„ÙˆØ³ÙŠØ· (Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„ÙˆØ³Ø·Ù‰)
Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„ØªÙŠ ØªÙ‚Ø³Ù… Ø§Ù„Ø³Ù„Ø³Ù„Ø© Ø§Ù„Ù…Ø±ØªØ¨Ø© Ø¥Ù„Ù‰ Ù†ØµÙÙŠÙ†.
Ø§Ù„Ø³Ù„Ø³Ù„Ø©: 8ØŒ 10ØŒ 12ØŒ 15ØŒ 19 â† Ø§Ù„ÙˆØ³ÙŠØ· = 12.

Ø§Ù„Ù…Ø¯Ù‰ = Ø£ÙƒØ¨Ø± Ù‚ÙŠÙ…Ø© âˆ’ Ø£ØµØºØ± Ù‚ÙŠÙ…Ø© = 19 âˆ’ 8 = 11.

ØªØ°ÙƒØ±: Ù†Ø±ØªØ¨ Ø§Ù„Ø³Ù„Ø³Ù„Ø© Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ù‚Ø¨Ù„ Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„ÙˆØ³ÙŠØ·.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'statistiques';

update public.chapters c set
  lesson_fr = 'LE THÃ‰ORÃˆME DE THALÃˆS

CONFIGURATION
Deux droites sÃ©cantes en A, coupÃ©es par deux droites PARALLÃˆLES (MN) // (BC),
avec M sur (AB) et N sur (AC).

LE THÃ‰ORÃˆME
AM/AB = AN/AC = MN/BC

CALCULER UNE LONGUEUR
AM = 3, AB = 5, BC = 10. MN = ?
MN/BC = AM/AB â†’ MN = 10 Ã— 3/5 = 6.

LA RÃ‰CIPROQUE
Si AM/AB = AN/AC (points alignÃ©s dans le mÃªme ordre),
alors (MN) // (BC).

AGRANDISSEMENT / RÃ‰DUCTION
Le rapport k = AM/AB est le coefficient de rÃ©duction du triangle AMN
par rapport Ã  ABC. Les aires sont multipliÃ©es par kÂ².

Ã€ RETENIR AU BEM : Ã©crire les 3 rapports AVANT de remplacer par les valeurs.',
  lesson_ar = 'Ù…Ø¨Ø±Ù‡Ù†Ø© Ø·Ø§Ù„Ø³

Ø§Ù„ÙˆØ¶Ø¹ÙŠØ©
Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙ‚Ø§Ø·Ø¹Ø§Ù† ÙÙŠ A ÙŠÙ‚Ø·Ø¹Ù‡Ù…Ø§ Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù† (MN) // (BC)ØŒ
Ø­ÙŠØ« M Ø¹Ù„Ù‰ (AB) ÙˆN Ø¹Ù„Ù‰ (AC).

Ø§Ù„Ù…Ø¨Ø±Ù‡Ù†Ø©
AM/AB = AN/AC = MN/BC

Ø­Ø³Ø§Ø¨ Ø·ÙˆÙ„
AM = 3ØŒ AB = 5ØŒ BC = 10. ÙƒÙ… MNØŸ
MN = 10 Ã— 3/5 = 6.

Ø¹ÙƒØ³ Ù…Ø¨Ø±Ù‡Ù†Ø© Ø·Ø§Ù„Ø³
Ø¥Ø°Ø§ ÙƒØ§Ù† AM/AB = AN/AC (Ø¨Ù†ÙØ³ Ø§Ù„ØªØ±ØªÙŠØ¨) ÙØ¥Ù† (MN) // (BC).

Ø§Ù„ØªÙƒØ¨ÙŠØ± ÙˆØ§Ù„ØªØµØºÙŠØ±: Ø§Ù„Ù†Ø³Ø¨Ø© k = AM/ABØŒ ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø§Øª ØªÙØ¶Ø±Ø¨ ÙÙŠ kÂ².

Ù†ØµÙŠØ­Ø© Ù„Ù„Ø¨ÙŠÙ…: Ø§ÙƒØªØ¨ Ø§Ù„Ù†Ø³Ø¨ Ø§Ù„Ø«Ù„Ø§Ø« Ù‚Ø¨Ù„ Ø§Ù„ØªØ¹ÙˆÙŠØ¶ Ø¨Ø§Ù„Ù‚ÙŠÙ….'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'thales';

update public.chapters c set
  lesson_fr = 'TRIGONOMÃ‰TRIE DANS LE TRIANGLE RECTANGLE

Dans un triangle rectangle, pour un angle aigu Î± :
â€¢ cos Î± = cÃ´tÃ© ADJACENT Ã· hypotÃ©nuse
â€¢ sin Î± = cÃ´tÃ© OPPOSÃ‰ Ã· hypotÃ©nuse
â€¢ tan Î± = cÃ´tÃ© OPPOSÃ‰ Ã· cÃ´tÃ© ADJACENT

Moyen mnÃ©motechnique : CAH â€” SOH â€” TOA.

CALCULER UNE LONGUEUR
Triangle rectangle, angle 30Â°, hypotÃ©nuse 10 cm. CÃ´tÃ© opposÃ© ?
sin 30Â° = opposÃ©/10 â†’ opposÃ© = 10 Ã— sin 30Â° = 10 Ã— 0,5 = 5 cm.

CALCULER UN ANGLE
cos Î± = 4/5 = 0,8 â†’ Î± = cosâ»Â¹(0,8) â‰ˆ 37Â° (touche 2nde cos de la calculatrice).

RELATION FONDAMENTALE
cosÂ²Î± + sinÂ²Î± = 1
et tan Î± = sin Î± / cos Î±.

Ã€ RETENIR : cos et sin sont toujours entre 0 et 1 (l''hypotÃ©nuse est le plus grand cÃ´tÃ©).',
  lesson_ar = 'Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª ÙÙŠ Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù‚Ø§Ø¦Ù…

Ù…Ù† Ø£Ø¬Ù„ Ø²Ø§ÙˆÙŠØ© Ø­Ø§Ø¯Ø© Î± ÙÙŠ Ù…Ø«Ù„Ø« Ù‚Ø§Ø¦Ù…:
â€¢ Ø¬ØªØ§ Î± = Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ø¬Ø§ÙˆØ± Ã· Ø§Ù„ÙˆØªØ±
â€¢ Ø¬Ø§ Î± = Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ã· Ø§Ù„ÙˆØªØ±
â€¢ Ø¸Ø§ Î± = Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ã· Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ø¬Ø§ÙˆØ±

Ø­Ø³Ø§Ø¨ Ø·ÙˆÙ„
Ù…Ø«Ù„Ø« Ù‚Ø§Ø¦Ù…ØŒ Ø²Ø§ÙˆÙŠØ© 30Â°ØŒ Ø§Ù„ÙˆØªØ± 10 Ø³Ù…. Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ØŸ
Ø¬Ø§ 30Â° = Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„/10 â† Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ = 10 Ã— 0.5 = 5 Ø³Ù….

Ø­Ø³Ø§Ø¨ Ø²Ø§ÙˆÙŠØ©
Ø¬ØªØ§ Î± = 0.8 â† Î± = Ø¬ØªØ§â»Â¹(0.8) â‰ˆ 37Â°.

Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©
Ø¬ØªØ§Â²Î± + Ø¬Ø§Â²Î± = 1 ØŒ Ùˆ Ø¸Ø§ Î± = Ø¬Ø§ Î± Ã· Ø¬ØªØ§ Î±.

ØªØ°ÙƒØ±: Ø¬ØªØ§ ÙˆØ¬Ø§ Ù…Ø­ØµÙˆØ±Ø§Ù† Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø¨ÙŠÙ† 0 Ùˆ1.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'trigonometrie';

update public.chapters c set
  lesson_fr = 'GÃ‰OMÃ‰TRIE DANS L''ESPACE

VOLUMES Ã€ CONNAÃŽTRE
â€¢ PavÃ© droit : V = L Ã— l Ã— h
â€¢ Cube : V = cÂ³
â€¢ Cylindre : V = Ï€ rÂ² h
â€¢ PYRAMIDE : V = (aire de la base Ã— hauteur) Ã· 3
â€¢ CÃ”NE : V = (Ï€ rÂ² Ã— h) Ã· 3
â€¢ BOULE : V = (4/3) Ï€ rÂ³ ; sphÃ¨re (surface) : A = 4 Ï€ rÂ²

EXEMPLE
CÃ´ne de rayon 3 cm et hauteur 7 cm :
V = Ï€ Ã— 9 Ã— 7 Ã· 3 = 21Ï€ â‰ˆ 65,9 cmÂ³.

SECTIONS
â€¢ Section d''un pavÃ© par un plan parallÃ¨le Ã  une face â†’ rectangle identique.
â€¢ Section d''une pyramide par un plan parallÃ¨le Ã  la base â†’ rÃ©duction de la base (rapport k, aires Ã—kÂ², volumes Ã—kÂ³).

CONVERSIONS : 1 L = 1 dmÂ³ ; 1 000 L = 1 mÂ³.

Ã€ RETENIR : pyramide et cÃ´ne = Â« le tiers Â» du prisme/cylindre correspondant.',
  lesson_ar = 'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡

Ø§Ù„Ø­Ø¬ÙˆÙ… Ø§Ù„ÙˆØ§Ø¬Ø¨ Ø­ÙØ¸Ù‡Ø§
â€¢ Ù…ØªÙˆØ§Ø²ÙŠ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„Ø§Øª: V = Ø§Ù„Ø·ÙˆÙ„ Ã— Ø§Ù„Ø¹Ø±Ø¶ Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹
â€¢ Ø§Ù„Ù…ÙƒØ¹Ø¨: V = cÂ³
â€¢ Ø§Ù„Ø£Ø³Ø·ÙˆØ§Ù†Ø©: V = Ï€ rÂ² h
â€¢ Ø§Ù„Ù‡Ø±Ù…: V = (Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹) Ã· 3
â€¢ Ø§Ù„Ù…Ø®Ø±ÙˆØ·: V = (Ï€ rÂ² Ã— h) Ã· 3
â€¢ Ø§Ù„ÙƒØ±Ø©: V = (4/3) Ï€ rÂ³ ÙˆÙ…Ø³Ø§Ø­Ø© Ø³Ø·Ø­Ù‡Ø§ A = 4 Ï€ rÂ²

Ù…Ø«Ø§Ù„: Ù…Ø®Ø±ÙˆØ· Ù†ØµÙ Ù‚Ø·Ø±Ù‡ 3 Ø³Ù… ÙˆØ§Ø±ØªÙØ§Ø¹Ù‡ 7 Ø³Ù…:
V = 21Ï€ â‰ˆ 65.9 Ø³Ù…Â³.

Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹: Ù…Ù‚Ø·Ø¹ Ù‡Ø±Ù… Ø¨Ù…Ø³ØªÙˆÙ Ù…ÙˆØ§Ø²Ù Ù„Ù„Ù‚Ø§Ø¹Ø¯Ø© = ØªØµØºÙŠØ± Ø¨Ù†Ø³Ø¨Ø© k (Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª Ã—kÂ² ÙˆØ§Ù„Ø­Ø¬ÙˆÙ… Ã—kÂ³).

ØªØ­ÙˆÙŠÙ„Ø§Øª: 1 Ù„ = 1 Ø¯Ø³Ù…Â³ Ø› 1000 Ù„ = 1 Ù…Â³.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace';

-- ============ 3AS ============

update public.chapters c set
  lesson_fr = 'LIMITES ET CONTINUITÃ‰

LIMITES USUELLES EN Â±âˆž
â€¢ lim xâ¿ = +âˆž (n pair) ; pour un polynÃ´me, seule compte la plus haute puissance.
â€¢ lim 1/x = 0 quand x â†’ Â±âˆž.

FORMES INDÃ‰TERMINÃ‰ES : Â« âˆž âˆ’ âˆž Â», Â« âˆž/âˆž Â», Â« 0/0 Â», Â« 0Ã—âˆž Â».
Pour un quotient de polynÃ´mes en âˆž : factoriser par les plus hautes puissances.

ASYMPTOTES
â€¢ lim f = b (xâ†’âˆž) â†’ asymptote HORIZONTALE y = b.
â€¢ lim f = Â±âˆž (xâ†’a) â†’ asymptote VERTICALE x = a.
â€¢ f(x) âˆ’ (ax+b) â†’ 0 â†’ asymptote OBLIQUE y = ax + b.

CONTINUITÃ‰
f est continue en a si lim f(x) = f(a) quand x â†’ a.

THÃ‰ORÃˆME DES VALEURS INTERMÃ‰DIAIRES (TVI)
Si f est continue et STRICTEMENT MONOTONE sur [a;b] et si k est compris
entre f(a) et f(b), alors l''Ã©quation f(x) = k admet une UNIQUE solution
dans [a;b]. â†’ C''est l''outil classique du BAC pour prouver l''existence
d''une solution Î± et l''encadrer.',
  lesson_ar = 'Ø§Ù„Ù†Ù‡Ø§ÙŠØ§Øª ÙˆØ§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ©

Ù†Ù‡Ø§ÙŠØ§Øª Ù…Ø£Ù„ÙˆÙØ© Ø¹Ù†Ø¯ Â±âˆž
â€¢ Ù†Ù‡Ø§ÙŠØ© ÙƒØ«ÙŠØ± Ø­Ø¯ÙˆØ¯ ÙŠØ­Ø¯Ø¯Ù‡Ø§ Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¹Ù„Ù‰ Ø¯Ø±Ø¬Ø©.
â€¢ Ù†Ù‡Ø§ÙŠØ© 1/x ØªØ³Ø§ÙˆÙŠ 0 Ø¹Ù†Ø¯Ù…Ø§ x â†’ Â±âˆž.

Ø­Ø§Ù„Ø§Øª Ø¹Ø¯Ù… Ø§Ù„ØªØ¹ÙŠÙŠÙ†: Â«âˆž âˆ’ âˆžÂ»ØŒ Â«âˆž/âˆžÂ»ØŒ Â«0/0Â»ØŒ Â«0Ã—âˆžÂ».
Ù„Ø­Ø³Ø§Ø¨ Ù†Ù‡Ø§ÙŠØ© Ø­Ø§ØµÙ„ Ù‚Ø³Ù…Ø© ÙƒØ«ÙŠØ±ÙŠ Ø­Ø¯ÙˆØ¯ Ø¹Ù†Ø¯ âˆž Ù†ÙØ®Ø±Ø¬ Ø£ÙƒØ¨Ø± Ù‚ÙˆØ© Ø¹Ø§Ù…Ù„Ø§Ù‹ Ù…Ø´ØªØ±ÙƒÙ‹Ø§.

Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª Ø§Ù„Ù…Ù‚Ø§Ø±Ø¨Ø©
â€¢ Ù†Ù‡Ø§ÙŠØ© f ØªØ³Ø§ÙˆÙŠ b Ø¹Ù†Ø¯ âˆž â† Ù…Ù‚Ø§Ø±Ø¨ Ø£ÙÙ‚ÙŠ y = b.
â€¢ Ù†Ù‡Ø§ÙŠØ© f ØªØ³Ø§ÙˆÙŠ Â±âˆž Ø¹Ù†Ø¯ a â† Ù…Ù‚Ø§Ø±Ø¨ Ø´Ø§Ù‚ÙˆÙ„ÙŠ x = a.

Ø§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ©: f Ù…Ø³ØªÙ…Ø±Ø© ÙÙŠ a Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ù†Ù‡Ø§ÙŠØ© f Ø¹Ù†Ø¯ a ØªØ³Ø§ÙˆÙŠ f(a).

Ù…Ø¨Ø±Ù‡Ù†Ø© Ø§Ù„Ù‚ÙŠÙ… Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©: Ø¥Ø°Ø§ ÙƒØ§Ù†Øª f Ù…Ø³ØªÙ…Ø±Ø© ÙˆØ±ØªÙŠØ¨Ø© ØªÙ…Ø§Ù…Ù‹Ø§ Ø¹Ù„Ù‰ [a;b]
ÙˆÙƒØ§Ù† k Ù…Ø­ØµÙˆØ±Ù‹Ø§ Ø¨ÙŠÙ† f(a) Ùˆf(b) ÙØ¥Ù† Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© f(x) = k ØªÙ‚Ø¨Ù„ Ø­Ù„Ø§Ù‹ ÙˆØ­ÙŠØ¯Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'limites-continuite';

update public.chapters c set
  lesson_fr = 'DÃ‰RIVATION ET Ã‰TUDE DE FONCTIONS

DÃ‰RIVÃ‰ES USUELLES
â€¢ (xâ¿)'' = nÂ·xâ¿â»Â¹   â€¢ (1/x)'' = âˆ’1/xÂ²   â€¢ (âˆšx)'' = 1/(2âˆšx)
â€¢ (u + v)'' = u'' + v''   â€¢ (uÂ·v)'' = u''v + uv''
â€¢ (u/v)'' = (u''v âˆ’ uv'')/vÂ²

TANGENTE AU POINT D''ABSCISSE a
y = f''(a)(x âˆ’ a) + f(a)
f''(a) est le coefficient directeur de la tangente.

SENS DE VARIATION â€” LE CÅ’UR DE L''Ã‰TUDE
â€¢ f''(x) > 0 sur I â†’ f CROISSANTE sur I.
â€¢ f''(x) < 0 sur I â†’ f DÃ‰CROISSANTE sur I.
â€¢ f'' s''annule en changeant de signe â†’ EXTREMUM local.

PLAN D''Ã‰TUDE TYPE BAC
1. Domaine et limites aux bornes (+ asymptotes).
2. Calculer f''(x), Ã©tudier son signe.
3. Dresser le tableau de variations.
4. Tangentes / points particuliers, puis tracer la courbe.',
  lesson_ar = 'Ø§Ù„Ø§Ø´ØªÙ‚Ø§Ù‚ÙŠØ© ÙˆØ¯Ø±Ø§Ø³Ø© Ø§Ù„Ø¯ÙˆØ§Ù„

Ù…Ø´ØªÙ‚Ø§Øª Ù…Ø£Ù„ÙˆÙØ©
â€¢ (xâ¿)'' = nÂ·xâ¿â»Â¹   â€¢ (1/x)'' = âˆ’1/xÂ²   â€¢ (âˆšx)'' = 1/(2âˆšx)
â€¢ (uÂ·v)'' = u''v + uv''   â€¢ (u/v)'' = (u''v âˆ’ uv'')/vÂ²

Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ù…Ù…Ø§Ø³ Ø¹Ù†Ø¯ Ø§Ù„Ù†Ù‚Ø·Ø© Ø°Ø§Øª Ø§Ù„ÙØ§ØµÙ„Ø© a
y = f''(a)(x âˆ’ a) + f(a)

Ø§ØªØ¬Ø§Ù‡ Ø§Ù„ØªØºÙŠØ± â€” Ø¬ÙˆÙ‡Ø± Ø§Ù„Ø¯Ø±Ø§Ø³Ø©
â€¢ f''(x) > 0 Ø¹Ù„Ù‰ Ù…Ø¬Ø§Ù„ â† f Ù…ØªØ²Ø§ÙŠØ¯Ø© Ø¹Ù„ÙŠÙ‡.
â€¢ f''(x) < 0 â† f Ù…ØªÙ†Ø§Ù‚ØµØ©.
â€¢ Ø§Ù†Ø¹Ø¯Ø§Ù… f'' Ù…Ø¹ ØªØºÙŠØ± Ø§Ù„Ø¥Ø´Ø§Ø±Ø© â† Ù‚ÙŠÙ…Ø© Ø­Ø¯ÙŠØ© Ù…Ø­Ù„ÙŠØ©.

Ø®Ø·Ø© Ø§Ù„Ø¯Ø±Ø§Ø³Ø© ÙÙŠ Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§
1. Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ ÙˆØ§Ù„Ù†Ù‡Ø§ÙŠØ§Øª (ÙˆØ§Ù„Ù…Ù‚Ø§Ø±Ø¨Ø§Øª).
2. Ø­Ø³Ø§Ø¨ f'' ÙˆØ¯Ø±Ø§Ø³Ø© Ø¥Ø´Ø§Ø±ØªÙ‡Ø§.
3. Ø¬Ø¯ÙˆÙ„ Ø§Ù„ØªØºÙŠØ±Ø§Øª.
4. Ø§Ù„Ù…Ù…Ø§Ø³Ø§Øª ÙˆØ§Ù„Ù†Ù‚Ø§Ø· Ø§Ù„Ø®Ø§ØµØ© Ø«Ù… Ø±Ø³Ù… Ø§Ù„Ù…Ù†Ø­Ù†Ù‰.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'derivation';

update public.chapters c set
  lesson_fr = 'LA FONCTION EXPONENTIELLE

DÃ‰FINITION : exp(x) = eË£, dÃ©finie sur R, Ã  valeurs dans ]0 ; +âˆž[.
eË£ > 0 pour TOUT x â€” c''est l''argument clÃ© de nombreux signes au BAC.

PROPRIÃ‰TÃ‰S ALGÃ‰BRIQUES
â€¢ e^(a+b) = eáµƒ Ã— eáµ‡    â€¢ e^(aâˆ’b) = eáµƒ Ã· eáµ‡
â€¢ (eáµƒ)â¿ = e^(na)       â€¢ eâ° = 1, eÂ¹ = e â‰ˆ 2,718

DÃ‰RIVÃ‰E : (eË£)'' = eË£ ; (e^u)'' = u'' Â· e^u.

LIMITES
â€¢ lim eË£ = +âˆž (xâ†’+âˆž) ; lim eË£ = 0 (xâ†’âˆ’âˆž)
â€¢ CROISSANCES COMPARÃ‰ES : lim eË£/x = +âˆž ; lim xÂ·eË£ = 0 (xâ†’âˆ’âˆž).
Â« L''exponentielle l''emporte toujours sur x. Â»

Ã‰QUATIONS : eË£ = k (k > 0) âŸº x = ln k.
e^u = e^v âŸº u = v (car exp est strictement croissante).',
  lesson_ar = 'Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ø£Ø³ÙŠØ©

Ø§Ù„ØªØ¹Ø±ÙŠÙ: exp(x) = eË£ Ù…Ø¹Ø±ÙØ© Ø¹Ù„Ù‰ R ÙˆÙ‚ÙŠÙ…Ù‡Ø§ ÙÙŠ ]0 ; +âˆž[.
eË£ > 0 Ù…Ù† Ø£Ø¬Ù„ ÙƒÙ„ x â€” Ø­Ø¬Ø© Ø£Ø³Ø§Ø³ÙŠØ© Ù„Ø¯Ø±Ø§Ø³Ø© Ø§Ù„Ø¥Ø´Ø§Ø±Ø© ÙÙŠ Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§.

Ø®ÙˆØ§Øµ Ø¬Ø¨Ø±ÙŠØ©
â€¢ e^(a+b) = eáµƒ Ã— eáµ‡    â€¢ e^(aâˆ’b) = eáµƒ Ã· eáµ‡
â€¢ (eáµƒ)â¿ = e^(na)       â€¢ eâ° = 1

Ø§Ù„Ù…Ø´ØªÙ‚Ø©: (eË£)'' = eË£ Ø› (e^u)'' = u'' Â· e^u.

Ø§Ù„Ù†Ù‡Ø§ÙŠØ§Øª
â€¢ Ù†Ù‡Ø§ÙŠØ© eË£ Ø¹Ù†Ø¯ +âˆž Ù‡ÙŠ +âˆž ÙˆØ¹Ù†Ø¯ âˆ’âˆž Ù‡ÙŠ 0.
â€¢ Ø§Ù„ØªØ²Ø§ÙŠØ¯Ø§Øª Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©: eË£/x â† +âˆž. Â«Ø§Ù„Ø£Ø³ÙŠØ© ØªØªØºÙ„Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø¹Ù„Ù‰ x.Â»

Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª: eË£ = k (Ø¨Ø´Ø±Ø· k > 0) âŸº x = ln k.
e^u = e^v âŸº u = v.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'exponentielle';

update public.chapters c set
  lesson_fr = 'LA FONCTION LOGARITHME NÃ‰PÃ‰RIEN

DÃ‰FINITION : ln est dÃ©finie sur ]0 ; +âˆž[ (jamais de ln d''un nombre â‰¤ 0 !).
ln 1 = 0 ; ln e = 1 ; ln(eË£) = x ; e^(ln x) = x.

PROPRIÃ‰TÃ‰S ALGÃ‰BRIQUES
â€¢ ln(a Ã— b) = ln a + ln b
â€¢ ln(a/b) = ln a âˆ’ ln b
â€¢ ln(aâ¿) = n Â· ln a
â€¢ ln(âˆša) = (ln a)/2

DÃ‰RIVÃ‰E : (ln x)'' = 1/x ; (ln u)'' = u''/u.

LIMITES
â€¢ lim ln x = +âˆž (xâ†’+âˆž) ; lim ln x = âˆ’âˆž (xâ†’0âº)
â€¢ Croissances comparÃ©es : lim (ln x)/x = 0 (xâ†’+âˆž).
Â« x l''emporte sur ln x. Â»

Ã‰QUATIONS / INÃ‰QUATIONS
ln x = k âŸº x = eáµ.
ln u = ln v âŸº u = v (avec u, v > 0 â€” TOUJOURS vÃ©rifier le domaine).
Applications type BAC : rÃ©soudre 0,8â¿ < 0,01 â†’ n > ln 0,01 / ln 0,8.',
  lesson_ar = 'Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ù„ÙˆØºØ§Ø±ÙŠØªÙ…ÙŠØ© Ø§Ù„Ù†ÙŠØ¨ÙŠØ±ÙŠØ©

Ø§Ù„ØªØ¹Ø±ÙŠÙ: ln Ù…Ø¹Ø±ÙØ© Ø¹Ù„Ù‰ ]0 ; +âˆž[ ÙÙ‚Ø· (Ù„Ø§ Ù„ÙˆØºØ§Ø±ÙŠØªÙ… Ù„Ø¹Ø¯Ø¯ Ø³Ø§Ù„Ø¨ Ø£Ùˆ Ù…Ø¹Ø¯ÙˆÙ…!).
ln 1 = 0 Ø› ln e = 1 Ø› ln(eË£) = x Ø› e^(ln x) = x.

Ø®ÙˆØ§Øµ Ø¬Ø¨Ø±ÙŠØ©
â€¢ ln(a Ã— b) = ln a + ln b
â€¢ ln(a/b) = ln a âˆ’ ln b
â€¢ ln(aâ¿) = n Â· ln a

Ø§Ù„Ù…Ø´ØªÙ‚Ø©: (ln x)'' = 1/x Ø› (ln u)'' = u''/u.

Ø§Ù„Ù†Ù‡Ø§ÙŠØ§Øª
â€¢ Ù†Ù‡Ø§ÙŠØ© ln x Ø¹Ù†Ø¯ +âˆž Ù‡ÙŠ +âˆž ÙˆØ¹Ù†Ø¯ 0âº Ù‡ÙŠ âˆ’âˆž.
â€¢ Ø§Ù„ØªØ²Ø§ÙŠØ¯Ø§Øª Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©: (ln x)/x â† 0.

Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª: ln x = k âŸº x = eáµ ØŒ Ùˆ ln u = ln v âŸº u = v
(Ø¨Ø´Ø±Ø· u Ùˆv Ù…ÙˆØ¬Ø¨ÙŠÙ† â€” ØªØ­Ù‚Ù‚ Ù…Ù† Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø¯Ø§Ø¦Ù…Ù‹Ø§).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'logarithme';

update public.chapters c set
  lesson_fr = 'CALCUL INTÃ‰GRAL

PRIMITIVE : F est une primitive de f si F'' = f.
Deux primitives diffÃ¨rent d''une constante.

PRIMITIVES USUELLES
â€¢ xâ¿ â†’ xâ¿âºÂ¹/(n+1)     â€¢ 1/x â†’ ln|x|
â€¢ eË£ â†’ eË£              â€¢ u''Â·e^u â†’ e^u
â€¢ u''/u â†’ ln|u|         â€¢ u''Â·uâ¿ â†’ uâ¿âºÂ¹/(n+1)

INTÃ‰GRALE DÃ‰FINIE
âˆ«â‚áµ‡ f(x) dx = F(b) âˆ’ F(a)
Exemple : âˆ«â‚€Â¹ 2x dx = [xÂ²]â‚€Â¹ = 1 âˆ’ 0 = 1.

PROPRIÃ‰TÃ‰S
â€¢ LinÃ©aritÃ© : âˆ«(Î±f + Î²g) = Î±âˆ«f + Î²âˆ«g
â€¢ Relation de Chasles : âˆ«â‚áµ‡ + âˆ«áµ‡á¶œ = âˆ«â‚á¶œ
â€¢ Si f â‰¥ 0 sur [a;b], l''AIRE sous la courbe = âˆ«â‚áµ‡ f (en unitÃ©s d''aire).

VALEUR MOYENNE de f sur [a;b] : Î¼ = (1/(bâˆ’a)) âˆ«â‚áµ‡ f(x) dx.',
  lesson_ar = 'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„ØªÙƒØ§Ù…Ù„ÙŠ

Ø§Ù„Ø¯Ø§Ù„Ø© Ø§Ù„Ø£ØµÙ„ÙŠØ©: F Ø£ØµÙ„ÙŠØ© Ù„Ù€ f Ø¥Ø°Ø§ ÙƒØ§Ù† F'' = f.
Ø¯Ø§Ù„ØªØ§Ù† Ø£ØµÙ„ÙŠØªØ§Ù† ØªØ®ØªÙ„ÙØ§Ù† Ø¨Ø«Ø§Ø¨Øª.

Ø£ØµÙ„ÙŠØ§Øª Ù…Ø£Ù„ÙˆÙØ©
â€¢ xâ¿ â† xâ¿âºÂ¹/(n+1)     â€¢ 1/x â† ln|x|
â€¢ eË£ â† eË£              â€¢ u''Â·e^u â† e^u
â€¢ u''/u â† ln|u|

Ø§Ù„ØªÙƒØ§Ù…Ù„ Ø§Ù„Ù…Ø­Ø¯Ø¯
âˆ«â‚áµ‡ f(x) dx = F(b) âˆ’ F(a)
Ù…Ø«Ø§Ù„: âˆ«â‚€Â¹ 2x dx = [xÂ²]â‚€Â¹ = 1.

Ø®ÙˆØ§Øµ
â€¢ Ø§Ù„Ø®Ø·ÙŠØ©ØŒ ÙˆØ¹Ù„Ø§Ù‚Ø© Ø´Ø§Ù„: âˆ«â‚áµ‡ + âˆ«áµ‡á¶œ = âˆ«â‚á¶œ
â€¢ Ø¥Ø°Ø§ ÙƒØ§Ù†Øª f â‰¥ 0 Ø¹Ù„Ù‰ [a;b] ÙØ§Ù„Ù…Ø³Ø§Ø­Ø© ØªØ­Øª Ø§Ù„Ù…Ù†Ø­Ù†Ù‰ = âˆ«â‚áµ‡ f.

Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©: Î¼ = (1/(bâˆ’a)) âˆ«â‚áµ‡ f(x) dx.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'integrales';

update public.chapters c set
  lesson_fr = 'PROBABILITÃ‰S

PROBABILITÃ‰ CONDITIONNELLE
P_A(B) = P(A âˆ© B) / P(A) â€” probabilitÃ© de B sachant que A est rÃ©alisÃ©.

ARBRE PONDÃ‰RÃ‰ â€” les 3 rÃ¨gles
1. La somme des probabilitÃ©s issues d''un mÃªme nÅ“ud vaut 1.
2. ProbabilitÃ© d''un chemin = PRODUIT des probabilitÃ©s des branches.
3. ProbabilitÃ© d''un Ã©vÃ©nement = SOMME des chemins qui y mÃ¨nent
   (formule des probabilitÃ©s totales).

INDÃ‰PENDANCE
A et B indÃ©pendants âŸº P(A âˆ© B) = P(A) Ã— P(B) âŸº P_A(B) = P(B).

LOI BINOMIALE B(n ; p)
On rÃ©pÃ¨te n fois, de faÃ§on indÃ©pendante, une Ã©preuve Ã  deux issues
(succÃ¨s p, Ã©chec 1âˆ’p).
P(X = k) = C(n,k) Â· páµ Â· (1âˆ’p)â¿â»áµ
ESPÃ‰RANCE : E(X) = nÂ·p ; VARIANCE : V(X) = nÂ·pÂ·(1âˆ’p).

Exemple : 5 tirs, p = 0,8 â†’ P(5 rÃ©ussites) = 0,8âµ â‰ˆ 0,33 ; E(X) = 4.',
  lesson_ar = 'Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª

Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„ Ø§Ù„Ø´Ø±Ø·ÙŠ
P_A(B) = P(A âˆ© B) Ã· P(A) â€” Ø§Ø­ØªÙ…Ø§Ù„ B Ø¹Ù„Ù…Ù‹Ø§ Ø£Ù† A Ù…Ø­Ù‚Ù‚.

Ø§Ù„Ø´Ø¬Ø±Ø© Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„ÙŠØ© â€” Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ø§Ù„Ø«Ù„Ø§Ø«
1. Ù…Ø¬Ù…ÙˆØ¹ Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª Ø§Ù„ÙØ±ÙˆØ¹ Ù…Ù† Ù†ÙØ³ Ø§Ù„Ø¹Ù‚Ø¯Ø© ÙŠØ³Ø§ÙˆÙŠ 1.
2. Ø§Ø­ØªÙ…Ø§Ù„ Ù…Ø³Ø§Ø± = Ø¬Ø¯Ø§Ø¡ Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª ÙØ±ÙˆØ¹Ù‡.
3. Ø§Ø­ØªÙ…Ø§Ù„ Ø­Ø§Ø¯Ø«Ø© = Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ù…Ø¤Ø¯ÙŠØ© Ø¥Ù„ÙŠÙ‡Ø§ (Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª Ø§Ù„ÙƒÙ„ÙŠØ©).

Ø§Ù„Ø§Ø³ØªÙ‚Ù„Ø§Ù„ÙŠØ©
A ÙˆB Ù…Ø³ØªÙ‚Ù„ØªØ§Ù† âŸº P(A âˆ© B) = P(A) Ã— P(B).

Ù‚Ø§Ù†ÙˆÙ† Ø«Ù†Ø§Ø¦ÙŠ Ø§Ù„Ø­Ø¯ B(n ; p)
Ù†ÙƒØ±Ø± n Ù…Ø±Ø© ØªØ¬Ø±Ø¨Ø© Ø°Ø§Øª Ù†ØªÙŠØ¬ØªÙŠÙ† (Ù†Ø¬Ø§Ø­ p).
P(X = k) = C(n,k) Â· páµ Â· (1âˆ’p)â¿â»áµ
Ø§Ù„Ø£Ù…Ù„ Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠ: E(X) = nÂ·p Ø› Ø§Ù„ØªØ¨Ø§ÙŠÙ†: V(X) = nÂ·pÂ·(1âˆ’p).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'probabilites';

update public.chapters c set
  lesson_fr = 'LES NOMBRES COMPLEXES

FORME ALGÃ‰BRIQUE : z = a + ib, avec iÂ² = âˆ’1.
a = partie rÃ©elle Re(z), b = partie imaginaire Im(z).

CONJUGUÃ‰ : zÌ„ = a âˆ’ ib.
zÂ·zÌ„ = aÂ² + bÂ² â€” sert Ã  rendre rÃ©el un dÃ©nominateur.

MODULE : |z| = âˆš(aÂ² + bÂ²) â€” la distance OM.

ARGUMENT Î¸ : cos Î¸ = a/|z| et sin Î¸ = b/|z|.
FORME EXPONENTIELLE : z = |z| Â· e^(iÎ¸) = r(cos Î¸ + i sin Î¸).

Exemple : z = 1 + i â†’ |z| = âˆš2, Î¸ = Ï€/4, z = âˆš2Â·e^(iÏ€/4).

Ã‰QUATION DU SECOND DEGRÃ‰ (Î” < 0)
azÂ² + bz + c = 0 avec Î” < 0 :
z = (âˆ’b Â± iâˆš(âˆ’Î”)) / 2a â€” deux solutions conjuguÃ©es.

GÃ‰OMÃ‰TRIE : |z_B âˆ’ z_A| = distance AB ;
arg((z_Câˆ’z_A)/(z_Bâˆ’z_A)) = angle (AB, AC).',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø±ÙƒØ¨Ø©

Ø§Ù„Ø´ÙƒÙ„ Ø§Ù„Ø¬Ø¨Ø±ÙŠ: z = a + ib Ø­ÙŠØ« iÂ² = âˆ’1.
a Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ Ùˆb Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØªØ®ÙŠÙ„ÙŠ.

Ø§Ù„Ù…Ø±Ø§ÙÙ‚: zÌ„ = a âˆ’ ib ØŒ Ùˆ zÂ·zÌ„ = aÂ² + bÂ².

Ø§Ù„Ø·ÙˆÙŠÙ„Ø©: |z| = âˆš(aÂ² + bÂ²).

Ø§Ù„Ø¹Ù…Ø¯Ø© Î¸: Ø¬ØªØ§ Î¸ = a/|z| Ùˆ Ø¬Ø§ Î¸ = b/|z|.
Ø§Ù„Ø´ÙƒÙ„ Ø§Ù„Ø£Ø³ÙŠ: z = |z| Â· e^(iÎ¸).

Ù…Ø«Ø§Ù„: z = 1 + i â† |z| = âˆš2 ÙˆØ§Ù„Ø¹Ù…Ø¯Ø© Ï€/4.

Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø«Ø§Ù†ÙŠØ© (Î” < 0)
z = (âˆ’b Â± iâˆš(âˆ’Î”)) Ã· 2a â€” Ø­Ù„Ø§Ù† Ù…ØªØ±Ø§ÙÙ‚Ø§Ù†.

Ù‡Ù†Ø¯Ø³ÙŠÙ‹Ø§: |z_B âˆ’ z_A| = Ø§Ù„Ù…Ø³Ø§ÙØ© AB.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'complexes';

update public.chapters c set
  lesson_fr = 'GÃ‰OMÃ‰TRIE DANS L''ESPACE

PRODUIT SCALAIRE dans un repÃ¨re orthonormÃ© :
uÂ·v = xx'' + yy'' + zz''
u âŠ¥ v âŸº uÂ·v = 0.
Norme : ||u|| = âˆš(xÂ² + yÂ² + zÂ²).

Ã‰QUATION CARTÃ‰SIENNE D''UN PLAN
ax + by + cz + d = 0, de VECTEUR NORMAL n(a ; b ; c).
Plan passant par A(1;0;2) de normal n(2;âˆ’1;3) :
2(xâˆ’1) âˆ’ (yâˆ’0) + 3(zâˆ’2) = 0 â†’ 2x âˆ’ y + 3z âˆ’ 8 = 0.

REPRÃ‰SENTATION PARAMÃ‰TRIQUE D''UNE DROITE
Passant par A, de vecteur directeur u :
x = x_A + tÂ·a ; y = y_A + tÂ·b ; z = z_A + tÂ·c (t âˆˆ R).

DISTANCE D''UN POINT M AU PLAN P
d(M, P) = |ax_M + by_M + cz_M + d| / âˆš(aÂ² + bÂ² + cÂ²)

POSITIONS RELATIVES : droite // plan âŸº uÂ·n = 0 ;
droite âŠ¥ plan âŸº u colinÃ©aire Ã  n.',
  lesson_ar = 'Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡

Ø§Ù„Ø¬Ø¯Ø§Ø¡ Ø§Ù„Ø³Ù„Ù…ÙŠ ÙÙŠ Ù…Ø¹Ù„Ù… Ù…ØªØ¹Ø§Ù…Ø¯ ÙˆÙ…ØªØ¬Ø§Ù†Ø³:
uÂ·v = xx'' + yy'' + zz''
u âŠ¥ v âŸº uÂ·v = 0.
Ø§Ù„Ø·ÙˆÙŠÙ„Ø©: ||u|| = âˆš(xÂ² + yÂ² + zÂ²).

Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ø¯ÙŠÙƒØ§Ø±ØªÙŠØ© Ù„Ù„Ù…Ø³ØªÙˆÙŠ
ax + by + cz + d = 0 ÙˆØ´Ø¹Ø§Ø¹Ù‡ Ø§Ù„Ù†Ø§Ø¸Ù…ÙŠ n(a ; b ; c).

Ø§Ù„ØªÙ…Ø«ÙŠÙ„ Ø§Ù„ÙˆØ³ÙŠØ·ÙŠ Ù„Ù…Ø³ØªÙ‚ÙŠÙ…
ÙŠÙ…Ø± Ø¨Ù€ A ÙˆØ´Ø¹Ø§Ø¹ ØªÙˆØ¬ÙŠÙ‡Ù‡ u:
x = x_A + tÂ·a Ø› y = y_A + tÂ·b Ø› z = z_A + tÂ·c.

Ø¨Ø¹Ø¯ Ù†Ù‚Ø·Ø© M Ø¹Ù† Ø§Ù„Ù…Ø³ØªÙˆÙŠ P
d(M, P) = |ax_M + by_M + cz_M + d| Ã· âˆš(aÂ² + bÂ² + cÂ²)

Ø§Ù„Ø£ÙˆØ¶Ø§Ø¹ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©: Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙˆØ§Ø²ÙŠ Ø§Ù„Ù…Ø³ØªÙˆÙŠ âŸº uÂ·n = 0.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace';


-- ===============================================================
-- Migration: 20260721_019_quiz_bank_expansion
--
-- 5 bilingual quiz questions per chapter for every maths chapter of
-- the exam years (5AP / 4AM / 3AS) not already covered by migration 017.
-- Guarded by NOT EXISTS per chapter â€” safe to re-run.
-- ===============================================================

-- Helper pattern used throughout:
--   insert ... select c.id, v.* from chapters c join subjects s ...
--   cross join (values ...) where <grade/slug> and not exists (...)

-- ======================= 5AP =======================

-- grands-nombres
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Comment se lit 4 256 807 ?', 'ÙƒÙŠÙ ÙŠÙÙ‚Ø±Ø£ Ø§Ù„Ø¹Ø¯Ø¯ 4 256 807ØŸ',
   '["Quatre millions deux cent cinquante-six mille huit cent sept","Quarante-deux millions","Quatre cent mille","Quatre milliards"]'::jsonb,
   '["Ø£Ø±Ø¨Ø¹Ø© Ù…Ù„Ø§ÙŠÙŠÙ† ÙˆÙ…Ø¦ØªØ§Ù† ÙˆØ³ØªØ© ÙˆØ®Ù…Ø³ÙˆÙ† Ø£Ù„ÙÙ‹Ø§ ÙˆØ«Ù…Ø§Ù†Ù…Ø¦Ø© ÙˆØ³Ø¨Ø¹Ø©","Ø§Ø«Ù†Ø§Ù† ÙˆØ£Ø±Ø¨Ø¹ÙˆÙ† Ù…Ù„ÙŠÙˆÙ†Ù‹Ø§","Ø£Ø±Ø¨Ø¹Ù…Ø¦Ø© Ø£Ù„Ù","Ø£Ø±Ø¨Ø¹Ø© Ù…Ù„ÙŠØ§Ø±Ø§Øª"]'::jsonb,
   0, 'On lit classe par classe : 4 millions, 256 mille, 807.', 'Ù†Ù‚Ø±Ø£ Ù‚Ø³Ù…Ù‹Ø§ Ù‚Ø³Ù…Ù‹Ø§: 4 Ù…Ù„Ø§ÙŠÙŠÙ† Ø«Ù… 256 Ø£Ù„ÙÙ‹Ø§ Ø«Ù… 807.', 'easy', 1),
  ('Dans 573 208, que vaut le chiffre 7 ?', 'ÙÙŠ Ø§Ù„Ø¹Ø¯Ø¯ 573 208ØŒ Ù…Ø§ Ù‚ÙŠÙ…Ø© Ø§Ù„Ø±Ù‚Ù… 7ØŸ',
   '["70 000","7 000","700","7"]'::jsonb, '["70 000","7 000","700","7"]'::jsonb,
   0, 'Le 7 est au rang des dizaines de mille : 70 000.', 'Ø§Ù„Ø±Ù‚Ù… 7 ÙÙŠ Ù…Ø±ØªØ¨Ø© Ø¹Ø´Ø±Ø§Øª Ø§Ù„Ø¢Ù„Ø§Ù: 70 000.', 'easy', 2),
  ('Quel est le plus grand nombre ?', 'Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø±ØŸ',
   '["530 200","529 999","98 765","499 999"]'::jsonb, '["530 200","529 999","98 765","499 999"]'::jsonb,
   0, '530 200 > 529 999 : au rang des dizaines de mille, 3 > 2.', '530 200 > 529 999 Ù„Ø£Ù† 3 > 2 ÙÙŠ Ø¹Ø´Ø±Ø§Øª Ø§Ù„Ø¢Ù„Ø§Ù.', 'medium', 3),
  ('1 million = ?', 'Ù…Ù„ÙŠÙˆÙ† ÙˆØ§Ø­Ø¯ = ØŸ',
   '["1 000 000","100 000","10 000","1 000"]'::jsonb, '["1 000 000","100 000","10 000","1 000"]'::jsonb,
   0, 'Un million s''Ã©crit avec 6 zÃ©ros.', 'Ø§Ù„Ù…Ù„ÙŠÙˆÙ† ÙŠÙÙƒØªØ¨ Ø¨Ø³ØªØ© Ø£ØµÙØ§Ø±.', 'easy', 4),
  ('Range du plus petit au plus grand : 45 060 ; 45 600 ; 44 999', 'Ø±ØªØ¨ Ù…Ù† Ø§Ù„Ø£ØµØºØ± Ø¥Ù„Ù‰ Ø§Ù„Ø£ÙƒØ¨Ø±: 45 060 Ø› 45 600 Ø› 44 999',
   '["44 999 < 45 060 < 45 600","45 600 < 45 060 < 44 999","45 060 < 44 999 < 45 600","44 999 < 45 600 < 45 060"]'::jsonb,
   '["44 999 < 45 060 < 45 600","45 600 < 45 060 < 44 999","45 060 < 44 999 < 45 600","44 999 < 45 600 < 45 060"]'::jsonb,
   0, 'On compare chiffre par chiffre depuis la gauche.', 'Ù†Ù‚Ø§Ø±Ù† Ø±Ù‚Ù…Ù‹Ø§ Ø±Ù‚Ù…Ù‹Ø§ Ù…Ù† Ø§Ù„ÙŠØ³Ø§Ø±.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- nombres-decimaux
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 12,45 â€” que reprÃ©sente le 4 ?', 'ÙÙŠ 12.45 â€” Ù…Ø§Ø°Ø§ ÙŠÙ…Ø«Ù„ Ø§Ù„Ø±Ù‚Ù… 4ØŸ',
   '["4 dixiÃ¨mes","4 unitÃ©s","4 centiÃ¨mes","4 dizaines"]'::jsonb, '["4 Ø£Ø¹Ø´Ø§Ø±","4 ÙˆØ­Ø¯Ø§Øª","4 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø©","4 Ø¹Ø´Ø±Ø§Øª"]'::jsonb,
   0, 'Le premier chiffre aprÃ¨s la virgule est le rang des dixiÃ¨mes.', 'Ø£ÙˆÙ„ Ø±Ù‚Ù… Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© Ù‡Ùˆ Ù…Ø±ØªØ¨Ø© Ø§Ù„Ø£Ø¹Ø´Ø§Ø±.', 'easy', 1),
  ('Compare : 3,25 â€¦ 3,4', 'Ù‚Ø§Ø±Ù†: 3.25 â€¦ 3.4',
   '["3,25 < 3,4","3,25 > 3,4","3,25 = 3,4","Impossible"]'::jsonb, '["3.25 < 3.4","3.25 > 3.4","3.25 = 3.4","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb,
   0, '2 dixiÃ¨mes < 4 dixiÃ¨mes, donc 3,25 < 3,40.', 'Ø¹ÙØ´Ø±Ø§Ù† < 4 Ø£Ø¹Ø´Ø§Ø±ØŒ Ø¥Ø°Ù† 3.25 < 3.40.', 'medium', 2),
  ('Calcule : 12,45 + 3,8', 'Ø§Ø­Ø³Ø¨: 12.45 + 3.8',
   '["16,25","15,53","16,53","15,25"]'::jsonb, '["16.25","15.53","16.53","15.25"]'::jsonb,
   0, 'On aligne les virgules : 12,45 + 3,80 = 16,25.', 'Ù†Ø­Ø§Ø°ÙŠ Ø§Ù„ÙØ§ØµÙ„ØªÙŠÙ†: 12.45 + 3.80 = 16.25.', 'medium', 3),
  ('Quelle Ã©criture est Ã©gale Ã  5,7 ?', 'Ø£ÙŠ ÙƒØªØ§Ø¨Ø© ØªØ³Ø§ÙˆÙŠ 5.7ØŸ',
   '["5,70","5,07","0,57","57"]'::jsonb, '["5.70","5.07","0.57","57"]'::jsonb,
   0, 'Ajouter un zÃ©ro Ã  droite de la partie dÃ©cimale ne change rien.', 'Ø¥Ø¶Ø§ÙØ© ØµÙØ± Ø¹Ù„Ù‰ ÙŠÙ…ÙŠÙ† Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø¹Ø´Ø±ÙŠ Ù„Ø§ ØªØºÙŠØ± Ø§Ù„Ù‚ÙŠÙ…Ø©.', 'easy', 4),
  ('7/10 en Ã©criture dÃ©cimale = ?', '7/10 Ø¨Ø§Ù„ÙƒØªØ§Ø¨Ø© Ø§Ù„Ø¹Ø´Ø±ÙŠØ© = ØŸ',
   '["0,7","7,0","0,07","0,71"]'::jsonb, '["0.7","7.0","0.07","0.71"]'::jsonb,
   0, '7 dixiÃ¨mes = 0,7.', '7 Ø£Ø¹Ø´Ø§Ø± = 0.7.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'nombres-decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- proportionnalite
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3 cahiers coÃ»tent 120 DA. Combien coÃ»tent 7 cahiers ?', '3 ÙƒØ±Ø§Ø±ÙŠØ³ Ø¨Ù€ 120 Ø¯Ø¬. ÙƒÙ… Ø«Ù…Ù† 7 ÙƒØ±Ø§Ø±ÙŠØ³ØŸ',
   '["280 DA","360 DA","840 DA","240 DA"]'::jsonb, '["280 Ø¯Ø¬","360 Ø¯Ø¬","840 Ø¯Ø¬","240 Ø¯Ø¬"]'::jsonb,
   0, 'Un cahier : 120Ã·3 = 40 DA. Sept cahiers : 40Ã—7 = 280 DA.', 'Ø§Ù„ÙƒØ±Ø§Ø³: 40 Ø¯Ø¬. Ø³Ø¨Ø¹Ø©: 280 Ø¯Ø¬.', 'medium', 1),
  ('1 baguette coÃ»te 15 DA. 6 baguettes coÃ»tentâ€¦', 'Ø®Ø¨Ø²Ø© Ø¨Ù€ 15 Ø¯Ø¬. Ø«Ù…Ù† 6 Ø®Ø¨Ø²Ø§Øªâ€¦',
   '["90 DA","75 DA","65 DA","105 DA"]'::jsonb, '["90 Ø¯Ø¬","75 Ø¯Ø¬","65 Ø¯Ø¬","105 Ø¯Ø¬"]'::jsonb,
   0, '15 Ã— 6 = 90 DA.', '15 Ã— 6 = 90 Ø¯Ø¬.', 'easy', 2),
  ('Ce tableau est-il proportionnel ? 2â†’10 ; 3â†’15 ; 5â†’25', 'Ù‡Ù„ Ù‡Ø°Ø§ Ø§Ù„Ø¬Ø¯ÙˆÙ„ ØªÙ†Ø§Ø³Ø¨ÙŠØŸ 2â†10 Ø› 3â†15 Ø› 5â†25',
   '["Oui, coefficient 5","Non","Oui, coefficient 8","On ne sait pas"]'::jsonb, '["Ù†Ø¹Ù…ØŒ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ 5","Ù„Ø§","Ù†Ø¹Ù…ØŒ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ 8","Ù„Ø§ Ù†Ø¹Ù„Ù…"]'::jsonb,
   0, '10Ã·2 = 15Ã·3 = 25Ã·5 = 5 : mÃªme coefficient partout.', 'Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ø³Ù…Ø© 5 ÙÙŠ ÙƒÙ„ Ø§Ù„Ø£Ø¹Ù…Ø¯Ø©.', 'medium', 3),
  ('Une voiture roule Ã  90 km/h. Quelle distance en 2 heures ?', 'Ø³ÙŠØ§Ø±Ø© Ø³Ø±Ø¹ØªÙ‡Ø§ 90 ÙƒÙ…/Ø³Ø§. Ù…Ø§ Ø§Ù„Ù…Ø³Ø§ÙØ© ÙÙŠ Ø³Ø§Ø¹ØªÙŠÙ†ØŸ',
   '["180 km","92 km","45 km","270 km"]'::jsonb, '["180 ÙƒÙ…","92 ÙƒÙ…","45 ÙƒÙ…","270 ÙƒÙ…"]'::jsonb,
   0, '90 Ã— 2 = 180 km.', '90 Ã— 2 = 180 ÙƒÙ….', 'easy', 4),
  ('5 kg de pommes coÃ»tent 800 DA. Combien coÃ»tent 2 kg ?', '5 ÙƒØº ØªÙØ§Ø­ Ø¨Ù€ 800 Ø¯Ø¬. ÙƒÙ… Ø«Ù…Ù† 2 ÙƒØºØŸ',
   '["320 DA","400 DA","160 DA","300 DA"]'::jsonb, '["320 Ø¯Ø¬","400 Ø¯Ø¬","160 Ø¯Ø¬","300 Ø¯Ø¬"]'::jsonb,
   0, '1 kg : 800Ã·5 = 160 DA. 2 kg : 320 DA.', 'Ø§Ù„ÙƒÙŠÙ„Ùˆ: 160 Ø¯Ø¬. ÙƒÙŠÙ„ÙˆØºØ±Ø§Ù…Ø§Ù†: 320 Ø¯Ø¬.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- mesures
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3,5 km = ? m', '3.5 ÙƒÙ… = ØŸ Ù…',
   '["3 500 m","350 m","35 000 m","35 m"]'::jsonb, '["3500 Ù…","350 Ù…","35000 Ù…","35 Ù…"]'::jsonb,
   0, '1 km = 1 000 m, donc 3,5 km = 3 500 m.', '1 ÙƒÙ… = 1000 Ù…ØŒ Ø¥Ø°Ù† 3.5 ÙƒÙ… = 3500 Ù….', 'easy', 1),
  ('2 kg = ? g', '2 ÙƒØº = ØŸ Øº',
   '["2 000 g","200 g","20 g","20 000 g"]'::jsonb, '["2000 Øº","200 Øº","20 Øº","20000 Øº"]'::jsonb,
   0, '1 kg = 1 000 g.', '1 ÙƒØº = 1000 Øº.', 'easy', 2),
  ('1,5 L = ? cL', '1.5 Ù„ = ØŸ Ø³Ù„',
   '["150 cL","15 cL","1 500 cL","105 cL"]'::jsonb, '["150 Ø³Ù„","15 Ø³Ù„","1500 Ø³Ù„","105 Ø³Ù„"]'::jsonb,
   0, '1 L = 100 cL, donc 1,5 L = 150 cL.', '1 Ù„ = 100 Ø³Ù„ØŒ Ø¥Ø°Ù† 150 Ø³Ù„.', 'medium', 3),
  ('Quelle unitÃ© pour la masse d''une piÃ¨ce de monnaie ?', 'Ù…Ø§ ÙˆØ­Ø¯Ø© Ù‚ÙŠØ§Ø³ ÙƒØªÙ„Ø© Ù‚Ø·Ø¹Ø© Ù†Ù‚Ø¯ÙŠØ©ØŸ',
   '["Le gramme","Le kilogramme","Le litre","Le mÃ¨tre"]'::jsonb, '["Ø§Ù„ØºØ±Ø§Ù…","Ø§Ù„ÙƒÙŠÙ„ÙˆØºØ±Ø§Ù…","Ø§Ù„Ù„ØªØ±","Ø§Ù„Ù…ØªØ±"]'::jsonb,
   0, 'Une piÃ¨ce pÃ¨se quelques grammes.', 'Ø§Ù„Ù‚Ø·Ø¹Ø© Ø§Ù„Ù†Ù‚Ø¯ÙŠØ© ØªØ²Ù† Ø¨Ø¶Ø¹Ø© ØºØ±Ø§Ù…Ø§Øª.', 'easy', 4),
  ('250 cm = ? m', '250 Ø³Ù… = ØŸ Ù…',
   '["2,5 m","25 m","0,25 m","2,05 m"]'::jsonb, '["2.5 Ù…","25 Ù…","0.25 Ù…","2.05 Ù…"]'::jsonb,
   0, '100 cm = 1 m, donc 250 cm = 2,5 m.', '100 Ø³Ù… = 1 Ù…ØŒ Ø¥Ø°Ù† 250 Ø³Ù… = 2.5 Ù….', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'mesures'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- perimetres-aires
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('PÃ©rimÃ¨tre d''un carrÃ© de cÃ´tÃ© 6 cm ?', 'Ù…Ø­ÙŠØ· Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 6 Ø³Ù…ØŸ',
   '["24 cm","36 cm","12 cm","18 cm"]'::jsonb, '["24 Ø³Ù…","36 Ø³Ù…","12 Ø³Ù…","18 Ø³Ù…"]'::jsonb,
   0, 'P = 4 Ã— 6 = 24 cm.', 'Ø§Ù„Ù…Ø­ÙŠØ· = 4 Ã— 6 = 24 Ø³Ù….', 'easy', 1),
  ('Aire d''un rectangle de 8 cm sur 5 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø³ØªØ·ÙŠÙ„ Ø·ÙˆÙ„Ù‡ 8 Ø³Ù… ÙˆØ¹Ø±Ø¶Ù‡ 5 Ø³Ù…ØŸ',
   '["40 cmÂ²","26 cmÂ²","13 cmÂ²","80 cmÂ²"]'::jsonb, '["40 Ø³Ù…Â²","26 Ø³Ù…Â²","13 Ø³Ù…Â²","80 Ø³Ù…Â²"]'::jsonb,
   0, 'A = 8 Ã— 5 = 40 cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© = 8 Ã— 5 = 40 Ø³Ù…Â².', 'easy', 2),
  ('PÃ©rimÃ¨tre d''un rectangle de 8 cm sur 5 cm ?', 'Ù…Ø­ÙŠØ· Ù…Ø³ØªØ·ÙŠÙ„ 8 Ø³Ù… Ã— 5 Ø³Ù…ØŸ',
   '["26 cm","40 cm","13 cm","21 cm"]'::jsonb, '["26 Ø³Ù…","40 Ø³Ù…","13 Ø³Ù…","21 Ø³Ù…"]'::jsonb,
   0, 'P = 2 Ã— (8 + 5) = 26 cm.', 'Ø§Ù„Ù…Ø­ÙŠØ· = 2 Ã— (8 + 5) = 26 Ø³Ù….', 'medium', 3),
  ('Aire d''un triangle : base 10 cm, hauteur 6 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø«Ù„Ø« Ù‚Ø§Ø¹Ø¯ØªÙ‡ 10 Ø³Ù… ÙˆØ§Ø±ØªÙØ§Ø¹Ù‡ 6 Ø³Ù…ØŸ',
   '["30 cmÂ²","60 cmÂ²","16 cmÂ²","36 cmÂ²"]'::jsonb, '["30 Ø³Ù…Â²","60 Ø³Ù…Â²","16 Ø³Ù…Â²","36 Ø³Ù…Â²"]'::jsonb,
   0, 'A = (10 Ã— 6) Ã· 2 = 30 cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© = (10 Ã— 6) Ã· 2 = 30 Ø³Ù…Â².', 'medium', 4),
  ('L''aire se mesure enâ€¦', 'ØªÙÙ‚Ø§Ø³ Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ø¨Ù€â€¦',
   '["cmÂ²","cm","cmÂ³","kg"]'::jsonb, '["Ø³Ù…Â²","Ø³Ù…","Ø³Ù…Â³","ÙƒØº"]'::jsonb,
   0, 'L''aire est une surface : unitÃ©s au carrÃ©.', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ø³Ø·Ø­: ÙˆØ­Ø¯Ø§Øª Ù…Ø±Ø¨Ø¹Ø©.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'perimetres-aires'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de faces a un cube ?', 'ÙƒÙ… ÙˆØ¬Ù‡Ù‹Ø§ Ù„Ù„Ù…ÙƒØ¹Ø¨ØŸ',
   '["6","4","8","12"]'::jsonb, '["6","4","8","12"]'::jsonb,
   0, 'Un cube a 6 faces carrÃ©es.', 'Ù„Ù„Ù…ÙƒØ¹Ø¨ 6 Ø£ÙˆØ¬Ù‡ Ù…Ø±Ø¨Ø¹Ø©.', 'easy', 1),
  ('Le diamÃ¨tre d''un cercle de rayon 4 cm vautâ€¦', 'Ù‚Ø·Ø± Ø¯Ø§Ø¦Ø±Ø© Ù†ØµÙ Ù‚Ø·Ø±Ù‡Ø§ 4 Ø³Ù… ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["8 cm","4 cm","2 cm","16 cm"]'::jsonb, '["8 Ø³Ù…","4 Ø³Ù…","2 Ø³Ù…","16 Ø³Ù…"]'::jsonb,
   0, 'd = 2 Ã— r = 8 cm.', 'Ø§Ù„Ù‚Ø·Ø± = 2 Ã— Ù†ØµÙ Ø§Ù„Ù‚Ø·Ø± = 8 Ø³Ù….', 'easy', 2),
  ('Un triangle avec 2 cÃ´tÃ©s Ã©gaux estâ€¦', 'Ù…Ø«Ù„Ø« Ù„Ù‡ Ø¶Ù„Ø¹Ø§Ù† Ù…ØªÙ‚Ø§ÙŠØ³Ø§Ù† Ù‡Ùˆâ€¦',
   '["isocÃ¨le","Ã©quilatÃ©ral","rectangle","quelconque"]'::jsonb, '["Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ†","Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹","Ù‚Ø§Ø¦Ù…","ÙƒÙŠÙÙŠ"]'::jsonb,
   0, 'Deux cÃ´tÃ©s Ã©gaux = triangle isocÃ¨le.', 'Ø¶Ù„Ø¹Ø§Ù† Ù…ØªÙ‚Ø§ÙŠØ³Ø§Ù† = Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ†.', 'medium', 3),
  ('Combien d''arÃªtes a un cube ?', 'ÙƒÙ… Ø­Ø±ÙÙ‹Ø§ Ù„Ù„Ù…ÙƒØ¹Ø¨ØŸ',
   '["12","6","8","10"]'::jsonb, '["12","6","8","10"]'::jsonb,
   0, 'Un cube a 12 arÃªtes.', 'Ù„Ù„Ù…ÙƒØ¹Ø¨ 12 Ø­Ø±ÙÙ‹Ø§.', 'medium', 4),
  ('Un quadrilatÃ¨re avec 4 cÃ´tÃ©s Ã©gaux et 4 angles droits estâ€¦', 'Ø±Ø¨Ø§Ø¹ÙŠ Ù„Ù‡ 4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªÙ‚Ø§ÙŠØ³Ø© Ùˆ4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø© Ù‡Ùˆâ€¦',
   '["un carrÃ©","un losange seulement","un rectangle seulement","un triangle"]'::jsonb, '["Ù…Ø±Ø¨Ø¹","Ù…Ø¹ÙŠÙ‘Ù† ÙÙ‚Ø·","Ù…Ø³ØªØ·ÙŠÙ„ ÙÙ‚Ø·","Ù…Ø«Ù„Ø«"]'::jsonb,
   0, 'C''est la dÃ©finition du carrÃ©.', 'Ù‡Ø°Ø§ Ù‡Ùˆ ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø±Ø¨Ø¹.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'geometrie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- problemes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un car transporte 4 groupes de 27 Ã©lÃ¨ves. Combien d''Ã©lÃ¨ves en tout ?', 'Ø­Ø§ÙÙ„Ø© ØªÙ†Ù‚Ù„ 4 Ø£ÙÙˆØ§Ø¬ Ù…Ù† 27 ØªÙ„Ù…ÙŠØ°Ù‹Ø§. ÙƒÙ… ØªÙ„Ù…ÙŠØ°Ù‹Ø§ ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸ',
   '["108","31","104","112"]'::jsonb, '["108","31","104","112"]'::jsonb,
   0, '4 Ã— 27 = 108 Ã©lÃ¨ves.', '4 Ã— 27 = 108 ØªÙ„Ø§Ù…ÙŠØ°.', 'easy', 1),
  ('Yasmine a 500 DA. Elle achÃ¨te un livre Ã  320 DA. Combien lui reste-t-il ?', 'Ù„Ø¯Ù‰ ÙŠØ§Ø³Ù…ÙŠÙ† 500 Ø¯Ø¬. Ø§Ø´ØªØ±Øª ÙƒØªØ§Ø¨Ù‹Ø§ Ø¨Ù€ 320 Ø¯Ø¬. ÙƒÙ… Ø¨Ù‚ÙŠ Ù„Ù‡Ø§ØŸ',
   '["180 DA","220 DA","280 DA","820 DA"]'::jsonb, '["180 Ø¯Ø¬","220 Ø¯Ø¬","280 Ø¯Ø¬","820 Ø¯Ø¬"]'::jsonb,
   0, '500 âˆ’ 320 = 180 DA.', '500 âˆ’ 320 = 180 Ø¯Ø¬.', 'easy', 2),
  ('On partage 96 bonbons entre 8 enfants. Combien chacun ?', 'Ù†Ù‚Ø³Ù… 96 Ø­Ù„ÙˆÙ‰ Ø¹Ù„Ù‰ 8 Ø£Ø·ÙØ§Ù„. ÙƒÙ… Ù„ÙƒÙ„ ÙˆØ§Ø­Ø¯ØŸ',
   '["12","8","88","16"]'::jsonb, '["12","8","88","16"]'::jsonb,
   0, '96 Ã· 8 = 12 bonbons chacun.', '96 Ã· 8 = 12 Ø­Ù„ÙˆÙ‰ Ù„ÙƒÙ„ Ø·ÙÙ„.', 'medium', 3),
  ('Â« Combien en TOUT ? Â» indique gÃ©nÃ©ralementâ€¦', 'Â«ÙƒÙ… ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸÂ» ØªØ¯Ù„ Ø¹Ø§Ø¯Ø© Ø¹Ù„Ù‰â€¦',
   '["une addition","une soustraction","une division","rien"]'::jsonb, '["Ø§Ù„Ø¬Ù…Ø¹","Ø§Ù„Ø·Ø±Ø­","Ø§Ù„Ù‚Ø³Ù…Ø©","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'Â« En tout Â» = on regroupe = addition (ou multiplication).', 'Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» = Ù†Ø¬Ù…Ø¹.', 'easy', 4),
  ('Un fermier a 3 rangÃ©es de 15 oliviers et en plante 10 de plus. Total ?', 'ÙÙ„Ø§Ø­ Ù„Ø¯ÙŠÙ‡ 3 ØµÙÙˆÙ Ù…Ù† 15 Ø²ÙŠØªÙˆÙ†Ø© ÙˆØºØ±Ø³ 10 Ø£Ø®Ø±Ù‰. Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸ',
   '["55","45","28","150"]'::jsonb, '["55","45","28","150"]'::jsonb,
   0, '3 Ã— 15 = 45, puis 45 + 10 = 55.', '3 Ã— 15 = 45 Ø«Ù… 45 + 10 = 55.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '5AP' and s.slug = 'mathematiques' and c.slug = 'problemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ======================= 4AM =======================

-- calcul-litteral
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('DÃ©veloppe : 3(x + 5)', 'Ø§Ù†Ø´Ø±: 3(x + 5)',
   '["3x + 15","3x + 5","x + 15","15x"]'::jsonb, '["3x + 15","3x + 5","x + 15","15x"]'::jsonb,
   0, 'k(a+b) = ka + kb â†’ 3x + 15.', 'k(a+b) = ka + kb.', 'easy', 1),
  ('DÃ©veloppe : (x + 3)Â²', 'Ø§Ù†Ø´Ø±: (x + 3)Â²',
   '["xÂ² + 6x + 9","xÂ² + 9","xÂ² + 3x + 9","xÂ² + 6x + 6"]'::jsonb, '["xÂ² + 6x + 9","xÂ² + 9","xÂ² + 3x + 9","xÂ² + 6x + 6"]'::jsonb,
   0, '(a+b)Â² = aÂ² + 2ab + bÂ² = xÂ² + 6x + 9.', '(a+b)Â² = aÂ² + 2ab + bÂ².', 'medium', 2),
  ('Factorise : xÂ² âˆ’ 25', 'Ø­Ù„Ù‘Ù„: xÂ² âˆ’ 25',
   '["(x+5)(xâˆ’5)","(xâˆ’5)Â²","(x+5)Â²","x(xâˆ’25)"]'::jsonb, '["(x+5)(xâˆ’5)","(xâˆ’5)Â²","(x+5)Â²","x(xâˆ’25)"]'::jsonb,
   0, 'aÂ² âˆ’ bÂ² = (a+b)(aâˆ’b).', 'aÂ² âˆ’ bÂ² = (a+b)(aâˆ’b).', 'medium', 3),
  ('Factorise : 3xÂ² + 6x', 'Ø­Ù„Ù‘Ù„: 3xÂ² + 6x',
   '["3x(x + 2)","3(x + 2)","x(3x + 2)","3x(x + 6)"]'::jsonb, '["3x(x + 2)","3(x + 2)","x(3x + 2)","3x(x + 6)"]'::jsonb,
   0, 'Facteur commun 3x : 3x(x + 2).', 'Ø§Ù„Ø¹Ø§Ù…Ù„ Ø§Ù„Ù…Ø´ØªØ±Ùƒ 3x.', 'medium', 4),
  ('DÃ©veloppe : (2x âˆ’ 5)Â²', 'Ø§Ù†Ø´Ø±: (2x âˆ’ 5)Â²',
   '["4xÂ² âˆ’ 20x + 25","4xÂ² + 25","4xÂ² âˆ’ 10x + 25","2xÂ² âˆ’ 20x + 25"]'::jsonb, '["4xÂ² âˆ’ 20x + 25","4xÂ² + 25","4xÂ² âˆ’ 10x + 25","2xÂ² âˆ’ 20x + 25"]'::jsonb,
   0, '(aâˆ’b)Â² = aÂ² âˆ’ 2ab + bÂ² avec a = 2x, b = 5.', '(aâˆ’b)Â² = aÂ² âˆ’ 2ab + bÂ².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- equations (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('RÃ©sous : 7x âˆ’ 4 = 3x + 12', 'Ø­Ù„: 7x âˆ’ 4 = 3x + 12',
   '["x = 4","x = 2","x = 8","x = âˆ’4"]'::jsonb, '["x = 4","x = 2","x = 8","x = âˆ’4"]'::jsonb,
   0, '4x = 16 â†’ x = 4.', '4x = 16 â† x = 4.', 'medium', 1),
  ('(x âˆ’ 2)(x + 5) = 0. Les solutions sontâ€¦', '(x âˆ’ 2)(x + 5) = 0. Ø§Ù„Ø­Ù„ÙˆÙ„ Ù‡ÙŠâ€¦',
   '["x = 2 ou x = âˆ’5","x = âˆ’2 ou x = 5","x = 2 ou x = 5","x = 10"]'::jsonb, '["x = 2 Ø£Ùˆ x = âˆ’5","x = âˆ’2 Ø£Ùˆ x = 5","x = 2 Ø£Ùˆ x = 5","x = 10"]'::jsonb,
   0, 'Produit nul : chaque facteur peut Ãªtre nul.', 'Ø¬Ø¯Ø§Ø¡ Ù…Ø¹Ø¯ÙˆÙ…: ÙƒÙ„ Ø¹Ø§Ù…Ù„ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠÙ†Ø¹Ø¯Ù….', 'medium', 2),
  ('RÃ©sous : âˆ’2x < 10', 'Ø­Ù„: âˆ’2x < 10',
   '["x > âˆ’5","x < âˆ’5","x > 5","x < 5"]'::jsonb, '["x > âˆ’5","x < âˆ’5","x > 5","x < 5"]'::jsonb,
   0, 'Division par âˆ’2 : on CHANGE le sens â†’ x > âˆ’5.', 'Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ âˆ’2 ØªÙ‚Ù„Ø¨ Ø§ØªØ¬Ø§Ù‡ Ø§Ù„Ù…ØªØ±Ø§Ø¬Ø­Ø©.', 'hard', 3),
  ('RÃ©sous : x/3 = 7', 'Ø­Ù„: x/3 = 7',
   '["x = 21","x = 7/3","x = 10","x = 4"]'::jsonb, '["x = 21","x = 7/3","x = 10","x = 4"]'::jsonb,
   0, 'x = 7 Ã— 3 = 21.', 'x = 7 Ã— 3 = 21.', 'easy', 4),
  ('Le double d''un nombre augmentÃ© de 3 vaut 19. Ce nombre estâ€¦', 'Ø¶Ø¹Ù Ø¹Ø¯Ø¯ Ù…Ø¶Ø§ÙÙ‹Ø§ Ø¥Ù„ÙŠÙ‡ 3 ÙŠØ³Ø§ÙˆÙŠ 19. Ù‡Ø°Ø§ Ø§Ù„Ø¹Ø¯Ø¯ Ù‡Ùˆâ€¦',
   '["8","11","16","7"]'::jsonb, '["8","11","16","7"]'::jsonb,
   0, '2x + 3 = 19 â†’ 2x = 16 â†’ x = 8.', '2x + 3 = 19 â† x = 8.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'equations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- systemes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('{ x + y = 10 ; 2x âˆ’ y = 2 }. Alors x = ?', '{ x + y = 10 Ø› 2x âˆ’ y = 2 }. Ø¥Ø°Ù† x = ØŸ',
   '["4","6","5","3"]'::jsonb, '["4","6","5","3"]'::jsonb,
   0, 'En additionnant : 3x = 12 â†’ x = 4.', 'Ø¨Ø§Ù„Ø¬Ù…Ø¹: 3x = 12 â† x = 4.', 'medium', 1),
  ('{ x + y = 10 ; 2x âˆ’ y = 2 }. Alors y = ?', '{ x + y = 10 Ø› 2x âˆ’ y = 2 }. Ø¥Ø°Ù† y = ØŸ',
   '["6","4","8","2"]'::jsonb, '["6","4","8","2"]'::jsonb,
   0, 'x = 4, donc y = 10 âˆ’ 4 = 6.', 'x = 4 Ø¥Ø°Ù† y = 6.', 'medium', 2),
  ('Le couple (2 ; 3) est-il solution de { x + y = 5 ; x âˆ’ y = âˆ’1 } ?', 'Ù‡Ù„ Ø§Ù„Ø«Ù†Ø§Ø¦ÙŠØ© (2 Ø› 3) Ø­Ù„ Ù„Ù„Ø¬Ù…Ù„Ø© { x + y = 5 Ø› x âˆ’ y = âˆ’1 }ØŸ',
   '["Oui","Non","Seulement la 1Ã¨re Ã©quation","Seulement la 2Ã¨me"]'::jsonb, '["Ù†Ø¹Ù…","Ù„Ø§","Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰ ÙÙ‚Ø·","Ø§Ù„Ø«Ø§Ù†ÙŠØ© ÙÙ‚Ø·"]'::jsonb,
   0, '2+3 = 5 âœ“ et 2âˆ’3 = âˆ’1 âœ“ : les deux Ã©quations sont vÃ©rifiÃ©es.', '2+3 = 5 âœ“ Ùˆ 2âˆ’3 = âˆ’1 âœ“.', 'easy', 3),
  ('Dans la mÃ©thode par substitution, on commence parâ€¦', 'ÙÙŠ Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªØ¹ÙˆÙŠØ¶ Ù†Ø¨Ø¯Ø£ Ø¨Ù€â€¦',
   '["isoler une inconnue","additionner les Ã©quations","tout multiplier par 2","tracer un graphique"]'::jsonb,
   '["Ø¹Ø²Ù„ Ù…Ø¬Ù‡ÙˆÙ„","Ø¬Ù…Ø¹ Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„ØªÙŠÙ†","Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 2","Ø±Ø³Ù… Ø¨ÙŠØ§Ù†"]'::jsonb,
   0, 'On exprime une inconnue en fonction de l''autre puis on remplace.', 'Ù†Ø¹Ø¨Ø± Ø¹Ù† Ù…Ø¬Ù‡ÙˆÙ„ Ø¨Ø¯Ù„Ø§Ù„Ø© Ø§Ù„Ø¢Ø®Ø± Ø«Ù… Ù†Ø¹ÙˆØ¶.', 'easy', 4),
  ('2 stylos + 1 cahier = 130 DA ; 1 stylo + 1 cahier = 90 DA. Prix du stylo ?', 'Ù‚Ù„Ù…Ø§Ù† + ÙƒØ±Ø§Ø³ = 130 Ø¯Ø¬ Ø› Ù‚Ù„Ù… + ÙƒØ±Ø§Ø³ = 90 Ø¯Ø¬. Ø«Ù…Ù† Ø§Ù„Ù‚Ù„Ù…ØŸ',
   '["40 DA","50 DA","30 DA","90 DA"]'::jsonb, '["40 Ø¯Ø¬","50 Ø¯Ø¬","30 Ø¯Ø¬","90 Ø¯Ø¬"]'::jsonb,
   0, 'En soustrayant : 1 stylo = 130 âˆ’ 90 = 40 DA.', 'Ø¨Ø§Ù„Ø·Ø±Ø­: Ø§Ù„Ù‚Ù„Ù… = 40 Ø¯Ø¬.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'systemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- fonctions
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('f(x) = 3x. Que vaut f(5) ?', 'f(x) = 3x. ÙƒÙ… ØªØ³Ø§ÙˆÙŠ f(5)ØŸ',
   '["15","8","35","5/3"]'::jsonb, '["15","8","35","5/3"]'::jsonb,
   0, 'f(5) = 3 Ã— 5 = 15.', 'f(5) = 3 Ã— 5 = 15.', 'easy', 1),
  ('La reprÃ©sentation d''une fonction LINÃ‰AIRE estâ€¦', 'Ø§Ù„ØªÙ…Ø«ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†ÙŠ Ù„Ø¯Ø§Ù„Ø© Ø®Ø·ÙŠØ© Ù‡Ùˆâ€¦',
   '["une droite passant par l''origine","une droite quelconque","une parabole","un cercle"]'::jsonb,
   '["Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙ…Ø± Ø¨Ø§Ù„Ù…Ø¨Ø¯Ø£","Ù…Ø³ØªÙ‚ÙŠÙ… ÙƒÙŠÙÙŠ","Ù‚Ø·Ø¹ Ù…ÙƒØ§ÙØ¦","Ø¯Ø§Ø¦Ø±Ø©"]'::jsonb,
   0, 'LinÃ©aire = proportionnalitÃ© = droite par l''origine.', 'Ø§Ù„Ø®Ø·ÙŠØ© = ØªÙ†Ø§Ø³Ø¨ÙŠØ© = Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙ…Ø± Ø¨Ø§Ù„Ù…Ø¨Ø¯Ø£.', 'easy', 2),
  ('g(x) = 2x + 3. L''ordonnÃ©e Ã  l''origine estâ€¦', 'g(x) = 2x + 3. Ø§Ù„ØªØ±ØªÙŠØ¨ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø¨Ø¯Ø£ Ù‡Ùˆâ€¦',
   '["3","2","5","0"]'::jsonb, '["3","2","5","0"]'::jsonb,
   0, 'b = 3 : la droite coupe l''axe des ordonnÃ©es en 3.', 'b = 3: ÙŠÙ‚Ø·Ø¹ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ù…Ø­ÙˆØ± Ø§Ù„ØªØ±Ø§ØªÙŠØ¨ ÙÙŠ 3.', 'easy', 3),
  ('g(x) = 2x + 3. L''antÃ©cÃ©dent de 11 estâ€¦', 'g(x) = 2x + 3. Ø³Ø§Ø¨Ù‚Ø© Ø§Ù„Ø¹Ø¯Ø¯ 11 Ù‡ÙŠâ€¦',
   '["4","25","7","11"]'::jsonb, '["4","25","7","11"]'::jsonb,
   0, '2x + 3 = 11 â†’ x = 4.', '2x + 3 = 11 â† x = 4.', 'medium', 4),
  ('Une droite passe par (1 ; 2) et (3 ; 8). Son coefficient directeur estâ€¦', 'Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙ…Ø± Ø¨Ù€ (1 Ø› 2) Ùˆ(3 Ø› 8). Ù…Ø¹Ø§Ù…Ù„Ù‡ Ø§Ù„Ù…ÙˆØ¬Ù‡ Ù‡Ùˆâ€¦',
   '["3","2","6","4"]'::jsonb, '["3","2","6","4"]'::jsonb,
   0, 'a = (8âˆ’2)/(3âˆ’1) = 6/2 = 3.', 'a = (8âˆ’2)/(3âˆ’1) = 3.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'fonctions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- statistiques (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Notes : 12 (coef 2) et 15 (coef 3). Moyenne pondÃ©rÃ©e ?', 'Ø¹Ù„Ø§Ù…ØªØ§Ù†: 12 (Ù…Ø¹Ø§Ù…Ù„ 2) Ùˆ15 (Ù…Ø¹Ø§Ù…Ù„ 3). Ø§Ù„Ù…Ø¹Ø¯Ù„ Ø§Ù„Ù…ØªÙˆØ§Ø²Ù†ØŸ',
   '["13,8","13,5","14","12,6"]'::jsonb, '["13.8","13.5","14","12.6"]'::jsonb,
   0, '(24 + 45) Ã· 5 = 13,8.', '(24 + 45) Ã· 5 = 13.8.', 'medium', 1),
  ('SÃ©rie : 8, 10, 12, 15, 19. La mÃ©diane estâ€¦', 'Ø§Ù„Ø³Ù„Ø³Ù„Ø©: 8ØŒ 10ØŒ 12ØŒ 15ØŒ 19. Ø§Ù„ÙˆØ³ÙŠØ· Ù‡Ùˆâ€¦',
   '["12","10","15","12,8"]'::jsonb, '["12","10","15","12.8"]'::jsonb,
   0, 'La valeur du milieu de la sÃ©rie ordonnÃ©e : 12.', 'Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„ÙˆØ³Ø·Ù‰ Ù„Ù„Ø³Ù„Ø³Ù„Ø© Ø§Ù„Ù…Ø±ØªØ¨Ø©: 12.', 'easy', 2),
  ('SÃ©rie : 8, 10, 12, 15, 19. L''Ã©tendue estâ€¦', 'Ø§Ù„Ø³Ù„Ø³Ù„Ø©: 8ØŒ 10ØŒ 12ØŒ 15ØŒ 19. Ø§Ù„Ù…Ø¯Ù‰ Ù‡Ùˆâ€¦',
   '["11","19","8","13"]'::jsonb, '["11","19","8","13"]'::jsonb,
   0, '19 âˆ’ 8 = 11.', '19 âˆ’ 8 = 11.', 'easy', 3),
  ('Sur 25 Ã©lÃ¨ves, 5 ont eu 18. La frÃ©quence de la note 18 estâ€¦', 'Ù…Ù† Ø¨ÙŠÙ† 25 ØªÙ„Ù…ÙŠØ°Ù‹Ø§ØŒ 5 Ù†Ø§Ù„ÙˆØ§ 18. ØªÙˆØ§ØªØ± Ø§Ù„Ø¹Ù„Ø§Ù…Ø© 18 Ù‡Ùˆâ€¦',
   '["20 %","5 %","25 %","18 %"]'::jsonb, '["20 %","5 %","25 %","18 %"]'::jsonb,
   0, '5/25 = 0,20 = 20 %.', '5/25 = 20 %.', 'medium', 4),
  ('SÃ©rie paire : 6, 8, 12, 14. La mÃ©diane estâ€¦', 'Ø³Ù„Ø³Ù„Ø© Ø²ÙˆØ¬ÙŠØ©: 6ØŒ 8ØŒ 12ØŒ 14. Ø§Ù„ÙˆØ³ÙŠØ· Ù‡Ùˆâ€¦',
   '["10","8","12","9"]'::jsonb, '["10","8","12","9"]'::jsonb,
   0, 'Moyenne des deux valeurs centrales : (8+12)/2 = 10.', 'Ù…ØªÙˆØ³Ø· Ø§Ù„Ù‚ÙŠÙ…ØªÙŠÙ† Ø§Ù„ÙˆØ³Ø·ÙŠÙŠÙ†: 10.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'statistiques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- thales
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('ThalÃ¨s s''applique quand les deux droites coupÃ©es sontâ€¦', 'ØªÙØ·Ø¨Ù‚ Ù…Ø¨Ø±Ù‡Ù†Ø© Ø·Ø§Ù„Ø³ Ø¹Ù†Ø¯Ù…Ø§ ÙŠÙƒÙˆÙ† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ø§Ù„Ù…Ù‚Ø·ÙˆØ¹Ø§Ù†â€¦',
   '["parallÃ¨les","perpendiculaires","sÃ©cantes","Ã©gales"]'::jsonb, '["Ù…ØªÙˆØ§Ø²ÙŠÙŠÙ†","Ù…ØªØ¹Ø§Ù…Ø¯ÙŠÙ†","Ù…ØªÙ‚Ø§Ø·Ø¹ÙŠÙ†","Ù…ØªÙ‚Ø§ÙŠØ³ÙŠÙ†"]'::jsonb,
   0, 'La configuration exige (MN) // (BC).', 'Ø§Ù„ÙˆØ¶Ø¹ÙŠØ© ØªØªØ·Ù„Ø¨ (MN) // (BC).', 'easy', 1),
  ('AM = 3, AB = 5, BC = 10 avec (MN)//(BC). MN = ?', 'AM = 3ØŒ AB = 5ØŒ BC = 10 Ùˆ(MN)//(BC). ÙƒÙ… MNØŸ',
   '["6","5","7,5","4"]'::jsonb, '["6","5","7.5","4"]'::jsonb,
   0, 'MN = BC Ã— AM/AB = 10 Ã— 3/5 = 6.', 'MN = 10 Ã— 3/5 = 6.', 'medium', 2),
  ('Les rapports de ThalÃ¨s sont : AM/AB = AN/AC = â€¦', 'Ù†Ø³Ø¨ Ø·Ø§Ù„Ø³: AM/AB = AN/AC = â€¦',
   '["MN/BC","BC/MN","AB/AC","AM/AN"]'::jsonb, '["MN/BC","BC/MN","AB/AC","AM/AN"]'::jsonb,
   0, 'Le troisiÃ¨me rapport porte sur les cÃ´tÃ©s parallÃ¨les.', 'Ø§Ù„Ù†Ø³Ø¨Ø© Ø§Ù„Ø«Ø§Ù„Ø«Ø© ØªØ®Øµ Ø§Ù„Ø¶Ù„Ø¹ÙŠÙ† Ø§Ù„Ù…ØªÙˆØ§Ø²ÙŠÙŠÙ†.', 'easy', 3),
  ('Si AM/AB = AN/AC (mÃªme ordre), alorsâ€¦', 'Ø¥Ø°Ø§ ÙƒØ§Ù† AM/AB = AN/AC (Ø¨Ù†ÙØ³ Ø§Ù„ØªØ±ØªÙŠØ¨) ÙØ¥Ù†â€¦',
   '["(MN) // (BC)","(MN) âŠ¥ (BC)","M = N","rien"]'::jsonb, '["(MN) // (BC)","(MN) âŠ¥ (BC)","M = N","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'C''est la rÃ©ciproque du thÃ©orÃ¨me de ThalÃ¨s.', 'Ù‡Ø°Ø§ Ù‡Ùˆ Ø¹ÙƒØ³ Ù…Ø¨Ø±Ù‡Ù†Ø© Ø·Ø§Ù„Ø³.', 'medium', 4),
  ('RÃ©duction de rapport k = 1/2 : les aires sont multipliÃ©es parâ€¦', 'ØªØµØºÙŠØ± Ø¨Ù†Ø³Ø¨Ø© k = 1/2: ØªÙØ¶Ø±Ø¨ Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª ÙÙŠâ€¦',
   '["1/4","1/2","2","1/8"]'::jsonb, '["1/4","1/2","2","1/8"]'::jsonb,
   0, 'Les aires sont multipliÃ©es par kÂ² = 1/4.', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª ØªÙØ¶Ø±Ø¨ ÙÙŠ kÂ² = 1/4.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'thales'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- trigonometrie (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('cos Î± = ?', 'Ø¬ØªØ§ Î± = ØŸ',
   '["adjacent / hypotÃ©nuse","opposÃ© / hypotÃ©nuse","opposÃ© / adjacent","hypotÃ©nuse / adjacent"]'::jsonb,
   '["Ø§Ù„Ù…Ø¬Ø§ÙˆØ± Ã· Ø§Ù„ÙˆØªØ±","Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ã· Ø§Ù„ÙˆØªØ±","Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ Ã· Ø§Ù„Ù…Ø¬Ø§ÙˆØ±","Ø§Ù„ÙˆØªØ± Ã· Ø§Ù„Ù…Ø¬Ø§ÙˆØ±"]'::jsonb,
   0, 'CAH : Cosinus = Adjacent / HypotÃ©nuse.', 'Ø¬ØªØ§ = Ø§Ù„Ù…Ø¬Ø§ÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„ÙˆØªØ±.', 'easy', 1),
  ('HypotÃ©nuse 10 cm, angle 30Â°. Le cÃ´tÃ© opposÃ© vautâ€¦ (sin 30Â° = 0,5)', 'Ø§Ù„ÙˆØªØ± 10 Ø³Ù… ÙˆØ§Ù„Ø²Ø§ÙˆÙŠØ© 30Â°. Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ ÙŠØ³Ø§ÙˆÙŠâ€¦ (Ø¬Ø§ 30Â° = 0.5)',
   '["5 cm","10 cm","8,7 cm","2,5 cm"]'::jsonb, '["5 Ø³Ù…","10 Ø³Ù…","8.7 Ø³Ù…","2.5 Ø³Ù…"]'::jsonb,
   0, 'opposÃ© = 10 Ã— sin 30Â° = 5 cm.', 'Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ = 10 Ã— 0.5 = 5 Ø³Ù….', 'medium', 2),
  ('cosÂ²Î± + sinÂ²Î± = ?', 'Ø¬ØªØ§Â²Î± + Ø¬Ø§Â²Î± = ØŸ',
   '["1","0","2","cos 2Î±"]'::jsonb, '["1","0","2","Ø¬ØªØ§ 2Î±"]'::jsonb,
   0, 'Relation fondamentale de la trigonomÃ©trie.', 'Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© ÙÙŠ Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª.', 'easy', 3),
  ('tan Î± = ?', 'Ø¸Ø§ Î± = ØŸ',
   '["sin Î± / cos Î±","cos Î± / sin Î±","1 / sin Î±","sin Î± Ã— cos Î±"]'::jsonb,
   '["Ø¬Ø§ Î± Ã· Ø¬ØªØ§ Î±","Ø¬ØªØ§ Î± Ã· Ø¬Ø§ Î±","1 Ã· Ø¬Ø§ Î±","Ø¬Ø§ Î± Ã— Ø¬ØªØ§ Î±"]'::jsonb,
   0, 'tan = sin / cos = opposÃ© / adjacent.', 'Ø¸Ø§ = Ø¬Ø§ Ã· Ø¬ØªØ§.', 'medium', 4),
  ('Le cosinus d''un angle aigu est toujoursâ€¦', 'Ø¬ØªØ§ Ø²Ø§ÙˆÙŠØ© Ø­Ø§Ø¯Ø© Ø¯Ø§Ø¦Ù…Ù‹Ø§â€¦',
   '["entre 0 et 1","supÃ©rieur Ã  1","nÃ©gatif","Ã©gal Ã  1"]'::jsonb, '["Ø¨ÙŠÙ† 0 Ùˆ1","Ø£ÙƒØ¨Ø± Ù…Ù† 1","Ø³Ø§Ù„Ø¨","ÙŠØ³Ø§ÙˆÙŠ 1"]'::jsonb,
   0, 'L''hypotÃ©nuse est le plus grand cÃ´tÃ©, donc le rapport < 1.', 'Ø§Ù„ÙˆØªØ± Ø£ÙƒØ¨Ø± Ø¶Ù„Ø¹ ÙØ§Ù„Ù†Ø³Ø¨Ø© Ø£ØµØºØ± Ù…Ù† 1.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'trigonometrie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie-espace (4AM)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Volume d''une pyramide = ?', 'Ø­Ø¬Ù… Ø§Ù„Ù‡Ø±Ù… = ØŸ',
   '["(base Ã— hauteur) Ã· 3","base Ã— hauteur","(base Ã— hauteur) Ã· 2","base + hauteur"]'::jsonb,
   '["(Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹) Ã· 3","Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹","(Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹) Ã· 2","Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© + Ø§Ù„Ø§Ø±ØªÙØ§Ø¹"]'::jsonb,
   0, 'Pyramide et cÃ´ne : le tiers du prisme/cylindre.', 'Ø§Ù„Ù‡Ø±Ù… ÙˆØ§Ù„Ù…Ø®Ø±ÙˆØ·: Ø«Ù„Ø« Ø§Ù„Ù…ÙˆØ´ÙˆØ±/Ø§Ù„Ø£Ø³Ø·ÙˆØ§Ù†Ø©.', 'easy', 1),
  ('Volume d''une boule de rayon r = ?', 'Ø­Ø¬Ù… ÙƒØ±Ø© Ù†ØµÙ Ù‚Ø·Ø±Ù‡Ø§ r = ØŸ',
   '["(4/3) Ï€ rÂ³","4 Ï€ rÂ²","Ï€ rÂ² h","(1/3) Ï€ rÂ³"]'::jsonb, '["(4/3) Ï€ rÂ³","4 Ï€ rÂ²","Ï€ rÂ² h","(1/3) Ï€ rÂ³"]'::jsonb,
   0, 'V = (4/3)Ï€rÂ³ ; 4Ï€rÂ² est l''aire de la sphÃ¨re.', 'V = (4/3)Ï€rÂ³ Ø£Ù…Ø§ 4Ï€rÂ² ÙÙ‡ÙŠ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø³Ø·Ø­.', 'medium', 2),
  ('CÃ´ne : r = 3 cm, h = 7 cm. Volume ?', 'Ù…Ø®Ø±ÙˆØ·: r = 3 Ø³Ù… Ùˆ h = 7 Ø³Ù…. Ø§Ù„Ø­Ø¬Ù…ØŸ',
   '["21Ï€ cmÂ³","63Ï€ cmÂ³","9Ï€ cmÂ³","42Ï€ cmÂ³"]'::jsonb, '["21Ï€ Ø³Ù…Â³","63Ï€ Ø³Ù…Â³","9Ï€ Ø³Ù…Â³","42Ï€ Ø³Ù…Â³"]'::jsonb,
   0, 'V = Ï€Ã—9Ã—7Ã·3 = 21Ï€ cmÂ³.', 'V = Ï€Ã—9Ã—7Ã·3 = 21Ï€ Ø³Ù…Â³.', 'medium', 3),
  ('1 litre = ?', '1 Ù„ØªØ± = ØŸ',
   '["1 dmÂ³","1 mÂ³","1 cmÂ³","10 dmÂ³"]'::jsonb, '["1 Ø¯Ø³Ù…Â³","1 Ù…Â³","1 Ø³Ù…Â³","10 Ø¯Ø³Ù…Â³"]'::jsonb,
   0, '1 L = 1 dmÂ³.', '1 Ù„ = 1 Ø¯Ø³Ù…Â³.', 'easy', 4),
  ('RÃ©duction de rapport k : les volumes sont multipliÃ©s parâ€¦', 'ØªØµØºÙŠØ± Ø¨Ù†Ø³Ø¨Ø© k: ØªÙØ¶Ø±Ø¨ Ø§Ù„Ø­Ø¬ÙˆÙ… ÙÙŠâ€¦',
   '["kÂ³","kÂ²","k","3k"]'::jsonb, '["kÂ³","kÂ²","k","3k"]'::jsonb,
   0, 'Longueurs Ã—k, aires Ã—kÂ², volumes Ã—kÂ³.', 'Ø§Ù„Ø£Ø·ÙˆØ§Ù„ Ã—k ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø§Øª Ã—kÂ² ÙˆØ§Ù„Ø­Ø¬ÙˆÙ… Ã—kÂ³.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ======================= 3AS =======================

-- limites-continuite
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('lim (1/x) quand x â†’ +âˆž = ?', 'Ù†Ù‡Ø§ÙŠØ© 1/x Ù„Ù…Ø§ x â†’ +âˆž = ØŸ',
   '["0","+âˆž","1","âˆ’âˆž"]'::jsonb, '["0","+âˆž","1","âˆ’âˆž"]'::jsonb,
   0, '1/x devient aussi petit que l''on veut.', '1/x ÙŠØµØºØ± ÙƒÙ…Ø§ Ù†Ø´Ø§Ø¡.', 'easy', 1),
  ('Si lim f(x) = 3 quand x â†’ +âˆž, la courbe admetâ€¦', 'Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ù†Ù‡Ø§ÙŠØ© f Ø¹Ù†Ø¯ +âˆž ØªØ³Ø§ÙˆÙŠ 3 ÙØ¥Ù† Ø§Ù„Ù…Ù†Ø­Ù†Ù‰ ÙŠÙ‚Ø¨Ù„â€¦',
   '["une asymptote horizontale y = 3","une asymptote verticale x = 3","un extremum en 3","rien"]'::jsonb,
   '["Ù…Ù‚Ø§Ø±Ø¨Ù‹Ø§ Ø£ÙÙ‚ÙŠÙ‹Ø§ y = 3","Ù…Ù‚Ø§Ø±Ø¨Ù‹Ø§ Ø´Ø§Ù‚ÙˆÙ„ÙŠÙ‹Ø§ x = 3","Ù‚ÙŠÙ…Ø© Ø­Ø¯ÙŠØ© Ø¹Ù†Ø¯ 3","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'Limite finie en âˆž â†’ asymptote horizontale.', 'Ù†Ù‡Ø§ÙŠØ© Ù…Ù†ØªÙ‡ÙŠØ© Ø¹Ù†Ø¯ âˆž â† Ù…Ù‚Ø§Ø±Ø¨ Ø£ÙÙ‚ÙŠ.', 'medium', 2),
  ('lim (2xÂ³ âˆ’ 5x + 1) quand x â†’ +âˆž = ?', 'Ù†Ù‡Ø§ÙŠØ© (2xÂ³ âˆ’ 5x + 1) Ù„Ù…Ø§ x â†’ +âˆž = ØŸ',
   '["+âˆž","âˆ’âˆž","2","0"]'::jsonb, '["+âˆž","âˆ’âˆž","2","0"]'::jsonb,
   0, 'C''est la limite du terme dominant 2xÂ³.', 'Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¹Ù„Ù‰ Ø¯Ø±Ø¬Ø© 2xÂ³.', 'medium', 3),
  ('Â« âˆž/âˆž Â» estâ€¦', 'Â«âˆž/âˆžÂ» Ù‡ÙŠâ€¦',
   '["une forme indÃ©terminÃ©e","toujours Ã©gale Ã  1","toujours +âˆž","toujours 0"]'::jsonb,
   '["Ø­Ø§Ù„Ø© Ø¹Ø¯Ù… ØªØ¹ÙŠÙŠÙ†","ØªØ³Ø§ÙˆÙŠ 1 Ø¯Ø§Ø¦Ù…Ù‹Ø§","+âˆž Ø¯Ø§Ø¦Ù…Ù‹Ø§","0 Ø¯Ø§Ø¦Ù…Ù‹Ø§"]'::jsonb,
   0, 'Il faut lever l''indÃ©termination (factoriser).', 'ÙŠØ¬Ø¨ Ø¥Ø²Ø§Ù„Ø© Ø¹Ø¯Ù… Ø§Ù„ØªØ¹ÙŠÙŠÙ† (Ø¨Ø§Ù„ØªØ­Ù„ÙŠÙ„).', 'easy', 4),
  ('f continue et strictement croissante sur [0;2], f(0) = âˆ’1, f(2) = 5. L''Ã©quation f(x) = 0 admetâ€¦', 'f Ù…Ø³ØªÙ…Ø±Ø© ÙˆÙ…ØªØ²Ø§ÙŠØ¯Ø© ØªÙ…Ø§Ù…Ù‹Ø§ Ø¹Ù„Ù‰ [0;2]ØŒ f(0) = âˆ’1 Ùˆf(2) = 5. Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø© f(x) = 0 ØªÙ‚Ø¨Ù„â€¦',
   '["une unique solution dans [0;2]","aucune solution","deux solutions","une infinitÃ©"]'::jsonb,
   '["Ø­Ù„Ø§Ù‹ ÙˆØ­ÙŠØ¯Ù‹Ø§ ÙÙŠ [0;2]","Ù„Ø§ Ø­Ù„","Ø­Ù„ÙŠÙ†","Ø¹Ø¯Ø¯Ù‹Ø§ ØºÙŠØ± Ù…Ù†ØªÙ‡Ù"]'::jsonb,
   0, 'TVI + stricte monotonie : existence ET unicitÃ©.', 'Ù…Ø¨Ø±Ù‡Ù†Ø© Ø§Ù„Ù‚ÙŠÙ… Ø§Ù„Ù…ØªÙˆØ³Ø·Ø© Ù…Ø¹ Ø§Ù„Ø±ØªØ§Ø¨Ø© Ø§Ù„ØªØ§Ù…Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'limites-continuite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- derivation
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La dÃ©rivÃ©e de xÂ³ estâ€¦', 'Ù…Ø´ØªÙ‚Ø© xÂ³ Ù‡ÙŠâ€¦',
   '["3xÂ²","xÂ²","3x","xÂ³/3"]'::jsonb, '["3xÂ²","xÂ²","3x","xÂ³/3"]'::jsonb,
   0, '(xâ¿)'' = nÂ·xâ¿â»Â¹.', '(xâ¿)'' = nÂ·xâ¿â»Â¹.', 'easy', 1),
  ('Si f''(x) > 0 sur I, alors f estâ€¦ sur I', 'Ø¥Ø°Ø§ ÙƒØ§Ù†Øª f''(x) > 0 Ø¹Ù„Ù‰ Ù…Ø¬Ø§Ù„ ÙØ¥Ù† f Ø¹Ù„ÙŠÙ‡â€¦',
   '["croissante","dÃ©croissante","constante","nulle"]'::jsonb, '["Ù…ØªØ²Ø§ÙŠØ¯Ø©","Ù…ØªÙ†Ø§Ù‚ØµØ©","Ø«Ø§Ø¨ØªØ©","Ù…Ø¹Ø¯ÙˆÙ…Ø©"]'::jsonb,
   0, 'DÃ©rivÃ©e positive = fonction croissante.', 'Ù…Ø´ØªÙ‚Ø© Ù…ÙˆØ¬Ø¨Ø© = Ø¯Ø§Ù„Ø© Ù…ØªØ²Ø§ÙŠØ¯Ø©.', 'easy', 2),
  ('La tangente en a a pour Ã©quationâ€¦', 'Ù…Ø¹Ø§Ø¯Ù„Ø© Ø§Ù„Ù…Ù…Ø§Ø³ Ø¹Ù†Ø¯ a Ù‡ÙŠâ€¦',
   '["y = f''(a)(xâˆ’a) + f(a)","y = f(a)(xâˆ’a) + f''(a)","y = f''(a)Â·x","y = f(a)"]'::jsonb,
   '["y = f''(a)(xâˆ’a) + f(a)","y = f(a)(xâˆ’a) + f''(a)","y = f''(a)Â·x","y = f(a)"]'::jsonb,
   0, 'Formule de la tangente au point d''abscisse a.', 'ØµÙŠØºØ© Ø§Ù„Ù…Ù…Ø§Ø³ Ø¹Ù†Ø¯ Ø§Ù„Ù†Ù‚Ø·Ø© Ø°Ø§Øª Ø§Ù„ÙØ§ØµÙ„Ø© a.', 'medium', 3),
  ('DÃ©rivÃ©e de f(x) = xÂ² âˆ’ 4x + 1 ?', 'Ù…Ø´ØªÙ‚Ø© f(x) = xÂ² âˆ’ 4x + 1ØŸ',
   '["2x âˆ’ 4","2x + 4","x âˆ’ 4","2x âˆ’ 3"]'::jsonb, '["2x âˆ’ 4","2x + 4","x âˆ’ 4","2x âˆ’ 3"]'::jsonb,
   0, '(xÂ²)'' = 2x, (âˆ’4x)'' = âˆ’4, (1)'' = 0.', 'Ù…Ø´ØªÙ‚Ø© ÙƒÙ„ Ø­Ø¯ Ø¹Ù„Ù‰ Ø­Ø¯Ø©.', 'medium', 4),
  ('f''(x) = 2x âˆ’ 4 s''annule en x = 2 en changeant de signe (âˆ’ puis +). En 2, f admetâ€¦', 'f''(x) = 2x âˆ’ 4 ØªÙ†Ø¹Ø¯Ù… Ø¹Ù†Ø¯ 2 Ù…ØºÙŠÙ‘Ø±Ø© Ø¥Ø´Ø§Ø±ØªÙ‡Ø§ (âˆ’ Ø«Ù… +). Ø¹Ù†Ø¯ 2 ØªÙ‚Ø¨Ù„ fâ€¦',
   '["un minimum","un maximum","une asymptote","rien"]'::jsonb, '["Ù‚ÙŠÙ…Ø© Ø­Ø¯ÙŠØ© ØµØºØ±Ù‰","Ù‚ÙŠÙ…Ø© Ø­Ø¯ÙŠØ© ÙƒØ¨Ø±Ù‰","Ù…Ù‚Ø§Ø±Ø¨Ù‹Ø§","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'f dÃ©croÃ®t puis croÃ®t : minimum local en x = 2.', 'f ØªØªÙ†Ø§Ù‚Øµ Ø«Ù… ØªØªØ²Ø§ÙŠØ¯: Ù‚ÙŠÙ…Ø© ØµØºØ±Ù‰ Ø¹Ù†Ø¯ 2.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'derivation'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- exponentielle
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('eâ° = ?', 'eâ° = ØŸ',
   '["1","0","e","âˆ’1"]'::jsonb, '["1","0","e","âˆ’1"]'::jsonb,
   0, 'Tout nombre non nul Ã  la puissance 0 vaut 1.', 'Ø£ÙŠ Ø¹Ø¯Ø¯ ØºÙŠØ± Ù…Ø¹Ø¯ÙˆÙ… Ø£Ø³Ù‡ 0 ÙŠØ³Ø§ÙˆÙŠ 1.', 'easy', 1),
  ('e^a Ã— e^b = ?', 'e^a Ã— e^b = ØŸ',
   '["e^(a+b)","e^(ab)","e^(aâˆ’b)","e^a + e^b"]'::jsonb, '["e^(a+b)","e^(ab)","e^(aâˆ’b)","e^a + e^b"]'::jsonb,
   0, 'Produit d''exponentielles : on additionne les exposants.', 'Ø¬Ø¯Ø§Ø¡ Ø§Ù„Ø£Ø³ÙŠØ§Øª: Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø£Ø³Ø³.', 'easy', 2),
  ('La dÃ©rivÃ©e de e^(2x) estâ€¦', 'Ù…Ø´ØªÙ‚Ø© e^(2x) Ù‡ÙŠâ€¦',
   '["2e^(2x)","e^(2x)","2xÂ·e^(2x)","e^(2x)/2"]'::jsonb, '["2e^(2x)","e^(2x)","2xÂ·e^(2x)","e^(2x)/2"]'::jsonb,
   0, '(e^u)'' = u''Â·e^u avec u'' = 2.', '(e^u)'' = u''Â·e^u Ø­ÙŠØ« u'' = 2.', 'medium', 3),
  ('Pour tout x rÃ©el, eË£ estâ€¦', 'Ù…Ù† Ø£Ø¬Ù„ ÙƒÙ„ x Ø­Ù‚ÙŠÙ‚ÙŠØŒ eË£â€¦',
   '["strictement positif","parfois nÃ©gatif","nul en 0","supÃ©rieur Ã  1"]'::jsonb,
   '["Ù…ÙˆØ¬Ø¨ ØªÙ…Ø§Ù…Ù‹Ø§","Ø³Ø§Ù„Ø¨ Ø£Ø­ÙŠØ§Ù†Ù‹Ø§","Ù…Ø¹Ø¯ÙˆÙ… Ø¹Ù†Ø¯ 0","Ø£ÙƒØ¨Ø± Ù…Ù† 1"]'::jsonb,
   0, 'eË£ > 0 pour tout x â€” jamais nul, jamais nÃ©gatif.', 'eË£ > 0 Ø¯Ø§Ø¦Ù…Ù‹Ø§.', 'easy', 4),
  ('RÃ©sous : eË£ = 5', 'Ø­Ù„: eË£ = 5',
   '["x = ln 5","x = 5e","x = eâµ","x = 5"]'::jsonb, '["x = ln 5","x = 5e","x = eâµ","x = 5"]'::jsonb,
   0, 'eË£ = k âŸº x = ln k (k > 0).', 'eË£ = k âŸº x = ln k.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'exponentielle'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- logarithme
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('ln 1 = ?', 'ln 1 = ØŸ',
   '["0","1","e","âˆ’1"]'::jsonb, '["0","1","e","âˆ’1"]'::jsonb,
   0, 'ln 1 = 0 car eâ° = 1.', 'ln 1 = 0 Ù„Ø£Ù† eâ° = 1.', 'easy', 1),
  ('ln(a Ã— b) = ?', 'ln(a Ã— b) = ØŸ',
   '["ln a + ln b","ln a Ã— ln b","ln a âˆ’ ln b","ln(a+b)"]'::jsonb, '["ln a + ln b","ln a Ã— ln b","ln a âˆ’ ln b","ln(a+b)"]'::jsonb,
   0, 'Le log transforme les produits en sommes.', 'Ø§Ù„Ù„ÙˆØºØ§Ø±ÙŠØªÙ… ÙŠØ­ÙˆÙ„ Ø§Ù„Ø¬Ø¯Ø§Ø¡ Ø¥Ù„Ù‰ Ù…Ø¬Ù…ÙˆØ¹.', 'easy', 2),
  ('ln est dÃ©finie surâ€¦', 'ln Ù…Ø¹Ø±ÙØ© Ø¹Ù„Ù‰â€¦',
   '["]0 ; +âˆž[","R","[0 ; +âˆž[","R*"]'::jsonb, '["]0 ; +âˆž[","R","[0 ; +âˆž[","R*"]'::jsonb,
   0, 'Pas de logarithme d''un nombre nÃ©gatif ou nul.', 'Ù„Ø§ Ù„ÙˆØºØ§Ø±ÙŠØªÙ… Ù„Ø¹Ø¯Ø¯ Ø³Ø§Ù„Ø¨ Ø£Ùˆ Ù…Ø¹Ø¯ÙˆÙ….', 'medium', 3),
  ('La dÃ©rivÃ©e de ln x estâ€¦', 'Ù…Ø´ØªÙ‚Ø© ln x Ù‡ÙŠâ€¦',
   '["1/x","ln x","x","eË£"]'::jsonb, '["1/x","ln x","x","eË£"]'::jsonb,
   0, '(ln x)'' = 1/x sur ]0;+âˆž[.', '(ln x)'' = 1/x.', 'easy', 4),
  ('RÃ©sous : ln x = 2', 'Ø­Ù„: ln x = 2',
   '["x = eÂ²","x = 2e","x = ln 2","x = 2"]'::jsonb, '["x = eÂ²","x = 2e","x = ln 2","x = 2"]'::jsonb,
   0, 'ln x = k âŸº x = eáµ.', 'ln x = k âŸº x = eáµ.', 'medium', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'logarithme'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- integrales
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une primitive de 2x estâ€¦', 'Ø¯Ø§Ù„Ø© Ø£ØµÙ„ÙŠØ© Ù„Ù€ 2x Ù‡ÙŠâ€¦',
   '["xÂ²","2","2xÂ²","xÂ²/2"]'::jsonb, '["xÂ²","2","2xÂ²","xÂ²/2"]'::jsonb,
   0, '(xÂ²)'' = 2x.', '(xÂ²)'' = 2x.', 'easy', 1),
  ('âˆ«â‚€Â¹ 2x dx = ?', 'âˆ«â‚€Â¹ 2x dx = ØŸ',
   '["1","2","0","1/2"]'::jsonb, '["1","2","0","1/2"]'::jsonb,
   0, '[xÂ²]â‚€Â¹ = 1 âˆ’ 0 = 1.', '[xÂ²]â‚€Â¹ = 1.', 'medium', 2),
  ('Une primitive de eË£ estâ€¦', 'Ø¯Ø§Ù„Ø© Ø£ØµÙ„ÙŠØ© Ù„Ù€ eË£ Ù‡ÙŠâ€¦',
   '["eË£","xÂ·eË£","eË£/x","ln x"]'::jsonb, '["eË£","xÂ·eË£","eË£/x","ln x"]'::jsonb,
   0, 'L''exponentielle est sa propre dÃ©rivÃ©e et primitive.', 'Ø§Ù„Ø£Ø³ÙŠØ© Ù…Ø´ØªÙ‚ØªÙ‡Ø§ ÙˆØ£ØµÙ„ÙŠØªÙ‡Ø§ Ù†ÙØ³Ù‡Ø§.', 'easy', 3),
  ('Une primitive de 1/x sur ]0;+âˆž[ estâ€¦', 'Ø¯Ø§Ù„Ø© Ø£ØµÙ„ÙŠØ© Ù„Ù€ 1/x Ø¹Ù„Ù‰ ]0;+âˆž[ Ù‡ÙŠâ€¦',
   '["ln x","1/xÂ²","âˆ’1/xÂ²","x"]'::jsonb, '["ln x","1/xÂ²","âˆ’1/xÂ²","x"]'::jsonb,
   0, '(ln x)'' = 1/x.', '(ln x)'' = 1/x.', 'medium', 4),
  ('Si f â‰¥ 0 sur [a;b], âˆ«â‚áµ‡ f reprÃ©senteâ€¦', 'Ø¥Ø°Ø§ ÙƒØ§Ù†Øª f â‰¥ 0 Ø¹Ù„Ù‰ [a;b] ÙØ¥Ù† âˆ«â‚áµ‡ f ÙŠÙ…Ø«Ù„â€¦',
   '["l''aire sous la courbe","la pente","la moyenne","le pÃ©rimÃ¨tre"]'::jsonb,
   '["Ø§Ù„Ù…Ø³Ø§Ø­Ø© ØªØ­Øª Ø§Ù„Ù…Ù†Ø­Ù†Ù‰","Ø§Ù„Ù…ÙŠÙ„","Ø§Ù„Ù…ØªÙˆØ³Ø·","Ø§Ù„Ù…Ø­ÙŠØ·"]'::jsonb,
   0, 'L''intÃ©grale d''une fonction positive = aire sous la courbe.', 'ØªÙƒØ§Ù…Ù„ Ø¯Ø§Ù„Ø© Ù…ÙˆØ¬Ø¨Ø© = Ø§Ù„Ù…Ø³Ø§Ø­Ø© ØªØ­Øª Ø§Ù„Ù…Ù†Ø­Ù†Ù‰.', 'easy', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'integrales'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- probabilites (3AS)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('P_A(B) = ?', 'P_A(B) = ØŸ',
   '["P(Aâˆ©B)/P(A)","P(A)Ã—P(B)","P(AâˆªB)","P(B)/P(A)"]'::jsonb, '["P(Aâˆ©B)/P(A)","P(A)Ã—P(B)","P(AâˆªB)","P(B)/P(A)"]'::jsonb,
   0, 'DÃ©finition de la probabilitÃ© conditionnelle.', 'ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„ Ø§Ù„Ø´Ø±Ø·ÙŠ.', 'easy', 1),
  ('A et B indÃ©pendants âŸº â€¦', 'A ÙˆB Ù…Ø³ØªÙ‚Ù„ØªØ§Ù† âŸº â€¦',
   '["P(Aâˆ©B) = P(A)Ã—P(B)","P(Aâˆ©B) = 0","P(AâˆªB) = 1","P(A) = P(B)"]'::jsonb,
   '["P(Aâˆ©B) = P(A)Ã—P(B)","P(Aâˆ©B) = 0","P(AâˆªB) = 1","P(A) = P(B)"]'::jsonb,
   0, 'C''est la dÃ©finition de l''indÃ©pendance.', 'Ù‡Ø°Ø§ ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø§Ø³ØªÙ‚Ù„Ø§Ù„ÙŠØ©.', 'medium', 2),
  ('X suit B(5 ; 0,8). E(X) = ?', 'X ÙŠØªØ¨Ø¹ B(5 Ø› 0.8). Ø§Ù„Ø£Ù…Ù„ E(X) = ØŸ',
   '["4","0,8","5","3,2"]'::jsonb, '["4","0.8","5","3.2"]'::jsonb,
   0, 'E(X) = nÂ·p = 5 Ã— 0,8 = 4.', 'E(X) = nÂ·p = 4.', 'medium', 3),
  ('Sur un arbre, la probabilitÃ© d''un chemin estâ€¦', 'ÙÙŠ Ø§Ù„Ø´Ø¬Ø±Ø©ØŒ Ø§Ø­ØªÙ…Ø§Ù„ Ø§Ù„Ù…Ø³Ø§Ø± Ù‡Ùˆâ€¦',
   '["le produit des branches","la somme des branches","le maximum","toujours 1"]'::jsonb,
   '["Ø¬Ø¯Ø§Ø¡ Ø§Ù„ÙØ±ÙˆØ¹","Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ÙØ±ÙˆØ¹","Ø§Ù„Ø£ÙƒØ¨Ø±","Ø¯Ø§Ø¦Ù…Ù‹Ø§ 1"]'::jsonb,
   0, 'On multiplie les probabilitÃ©s le long du chemin.', 'Ù†Ø¶Ø±Ø¨ Ø§Ù„Ø§Ø­ØªÙ…Ø§Ù„Ø§Øª Ø¹Ù„Ù‰ Ø·ÙˆÙ„ Ø§Ù„Ù…Ø³Ø§Ø±.', 'easy', 4),
  ('Un dÃ© Ã©quilibrÃ© : P(obtenir 6 deux fois de suite) = ?', 'Ø²Ù‡Ø± Ù…ØªÙˆØ§Ø²Ù†: Ø§Ø­ØªÙ…Ø§Ù„ Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ 6 Ù…Ø±ØªÙŠÙ† Ù…ØªØªØ§Ù„ÙŠØªÙŠÙ†ØŸ',
   '["1/36","1/6","1/12","2/6"]'::jsonb, '["1/36","1/6","1/12","2/6"]'::jsonb,
   0, 'Lancers indÃ©pendants : 1/6 Ã— 1/6 = 1/36.', 'Ø±Ù…ÙŠØªØ§Ù† Ù…Ø³ØªÙ‚Ù„ØªØ§Ù†: 1/6 Ã— 1/6 = 1/36.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'probabilites'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- complexes
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('iÂ² = ?', 'iÂ² = ØŸ',
   '["âˆ’1","1","i","0"]'::jsonb, '["âˆ’1","1","i","0"]'::jsonb,
   0, 'Par dÃ©finition du nombre i.', 'Ø­Ø³Ø¨ ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø¹Ø¯Ø¯ i.', 'easy', 1),
  ('Le conjuguÃ© de z = 3 + 2i estâ€¦', 'Ù…Ø±Ø§ÙÙ‚ z = 3 + 2i Ù‡Ùˆâ€¦',
   '["3 âˆ’ 2i","âˆ’3 + 2i","âˆ’3 âˆ’ 2i","2 + 3i"]'::jsonb, '["3 âˆ’ 2i","âˆ’3 + 2i","âˆ’3 âˆ’ 2i","2 + 3i"]'::jsonb,
   0, 'On change le signe de la partie imaginaire.', 'Ù†ØºÙŠØ± Ø¥Ø´Ø§Ø±Ø© Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØªØ®ÙŠÙ„ÙŠ.', 'easy', 2),
  ('|3 + 4i| = ?', '|3 + 4i| = ØŸ',
   '["5","7","25","âˆš7"]'::jsonb, '["5","7","25","âˆš7"]'::jsonb,
   0, 'âˆš(9 + 16) = âˆš25 = 5.', 'âˆš(9 + 16) = 5.', 'medium', 3),
  ('Un argument de z = 1 + i estâ€¦', 'Ø¹Ù…Ø¯Ø© z = 1 + i Ù‡ÙŠâ€¦',
   '["Ï€/4","Ï€/2","Ï€/3","Ï€"]'::jsonb, '["Ï€/4","Ï€/2","Ï€/3","Ï€"]'::jsonb,
   0, 'cos Î¸ = sin Î¸ = 1/âˆš2 â†’ Î¸ = Ï€/4.', 'Ø¬ØªØ§ Î¸ = Ø¬Ø§ Î¸ = 1/âˆš2 â† Î¸ = Ï€/4.', 'medium', 4),
  ('zÂ² + 4 = 0. Les solutions sontâ€¦', 'zÂ² + 4 = 0. Ø§Ù„Ø­Ù„ÙˆÙ„ Ù‡ÙŠâ€¦',
   '["z = 2i ou z = âˆ’2i","z = 2 ou z = âˆ’2","z = 4i","aucune"]'::jsonb, '["z = 2i Ø£Ùˆ z = âˆ’2i","z = 2 Ø£Ùˆ z = âˆ’2","z = 4i","Ù„Ø§ Ø­Ù„ÙˆÙ„"]'::jsonb,
   0, 'zÂ² = âˆ’4 = (2i)Â² â†’ z = Â±2i.', 'zÂ² = âˆ’4 â† z = Â±2i.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'complexes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- geometrie-espace (3AS)
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('u(1;2;3) et v(2;âˆ’1;0). uÂ·v = ?', 'u(1;2;3) Ùˆv(2;âˆ’1;0). Ø§Ù„Ø¬Ø¯Ø§Ø¡ Ø§Ù„Ø³Ù„Ù…ÙŠ uÂ·v = ØŸ',
   '["0","4","8","âˆ’4"]'::jsonb, '["0","4","8","âˆ’4"]'::jsonb,
   0, '1Ã—2 + 2Ã—(âˆ’1) + 3Ã—0 = 0 : vecteurs orthogonaux.', '2 âˆ’ 2 + 0 = 0: Ø§Ù„Ø´Ø¹Ø§Ø¹Ø§Ù† Ù…ØªØ¹Ø§Ù…Ø¯Ø§Ù†.', 'medium', 1),
  ('u âŠ¥ v âŸº â€¦', 'u âŠ¥ v âŸº â€¦',
   '["uÂ·v = 0","uÂ·v = 1","||u|| = ||v||","u = âˆ’v"]'::jsonb, '["uÂ·v = 0","uÂ·v = 1","||u|| = ||v||","u = âˆ’v"]'::jsonb,
   0, 'OrthogonalitÃ© = produit scalaire nul.', 'Ø§Ù„ØªØ¹Ø§Ù…Ø¯ = Ø¬Ø¯Ø§Ø¡ Ø³Ù„Ù…ÙŠ Ù…Ø¹Ø¯ÙˆÙ….', 'easy', 2),
  ('Le vecteur normal du plan 2x âˆ’ y + 3z âˆ’ 8 = 0 estâ€¦', 'Ø§Ù„Ø´Ø¹Ø§Ø¹ Ø§Ù„Ù†Ø§Ø¸Ù…ÙŠ Ù„Ù„Ù…Ø³ØªÙˆÙŠ 2x âˆ’ y + 3z âˆ’ 8 = 0 Ù‡Ùˆâ€¦',
   '["n(2;âˆ’1;3)","n(2;1;3)","n(âˆ’8;0;0)","n(2;âˆ’1;âˆ’8)"]'::jsonb, '["n(2;âˆ’1;3)","n(2;1;3)","n(âˆ’8;0;0)","n(2;âˆ’1;âˆ’8)"]'::jsonb,
   0, 'Les coefficients de x, y, z donnent le vecteur normal.', 'Ù…Ø¹Ø§Ù…Ù„Ø§Øª x Ùˆy Ùˆz ØªØ¹Ø·ÙŠ Ø§Ù„Ø´Ø¹Ø§Ø¹ Ø§Ù„Ù†Ø§Ø¸Ù…ÙŠ.', 'easy', 3),
  ('||u|| pour u(2;âˆ’1;2) = ?', 'Ø§Ù„Ø·ÙˆÙŠÙ„Ø© ||u|| Ø­ÙŠØ« u(2;âˆ’1;2) = ØŸ',
   '["3","9","5","âˆš5"]'::jsonb, '["3","9","5","âˆš5"]'::jsonb,
   0, 'âˆš(4+1+4) = âˆš9 = 3.', 'âˆš(4+1+4) = 3.', 'medium', 4),
  ('Une droite de vecteur directeur u est parallÃ¨le au plan de normal n siâ€¦', 'Ù…Ø³ØªÙ‚ÙŠÙ… Ø´Ø¹Ø§Ø¹ ØªÙˆØ¬ÙŠÙ‡Ù‡ u ÙŠÙˆØ§Ø²ÙŠ Ø§Ù„Ù…Ø³ØªÙˆÙŠ Ø°Ø§ Ø§Ù„Ù†Ø§Ø¸Ù… n Ø¥Ø°Ø§â€¦',
   '["uÂ·n = 0","u = n","uÂ·n = 1","u âŠ¥ n est faux"]'::jsonb, '["uÂ·n = 0","u = n","uÂ·n = 1","Ù„Ø§ ÙŠÙ…ÙƒÙ†"]'::jsonb,
   0, 'Directeur orthogonal au normal âŸº droite parallÃ¨le au plan.', 'Ø´Ø¹Ø§Ø¹ Ø§Ù„ØªÙˆØ¬ÙŠÙ‡ Ø¹Ù…ÙˆØ¯ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ù†Ø§Ø¸Ù… âŸº Ø§Ù„ØªÙˆØ§Ø²ÙŠ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'mathematiques' and c.slug = 'geometrie-espace'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
