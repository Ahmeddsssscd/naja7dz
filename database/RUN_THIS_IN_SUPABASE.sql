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


-- ===============================================================
-- Migration: 20260722_020_sciences_lessons_quizzes
--
-- Bilingual lessons + 5-question quiz banks for the science chapters of
-- the two exam years: 4AM (physique + SVT, for the BEM) and 3AS
-- (physique + SVT, for the BAC sciences streams).
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- Reusable insert helper is inlined per chapter (same pattern as 019).

-- ================= 4AM PHYSIQUE =================

update public.chapters c set
  lesson_fr = 'PHÃ‰NOMÃˆNES Ã‰LECTRIQUES

LE CIRCUIT Ã‰LECTRIQUE
Un circuit fermÃ© laisse passer le courant ; ouvert, le courant ne passe pas.
Composants : gÃ©nÃ©rateur (pile), rÃ©cepteurs (lampe, moteur), interrupteur, fils.

INTENSITÃ‰ (I) â€” le dÃ©bit du courant
â€¢ Se mesure avec un AMPÃˆREMÃˆTRE branchÃ© EN SÃ‰RIE.
â€¢ UnitÃ© : l''ampÃ¨re (A).
â€¢ En sÃ©rie, l''intensitÃ© est la MÃŠME partout.
â€¢ En dÃ©rivation, l''intensitÃ© principale = somme des intensitÃ©s des branches.

TENSION (U) â€” la Â« poussÃ©e Â» Ã©lectrique
â€¢ Se mesure avec un VOLTMÃˆTRE branchÃ© EN DÃ‰RIVATION (aux bornes).
â€¢ UnitÃ© : le volt (V).
â€¢ En sÃ©rie, la tension du gÃ©nÃ©rateur = somme des tensions des rÃ©cepteurs.
â€¢ En dÃ©rivation, la tension est la mÃªme aux bornes de chaque branche.

LA LOI D''OHM (rÃ©sistance)
U = R Ã— I    (U en volts, R en ohms Î©, I en ampÃ¨res)
Une rÃ©sistance s''oppose au passage du courant.

SÃ‰CURITÃ‰ : ne jamais brancher un ampÃ¨remÃ¨tre en dÃ©rivation (court-circuit).',
  lesson_ar = 'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©

Ø§Ù„Ø¯Ø§Ø±Ø© Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©
Ø§Ù„Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØºÙ„Ù‚Ø© ØªØ³Ù…Ø­ Ø¨Ù…Ø±ÙˆØ± Ø§Ù„ØªÙŠØ§Ø±ØŒ ÙˆØ§Ù„Ù…ÙØªÙˆØ­Ø© ØªÙ…Ù†Ø¹Ù‡.
Ù…ÙƒÙˆÙ†Ø§ØªÙ‡Ø§: Ù…ÙˆÙ„Ø¯ (Ø¨Ø·Ø§Ø±ÙŠØ©)ØŒ Ù…Ø³ØªÙ‚Ø¨Ù„Ø§Øª (Ù…ØµØ¨Ø§Ø­ØŒ Ù…Ø­Ø±Ùƒ)ØŒ Ù‚Ø§Ø·Ø¹Ø©ØŒ Ø£Ø³Ù„Ø§Ùƒ.

Ø´Ø¯Ø© Ø§Ù„ØªÙŠØ§Ø± (I)
â€¢ ØªÙÙ‚Ø§Ø³ Ø¨Ø§Ù„Ø£Ù…Ø¨ÙŠØ±Ù…ØªØ± Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„.
â€¢ Ø§Ù„ÙˆØ­Ø¯Ø©: Ø§Ù„Ø£Ù…Ø¨ÙŠØ± (A).
â€¢ Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„: Ø§Ù„Ø´Ø¯Ø© Ù†ÙØ³Ù‡Ø§ ÙÙŠ ÙƒÙ„ Ø§Ù„Ù†Ù‚Ø§Ø·.
â€¢ Ø¹Ù„Ù‰ Ø§Ù„ØªÙØ±Ø¹: Ø§Ù„Ø´Ø¯Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© = Ù…Ø¬Ù…ÙˆØ¹ Ø´Ø¯Ø§Øª Ø§Ù„ÙØ±ÙˆØ¹.

Ø§Ù„ØªÙˆØªØ± (U)
â€¢ ÙŠÙÙ‚Ø§Ø³ Ø¨Ø§Ù„ÙÙˆÙ„ØªÙ…ØªØ± Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ø¹Ù„Ù‰ Ø§Ù„ØªÙØ±Ø¹.
â€¢ Ø§Ù„ÙˆØ­Ø¯Ø©: Ø§Ù„ÙÙˆÙ„Ø· (V).

Ù‚Ø§Ù†ÙˆÙ† Ø£ÙˆÙ…
U = R Ã— I (Ø§Ù„Ù…Ù‚Ø§ÙˆÙ…Ø© R Ø¨Ø§Ù„Ø£ÙˆÙ… Î©).

Ø§Ù„Ø³Ù„Ø§Ù…Ø©: Ù„Ø§ Ù†Ø±ÙƒÙ‘Ø¨ Ø§Ù„Ø£Ù…Ø¨ÙŠØ±Ù…ØªØ± Ø¹Ù„Ù‰ Ø§Ù„ØªÙØ±Ø¹ Ø£Ø¨Ø¯Ù‹Ø§ (Ø¯Ø§Ø±Ø© Ù‚ØµÙŠØ±Ø©).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-electriques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Avec quel appareil mesure-t-on l''intensitÃ© du courant ?', 'Ø¨Ø£ÙŠ Ø¬Ù‡Ø§Ø² Ù†Ù‚ÙŠØ³ Ø´Ø¯Ø© Ø§Ù„ØªÙŠØ§Ø±ØŸ',
   '["L''ampÃ¨remÃ¨tre","Le voltmÃ¨tre","Le thermomÃ¨tre","La balance"]'::jsonb, '["Ø§Ù„Ø£Ù…Ø¨ÙŠØ±Ù…ØªØ±","Ø§Ù„ÙÙˆÙ„ØªÙ…ØªØ±","Ø§Ù„Ù…ÙŠØ²Ø§Ù† Ø§Ù„Ø­Ø±Ø§Ø±ÙŠ","Ø§Ù„Ù…ÙŠØ²Ø§Ù†"]'::jsonb,
   0, 'L''ampÃ¨remÃ¨tre, branchÃ© en sÃ©rie, mesure l''intensitÃ© (en ampÃ¨res).', 'Ø§Ù„Ø£Ù…Ø¨ÙŠØ±Ù…ØªØ± Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„ ÙŠÙ‚ÙŠØ³ Ø§Ù„Ø´Ø¯Ø©.', 'easy', 1),
  ('L''unitÃ© de la tension Ã©lectrique estâ€¦', 'ÙˆØ­Ø¯Ø© Ø§Ù„ØªÙˆØªØ± Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠ Ù‡ÙŠâ€¦',
   '["le volt (V)","l''ampÃ¨re (A)","l''ohm (Î©)","le watt (W)"]'::jsonb, '["Ø§Ù„ÙÙˆÙ„Ø· (V)","Ø§Ù„Ø£Ù…Ø¨ÙŠØ± (A)","Ø§Ù„Ø£ÙˆÙ… (Î©)","Ø§Ù„ÙˆØ§Ø· (W)"]'::jsonb,
   0, 'La tension se mesure en volts.', 'Ø§Ù„ØªÙˆØªØ± ÙŠÙÙ‚Ø§Ø³ Ø¨Ø§Ù„ÙÙˆÙ„Ø·.', 'easy', 2),
  ('Dans un circuit en sÃ©rie, l''intensitÃ© du courant estâ€¦', 'ÙÙŠ Ø¯Ø§Ø±Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„ØŒ Ø´Ø¯Ø© Ø§Ù„ØªÙŠØ§Ø±â€¦',
   '["la mÃªme partout","diffÃ©rente partout","nulle","maximale Ã  la pile"]'::jsonb, '["Ù†ÙØ³Ù‡Ø§ ÙÙŠ ÙƒÙ„ Ø§Ù„Ù†Ù‚Ø§Ø·","Ù…Ø®ØªÙ„ÙØ©","Ù…Ø¹Ø¯ÙˆÙ…Ø©","Ø£ÙƒØ¨Ø± Ø¹Ù†Ø¯ Ø§Ù„Ø¨Ø·Ø§Ø±ÙŠØ©"]'::jsonb,
   0, 'En sÃ©rie, le courant a la mÃªme intensitÃ© en tout point.', 'Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„ Ø§Ù„Ø´Ø¯Ø© Ù†ÙØ³Ù‡Ø§ ÙÙŠ ÙƒÙ„ Ù†Ù‚Ø·Ø©.', 'medium', 3),
  ('Loi d''Ohm : U = 12 V, R = 4 Î©. Que vaut I ?', 'Ù‚Ø§Ù†ÙˆÙ† Ø£ÙˆÙ…: U = 12 V Ùˆ R = 4 Î©. ÙƒÙ… IØŸ',
   '["3 A","48 A","8 A","0,33 A"]'::jsonb, '["3 A","48 A","8 A","0.33 A"]'::jsonb,
   0, 'I = U/R = 12/4 = 3 A.', 'I = U/R = 12/4 = 3 A.', 'medium', 4),
  ('Le voltmÃ¨tre se brancheâ€¦', 'Ø§Ù„ÙÙˆÙ„ØªÙ…ØªØ± ÙŠÙØ±ÙƒÙ‘Ø¨â€¦',
   '["en dÃ©rivation","en sÃ©rie","Ã  la place de la pile","n''importe comment"]'::jsonb, '["Ø¹Ù„Ù‰ Ø§Ù„ØªÙØ±Ø¹","Ø¹Ù„Ù‰ Ø§Ù„ØªØ³Ù„Ø³Ù„","Ù…ÙƒØ§Ù† Ø§Ù„Ø¨Ø·Ø§Ø±ÙŠØ©","Ø¨Ø£ÙŠ Ø·Ø±ÙŠÙ‚Ø©"]'::jsonb,
   0, 'Le voltmÃ¨tre se branche en dÃ©rivation, aux bornes du dipÃ´le.', 'Ø§Ù„ÙÙˆÙ„ØªÙ…ØªØ± ÙŠÙØ±ÙƒÙ‘Ø¨ Ø¹Ù„Ù‰ Ø§Ù„ØªÙØ±Ø¹ Ø¨ÙŠÙ† Ø·Ø±ÙÙŠ Ø§Ù„Ø«Ù†Ø§Ø¦ÙŠ Ø§Ù„Ù‚Ø·Ø¨.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-electriques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PHÃ‰NOMÃˆNES LUMINEUX

PROPAGATION DE LA LUMIÃˆRE
Dans un milieu transparent et homogÃ¨ne, la lumiÃ¨re se propage en LIGNE DROITE.
C''est ce qui explique les ombres et les Ã©clipses.

SOURCES ET RÃ‰CEPTEURS
â€¢ Source primaire : produit sa lumiÃ¨re (Soleil, lampe, flamme).
â€¢ Objet diffusant : renvoie la lumiÃ¨re qu''il reÃ§oit (la Lune, un mur).

LA RÃ‰FLEXION (miroir)
Le rayon incident et le rayon rÃ©flÃ©chi font le mÃªme angle avec la normale :
angle d''incidence = angle de rÃ©flexion.

LES LENTILLES
â€¢ Lentille CONVERGENTE (bords minces) : fait converger les rayons en un foyer F.
â€¢ Lentille DIVERGENTE (bords Ã©pais) : Ã©carte les rayons.
La distance focale caractÃ©rise la lentille.

L''Å’IL ET LA VISION
Le cristallin est une lentille convergente ; l''image se forme sur la rÃ©tine.
Myopie et hypermÃ©tropie se corrigent avec des lentilles adaptÃ©es.',
  lesson_ar = 'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„Ø¶ÙˆØ¦ÙŠØ©

Ø§Ù†ØªØ´Ø§Ø± Ø§Ù„Ø¶ÙˆØ¡
ÙÙŠ ÙˆØ³Ø· Ø´ÙØ§Ù ÙˆÙ…ØªØ¬Ø§Ù†Ø³ ÙŠÙ†ØªØ´Ø± Ø§Ù„Ø¶ÙˆØ¡ ÙÙŠ Ø®Ø· Ù…Ø³ØªÙ‚ÙŠÙ…ØŒ ÙˆÙ‡Ø°Ø§ ÙŠÙØ³Ø± Ø§Ù„Ø¸Ù„Ø§Ù„ ÙˆØ§Ù„ÙƒØ³ÙˆÙ.

Ø§Ù„Ù…Ù†Ø§Ø¨Ø¹ ÙˆØ§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„Ø§Øª
â€¢ Ù…Ù†Ø¨Ø¹ Ø£ÙˆÙ„ÙŠ: ÙŠÙ†ØªØ¬ Ø¶ÙˆØ¡Ù‡ (Ø§Ù„Ø´Ù…Ø³ØŒ Ø§Ù„Ù…ØµØ¨Ø§Ø­).
â€¢ Ø¬Ø³Ù… Ù†Ø§Ø´Ø±: ÙŠØ¹ÙŠØ¯ Ø§Ù„Ø¶ÙˆØ¡ Ø§Ù„Ø°ÙŠ ÙŠØ³ØªÙ‚Ø¨Ù„Ù‡ (Ø§Ù„Ù‚Ù…Ø±ØŒ Ø§Ù„Ø¬Ø¯Ø§Ø±).

Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ (Ø§Ù„Ù…Ø±Ø¢Ø©)
Ø²Ø§ÙˆÙŠØ© Ø§Ù„ÙˆØ±ÙˆØ¯ = Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù„Ù†Ø§Ø¸Ù….

Ø§Ù„Ø¹Ø¯Ø³Ø§Øª
â€¢ Ø¹Ø¯Ø³Ø© Ù…Ø¬Ù…Ù‘Ø¹Ø© (Ø­ÙˆØ§ÙÙ‡Ø§ Ø±Ù‚ÙŠÙ‚Ø©): ØªØ¬Ù…Ø¹ Ø§Ù„Ø£Ø´Ø¹Ø© ÙÙŠ Ø¨Ø¤Ø±Ø© F.
â€¢ Ø¹Ø¯Ø³Ø© Ù…ÙØ±Ù‘Ù‚Ø© (Ø­ÙˆØ§ÙÙ‡Ø§ Ø³Ù…ÙŠÙƒØ©): ØªÙØ±Ù‘Ù‚ Ø§Ù„Ø£Ø´Ø¹Ø©.

Ø§Ù„Ø¹ÙŠÙ† ÙˆØ§Ù„Ø±Ø¤ÙŠØ©
Ø§Ù„Ø¨Ù„ÙˆØ±ÙŠØ© Ø¹Ø¯Ø³Ø© Ù…Ø¬Ù…Ù‘Ø¹Ø©ØŒ ÙˆØªØªØ´ÙƒÙ„ Ø§Ù„ØµÙˆØ±Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø´Ø¨ÙƒÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-lumineux';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un milieu transparent et homogÃ¨ne, la lumiÃ¨re se propageâ€¦', 'ÙÙŠ ÙˆØ³Ø· Ø´ÙØ§Ù ÙˆÙ…ØªØ¬Ø§Ù†Ø³ ÙŠÙ†ØªØ´Ø± Ø§Ù„Ø¶ÙˆØ¡â€¦',
   '["en ligne droite","en courbe","en zigzag","en cercle"]'::jsonb, '["ÙÙŠ Ø®Ø· Ù…Ø³ØªÙ‚ÙŠÙ…","ÙÙŠ Ù…Ù†Ø­Ù†Ù‰","Ø¨Ø´ÙƒÙ„ Ù…ØªØ¹Ø±Ø¬","ÙÙŠ Ø¯Ø§Ø¦Ø±Ø©"]'::jsonb,
   0, 'Propagation rectiligne de la lumiÃ¨re.', 'Ø§Ù„Ø§Ù†ØªØ´Ø§Ø± Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ù„Ù„Ø¶ÙˆØ¡.', 'easy', 1),
  ('La Lune estâ€¦', 'Ø§Ù„Ù‚Ù…Ø±â€¦',
   '["un objet diffusant","une source primaire","une lentille","un miroir"]'::jsonb, '["Ø¬Ø³Ù… Ù†Ø§Ø´Ø±","Ù…Ù†Ø¨Ø¹ Ø£ÙˆÙ„ÙŠ","Ø¹Ø¯Ø³Ø©","Ù…Ø±Ø¢Ø©"]'::jsonb,
   0, 'La Lune renvoie la lumiÃ¨re du Soleil, elle ne la produit pas.', 'Ø§Ù„Ù‚Ù…Ø± ÙŠØ¹ÙŠØ¯ Ø¶ÙˆØ¡ Ø§Ù„Ø´Ù…Ø³ ÙˆÙ„Ø§ ÙŠÙ†ØªØ¬Ù‡.', 'medium', 2),
  ('Loi de la rÃ©flexion : l''angle d''incidence estâ€¦', 'Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³: Ø²Ø§ÙˆÙŠØ© Ø§Ù„ÙˆØ±ÙˆØ¯â€¦',
   '["Ã©gal Ã  l''angle de rÃ©flexion","double de l''angle de rÃ©flexion","nul","toujours 90Â°"]'::jsonb, '["ØªØ³Ø§ÙˆÙŠ Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³","Ø¶Ø¹Ù Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³","Ù…Ø¹Ø¯ÙˆÙ…Ø©","Ø¯Ø§Ø¦Ù…Ù‹Ø§ 90Â°"]'::jsonb,
   0, 'Angle d''incidence = angle de rÃ©flexion.', 'Ø²Ø§ÙˆÙŠØ© Ø§Ù„ÙˆØ±ÙˆØ¯ = Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³.', 'medium', 3),
  ('Une lentille Ã  bords minces estâ€¦', 'Ø¹Ø¯Ø³Ø© Ø­ÙˆØ§ÙÙ‡Ø§ Ø±Ù‚ÙŠÙ‚Ø© Ù‡ÙŠâ€¦',
   '["convergente","divergente","plane","opaque"]'::jsonb, '["Ù…Ø¬Ù…Ù‘Ø¹Ø©","Ù…ÙØ±Ù‘Ù‚Ø©","Ù…Ø³ØªÙˆÙŠØ©","Ù…Ø¹ØªÙ…Ø©"]'::jsonb,
   0, 'Bords minces = lentille convergente.', 'Ø§Ù„Ø­ÙˆØ§Ù Ø§Ù„Ø±Ù‚ÙŠÙ‚Ø© = Ø¹Ø¯Ø³Ø© Ù…Ø¬Ù…Ù‘Ø¹Ø©.', 'easy', 4),
  ('Dans l''Å“il, l''image se forme surâ€¦', 'ÙÙŠ Ø§Ù„Ø¹ÙŠÙ† ØªØªØ´ÙƒÙ„ Ø§Ù„ØµÙˆØ±Ø© Ø¹Ù„Ù‰â€¦',
   '["la rÃ©tine","le cristallin","la pupille","la cornÃ©e"]'::jsonb, '["Ø§Ù„Ø´Ø¨ÙƒÙŠØ©","Ø§Ù„Ø¨Ù„ÙˆØ±ÙŠØ©","Ø§Ù„Ø¨Ø¤Ø¨Ø¤","Ø§Ù„Ù‚Ø±Ù†ÙŠØ©"]'::jsonb,
   0, 'La rÃ©tine reÃ§oit l''image formÃ©e par le cristallin.', 'Ø§Ù„Ø´Ø¨ÙƒÙŠØ© ØªØ³ØªÙ‚Ø¨Ù„ Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„ØªÙŠ ØªÙƒÙˆÙ‘Ù†Ù‡Ø§ Ø§Ù„Ø¨Ù„ÙˆØ±ÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-lumineux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PHÃ‰NOMÃˆNES MÃ‰CANIQUES

LE MOUVEMENT
Un corps est en mouvement par rapport Ã  un rÃ©fÃ©rentiel si sa position change.
Le mouvement est RELATIF : il dÃ©pend du rÃ©fÃ©rentiel choisi.

LA VITESSE
v = distance Ã· temps      (v en m/s ou km/h)
Exemple : 120 km en 2 h â†’ v = 60 km/h.
Mouvement uniforme : vitesse constante.

LES FORCES
Une force peut : mettre en mouvement, arrÃªter, dÃ©vier, ou dÃ©former un corps.
ReprÃ©sentÃ©e par un vecteur (point d''application, direction, sens, intensitÃ©).
L''intensitÃ© se mesure avec un DYNAMOMÃˆTRE, en newtons (N).

LE POIDS
Le poids P est la force de gravitÃ© :  P = m Ã— g
avec g â‰ˆ 9,8 N/kg en AlgÃ©rie, m en kg, P en newtons.
Ne pas confondre : la MASSE (kg) ne change pas ; le POIDS (N) dÃ©pend de g.

Ã‰QUILIBRE
Un corps soumis Ã  deux forces est en Ã©quilibre si elles ont mÃªme intensitÃ©,
mÃªme direction et sens opposÃ©s.',
  lesson_ar = 'Ø§Ù„Ø¸ÙˆØ§Ù‡Ø± Ø§Ù„Ù…ÙŠÙƒØ§Ù†ÙŠÙƒÙŠØ©

Ø§Ù„Ø­Ø±ÙƒØ©
Ø¬Ø³Ù… Ù…ØªØ­Ø±Ùƒ Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù…Ø±Ø¬Ø¹ Ø¥Ø°Ø§ ØªØºÙŠÙ‘Ø± Ù…ÙˆØ¶Ø¹Ù‡. Ø§Ù„Ø­Ø±ÙƒØ© Ù†Ø³Ø¨ÙŠØ© ØªØªØ¹Ù„Ù‚ Ø¨Ø§Ù„Ù…Ø±Ø¬Ø¹ Ø§Ù„Ù…Ø®ØªØ§Ø±.

Ø§Ù„Ø³Ø±Ø¹Ø©
v = Ø§Ù„Ù…Ø³Ø§ÙØ© Ã· Ø§Ù„Ø²Ù…Ù† (Ø¨Ø§Ù„Ù…ØªØ±/Ø«Ø§Ù†ÙŠØ© Ø£Ùˆ ÙƒÙ„Ù…/Ø³Ø§)
Ù…Ø«Ø§Ù„: 120 ÙƒÙ„Ù… ÙÙŠ Ø³Ø§Ø¹ØªÙŠÙ† â† v = 60 ÙƒÙ„Ù…/Ø³Ø§.

Ø§Ù„Ù‚ÙˆÙ‰
Ø§Ù„Ù‚ÙˆØ© ØªØ­Ø±Ù‘Ùƒ Ø£Ùˆ ØªÙˆÙ‚Ù Ø£Ùˆ ØªØ­Ø±Ù Ø£Ùˆ ØªØ´ÙˆÙ‘Ù‡ Ø¬Ø³Ù…Ù‹Ø§. ØªÙÙ…Ø«Ù‘Ù„ Ø¨Ø´Ø¹Ø§Ø¹ØŒ ÙˆØªÙÙ‚Ø§Ø³ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ù…ÙˆÙ…ØªØ± Ø¨Ø§Ù„Ù†ÙŠÙˆØªÙ† (N).

Ø§Ù„Ø«Ù‚Ù„
P = m Ã— g Ø­ÙŠØ« g â‰ˆ 9.8 Ù†ÙŠÙˆØªÙ†/ÙƒØº.
Ù„Ø§ Ù†Ø®Ù„Ø·: Ø§Ù„ÙƒØªÙ„Ø© (ÙƒØº) Ø«Ø§Ø¨ØªØ©ØŒ ÙˆØ§Ù„Ø«Ù‚Ù„ (Ù†ÙŠÙˆØªÙ†) ÙŠØªØ¹Ù„Ù‚ Ø¨Ù€ g.

Ø§Ù„ØªÙˆØ§Ø²Ù†
Ø¬Ø³Ù… Ø®Ø§Ø¶Ø¹ Ù„Ù‚ÙˆØªÙŠÙ† ÙŠÙƒÙˆÙ† Ù…ØªÙˆØ§Ø²Ù†Ù‹Ø§ Ø¥Ø°Ø§ ØªØ³Ø§ÙˆØª Ø´Ø¯ØªØ§Ù‡Ù…Ø§ ÙˆØ§ØªØ¬Ø§Ù‡Ù‡Ù…Ø§ ÙˆØªØ¹Ø§ÙƒØ³ Ù…Ù†Ø­Ø§Ù‡Ù…Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-mecaniques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une voiture parcourt 120 km en 2 h. Sa vitesse moyenne estâ€¦', 'Ø³ÙŠØ§Ø±Ø© ØªÙ‚Ø·Ø¹ 120 ÙƒÙ„Ù… ÙÙŠ Ø³Ø§Ø¹ØªÙŠÙ†. Ø³Ø±Ø¹ØªÙ‡Ø§ Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©â€¦',
   '["60 km/h","240 km/h","122 km/h","30 km/h"]'::jsonb, '["60 ÙƒÙ„Ù…/Ø³Ø§","240 ÙƒÙ„Ù…/Ø³Ø§","122 ÙƒÙ„Ù…/Ø³Ø§","30 ÙƒÙ„Ù…/Ø³Ø§"]'::jsonb,
   0, 'v = d/t = 120/2 = 60 km/h.', 'v = d/t = 60 ÙƒÙ„Ù…/Ø³Ø§.', 'easy', 1),
  ('L''intensitÃ© d''une force se mesure avecâ€¦', 'Ø´Ø¯Ø© Ø§Ù„Ù‚ÙˆØ© ØªÙÙ‚Ø§Ø³ Ø¨Ù€â€¦',
   '["un dynamomÃ¨tre","un thermomÃ¨tre","un voltmÃ¨tre","une rÃ¨gle"]'::jsonb, '["Ø§Ù„Ø¯ÙŠÙ†Ø§Ù…ÙˆÙ…ØªØ±","Ø§Ù„Ù…ÙŠØ²Ø§Ù† Ø§Ù„Ø­Ø±Ø§Ø±ÙŠ","Ø§Ù„ÙÙˆÙ„ØªÙ…ØªØ±","Ø§Ù„Ù…Ø³Ø·Ø±Ø©"]'::jsonb,
   0, 'Le dynamomÃ¨tre mesure les forces en newtons.', 'Ø§Ù„Ø¯ÙŠÙ†Ø§Ù…ÙˆÙ…ØªØ± ÙŠÙ‚ÙŠØ³ Ø§Ù„Ù‚ÙˆÙ‰ Ø¨Ø§Ù„Ù†ÙŠÙˆØªÙ†.', 'easy', 2),
  ('Le poids d''un objet de 5 kg (g = 9,8 N/kg) vautâ€¦', 'Ø«Ù‚Ù„ Ø¬Ø³Ù… ÙƒØªÙ„ØªÙ‡ 5 ÙƒØº (g = 9.8) ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["49 N","5 N","9,8 N","0,5 N"]'::jsonb, '["49 N","5 N","9.8 N","0.5 N"]'::jsonb,
   0, 'P = m Ã— g = 5 Ã— 9,8 = 49 N.', 'P = m Ã— g = 49 N.', 'medium', 3),
  ('La masse d''un objet, sur la Lune, par rapport Ã  la Terreâ€¦', 'ÙƒØªÙ„Ø© Ø¬Ø³Ù… Ø¹Ù„Ù‰ Ø§Ù„Ù‚Ù…Ø± Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ø§Ù„Ø£Ø±Ø¶â€¦',
   '["ne change pas","diminue","augmente","devient nulle"]'::jsonb, '["Ù„Ø§ ØªØªØºÙŠØ±","ØªÙ†Ù‚Øµ","ØªØ²ÙŠØ¯","ØªÙ†Ø¹Ø¯Ù…"]'::jsonb,
   0, 'La masse est invariable ; seul le poids change avec g.', 'Ø§Ù„ÙƒØªÙ„Ø© Ø«Ø§Ø¨ØªØ©ØŒ Ø§Ù„Ø«Ù‚Ù„ ÙˆØ­Ø¯Ù‡ ÙŠØªØºÙŠØ± Ù…Ø¹ g.', 'medium', 4),
  ('Le mouvement est dit Â« relatif Â» car il dÃ©pendâ€¦', 'Ø§Ù„Ø­Ø±ÙƒØ© Â«Ù†Ø³Ø¨ÙŠØ©Â» Ù„Ø£Ù†Ù‡Ø§ ØªØªØ¹Ù„Ù‚ Ø¨Ù€â€¦',
   '["du rÃ©fÃ©rentiel choisi","de la couleur","de la masse","du temps seulement"]'::jsonb, '["Ø§Ù„Ù…Ø±Ø¬Ø¹ Ø§Ù„Ù…Ø®ØªØ§Ø±","Ø§Ù„Ù„ÙˆÙ†","Ø§Ù„ÙƒØªÙ„Ø©","Ø§Ù„Ø²Ù…Ù† ÙÙ‚Ø·"]'::jsonb,
   0, 'Le mouvement dÃ©pend du rÃ©fÃ©rentiel d''Ã©tude.', 'Ø§Ù„Ø­Ø±ÙƒØ© ØªØªØ¹Ù„Ù‚ Ø¨Ù…Ø±Ø¬Ø¹ Ø§Ù„Ø¯Ø±Ø§Ø³Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'phenomenes-mecaniques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'MATIÃˆRE ET TRANSFORMATIONS

ATOMES, MOLÃ‰CULES ET IONS
â€¢ Atome : plus petite particule d''un Ã©lÃ©ment (noyau + Ã©lectrons).
â€¢ MolÃ©cule : groupe d''atomes liÃ©s (ex. Hâ‚‚O, COâ‚‚).
â€¢ Ion : atome ayant gagnÃ© ou perdu des Ã©lectrons (charge + ou âˆ’).

TRANSFORMATION CHIMIQUE
Des rÃ©actifs se transforment en produits. On l''Ã©crit par une Ã‰QUATION :
rÃ©actifs â†’ produits.
La combustion du carbone : C + Oâ‚‚ â†’ COâ‚‚.

CONSERVATION DE LA MASSE (loi de Lavoisier)
Â« Rien ne se perd, rien ne se crÃ©e, tout se transforme. Â»
La masse totale des rÃ©actifs = masse totale des produits.
On Ã‰QUILIBRE l''Ã©quation pour conserver chaque type d''atome.

LES COMBUSTIONS
â€¢ Combustion complÃ¨te du carbone â†’ dioxyde de carbone (COâ‚‚).
â€¢ Combustion incomplÃ¨te â†’ monoxyde de carbone (CO), gaz toxique.
Un combustible + un comburant (dioxygÃ¨ne) + une Ã©nergie d''activation.

Ã€ RETENIR : dans une Ã©quation Ã©quilibrÃ©e, le nombre d''atomes de chaque Ã©lÃ©ment
est le mÃªme avant et aprÃ¨s la flÃ¨che.',
  lesson_ar = 'Ø§Ù„Ù…Ø§Ø¯Ø© ÙˆØªØ­ÙˆÙ„Ø§ØªÙ‡Ø§

Ø§Ù„Ø°Ø±Ø§Øª ÙˆØ§Ù„Ø¬Ø²ÙŠØ¦Ø§Øª ÙˆØ§Ù„Ø´ÙˆØ§Ø±Ø¯
â€¢ Ø§Ù„Ø°Ø±Ø©: Ø£ØµØºØ± Ø¬Ø²Ø¡ Ù…Ù† Ø¹Ù†ØµØ± (Ù†ÙˆØ§Ø© + Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª).
â€¢ Ø§Ù„Ø¬Ø²ÙŠØ¡: Ù…Ø¬Ù…ÙˆØ¹Ø© Ø°Ø±Ø§Øª Ù…Ø±ØªØ¨Ø·Ø© (Hâ‚‚OØŒ COâ‚‚).
â€¢ Ø§Ù„Ø´Ø§Ø±Ø¯Ø©: Ø°Ø±Ø© ÙƒØ³Ø¨Øª Ø£Ùˆ ÙÙ‚Ø¯Øª Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª (Ø´Ø­Ù†Ø© + Ø£Ùˆ âˆ’).

Ø§Ù„ØªØ­ÙˆÙ„ Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ
ØªØªØ­ÙˆÙ„ Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª Ø¥Ù„Ù‰ Ù†ÙˆØ§ØªØ¬ØŒ ÙˆÙ†ÙƒØªØ¨Ù‡ Ø¨Ù…Ø¹Ø§Ø¯Ù„Ø©: Ù…ØªÙØ§Ø¹Ù„Ø§Øª â† Ù†ÙˆØ§ØªØ¬.
Ø§Ø­ØªØ±Ø§Ù‚ Ø§Ù„ÙƒØ±Ø¨ÙˆÙ†: C + Oâ‚‚ â†’ COâ‚‚.

Ø§Ù†Ø­ÙØ§Ø¸ Ø§Ù„ÙƒØªÙ„Ø© (Ù‚Ø§Ù†ÙˆÙ† Ù„Ø§ÙÙˆØ§Ø²ÙŠÙŠÙ‡)
Â«Ù„Ø§ Ø´ÙŠØ¡ ÙŠÙÙÙ‚Ø¯ ÙˆÙ„Ø§ Ø´ÙŠØ¡ ÙŠÙØ®Ù„Ù‚ØŒ ÙƒÙ„ Ø´ÙŠØ¡ ÙŠØªØ­ÙˆÙ„.Â»
ÙƒØªÙ„Ø© Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª = ÙƒØªÙ„Ø© Ø§Ù„Ù†ÙˆØ§ØªØ¬ØŒ ÙˆÙ†ÙˆØ§Ø²Ù† Ø§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø©.

Ø§Ù„Ø§Ø­ØªØ±Ø§Ù‚Ø§Øª
â€¢ Ø§Ø­ØªØ±Ø§Ù‚ ØªØ§Ù… Ù„Ù„ÙƒØ±Ø¨ÙˆÙ† â† Ø«Ø§Ù†ÙŠ Ø£ÙƒØ³ÙŠØ¯ Ø§Ù„ÙƒØ±Ø¨ÙˆÙ† COâ‚‚.
â€¢ Ø§Ø­ØªØ±Ø§Ù‚ Ù†Ø§Ù‚Øµ â† Ø£ÙˆÙ„ Ø£ÙƒØ³ÙŠØ¯ Ø§Ù„ÙƒØ±Ø¨ÙˆÙ† CO (ØºØ§Ø² Ø³Ø§Ù…).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'matiere-transformations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La formule chimique de l''eau estâ€¦', 'Ø§Ù„ØµÙŠØºØ© Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ© Ù„Ù„Ù…Ø§Ø¡ Ù‡ÙŠâ€¦',
   '["Hâ‚‚O","COâ‚‚","Oâ‚‚","Hâ‚‚"]'::jsonb, '["Hâ‚‚O","COâ‚‚","Oâ‚‚","Hâ‚‚"]'::jsonb,
   0, 'L''eau : 2 atomes d''hydrogÃ¨ne + 1 d''oxygÃ¨ne.', 'Ø§Ù„Ù…Ø§Ø¡: Ø°Ø±ØªØ§ Ù‡ÙŠØ¯Ø±ÙˆØ¬ÙŠÙ† ÙˆØ°Ø±Ø© Ø£ÙƒØ³Ø¬ÙŠÙ†.', 'easy', 1),
  ('Un ion est un atome qui aâ€¦', 'Ø§Ù„Ø´Ø§Ø±Ø¯Ø© Ø°Ø±Ø©â€¦',
   '["gagnÃ© ou perdu des Ã©lectrons","gagnÃ© un noyau","changÃ© de couleur","disparu"]'::jsonb, '["ÙƒØ³Ø¨Øª Ø£Ùˆ ÙÙ‚Ø¯Øª Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª","Ø§ÙƒØªØ³Ø¨Øª Ù†ÙˆØ§Ø©","ØªØºÙŠÙ‘Ø± Ù„ÙˆÙ†Ù‡Ø§","Ø§Ø®ØªÙØª"]'::jsonb,
   0, 'Gain/perte d''Ã©lectrons â†’ charge Ã©lectrique.', 'ÙƒØ³Ø¨/ÙÙ‚Ø¯ Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª â† Ø´Ø­Ù†Ø© ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©.', 'medium', 2),
  ('La combustion complÃ¨te du carbone donneâ€¦', 'Ø§Ù„Ø§Ø­ØªØ±Ø§Ù‚ Ø§Ù„ØªØ§Ù… Ù„Ù„ÙƒØ±Ø¨ÙˆÙ† ÙŠØ¹Ø·ÙŠâ€¦',
   '["du dioxyde de carbone (COâ‚‚)","du monoxyde (CO)","de l''eau","de l''hydrogÃ¨ne"]'::jsonb, '["Ø«Ø§Ù†ÙŠ Ø£ÙƒØ³ÙŠØ¯ Ø§Ù„ÙƒØ±Ø¨ÙˆÙ† COâ‚‚","Ø£ÙˆÙ„ Ø£ÙƒØ³ÙŠØ¯ CO","Ø§Ù„Ù…Ø§Ø¡","Ø§Ù„Ù‡ÙŠØ¯Ø±ÙˆØ¬ÙŠÙ†"]'::jsonb,
   0, 'C + Oâ‚‚ â†’ COâ‚‚.', 'C + Oâ‚‚ â†’ COâ‚‚.', 'medium', 3),
  ('Selon la loi de Lavoisier, lors d''une rÃ©action la masse totaleâ€¦', 'Ø­Ø³Ø¨ Ù‚Ø§Ù†ÙˆÙ† Ù„Ø§ÙÙˆØ§Ø²ÙŠÙŠÙ‡ØŒ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„ØªÙØ§Ø¹Ù„ Ø§Ù„ÙƒØªÙ„Ø© Ø§Ù„ÙƒÙ„ÙŠØ©â€¦',
   '["se conserve","augmente","diminue","disparaÃ®t"]'::jsonb, '["ØªÙ†Ø­ÙØ¸","ØªØ²ÙŠØ¯","ØªÙ†Ù‚Øµ","ØªØ®ØªÙÙŠ"]'::jsonb,
   0, 'La masse des rÃ©actifs = masse des produits.', 'ÙƒØªÙ„Ø© Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª = ÙƒØªÙ„Ø© Ø§Ù„Ù†ÙˆØ§ØªØ¬.', 'easy', 4),
  ('Le gaz toxique produit par une combustion incomplÃ¨te estâ€¦', 'Ø§Ù„ØºØ§Ø² Ø§Ù„Ø³Ø§Ù… Ø§Ù„Ù†Ø§ØªØ¬ Ø¹Ù† Ø§Ø­ØªØ±Ø§Ù‚ Ù†Ø§Ù‚Øµ Ù‡Ùˆâ€¦',
   '["le monoxyde de carbone (CO)","le dioxygÃ¨ne","l''azote","la vapeur d''eau"]'::jsonb, '["Ø£ÙˆÙ„ Ø£ÙƒØ³ÙŠØ¯ Ø§Ù„ÙƒØ±Ø¨ÙˆÙ† CO","Ø«Ù†Ø§Ø¦ÙŠ Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ†","Ø§Ù„Ø¢Ø²ÙˆØª","Ø¨Ø®Ø§Ø± Ø§Ù„Ù…Ø§Ø¡"]'::jsonb,
   0, 'CO est un gaz toxique, dangereux dans les piÃ¨ces mal ventilÃ©es.', 'CO ØºØ§Ø² Ø³Ø§Ù… Ø®Ø·ÙŠØ± ÙÙŠ Ø§Ù„Ø£Ù…Ø§ÙƒÙ† Ø³ÙŠØ¦Ø© Ø§Ù„ØªÙ‡ÙˆÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'physique' and c.slug = 'matiere-transformations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 4AM SVT =================

update public.chapters c set
  lesson_fr = 'LA COORDINATION NERVEUSE

LE SYSTÃˆME NERVEUX
â€¢ SystÃ¨me nerveux central : encÃ©phale (cerveau, cervelet, bulbe) + moelle Ã©piniÃ¨re.
â€¢ SystÃ¨me nerveux pÃ©riphÃ©rique : les nerfs.

LE NEURONE
Cellule de base du systÃ¨me nerveux. Il conduit le MESSAGE NERVEUX, de nature
Ã©lectrique, toujours dans un seul sens (dendrites â†’ corps cellulaire â†’ axone).

L''ACTE VOLONTAIRE
DÃ©cidÃ© par le cerveau. Trajet : organe des sens â†’ nerf â†’ cerveau (dÃ©cision) â†’
nerf â†’ muscle. Ex. attraper un objet que l''on vise.

L''ACTE RÃ‰FLEXE
Rapide, involontaire, protÃ¨ge l''organisme. Il passe par la MOELLE Ã‰PINIÃˆRE,
pas par le cerveau. Trajet (arc rÃ©flexe) : rÃ©cepteur â†’ nerf sensitif â†’
moelle Ã©piniÃ¨re â†’ nerf moteur â†’ muscle. Ex. retirer la main d''une surface chaude.

L''HYGIÃˆNE DU SYSTÃˆME NERVEUX
Sommeil suffisant, Ã©viter alcool et drogues qui perturbent la transmission
du message nerveux.',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø¹ØµØ¨ÙŠ

Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ø¹ØµØ¨ÙŠ
â€¢ Ù…Ø±ÙƒØ²ÙŠ: Ø§Ù„Ø¯Ù…Ø§Øº (Ø§Ù„Ù…Ø®ØŒ Ø§Ù„Ù…Ø®ÙŠØ®ØŒ Ø§Ù„Ø¨ØµÙ„Ø©) + Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ.
â€¢ Ù…Ø­ÙŠØ·ÙŠ: Ø§Ù„Ø£Ø¹ØµØ§Ø¨.

Ø§Ù„Ø¹ØµØ¨ÙˆÙ† (Ø§Ù„Ø®Ù„ÙŠØ© Ø§Ù„Ø¹ØµØ¨ÙŠØ©)
Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©ØŒ ÙŠÙ†Ù‚Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¹ØµØ¨ÙŠØ© Ø°Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ© ÙÙŠ Ø§ØªØ¬Ø§Ù‡ ÙˆØ§Ø­Ø¯.

Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ø¥Ø±Ø§Ø¯ÙŠ
ÙŠÙ‚Ø±Ø±Ù‡ Ø§Ù„Ù…Ø®. Ø§Ù„Ù…Ø³Ø§Ø±: Ø¹Ø¶Ùˆ Ø­Ø³ÙŠ â† Ø¹ØµØ¨ â† Ø§Ù„Ù…Ø® (Ø§Ù„Ù‚Ø±Ø§Ø±) â† Ø¹ØµØ¨ â† Ø¹Ø¶Ù„Ø©.

Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ
Ø³Ø±ÙŠØ¹ Ù„Ø§Ø¥Ø±Ø§Ø¯ÙŠ ÙŠØ­Ù…ÙŠ Ø§Ù„Ø¬Ø³Ù…ØŒ ÙŠÙ…Ø± Ø¹Ø¨Ø± Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ Ù„Ø§ Ø§Ù„Ù…Ø®.
Ø§Ù„Ù‚ÙˆØ³ Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ: Ù…Ø³ØªÙ‚Ø¨Ù„ â† Ø¹ØµØ¨ Ø­Ø³ÙŠ â† Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ â† Ø¹ØµØ¨ Ø­Ø±ÙƒÙŠ â† Ø¹Ø¶Ù„Ø©.

Ø­ÙØ¸ ØµØ­Ø© Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ø¹ØµØ¨ÙŠ
Ù†ÙˆÙ… ÙƒØ§ÙÙØŒ ØªØ¬Ù†Ø¨ Ø§Ù„ÙƒØ­ÙˆÙ„ ÙˆØ§Ù„Ù…Ø®Ø¯Ø±Ø§Øª Ø§Ù„ØªÙŠ ØªØ¹ÙŠÙ‚ Ù†Ù‚Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¹ØµØ¨ÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-nerveuse';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La cellule de base du systÃ¨me nerveux estâ€¦', 'Ø§Ù„ÙˆØ­Ø¯Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ù„Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ø¹ØµØ¨ÙŠ Ù‡ÙŠâ€¦',
   '["le neurone","le globule rouge","le muscle","l''os"]'::jsonb, '["Ø§Ù„Ø¹ØµØ¨ÙˆÙ†","Ø§Ù„ÙƒØ±ÙŠØ© Ø§Ù„Ø­Ù…Ø±Ø§Ø¡","Ø§Ù„Ø¹Ø¶Ù„Ø©","Ø§Ù„Ø¹Ø¸Ù…"]'::jsonb,
   0, 'Le neurone conduit le message nerveux.', 'Ø§Ù„Ø¹ØµØ¨ÙˆÙ† ÙŠÙ†Ù‚Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¹ØµØ¨ÙŠØ©.', 'easy', 1),
  ('L''acte rÃ©flexe passe parâ€¦', 'Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ ÙŠÙ…Ø± Ø¹Ø¨Ø±â€¦',
   '["la moelle Ã©piniÃ¨re","le cerveau","le cÅ“ur","l''estomac"]'::jsonb, '["Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ","Ø§Ù„Ù…Ø®","Ø§Ù„Ù‚Ù„Ø¨","Ø§Ù„Ù…Ø¹Ø¯Ø©"]'::jsonb,
   0, 'Le rÃ©flexe passe par la moelle Ã©piniÃ¨re, pas le cerveau.', 'Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ ÙŠÙ…Ø± Ø¹Ø¨Ø± Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ Ù„Ø§ Ø§Ù„Ù…Ø®.', 'medium', 2),
  ('Le message nerveux est de natureâ€¦', 'Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¹ØµØ¨ÙŠØ© Ø°Ø§Øª Ø·Ø¨ÙŠØ¹Ø©â€¦',
   '["Ã©lectrique","chimique uniquement","lumineuse","sonore"]'::jsonb, '["ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©","ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ© ÙÙ‚Ø·","Ø¶ÙˆØ¦ÙŠØ©","ØµÙˆØªÙŠØ©"]'::jsonb,
   0, 'Le long du neurone, le message est Ã©lectrique.', 'Ø¹Ù„Ù‰ Ø·ÙˆÙ„ Ø§Ù„Ø¹ØµØ¨ÙˆÙ† Ø§Ù„Ø±Ø³Ø§Ù„Ø© ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©.', 'medium', 3),
  ('Retirer sa main d''une surface chaude est un acteâ€¦', 'Ø³Ø­Ø¨ Ø§Ù„ÙŠØ¯ Ù…Ù† Ø³Ø·Ø­ Ø³Ø§Ø®Ù† ÙØ¹Ù„â€¦',
   '["rÃ©flexe","volontaire","rÃ©flÃ©chi","lent"]'::jsonb, '["Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ","Ø¥Ø±Ø§Ø¯ÙŠ","Ù…Ø¯Ø±ÙˆØ³","Ø¨Ø·ÙŠØ¡"]'::jsonb,
   0, 'C''est un rÃ©flexe : rapide et involontaire.', 'Ø¥Ù†Ù‡ ÙØ¹Ù„ Ø§Ù†Ø¹ÙƒØ§Ø³ÙŠ Ø³Ø±ÙŠØ¹ Ù„Ø§Ø¥Ø±Ø§Ø¯ÙŠ.', 'easy', 4),
  ('Le systÃ¨me nerveux central comprendâ€¦', 'Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ø¹ØµØ¨ÙŠ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ ÙŠØ´Ù…Ù„â€¦',
   '["l''encÃ©phale et la moelle Ã©piniÃ¨re","les nerfs seulement","les muscles","les os"]'::jsonb, '["Ø§Ù„Ø¯Ù…Ø§Øº ÙˆØ§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ","Ø§Ù„Ø£Ø¹ØµØ§Ø¨ ÙÙ‚Ø·","Ø§Ù„Ø¹Ø¶Ù„Ø§Øª","Ø§Ù„Ø¹Ø¸Ø§Ù…"]'::jsonb,
   0, 'EncÃ©phale + moelle Ã©piniÃ¨re = systÃ¨me nerveux central.', 'Ø§Ù„Ø¯Ù…Ø§Øº + Ø§Ù„Ù†Ø®Ø§Ø¹ Ø§Ù„Ø´ÙˆÙƒÙŠ = Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-nerveuse'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA COORDINATION HORMONALE

LES HORMONES
Une hormone est un messager CHIMIQUE fabriquÃ© par une glande, transportÃ© par
le SANG jusqu''Ã  un organe cible. La coordination hormonale est plus lente
que la nerveuse mais ses effets durent plus longtemps.

LES GLANDES ENDOCRINES
â€¢ Hypophyse : Â« chef d''orchestre Â» qui commande d''autres glandes.
â€¢ ThyroÃ¯de : rÃ¨gle le mÃ©tabolisme.
â€¢ PancrÃ©as : rÃ¨gle la glycÃ©mie (insuline et glucagon).
â€¢ Glandes sexuelles : testicules et ovaires.

LA RÃ‰GULATION DE LA GLYCÃ‰MIE
La glycÃ©mie (taux de sucre dans le sang) est maintenue autour de 1 g/L.
â€¢ Trop de sucre â†’ le pancrÃ©as libÃ¨re de l''INSULINE (fait baisser la glycÃ©mie).
â€¢ Pas assez â†’ le pancrÃ©as libÃ¨re du GLUCAGON (fait monter la glycÃ©mie).
Le diabÃ¨te est un dÃ©faut de cette rÃ©gulation.

NERVEUX vs HORMONAL
Nerveux : rapide, bref, message Ã©lectrique, voie = nerfs.
Hormonal : lent, durable, message chimique, voie = sang.',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ

Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†Ø§Øª
Ø§Ù„Ù‡Ø±Ù…ÙˆÙ† Ø±Ø³ÙˆÙ„ ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ ØªØµÙ†Ø¹Ù‡ ØºØ¯Ø©ØŒ ÙŠÙ†Ù‚Ù„Ù‡ Ø§Ù„Ø¯Ù… Ø¥Ù„Ù‰ Ø¹Ø¶Ùˆ Ù…Ø³ØªÙ‡Ø¯Ù. Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ
Ø£Ø¨Ø·Ø£ Ù…Ù† Ø§Ù„Ø¹ØµØ¨ÙŠ Ù„ÙƒÙ† Ø¢Ø«Ø§Ø±Ù‡ ØªØ¯ÙˆÙ… Ø£Ø·ÙˆÙ„.

Ø§Ù„ØºØ¯Ø¯ Ø§Ù„ØµÙ…Ø§Ø¡
â€¢ Ø§Ù„Ù†Ø®Ø§Ù…ÙŠØ©: Â«Ù‚Ø§Ø¦Ø¯ Ø§Ù„Ø£ÙˆØ±ÙƒØ³ØªØ±Ø§Â» ÙŠØªØ­ÙƒÙ… ÙÙŠ ØºØ¯Ø¯ Ø£Ø®Ø±Ù‰.
â€¢ Ø§Ù„Ø¯Ø±Ù‚ÙŠØ©: ØªÙ†Ø¸Ù‘Ù… Ø§Ù„Ø§Ø³ØªÙ‚Ù„Ø§Ø¨.
â€¢ Ø§Ù„Ø¨Ù†ÙƒØ±ÙŠØ§Ø³: ÙŠÙ†Ø¸Ù‘Ù… Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ± (Ø§Ù„Ø£Ù†Ø³ÙˆÙ„ÙŠÙ† ÙˆØ§Ù„ØºÙ„ÙˆÙƒØ§ØºÙˆÙ†).
â€¢ Ø§Ù„ØºØ¯Ø¯ Ø§Ù„ØªÙ†Ø§Ø³Ù„ÙŠØ©: Ø§Ù„Ø®ØµÙŠØªØ§Ù† ÙˆØ§Ù„Ù…Ø¨ÙŠØ¶Ø§Ù†.

ØªÙ†Ø¸ÙŠÙ… Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ± (Ø§Ù„ØªØ­Ù„ÙˆÙ†)
ØªÙØ­ÙØ¸ Ø­ÙˆØ§Ù„ÙŠ 1 Øº/Ù„.
â€¢ Ø³ÙƒØ± Ø²Ø§Ø¦Ø¯ â† ÙŠÙØ±Ø² Ø§Ù„Ø¨Ù†ÙƒØ±ÙŠØ§Ø³ Ø§Ù„Ø£Ù†Ø³ÙˆÙ„ÙŠÙ† (ÙŠØ®ÙØ¶ Ø§Ù„Ø³ÙƒØ±).
â€¢ Ø³ÙƒØ± Ù†Ø§Ù‚Øµ â† ÙŠÙØ±Ø² Ø§Ù„ØºÙ„ÙˆÙƒØ§ØºÙˆÙ† (ÙŠØ±ÙØ¹ Ø§Ù„Ø³ÙƒØ±).
Ø§Ù„Ø³ÙƒØ±ÙŠ Ø®Ù„Ù„ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„ØªÙ†Ø¸ÙŠÙ….

Ø¹ØµØ¨ÙŠ Ù…Ù‚Ø§Ø¨Ù„ Ù‡Ø±Ù…ÙˆÙ†ÙŠ
Ø§Ù„Ø¹ØµØ¨ÙŠ: Ø³Ø±ÙŠØ¹ØŒ Ù‚ØµÙŠØ±ØŒ ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØŒ Ø¹Ø¨Ø± Ø§Ù„Ø£Ø¹ØµØ§Ø¨.
Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ: Ø¨Ø·ÙŠØ¡ØŒ Ø¯Ø§Ø¦Ù…ØŒ ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØŒ Ø¹Ø¨Ø± Ø§Ù„Ø¯Ù….'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-hormonale';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une hormone est transportÃ©e parâ€¦', 'ÙŠÙ†Ù‚Ù„ Ø§Ù„Ù‡Ø±Ù…ÙˆÙ† Ø¨ÙˆØ§Ø³Ø·Ø©â€¦',
   '["le sang","les nerfs","l''air","la lymphe seulement"]'::jsonb, '["Ø§Ù„Ø¯Ù…","Ø§Ù„Ø£Ø¹ØµØ§Ø¨","Ø§Ù„Ù‡ÙˆØ§Ø¡","Ø§Ù„Ù„Ù…Ù ÙÙ‚Ø·"]'::jsonb,
   0, 'L''hormone circule dans le sang jusqu''Ã  l''organe cible.', 'Ø§Ù„Ù‡Ø±Ù…ÙˆÙ† ÙŠÙ†ØªÙ‚Ù„ Ø¹Ø¨Ø± Ø§Ù„Ø¯Ù… Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ø¶Ùˆ Ø§Ù„Ù…Ø³ØªÙ‡Ø¯Ù.', 'easy', 1),
  ('Quelle glande rÃ¨gle la glycÃ©mie ?', 'Ø£ÙŠ ØºØ¯Ø© ØªÙ†Ø¸Ù‘Ù… Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ±ØŸ',
   '["le pancrÃ©as","la thyroÃ¯de","l''hypophyse","le foie"]'::jsonb, '["Ø§Ù„Ø¨Ù†ÙƒØ±ÙŠØ§Ø³","Ø§Ù„Ø¯Ø±Ù‚ÙŠØ©","Ø§Ù„Ù†Ø®Ø§Ù…ÙŠØ©","Ø§Ù„ÙƒØ¨Ø¯"]'::jsonb,
   0, 'Le pancrÃ©as sÃ©crÃ¨te insuline et glucagon.', 'Ø§Ù„Ø¨Ù†ÙƒØ±ÙŠØ§Ø³ ÙŠÙØ±Ø² Ø§Ù„Ø£Ù†Ø³ÙˆÙ„ÙŠÙ† ÙˆØ§Ù„ØºÙ„ÙˆÙƒØ§ØºÙˆÙ†.', 'medium', 2),
  ('L''hormone qui fait BAISSER la glycÃ©mie estâ€¦', 'Ø§Ù„Ù‡Ø±Ù…ÙˆÙ† Ø§Ù„Ø°ÙŠ ÙŠØ®ÙØ¶ Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ± Ù‡Ùˆâ€¦',
   '["l''insuline","le glucagon","l''adrÃ©naline","la thyroxine"]'::jsonb, '["Ø§Ù„Ø£Ù†Ø³ÙˆÙ„ÙŠÙ†","Ø§Ù„ØºÙ„ÙˆÙƒØ§ØºÙˆÙ†","Ø§Ù„Ø£Ø¯Ø±ÙŠÙ†Ø§Ù„ÙŠÙ†","Ø§Ù„Ø«ÙŠØ±ÙˆÙƒØ³ÙŠÙ†"]'::jsonb,
   0, 'L''insuline fait baisser la glycÃ©mie.', 'Ø§Ù„Ø£Ù†Ø³ÙˆÙ„ÙŠÙ† ÙŠØ®ÙØ¶ Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ±.', 'medium', 3),
  ('La coordination hormonale, comparÃ©e Ã  la nerveuse, estâ€¦', 'Ø§Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ø§Ù„Ø¹ØµØ¨ÙŠâ€¦',
   '["plus lente et durable","plus rapide et brÃ¨ve","identique","instantanÃ©e"]'::jsonb, '["Ø£Ø¨Ø·Ø£ ÙˆØ£Ø·ÙˆÙ„ Ø£Ø«Ø±Ù‹Ø§","Ø£Ø³Ø±Ø¹ ÙˆØ£Ù‚ØµØ±","Ù…Ù…Ø§Ø«Ù„Ø©","Ù„Ø­Ø¸ÙŠØ©"]'::jsonb,
   0, 'Hormonal = lent mais durable.', 'Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†ÙŠ Ø¨Ø·ÙŠØ¡ Ù„ÙƒÙ†Ù‡ Ø¯Ø§Ø¦Ù….', 'easy', 4),
  ('La glycÃ©mie normale est d''environâ€¦', 'Ù†Ø³Ø¨Ø© Ø§Ù„Ø³ÙƒØ± Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ© Ø­ÙˆØ§Ù„ÙŠâ€¦',
   '["1 g/L","10 g/L","0,1 g/L","5 g/L"]'::jsonb, '["1 Øº/Ù„","10 Øº/Ù„","0.1 Øº/Ù„","5 Øº/Ù„"]'::jsonb,
   0, 'Environ 1 g/L Ã  jeun.', 'Ø­ÙˆØ§Ù„ÙŠ 1 Øº/Ù„ Ø¹Ù„Ù‰ Ø§Ù„Ø±ÙŠÙ‚.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'coordination-hormonale'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''IMMUNITÃ‰

LES DÃ‰FENSES DE L''ORGANISME
Le corps se dÃ©fend contre les microbes (bactÃ©ries, virus) qui sont des
ANTIGÃˆNES (Ã©lÃ©ments Ã©trangers = Â« non-soi Â»).

LA DÃ‰FENSE NON SPÃ‰CIFIQUE (immÃ©diate)
â€¢ La peau et les muqueuses : premiÃ¨re barriÃ¨re.
â€¢ La PHAGOCYTOSE : les phagocytes (globules blancs) englobent et digÃ¨rent
  les microbes. Se dÃ©roule en Ã©tapes : adhÃ©sion â†’ absorption â†’ digestion.

LA DÃ‰FENSE SPÃ‰CIFIQUE (plus lente, ciblÃ©e)
â€¢ RÃ©ponse Ã  MÃ‰DIATION HUMORALE : les lymphocytes B produisent des ANTICORPS
  qui neutralisent un antigÃ¨ne prÃ©cis (clÃ©-serrure).
â€¢ RÃ©ponse Ã  MÃ‰DIATION CELLULAIRE : les lymphocytes T dÃ©truisent les cellules
  infectÃ©es.

LA MÃ‰MOIRE IMMUNITAIRE ET LA VACCINATION
AprÃ¨s une premiÃ¨re rencontre, l''organisme garde des cellules mÃ©moire.
La VACCINATION introduit un antigÃ¨ne affaibli pour crÃ©er cette mÃ©moire
sans tomber malade. La SÃ‰ROTHÃ‰RAPIE injecte directement des anticorps
(action rapide mais brÃ¨ve).',
  lesson_ar = 'Ø§Ù„Ù…Ù†Ø§Ø¹Ø©

Ø¯ÙØ§Ø¹Ø§Øª Ø§Ù„Ø¬Ø³Ù…
ÙŠØ¯Ø§ÙØ¹ Ø§Ù„Ø¬Ø³Ù… Ø¹Ù† Ù†ÙØ³Ù‡ Ø¶Ø¯ Ø§Ù„Ù…ÙŠÙƒØ±ÙˆØ¨Ø§Øª (Ø¨ÙƒØªÙŠØ±ÙŠØ§ØŒ ÙÙŠØ±ÙˆØ³Ø§Øª) ÙˆÙ‡ÙŠ Ù…Ø³ØªØ¶Ø¯Ø§Øª (Ø¹Ù†Ø§ØµØ± ØºØ±ÙŠØ¨Ø© = Ù„Ø§Ø°Ø§Øª).

Ø§Ù„Ø¯ÙØ§Ø¹ Ø§Ù„Ù„Ø§Ù†ÙˆØ¹ÙŠ (ÙÙˆØ±ÙŠ)
â€¢ Ø§Ù„Ø¬Ù„Ø¯ ÙˆØ§Ù„Ø£ØºØ´ÙŠØ© Ø§Ù„Ù…Ø®Ø§Ø·ÙŠØ©: Ø§Ù„Ø­Ø§Ø¬Ø² Ø§Ù„Ø£ÙˆÙ„.
â€¢ Ø§Ù„Ø¨Ù„Ø¹Ù…Ø©: ØªØ­ÙŠØ· Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø¨Ù„Ø¹Ù…ÙŠØ© (ÙƒØ±ÙŠØ§Øª Ø¨ÙŠØ¶Ø§Ø¡) Ø¨Ø§Ù„Ù…ÙŠÙƒØ±ÙˆØ¨ ÙˆØªÙ‡Ø¶Ù…Ù‡:
  Ø§Ù„ØªØµØ§Ù‚ â† Ø¥Ø­Ø§Ø·Ø© â† Ù‡Ø¶Ù….

Ø§Ù„Ø¯ÙØ§Ø¹ Ø§Ù„Ù†ÙˆØ¹ÙŠ (Ø£Ø¨Ø·Ø£ØŒ Ù…ÙˆØ¬Ù‘Ù‡)
â€¢ Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø®Ù„Ø·ÙŠØ©: ØªÙ†ØªØ¬ Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B Ø£Ø¬Ø³Ø§Ù…Ù‹Ø§ Ù…Ø¶Ø§Ø¯Ø© ØªØ¹Ø§Ø¯Ù„ Ù…Ø³ØªØ¶Ø¯Ù‹Ø§ Ù…Ø­Ø¯Ø¯Ù‹Ø§ (Ù…ÙØªØ§Ø­-Ù‚ÙÙ„).
â€¢ Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø®Ù„ÙˆÙŠØ©: ØªØªÙ„Ù Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù…ØµØ§Ø¨Ø©.

Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø§Ù„Ù…Ù†Ø§Ø¹ÙŠØ© ÙˆØ§Ù„ØªÙ„Ù‚ÙŠØ­
ÙŠØ­ØªÙØ¸ Ø§Ù„Ø¬Ø³Ù… Ø¨Ø®Ù„Ø§ÙŠØ§ Ø°Ø§ÙƒØ±Ø©. Ø§Ù„ØªÙ„Ù‚ÙŠØ­ ÙŠÙØ¯Ø®Ù„ Ù…Ø³ØªØ¶Ø¯Ù‹Ø§ Ù…Ø¶Ø¹Ù‘ÙÙ‹Ø§ Ù„Ø¨Ù†Ø§Ø¡ Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø¯ÙˆÙ† Ù…Ø±Ø¶.
Ø§Ù„Ø§Ø³ØªÙ…ØµØ§Ù„ ÙŠØ­Ù‚Ù† Ø£Ø¬Ø³Ø§Ù…Ù‹Ø§ Ù…Ø¶Ø§Ø¯Ø© Ù…Ø¨Ø§Ø´Ø±Ø© (Ø£Ø«Ø± Ø³Ø±ÙŠØ¹ Ù„ÙƒÙ† Ù‚ØµÙŠØ±).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'immunite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un Ã©lÃ©ment Ã©tranger reconnu par l''organisme s''appelleâ€¦', 'Ø§Ù„Ø¹Ù†ØµØ± Ø§Ù„ØºØ±ÙŠØ¨ Ø§Ù„Ø°ÙŠ ÙŠØªØ¹Ø±ÙÙ‡ Ø§Ù„Ø¬Ø³Ù… ÙŠÙØ³Ù…Ù‰â€¦',
   '["un antigÃ¨ne","un anticorps","un phagocyte","une hormone"]'::jsonb, '["Ù…Ø³ØªØ¶Ø¯","Ø¬Ø³Ù… Ù…Ø¶Ø§Ø¯","Ø®Ù„ÙŠØ© Ø¨Ù„Ø¹Ù…ÙŠØ©","Ù‡Ø±Ù…ÙˆÙ†"]'::jsonb,
   0, 'L''antigÃ¨ne est le Â« non-soi Â» qui dÃ©clenche la rÃ©ponse.', 'Ø§Ù„Ù…Ø³ØªØ¶Ø¯ Ù‡Ùˆ Ø§Ù„Ù„Ø§Ø°Ø§Øª Ø§Ù„Ø°ÙŠ ÙŠØ«ÙŠØ± Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø©.', 'easy', 1),
  ('La phagocytose est rÃ©alisÃ©e parâ€¦', 'Ø§Ù„Ø¨Ù„Ø¹Ù…Ø© ØªÙ‚ÙˆÙ… Ø¨Ù‡Ø§â€¦',
   '["les phagocytes (globules blancs)","les globules rouges","les plaquettes","les neurones"]'::jsonb, '["Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø¨Ù„Ø¹Ù…ÙŠØ© (ÙƒØ±ÙŠØ§Øª Ø¨ÙŠØ¶Ø§Ø¡)","Ø§Ù„ÙƒØ±ÙŠØ§Øª Ø§Ù„Ø­Ù…Ø±Ø§Ø¡","Ø§Ù„ØµÙÙŠØ­Ø§Øª","Ø§Ù„Ø¹ØµØ¨ÙˆÙ†Ø§Øª"]'::jsonb,
   0, 'Les globules blancs phagocytent les microbes.', 'Ø§Ù„ÙƒØ±ÙŠØ§Øª Ø§Ù„Ø¨ÙŠØ¶Ø§Ø¡ ØªØ¨Ù„Ø¹Ù… Ø§Ù„Ù…ÙŠÙƒØ±ÙˆØ¨Ø§Øª.', 'medium', 2),
  ('Les anticorps sont produits parâ€¦', 'Ø§Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø© ØªÙ†ØªØ¬Ù‡Ø§â€¦',
   '["les lymphocytes B","les lymphocytes T","les phagocytes","les neurones"]'::jsonb, '["Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B","Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T","Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø¨Ù„Ø¹Ù…ÙŠØ©","Ø§Ù„Ø¹ØµØ¨ÙˆÙ†Ø§Øª"]'::jsonb,
   0, 'Les lymphocytes B produisent les anticorps.', 'Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B ØªÙ†ØªØ¬ Ø§Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø©.', 'medium', 3),
  ('La vaccination introduit dans l''organismeâ€¦', 'Ø§Ù„ØªÙ„Ù‚ÙŠØ­ ÙŠÙØ¯Ø®Ù„ Ø¥Ù„Ù‰ Ø§Ù„Ø¬Ø³Ù…â€¦',
   '["un antigÃ¨ne affaibli","des anticorps prÃªts","un microbe virulent","du sucre"]'::jsonb, '["Ù…Ø³ØªØ¶Ø¯Ù‹Ø§ Ù…Ø¶Ø¹Ù‘ÙÙ‹Ø§","Ø£Ø¬Ø³Ø§Ù…Ù‹Ø§ Ù…Ø¶Ø§Ø¯Ø© Ø¬Ø§Ù‡Ø²Ø©","Ù…ÙŠÙƒØ±ÙˆØ¨Ù‹Ø§ Ø´Ø±Ø³Ù‹Ø§","Ø³ÙƒØ±Ù‹Ø§"]'::jsonb,
   0, 'Le vaccin = antigÃ¨ne affaibli â†’ crÃ©e une mÃ©moire immunitaire.', 'Ø§Ù„Ù„Ù‚Ø§Ø­ Ù…Ø³ØªØ¶Ø¯ Ù…Ø¶Ø¹Ù‘Ù ÙŠØ¨Ù†ÙŠ Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø§Ù„Ù…Ù†Ø§Ø¹ÙŠØ©.', 'easy', 4),
  ('La relation anticorps-antigÃ¨ne est de typeâ€¦', 'Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø¨ÙŠÙ† Ø§Ù„Ø¬Ø³Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯ ÙˆØ§Ù„Ù…Ø³ØªØ¶Ø¯ Ù…Ù† Ù†ÙˆØ¹â€¦',
   '["spÃ©cifique (clÃ©-serrure)","alÃ©atoire","non spÃ©cifique","impossible"]'::jsonb, '["Ù†ÙˆØ¹ÙŠØ© (Ù…ÙØªØ§Ø­-Ù‚ÙÙ„)","Ø¹Ø´ÙˆØ§Ø¦ÙŠØ©","Ù„Ø§Ù†ÙˆØ¹ÙŠØ©","Ù…Ø³ØªØ­ÙŠÙ„Ø©"]'::jsonb,
   0, 'Un anticorps neutralise un antigÃ¨ne prÃ©cis.', 'Ø§Ù„Ø¬Ø³Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯ ÙŠØ¹Ø§Ø¯Ù„ Ù…Ø³ØªØ¶Ø¯Ù‹Ø§ Ù…Ø­Ø¯Ø¯Ù‹Ø§.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'immunite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA TRANSMISSION DES CARACTÃˆRES (gÃ©nÃ©tique)

LES CARACTÃˆRES HÃ‰RÃ‰DITAIRES
Un caractÃ¨re hÃ©rÃ©ditaire se transmet des parents aux enfants (couleur des yeux,
groupe sanguinâ€¦). Il est portÃ© par l''information gÃ©nÃ©tique.

CHROMOSOMES ET GÃˆNES
â€¢ Le noyau de chaque cellule contient les CHROMOSOMES.
â€¢ L''espÃ¨ce humaine a 46 chromosomes (23 paires), dont 1 paire sexuelle :
  XX chez la fille, XY chez le garÃ§on.
â€¢ Un GÃˆNE est une portion de chromosome responsable d''un caractÃ¨re.
â€¢ L''ADN est la molÃ©cule qui porte cette information.

CELLULES ET REPRODUCTION
â€¢ Cellules du corps : 46 chromosomes.
â€¢ Cellules reproductrices (gamÃ¨tes : ovule, spermatozoÃ¯de) : 23 chromosomes.
â€¢ Ã€ la fÃ©condation : 23 (ovule) + 23 (spermatozoÃ¯de) = 46 â†’ l''enfant reÃ§oit
  la moitiÃ© de ses chromosomes de chaque parent.

LE SEXE DE L''ENFANT
Il est dÃ©terminÃ© par le spermatozoÃ¯de : X â†’ fille (XX), Y â†’ garÃ§on (XY).',
  lesson_ar = 'Ø§Ù†ØªÙ‚Ø§Ù„ Ø§Ù„ØµÙØ§Øª (Ø§Ù„ÙˆØ±Ø§Ø«Ø©)

Ø§Ù„ØµÙØ§Øª Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ©
ØªÙ†ØªÙ‚Ù„ Ø§Ù„ØµÙØ© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ© Ù…Ù† Ø§Ù„Ø¢Ø¨Ø§Ø¡ Ø¥Ù„Ù‰ Ø§Ù„Ø£Ø¨Ù†Ø§Ø¡ (Ù„ÙˆÙ† Ø§Ù„Ø¹ÙŠÙ†ÙŠÙ†ØŒ Ø§Ù„Ø²Ù…Ø±Ø© Ø§Ù„Ø¯Ù…ÙˆÙŠØ©â€¦)ØŒ
ØªØ­Ù…Ù„Ù‡Ø§ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ©.

Ø§Ù„ØµØ¨ØºÙŠØ§Øª ÙˆØ§Ù„Ù…ÙˆØ±Ø«Ø§Øª
â€¢ Ù†ÙˆØ§Ø© ÙƒÙ„ Ø®Ù„ÙŠØ© ØªØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ø§Ù„ØµØ¨ØºÙŠØ§Øª (Ø§Ù„ÙƒØ±ÙˆÙ…ÙˆØ²ÙˆÙ…Ø§Øª).
â€¢ Ù„Ù„Ø¥Ù†Ø³Ø§Ù† 46 ØµØ¨ØºÙŠÙ‹Ø§ (23 Ø²ÙˆØ¬Ù‹Ø§)ØŒ Ù…Ù†Ù‡Ø§ Ø²ÙˆØ¬ Ø¬Ù†Ø³ÙŠ: XX Ù„Ù„Ø£Ù†Ø«Ù‰ ÙˆXY Ù„Ù„Ø°ÙƒØ±.
â€¢ Ø§Ù„Ù…ÙˆØ±Ø«Ø© Ø¬Ø²Ø¡ Ù…Ù† ØµØ¨ØºÙŠ Ù…Ø³Ø¤ÙˆÙ„ Ø¹Ù† ØµÙØ©.
â€¢ Ø§Ù„Ù€ ADN Ù‡Ùˆ Ø§Ù„Ø¬Ø²ÙŠØ¡ Ø§Ù„Ø­Ø§Ù…Ù„ Ù„Ù„Ù…Ø¹Ù„ÙˆÙ…Ø©.

Ø§Ù„Ø®Ù„Ø§ÙŠØ§ ÙˆØ§Ù„ØªÙƒØ§Ø«Ø±
â€¢ Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø¬Ø³Ù…: 46 ØµØ¨ØºÙŠÙ‹Ø§.
â€¢ Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„ØªÙ†Ø§Ø³Ù„ÙŠØ© (Ø§Ù„Ø¨ÙŠØ¶Ø©ØŒ Ø§Ù„Ù†Ø·ÙØ©): 23 ØµØ¨ØºÙŠÙ‹Ø§.
â€¢ Ø¹Ù†Ø¯ Ø§Ù„Ø¥Ø®ØµØ§Ø¨: 23 + 23 = 46.

Ø¬Ù†Ø³ Ø§Ù„Ù…ÙˆÙ„ÙˆØ¯
ØªØ­Ø¯Ø¯Ù‡ Ø§Ù„Ù†Ø·ÙØ©: X â† Ø£Ù†Ø«Ù‰ (XX)ØŒ Y â† Ø°ÙƒØ± (XY).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'genetique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de chromosomes possÃ¨de une cellule humaine du corps ?', 'ÙƒÙ… ØµØ¨ØºÙŠÙ‹Ø§ ÙÙŠ Ø®Ù„ÙŠØ© Ø¬Ø³Ù…ÙŠØ© Ø¨Ø´Ø±ÙŠØ©ØŸ',
   '["46","23","2","92"]'::jsonb, '["46","23","2","92"]'::jsonb,
   0, '46 chromosomes = 23 paires.', '46 ØµØ¨ØºÙŠÙ‹Ø§ = 23 Ø²ÙˆØ¬Ù‹Ø§.', 'easy', 1),
  ('Les chromosomes sexuels d''une fille sontâ€¦', 'Ø§Ù„ØµØ¨ØºÙŠØ§Ù† Ø§Ù„Ø¬Ù†Ø³ÙŠØ§Ù† Ù„Ù„Ø£Ù†Ø«Ù‰ Ù‡Ù…Ø§â€¦',
   '["XX","XY","YY","X seul"]'::jsonb, '["XX","XY","YY","X ÙÙ‚Ø·"]'::jsonb,
   0, 'Fille = XX, garÃ§on = XY.', 'Ø§Ù„Ø£Ù†Ø«Ù‰ XX ÙˆØ§Ù„Ø°ÙƒØ± XY.', 'medium', 2),
  ('Un gÃ¨ne estâ€¦', 'Ø§Ù„Ù…ÙˆØ±Ø«Ø© Ù‡ÙŠâ€¦',
   '["une portion de chromosome","une cellule entiÃ¨re","un organe","une hormone"]'::jsonb, '["Ø¬Ø²Ø¡ Ù…Ù† ØµØ¨ØºÙŠ","Ø®Ù„ÙŠØ© ÙƒØ§Ù…Ù„Ø©","Ø¹Ø¶Ùˆ","Ù‡Ø±Ù…ÙˆÙ†"]'::jsonb,
   0, 'Le gÃ¨ne porte l''information d''un caractÃ¨re.', 'Ø§Ù„Ù…ÙˆØ±Ø«Ø© ØªØ­Ù…Ù„ Ù…Ø¹Ù„ÙˆÙ…Ø© ØµÙØ©.', 'medium', 3),
  ('Un gamÃ¨te (ovule ou spermatozoÃ¯de) contientâ€¦ chromosomes', 'Ø§Ù„Ø®Ù„ÙŠØ© Ø§Ù„ØªÙ†Ø§Ø³Ù„ÙŠØ© (Ø¨ÙŠØ¶Ø© Ø£Ùˆ Ù†Ø·ÙØ©) ØªØ­ØªÙˆÙŠâ€¦ ØµØ¨ØºÙŠÙ‹Ø§',
   '["23","46","92","2"]'::jsonb, '["23","46","92","2"]'::jsonb,
   0, 'Les gamÃ¨tes ont la moitiÃ© : 23 chromosomes.', 'Ø§Ù„Ø£Ù…Ø´Ø§Ø¬ ØªØ­Ù…Ù„ Ø§Ù„Ù†ØµÙ: 23 ØµØ¨ØºÙŠÙ‹Ø§.', 'easy', 4),
  ('Le sexe de l''enfant est dÃ©terminÃ© parâ€¦', 'Ø¬Ù†Ø³ Ø§Ù„Ù…ÙˆÙ„ÙˆØ¯ ÙŠØ­Ø¯Ø¯Ù‡â€¦',
   '["le spermatozoÃ¯de","l''ovule","la mÃ¨re","le hasard total"]'::jsonb, '["Ø§Ù„Ù†Ø·ÙØ©","Ø§Ù„Ø¨ÙŠØ¶Ø©","Ø§Ù„Ø£Ù…","Ø§Ù„ØµØ¯ÙØ© Ø§Ù„ØªØ§Ù…Ø©"]'::jsonb,
   0, 'Le spermatozoÃ¯de apporte X (fille) ou Y (garÃ§on).', 'Ø§Ù„Ù†Ø·ÙØ© ØªØ­Ù…Ù„ X (Ø£Ù†Ø«Ù‰) Ø£Ùˆ Y (Ø°ÙƒØ±).', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'svt' and c.slug = 'genetique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS SVT (BAC) =================

update public.chapters c set
  lesson_fr = 'DU GÃˆNE Ã€ LA PROTÃ‰INE

L''ADN ET L''INFORMATION GÃ‰NÃ‰TIQUE
L''ADN porte l''information sous forme d''une SÃ‰QUENCE DE NUCLÃ‰OTIDES (A, T, G, C).
Un gÃ¨ne = une portion d''ADN qui code une protÃ©ine.

LA TRANSCRIPTION (noyau)
L''ADN est copiÃ© en ARN messager (ARNm). DiffÃ©rence clÃ© : dans l''ARN, la base
T (thymine) est remplacÃ©e par U (uracile). L''ARNm sort du noyau vers le cytoplasme.

LA TRADUCTION (ribosomes)
L''ARNm est lu par CODONS (groupes de 3 nuclÃ©otides). Chaque codon correspond
Ã  un ACIDE AMINÃ‰ selon le CODE GÃ‰NÃ‰TIQUE. Les acides aminÃ©s s''enchaÃ®nent â†’
protÃ©ine. Codon Â« start Â» (AUG) et codons Â« stop Â» bornent la lecture.

LE CODE GÃ‰NÃ‰TIQUE
â€¢ Universel (le mÃªme chez presque tous les Ãªtres vivants).
â€¢ Redondant (plusieurs codons pour un mÃªme acide aminÃ©).
â€¢ Non chevauchant, lu dans un seul sens.

DE LA PROTÃ‰INE AU CARACTÃˆRE
La sÃ©quence des acides aminÃ©s dÃ©termine la forme et la fonction de la protÃ©ine,
donc le caractÃ¨re (ex. une enzyme, la couleurâ€¦). Une MUTATION de l''ADN peut
changer la protÃ©ine.',
  lesson_ar = 'Ù…Ù† Ø§Ù„Ù…ÙˆØ±Ø«Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø¨Ø±ÙˆØªÙŠÙ†

Ø§Ù„Ù€ ADN ÙˆØ§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ©
ÙŠØ­Ù…Ù„ Ø§Ù„Ù€ ADN Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø© Ø¹Ù„Ù‰ Ø´ÙƒÙ„ ØªØ³Ù„Ø³Ù„ Ù†ÙŠÙƒÙ„ÙŠÙˆØªÙŠØ¯Ø§Øª (A, T, G, C). Ø§Ù„Ù…ÙˆØ±Ø«Ø© Ø¬Ø²Ø¡ Ù…Ù† ADN ÙŠØ´ÙÙ‘Ø± Ø¨Ø±ÙˆØªÙŠÙ†Ù‹Ø§.

Ø§Ù„Ø§Ø³ØªÙ†Ø³Ø§Ø® (ÙÙŠ Ø§Ù„Ù†ÙˆØ§Ø©)
ÙŠÙÙ†Ø³Ø® Ø§Ù„Ù€ ADN Ø¥Ù„Ù‰ ARN Ø±Ø³ÙˆÙ„. Ø§Ù„ÙØ±Ù‚: ÙÙŠ Ø§Ù„Ù€ ARN ØªÙØ³ØªØ¨Ø¯Ù„ Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© T Ø¨Ù€ U (ÙŠÙˆØ±Ø§Ø³ÙŠÙ„).
ÙŠØ®Ø±Ø¬ Ø§Ù„Ù€ ARNm Ù…Ù† Ø§Ù„Ù†ÙˆØ§Ø© Ø¥Ù„Ù‰ Ø§Ù„Ù‡ÙŠÙˆÙ„Ù‰.

Ø§Ù„ØªØ±Ø¬Ù…Ø© (ÙÙŠ Ø§Ù„Ø±ÙŠØ¨ÙˆØ²ÙˆÙ…Ø§Øª)
ÙŠÙÙ‚Ø±Ø£ Ø§Ù„Ù€ ARNm Ø¨Ø±Ø§Ù…Ø²Ø§Øª (ÙƒÙ„ 3 Ù†ÙŠÙƒÙ„ÙŠÙˆØªÙŠØ¯Ø§Øª). ÙƒÙ„ Ø±Ø§Ù…Ø²Ø© ØªÙˆØ§ÙÙ‚ Ø­Ù…Ø¶Ù‹Ø§ Ø£Ù…ÙŠÙ†ÙŠÙ‹Ø§ Ø­Ø³Ø¨ Ø§Ù„Ø´ÙŠÙØ±Ø© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ©.
ØªØªØ³Ù„Ø³Ù„ Ø§Ù„Ø£Ø­Ù…Ø§Ø¶ Ø§Ù„Ø£Ù…ÙŠÙ†ÙŠØ© â† Ø¨Ø±ÙˆØªÙŠÙ†. Ø±Ø§Ù…Ø²Ø© Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© AUG ÙˆØ±Ø§Ù…Ø²Ø§Øª Ø§Ù„ØªÙˆÙ‚Ù ØªØ­Ø¯Ù‘Ø¯ Ø§Ù„Ù‚Ø±Ø§Ø¡Ø©.

Ø§Ù„Ø´ÙŠÙØ±Ø© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ©
â€¢ Ø¹Ø§Ù„Ù…ÙŠØ©ØŒ Ù…ÙƒØ±Ø±Ø© (Ø¹Ø¯Ø© Ø±Ø§Ù…Ø²Ø§Øª Ù„Ø­Ù…Ø¶ ÙˆØ§Ø­Ø¯)ØŒ ØºÙŠØ± Ù…ØªØ¯Ø§Ø®Ù„Ø©ØŒ ØªÙÙ‚Ø±Ø£ ÙÙŠ Ø§ØªØ¬Ø§Ù‡ ÙˆØ§Ø­Ø¯.

Ù…Ù† Ø§Ù„Ø¨Ø±ÙˆØªÙŠÙ† Ø¥Ù„Ù‰ Ø§Ù„ØµÙØ©
ØªØ³Ù„Ø³Ù„ Ø§Ù„Ø£Ø­Ù…Ø§Ø¶ Ø§Ù„Ø£Ù…ÙŠÙ†ÙŠØ© ÙŠØ­Ø¯Ø¯ Ø´ÙƒÙ„ ÙˆÙˆØ¸ÙŠÙØ© Ø§Ù„Ø¨Ø±ÙˆØªÙŠÙ† ÙˆÙ…Ù†Ù‡ Ø§Ù„ØµÙØ©. Ø§Ù„Ø·ÙØ±Ø© Ù‚Ø¯ ØªØºÙŠÙ‘Ø± Ø§Ù„Ø¨Ø±ÙˆØªÙŠÙ†.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'gene-proteine';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans l''ARN, la base T de l''ADN est remplacÃ©e parâ€¦', 'ÙÙŠ Ø§Ù„Ù€ ARN ØªÙØ³ØªØ¨Ø¯Ù„ Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© T Ø¨Ù€â€¦',
   '["U (uracile)","G","C","A"]'::jsonb, '["U (ÙŠÙˆØ±Ø§Ø³ÙŠÙ„)","G","C","A"]'::jsonb,
   0, 'ARN : U remplace T.', 'ÙÙŠ Ø§Ù„Ù€ ARN ØªØ­Ù„ U Ù…Ø­Ù„ T.', 'easy', 1),
  ('La transcription se dÃ©rouleâ€¦', 'ÙŠØ­Ø¯Ø« Ø§Ù„Ø§Ø³ØªÙ†Ø³Ø§Ø® ÙÙŠâ€¦',
   '["dans le noyau","dans les ribosomes","dans la membrane","dans le sang"]'::jsonb, '["Ø§Ù„Ù†ÙˆØ§Ø©","Ø§Ù„Ø±ÙŠØ¨ÙˆØ²ÙˆÙ…Ø§Øª","Ø§Ù„ØºØ´Ø§Ø¡","Ø§Ù„Ø¯Ù…"]'::jsonb,
   0, 'La transcription (ADNâ†’ARNm) a lieu dans le noyau.', 'Ø§Ù„Ø§Ø³ØªÙ†Ø³Ø§Ø® ÙŠØ­Ø¯Ø« ÙÙŠ Ø§Ù„Ù†ÙˆØ§Ø©.', 'medium', 2),
  ('Un codon est formÃ© deâ€¦ nuclÃ©otides', 'Ø§Ù„Ø±Ø§Ù…Ø²Ø© ØªØªÙƒÙˆÙ† Ù…Ù†â€¦ Ù†ÙŠÙƒÙ„ÙŠÙˆØªÙŠØ¯Ø§Øª',
   '["3","1","2","4"]'::jsonb, '["3","1","2","4"]'::jsonb,
   0, 'Un codon = 3 nuclÃ©otides = 1 acide aminÃ©.', 'Ø§Ù„Ø±Ø§Ù…Ø²Ø© = 3 Ù†ÙŠÙƒÙ„ÙŠÙˆØªÙŠØ¯Ø§Øª = Ø­Ù…Ø¶ Ø£Ù…ÙŠÙ†ÙŠ ÙˆØ§Ø­Ø¯.', 'medium', 3),
  ('La traduction a lieu au niveauâ€¦', 'ØªØ­Ø¯Ø« Ø§Ù„ØªØ±Ø¬Ù…Ø© Ø¹Ù„Ù‰ Ù…Ø³ØªÙˆÙ‰â€¦',
   '["des ribosomes","du noyau","des mitochondries seulement","de la membrane"]'::jsonb, '["Ø§Ù„Ø±ÙŠØ¨ÙˆØ²ÙˆÙ…Ø§Øª","Ø§Ù„Ù†ÙˆØ§Ø©","Ø§Ù„Ù…ÙŠØªÙˆÙƒÙ†Ø¯Ø±ÙŠ ÙÙ‚Ø·","Ø§Ù„ØºØ´Ø§Ø¡"]'::jsonb,
   0, 'Les ribosomes lisent l''ARNm et assemblent la protÃ©ine.', 'Ø§Ù„Ø±ÙŠØ¨ÙˆØ²ÙˆÙ…Ø§Øª ØªÙ‚Ø±Ø£ Ø§Ù„Ù€ ARNm ÙˆØªØ±ÙƒÙ‘Ø¨ Ø§Ù„Ø¨Ø±ÙˆØªÙŠÙ†.', 'easy', 4),
  ('Le code gÃ©nÃ©tique est dit Â« universel Â» carâ€¦', 'Ø§Ù„Ø´ÙŠÙØ±Ø© Ø§Ù„ÙˆØ±Ø§Ø«ÙŠØ© Â«Ø¹Ø§Ù„Ù…ÙŠØ©Â» Ù„Ø£Ù†Ù‡Ø§â€¦',
   '["le mÃªme chez presque tous les Ãªtres vivants","diffÃ©rent pour chaque espÃ¨ce","propre Ã  l''humain","change chaque jour"]'::jsonb, '["Ù†ÙØ³Ù‡Ø§ Ø¹Ù†Ø¯ Ù…Ø¹Ø¸Ù… Ø§Ù„ÙƒØ§Ø¦Ù†Ø§Øª","Ù…Ø®ØªÙ„ÙØ© Ù„ÙƒÙ„ Ù†ÙˆØ¹","Ø®Ø§ØµØ© Ø¨Ø§Ù„Ø¥Ù†Ø³Ø§Ù†","ØªØªØºÙŠØ± ÙŠÙˆÙ…ÙŠÙ‹Ø§"]'::jsonb,
   0, 'Un mÃªme codon code le mÃªme acide aminÃ© dans le vivant.', 'Ù†ÙØ³ Ø§Ù„Ø±Ø§Ù…Ø²Ø© ØªØ´ÙÙ‘Ø± Ù†ÙØ³ Ø§Ù„Ø­Ù…Ø¶ Ø¹Ù†Ø¯ Ø§Ù„ÙƒØ§Ø¦Ù†Ø§Øª.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'gene-proteine'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''ACTIVITÃ‰ ENZYMATIQUE

QU''EST-CE QU''UNE ENZYME ?
Une enzyme est une protÃ©ine qui accÃ©lÃ¨re une rÃ©action chimique (BIOCATALYSEUR)
sans Ãªtre consommÃ©e. Ex. l''amylase digÃ¨re l''amidon.

LA SPÃ‰CIFICITÃ‰
â€¢ SpÃ©cificitÃ© de SUBSTRAT : une enzyme n''agit que sur un substrat donnÃ©.
â€¢ SpÃ©cificitÃ© d''ACTION : elle ne catalyse qu''un seul type de rÃ©action.
Cette double spÃ©cificitÃ© s''explique par la complÃ©mentaritÃ© de forme entre
le SITE ACTIF de l''enzyme et le substrat (modÃ¨le clÃ©-serrure).

LE COMPLEXE ENZYME-SUBSTRAT
Enzyme + Substrat â†’ complexe E-S â†’ Enzyme + Produit.
L''enzyme est intacte Ã  la fin et peut recommencer.

LES FACTEURS QUI INFLUENCENT L''ACTIVITÃ‰
â€¢ La TEMPÃ‰RATURE : une activitÃ© optimale (â‰ˆ 37 Â°C chez l''humain) ; trop chaud
  â†’ l''enzyme se dÃ©nature (perd sa forme, donc son activitÃ©).
â€¢ Le pH : chaque enzyme a un pH optimal (la pepsine agit en milieu acide).
â€¢ La concentration en substrat et en enzyme.',
  lesson_ar = 'Ø§Ù„Ù†Ø´Ø§Ø· Ø§Ù„Ø£Ù†Ø²ÙŠÙ…ÙŠ

Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ø£Ù†Ø²ÙŠÙ…ØŸ
Ø§Ù„Ø£Ù†Ø²ÙŠÙ… Ø¨Ø±ÙˆØªÙŠÙ† ÙŠØ³Ø±Ù‘Ø¹ ØªÙØ§Ø¹Ù„Ø§Ù‹ ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠÙ‹Ø§ (ÙˆØ³ÙŠØ· Ø­ÙŠÙˆÙŠ) Ø¯ÙˆÙ† Ø£Ù† ÙŠÙØ³ØªÙ‡Ù„Ùƒ. Ù…Ø«Ø§Ù„: Ø§Ù„Ø£Ù…ÙŠÙ„Ø§Ø² ÙŠÙ‡Ø¶Ù… Ø§Ù„Ù†Ø´Ø§.

Ø§Ù„Ù†ÙˆØ¹ÙŠØ©
â€¢ Ù†ÙˆØ¹ÙŠØ© Ø§Ù„Ø±ÙƒÙŠØ²Ø©: ÙŠØ¤Ø«Ø± Ø§Ù„Ø£Ù†Ø²ÙŠÙ… Ø¹Ù„Ù‰ Ø±ÙƒÙŠØ²Ø© Ù…Ø¹ÙŠÙ†Ø© ÙÙ‚Ø·.
â€¢ Ù†ÙˆØ¹ÙŠØ© Ø§Ù„ÙØ¹Ù„: ÙŠØ­ÙÙ‘Ø² Ù†ÙˆØ¹Ù‹Ø§ ÙˆØ§Ø­Ø¯Ù‹Ø§ Ù…Ù† Ø§Ù„ØªÙØ§Ø¹Ù„.
ØªÙØ³Ù‘Ø± Ù‡Ø°Ù‡ Ø§Ù„Ù†ÙˆØ¹ÙŠØ© Ø¨Ø§Ù„ØªÙƒØ§Ù…Ù„ Ø¨ÙŠÙ† Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„ÙØ¹Ù‘Ø§Ù„ Ù„Ù„Ø£Ù†Ø²ÙŠÙ… ÙˆØ§Ù„Ø±ÙƒÙŠØ²Ø© (Ù†Ù…ÙˆØ°Ø¬ Ù…ÙØªØ§Ø­-Ù‚ÙÙ„).

Ø§Ù„Ù…Ø¹Ù‚Ù‘Ø¯ Ø£Ù†Ø²ÙŠÙ…-Ø±ÙƒÙŠØ²Ø©
Ø£Ù†Ø²ÙŠÙ… + Ø±ÙƒÙŠØ²Ø© â† Ù…Ø¹Ù‚Ù‘Ø¯ â† Ø£Ù†Ø²ÙŠÙ… + Ù†Ø§ØªØ¬. ÙŠØ¨Ù‚Ù‰ Ø§Ù„Ø£Ù†Ø²ÙŠÙ… Ø³Ù„ÙŠÙ…Ù‹Ø§ ÙˆÙŠØ¹ÙŠØ¯ Ø§Ù„ÙƒØ±Ù‘Ø©.

Ø§Ù„Ø¹ÙˆØ§Ù…Ù„ Ø§Ù„Ù…Ø¤Ø«Ø±Ø©
â€¢ Ø§Ù„Ø­Ø±Ø§Ø±Ø©: Ù†Ø´Ø§Ø· Ø£Ø¹Ø¸Ù…ÙŠ (â‰ˆ 37 Â°Ù… Ø¹Ù†Ø¯ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†)Ø› Ø§Ù„Ø­Ø±Ø§Ø±Ø© Ø§Ù„Ø²Ø§Ø¦Ø¯Ø© ØªÙØ³Ø¯ Ø§Ù„Ø£Ù†Ø²ÙŠÙ….
â€¢ Ø§Ù„Ù€ pH: Ù„ÙƒÙ„ Ø£Ù†Ø²ÙŠÙ… pH Ø£Ù…Ø«Ù„ (Ø§Ù„Ø¨Ø¨Ø³ÙŠÙ† ÙŠØ¹Ù…Ù„ ÙÙŠ ÙˆØ³Ø· Ø­Ù…Ø¶ÙŠ).
â€¢ ØªØ±ÙƒÙŠØ² Ø§Ù„Ø±ÙƒÙŠØ²Ø© ÙˆØ§Ù„Ø£Ù†Ø²ÙŠÙ….'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'enzymes';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Une enzyme est de natureâ€¦', 'Ø§Ù„Ø£Ù†Ø²ÙŠÙ… Ø°Ùˆ Ø·Ø¨ÙŠØ¹Ø©â€¦',
   '["protÃ©ique","lipidique","glucidique","minÃ©rale"]'::jsonb, '["Ø¨Ø±ÙˆØªÙŠÙ†ÙŠØ©","Ø¯Ù‡Ù†ÙŠØ©","Ø³ÙƒØ±ÙŠØ©","Ù…Ø¹Ø¯Ù†ÙŠØ©"]'::jsonb,
   0, 'Les enzymes sont des protÃ©ines.', 'Ø§Ù„Ø£Ù†Ø²ÙŠÙ…Ø§Øª Ø¨Ø±ÙˆØªÙŠÙ†Ø§Øª.', 'easy', 1),
  ('La partie de l''enzyme qui fixe le substrat s''appelleâ€¦', 'Ø§Ù„Ø¬Ø²Ø¡ Ù…Ù† Ø§Ù„Ø£Ù†Ø²ÙŠÙ… Ø§Ù„Ø°ÙŠ ÙŠØ«Ø¨Ù‘Øª Ø§Ù„Ø±ÙƒÙŠØ²Ø© ÙŠÙØ³Ù…Ù‰â€¦',
   '["le site actif","le noyau","la membrane","le codon"]'::jsonb, '["Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„ÙØ¹Ù‘Ø§Ù„","Ø§Ù„Ù†ÙˆØ§Ø©","Ø§Ù„ØºØ´Ø§Ø¡","Ø§Ù„Ø±Ø§Ù…Ø²Ø©"]'::jsonb,
   0, 'Le site actif reÃ§oit le substrat (clÃ©-serrure).', 'Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„ÙØ¹Ù‘Ø§Ù„ ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø±ÙƒÙŠØ²Ø© (Ù…ÙØªØ§Ø­-Ù‚ÙÙ„).', 'medium', 2),
  ('Ã€ la fin de la rÃ©action, l''enzyme estâ€¦', 'ÙÙŠ Ù†Ù‡Ø§ÙŠØ© Ø§Ù„ØªÙØ§Ø¹Ù„ ÙŠÙƒÙˆÙ† Ø§Ù„Ø£Ù†Ø²ÙŠÙ…â€¦',
   '["intacte et rÃ©utilisable","dÃ©truite","consommÃ©e","transformÃ©e en substrat"]'::jsonb, '["Ø³Ù„ÙŠÙ…Ù‹Ø§ ÙˆÙ‚Ø§Ø¨Ù„Ø§Ù‹ Ù„Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ø§Ø³ØªØ¹Ù…Ø§Ù„","Ù…ØªÙ„ÙÙ‹Ø§","Ù…Ø³ØªÙ‡Ù„ÙƒÙ‹Ø§","Ù…Ø­ÙˆÙ‘Ù„Ø§Ù‹ Ø¥Ù„Ù‰ Ø±ÙƒÙŠØ²Ø©"]'::jsonb,
   0, 'Un catalyseur n''est pas consommÃ©.', 'Ø§Ù„ÙˆØ³ÙŠØ· Ù„Ø§ ÙŠÙØ³ØªÙ‡Ù„Ùƒ.', 'medium', 3),
  ('Une tempÃ©rature trop Ã©levÃ©e provoqueâ€¦ de l''enzyme', 'Ø§Ù„Ø­Ø±Ø§Ø±Ø© Ø§Ù„Ù…Ø±ØªÙØ¹Ø© Ø¬Ø¯Ù‹Ø§ ØªØ³Ø¨Ø¨â€¦ Ù„Ù„Ø£Ù†Ø²ÙŠÙ…',
   '["la dÃ©naturation","l''activation permanente","la duplication","la coloration"]'::jsonb, '["Ø§Ù„ØªÙ…Ø³Ù‘Ø® (ÙÙ‚Ø¯Ø§Ù† Ø§Ù„Ø¨Ù†ÙŠØ©)","ØªÙ†Ø´ÙŠØ·Ù‹Ø§ Ø¯Ø§Ø¦Ù…Ù‹Ø§","Ø§Ù„ØªØ¶Ø§Ø¹Ù","Ø§Ù„ØªÙ„ÙˆÙŠÙ†"]'::jsonb,
   0, 'La chaleur excessive dÃ©nature l''enzyme (perte de forme).', 'Ø§Ù„Ø­Ø±Ø§Ø±Ø© Ø§Ù„Ø²Ø§Ø¦Ø¯Ø© ØªÙ…Ø³Ù‘Ø® Ø§Ù„Ø£Ù†Ø²ÙŠÙ….', 'easy', 4),
  ('La Â« spÃ©cificitÃ© de substrat Â» signifie qu''une enzymeâ€¦', 'Â«Ù†ÙˆØ¹ÙŠØ© Ø§Ù„Ø±ÙƒÙŠØ²Ø©Â» ØªØ¹Ù†ÙŠ Ø£Ù† Ø§Ù„Ø£Ù†Ø²ÙŠÙ…â€¦',
   '["n''agit que sur un substrat donnÃ©","agit sur tout","change de forme","produit de l''ADN"]'::jsonb, '["ÙŠØ¤Ø«Ø± Ø¹Ù„Ù‰ Ø±ÙƒÙŠØ²Ø© Ù…Ø¹ÙŠÙ†Ø© ÙÙ‚Ø·","ÙŠØ¤Ø«Ø± Ø¹Ù„Ù‰ ÙƒÙ„ Ø´ÙŠØ¡","ÙŠØºÙŠÙ‘Ø± Ø´ÙƒÙ„Ù‡","ÙŠÙ†ØªØ¬ ADN"]'::jsonb,
   0, 'Chaque enzyme reconnaÃ®t un substrat prÃ©cis.', 'ÙƒÙ„ Ø£Ù†Ø²ÙŠÙ… ÙŠØªØ¹Ø±Ù Ø±ÙƒÙŠØ²Ø© Ù…Ø­Ø¯Ø¯Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'enzymes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA CONVERSION DE L''Ã‰NERGIE

L''ATP â€” LA MONNAIE Ã‰NERGÃ‰TIQUE
L''ATP (adÃ©nosine triphosphate) stocke et libÃ¨re l''Ã©nergie de la cellule.
ATP â†’ ADP + Pi + Ã©nergie (utilisable pour le travail cellulaire).

LA RESPIRATION CELLULAIRE
Se dÃ©roule dans les MITOCHONDRIES, en prÃ©sence de dioxygÃ¨ne (aÃ©robie).
Glucose + Oâ‚‚ â†’ COâ‚‚ + Hâ‚‚O + beaucoup d''ATP.
C''est le mode le plus rentable de production d''Ã©nergie.

LA FERMENTATION
Sans dioxygÃ¨ne (anaÃ©robie), dans le cytoplasme. Rendement faible.
â€¢ Fermentation lactique (muscle en effort) â†’ acide lactique + peu d''ATP.
â€¢ Fermentation alcoolique (levures) â†’ Ã©thanol + COâ‚‚ + peu d''ATP.

LA PHOTOSYNTHÃˆSE
Chez les vÃ©gÃ©taux chlorophylliens, dans les CHLOROPLASTES, Ã  la lumiÃ¨re :
COâ‚‚ + Hâ‚‚O â†’ glucose + Oâ‚‚ (matiÃ¨re organique produite Ã  partir de minÃ©ral).

BILAN : la respiration LIBÃˆRE l''Ã©nergie contenue dans le glucose ;
la photosynthÃ¨se la STOCKE dans le glucose grÃ¢ce Ã  la lumiÃ¨re.',
  lesson_ar = 'ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ø·Ø§Ù‚Ø©

Ø§Ù„Ù€ ATP â€” Ø§Ù„Ø¹Ù…Ù„Ø© Ø§Ù„Ø·Ø§Ù‚ÙˆÙŠØ©
ÙŠØ®Ø²Ù‘Ù† Ø§Ù„Ù€ ATP (Ø«Ù„Ø§Ø«ÙŠ ÙÙˆØ³ÙØ§Øª Ø§Ù„Ø£Ø¯ÙŠÙ†ÙˆØ²ÙŠÙ†) Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆÙŠØ­Ø±Ø±Ù‡Ø§.
ATP â† ADP + Pi + Ø·Ø§Ù‚Ø© ØªÙØ³ØªØ¹Ù…Ù„ ÙÙŠ Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø®Ù„ÙˆÙŠ.

Ø§Ù„ØªÙ†ÙØ³ Ø§Ù„Ø®Ù„ÙˆÙŠ
ÙŠØ­Ø¯Ø« ÙÙŠ Ø§Ù„Ù…ÙŠØªÙˆÙƒÙ†Ø¯Ø±ÙŠ Ø¨ÙˆØ¬ÙˆØ¯ Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ† (Ù‡ÙˆØ§Ø¦ÙŠ).
ØºÙ„ÙˆÙƒÙˆØ² + Oâ‚‚ â† COâ‚‚ + Hâ‚‚O + ÙƒÙ…ÙŠØ© ÙƒØ¨ÙŠØ±Ø© Ù…Ù† ATP. Ø£ÙƒØ«Ø± Ø§Ù„Ø·Ø±Ù‚ Ù…Ø±Ø¯ÙˆØ¯ÙŠØ©.

Ø§Ù„ØªØ®Ù…Ø±
Ø¯ÙˆÙ† Ø£ÙƒØ³Ø¬ÙŠÙ† (Ù„Ø§Ù‡ÙˆØ§Ø¦ÙŠ) ÙÙŠ Ø§Ù„Ù‡ÙŠÙˆÙ„Ù‰ØŒ Ù…Ø±Ø¯ÙˆØ¯Ù‡ Ø¶Ø¹ÙŠÙ.
â€¢ ØªØ®Ù…Ø± Ù„Ø¨Ù†ÙŠ (Ø§Ù„Ø¹Ø¶Ù„Ø© Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø¬Ù‡Ø¯) â† Ø­Ù…Ø¶ Ù„Ø¨Ù†ÙŠ + Ù‚Ù„ÙŠÙ„ Ù…Ù† ATP.
â€¢ ØªØ®Ù…Ø± ÙƒØ­ÙˆÙ„ÙŠ (Ø§Ù„Ø®Ù…Ø§Ø¦Ø±) â† Ø¥ÙŠØ«Ø§Ù†ÙˆÙ„ + COâ‚‚ + Ù‚Ù„ÙŠÙ„ Ù…Ù† ATP.

Ø§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ø¶ÙˆØ¦ÙŠ
Ø¹Ù†Ø¯ Ø§Ù„Ù†Ø¨Ø§ØªØ§Øª Ø§Ù„Ø®Ø¶Ø±Ø§Ø¡ ÙÙŠ Ø§Ù„ØµØ§Ù†Ø¹Ø§Øª Ø§Ù„Ø®Ø¶Ø±Ø§Ø¡ ÙˆØ¨ÙˆØ¬ÙˆØ¯ Ø§Ù„Ø¶ÙˆØ¡:
COâ‚‚ + Hâ‚‚O â† ØºÙ„ÙˆÙƒÙˆØ² + Oâ‚‚.

Ø§Ù„Ø­ÙˆØµÙ„Ø©: Ø§Ù„ØªÙ†ÙØ³ ÙŠØ­Ø±Ø± Ø§Ù„Ø·Ø§Ù‚Ø©ØŒ ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ø¶ÙˆØ¦ÙŠ ÙŠØ®Ø²Ù‘Ù†Ù‡Ø§ ÙÙŠ Ø§Ù„ØºÙ„ÙˆÙƒÙˆØ² Ø¨ÙØ¶Ù„ Ø§Ù„Ø¶ÙˆØ¡.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'energie';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La molÃ©cule qui stocke l''Ã©nergie utilisable par la cellule estâ€¦', 'Ø§Ù„Ø¬Ø²ÙŠØ¡ Ø§Ù„Ø°ÙŠ ÙŠØ®Ø²Ù‘Ù† Ø§Ù„Ø·Ø§Ù‚Ø© Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø§Ø³ØªØ¹Ù…Ø§Ù„ Ù‡Ùˆâ€¦',
   '["l''ATP","l''ADN","le glucose seul","l''oxygÃ¨ne"]'::jsonb, '["Ø§Ù„Ù€ ATP","Ø§Ù„Ù€ ADN","Ø§Ù„ØºÙ„ÙˆÙƒÙˆØ² ÙˆØ­Ø¯Ù‡","Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ†"]'::jsonb,
   0, 'L''ATP est la Â« monnaie Ã©nergÃ©tique Â».', 'Ø§Ù„Ù€ ATP Ù‡Ùˆ Ø§Ù„Ø¹Ù…Ù„Ø© Ø§Ù„Ø·Ø§Ù‚ÙˆÙŠØ©.', 'easy', 1),
  ('La respiration cellulaire se dÃ©roule dansâ€¦', 'ÙŠØ­Ø¯Ø« Ø§Ù„ØªÙ†ÙØ³ Ø§Ù„Ø®Ù„ÙˆÙŠ ÙÙŠâ€¦',
   '["les mitochondries","les chloroplastes","le noyau","les ribosomes"]'::jsonb, '["Ø§Ù„Ù…ÙŠØªÙˆÙƒÙ†Ø¯Ø±ÙŠ","Ø§Ù„ØµØ§Ù†Ø¹Ø§Øª Ø§Ù„Ø®Ø¶Ø±Ø§Ø¡","Ø§Ù„Ù†ÙˆØ§Ø©","Ø§Ù„Ø±ÙŠØ¨ÙˆØ²ÙˆÙ…Ø§Øª"]'::jsonb,
   0, 'La respiration a lieu dans les mitochondries.', 'Ø§Ù„ØªÙ†ÙØ³ ÙŠØ­Ø¯Ø« ÙÙŠ Ø§Ù„Ù…ÙŠØªÙˆÙƒÙ†Ø¯Ø±ÙŠ.', 'medium', 2),
  ('La photosynthÃ¨se produitâ€¦', 'ÙŠÙ†ØªØ¬ Ø§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ø¶ÙˆØ¦ÙŠâ€¦',
   '["du glucose et de l''Oâ‚‚","du COâ‚‚ seulement","de l''ATP uniquement","de l''acide lactique"]'::jsonb, '["Ø§Ù„ØºÙ„ÙˆÙƒÙˆØ² ÙˆØ§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ†","COâ‚‚ ÙÙ‚Ø·","ATP ÙÙ‚Ø·","Ø­Ù…Ø¶Ù‹Ø§ Ù„Ø¨Ù†ÙŠÙ‹Ø§"]'::jsonb,
   0, 'COâ‚‚ + Hâ‚‚O + lumiÃ¨re â†’ glucose + Oâ‚‚.', 'COâ‚‚ + Hâ‚‚O + Ø¶ÙˆØ¡ â† ØºÙ„ÙˆÙƒÙˆØ² + Oâ‚‚.', 'medium', 3),
  ('La fermentation se produitâ€¦', 'ÙŠØ­Ø¯Ø« Ø§Ù„ØªØ®Ù…Ø±â€¦',
   '["en absence de dioxygÃ¨ne","seulement avec Oâ‚‚","dans le noyau","Ã  la lumiÃ¨re"]'::jsonb, '["ÙÙŠ ØºÙŠØ§Ø¨ Ø§Ù„Ø£ÙƒØ³Ø¬ÙŠÙ†","ÙÙ‚Ø· Ø¨ÙˆØ¬ÙˆØ¯ Oâ‚‚","ÙÙŠ Ø§Ù„Ù†ÙˆØ§Ø©","ÙÙŠ Ø§Ù„Ø¶ÙˆØ¡"]'::jsonb,
   0, 'La fermentation est anaÃ©robie (sans Oâ‚‚).', 'Ø§Ù„ØªØ®Ù…Ø± Ù„Ø§Ù‡ÙˆØ§Ø¦ÙŠ (Ø¯ÙˆÙ† Ø£ÙƒØ³Ø¬ÙŠÙ†).', 'easy', 4),
  ('ComparÃ©e Ã  la fermentation, la respiration produitâ€¦', 'Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ø§Ù„ØªØ®Ù…Ø± ÙŠÙ†ØªØ¬ Ø§Ù„ØªÙ†ÙØ³â€¦',
   '["beaucoup plus d''ATP","moins d''ATP","autant d''ATP","aucun ATP"]'::jsonb, '["ÙƒÙ…ÙŠØ© Ø£ÙƒØ¨Ø± Ù…Ù† ATP","Ø£Ù‚Ù„ ATP","Ù†ÙØ³ Ø§Ù„ÙƒÙ…ÙŠØ©","Ù„Ø§ ATP"]'::jsonb,
   0, 'La respiration est bien plus rentable en ATP.', 'Ø§Ù„ØªÙ†ÙØ³ Ø£ÙƒØ«Ø± Ù…Ø±Ø¯ÙˆØ¯ÙŠØ© Ø¨ÙƒØ«ÙŠØ± ÙÙŠ ATP.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'energie'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA COMMUNICATION NERVEUSE

LE MESSAGE NERVEUX
Le long d''un neurone, le message est un signal Ã‰LECTRIQUE appelÃ© POTENTIEL
D''ACTION (PA). Au repos, la membrane est polarisÃ©e (potentiel de repos â‰ˆ âˆ’70 mV).
Une stimulation suffisante (seuil) dÃ©clenche un PA qui se propage.

LA LOI DU TOUT OU RIEN
Si la stimulation atteint le seuil, le PA apparaÃ®t toujours avec la mÃªme
amplitude. En dessous du seuil : rien. L''intensitÃ© du stimulus est codÃ©e
par la FRÃ‰QUENCE des PA, pas leur amplitude.

LA SYNAPSE
Zone de communication entre deux neurones (ou neurone-muscle). Le message
y devient CHIMIQUE : le neurone libÃ¨re un NEUROTRANSMETTEUR dans la fente
synaptique, captÃ© par des rÃ©cepteurs du neurone suivant. La transmission
est donc Ã  sens unique.

L''INTÃ‰GRATION
Un neurone reÃ§oit de nombreux messages (excitateurs et inhibiteurs) et fait
la somme : il Ã©met un PA seulement si le bilan atteint le seuil.

SUBSTANCES ET DANGERS : drogues et alcool perturbent les synapses.',
  lesson_ar = 'Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ø¹ØµØ¨ÙŠ

Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¹ØµØ¨ÙŠØ©
Ø¹Ù„Ù‰ Ø·ÙˆÙ„ Ø§Ù„Ø¹ØµØ¨ÙˆÙ†ØŒ Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø¥Ø´Ø§Ø±Ø© ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ© ØªÙØ³Ù…Ù‰ ÙƒÙ…ÙˆÙ† Ø§Ù„Ø¹Ù…Ù„ (PA). ÙÙŠ Ø§Ù„Ø±Ø§Ø­Ø© ÙŠÙƒÙˆÙ†
Ø§Ù„ØºØ´Ø§Ø¡ Ù…Ø³ØªÙ‚Ø·Ø¨Ù‹Ø§ (ÙƒÙ…ÙˆÙ† Ø§Ù„Ø±Ø§Ø­Ø© â‰ˆ âˆ’70 Ù…Ù„ÙŠ ÙÙˆÙ„Ø·). ØªÙ†Ø¨ÙŠÙ‡ ÙƒØ§ÙÙ (Ø§Ù„Ø¹ØªØ¨Ø©) ÙŠÙˆÙ„Ù‘Ø¯ ÙƒÙ…ÙˆÙ† Ø¹Ù…Ù„ ÙŠÙ†ØªØ´Ø±.

Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„ÙƒÙ„ Ø£Ùˆ Ø§Ù„Ù„Ø§Ø´ÙŠØ¡
Ø¥Ø°Ø§ Ø¨Ù„Øº Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„Ø¹ØªØ¨Ø© ÙŠØ¸Ù‡Ø± PA Ø¨Ù†ÙØ³ Ø§Ù„Ø§ØªØ³Ø§Ø¹ Ø¯Ø§Ø¦Ù…Ù‹Ø§. ØªØ­Øª Ø§Ù„Ø¹ØªØ¨Ø©: Ù„Ø§ Ø´ÙŠØ¡.
ØªÙØ±Ù…Ù‘Ø² Ø´Ø¯Ø© Ø§Ù„Ù…Ù†Ø¨Ù‡ Ø¨ØªÙˆØ§ØªØ± ÙƒÙ…ÙˆÙ†Ø§Øª Ø§Ù„Ø¹Ù…Ù„ Ù„Ø§ Ø¨Ø§ØªØ³Ø§Ø¹Ù‡Ø§.

Ø§Ù„Ù…Ø´Ø¨Ùƒ
Ù…Ù†Ø·Ù‚Ø© Ø§Ù„ØªÙˆØ§ØµÙ„ Ø¨ÙŠÙ† Ø¹ØµØ¨ÙˆÙ†ÙŠÙ† (Ø£Ùˆ Ø¹ØµØ¨ÙˆÙ†-Ø¹Ø¶Ù„Ø©). ØªØµØ¨Ø­ Ø§Ù„Ø±Ø³Ø§Ù„Ø© ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ©: ÙŠØ­Ø±Ø± Ø§Ù„Ø¹ØµØ¨ÙˆÙ†
Ù…Ø¨Ù„Ù‘ØºÙ‹Ø§ Ø¹ØµØ¨ÙŠÙ‹Ø§ ÙÙŠ Ø§Ù„Ø´Ù‚ Ø§Ù„Ù…Ø´Ø¨ÙƒÙŠ ØªÙ„ØªÙ‚Ø·Ù‡ Ù…Ø³ØªÙ‚Ø¨Ù„Ø§Øª Ø§Ù„Ø¹ØµØ¨ÙˆÙ† Ø§Ù„ØªØ§Ù„ÙŠ. Ø§Ù„Ù†Ù‚Ù„ Ø¨Ø§ØªØ¬Ø§Ù‡ ÙˆØ§Ø­Ø¯.

Ø§Ù„ØªÙƒØ§Ù…Ù„
ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø¹ØµØ¨ÙˆÙ† Ø±Ø³Ø§Ø¦Ù„ Ø¹Ø¯ÙŠØ¯Ø© (Ù…Ù†Ø¨Ù‘Ù‡Ø© ÙˆÙ…Ø«Ø¨Ù‘Ø·Ø©) ÙˆÙŠØ¬Ù…Ø¹Ù‡Ø§: ÙŠØµØ¯Ø± PA ÙÙ‚Ø· Ø¥Ø°Ø§ Ø¨Ù„ØºØª Ø§Ù„Ø­ØµÙŠÙ„Ø© Ø§Ù„Ø¹ØªØ¨Ø©.

Ù…ÙˆØ§Ø¯ ÙˆØ£Ø®Ø·Ø§Ø±: Ø§Ù„Ù…Ø®Ø¯Ø±Ø§Øª ÙˆØ§Ù„ÙƒØ­ÙˆÙ„ ØªØ¹ÙŠÙ‚ Ø¹Ù…Ù„ Ø§Ù„Ù…Ø´Ø§Ø¨Ùƒ.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'communication-nerveuse';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Le signal qui se propage le long d''un neurone estâ€¦', 'Ø§Ù„Ø¥Ø´Ø§Ø±Ø© Ø§Ù„ØªÙŠ ØªÙ†ØªØ´Ø± Ø¹Ù„Ù‰ Ø·ÙˆÙ„ Ø§Ù„Ø¹ØµØ¨ÙˆÙ† Ù‡ÙŠâ€¦',
   '["le potentiel d''action","une hormone","un anticorps","une enzyme"]'::jsonb, '["ÙƒÙ…ÙˆÙ† Ø§Ù„Ø¹Ù…Ù„","Ù‡Ø±Ù…ÙˆÙ†","Ø¬Ø³Ù… Ù…Ø¶Ø§Ø¯","Ø£Ù†Ø²ÙŠÙ…"]'::jsonb,
   0, 'Le PA est le message Ã©lectrique du neurone.', 'ÙƒÙ…ÙˆÙ† Ø§Ù„Ø¹Ù…Ù„ Ù‡Ùˆ Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ© Ù„Ù„Ø¹ØµØ¨ÙˆÙ†.', 'easy', 1),
  ('Au niveau de la synapse, le message devientâ€¦', 'Ø¹Ù„Ù‰ Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ù…Ø´Ø¨Ùƒ ØªØµØ¨Ø­ Ø§Ù„Ø±Ø³Ø§Ù„Ø©â€¦',
   '["chimique","Ã©lectrique","lumineuse","mÃ©canique"]'::jsonb, '["ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ©","ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©","Ø¶ÙˆØ¦ÙŠØ©","Ù…ÙŠÙƒØ§Ù†ÙŠÙƒÙŠØ©"]'::jsonb,
   0, 'La synapse transmet via un neurotransmetteur (chimique).', 'Ø§Ù„Ù…Ø´Ø¨Ùƒ ÙŠÙ†Ù‚Ù„ Ø¹Ø¨Ø± Ù…Ø¨Ù„Ù‘Øº Ø¹ØµØ¨ÙŠ (ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ).', 'medium', 2),
  ('L''intensitÃ© d''un stimulus est codÃ©e parâ€¦', 'ØªÙØ±Ù…Ù‘Ø² Ø´Ø¯Ø© Ø§Ù„Ù…Ù†Ø¨Ù‡ Ø¨Ù€â€¦',
   '["la frÃ©quence des PA","l''amplitude des PA","la couleur","la taille du neurone"]'::jsonb, '["ØªÙˆØ§ØªØ± ÙƒÙ…ÙˆÙ†Ø§Øª Ø§Ù„Ø¹Ù…Ù„","Ø§ØªØ³Ø§Ø¹ ÙƒÙ…ÙˆÙ†Ø§Øª Ø§Ù„Ø¹Ù…Ù„","Ø§Ù„Ù„ÙˆÙ†","Ø­Ø¬Ù… Ø§Ù„Ø¹ØµØ¨ÙˆÙ†"]'::jsonb,
   0, 'Loi du tout ou rien : c''est la frÃ©quence qui code l''intensitÃ©.', 'Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„ÙƒÙ„ Ø£Ùˆ Ø§Ù„Ù„Ø§Ø´ÙŠØ¡: Ø§Ù„ØªÙˆØ§ØªØ± ÙŠØ±Ù…Ù‘Ø² Ø§Ù„Ø´Ø¯Ø©.', 'medium', 3),
  ('La transmission synaptique se faitâ€¦', 'Ø§Ù„Ù†Ù‚Ù„ Ø§Ù„Ù…Ø´Ø¨ÙƒÙŠ ÙŠØªÙ…â€¦',
   '["dans un seul sens","dans les deux sens","au hasard","sans rÃ©cepteurs"]'::jsonb, '["ÙÙŠ Ø§ØªØ¬Ø§Ù‡ ÙˆØ§Ø­Ø¯","ÙÙŠ Ø§Ù„Ø§ØªØ¬Ø§Ù‡ÙŠÙ†","Ø¹Ø´ÙˆØ§Ø¦ÙŠÙ‹Ø§","Ø¯ÙˆÙ† Ù…Ø³ØªÙ‚Ø¨Ù„Ø§Øª"]'::jsonb,
   0, 'Le neurotransmetteur va du neurone Ã©metteur au rÃ©cepteur : sens unique.', 'ÙŠØ°Ù‡Ø¨ Ø§Ù„Ù…Ø¨Ù„Ù‘Øº Ù…Ù† Ø§Ù„Ø¹ØµØ¨ÙˆÙ† Ø§Ù„Ù…Ø±Ø³Ù„ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„: Ø§ØªØ¬Ø§Ù‡ ÙˆØ§Ø­Ø¯.', 'easy', 4),
  ('Le potentiel de repos de la membrane est d''environâ€¦', 'ÙƒÙ…ÙˆÙ† Ø±Ø§Ø­Ø© Ø§Ù„ØºØ´Ø§Ø¡ Ø­ÙˆØ§Ù„ÙŠâ€¦',
   '["âˆ’70 mV","+70 mV","0 mV","âˆ’700 mV"]'::jsonb, '["âˆ’70 mV","+70 mV","0 mV","âˆ’700 mV"]'::jsonb,
   0, 'Environ âˆ’70 mV au repos.', 'Ø­ÙˆØ§Ù„ÙŠ âˆ’70 Ù…Ù„ÙŠ ÙÙˆÙ„Ø· ÙÙŠ Ø§Ù„Ø±Ø§Ø­Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'communication-nerveuse'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'L''IMMUNITÃ‰ â€” SOI ET NON-SOI

LE SOI ET LE NON-SOI
Le SOI = les molÃ©cules propres Ã  l''organisme (marqueurs CMH sur les cellules).
Le NON-SOI = tout Ã©lÃ©ment Ã©tranger (microbe, greffe, cellule anormale).
Le systÃ¨me immunitaire tolÃ¨re le soi et attaque le non-soi.

LES CELLULES DE L''IMMUNITÃ‰
â€¢ Lymphocytes B (LB) : produisent les ANTICORPS (immunitÃ© humorale).
â€¢ Lymphocytes T4 (LT auxiliaires) : Â« chefs d''orchestre Â», activent les autres.
â€¢ Lymphocytes T8 (LT cytotoxiques) : dÃ©truisent les cellules infectÃ©es
  (immunitÃ© cellulaire).
â€¢ Macrophages : phagocytent et prÃ©sentent l''antigÃ¨ne.

LA RÃ‰PONSE IMMUNITAIRE
1. Reconnaissance de l''antigÃ¨ne.
2. SÃ©lection et multiplication des lymphocytes spÃ©cifiques.
3. DiffÃ©renciation : plasmocytes (anticorps) et cellules mÃ©moire.
4. Ã‰limination de l''antigÃ¨ne.

LE VIH ET LE SIDA
Le VIH dÃ©truit les LT4, Â« chefs d''orchestre Â» de la rÃ©ponse. Sans eux, le
systÃ¨me s''effondre â†’ SIDA (immunodÃ©ficience). D''oÃ¹ l''importance de la
prÃ©vention.',
  lesson_ar = 'Ø§Ù„Ù…Ù†Ø§Ø¹Ø© â€” Ø§Ù„Ø°Ø§Øª ÙˆØ§Ù„Ù„Ø§Ø°Ø§Øª

Ø§Ù„Ø°Ø§Øª ÙˆØ§Ù„Ù„Ø§Ø°Ø§Øª
Ø§Ù„Ø°Ø§Øª = Ø¬Ø²ÙŠØ¦Ø§Øª Ø§Ù„Ø¬Ø³Ù… Ø§Ù„Ø®Ø§ØµØ© (Ù…Ø¤Ø´Ø±Ø§Øª CMH Ø¹Ù„Ù‰ Ø§Ù„Ø®Ù„Ø§ÙŠØ§).
Ø§Ù„Ù„Ø§Ø°Ø§Øª = ÙƒÙ„ Ø¹Ù†ØµØ± ØºØ±ÙŠØ¨ (Ù…ÙŠÙƒØ±ÙˆØ¨ØŒ Ø·Ø¹Ù…ØŒ Ø®Ù„ÙŠØ© Ø´Ø§Ø°Ø©).
ÙŠØªØ­Ù…Ù„ Ø§Ù„Ø¬Ù‡Ø§Ø² Ø§Ù„Ù…Ù†Ø§Ø¹ÙŠ Ø§Ù„Ø°Ø§Øª ÙˆÙŠÙ‡Ø§Ø¬Ù… Ø§Ù„Ù„Ø§Ø°Ø§Øª.

Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù…Ù†Ø§Ø¹Ø©
â€¢ Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B: ØªÙ†ØªØ¬ Ø§Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø© (Ù…Ù†Ø§Ø¹Ø© Ø®Ù„Ø·ÙŠØ©).
â€¢ Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T4 (Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©): Â«Ù‚Ø§Ø¦Ø¯Ø© Ø§Ù„Ø£ÙˆØ±ÙƒØ³ØªØ±Ø§Â» ØªÙ†Ø´Ù‘Ø· Ø§Ù„Ø¨Ù‚ÙŠØ©.
â€¢ Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T8 (Ø§Ù„Ø³Ø§Ù…Ø©): ØªØªÙ„Ù Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù…ØµØ§Ø¨Ø© (Ù…Ù†Ø§Ø¹Ø© Ø®Ù„ÙˆÙŠØ©).
â€¢ Ø§Ù„Ø¨Ù„Ø¹Ù…ÙŠØ§Øª: ØªØ¨Ù„Ø¹Ù… ÙˆØªØ¹Ø±Ø¶ Ø§Ù„Ù…Ø³ØªØ¶Ø¯.

Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø§Ù„Ù…Ù†Ø§Ø¹ÙŠØ©
1. Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªØ¶Ø¯. 2. Ø§Ù†ØªÙ‚Ø§Ø¡ ÙˆØªÙƒØ§Ø«Ø± Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª Ø§Ù„Ù†ÙˆØ¹ÙŠØ©.
3. Ø§Ù„ØªÙ…Ø§ÙŠØ²: Ø®Ù„Ø§ÙŠØ§ Ø¨Ù„Ø§Ø²Ù…ÙŠØ© (Ø£Ø¬Ø³Ø§Ù… Ù…Ø¶Ø§Ø¯Ø©) ÙˆØ®Ù„Ø§ÙŠØ§ Ø°Ø§ÙƒØ±Ø©. 4. Ø§Ù„Ù‚Ø¶Ø§Ø¡ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªØ¶Ø¯.

Ø§Ù„Ù€ VIH ÙˆØ§Ù„Ø³ÙŠØ¯Ø§
ÙŠØªÙ„Ù Ø§Ù„Ù€ VIH Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T4 Ù‚Ø§Ø¦Ø¯Ø© Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø©ØŒ ÙÙŠÙ†Ù‡Ø§Ø± Ø§Ù„Ø¬Ù‡Ø§Ø² â† Ø§Ù„Ø³ÙŠØ¯Ø§ (Ø¹ÙˆØ² Ù…Ù†Ø§Ø¹ÙŠ).
Ù„Ø°Ù„Ùƒ ØªÙØ¹Ø¯Ù‘ Ø§Ù„ÙˆÙ‚Ø§ÙŠØ© Ø£Ø³Ø§Ø³ÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'immunite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les marqueurs du Â« soi Â» portÃ©s par nos cellules sontâ€¦', 'Ù…Ø¤Ø´Ø±Ø§Øª Â«Ø§Ù„Ø°Ø§ØªÂ» Ø¹Ù„Ù‰ Ø®Ù„Ø§ÙŠØ§Ù†Ø§ Ù‡ÙŠâ€¦',
   '["les molÃ©cules du CMH","les anticorps","les virus","les hormones"]'::jsonb, '["Ø¬Ø²ÙŠØ¦Ø§Øª Ø§Ù„Ù€ CMH","Ø§Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø©","Ø§Ù„ÙÙŠØ±ÙˆØ³Ø§Øª","Ø§Ù„Ù‡Ø±Ù…ÙˆÙ†Ø§Øª"]'::jsonb,
   0, 'Le CMH marque les cellules du soi.', 'Ø§Ù„Ù€ CMH ÙŠÙ…ÙŠÙ‘Ø² Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø°Ø§Øª.', 'easy', 1),
  ('Les lymphocytes T8 cytotoxiquesâ€¦', 'Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T8 Ø§Ù„Ø³Ø§Ù…Ø©â€¦',
   '["dÃ©truisent les cellules infectÃ©es","produisent des anticorps","fabriquent des hormones","digÃ¨rent le glucose"]'::jsonb, '["ØªØªÙ„Ù Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù…ØµØ§Ø¨Ø©","ØªÙ†ØªØ¬ Ø£Ø¬Ø³Ø§Ù…Ù‹Ø§ Ù…Ø¶Ø§Ø¯Ø©","ØªØµÙ†Ø¹ Ù‡Ø±Ù…ÙˆÙ†Ø§Øª","ØªÙ‡Ø¶Ù… Ø§Ù„ØºÙ„ÙˆÙƒÙˆØ²"]'::jsonb,
   0, 'Les LT8 assurent l''immunitÃ© cellulaire.', 'Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T8 ØªØ¤Ù…Ù‘Ù† Ø§Ù„Ù…Ù†Ø§Ø¹Ø© Ø§Ù„Ø®Ù„ÙˆÙŠØ©.', 'medium', 2),
  ('Le VIH dÃ©truit principalementâ€¦', 'ÙŠØªÙ„Ù Ø§Ù„Ù€ VIH Ø¨Ø´ÙƒÙ„ Ø±Ø¦ÙŠØ³ÙŠâ€¦',
   '["les lymphocytes T4","les globules rouges","les neurones","les os"]'::jsonb, '["Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T4","Ø§Ù„ÙƒØ±ÙŠØ§Øª Ø§Ù„Ø­Ù…Ø±Ø§Ø¡","Ø§Ù„Ø¹ØµØ¨ÙˆÙ†Ø§Øª","Ø§Ù„Ø¹Ø¸Ø§Ù…"]'::jsonb,
   0, 'Le VIH dÃ©truit les LT4 â†’ effondrement immunitaire.', 'Ø§Ù„Ù€ VIH ÙŠØªÙ„Ù Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T4 â† Ø§Ù†Ù‡ÙŠØ§Ø± Ù…Ù†Ø§Ø¹ÙŠ.', 'medium', 3),
  ('Les anticorps sont produits par les plasmocytes issus desâ€¦', 'ØªÙ†ØªØ¬ Ø§Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø© Ù…Ù† Ø®Ù„Ø§ÙŠØ§ Ø¨Ù„Ø§Ø²Ù…ÙŠØ© Ù…ØµØ¯Ø±Ù‡Ø§â€¦',
   '["lymphocytes B","lymphocytes T8","macrophages","hÃ©maties"]'::jsonb, '["Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B","Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª T8","Ø§Ù„Ø¨Ù„Ø¹Ù…ÙŠØ§Øª","Ø§Ù„ÙƒØ±ÙŠØ§Øª Ø§Ù„Ø­Ù…Ø±Ø§Ø¡"]'::jsonb,
   0, 'Les LB se diffÃ©rencient en plasmocytes producteurs d''anticorps.', 'Ø§Ù„Ù„Ù…ÙØ§ÙˆÙŠØ§Øª B ØªØªÙ…Ø§ÙŠØ² Ø¥Ù„Ù‰ Ø®Ù„Ø§ÙŠØ§ Ø¨Ù„Ø§Ø²Ù…ÙŠØ© Ù…Ù†ØªØ¬Ø© Ù„Ù„Ø£Ø¬Ø³Ø§Ù… Ø§Ù„Ù…Ø¶Ø§Ø¯Ø©.', 'easy', 4),
  ('AprÃ¨s une infection, les cellules qui assurent une rÃ©ponse plus rapide la 2áµ‰ fois sontâ€¦', 'Ø¨Ø¹Ø¯ Ø§Ù„Ø¹Ø¯ÙˆÙ‰ØŒ Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„ØªÙŠ ØªØ¤Ù…Ù‘Ù† Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø£Ø³Ø±Ø¹ ÙÙŠ Ø§Ù„Ù…Ø±Ø© Ø§Ù„Ø«Ø§Ù†ÙŠØ© Ù‡ÙŠâ€¦',
   '["les cellules mÃ©moire","les globules rouges","les plaquettes","les neurones"]'::jsonb, '["Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø°Ø§ÙƒØ±Ø©","Ø§Ù„ÙƒØ±ÙŠØ§Øª Ø§Ù„Ø­Ù…Ø±Ø§Ø¡","Ø§Ù„ØµÙÙŠØ­Ø§Øª","Ø§Ù„Ø¹ØµØ¨ÙˆÙ†Ø§Øª"]'::jsonb,
   0, 'Les cellules mÃ©moire accÃ©lÃ¨rent la rÃ©ponse secondaire.', 'Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø°Ø§ÙƒØ±Ø© ØªØ³Ø±Ù‘Ø¹ Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø§Ù„Ø«Ø§Ù†ÙˆÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'svt' and c.slug = 'immunite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS PHYSIQUE (BAC) â€” flagship chapters =================

update public.chapters c set
  lesson_fr = 'SUIVI TEMPOREL D''UNE TRANSFORMATION CHIMIQUE (cinÃ©tique)

VITESSE D''UNE RÃ‰ACTION
Certaines rÃ©actions sont lentes, d''autres rapides. La CINÃ‰TIQUE Ã©tudie leur
Ã©volution dans le temps. On suit une grandeur (concentration, volume de gaz,
conductivitÃ©â€¦) au cours du temps.

LA VITESSE VOLUMIQUE
v = (1/V) Ã— (dx/dt), oÃ¹ x est l''avancement. La vitesse est MAXIMALE au dÃ©but
(rÃ©actifs abondants) puis DIMINUE et tend vers zÃ©ro quand la rÃ©action s''achÃ¨ve.

LE TEMPS DE DEMI-RÃ‰ACTION tÂ½
C''est la durÃ©e au bout de laquelle l''avancement atteint la MOITIÃ‰ de sa valeur
finale (x = x_max/2). Il sert Ã  comparer la rapiditÃ© des rÃ©actions.

LES FACTEURS CINÃ‰TIQUES (qui accÃ©lÃ¨rent une rÃ©action)
â€¢ La TEMPÃ‰RATURE : plus il fait chaud, plus la rÃ©action est rapide.
â€¢ La CONCENTRATION des rÃ©actifs : plus elle est grande, plus c''est rapide.
â€¢ Le CATALYSEUR : accÃ©lÃ¨re sans Ãªtre consommÃ© (ex. enzymes, ions mÃ©talliques).
â€¢ La surface de contact (Ã©tat de division du solide).

Ã€ RETENIR : la vitesse dÃ©croÃ®t au cours du temps car les rÃ©actifs se rarÃ©fient.',
  lesson_ar = 'Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø²Ù…Ù†ÙŠØ© Ù„ØªØ­ÙˆÙ„ ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ (Ø§Ù„Ø­Ø±ÙƒÙŠØ©)

Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙØ§Ø¹Ù„
Ø¨Ø¹Ø¶ Ø§Ù„ØªÙØ§Ø¹Ù„Ø§Øª Ø¨Ø·ÙŠØ¦Ø© ÙˆØ£Ø®Ø±Ù‰ Ø³Ø±ÙŠØ¹Ø©. ØªØ¯Ø±Ø³ Ø§Ù„Ø­Ø±ÙƒÙŠØ© ØªØ·ÙˆØ±Ù‡Ø§ ÙÙŠ Ø§Ù„Ø²Ù…Ù† Ø¨Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ù‚Ø¯Ø§Ø±
(ØªØ±ÙƒÙŠØ²ØŒ Ø­Ø¬Ù… ØºØ§Ø²ØŒ Ù†Ø§Ù‚Ù„ÙŠØ©â€¦) Ø¹Ø¨Ø± Ø§Ù„Ø²Ù…Ù†.

Ø§Ù„Ø³Ø±Ø¹Ø© Ø§Ù„Ø­Ø¬Ù…ÙŠØ©
v = (1/V) Ã— (dx/dt) Ø­ÙŠØ« x Ø§Ù„ØªÙ‚Ø¯Ù‘Ù…. Ø§Ù„Ø³Ø±Ø¹Ø© Ø£Ø¹Ø¸Ù…ÙŠØ© ÙÙŠ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© (ÙˆÙØ±Ø© Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª)
Ø«Ù… ØªØªÙ†Ø§Ù‚Øµ ÙˆØªØ¤ÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„ØµÙØ± Ø¹Ù†Ø¯ Ø§Ù†ØªÙ‡Ø§Ø¡ Ø§Ù„ØªÙØ§Ø¹Ù„.

Ø²Ù…Ù† Ù†ØµÙ Ø§Ù„ØªÙØ§Ø¹Ù„ tÂ½
Ø§Ù„Ù…Ø¯Ø© Ø§Ù„ØªÙŠ ÙŠØ¨Ù„Øº Ø¹Ù†Ø¯Ù‡Ø§ Ø§Ù„ØªÙ‚Ø¯Ù‘Ù… Ù†ØµÙ Ù‚ÙŠÙ…ØªÙ‡ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ© (x = x_max/2)ØŒ ØªÙØ³ØªØ¹Ù…Ù„ Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø§Ù„Ø³Ø±Ø¹Ø§Øª.

Ø§Ù„Ø¹ÙˆØ§Ù…Ù„ Ø§Ù„Ø­Ø±ÙƒÙŠØ© (ØªØ³Ø±Ù‘Ø¹ Ø§Ù„ØªÙØ§Ø¹Ù„)
â€¢ Ø§Ù„Ø­Ø±Ø§Ø±Ø©: ÙƒÙ„Ù…Ø§ Ø§Ø±ØªÙØ¹Øª Ø²Ø§Ø¯Øª Ø§Ù„Ø³Ø±Ø¹Ø©.
â€¢ ØªØ±ÙƒÙŠØ² Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª: ÙƒÙ„Ù…Ø§ Ø²Ø§Ø¯ Ø²Ø§Ø¯Øª Ø§Ù„Ø³Ø±Ø¹Ø©.
â€¢ Ø§Ù„ÙˆØ³ÙŠØ·: ÙŠØ³Ø±Ù‘Ø¹ Ø¯ÙˆÙ† Ø£Ù† ÙŠÙØ³ØªÙ‡Ù„Ùƒ (Ø£Ù†Ø²ÙŠÙ…Ø§ØªØŒ Ø´ÙˆØ§Ø±Ø¯ Ù…Ø¹Ø¯Ù†ÙŠØ©).
â€¢ Ø³Ø·Ø­ Ø§Ù„ØªÙ…Ø§Ø³ (Ø¯Ø±Ø¬Ø© ØªØ¬Ø²Ø¦Ø© Ø§Ù„ØµÙ„Ø¨).

ØªØ°ÙƒØ±: ØªØªÙ†Ø§Ù‚Øµ Ø§Ù„Ø³Ø±Ø¹Ø© Ù…Ø¹ Ø§Ù„Ø²Ù…Ù† Ù„Ø£Ù† Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª ØªÙ†Ø¯Ø±.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'cinetique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La vitesse d''une rÃ©action chimique est gÃ©nÃ©ralementâ€¦ au dÃ©but', 'Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙØ§Ø¹Ù„ Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠ Ø¹Ù…ÙˆÙ…Ù‹Ø§â€¦ ÙÙŠ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©',
   '["maximale","nulle","minimale","nÃ©gative"]'::jsonb, '["Ø£Ø¹Ø¸Ù…ÙŠØ©","Ù…Ø¹Ø¯ÙˆÙ…Ø©","Ø£ØµØºØ±ÙŠØ©","Ø³Ø§Ù„Ø¨Ø©"]'::jsonb,
   0, 'Au dÃ©but les rÃ©actifs sont abondants â†’ vitesse maximale.', 'ÙÙŠ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª ÙˆÙÙŠØ±Ø© â† Ø³Ø±Ø¹Ø© Ø£Ø¹Ø¸Ù…ÙŠØ©.', 'easy', 1),
  ('Le temps de demi-rÃ©action tÂ½ correspond Ã  un avancement Ã©gal Ã â€¦', 'Ø²Ù…Ù† Ù†ØµÙ Ø§Ù„ØªÙØ§Ø¹Ù„ ÙŠÙˆØ§ÙÙ‚ ØªÙ‚Ø¯Ù‘Ù…Ù‹Ø§ ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["la moitiÃ© de l''avancement final","l''avancement final","le double","zÃ©ro"]'::jsonb, '["Ù†ØµÙ Ø§Ù„ØªÙ‚Ø¯Ù‘Ù… Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ","Ø§Ù„ØªÙ‚Ø¯Ù‘Ù… Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ","Ø§Ù„Ø¶Ø¹Ù","ØµÙØ±"]'::jsonb,
   0, 'x = x_max / 2 au temps tÂ½.', 'x = x_max / 2 Ø¹Ù†Ø¯ tÂ½.', 'medium', 2),
  ('Lequel N''EST PAS un facteur cinÃ©tique ?', 'Ø£ÙŠ Ù…Ù…Ø§ ÙŠÙ„ÙŠ Ù„ÙŠØ³ Ø¹Ø§Ù…Ù„Ø§Ù‹ Ø­Ø±ÙƒÙŠÙ‹Ø§ØŸ',
   '["la couleur du rÃ©cipient","la tempÃ©rature","la concentration","le catalyseur"]'::jsonb, '["Ù„ÙˆÙ† Ø§Ù„Ø¥Ù†Ø§Ø¡","Ø§Ù„Ø­Ø±Ø§Ø±Ø©","Ø§Ù„ØªØ±ÙƒÙŠØ²","Ø§Ù„ÙˆØ³ÙŠØ·"]'::jsonb,
   0, 'La couleur du rÃ©cipient n''influence pas la vitesse.', 'Ù„ÙˆÙ† Ø§Ù„Ø¥Ù†Ø§Ø¡ Ù„Ø§ ÙŠØ¤Ø«Ø± ÙÙŠ Ø§Ù„Ø³Ø±Ø¹Ø©.', 'medium', 3),
  ('Un catalyseurâ€¦', 'Ø§Ù„ÙˆØ³ÙŠØ·â€¦',
   '["accÃ©lÃ¨re sans Ãªtre consommÃ©","ralentit la rÃ©action","est un rÃ©actif","change les produits"]'::jsonb, '["ÙŠØ³Ø±Ù‘Ø¹ Ø¯ÙˆÙ† Ø£Ù† ÙŠÙØ³ØªÙ‡Ù„Ùƒ","ÙŠØ¨Ø·Ø¦ Ø§Ù„ØªÙØ§Ø¹Ù„","Ù…ØªÙØ§Ø¹Ù„","ÙŠØºÙŠÙ‘Ø± Ø§Ù„Ù†ÙˆØ§ØªØ¬"]'::jsonb,
   0, 'Le catalyseur accÃ©lÃ¨re et se retrouve intact.', 'Ø§Ù„ÙˆØ³ÙŠØ· ÙŠØ³Ø±Ù‘Ø¹ ÙˆÙŠØ¨Ù‚Ù‰ Ø³Ù„ÙŠÙ…Ù‹Ø§.', 'easy', 4),
  ('Au cours du temps, la vitesse de rÃ©actionâ€¦', 'Ù…Ø¹ Ù…Ø±ÙˆØ± Ø§Ù„Ø²Ù…Ù†ØŒ Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙØ§Ø¹Ù„â€¦',
   '["diminue","augmente","reste constante","devient infinie"]'::jsonb, '["ØªØªÙ†Ø§Ù‚Øµ","ØªØªØ²Ø§ÙŠØ¯","ØªØ¨Ù‚Ù‰ Ø«Ø§Ø¨ØªØ©","ØªØµØ¨Ø­ Ù„Ø§Ù†Ù‡Ø§Ø¦ÙŠØ©"]'::jsonb,
   0, 'Les rÃ©actifs se rarÃ©fient â†’ la vitesse diminue.', 'Ø§Ù„Ù…ØªÙØ§Ø¹Ù„Ø§Øª ØªÙ†Ø¯Ø± â† Ø§Ù„Ø³Ø±Ø¹Ø© ØªØªÙ†Ø§Ù‚Øµ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'cinetique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'Ã‰VOLUTION D''UN SYSTÃˆME MÃ‰CANIQUE

LES TROIS LOIS DE NEWTON
â€¢ 1Ê³áµ‰ loi (inertie) : un corps isolÃ© (ou pseudo-isolÃ©) garde une vitesse
  constante en ligne droite, ou reste immobile.
â€¢ 2áµ‰ loi : Î£F = mÂ·a. La somme des forces Ã©gale masse Ã— accÃ©lÃ©ration.
â€¢ 3áµ‰ loi (action-rÃ©action) : si A exerce une force sur B, B exerce sur A une
  force de mÃªme intensitÃ©, mÃªme direction, sens opposÃ©.

LA CHUTE LIBRE
Un corps en chute libre n''est soumis qu''Ã  son poids. Son accÃ©lÃ©ration est g
(â‰ˆ 9,8 m/sÂ²), INDÃ‰PENDANTE de la masse : une plume et une bille tombent
de la mÃªme faÃ§on dans le vide.

MOUVEMENTS DANS UN CHAMP UNIFORME
â€¢ Champ de pesanteur : trajectoire parabolique d''un projectile.
â€¢ Champ Ã©lectrique uniforme (entre deux plaques) : dÃ©viation d''une particule
  chargÃ©e.

REPÃˆRES ET Ã‰QUATIONS HORAIRES
On projette la 2áµ‰ loi sur les axes pour obtenir a, puis v(t) et x(t) par
intÃ©grations successives, Ã  partir des conditions initiales.',
  lesson_ar = 'ØªØ·ÙˆØ± Ø¬Ù…Ù„Ø© Ù…ÙŠÙƒØ§Ù†ÙŠÙƒÙŠØ©

Ù‚ÙˆØ§Ù†ÙŠÙ† Ù†ÙŠÙˆØªÙ† Ø§Ù„Ø«Ù„Ø§Ø«Ø©
â€¢ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£ÙˆÙ„ (Ø§Ù„Ø¹Ø·Ø§Ù„Ø©): Ø¬Ø³Ù… Ù…Ø¹Ø²ÙˆÙ„ ÙŠØ­Ø§ÙØ¸ Ø¹Ù„Ù‰ Ø³Ø±Ø¹Ø© Ø«Ø§Ø¨ØªØ© ÙÙŠ Ø®Ø· Ù…Ø³ØªÙ‚ÙŠÙ… Ø£Ùˆ ÙŠØ¨Ù‚Ù‰ Ø³Ø§ÙƒÙ†Ù‹Ø§.
â€¢ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø«Ø§Ù†ÙŠ: Î£F = mÂ·a (Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ù‚ÙˆÙ‰ = Ø§Ù„ÙƒØªÙ„Ø© Ã— Ø§Ù„ØªØ³Ø§Ø±Ø¹).
â€¢ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø«Ø§Ù„Ø« (Ø§Ù„ÙØ¹Ù„ ÙˆØ±Ø¯ Ø§Ù„ÙØ¹Ù„): Ø¥Ø°Ø§ Ø£Ø«Ù‘Ø± A Ø¹Ù„Ù‰ B Ø¨Ù‚ÙˆØ©ØŒ Ø£Ø«Ù‘Ø± B Ø¹Ù„Ù‰ A Ø¨Ù‚ÙˆØ© Ù…Ø³Ø§ÙˆÙŠØ© ÙˆÙ…Ø¹Ø§ÙƒØ³Ø©.

Ø§Ù„Ø³Ù‚ÙˆØ· Ø§Ù„Ø­Ø±
Ø§Ù„Ø¬Ø³Ù… ÙÙŠ Ø³Ù‚ÙˆØ· Ø­Ø± Ù„Ø§ ÙŠØ®Ø¶Ø¹ Ø¥Ù„Ø§ Ù„Ø«Ù‚Ù„Ù‡ØŒ ÙˆØªØ³Ø§Ø±Ø¹Ù‡ g (â‰ˆ 9.8 Ù…/Ø«Ø§Â²) Ù…Ø³ØªÙ‚Ù„ Ø¹Ù† Ø§Ù„ÙƒØªÙ„Ø©:
Ø§Ù„Ø±ÙŠØ´Ø© ÙˆØ§Ù„ÙƒØ±ÙŠØ© ØªØ³Ù‚Ø·Ø§Ù† Ø¨Ù†ÙØ³ Ø§Ù„Ø·Ø±ÙŠÙ‚Ø© ÙÙŠ Ø§Ù„Ø®Ù„Ø§Ø¡.

Ø§Ù„Ø­Ø±ÙƒØ§Øª ÙÙŠ Ø­Ù‚Ù„ Ù…Ù†ØªØ¸Ù…
â€¢ Ø­Ù‚Ù„ Ø§Ù„Ø«Ù‚Ø§Ù„Ø©: Ù…Ø³Ø§Ø± Ù‚Ø°ÙŠÙØ© Ø¹Ù„Ù‰ Ø´ÙƒÙ„ Ù‚Ø·Ø¹ Ù…ÙƒØ§ÙØ¦.
â€¢ Ø­Ù‚Ù„ ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠ Ù…Ù†ØªØ¸Ù… (Ø¨ÙŠÙ† ØµÙÙŠØ­ØªÙŠÙ†): Ø§Ù†Ø­Ø±Ø§Ù Ø¬Ø³ÙŠÙ… Ù…Ø´Ø­ÙˆÙ†.

Ø§Ù„Ù…Ø¹Ø§Ù„Ù… ÙˆØ§Ù„Ù…Ø¹Ø§Ø¯Ù„Ø§Øª Ø§Ù„Ø²Ù…Ù†ÙŠØ©
Ù†ÙØ³Ù‚Ø· Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø«Ø§Ù†ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆØ± Ù„Ø¥ÙŠØ¬Ø§Ø¯ a Ø«Ù… v(t) Ùˆx(t) Ø¨Ø§Ù„ØªÙƒØ§Ù…Ù„ Ø§Ù†Ø·Ù„Ø§Ù‚Ù‹Ø§ Ù…Ù† Ø§Ù„Ø´Ø±ÙˆØ· Ø§Ù„Ø§Ø¨ØªØ¯Ø§Ø¦ÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'mecanique';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La deuxiÃ¨me loi de Newton s''Ã©critâ€¦', 'ÙŠÙÙƒØªØ¨ Ù‚Ø§Ù†ÙˆÙ† Ù†ÙŠÙˆØªÙ† Ø§Ù„Ø«Ø§Ù†ÙŠâ€¦',
   '["Î£F = mÂ·a","F = m/a","Î£F = a/m","F = m + a"]'::jsonb, '["Î£F = mÂ·a","F = m/a","Î£F = a/m","F = m + a"]'::jsonb,
   0, 'Somme des forces = masse Ã— accÃ©lÃ©ration.', 'Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ù‚ÙˆÙ‰ = Ø§Ù„ÙƒØªÙ„Ø© Ã— Ø§Ù„ØªØ³Ø§Ø±Ø¹.', 'easy', 1),
  ('En chute libre, l''accÃ©lÃ©ration d''un corpsâ€¦', 'ÙÙŠ Ø§Ù„Ø³Ù‚ÙˆØ· Ø§Ù„Ø­Ø±ØŒ ØªØ³Ø§Ø±Ø¹ Ø§Ù„Ø¬Ø³Ù…â€¦',
   '["ne dÃ©pend pas de sa masse","augmente avec la masse","est nulle","dÃ©pend de la couleur"]'::jsonb, '["Ù„Ø§ ÙŠØªØ¹Ù„Ù‚ Ø¨ÙƒØªÙ„ØªÙ‡","ÙŠØ²ÙŠØ¯ Ù…Ø¹ Ø§Ù„ÙƒØªÙ„Ø©","Ù…Ø¹Ø¯ÙˆÙ…","ÙŠØªØ¹Ù„Ù‚ Ø¨Ø§Ù„Ù„ÙˆÙ†"]'::jsonb,
   0, 'a = g, indÃ©pendante de la masse.', 'a = g Ù…Ø³ØªÙ‚Ù„ Ø¹Ù† Ø§Ù„ÙƒØªÙ„Ø©.', 'medium', 2),
  ('La trajectoire d''un projectile dans le champ de pesanteur estâ€¦', 'Ù…Ø³Ø§Ø± Ù‚Ø°ÙŠÙØ© ÙÙŠ Ø­Ù‚Ù„ Ø§Ù„Ø«Ù‚Ø§Ù„Ø©â€¦',
   '["parabolique","circulaire","rectiligne verticale toujours","hÃ©licoÃ¯dale"]'::jsonb, '["Ù‚Ø·Ø¹ Ù…ÙƒØ§ÙØ¦","Ø¯Ø§Ø¦Ø±ÙŠ","Ù…Ø³ØªÙ‚ÙŠÙ… Ø´Ø§Ù‚ÙˆÙ„ÙŠ Ø¯Ø§Ø¦Ù…Ù‹Ø§","Ø­Ù„Ø²ÙˆÙ†ÙŠ"]'::jsonb,
   0, 'Mouvement parabolique dans un champ uniforme.', 'Ø­Ø±ÙƒØ© Ø¹Ù„Ù‰ Ø´ÙƒÙ„ Ù‚Ø·Ø¹ Ù…ÙƒØ§ÙØ¦ ÙÙŠ Ø­Ù‚Ù„ Ù…Ù†ØªØ¸Ù….', 'medium', 3),
  ('Â« Action-rÃ©action Â» est laâ€¦ loi de Newton', 'Â«Ø§Ù„ÙØ¹Ù„ ÙˆØ±Ø¯ Ø§Ù„ÙØ¹Ù„Â» Ù‡Ùˆ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†â€¦ Ù„Ù†ÙŠÙˆØªÙ†',
   '["troisiÃ¨me","premiÃ¨re","deuxiÃ¨me","quatriÃ¨me"]'::jsonb, '["Ø§Ù„Ø«Ø§Ù„Ø«","Ø§Ù„Ø£ÙˆÙ„","Ø§Ù„Ø«Ø§Ù†ÙŠ","Ø§Ù„Ø±Ø§Ø¨Ø¹"]'::jsonb,
   0, '3áµ‰ loi : forces opposÃ©es entre A et B.', 'Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø«Ø§Ù„Ø«: Ù‚ÙˆØªØ§Ù† Ù…ØªØ¹Ø§ÙƒØ³ØªØ§Ù† Ø¨ÙŠÙ† A ÙˆB.', 'easy', 4),
  ('Un corps Â« pseudo-isolÃ© Â» a un mouvementâ€¦', 'Ø¬Ø³Ù… Ø´Ø¨Ù‡ Ù…Ø¹Ø²ÙˆÙ„ Ù„Ù‡ Ø­Ø±ÙƒØ©â€¦',
   '["rectiligne uniforme ou immobile","accÃ©lÃ©rÃ©","circulaire","imprÃ©visible"]'::jsonb, '["Ù…Ø³ØªÙ‚ÙŠÙ…Ø© Ù…Ù†ØªØ¸Ù…Ø© Ø£Ùˆ Ø³Ø§ÙƒÙ†","Ù…ØªØ³Ø§Ø±Ø¹Ø©","Ø¯Ø§Ø¦Ø±ÙŠØ©","ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹Ø©"]'::jsonb,
   0, '1Ê³áµ‰ loi : vitesse constante ou repos.', 'Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø§Ù„Ø£ÙˆÙ„: Ø³Ø±Ø¹Ø© Ø«Ø§Ø¨ØªØ© Ø£Ùˆ Ø³ÙƒÙˆÙ†.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'mecanique'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'TRANSFORMATIONS NUCLÃ‰AIRES

LE NOYAU ATOMIQUE
NotÃ© á´¬_Z X : Z = nombre de protons (numÃ©ro atomique), A = nombre de nuclÃ©ons
(protons + neutrons). Des isotopes ont le mÃªme Z mais des A diffÃ©rents.

LA RADIOACTIVITÃ‰
Certains noyaux instables se dÃ©sintÃ¨grent spontanÃ©ment en Ã©mettant un rayonnement :
â€¢ RadioactivitÃ© Î± : Ã©mission d''un noyau d''hÃ©lium â´â‚‚He.
â€¢ RadioactivitÃ© Î²â» : un neutron â†’ proton + Ã©lectron Ã©mis.
â€¢ RadioactivitÃ© Î²âº : un proton â†’ neutron + positon Ã©mis.
â€¢ Rayonnement Î³ : photon trÃ¨s Ã©nergÃ©tique accompagnant les prÃ©cÃ©dentes.

LOIS DE CONSERVATION (lois de Soddy)
Dans une rÃ©action nuclÃ©aire, on conserve A (nuclÃ©ons) et Z (charge) :
la somme des A et la somme des Z sont identiques avant et aprÃ¨s.

LA DÃ‰CROISSANCE RADIOACTIVE
N(t) = Nâ‚€ Â· e^(âˆ’Î»t), oÃ¹ Î» est la constante radioactive.
La DEMI-VIE tÂ½ = ln2 / Î» : durÃ©e au bout de laquelle la moitiÃ© des noyaux
s''est dÃ©sintÃ©grÃ©e. Application : datation (carbone 14).

Ã‰NERGIE : E = mÂ·cÂ² (Ã©quivalence masse-Ã©nergie d''Einstein). Fission et fusion
libÃ¨rent d''Ã©normes Ã©nergies.',
  lesson_ar = 'Ø§Ù„ØªØ­ÙˆÙ„Ø§Øª Ø§Ù„Ù†ÙˆÙˆÙŠØ©

Ø§Ù„Ù†ÙˆØ§Ø© Ø§Ù„Ø°Ø±ÙŠØ©
ØªÙØ±Ù…Ø² á´¬_Z X: Z Ø¹Ø¯Ø¯ Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙ†Ø§Øª (Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø°Ø±ÙŠ)ØŒ A Ø¹Ø¯Ø¯ Ø§Ù„Ù†ÙˆÙŠØ§Øª (Ø¨Ø±ÙˆØªÙˆÙ†Ø§Øª + Ù†ÙŠÙˆØªØ±ÙˆÙ†Ø§Øª).
Ø§Ù„Ù†Ø¸Ø§Ø¦Ø± Ù„Ù‡Ø§ Ù†ÙØ³ Z ÙˆØ£Ø¹Ø¯Ø§Ø¯ A Ù…Ø®ØªÙ„ÙØ©.

Ø§Ù„Ù†Ø´Ø§Ø· Ø§Ù„Ø¥Ø´Ø¹Ø§Ø¹ÙŠ
ØªØªÙÙƒÙƒ Ø¨Ø¹Ø¶ Ø§Ù„Ù†ÙˆÙ‰ ØºÙŠØ± Ø§Ù„Ù…Ø³ØªÙ‚Ø±Ø© ØªÙ„Ù‚Ø§Ø¦ÙŠÙ‹Ø§ Ø¨Ø¥ØµØ¯Ø§Ø± Ø¥Ø´Ø¹Ø§Ø¹:
â€¢ Ø¥Ø´Ø¹Ø§Ø¹ Î±: Ø¥ØµØ¯Ø§Ø± Ù†ÙˆØ§Ø© Ù‡ÙŠÙ„ÙŠÙˆÙ… â´â‚‚He.
â€¢ Ø¥Ø´Ø¹Ø§Ø¹ Î²â»: Ù†ÙŠÙˆØªØ±ÙˆÙ† â† Ø¨Ø±ÙˆØªÙˆÙ† + Ø¥Ù„ÙƒØªØ±ÙˆÙ†.
â€¢ Ø¥Ø´Ø¹Ø§Ø¹ Î²âº: Ø¨Ø±ÙˆØªÙˆÙ† â† Ù†ÙŠÙˆØªØ±ÙˆÙ† + Ø¨ÙˆØ²ÙŠØªØ±ÙˆÙ†.
â€¢ Ø¥Ø´Ø¹Ø§Ø¹ Î³: ÙÙˆØªÙˆÙ† Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø·Ø§Ù‚Ø© ÙŠØ±Ø§ÙÙ‚ Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©.

Ù‚ÙˆØ§Ù†ÙŠÙ† Ø§Ù„Ø§Ù†Ø­ÙØ§Ø¸ (Ù‚ÙˆØ§Ù†ÙŠÙ† ØµÙˆØ¯ÙŠ)
ÙŠÙ†Ø­ÙØ¸ A (Ø§Ù„Ù†ÙˆÙŠØ§Øª) ÙˆZ (Ø§Ù„Ø´Ø­Ù†Ø©) Ù‚Ø¨Ù„ Ø§Ù„ØªÙØ§Ø¹Ù„ ÙˆØ¨Ø¹Ø¯Ù‡.

Ø§Ù„ØªÙ†Ø§Ù‚Øµ Ø§Ù„Ø¥Ø´Ø¹Ø§Ø¹ÙŠ
N(t) = Nâ‚€ Â· e^(âˆ’Î»t) Ø­ÙŠØ« Î» Ø§Ù„Ø«Ø§Ø¨Øª Ø§Ù„Ø¥Ø´Ø¹Ø§Ø¹ÙŠ.
Ø¹Ù…Ø± Ø§Ù„Ù†ØµÙ tÂ½ = ln2 / Î». ØªØ·Ø¨ÙŠÙ‚: Ø§Ù„ØªØ£Ø±ÙŠØ® (Ø§Ù„ÙƒØ±Ø¨ÙˆÙ† 14).

Ø§Ù„Ø·Ø§Ù‚Ø©: E = mÂ·cÂ² (ØªÙƒØ§ÙØ¤ Ø§Ù„ÙƒØªÙ„Ø© ÙˆØ§Ù„Ø·Ø§Ù‚Ø©). Ø§Ù„Ø§Ù†Ø´Ø·Ø§Ø± ÙˆØ§Ù„Ø§Ù†Ø¯Ù…Ø§Ø¬ ÙŠØ­Ø±Ø±Ø§Ù† Ø·Ø§Ù‚Ø© Ù‡Ø§Ø¦Ù„Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'nucleaire';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans la notation á´¬_Z X, Z reprÃ©senteâ€¦', 'ÙÙŠ Ø§Ù„Ø±Ù…Ø² á´¬_Z XØŒ ÙŠÙ…Ø«Ù„ Zâ€¦',
   '["le nombre de protons","le nombre de neutrons","le nombre de nuclÃ©ons","la masse"]'::jsonb, '["Ø¹Ø¯Ø¯ Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙ†Ø§Øª","Ø¹Ø¯Ø¯ Ø§Ù„Ù†ÙŠÙˆØªØ±ÙˆÙ†Ø§Øª","Ø¹Ø¯Ø¯ Ø§Ù„Ù†ÙˆÙŠØ§Øª","Ø§Ù„ÙƒØªÙ„Ø©"]'::jsonb,
   0, 'Z = numÃ©ro atomique = nombre de protons.', 'Z Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø°Ø±ÙŠ = Ø¹Ø¯Ø¯ Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙ†Ø§Øª.', 'easy', 1),
  ('La radioactivitÃ© Î± correspond Ã  l''Ã©mission d''unâ€¦', 'ÙŠÙˆØ§ÙÙ‚ Ø§Ù„Ù†Ø´Ø§Ø· Î± Ø¥ØµØ¯Ø§Ø±â€¦',
   '["noyau d''hÃ©lium","Ã©lectron","photon seul","proton isolÃ©"]'::jsonb, '["Ù†ÙˆØ§Ø© Ù‡ÙŠÙ„ÙŠÙˆÙ…","Ø¥Ù„ÙƒØªØ±ÙˆÙ†","ÙÙˆØªÙˆÙ† ÙÙ‚Ø·","Ø¨Ø±ÙˆØªÙˆÙ† Ù…Ù†ÙØ±Ø¯"]'::jsonb,
   0, 'Particule Î± = noyau d''hÃ©lium â´â‚‚He.', 'Ø§Ù„Ø¬Ø³ÙŠÙ… Î± Ù†ÙˆØ§Ø© Ù‡ÙŠÙ„ÙŠÙˆÙ….', 'medium', 2),
  ('Lors d''une rÃ©action nuclÃ©aire, on conserveâ€¦', 'Ø£Ø«Ù†Ø§Ø¡ ØªÙØ§Ø¹Ù„ Ù†ÙˆÙˆÙŠØŒ ÙŠÙ†Ø­ÙØ¸â€¦',
   '["A et Z","la couleur","la tempÃ©rature","le volume"]'::jsonb, '["A Ùˆ Z","Ø§Ù„Ù„ÙˆÙ†","Ø§Ù„Ø­Ø±Ø§Ø±Ø©","Ø§Ù„Ø­Ø¬Ù…"]'::jsonb,
   0, 'Lois de Soddy : conservation de A et de Z.', 'Ù‚ÙˆØ§Ù†ÙŠÙ† ØµÙˆØ¯ÙŠ: Ø§Ù†Ø­ÙØ§Ø¸ A ÙˆZ.', 'medium', 3),
  ('La demi-vie tÂ½ est la durÃ©e pour dÃ©sintÃ©grerâ€¦ des noyaux', 'Ø¹Ù…Ø± Ø§Ù„Ù†ØµÙ tÂ½ Ù‡Ùˆ Ù…Ø¯Ø© ØªÙÙƒÙƒâ€¦ Ù…Ù† Ø§Ù„Ù†ÙˆÙ‰',
   '["la moitiÃ©","le quart","la totalitÃ©","le dixiÃ¨me"]'::jsonb, '["Ø§Ù„Ù†ØµÙ","Ø§Ù„Ø±Ø¨Ø¹","Ø§Ù„ÙƒÙ„","Ø§Ù„Ø¹ÙØ´Ø±"]'::jsonb,
   0, 'Ã€ tÂ½, la moitiÃ© des noyaux s''est dÃ©sintÃ©grÃ©e.', 'Ø¹Ù†Ø¯ tÂ½ ÙŠØªÙÙƒÙƒ Ù†ØµÙ Ø§Ù„Ù†ÙˆÙ‰.', 'easy', 4),
  ('La relation d''Einstein masse-Ã©nergie estâ€¦', 'Ø¹Ù„Ø§Ù‚Ø© Ø£ÙŠÙ†Ø´ØªØ§ÙŠÙ† Ø¨ÙŠÙ† Ø§Ù„ÙƒØªÙ„Ø© ÙˆØ§Ù„Ø·Ø§Ù‚Ø© Ù‡ÙŠâ€¦',
   '["E = mcÂ²","E = mc","E = m/cÂ²","E = mÂ²c"]'::jsonb, '["E = mcÂ²","E = mc","E = m/cÂ²","E = mÂ²c"]'::jsonb,
   0, 'E = mcÂ² relie masse et Ã©nergie.', 'E = mcÂ² ØªØ±Ø¨Ø· Ø§Ù„ÙƒØªÙ„Ø© Ø¨Ø§Ù„Ø·Ø§Ù‚Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'physique' and c.slug = 'nucleaire'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);


-- ===============================================================
-- Migration: 20260722_021_languages_lessons_quizzes
--
-- Bilingual lessons + quiz banks for the language chapters of the exam
-- years: 4AM FranÃ§ais + Anglais (BEM), 3AS FranÃ§ais + Anglais (BAC).
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- ================= 4AM FRANÃ‡AIS =================

update public.chapters c set
  lesson_fr = 'LE TEXTE ARGUMENTATIF

BUT : convaincre le lecteur d''une opinion (la THÃˆSE) Ã  l''aide d''ARGUMENTS
appuyÃ©s par des EXEMPLES.

LA STRUCTURE
1. Introduction : on prÃ©sente le thÃ¨me et la thÃ¨se (ce qu''on dÃ©fend).
2. DÃ©veloppement : un argument par paragraphe + un exemple concret.
3. Conclusion : on reformule la thÃ¨se et on Ã©largit.

LES CONNECTEURS LOGIQUES (essentiels au BEM)
â€¢ Addition : de plus, en outre, par ailleurs.
â€¢ Cause : car, parce que, puisque, en effet.
â€¢ ConsÃ©quence : donc, ainsi, c''est pourquoi, par consÃ©quent.
â€¢ Opposition : mais, cependant, pourtant, en revanche.
â€¢ Conclusion : enfin, en somme, pour conclure.

LE VOCABULAIRE DE L''OPINION
Je pense que, Ã  mon avis, il est certain que, il me semble queâ€¦

CONSEIL : chaque argument doit Ãªtre clair et suivi d''un exemple. Les
connecteurs guident le lecteur d''une idÃ©e Ã  l''autre.',
  lesson_ar = 'Ø§Ù„Ù†Øµ Ø§Ù„Ø­Ø¬Ø§Ø¬ÙŠ (Ø§Ù„Ø¥Ù‚Ù†Ø§Ø¹ÙŠ)

Ø§Ù„Ù‡Ø¯Ù: Ø¥Ù‚Ù†Ø§Ø¹ Ø§Ù„Ù‚Ø§Ø±Ø¦ Ø¨Ø±Ø£ÙŠ (Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©) Ø¨ÙˆØ§Ø³Ø·Ø© Ø­Ø¬Ø¬ Ù…Ø¯Ø¹ÙˆÙ…Ø© Ø¨Ø£Ù…Ø«Ù„Ø©.

Ø§Ù„Ø¨Ù†ÙŠØ©
1. Ø§Ù„Ù…Ù‚Ø¯Ù…Ø©: Ø¹Ø±Ø¶ Ø§Ù„Ù…ÙˆØ¶ÙˆØ¹ ÙˆØ§Ù„Ø£Ø·Ø±ÙˆØ­Ø©.
2. Ø§Ù„Ø¹Ø±Ø¶: Ø­Ø¬Ø© ÙÙŠ ÙƒÙ„ ÙÙ‚Ø±Ø© + Ù…Ø«Ø§Ù„ Ù…Ù„Ù…ÙˆØ³.
3. Ø§Ù„Ø®Ø§ØªÙ…Ø©: Ø¥Ø¹Ø§Ø¯Ø© ØµÙŠØ§ØºØ© Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© ÙˆØ§Ù„ØªÙˆØ³Ù‘Ø¹.

Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ù…Ù†Ø·Ù‚ÙŠØ© (Ø£Ø³Ø§Ø³ÙŠØ© ÙÙŠ Ø§Ù„Ø¨ÙŠÙ…)
â€¢ Ø§Ù„Ø¥Ø¶Ø§ÙØ©: de plus, en outre.
â€¢ Ø§Ù„Ø³Ø¨Ø¨: car, parce que, puisque.
â€¢ Ø§Ù„Ù†ØªÙŠØ¬Ø©: donc, ainsi, par consÃ©quent.
â€¢ Ø§Ù„Ù…Ø¹Ø§Ø±Ø¶Ø©: mais, cependant, pourtant.
â€¢ Ø§Ù„Ø®Ø§ØªÙ…Ø©: enfin, pour conclure.

Ù…ÙØ±Ø¯Ø§Øª Ø§Ù„Ø±Ø£ÙŠ
Je pense que, Ã  mon avis, il me semble queâ€¦

Ù†ØµÙŠØ­Ø©: ÙƒÙ„ Ø­Ø¬Ø© ÙˆØ§Ø¶Ø­Ø© ÙŠØªØ¨Ø¹Ù‡Ø§ Ù…Ø«Ø§Ù„ØŒ ÙˆØ§Ù„Ø±ÙˆØ§Ø¨Ø· ØªÙˆØ¬Ù‘Ù‡ Ø§Ù„Ù‚Ø§Ø±Ø¦.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'texte-argumentatif';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un texte argumentatif, la Â« thÃ¨se Â» estâ€¦', 'ÙÙŠ Ø§Ù„Ù†Øµ Ø§Ù„Ø­Ø¬Ø§Ø¬ÙŠØŒ Â«Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©Â» Ù‡ÙŠâ€¦',
   '["l''opinion dÃ©fendue","un exemple","un personnage","le titre"]'::jsonb, '["Ø§Ù„Ø±Ø£ÙŠ Ø§Ù„Ù…Ø¯Ø§ÙØ¹ Ø¹Ù†Ù‡","Ù…Ø«Ø§Ù„","Ø´Ø®ØµÙŠØ©","Ø§Ù„Ø¹Ù†ÙˆØ§Ù†"]'::jsonb,
   0, 'La thÃ¨se est l''idÃ©e que l''auteur veut faire admettre.', 'Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© Ù‡ÙŠ Ø§Ù„ÙÙƒØ±Ø© Ø§Ù„ØªÙŠ ÙŠØ±ÙŠØ¯ Ø§Ù„ÙƒØ§ØªØ¨ Ø¥Ø«Ø¨Ø§ØªÙ‡Ø§.', 'easy', 1),
  ('Quel connecteur exprime la CONSÃ‰QUENCE ?', 'Ø£ÙŠ Ø±Ø§Ø¨Ø· ÙŠØ¹Ø¨Ù‘Ø± Ø¹Ù† Ø§Ù„Ù†ØªÙŠØ¬Ø©ØŸ',
   '["donc","mais","car","de plus"]'::jsonb, '["donc","mais","car","de plus"]'::jsonb,
   0, 'Â« Donc Â» introduit une consÃ©quence.', 'Â«doncÂ» ÙŠÙ‚Ø¯Ù‘Ù… Ù†ØªÙŠØ¬Ø©.', 'medium', 2),
  ('Quel connecteur exprime l''OPPOSITION ?', 'Ø£ÙŠ Ø±Ø§Ø¨Ø· ÙŠØ¹Ø¨Ù‘Ø± Ø¹Ù† Ø§Ù„Ù…Ø¹Ø§Ø±Ø¶Ø©ØŸ',
   '["cependant","donc","ainsi","enfin"]'::jsonb, '["cependant","donc","ainsi","enfin"]'::jsonb,
   0, 'Â« Cependant Â» marque l''opposition.', 'Â«cependantÂ» ÙŠØ¯Ù„ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¹Ø§Ø±Ø¶Ø©.', 'medium', 3),
  ('Â« Ã€ mon avis, la lecture est essentielle Â» exprimeâ€¦', 'Â«Ã  mon avis, la lecture est essentielleÂ» ØªØ¹Ø¨Ù‘Ø± Ø¹Ù†â€¦',
   '["une opinion","un fait scientifique","une description","un dialogue"]'::jsonb, '["Ø±Ø£ÙŠ","Ø­Ù‚ÙŠÙ‚Ø© Ø¹Ù„Ù…ÙŠØ©","ÙˆØµÙ","Ø­ÙˆØ§Ø±"]'::jsonb,
   0, 'Â« Ã€ mon avis Â» introduit un point de vue.', 'Â«Ã  mon avisÂ» ØªÙ‚Ø¯Ù‘Ù… ÙˆØ¬Ù‡Ø© Ù†Ø¸Ø±.', 'easy', 4),
  ('Un bon argument doit Ãªtre suiviâ€¦', 'Ø§Ù„Ø­Ø¬Ø© Ø§Ù„Ø¬ÙŠØ¯Ø© ÙŠØ¬Ø¨ Ø£Ù† ÙŠØªØ¨Ø¹Ù‡Ø§â€¦',
   '["d''un exemple","d''une question","d''un titre","de rien"]'::jsonb, '["Ù…Ø«Ø§Ù„","Ø³Ø¤Ø§Ù„","Ø¹Ù†ÙˆØ§Ù†","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'L''exemple concret renforce l''argument.', 'Ø§Ù„Ù…Ø«Ø§Ù„ Ø§Ù„Ù…Ù„Ù…ÙˆØ³ ÙŠÙ‚ÙˆÙ‘ÙŠ Ø§Ù„Ø­Ø¬Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'texte-argumentatif'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'CONJUGAISON â€” LES TEMPS CLÃ‰S DU BEM

LE PRÃ‰SENT DE L''INDICATIF
Actions actuelles ou vÃ©ritÃ©s gÃ©nÃ©rales. Terminaisons du 1áµ‰Ê³ groupe :
-e, -es, -e, -ons, -ez, -ent (je parle, tu parles, il parleâ€¦).

LE PASSÃ‰ COMPOSÃ‰
Auxiliaire (Ãªtre ou avoir) au prÃ©sent + participe passÃ©.
Â« J''ai mangÃ© Â», Â« Il est parti Â».
Accord : avec Ãªtre â†’ accord avec le sujet (elle est partie).

L''IMPARFAIT
DÃ©cor, habitude, action qui dure dans le passÃ©.
Terminaisons : -ais, -ais, -ait, -ions, -iez, -aient (je parlaisâ€¦).

LE FUTUR SIMPLE
Action Ã  venir. -ai, -as, -a, -ons, -ez, -ont (je parleraiâ€¦).

LE CONDITIONNEL PRÃ‰SENT
Radical du futur + terminaisons de l''imparfait (je parleraisâ€¦).
Exprime le souhait, la politesse, l''hypothÃ¨se.

RÃˆGLE UTILE : imparfait pour le dÃ©cor, passÃ© composÃ© pour les actions
principales d''un rÃ©cit au passÃ©.',
  lesson_ar = 'Ø§Ù„ØªØµØ±ÙŠÙ â€” Ø£Ø²Ù…Ù†Ø© Ø£Ø³Ø§Ø³ÙŠØ© Ù„Ù„Ø¨ÙŠÙ…

Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ (le prÃ©sent)
Ø£ÙØ¹Ø§Ù„ Ø­Ø§Ù„ÙŠØ© Ø£Ùˆ Ø­Ù‚Ø§Ø¦Ù‚ Ø¹Ø§Ù…Ø©. Ù†Ù‡Ø§ÙŠØ§Øª Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰: -e, -es, -e, -ons, -ez, -ent.

Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ (passÃ© composÃ©)
Ù…Ø³Ø§Ø¹Ø¯ (Ãªtre Ø£Ùˆ avoir) ÙÙŠ Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„. Â«J''ai mangÃ©Â»ØŒ Â«Il est partiÂ».
Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© Ù…Ø¹ Ãªtre ØªÙƒÙˆÙ† Ù…Ø¹ Ø§Ù„ÙØ§Ø¹Ù„ (elle est partie).

Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù†Ø§Ù‚Øµ (imparfait)
Ø§Ù„ÙˆØµÙ ÙˆØ§Ù„Ø¹Ø§Ø¯Ø© ÙˆØ§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ø³ØªÙ…Ø± ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ: -ais, -ais, -ait, -ions, -iez, -aient.

Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø¨Ø³ÙŠØ· (futur simple)
ÙØ¹Ù„ Ù‚Ø§Ø¯Ù…: -ai, -as, -a, -ons, -ez, -ont.

Ø§Ù„Ø´Ø±Ø·ÙŠ Ø§Ù„Ø­Ø§Ø¶Ø± (conditionnel)
Ø¬Ø°Ø± Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ + Ù†Ù‡Ø§ÙŠØ§Øª Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù†Ø§Ù‚Øµ. ÙŠØ¹Ø¨Ù‘Ø± Ø¹Ù† Ø§Ù„Ø±ØºØ¨Ø© ÙˆØ§Ù„ØªØ£Ø¯Ø¨ ÙˆØ§Ù„Ø§ÙØªØ±Ø§Ø¶.

Ù‚Ø§Ø¹Ø¯Ø©: Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù†Ø§Ù‚Øµ Ù„Ù„ÙˆØµÙØŒ ÙˆØ§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ù„Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ÙÙŠ Ø§Ù„Ø³Ø±Ø¯.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'conjugaison';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Â« Hier, il ___ au marchÃ©. Â» (aller, passÃ© composÃ©)', 'Â«Hier, il ___ au marchÃ©.Â» (aller ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨)',
   '["est allÃ©","va","allait","ira"]'::jsonb, '["est allÃ©","va","allait","ira"]'::jsonb,
   0, 'PassÃ© composÃ© de aller : est allÃ© (auxiliaire Ãªtre).', 'Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ù„Ù€ aller: est allÃ©.', 'medium', 1),
  ('Quelle phrase est Ã  l''IMPARFAIT ?', 'Ø£ÙŠ Ø¬Ù…Ù„Ø© ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù†Ø§Ù‚ØµØŸ',
   '["Je jouais dans le jardin","J''ai jouÃ© hier","Je jouerai demain","Je joue maintenant"]'::jsonb, '["Je jouais dans le jardin","J''ai jouÃ© hier","Je jouerai demain","Je joue maintenant"]'::jsonb,
   0, 'Â« Jouais Â» est de l''imparfait.', 'Â«jouaisÂ» ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù†Ø§Ù‚Øµ.', 'medium', 2),
  ('Â« Demain, nous ___ le musÃ©e. Â» (visiter, futur)', 'Â«Demain, nous ___ le musÃ©e.Â» (visiter ÙÙŠ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„)',
   '["visiterons","visitons","visitions","avons visitÃ©"]'::jsonb, '["visiterons","visitons","visitions","avons visitÃ©"]'::jsonb,
   0, 'Futur simple : nous visiterons.', 'Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø¨Ø³ÙŠØ·: nous visiterons.', 'easy', 3),
  ('Au passÃ© composÃ© avec Â« Ãªtre Â», le participe s''accorde avecâ€¦', 'ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø¨ Ù…Ø¹ ÃªtreØŒ ÙŠØ·Ø§Ø¨Ù‚ Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„â€¦',
   '["le sujet","le complÃ©ment","le verbe","rien"]'::jsonb, '["Ø§Ù„ÙØ§Ø¹Ù„","Ø§Ù„Ù…ÙØ¹ÙˆÙ„","Ø§Ù„ÙØ¹Ù„","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'Avec Ãªtre : accord avec le sujet (elle est venue).', 'Ù…Ø¹ Ãªtre: Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© Ù…Ø¹ Ø§Ù„ÙØ§Ø¹Ù„.', 'easy', 4),
  ('Â« Je ___ un cafÃ©, s''il vous plaÃ®t. Â» (vouloir, politesse)', 'Â«Je ___ un cafÃ©, s''il vous plaÃ®t.Â» (vouloir Ù„Ù„ØªØ£Ø¯Ø¨)',
   '["voudrais","veux","voulais","voudrai"]'::jsonb, '["voudrais","veux","voulais","voudrai"]'::jsonb,
   0, 'Conditionnel de politesse : je voudrais.', 'Ø§Ù„Ø´Ø±Ø·ÙŠ Ù„Ù„ØªØ£Ø¯Ø¨: je voudrais.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'francais' and c.slug = 'conjugaison'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 4AM ANGLAIS =================

update public.chapters c set
  lesson_fr = 'PEOPLE AND EXPERIENCES â€” talking about the past

THE SIMPLE PAST
Used for finished actions in the past.
â€¢ Regular verbs: add -ed â†’ work â†’ worked, play â†’ played.
â€¢ Irregular verbs must be memorised: go â†’ went, see â†’ saw, have â†’ had,
  make â†’ made, take â†’ took, write â†’ wrote.
Negative: didn''t + base verb (She didn''t go).
Question: Did + subject + base verb? (Did you see it?)

TIME MARKERS
yesterday, last week, in 2010, two days ago, when I was young.

BIOGRAPHIES
To tell someone''s life story we use the simple past:
"He was born in 1930. He studied medicine. He became a doctor. He died in 2001."

PRONUNCIATION OF -ED
â€¢ /t/ after voiceless sounds: worked, watched.
â€¢ /d/ after voiced sounds: played, opened.
â€¢ /Éªd/ after t or d: wanted, needed.

REMEMBER: in questions and negatives, the past is carried by "did", so the
main verb goes back to its base form (NOT "Did you saw" but "Did you see").',
  lesson_ar = 'Ø§Ù„Ø£Ø´Ø®Ø§Øµ ÙˆØ§Ù„ØªØ¬Ø§Ø±Ø¨ â€” Ø§Ù„Ø­Ø¯ÙŠØ« Ø¹Ù† Ø§Ù„Ù…Ø§Ø¶ÙŠ

Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ· (Simple Past)
Ù„Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ù…Ù†ØªÙ‡ÙŠØ© ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ.
â€¢ Ø§Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ù…Ù†ØªØ¸Ù…Ø©: Ù†Ø¶ÙŠÙ -ed â† work â†’ worked.
â€¢ Ø§Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ø´Ø§Ø°Ø© ØªÙØ­ÙØ¸: go â†’ went, see â†’ saw, have â†’ had, take â†’ took.
Ø§Ù„Ù†ÙÙŠ: didn''t + Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ø¬Ø±Ø¯. Ø§Ù„Ø³Ø¤Ø§Ù„: Did + Ø§Ù„ÙØ§Ø¹Ù„ + Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ø¬Ø±Ø¯ØŸ

Ø¸Ø±ÙˆÙ Ø§Ù„Ø²Ù…Ù†: yesterday, last week, in 2010, two days ago.

Ø§Ù„Ø³ÙŠØ± Ø§Ù„Ø°Ø§ØªÙŠØ©: Ù†Ø³ØªØ¹Ù…Ù„ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ·:
"He was born in 1930. He studied medicine. He died in 2001."

Ù„ÙØ¸ -ed: /t/ Ø¨Ø¹Ø¯ Ø§Ù„Ø£ØµÙˆØ§Øª Ø§Ù„Ù…Ù‡Ù…ÙˆØ³Ø©ØŒ /d/ Ø¨Ø¹Ø¯ Ø§Ù„Ù…Ø¬Ù‡ÙˆØ±Ø©ØŒ /Éªd/ Ø¨Ø¹Ø¯ t Ø£Ùˆ d.

ØªØ°ÙƒÙ‘Ø±: ÙÙŠ Ø§Ù„Ø³Ø¤Ø§Ù„ ÙˆØ§Ù„Ù†ÙÙŠ ÙŠØ­Ù…Ù„ "did" Ø§Ù„Ø²Ù…Ù† ÙÙŠØ¹ÙˆØ¯ Ø§Ù„ÙØ¹Ù„ Ø¥Ù„Ù‰ ØµÙŠØºØªÙ‡ Ø§Ù„Ù…Ø¬Ø±Ø¯Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'people-experiences';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Choose the past simple: "She ___ to school yesterday."', 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ·: "She ___ to school yesterday."',
   '["went","goes","go","going"]'::jsonb, '["went","goes","go","going"]'::jsonb,
   0, '"Go" is irregular: past = went.', 'Ø§Ù„ÙØ¹Ù„ go Ø´Ø§Ø° ÙˆÙ…Ø§Ø¶ÙŠÙ‡ went.', 'easy', 1),
  ('Negative past: "They ___ finish the work."', 'Ø§Ù„Ù†ÙÙŠ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ: "They ___ finish the work."',
   '["didn''t","don''t","weren''t","haven''t"]'::jsonb, '["didn''t","don''t","weren''t","haven''t"]'::jsonb,
   0, 'Negative past = didn''t + base verb.', 'Ù†ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ = didn''t + Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ø¬Ø±Ø¯.', 'medium', 2),
  ('Which is correct?', 'Ø£ÙŠ Ø¬Ù…Ù„Ø© ØµØ­ÙŠØ­Ø©ØŸ',
   '["Did you see the film?","Did you saw the film?","Do you saw the film?","You did see?"]'::jsonb, '["Did you see the film?","Did you saw the film?","Do you saw the film?","You did see?"]'::jsonb,
   0, 'After "did", the verb stays in base form: see.', 'Ø¨Ø¹Ø¯ did ÙŠØ¨Ù‚Ù‰ Ø§Ù„ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯Ù‹Ø§: see.', 'medium', 3),
  ('Past of "write":', 'Ù…Ø§Ø¶ÙŠ Ø§Ù„ÙØ¹Ù„ write:',
   '["wrote","writed","written","writes"]'::jsonb, '["wrote","writed","written","writes"]'::jsonb,
   0, 'write â†’ wrote (irregular).', 'write â† wrote (Ø´Ø§Ø°).', 'easy', 4),
  ('The -ed in "wanted" is pronouncedâ€¦', 'ÙŠÙ†Ø·Ù‚ -ed ÙÙŠ "wanted"â€¦',
   '["/Éªd/","/t/","/d/","silent"]'::jsonb, '["/Éªd/","/t/","/d/","ØµØ§Ù…Øª"]'::jsonb,
   0, 'After t/d, -ed = /Éªd/.', 'Ø¨Ø¹Ø¯ t Ø£Ùˆ d ÙŠÙ†Ø·Ù‚ -ed Ù…Ø«Ù„ /Éªd/.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'people-experiences'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'GRAMMAR ESSENTIALS FOR THE BEM

PRESENT SIMPLE vs PRESENT CONTINUOUS
â€¢ Present simple: habits and facts. "She works every day." (add -s for he/she/it)
â€¢ Present continuous: action happening now. "She is working right now."

COMPARATIVES AND SUPERLATIVES
â€¢ Short adjectives: big â†’ bigger â†’ the biggest; tall â†’ taller â†’ the tallest.
â€¢ Long adjectives: important â†’ more important â†’ the most important.
â€¢ Irregular: good â†’ better â†’ the best; bad â†’ worse â†’ the worst.

CONDITIONAL TYPE 1 (real future)
If + present simple, â€¦ will + base verb.
"If it rains, we will stay home."

THE PASSIVE VOICE (introduction)
be + past participle. "Tea is grown in Asia." "The house was built in 1990."

MODALS
can (ability), must (obligation), should (advice), mustn''t (prohibition).
"You should revise." "You mustn''t cheat."

TIP: for comparatives, count the syllables â€” one syllable usually takes
-er/-est, long adjectives take more/most.',
  lesson_ar = 'Ø£Ø³Ø§Ø³ÙŠØ§Øª Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ù„Ù„Ø¨ÙŠÙ…

Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„Ø¨Ø³ÙŠØ· ÙˆØ§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„Ù…Ø³ØªÙ…Ø±
â€¢ Ø§Ù„Ø¨Ø³ÙŠØ·: Ø§Ù„Ø¹Ø§Ø¯Ø§Øª ÙˆØ§Ù„Ø­Ù‚Ø§Ø¦Ù‚ "She works every day" (Ù†Ø¶ÙŠÙ -s Ù„Ù„ØºØ§Ø¦Ø¨ Ø§Ù„Ù…ÙØ±Ø¯).
â€¢ Ø§Ù„Ù…Ø³ØªÙ…Ø±: ÙØ¹Ù„ ÙŠØ­Ø¯Ø« Ø§Ù„Ø¢Ù† "She is working right now".

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© ÙˆØ§Ù„ØªÙØ¶ÙŠÙ„
â€¢ Ø§Ù„ØµÙØ§Øª Ø§Ù„Ù‚ØµÙŠØ±Ø©: big â†’ bigger â†’ the biggest.
â€¢ Ø§Ù„ØµÙØ§Øª Ø§Ù„Ø·ÙˆÙŠÙ„Ø©: important â†’ more important â†’ the most important.
â€¢ Ø§Ù„Ø´Ø§Ø°Ø©: good â†’ better â†’ the best Ø› bad â†’ worse â†’ the worst.

Ø§Ù„Ø´Ø±Ø· Ø§Ù„Ù†ÙˆØ¹ Ø§Ù„Ø£ÙˆÙ„ (Ù…Ø³ØªÙ‚Ø¨Ù„ ÙˆØ§Ù‚Ø¹ÙŠ)
If + Ù…Ø¶Ø§Ø±Ø¹ Ø¨Ø³ÙŠØ·ØŒ â€¦ will + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯.
"If it rains, we will stay home."

Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„: be + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„. "The house was built in 1990."

Ø§Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ù†Ø§Ù‚ØµØ©: can (Ù‚Ø¯Ø±Ø©)ØŒ must (ÙˆØ¬ÙˆØ¨)ØŒ should (Ù†ØµØ­)ØŒ mustn''t (Ù…Ù†Ø¹).

Ù†ØµÙŠØ­Ø©: Ù„Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø¹ÙØ¯Ù‘ Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹ â€” Ø§Ù„Ù…Ù‚Ø·Ø¹ Ø§Ù„ÙˆØ§Ø­Ø¯ ÙŠØ£Ø®Ø° -er/-est ÙˆØ§Ù„Ø·ÙˆÙŠÙ„Ø© more/most.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'grammar';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Comparative of "big":', 'ØµÙŠØºØ© Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ù„Ù€ "big":',
   '["bigger","more big","biggest","biger"]'::jsonb, '["bigger","more big","biggest","biger"]'::jsonb,
   0, 'Short adjective: double the g â†’ bigger.', 'ØµÙØ© Ù‚ØµÙŠØ±Ø©: Ù†Ø¶Ø§Ø¹Ù g â† bigger.', 'easy', 1),
  ('"If it rains, we ___ at home." (conditional type 1)', '"If it rains, we ___ at home." (Ø´Ø±Ø· Ù†ÙˆØ¹ 1)',
   '["will stay","stayed","would stay","stay"]'::jsonb, '["will stay","stayed","would stay","stay"]'::jsonb,
   0, 'Type 1: if + present, will + base verb.', 'Ø§Ù„Ù†ÙˆØ¹ 1: if + Ù…Ø¶Ø§Ø±Ø¹ØŒ will + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯.', 'medium', 2),
  ('Choose the present continuous: "Look! The baby ___."', 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„Ù…Ø³ØªÙ…Ø±: "Look! The baby ___."',
   '["is sleeping","sleeps","slept","sleep"]'::jsonb, '["is sleeping","sleeps","slept","sleep"]'::jsonb,
   0, 'Action now â†’ is + verb-ing.', 'ÙØ¹Ù„ ÙŠØ­Ø¯Ø« Ø§Ù„Ø¢Ù† â† is + Ø§Ù„ÙØ¹Ù„-ing.', 'medium', 3),
  ('Superlative of "good":', 'ØµÙŠØºØ© Ø§Ù„ØªÙØ¶ÙŠÙ„ Ù„Ù€ "good":',
   '["the best","the goodest","the better","the most good"]'::jsonb, '["the best","the goodest","the better","the most good"]'::jsonb,
   0, 'Irregular: good â†’ better â†’ the best.', 'Ø´Ø§Ø°: good â†’ better â†’ the best.', 'easy', 4),
  ('Passive: "The house ___ in 1990."', 'Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„: "The house ___ in 1990."',
   '["was built","built","is building","builds"]'::jsonb, '["was built","built","is building","builds"]'::jsonb,
   0, 'Passive past = was + past participle (built).', 'Ø§Ù„Ù…Ø¬Ù‡ÙˆÙ„ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ = was + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AM' and s.slug = 'anglais' and c.slug = 'grammar'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS FRANÃ‡AIS (BAC) =================

update public.chapters c set
  lesson_fr = 'LE DÃ‰BAT D''IDÃ‰ES (argumentation au BAC)

LE PRINCIPE
Deux thÃ¨ses s''opposent sur une question. L''auteur dÃ©fend l''une (la THÃˆSE)
et rÃ©fute l''autre (l''ANTITHÃˆSE), souvent en concÃ©dant un point avant de
mieux le dÃ©passer.

THÃˆSE, ANTITHÃˆSE, SYNTHÃˆSE
â€¢ ThÃ¨se : l''opinion dÃ©fendue.
â€¢ AntithÃ¨se : l''opinion adverse.
â€¢ SynthÃ¨se : un dÃ©passement qui articule les deux (plan dialectique).

LA CONCESSION ET LA RÃ‰FUTATION
â€¢ ConcÃ©der : reconnaÃ®tre une part de vÃ©ritÃ© Ã  l''adversaire
  (Â« Certesâ€¦, il est vrai queâ€¦ Â»).
â€¢ RÃ©futer : montrer ensuite les limites de cette thÃ¨se
  (Â« â€¦ mais, cependant, en rÃ©alitÃ©â€¦ Â»).

LES OUTILS DE L''ARGUMENTATION
â€¢ Connecteurs logiques (cause, consÃ©quence, opposition, concession).
â€¢ Modalisateurs : marques du jugement (il est indÃ©niable, sans doute,
  peut-Ãªtre, il semble queâ€¦).
â€¢ Types d''arguments : logique, d''autoritÃ© (citation d''expert), par
  l''exemple, par analogie.

MÃ‰THODE BAC : dÃ©gager la thÃ¨se dÃ©fendue, repÃ©rer les arguments et les
connecteurs, distinguer concession et rÃ©futation.',
  lesson_ar = 'Ù…Ù†Ø§Ù‚Ø´Ø© Ø§Ù„Ø£ÙÙƒØ§Ø± (Ø§Ù„Ø­Ø¬Ø§Ø¬ ÙÙŠ Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§)

Ø§Ù„Ù…Ø¨Ø¯Ø£
ØªØªØ¹Ø§Ø±Ø¶ Ø£Ø·Ø±ÙˆØ­ØªØ§Ù† Ø­ÙˆÙ„ Ù…Ø³Ø£Ù„Ø©. ÙŠØ¯Ø§ÙØ¹ Ø§Ù„ÙƒØ§ØªØ¨ Ø¹Ù† Ø¥Ø­Ø¯Ø§Ù‡Ù…Ø§ (Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©) ÙˆÙŠØ¯Ø­Ø¶ Ø§Ù„Ø£Ø®Ø±Ù‰
(Ù†Ù‚ÙŠØ¶ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©)ØŒ ØºØ§Ù„Ø¨Ù‹Ø§ Ø¨Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø¨Ù†Ù‚Ø·Ø© Ù‚Ø¨Ù„ ØªØ¬Ø§ÙˆØ²Ù‡Ø§.

Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©ØŒ Ù†Ù‚ÙŠØ¶Ù‡Ø§ØŒ Ø§Ù„ØªØ±ÙƒÙŠØ¨
â€¢ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©: Ø§Ù„Ø±Ø£ÙŠ Ø§Ù„Ù…Ø¯Ø§ÙØ¹ Ø¹Ù†Ù‡.
â€¢ Ø§Ù„Ù†Ù‚ÙŠØ¶: Ø§Ù„Ø±Ø£ÙŠ Ø§Ù„Ù…Ø¶Ø§Ø¯.
â€¢ Ø§Ù„ØªØ±ÙƒÙŠØ¨: ØªØ¬Ø§ÙˆØ² ÙŠØ¬Ù…Ø¹ Ø¨ÙŠÙ†Ù‡Ù…Ø§ (Ø§Ù„Ø®Ø·Ø© Ø§Ù„Ø¬Ø¯Ù„ÙŠØ©).

Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙˆØ§Ù„Ø¯Ø­Ø¶
â€¢ Ø§Ù„ØªØ³Ù„ÙŠÙ…: Ø§Ù„Ø§Ø¹ØªØ±Ø§Ù Ø¨Ø¬Ø²Ø¡ Ù…Ù† Ø§Ù„Ø­Ù‚ Ù„Ù„Ø®ØµÙ… (Certesâ€¦, il est vrai queâ€¦).
â€¢ Ø§Ù„Ø¯Ø­Ø¶: Ø¥Ø¸Ù‡Ø§Ø± Ø­Ø¯ÙˆØ¯ ØªÙ„Ùƒ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© (mais, cependant, en rÃ©alitÃ©â€¦).

Ø£Ø¯ÙˆØ§Øª Ø§Ù„Ø­Ø¬Ø§Ø¬
â€¢ Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ù…Ù†Ø·Ù‚ÙŠØ©. â€¢ Ø§Ù„Ù…ÙØ­ÙŠÙ‘Ù†Ø§Øª (dites modalisateurs): Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„Ø­ÙƒÙ….
â€¢ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø­Ø¬Ø¬: Ù…Ù†Ø·Ù‚ÙŠØ©ØŒ Ø­Ø¬Ø© Ø§Ù„Ø³Ù„Ø·Ø© (Ø§Ù‚ØªØ¨Ø§Ø³ Ø®Ø¨ÙŠØ±)ØŒ Ø¨Ø§Ù„Ù…Ø«Ø§Ù„ØŒ Ø¨Ø§Ù„Ù…Ù…Ø§Ø«Ù„Ø©.

Ù…Ù†Ù‡Ø¬ÙŠØ© Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§: Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø©ØŒ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø­Ø¬Ø¬ ÙˆØ§Ù„Ø±ÙˆØ§Ø¨Ø·ØŒ Ø§Ù„ØªÙ…ÙŠÙŠØ² Ø¨ÙŠÙ† Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙˆØ§Ù„Ø¯Ø­Ø¶.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'francais' and c.slug = 'debat-idees';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans un dÃ©bat d''idÃ©es, l''antithÃ¨se estâ€¦', 'ÙÙŠ Ù…Ù†Ø§Ù‚Ø´Ø© Ø§Ù„Ø£ÙÙƒØ§Ø±ØŒ Ù†Ù‚ÙŠØ¶ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© Ù‡Ùˆâ€¦',
   '["l''opinion adverse","l''opinion dÃ©fendue","un exemple","la conclusion"]'::jsonb, '["Ø§Ù„Ø±Ø£ÙŠ Ø§Ù„Ù…Ø¶Ø§Ø¯","Ø§Ù„Ø±Ø£ÙŠ Ø§Ù„Ù…Ø¯Ø§ÙØ¹ Ø¹Ù†Ù‡","Ù…Ø«Ø§Ù„","Ø§Ù„Ø®Ø§ØªÙ…Ø©"]'::jsonb,
   0, 'L''antithÃ¨se est la thÃ¨se opposÃ©e.', 'Ø§Ù„Ù†Ù‚ÙŠØ¶ Ù‡Ùˆ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© Ø§Ù„Ù…Ø¶Ø§Ø¯Ø©.', 'easy', 1),
  ('Â« Certesâ€¦, il est vrai queâ€¦ Â» introduitâ€¦', 'Â«Certesâ€¦, il est vrai queâ€¦Â» ØªÙ‚Ø¯Ù‘Ù…â€¦',
   '["une concession","une rÃ©futation totale","un exemple","une description"]'::jsonb, '["ØªØ³Ù„ÙŠÙ…Ù‹Ø§","Ø¯Ø­Ø¶Ù‹Ø§ ÙƒØ§Ù…Ù„Ø§Ù‹","Ù…Ø«Ø§Ù„Ø§Ù‹","ÙˆØµÙÙ‹Ø§"]'::jsonb,
   0, 'On concÃ¨de avant de nuancer.', 'Ù†ÙØ³Ù„Ù‘Ù… Ù‚Ø¨Ù„ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„.', 'medium', 2),
  ('Citer un expert reconnu est un argumentâ€¦', 'Ø§Ù‚ØªØ¨Ø§Ø³ Ø®Ø¨ÙŠØ± Ù…Ø¹ØªØ±Ù Ø¨Ù‡ Ø­Ø¬Ø©â€¦',
   '["d''autoritÃ©","par l''exemple","logique","par analogie"]'::jsonb, '["Ø§Ù„Ø³Ù„Ø·Ø©","Ø¨Ø§Ù„Ù…Ø«Ø§Ù„","Ù…Ù†Ø·Ù‚ÙŠØ©","Ø¨Ø§Ù„Ù…Ù…Ø§Ø«Ù„Ø©"]'::jsonb,
   0, 'Argument d''autoritÃ© = appui sur une rÃ©fÃ©rence.', 'Ø­Ø¬Ø© Ø§Ù„Ø³Ù„Ø·Ø© = Ø§Ù„Ø§Ø³ØªÙ†Ø§Ø¯ Ø¥Ù„Ù‰ Ù…Ø±Ø¬Ø¹.', 'medium', 3),
  ('Â« Cependant Â» et Â« en revanche Â» exprimentâ€¦', 'Â«cependantÂ» ÙˆÂ«en revancheÂ» ØªØ¹Ø¨Ù‘Ø±Ø§Ù† Ø¹Ù†â€¦',
   '["l''opposition","l''addition","la cause","le temps"]'::jsonb, '["Ø§Ù„Ù…Ø¹Ø§Ø±Ø¶Ø©","Ø§Ù„Ø¥Ø¶Ø§ÙØ©","Ø§Ù„Ø³Ø¨Ø¨","Ø§Ù„Ø²Ù…Ù†"]'::jsonb,
   0, 'Connecteurs d''opposition.', 'Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ù…Ø¹Ø§Ø±Ø¶Ø©.', 'easy', 4),
  ('Le plan Â« thÃ¨se / antithÃ¨se / synthÃ¨se Â» est ditâ€¦', 'Ø®Ø·Ø© Â«Ø£Ø·Ø±ÙˆØ­Ø© / Ù†Ù‚ÙŠØ¶ / ØªØ±ÙƒÙŠØ¨Â» ØªÙØ³Ù…Ù‰â€¦',
   '["dialectique","chronologique","descriptif","narratif"]'::jsonb, '["Ø¬Ø¯Ù„ÙŠØ©","Ø²Ù…Ù†ÙŠØ©","ÙˆØµÙÙŠØ©","Ø³Ø±Ø¯ÙŠØ©"]'::jsonb,
   0, 'C''est le plan dialectique.', 'Ø¥Ù†Ù‡Ø§ Ø§Ù„Ø®Ø·Ø© Ø§Ù„Ø¬Ø¯Ù„ÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'francais' and c.slug = 'debat-idees'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 3AS ANGLAIS (BAC) =================

update public.chapters c set
  lesson_fr = 'ETHICS IN BUSINESS (BAC unit)

KEY VOCABULARY
corruption, bribery (soudoyer), fraud, counterfeiting (contrefaÃ§on),
embezzlement (dÃ©tournement), transparency, accountability, honesty, integrity.

REPORTED SPEECH (a BAC favourite)
Direct: He said, "I work hard."
Reported: He said (that) he worked hard. (present â†’ past)
â€¢ "will" â†’ "would", "can" â†’ "could", "must" â†’ "had to".
â€¢ Time words shift: now â†’ then, today â†’ that day, tomorrow â†’ the next day.

THE PASSIVE (formal, common in reports)
"Bribes were offered." "New laws have been introduced to fight corruption."

EXPRESSING OBLIGATION AND PROHIBITION
â€¢ must / have to â†’ obligation. "Companies must respect the law."
â€¢ mustn''t â†’ prohibition. "Employees mustn''t accept bribes."
â€¢ should / ought to â†’ advice.

LINKING WORDS FOR ESSAYS
however, therefore, moreover, on the other hand, as a result, in conclusion.

EXAM TIP: in reported speech, move the tense "one step back" and change the
pronouns and time markers accordingly.',
  lesson_ar = 'Ø£Ø®Ù„Ø§Ù‚ÙŠØ§Øª Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ (ÙˆØ­Ø¯Ø© Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§)

Ù…ÙØ±Ø¯Ø§Øª Ø£Ø³Ø§Ø³ÙŠØ©
corruption (ÙØ³Ø§Ø¯)ØŒ bribery (Ø±Ø´ÙˆØ©)ØŒ fraud (Ø§Ø­ØªÙŠØ§Ù„)ØŒ counterfeiting (ØªØ²ÙˆÙŠØ±)ØŒ
transparency (Ø´ÙØ§ÙÙŠØ©)ØŒ accountability (Ù…Ø³Ø§Ø¡Ù„Ø©)ØŒ integrity (Ù†Ø²Ø§Ù‡Ø©).

Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ù…Ù†Ù‚ÙˆÙ„ (Reported Speech) â€” Ù…ÙØ¶Ù‘Ù„ ÙÙŠ Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§
Ù…Ø¨Ø§Ø´Ø±: He said, "I work hard."
Ù…Ù†Ù‚ÙˆÙ„: He said that he worked hard (Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ â† Ø§Ù„Ù…Ø§Ø¶ÙŠ).
â€¢ will â† would Ø› can â† could Ø› must â† had to.
â€¢ Ø¸Ø±ÙˆÙ Ø§Ù„Ø²Ù…Ù† ØªØªØºÙŠØ±: now â† then, tomorrow â† the next day.

Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ (Ø±Ø³Ù…ÙŠØŒ Ø´Ø§Ø¦Ø¹ ÙÙŠ Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ±)
"Bribes were offered." "New laws have been introduced."

Ø§Ù„ÙˆØ¬ÙˆØ¨ ÙˆØ§Ù„Ù…Ù†Ø¹
â€¢ must / have to (ÙˆØ¬ÙˆØ¨) Ø› mustn''t (Ù…Ù†Ø¹) Ø› should (Ù†ØµØ­).

Ø±ÙˆØ§Ø¨Ø· Ù„Ù„Ù…Ù‚Ø§Ù„: however, therefore, moreover, on the other hand, in conclusion.

Ù†ØµÙŠØ­Ø© Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†: ÙÙŠ Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ù…Ù†Ù‚ÙˆÙ„ Ø£Ø±Ø¬Ø¹ Ø§Ù„Ø²Ù…Ù† Ø®Ø·ÙˆØ© Ù„Ù„ÙˆØ±Ø§Ø¡ ÙˆØºÙŠÙ‘Ø± Ø§Ù„Ø¶Ù…Ø§Ø¦Ø± ÙˆØ¸Ø±ÙˆÙ Ø§Ù„Ø²Ù…Ù†.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'ethics';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Reported speech: He said, "I am tired." â†’', 'Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ù…Ù†Ù‚ÙˆÙ„: He said, "I am tired." â†',
   '["He said he was tired.","He said he is tired.","He says he was tired.","He said I am tired."]'::jsonb, '["He said he was tired.","He said he is tired.","He says he was tired.","He said I am tired."]'::jsonb,
   0, 'Present "am" â†’ past "was".', 'Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ am â† Ø§Ù„Ù…Ø§Ø¶ÙŠ was.', 'medium', 1),
  ('"Employees ___ accept bribes." (prohibition)', '"Employees ___ accept bribes." (Ù…Ù†Ø¹)',
   '["mustn''t","must","should","can"]'::jsonb, '["mustn''t","must","should","can"]'::jsonb,
   0, '"mustn''t" expresses prohibition.', 'Â«mustn''tÂ» ØªØ¹Ø¨Ù‘Ø± Ø¹Ù† Ø§Ù„Ù…Ù†Ø¹.', 'medium', 2),
  ('Which word means "contrefaÃ§on"?', 'Ø£ÙŠ ÙƒÙ„Ù…Ø© ØªØ¹Ù†ÙŠ Â«Ø§Ù„ØªØ²ÙˆÙŠØ±/Ø§Ù„ØªÙ‚Ù„ÙŠØ¯Â»ØŸ',
   '["counterfeiting","transparency","honesty","accountability"]'::jsonb, '["counterfeiting","transparency","honesty","accountability"]'::jsonb,
   0, 'Counterfeiting = faire de fausses copies.', 'counterfeiting = ØµÙ†Ø¹ Ù†Ø³Ø® Ù…Ø²ÙŠÙ‘ÙØ©.', 'easy', 3),
  ('In reported speech, "will" becomesâ€¦', 'ÙÙŠ Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ù…Ù†Ù‚ÙˆÙ„ ØªØµØ¨Ø­ "will"â€¦',
   '["would","would have","will","can"]'::jsonb, '["would","would have","will","can"]'::jsonb,
   0, '"will" â†’ "would".', 'Â«willÂ» â† Â«wouldÂ».', 'easy', 4),
  ('Passive: "New laws ___ to fight corruption."', 'Ø§Ù„Ù…Ø¬Ù‡ÙˆÙ„: "New laws ___ to fight corruption."',
   '["have been introduced","have introduced","introduces","are introducing"]'::jsonb, '["have been introduced","have introduced","introduces","are introducing"]'::jsonb,
   0, 'Passive present perfect = have been + past participle.', 'Ø§Ù„Ù…Ø¬Ù‡ÙˆÙ„ ÙÙŠ Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… = have been + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'ethics'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'ASTRONOMY AND THE SOLAR SYSTEM (BAC unit)

KEY VOCABULARY
the solar system, planet, orbit, gravity, satellite, telescope, galaxy,
astronaut, spacecraft, to explore, to launch, to orbit, weightlessness.

THE FUTURE AND PREDICTIONS
â€¢ will + base verb: predictions. "Humans will live on Mars one day."
â€¢ be going to: plans/evidence. "They are going to launch a rocket."
â€¢ may / might: possibility. "Life might exist on other planets."

THE PRESENT PERFECT (experience and results)
have/has + past participle. "Scientists have discovered new planets."
Used with: ever, never, already, yet, just, since, for.
"Humans have explored space since 1961."

RELATIVE CLAUSES (to define things)
who (people), which/that (things), where (places).
"The telescope which was launched in 1990 sent amazing images."

CONDITIONALS FOR HYPOTHESES (type 2)
If + past, would + base verb.
"If we found water, life would be possible."

EXAM TIP: present perfect links the past to now (result), simple past is a
finished moment. "Has landed" (result) vs "landed in 1969" (finished date).',
  lesson_ar = 'Ø¹Ù„Ù… Ø§Ù„ÙÙ„Ùƒ ÙˆØ§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ø´Ù…Ø³ÙŠØ© (ÙˆØ­Ø¯Ø© Ø§Ù„Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠØ§)

Ù…ÙØ±Ø¯Ø§Øª Ø£Ø³Ø§Ø³ÙŠØ©
the solar system (Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ø´Ù…Ø³ÙŠØ©)ØŒ planet (ÙƒÙˆÙƒØ¨)ØŒ orbit (Ù…Ø¯Ø§Ø±)ØŒ
gravity (Ø¬Ø§Ø°Ø¨ÙŠØ©)ØŒ galaxy (Ù…Ø¬Ø±Ù‘Ø©)ØŒ astronaut (Ø±Ø§Ø¦Ø¯ ÙØ¶Ø§Ø¡)ØŒ to launch (ÙŠØ·Ù„Ù‚).

Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ ÙˆØ§Ù„ØªÙ†Ø¨Ø¤Ø§Øª
â€¢ will + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯: ØªÙ†Ø¨Ø¤. "Humans will live on Mars."
â€¢ be going to: Ø®Ø·Ø©/Ø¯Ù„ÙŠÙ„. "They are going to launch a rocket."
â€¢ may / might: Ø§Ø­ØªÙ…Ø§Ù„. "Life might exist on other planets."

Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… (ØªØ¬Ø±Ø¨Ø© ÙˆÙ†ØªÙŠØ¬Ø©)
have/has + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„. "Scientists have discovered new planets."
Ù…Ø¹: ever, never, already, yet, just, since, for.

Ø§Ù„Ø¬Ù…Ù„ Ø§Ù„ÙˆØµÙ„ÙŠØ©
who (Ø£Ø´Ø®Ø§Øµ)ØŒ which/that (Ø£Ø´ÙŠØ§Ø¡)ØŒ where (Ø£Ù…Ø§ÙƒÙ†).

Ø§Ù„Ø´Ø±Ø· Ø§Ù„Ù†ÙˆØ¹ Ø§Ù„Ø«Ø§Ù†ÙŠ (Ø§ÙØªØ±Ø§Ø¶)
If + Ù…Ø§Ø¶ÙØŒ would + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯. "If we found water, life would be possible."

Ù†ØµÙŠØ­Ø©: Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… ÙŠØ±Ø¨Ø· Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø¨Ø§Ù„Ø­Ø§Ø¶Ø± (Ù†ØªÙŠØ¬Ø©)ØŒ ÙˆØ§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ· Ù„Ø­Ø¸Ø© Ù…Ù†ØªÙ‡ÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'astronomy';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Present perfect: "Scientists ___ new planets."', 'Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù…: "Scientists ___ new planets."',
   '["have discovered","discovered","discovers","are discovering"]'::jsonb, '["have discovered","discovered","discovers","are discovering"]'::jsonb,
   0, 'have + past participle (discovered).', 'have + Ø§Ø³Ù… Ø§Ù„Ù…ÙØ¹ÙˆÙ„ (discovered).', 'medium', 1),
  ('Prediction: "Humans ___ on Mars one day."', 'ØªÙ†Ø¨Ø¤: "Humans ___ on Mars one day."',
   '["will live","lived","have lived","live"]'::jsonb, '["will live","lived","have lived","live"]'::jsonb,
   0, '"will + base verb" for predictions.', 'Â«will + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯Â» Ù„Ù„ØªÙ†Ø¨Ø¤.', 'easy', 2),
  ('Relative clause: "The rocket ___ was launched exploded."', 'Ø¬Ù…Ù„Ø© ÙˆØµÙ„ÙŠØ©: "The rocket ___ was launched exploded."',
   '["which","who","where","when"]'::jsonb, '["which","who","where","when"]'::jsonb,
   0, '"which" refers to things.', 'Â«whichÂ» ØªØ¹ÙˆØ¯ Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø´ÙŠØ§Ø¡.', 'medium', 3),
  ('Which word means "Ù…Ø¯Ø§Ø±"?', 'Ø£ÙŠ ÙƒÙ„Ù…Ø© ØªØ¹Ù†ÙŠ Â«Ù…Ø¯Ø§Ø±Â»ØŸ',
   '["orbit","gravity","galaxy","satellite"]'::jsonb, '["orbit","gravity","galaxy","satellite"]'::jsonb,
   0, 'Orbit = the path around a planet/star.', 'orbit = Ø§Ù„Ù…Ø³Ø§Ø± Ø­ÙˆÙ„ ÙƒÙˆÙƒØ¨ Ø£Ùˆ Ù†Ø¬Ù….', 'easy', 4),
  ('Type 2 conditional: "If we ___ water, life would be possible."', 'Ø§Ù„Ø´Ø±Ø· Ù†ÙˆØ¹ 2: "If we ___ water, life would be possible."',
   '["found","find","will find","have found"]'::jsonb, '["found","find","will find","have found"]'::jsonb,
   0, 'Type 2: if + past, would + base verb.', 'Ø§Ù„Ù†ÙˆØ¹ 2: if + Ù…Ø§Ø¶ÙØŒ would + ÙØ¹Ù„ Ù…Ø¬Ø±Ø¯.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AS' and s.slug = 'anglais' and c.slug = 'astronomy'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);


-- ===============================================================
-- Migration: 20260722_022_college_1am_2am_maths
--
-- Bilingual lessons + 5-question quiz banks for every 1AM and 2AM maths
-- chapter (chapters seeded in migration 017). Fills the non-exam college
-- years so younger students get the full lessonâ†’quiz experience.
-- Idempotent: guarded UPDATEs and NOT EXISTS inserts.
-- ===============================================================

-- ================= 1AM MATHÃ‰MATIQUES =================

update public.chapters c set
  lesson_fr = 'NOMBRES ENTIERS ET DÃ‰CIMAUX

LES ENTIERS NATURELS
0, 1, 2, 3â€¦ servent Ã  compter. On les lit par classes de 3 chiffres
(unitÃ©s, mille, million).

LES NOMBRES DÃ‰CIMAUX
Un nombre dÃ©cimal a une partie entiÃ¨re et une partie dÃ©cimale sÃ©parÃ©es par
une virgule : 12,45. Le premier chiffre aprÃ¨s la virgule = les dixiÃ¨mes,
le deuxiÃ¨me = les centiÃ¨mes, le troisiÃ¨me = les milliÃ¨mes.

COMPARER
On compare d''abord la partie entiÃ¨re, puis chiffre par chiffre aprÃ¨s la
virgule. Attention : 3,5 = 3,50 (les zÃ©ros Ã  droite ne changent rien).
3,45 < 3,5 car 4 dixiÃ¨mes < 5 dixiÃ¨mes.

REPÃ‰RAGE SUR UNE DEMI-DROITE GRADUÃ‰E
Chaque nombre a une position (abscisse) sur la droite graduÃ©e.

Ã€ RETENIR : la virgule sÃ©pare les unitÃ©s des dixiÃ¨mes. Bien lire le rang
de chaque chiffre.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ© ÙˆØ§Ù„Ø¹Ø´Ø±ÙŠØ©

Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ©
0ØŒ 1ØŒ 2ØŒ 3â€¦ ØªÙØ³ØªØ¹Ù…Ù„ Ù„Ù„Ø¹Ø¯Ù‘ØŒ ÙˆØªÙÙ‚Ø±Ø£ Ø¨Ø£Ù‚Ø³Ø§Ù… Ù…Ù† Ø«Ù„Ø§Ø«Ø© Ø£Ø±Ù‚Ø§Ù… (ÙˆØ­Ø¯Ø§ØªØŒ Ø¢Ù„Ø§ÙØŒ Ù…Ù„Ø§ÙŠÙŠÙ†).

Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠØ©
Ù„Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠ Ø¬Ø²Ø¡ ØµØ­ÙŠØ­ ÙˆØ¬Ø²Ø¡ Ø¹Ø´Ø±ÙŠ ØªÙØµÙ„ Ø¨ÙŠÙ†Ù‡Ù…Ø§ ÙØ§ØµÙ„Ø©: 12.45. Ø£ÙˆÙ„ Ø±Ù‚Ù… Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø©
Ù‡Ùˆ Ø§Ù„Ø£Ø¹Ø´Ø§Ø±ØŒ ÙˆØ§Ù„Ø«Ø§Ù†ÙŠ Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø©ØŒ ÙˆØ§Ù„Ø«Ø§Ù„Ø« Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ø£Ù„Ù.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØµØ­ÙŠØ­ Ø£ÙˆÙ„Ø§Ù‹ Ø«Ù… Ø±Ù‚Ù…Ù‹Ø§ Ø±Ù‚Ù…Ù‹Ø§ Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø©. Ù…Ù„Ø§Ø­Ø¸Ø©: 3.5 = 3.50.
3.45 < 3.5 Ù„Ø£Ù† 4 Ø£Ø¹Ø´Ø§Ø± < 5 Ø£Ø¹Ø´Ø§Ø±.

Ø§Ù„ØªÙˆÙ‚ÙŠØ¹ Ø¹Ù„Ù‰ Ù…Ø³ØªÙ‚ÙŠÙ… Ù…Ø¯Ø±Ù‘Ø¬
Ù„ÙƒÙ„ Ø¹Ø¯Ø¯ Ù…ÙˆØ¶Ø¹ (ÙØ§ØµÙ„Ø©) Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ø§Ù„Ù…Ø¯Ø±Ù‘Ø¬.

ØªØ°ÙƒØ±: Ø§Ù„ÙØ§ØµÙ„Ø© ØªÙØµÙ„ Ø§Ù„ÙˆØ­Ø¯Ø§Øª Ø¹Ù† Ø§Ù„Ø£Ø¹Ø´Ø§Ø±.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'entiers-decimaux';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 34,72 le chiffre 7 reprÃ©senteâ€¦', 'ÙÙŠ 34.72 ÙŠÙ…Ø«Ù„ Ø§Ù„Ø±Ù‚Ù… 7â€¦',
   '["7 dixiÃ¨mes","7 unitÃ©s","7 centiÃ¨mes","7 dizaines"]'::jsonb, '["7 Ø£Ø¹Ø´Ø§Ø±","7 ÙˆØ­Ø¯Ø§Øª","7 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø©","7 Ø¹Ø´Ø±Ø§Øª"]'::jsonb,
   0, '1er chiffre aprÃ¨s la virgule = dixiÃ¨mes.', 'Ø£ÙˆÙ„ Ø±Ù‚Ù… Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© = Ø§Ù„Ø£Ø¹Ø´Ø§Ø±.', 'easy', 1),
  ('Compare : 3,45 â€¦ 3,5', 'Ù‚Ø§Ø±Ù†: 3.45 â€¦ 3.5',
   '["3,45 < 3,5","3,45 > 3,5","3,45 = 3,5","impossible"]'::jsonb, '["3.45 < 3.5","3.45 > 3.5","3.45 = 3.5","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb,
   0, '4 dixiÃ¨mes < 5 dixiÃ¨mes.', '4 Ø£Ø¹Ø´Ø§Ø± < 5 Ø£Ø¹Ø´Ø§Ø±.', 'medium', 2),
  ('Quelle Ã©criture Ã©gale 7,3 ?', 'Ø£ÙŠ ÙƒØªØ§Ø¨Ø© ØªØ³Ø§ÙˆÙŠ 7.3ØŸ',
   '["7,30","7,03","0,73","73"]'::jsonb, '["7.30","7.03","0.73","73"]'::jsonb,
   0, 'Ajouter un zÃ©ro Ã  droite ne change rien.', 'Ø¥Ø¶Ø§ÙØ© ØµÙØ± Ø¹Ù„Ù‰ Ø§Ù„ÙŠÙ…ÙŠÙ† Ù„Ø§ ØªØºÙŠÙ‘Ø± Ø§Ù„Ù‚ÙŠÙ…Ø©.', 'easy', 3),
  ('Le plus grand nombre estâ€¦', 'Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø± Ù‡Ùˆâ€¦',
   '["12,8","12,79","12,081","9,99"]'::jsonb, '["12.8","12.79","12.081","9.99"]'::jsonb,
   0, '12,8 = 12,800 > 12,79.', '12.8 = 12.800 > 12.79.', 'medium', 4),
  ('2,05 se litâ€¦', 'ÙŠÙÙ‚Ø±Ø£ 2.05â€¦',
   '["deux et cinq centiÃ¨mes","deux et cinq dixiÃ¨mes","deux et cinquante","vingt-cinq"]'::jsonb, '["Ø§Ø«Ù†Ø§Ù† ÙˆØ®Ù…Ø³Ø© Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø©","Ø§Ø«Ù†Ø§Ù† ÙˆØ®Ù…Ø³Ø© Ø£Ø¹Ø´Ø§Ø±","Ø§Ø«Ù†Ø§Ù† ÙˆØ®Ù…Ø³ÙˆÙ†","Ø®Ù…Ø³Ø© ÙˆØ¹Ø´Ø±ÙˆÙ†"]'::jsonb,
   0, '05 aprÃ¨s la virgule = 5 centiÃ¨mes.', '05 Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© = 5 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† Ù…Ø¦Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'entiers-decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES OPÃ‰RATIONS

L''ADDITION et LA SOUSTRACTION
On pose les nombres en alignant les virgules et les rangs. On complÃ¨te avec
des zÃ©ros si besoin.

LA MULTIPLICATION
Multiplier par 10, 100, 1000 : on dÃ©cale la virgule vers la droite d''autant
de rangs. 3,45 Ã— 100 = 345.
Multiplier deux dÃ©cimaux : on multiplie sans virgule puis on place autant de
chiffres aprÃ¨s la virgule que dans les deux facteurs rÃ©unis.

LA DIVISION
Diviser par 10, 100 : on dÃ©cale la virgule vers la gauche. 345 Ã· 100 = 3,45.
Quotient et reste : dans la division euclidienne, dividende = diviseur Ã—
quotient + reste (avec reste < diviseur).

PRIORITÃ‰S DE CALCUL
1. Les parenthÃ¨ses. 2. La multiplication et la division. 3. L''addition et la
soustraction. On calcule de gauche Ã  droite Ã  prioritÃ© Ã©gale.
Exemple : 5 + 3 Ã— 2 = 5 + 6 = 11 (pas 16).',
  lesson_ar = 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª

Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­
Ù†Ø¶Ø¹ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø¨Ù…Ø­Ø§Ø°Ø§Ø© Ø§Ù„ÙÙˆØ§ØµÙ„ ÙˆØ§Ù„Ù…Ø±Ø§ØªØ¨ØŒ ÙˆÙ†ÙƒÙ…Ù„ Ø¨Ø§Ù„Ø£ØµÙØ§Ø± Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.

Ø§Ù„Ø¶Ø±Ø¨
Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 10 Ùˆ100 Ùˆ1000: Ù†Ù†Ù‚Ù„ Ø§Ù„ÙØ§ØµÙ„Ø© Ù†Ø­Ùˆ Ø§Ù„ÙŠÙ…ÙŠÙ† Ø¨Ø¹Ø¯Ø¯ Ø§Ù„Ù…Ø±Ø§ØªØ¨. 3.45 Ã— 100 = 345.
Ø¶Ø±Ø¨ Ø¹Ø¯Ø¯ÙŠÙ† Ø¹Ø´Ø±ÙŠÙŠÙ†: Ù†Ø¶Ø±Ø¨ Ø¯ÙˆÙ† ÙØ§ØµÙ„Ø© Ø«Ù… Ù†Ø¶Ø¹ Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø±Ù‚Ø§Ù… Ø§Ù„Ø¹Ø´Ø±ÙŠØ© = Ù…Ø¬Ù…ÙˆØ¹ Ø£Ø±Ù‚Ø§Ù… Ø§Ù„Ø¹Ø§Ù…Ù„ÙŠÙ†.

Ø§Ù„Ù‚Ø³Ù…Ø©
Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ 10 Ùˆ100: Ù†Ù†Ù‚Ù„ Ø§Ù„ÙØ§ØµÙ„Ø© Ù†Ø­Ùˆ Ø§Ù„ÙŠØ³Ø§Ø±. 345 Ã· 100 = 3.45.
Ø§Ù„Ù‚Ø³Ù…Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠØ¯ÙŠØ©: Ø§Ù„Ù…Ù‚Ø³ÙˆÙ… = Ø§Ù„Ù‚Ø§Ø³Ù… Ã— Ø§Ù„Ø­Ø§ØµÙ„ + Ø§Ù„Ø¨Ø§Ù‚ÙŠ (Ø§Ù„Ø¨Ø§Ù‚ÙŠ < Ø§Ù„Ù‚Ø§Ø³Ù…).

Ø£ÙˆÙ„ÙˆÙŠØ§Øª Ø§Ù„Ø­Ø³Ø§Ø¨
1. Ø§Ù„Ø£Ù‚ÙˆØ§Ø³. 2. Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø©. 3. Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­.
Ù…Ø«Ø§Ù„: 5 + 3 Ã— 2 = 11 (ÙˆÙ„ÙŠØ³ 16).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('3,45 Ã— 100 = ?', '3.45 Ã— 100 = ØŸ',
   '["345","34,5","3450","3,45"]'::jsonb, '["345","34.5","3450","3.45"]'::jsonb,
   0, 'On dÃ©cale la virgule de 2 rangs Ã  droite.', 'Ù†Ù†Ù‚Ù„ Ø§Ù„ÙØ§ØµÙ„Ø© Ø±ØªØ¨ØªÙŠÙ† Ù†Ø­Ùˆ Ø§Ù„ÙŠÙ…ÙŠÙ†.', 'easy', 1),
  ('Calcule : 5 + 3 Ã— 2', 'Ø§Ø­Ø³Ø¨: 5 + 3 Ã— 2',
   '["11","16","13","10"]'::jsonb, '["11","16","13","10"]'::jsonb,
   0, 'Multiplication d''abord : 3Ã—2=6, puis 5+6=11.', 'Ø§Ù„Ø¶Ø±Ø¨ Ø£ÙˆÙ„Ø§Ù‹: 6ØŒ Ø«Ù… 5+6=11.', 'medium', 2),
  ('345 Ã· 100 = ?', '345 Ã· 100 = ØŸ',
   '["3,45","34,5","3450","0,345"]'::jsonb, '["3.45","34.5","3450","0.345"]'::jsonb,
   0, 'On dÃ©cale la virgule de 2 rangs Ã  gauche.', 'Ù†Ù†Ù‚Ù„ Ø§Ù„ÙØ§ØµÙ„Ø© Ø±ØªØ¨ØªÙŠÙ† Ù†Ø­Ùˆ Ø§Ù„ÙŠØ³Ø§Ø±.', 'easy', 3),
  ('Dans 47 = 6 Ã— 7 + reste, le reste estâ€¦', 'ÙÙŠ 47 = 6 Ã— 7 + Ø§Ù„Ø¨Ø§Ù‚ÙŠØŒ Ø§Ù„Ø¨Ø§Ù‚ÙŠ Ù‡Ùˆâ€¦',
   '["5","1","42","7"]'::jsonb, '["5","1","42","7"]'::jsonb,
   0, '6Ã—7 = 42, reste = 47âˆ’42 = 5.', '6Ã—7 = 42ØŒ Ø§Ù„Ø¨Ø§Ù‚ÙŠ = 5.', 'medium', 4),
  ('Calcule : (5 + 3) Ã— 2', 'Ø§Ø­Ø³Ø¨: (5 + 3) Ã— 2',
   '["16","11","13","10"]'::jsonb, '["16","11","13","10"]'::jsonb,
   0, 'ParenthÃ¨ses d''abord : 8Ã—2 = 16.', 'Ø§Ù„Ø£Ù‚ÙˆØ§Ø³ Ø£ÙˆÙ„Ø§Ù‹: 8Ã—2 = 16.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES FRACTIONS

SENS D''UNE FRACTION
a/b : b (dÃ©nominateur) = nombre de parts Ã©gales du tout ; a (numÃ©rateur) =
nombre de parts prises. 3/4 = 3 parts sur 4.

FRACTIONS Ã‰GALES
On multiplie (ou divise) numÃ©rateur ET dÃ©nominateur par le mÃªme nombre :
1/2 = 2/4 = 3/6. Simplifier = diviser les deux par le mÃªme nombre.

COMPARER
â€¢ MÃªme dÃ©nominateur : la plus grande a le plus grand numÃ©rateur (3/5 > 2/5).
â€¢ MÃªme numÃ©rateur : la plus grande a le plus petit dÃ©nominateur (1/3 > 1/5).

FRACTION D''UNE QUANTITÃ‰
Prendre 3/4 de 20 : 20 Ã· 4 = 5, puis 5 Ã— 3 = 15.

ADDITION (mÃªme dÃ©nominateur)
On additionne les numÃ©rateurs : 2/7 + 3/7 = 5/7.

Ã€ RETENIR : une fraction est un partage ; le dÃ©nominateur ne doit jamais
Ãªtre nul.',
  lesson_ar = 'Ø§Ù„ÙƒØ³ÙˆØ±

Ù…Ø¹Ù†Ù‰ Ø§Ù„ÙƒØ³Ø±
a/b: Ø§Ù„Ù…Ù‚Ø§Ù… b Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„Ù…ØªØ³Ø§ÙˆÙŠØ© Ù„Ù„ÙƒÙ„ØŒ ÙˆØ§Ù„Ø¨Ø³Ø· a Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„Ù…Ø£Ø®ÙˆØ°Ø©.
3/4 = 3 Ø£Ø¬Ø²Ø§Ø¡ Ù…Ù† 4.

Ø§Ù„ÙƒØ³ÙˆØ± Ø§Ù„Ù…ØªØ³Ø§ÙˆÙŠØ©
Ù†Ø¶Ø±Ø¨ (Ø£Ùˆ Ù†Ù‚Ø³Ù…) Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù… ÙÙŠ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯: 1/2 = 2/4 = 3/6. Ø§Ù„Ø§Ø®ØªØ²Ø§Ù„ = Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
â€¢ Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…: Ø§Ù„Ø£ÙƒØ¨Ø± Ø¨Ø³Ø·Ù‹Ø§ Ù‡Ùˆ Ø§Ù„Ø£ÙƒØ¨Ø± (3/5 > 2/5).
â€¢ Ù†ÙØ³ Ø§Ù„Ø¨Ø³Ø·: Ø§Ù„Ø£ØµØºØ± Ù…Ù‚Ø§Ù…Ù‹Ø§ Ù‡Ùˆ Ø§Ù„Ø£ÙƒØ¨Ø± (1/3 > 1/5).

ÙƒØ³Ø± Ù…Ù† Ù…Ù‚Ø¯Ø§Ø±
3/4 Ù…Ù† 20: 20 Ã· 4 = 5 Ø«Ù… 5 Ã— 3 = 15.

Ø§Ù„Ø¬Ù…Ø¹ (Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…)
2/7 + 3/7 = 5/7.

ØªØ°ÙƒØ±: Ø§Ù„ÙƒØ³Ø± ØªØ¬Ø²Ø¦Ø©ØŒ ÙˆØ§Ù„Ù…Ù‚Ø§Ù… Ù„Ø§ ÙŠÙƒÙˆÙ† Ù…Ø¹Ø¯ÙˆÙ…Ù‹Ø§ Ø£Ø¨Ø¯Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'fractions';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Quelle fraction est Ã©gale Ã  1/2 ?', 'Ø£ÙŠ ÙƒØ³Ø± ÙŠØ³Ø§ÙˆÙŠ 1/2ØŸ',
   '["3/6","2/3","1/4","3/4"]'::jsonb, '["3/6","2/3","1/4","3/4"]'::jsonb,
   0, '1/2 = 3/6 (Ã—3 en haut et en bas).', '1/2 = 3/6.', 'easy', 1),
  ('Compare : 3/5 â€¦ 2/5', 'Ù‚Ø§Ø±Ù†: 3/5 â€¦ 2/5',
   '["3/5 > 2/5","3/5 < 2/5","3/5 = 2/5","impossible"]'::jsonb, '["3/5 > 2/5","3/5 < 2/5","3/5 = 2/5","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb,
   0, 'MÃªme dÃ©nominateur : 3 > 2.', 'Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…: 3 > 2.', 'easy', 2),
  ('Calcule : 3/4 de 20', 'Ø§Ø­Ø³Ø¨: 3/4 Ù…Ù† 20',
   '["15","12","5","60"]'::jsonb, '["15","12","5","60"]'::jsonb,
   0, '20Ã·4=5, puis 5Ã—3=15.', '20Ã·4=5 Ø«Ù… 5Ã—3=15.', 'medium', 3),
  ('Simplifie : 6/8', 'Ø§Ø®ØªØ²Ù„: 6/8',
   '["3/4","2/4","6/8","1/2"]'::jsonb, '["3/4","2/4","6/8","1/2"]'::jsonb,
   0, 'On divise par 2 : 6/8 = 3/4.', 'Ù†Ù‚Ø³Ù… Ø¹Ù„Ù‰ 2: 6/8 = 3/4.', 'medium', 4),
  ('Compare : 1/3 â€¦ 1/5', 'Ù‚Ø§Ø±Ù†: 1/3 â€¦ 1/5',
   '["1/3 > 1/5","1/3 < 1/5","1/3 = 1/5","impossible"]'::jsonb, '["1/3 > 1/5","1/3 < 1/5","1/3 = 1/5","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb,
   0, 'MÃªme numÃ©rateur : plus petit dÃ©nominateur = plus grand.', 'Ù†ÙØ³ Ø§Ù„Ø¨Ø³Ø·: Ø§Ù„Ø£ØµØºØ± Ù…Ù‚Ø§Ù…Ù‹Ø§ Ø£ÙƒØ¨Ø±.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'fractions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES NOMBRES RELATIFS

DÃ‰COUVERTE
Un nombre relatif a un signe : positif (+) ou nÃ©gatif (âˆ’).
Exemples de la vie : tempÃ©rature âˆ’5 Â°C, une dette âˆ’200 DA, un Ã©tage âˆ’2.

REPÃ‰RAGE SUR UNE DROITE
0 est l''origine. Les positifs Ã  droite, les nÃ©gatifs Ã  gauche.
Plus on va Ã  droite, plus le nombre est grand : âˆ’5 < âˆ’2 < 0 < 3.

COMPARER DES RELATIFS
â€¢ Un nÃ©gatif est toujours plus petit qu''un positif.
â€¢ Entre deux nÃ©gatifs, le plus grand est celui le plus proche de 0 :
  âˆ’2 > âˆ’7.

DISTANCE Ã€ ZÃ‰RO (valeur absolue)
La distance Ã  zÃ©ro de +5 et de âˆ’5 est 5. Deux nombres opposÃ©s (+3 et âˆ’3)
ont la mÃªme distance Ã  zÃ©ro.

Ã€ RETENIR : sur la droite graduÃ©e, Â« plus grand Â» veut dire Â« plus Ã 
droite Â», pas Â« plus loin de zÃ©ro Â».',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©

Ø§ÙƒØªØ´Ø§Ù
Ù„Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠ Ø¥Ø´Ø§Ø±Ø©: Ù…ÙˆØ¬Ø¨ (+) Ø£Ùˆ Ø³Ø§Ù„Ø¨ (âˆ’).
Ø£Ù…Ø«Ù„Ø© Ù…Ù† Ø§Ù„Ø­ÙŠØ§Ø©: Ø­Ø±Ø§Ø±Ø© âˆ’5 Â°Ù…ØŒ Ø¯ÙŽÙŠÙ† âˆ’200 Ø¯Ø¬ØŒ Ø·Ø§Ø¨Ù‚ âˆ’2.

Ø§Ù„ØªÙˆÙ‚ÙŠØ¹ Ø¹Ù„Ù‰ Ù…Ø³ØªÙ‚ÙŠÙ…
0 Ù‡Ùˆ Ø§Ù„Ù…Ø¨Ø¯Ø£. Ø§Ù„Ù…ÙˆØ¬Ø¨Ø© ÙŠÙ…ÙŠÙ†Ù‹Ø§ ÙˆØ§Ù„Ø³Ø§Ù„Ø¨Ø© ÙŠØ³Ø§Ø±Ù‹Ø§. ÙƒÙ„Ù…Ø§ Ø§ØªØ¬Ù‡Ù†Ø§ ÙŠÙ…ÙŠÙ†Ù‹Ø§ ÙƒØ¨Ø± Ø§Ù„Ø¹Ø¯Ø¯:
âˆ’5 < âˆ’2 < 0 < 3.

Ù…Ù‚Ø§Ø±Ù†Ø© Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©
â€¢ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø³Ø§Ù„Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø£ØµØºØ± Ù…Ù† Ø§Ù„Ù…ÙˆØ¬Ø¨.
â€¢ Ø¨ÙŠÙ† Ø³Ø§Ù„Ø¨ÙŠÙ†: Ø§Ù„Ø£ÙƒØ¨Ø± Ù‡Ùˆ Ø§Ù„Ø£Ù‚Ø±Ø¨ Ø¥Ù„Ù‰ Ø§Ù„ØµÙØ±: âˆ’2 > âˆ’7.

Ø§Ù„Ø¨Ø¹Ø¯ Ø¹Ù† Ø§Ù„ØµÙØ± (Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ù…Ø·Ù„Ù‚Ø©)
Ø¨ÙØ¹Ø¯ +5 Ùˆâˆ’5 Ø¹Ù† Ø§Ù„ØµÙØ± Ù‡Ùˆ 5. Ø§Ù„Ø¹Ø¯Ø¯Ø§Ù† Ø§Ù„Ù…ØªÙ‚Ø§Ø¨Ù„Ø§Ù† (+3 Ùˆâˆ’3) Ù„Ù‡Ù…Ø§ Ù†ÙØ³ Ø§Ù„Ø¨Ø¹Ø¯.

ØªØ°ÙƒØ±: Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Â«Ø§Ù„Ø£ÙƒØ¨Ø±Â» ÙŠØ¹Ù†ÙŠ Â«Ø§Ù„Ø£ÙƒØ«Ø± ÙŠÙ…ÙŠÙ†Ù‹Ø§Â» Ù„Ø§ Â«Ø§Ù„Ø£Ø¨Ø¹Ø¯ Ø¹Ù† Ø§Ù„ØµÙØ±Â».'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'relatifs';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Compare : âˆ’5 â€¦ âˆ’2', 'Ù‚Ø§Ø±Ù†: âˆ’5 â€¦ âˆ’2',
   '["âˆ’5 < âˆ’2","âˆ’5 > âˆ’2","âˆ’5 = âˆ’2","impossible"]'::jsonb, '["âˆ’5 < âˆ’2","âˆ’5 > âˆ’2","âˆ’5 = âˆ’2","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb,
   0, 'âˆ’2 est plus proche de 0, donc plus grand.', 'âˆ’2 Ø£Ù‚Ø±Ø¨ Ø¥Ù„Ù‰ Ø§Ù„ØµÙØ± Ø¥Ø°Ù† Ø£ÙƒØ¨Ø±.', 'easy', 1),
  ('Quel est l''opposÃ© de +7 ?', 'Ù…Ø§ Ù…Ù‚Ø§Ø¨Ù„ +7ØŸ',
   '["âˆ’7","+7","0","1/7"]'::jsonb, '["âˆ’7","+7","0","1/7"]'::jsonb,
   0, 'L''opposÃ© change le signe : âˆ’7.', 'Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„ ÙŠØºÙŠÙ‘Ø± Ø§Ù„Ø¥Ø´Ø§Ø±Ø©: âˆ’7.', 'easy', 2),
  ('Range du plus petit au plus grand : 3 ; âˆ’1 ; âˆ’4 ; 0', 'Ø±ØªÙ‘Ø¨ Ù…Ù† Ø§Ù„Ø£ØµØºØ± Ø¥Ù„Ù‰ Ø§Ù„Ø£ÙƒØ¨Ø±: 3 Ø› âˆ’1 Ø› âˆ’4 Ø› 0',
   '["âˆ’4 < âˆ’1 < 0 < 3","3 < 0 < âˆ’1 < âˆ’4","âˆ’1 < âˆ’4 < 0 < 3","0 < âˆ’1 < 3 < âˆ’4"]'::jsonb,
   '["âˆ’4 < âˆ’1 < 0 < 3","3 < 0 < âˆ’1 < âˆ’4","âˆ’1 < âˆ’4 < 0 < 3","0 < âˆ’1 < 3 < âˆ’4"]'::jsonb,
   0, 'Sur la droite : les nÃ©gatifs Ã  gauche.', 'Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ø§Ù„Ø³Ø§Ù„Ø¨Ø© ÙŠØ³Ø§Ø±Ù‹Ø§.', 'medium', 3),
  ('La distance Ã  zÃ©ro de âˆ’8 estâ€¦', 'Ø¨ÙØ¹Ø¯ âˆ’8 Ø¹Ù† Ø§Ù„ØµÙØ± Ù‡Ùˆâ€¦',
   '["8","âˆ’8","0","16"]'::jsonb, '["8","âˆ’8","0","16"]'::jsonb,
   0, 'La distance Ã  zÃ©ro est toujours positive.', 'Ø§Ù„Ø¨Ø¹Ø¯ Ø¹Ù† Ø§Ù„ØµÙØ± Ù…ÙˆØ¬Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§.', 'medium', 4),
  ('Un nÃ©gatif est-il plus grand ou plus petit qu''un positif ?', 'Ù‡Ù„ Ø§Ù„Ø³Ø§Ù„Ø¨ Ø£ÙƒØ¨Ø± Ø£Ù… Ø£ØµØºØ± Ù…Ù† Ø§Ù„Ù…ÙˆØ¬Ø¨ØŸ',
   '["toujours plus petit","toujours plus grand","parfois Ã©gal","cela dÃ©pend"]'::jsonb, '["Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø£ØµØºØ±","Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø£ÙƒØ¨Ø±","Ø£Ø­ÙŠØ§Ù†Ù‹Ø§ Ù…ØªØ³Ø§ÙˆÙŠØ§Ù†","Ø­Ø³Ø¨ Ø§Ù„Ø­Ø§Ù„Ø©"]'::jsonb,
   0, 'Tout nÃ©gatif < tout positif.', 'ÙƒÙ„ Ø³Ø§Ù„Ø¨ Ø£ØµØºØ± Ù…Ù† Ø£ÙŠ Ù…ÙˆØ¬Ø¨.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'relatifs'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA PROPORTIONNALITÃ‰

DÃ‰FINITION
Deux grandeurs sont proportionnelles si on passe de l''une Ã  l''autre en
multipliant toujours par le mÃªme nombre (le coefficient).

LE TABLEAU DE PROPORTIONNALITÃ‰
Les quotients d''une colonne Ã  l''autre sont Ã©gaux.
2 â†’ 6, 5 â†’ 15, 8 â†’ 24 : coefficient Ã—3.

LA RÃˆGLE DE TROIS (passage Ã  l''unitÃ©)
4 stylos coÃ»tent 60 DA. Combien coÃ»tent 7 stylos ?
1 stylo : 60 Ã· 4 = 15 DA. 7 stylos : 15 Ã— 7 = 105 DA.

LES POURCENTAGES
Un pourcentage est une proportion sur 100. 20 % de 50 = (20 Ã— 50) Ã· 100 = 10.

LA VITESSE
v = distance Ã· temps. C''est une situation de proportionnalitÃ© entre la
distance et le temps.

Ã€ RETENIR : proportionnel = mÃªme multiplicateur pour toutes les colonnes.',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ©

ØªØ¹Ø±ÙŠÙ
Ù…Ù‚Ø¯Ø§Ø±Ø§Ù† Ù…ØªÙ†Ø§Ø³Ø¨Ø§Ù† Ø¥Ø°Ø§ Ø§Ù†ØªÙ‚Ù„Ù†Ø§ Ù…Ù† Ø§Ù„Ø£ÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø«Ø§Ù†ÙŠ Ø¨Ø§Ù„Ø¶Ø±Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ ÙÙŠ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯ (Ø§Ù„Ù…Ø¹Ø§Ù…Ù„).

Ø¬Ø¯ÙˆÙ„ Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ©
Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ø³Ù…Ø© Ù…ØªØ³Ø§ÙˆÙ Ù…Ù† Ø¹Ù…ÙˆØ¯ Ù„Ø¢Ø®Ø±.
2 â† 6ØŒ 5 â† 15ØŒ 8 â† 24: Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ã—3.

Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø«Ù„Ø§Ø«Ø© (Ø§Ù„Ù…Ø±ÙˆØ± Ø¨Ø§Ù„ÙˆØ­Ø¯Ø©)
4 Ø£Ù‚Ù„Ø§Ù… Ø¨Ù€ 60 Ø¯Ø¬. ÙƒÙ… Ø«Ù…Ù† 7 Ø£Ù‚Ù„Ø§Ù…ØŸ
Ù‚Ù„Ù… ÙˆØ§Ø­Ø¯: 60 Ã· 4 = 15 Ø¯Ø¬. Ø³Ø¨Ø¹Ø©: 15 Ã— 7 = 105 Ø¯Ø¬.

Ø§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø¦ÙˆÙŠØ©
Ø§Ù„Ù†Ø³Ø¨Ø© Ø§Ù„Ù…Ø¦ÙˆÙŠØ© ØªÙ†Ø§Ø³Ø¨ Ù…Ù† 100. 20% Ù…Ù† 50 = (20 Ã— 50) Ã· 100 = 10.

Ø§Ù„Ø³Ø±Ø¹Ø©
v = Ø§Ù„Ù…Ø³Ø§ÙØ© Ã· Ø§Ù„Ø²Ù…Ù†ØŒ ÙˆÙ‡ÙŠ ÙˆØ¶Ø¹ÙŠØ© ØªÙ†Ø§Ø³Ø¨ÙŠØ© Ø¨ÙŠÙ† Ø§Ù„Ù…Ø³Ø§ÙØ© ÙˆØ§Ù„Ø²Ù…Ù†.

ØªØ°ÙƒØ±: Ø§Ù„ØªÙ†Ø§Ø³Ø¨ = Ù†ÙØ³ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ Ù„ÙƒÙ„ Ø§Ù„Ø£Ø¹Ù…Ø¯Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('4 stylos coÃ»tent 60 DA. 7 stylos coÃ»tentâ€¦', '4 Ø£Ù‚Ù„Ø§Ù… Ø¨Ù€ 60 Ø¯Ø¬. 7 Ø£Ù‚Ù„Ø§Ù… Ø¨Ù€â€¦',
   '["105 DA","120 DA","90 DA","420 DA"]'::jsonb, '["105 Ø¯Ø¬","120 Ø¯Ø¬","90 Ø¯Ø¬","420 Ø¯Ø¬"]'::jsonb,
   0, '1 stylo = 15 DA, 7 stylos = 105 DA.', 'Ù‚Ù„Ù… = 15 Ø¯Ø¬ØŒ 7 = 105 Ø¯Ø¬.', 'medium', 1),
  ('20 % de 50 = ?', '20% Ù…Ù† 50 = ØŸ',
   '["10","20","30","5"]'::jsonb, '["10","20","30","5"]'::jsonb,
   0, '(20Ã—50)/100 = 10.', '(20Ã—50)/100 = 10.', 'easy', 2),
  ('Le tableau 2â†’6, 5â†’15 a pour coefficientâ€¦', 'Ø§Ù„Ø¬Ø¯ÙˆÙ„ 2â†6ØŒ 5â†15 Ù…Ø¹Ø§Ù…Ù„Ù‡â€¦',
   '["3","2","4","6"]'::jsonb, '["3","2","4","6"]'::jsonb,
   0, '6Ã·2 = 15Ã·5 = 3.', '6Ã·2 = 15Ã·5 = 3.', 'medium', 3),
  ('Une voiture Ã  80 km/h parcourt en 3 hâ€¦', 'Ø³ÙŠØ§Ø±Ø© Ø³Ø±Ø¹ØªÙ‡Ø§ 80 ÙƒÙ…/Ø³Ø§ ØªÙ‚Ø·Ø¹ ÙÙŠ 3 Ø³Ø§â€¦',
   '["240 km","83 km","160 km","27 km"]'::jsonb, '["240 ÙƒÙ…","83 ÙƒÙ…","160 ÙƒÙ…","27 ÙƒÙ…"]'::jsonb,
   0, '80 Ã— 3 = 240 km.', '80 Ã— 3 = 240 ÙƒÙ….', 'easy', 4),
  ('Ce tableau est-il proportionnel ? 3â†’9 ; 4â†’12 ; 5â†’14', 'Ù‡Ù„ Ø§Ù„Ø¬Ø¯ÙˆÙ„ ØªÙ†Ø§Ø³Ø¨ÙŠØŸ 3â†9 Ø› 4â†12 Ø› 5â†14',
   '["Non","Oui, coef 3","Oui, coef 2","On ne peut pas savoir"]'::jsonb, '["Ù„Ø§","Ù†Ø¹Ù…ØŒ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ 3","Ù†Ø¹Ù…ØŒ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„ 2","Ù„Ø§ Ù†Ø¹Ù„Ù…"]'::jsonb,
   0, '9Ã·3=3, 12Ã·4=3, mais 14Ã·5=2,8 : non proportionnel.', '14Ã·5 = 2.8 â‰  3 Ø¥Ø°Ù† ØºÙŠØ± ØªÙ†Ø§Ø³Ø¨ÙŠ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'DROITES ET ANGLES

VOCABULAIRE DES DROITES
â€¢ Droites PARALLÃˆLES : ne se croisent jamais (mÃªme Ã©cart partout). Notation //.
â€¢ Droites PERPENDICULAIRES : se croisent en formant un angle droit (90Â°).
  Notation âŠ¥.
â€¢ Droites SÃ‰CANTES : se croisent en un point.

LES ANGLES
Un angle se mesure en degrÃ©s avec un rapporteur.
â€¢ Angle DROIT = 90Â°. â€¢ Angle PLAT = 180Â°. â€¢ Angle AIGU < 90Â°.
â€¢ Angle OBTUS entre 90Â° et 180Â°.

ANGLES PARTICULIERS
â€¢ Deux angles COMPLÃ‰MENTAIRES : leur somme fait 90Â°.
â€¢ Deux angles SUPPLÃ‰MENTAIRES : leur somme fait 180Â°.
â€¢ Angles OPPOSÃ‰S PAR LE SOMMET : ils sont Ã©gaux.

LA MÃ‰DIATRICE
La mÃ©diatrice d''un segment est la droite perpendiculaire qui passe par son
milieu. Tout point de la mÃ©diatrice est Ã  Ã©gale distance des deux extrÃ©mitÃ©s.',
  lesson_ar = 'Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª ÙˆØ§Ù„Ø²ÙˆØ§ÙŠØ§

Ù…ØµØ·Ù„Ø­Ø§Øª Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª
â€¢ Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†: Ù„Ø§ ÙŠØªÙ‚Ø§Ø·Ø¹Ø§Ù† Ø£Ø¨Ø¯Ù‹Ø§ (Ù†ÙØ³ Ø§Ù„Ù…Ø³Ø§ÙØ©). Ø§Ù„Ø±Ù…Ø² //.
â€¢ Ù…ØªØ¹Ø§Ù…Ø¯Ø§Ù†: ÙŠØªÙ‚Ø§Ø·Ø¹Ø§Ù† Ù…ÙƒÙˆÙ‘Ù†ÙŠÙ† Ø²Ø§ÙˆÙŠØ© Ù‚Ø§Ø¦Ù…Ø© (90Â°). Ø§Ù„Ø±Ù…Ø² âŠ¥.
â€¢ Ù…ØªÙ‚Ø§Ø·Ø¹Ø§Ù†: ÙŠÙ„ØªÙ‚ÙŠØ§Ù† ÙÙŠ Ù†Ù‚Ø·Ø©.

Ø§Ù„Ø²ÙˆØ§ÙŠØ§
ØªÙÙ‚Ø§Ø³ Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø¨Ø§Ù„Ø¯Ø±Ø¬Ø§Øª Ø¨Ø§Ù„Ù…Ù†Ù‚Ù„Ø©.
â€¢ Ù‚Ø§Ø¦Ù…Ø© = 90Â°. â€¢ Ù…Ø³ØªÙ‚ÙŠÙ…Ø© = 180Â°. â€¢ Ø­Ø§Ø¯Ø© < 90Â°. â€¢ Ù…Ù†ÙØ±Ø¬Ø© Ø¨ÙŠÙ† 90Â° Ùˆ180Â°.

Ø²ÙˆØ§ÙŠØ§ Ø®Ø§ØµØ©
â€¢ Ù…ØªØªØ§Ù…Ù‘ØªØ§Ù†: Ù…Ø¬Ù…ÙˆØ¹Ù‡Ù…Ø§ 90Â°.
â€¢ Ù…ØªÙƒØ§Ù…Ù„ØªØ§Ù†: Ù…Ø¬Ù…ÙˆØ¹Ù‡Ù…Ø§ 180Â°.
â€¢ Ù…ØªÙ‚Ø§Ø¨Ù„ØªØ§Ù† Ø¨Ø§Ù„Ø±Ø£Ø³: Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù†.

Ù…Ø­ÙˆØ± Ø§Ù„Ù‚Ø·Ø¹Ø©
Ù…Ø­ÙˆØ± Ø§Ù„Ù‚Ø·Ø¹Ø© Ù‡Ùˆ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ø§Ù„Ø¹Ù…ÙˆØ¯ÙŠ Ø§Ù„Ù…Ø§Ø± Ø¨Ù…Ù†ØªØµÙÙ‡Ø§. ÙƒÙ„ Ù†Ù‚Ø·Ø© Ù…Ù†Ù‡ ØªØ¨Ø¹Ø¯ Ø¨Ø§Ù„ØªØ³Ø§ÙˆÙŠ Ø¹Ù† Ø·Ø±ÙÙŠÙ‡Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'droites-angles';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un angle droit mesureâ€¦', 'Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ØªÙ‚ÙŠØ³â€¦',
   '["90Â°","180Â°","45Â°","360Â°"]'::jsonb, '["90Â°","180Â°","45Â°","360Â°"]'::jsonb,
   0, 'L''angle droit = 90Â°.', 'Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© = 90Â°.', 'easy', 1),
  ('Deux droites qui ne se croisent jamais sontâ€¦', 'Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù„Ø§ ÙŠØªÙ‚Ø§Ø·Ø¹Ø§Ù† Ø£Ø¨Ø¯Ù‹Ø§ Ù‡Ù…Ø§â€¦',
   '["parallÃ¨les","perpendiculaires","sÃ©cantes","confondues"]'::jsonb, '["Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†","Ù…ØªØ¹Ø§Ù…Ø¯Ø§Ù†","Ù…ØªÙ‚Ø§Ø·Ø¹Ø§Ù†","Ù…Ù†Ø·Ø¨Ù‚Ø§Ù†"]'::jsonb,
   0, 'Elles sont parallÃ¨les.', 'Ù‡Ù…Ø§ Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†.', 'easy', 2),
  ('Deux angles complÃ©mentaires ont une somme deâ€¦', 'Ø²Ø§ÙˆÙŠØªØ§Ù† Ù…ØªØªØ§Ù…Ù‘ØªØ§Ù† Ù…Ø¬Ù…ÙˆØ¹Ù‡Ù…Ø§â€¦',
   '["90Â°","180Â°","45Â°","360Â°"]'::jsonb, '["90Â°","180Â°","45Â°","360Â°"]'::jsonb,
   0, 'ComplÃ©mentaires â†’ 90Â°.', 'Ø§Ù„Ù…ØªØªØ§Ù…Ù‘ØªØ§Ù† â† 90Â°.', 'medium', 3),
  ('Un angle de 130Â° estâ€¦', 'Ø²Ø§ÙˆÙŠØ© 130Â° Ù‡ÙŠâ€¦',
   '["obtus","aigu","droit","plat"]'::jsonb, '["Ù…Ù†ÙØ±Ø¬Ø©","Ø­Ø§Ø¯Ø©","Ù‚Ø§Ø¦Ù…Ø©","Ù…Ø³ØªÙ‚ÙŠÙ…Ø©"]'::jsonb,
   0, 'Entre 90Â° et 180Â° = obtus.', 'Ø¨ÙŠÙ† 90Â° Ùˆ180Â° = Ù…Ù†ÙØ±Ø¬Ø©.', 'medium', 4),
  ('La mÃ©diatrice d''un segment passe par son milieu et lui estâ€¦', 'Ù…Ø­ÙˆØ± Ø§Ù„Ù‚Ø·Ø¹Ø© ÙŠÙ…Ø± Ø¨Ù…Ù†ØªØµÙÙ‡Ø§ ÙˆÙŠÙƒÙˆÙ† Ù„Ù‡Ø§â€¦',
   '["perpendiculaire","parallÃ¨le","sÃ©cante oblique","confondu"]'::jsonb, '["Ø¹Ù…ÙˆØ¯ÙŠÙ‹Ø§","Ù…ÙˆØ§Ø²ÙŠÙ‹Ø§","Ù…Ø§Ø¦Ù„Ø§Ù‹","Ù…Ù†Ø·Ø¨Ù‚Ù‹Ø§"]'::jsonb,
   0, 'Perpendiculaire passant par le milieu.', 'Ø¹Ù…ÙˆØ¯ÙŠ Ù…Ø§Ø± Ø¨Ø§Ù„Ù…Ù†ØªØµÙ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'droites-angles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'TRIANGLES ET QUADRILATÃˆRES

LES TRIANGLES
â€¢ Quelconque : 3 cÃ´tÃ©s diffÃ©rents.
â€¢ IsocÃ¨le : 2 cÃ´tÃ©s Ã©gaux (et 2 angles Ã©gaux).
â€¢ Ã‰quilatÃ©ral : 3 cÃ´tÃ©s Ã©gaux (et 3 angles de 60Â°).
â€¢ Rectangle : un angle droit.
PROPRIÃ‰TÃ‰ : la somme des angles d''un triangle est toujours 180Â°.

INÃ‰GALITÃ‰ TRIANGULAIRE
Un triangle est constructible si le plus grand cÃ´tÃ© est plus petit que la
somme des deux autres.

LES QUADRILATÃˆRES
â€¢ Rectangle : 4 angles droits, cÃ´tÃ©s opposÃ©s Ã©gaux.
â€¢ CarrÃ© : 4 cÃ´tÃ©s Ã©gaux + 4 angles droits.
â€¢ Losange : 4 cÃ´tÃ©s Ã©gaux.
â€¢ ParallÃ©logramme : cÃ´tÃ©s opposÃ©s parallÃ¨les deux Ã  deux.

CONSTRUCTION
On utilise rÃ¨gle, Ã©querre, compas et rapporteur en respectant les mesures
donnÃ©es.

Ã€ RETENIR : dans tout triangle, angle1 + angle2 + angle3 = 180Â°.',
  lesson_ar = 'Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª ÙˆØ§Ù„Ø±Ø¨Ø§Ø¹ÙŠØ§Øª

Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª
â€¢ Ø£ÙŠ Ù…Ø«Ù„Ø«: 3 Ø£Ø¶Ù„Ø§Ø¹ Ù…Ø®ØªÙ„ÙØ©.
â€¢ Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ†: Ø¶Ù„Ø¹Ø§Ù† Ù…ØªØ³Ø§ÙˆÙŠØ§Ù† (ÙˆØ²Ø§ÙˆÙŠØªØ§Ù† Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù†).
â€¢ Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹: 3 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ© (Ùˆ3 Ø²ÙˆØ§ÙŠØ§ 60Â°).
â€¢ Ù‚Ø§Ø¦Ù…: Ø²Ø§ÙˆÙŠØ© Ù‚Ø§Ø¦Ù…Ø©.
Ø®Ø§ØµÙŠØ©: Ù…Ø¬Ù…ÙˆØ¹ Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…Ø«Ù„Ø« ÙŠØ³Ø§ÙˆÙŠ Ø¯Ø§Ø¦Ù…Ù‹Ø§ 180Â°.

Ø§Ù„Ù…ØªØ¨Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ø«Ù„Ø«ÙŠØ©
ÙŠÙ…ÙƒÙ† Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ø«Ù„Ø« Ø¥Ø°Ø§ ÙƒØ§Ù† Ø£ÙƒØ¨Ø± Ø¶Ù„Ø¹ Ø£ØµØºØ± Ù…Ù† Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ø¶Ù„Ø¹ÙŠÙ† Ø§Ù„Ø¢Ø®Ø±ÙŠÙ†.

Ø§Ù„Ø±Ø¨Ø§Ø¹ÙŠØ§Øª
â€¢ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„: 4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©ØŒ Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªÙ‚Ø§Ø¨Ù„Ø© Ù…ØªØ³Ø§ÙˆÙŠØ©.
â€¢ Ø§Ù„Ù…Ø±Ø¨Ø¹: 4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ© + 4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©.
â€¢ Ø§Ù„Ù…Ø¹ÙŠÙ‘Ù†: 4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ©.
â€¢ Ù…ØªÙˆØ§Ø²ÙŠ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹: Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªÙ‚Ø§Ø¨Ù„Ø© Ù…ØªÙˆØ§Ø²ÙŠØ©.

ØªØ°ÙƒØ±: ÙÙŠ ÙƒÙ„ Ù…Ø«Ù„Ø« Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ø²ÙˆØ§ÙŠØ§ = 180Â°.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'triangles-quadri';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La somme des angles d''un triangle estâ€¦', 'Ù…Ø¬Ù…ÙˆØ¹ Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…Ø«Ù„Ø« Ù‡Ùˆâ€¦',
   '["180Â°","360Â°","90Â°","270Â°"]'::jsonb, '["180Â°","360Â°","90Â°","270Â°"]'::jsonb,
   0, 'Toujours 180Â°.', 'Ø¯Ø§Ø¦Ù…Ù‹Ø§ 180Â°.', 'easy', 1),
  ('Un triangle Ã©quilatÃ©ral a des angles deâ€¦', 'Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹ Ø²ÙˆØ§ÙŠØ§Ù‡â€¦',
   '["60Â°","90Â°","45Â°","30Â°"]'::jsonb, '["60Â°","90Â°","45Â°","30Â°"]'::jsonb,
   0, '180 Ã· 3 = 60Â°.', '180 Ã· 3 = 60Â°.', 'medium', 2),
  ('Un carrÃ© est un quadrilatÃ¨re avecâ€¦', 'Ø§Ù„Ù…Ø±Ø¨Ø¹ Ø±Ø¨Ø§Ø¹ÙŠ Ù„Ù‡â€¦',
   '["4 cÃ´tÃ©s Ã©gaux et 4 angles droits","4 cÃ´tÃ©s Ã©gaux seulement","4 angles droits seulement","2 cÃ´tÃ©s Ã©gaux"]'::jsonb,
   '["4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ© Ùˆ4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©","4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ© ÙÙ‚Ø·","4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø© ÙÙ‚Ø·","Ø¶Ù„Ø¹Ø§Ù† Ù…ØªØ³Ø§ÙˆÙŠØ§Ù†"]'::jsonb,
   0, 'DÃ©finition du carrÃ©.', 'ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø±Ø¨Ø¹.', 'easy', 3),
  ('Dans un triangle, deux angles font 50Â° et 60Â°. Le troisiÃ¨meâ€¦', 'ÙÙŠ Ù…Ø«Ù„Ø« Ø²Ø§ÙˆÙŠØªØ§Ù† 50Â° Ùˆ60Â°. Ø§Ù„Ø«Ø§Ù„Ø«Ø©â€¦',
   '["70Â°","80Â°","90Â°","110Â°"]'::jsonb, '["70Â°","80Â°","90Â°","110Â°"]'::jsonb,
   0, '180 âˆ’ 50 âˆ’ 60 = 70Â°.', '180 âˆ’ 50 âˆ’ 60 = 70Â°.', 'medium', 4),
  ('Peut-on construire un triangle de cÃ´tÃ©s 2, 3 et 8 cm ?', 'Ù‡Ù„ ÙŠÙ…ÙƒÙ† Ø¥Ù†Ø´Ø§Ø¡ Ù…Ø«Ù„Ø« Ø£Ø¶Ù„Ø§Ø¹Ù‡ 2 Ùˆ3 Ùˆ8 Ø³Ù…ØŸ',
   '["Non (2+3 < 8)","Oui","Oui, isocÃ¨le","Oui, rectangle"]'::jsonb, '["Ù„Ø§ (2+3 < 8)","Ù†Ø¹Ù…","Ù†Ø¹Ù…ØŒ Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ†","Ù†Ø¹Ù…ØŒ Ù‚Ø§Ø¦Ù…"]'::jsonb,
   0, 'InÃ©galitÃ© triangulaire : 2+3=5 < 8, impossible.', 'Ø§Ù„Ù…ØªØ¨Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ø«Ù„Ø«ÙŠØ©: 5 < 8ØŒ Ù…Ø³ØªØ­ÙŠÙ„.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'triangles-quadri'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'AIRES ET PÃ‰RIMÃˆTRES

LE PÃ‰RIMÃˆTRE (le tour, en cm)
â€¢ CarrÃ© : P = 4 Ã— cÃ´tÃ©.
â€¢ Rectangle : P = 2 Ã— (Longueur + largeur).
â€¢ Cercle (circonfÃ©rence) : P = 2 Ã— Ï€ Ã— rayon â‰ˆ 6,28 Ã— rayon.

L''AIRE (la surface, en cmÂ²)
â€¢ CarrÃ© : A = cÃ´tÃ© Ã— cÃ´tÃ©.
â€¢ Rectangle : A = Longueur Ã— largeur.
â€¢ Triangle : A = (base Ã— hauteur) Ã· 2.
â€¢ Disque : A = Ï€ Ã— rayonÂ².

CONVERSIONS D''AIRES
1 mÂ² = 100 dmÂ² = 10 000 cmÂ². Attention, les aires se convertissent par
bonds de 100, pas de 10.

NE PAS CONFONDRE
PÃ©rimÃ¨tre en cm, aire en cmÂ². Deux figures de mÃªme pÃ©rimÃ¨tre peuvent avoir
des aires diffÃ©rentes.

Ã€ RETENIR : hauteur d''un triangle = segment perpendiculaire Ã  la base
passant par le sommet opposÃ©.',
  lesson_ar = 'Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª ÙˆØ§Ù„Ù…Ø­ÙŠØ·Ø§Øª

Ø§Ù„Ù…Ø­ÙŠØ· (Ø§Ù„Ø¯ÙˆØ±Ø§Ù†ØŒ Ø¨Ø§Ù„Ø³Ù…)
â€¢ Ø§Ù„Ù…Ø±Ø¨Ø¹: 4 Ã— Ø§Ù„Ø¶Ù„Ø¹.
â€¢ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„: 2 Ã— (Ø§Ù„Ø·ÙˆÙ„ + Ø§Ù„Ø¹Ø±Ø¶).
â€¢ Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©: 2 Ã— Ï€ Ã— Ù†ØµÙ Ø§Ù„Ù‚Ø·Ø± â‰ˆ 6.28 Ã— Ù†ØµÙ Ø§Ù„Ù‚Ø·Ø±.

Ø§Ù„Ù…Ø³Ø§Ø­Ø© (Ø§Ù„Ø³Ø·Ø­ØŒ Ø¨Ø§Ù„Ø³Ù…Â²)
â€¢ Ø§Ù„Ù…Ø±Ø¨Ø¹: Ø§Ù„Ø¶Ù„Ø¹ Ã— Ø§Ù„Ø¶Ù„Ø¹.
â€¢ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„: Ø§Ù„Ø·ÙˆÙ„ Ã— Ø§Ù„Ø¹Ø±Ø¶.
â€¢ Ø§Ù„Ù…Ø«Ù„Ø«: (Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ã— Ø§Ù„Ø§Ø±ØªÙØ§Ø¹) Ã· 2.
â€¢ Ø§Ù„Ù‚Ø±Øµ: Ï€ Ã— Ù†ØµÙ Ø§Ù„Ù‚Ø·Ø±Â².

ØªØ­ÙˆÙŠÙ„ Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª
1 Ù…Â² = 100 Ø¯Ø³Ù…Â² = 10000 Ø³Ù…Â². ØªÙØ­ÙˆÙ‘Ù„ Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª Ø¨Ù‚ÙØ²Ø§Øª 100 Ù„Ø§ 10.

Ù„Ø§ ØªØ®Ù„Ø·: Ø§Ù„Ù…Ø­ÙŠØ· Ø¨Ø§Ù„Ø³Ù… ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø© Ø¨Ø§Ù„Ø³Ù…Â².

ØªØ°ÙƒØ±: Ø§Ø±ØªÙØ§Ø¹ Ø§Ù„Ù…Ø«Ù„Ø« Ù‚Ø·Ø¹Ø© Ø¹Ù…ÙˆØ¯ÙŠØ© Ø¹Ù„Ù‰ Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© ØªÙ…Ø± Ø¨Ø§Ù„Ø±Ø£Ø³ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'aires-perimetres';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Aire d''un rectangle 7 cm Ã— 4 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø³ØªØ·ÙŠÙ„ 7 Ø³Ù… Ã— 4 Ø³Ù…ØŸ',
   '["28 cmÂ²","22 cmÂ²","11 cmÂ²","28 cm"]'::jsonb, '["28 Ø³Ù…Â²","22 Ø³Ù…Â²","11 Ø³Ù…Â²","28 Ø³Ù…"]'::jsonb,
   0, 'A = L Ã— l = 7 Ã— 4 = 28 cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© = 7 Ã— 4 = 28 Ø³Ù…Â².', 'easy', 1),
  ('PÃ©rimÃ¨tre d''un carrÃ© de cÃ´tÃ© 5 cm ?', 'Ù…Ø­ÙŠØ· Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 5 Ø³Ù…ØŸ',
   '["20 cm","25 cm","10 cm","15 cm"]'::jsonb, '["20 Ø³Ù…","25 Ø³Ù…","10 Ø³Ù…","15 Ø³Ù…"]'::jsonb,
   0, 'P = 4 Ã— 5 = 20 cm.', 'Ø§Ù„Ù…Ø­ÙŠØ· = 4 Ã— 5 = 20 Ø³Ù….', 'easy', 2),
  ('Aire d''un triangle : base 8, hauteur 5 ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø«Ù„Ø« Ù‚Ø§Ø¹Ø¯ØªÙ‡ 8 ÙˆØ§Ø±ØªÙØ§Ø¹Ù‡ 5ØŸ',
   '["20 cmÂ²","40 cmÂ²","13 cmÂ²","26 cmÂ²"]'::jsonb, '["20 Ø³Ù…Â²","40 Ø³Ù…Â²","13 Ø³Ù…Â²","26 Ø³Ù…Â²"]'::jsonb,
   0, 'A = (8Ã—5)/2 = 20 cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© = (8Ã—5)/2 = 20 Ø³Ù…Â².', 'medium', 3),
  ('1 mÂ² = ? cmÂ²', '1 Ù…Â² = ØŸ Ø³Ù…Â²',
   '["10 000","100","1000","10"]'::jsonb, '["10000","100","1000","10"]'::jsonb,
   0, '1 mÂ² = 10 000 cmÂ².', '1 Ù…Â² = 10000 Ø³Ù…Â².', 'medium', 4),
  ('Le pÃ©rimÃ¨tre se mesure en cm, l''aire enâ€¦', 'Ø§Ù„Ù…Ø­ÙŠØ· Ø¨Ø§Ù„Ø³Ù… ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø© Ø¨Ù€â€¦',
   '["cmÂ²","cm","cmÂ³","litres"]'::jsonb, '["Ø³Ù…Â²","Ø³Ù…","Ø³Ù…Â³","Ù„ØªØ±Ø§Øª"]'::jsonb,
   0, 'L''aire est une surface : cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ø³Ø·Ø­: Ø³Ù…Â².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AM' and s.slug = 'mathematiques' and c.slug = 'aires-perimetres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- ================= 2AM MATHÃ‰MATIQUES =================

update public.chapters c set
  lesson_fr = 'OPÃ‰RATIONS SUR LES NOMBRES RELATIFS

ADDITION DE DEUX RELATIFS
â€¢ MÃªmes signes : on additionne les distances Ã  zÃ©ro, on garde le signe.
  (+5) + (+3) = +8 ;  (âˆ’5) + (âˆ’3) = âˆ’8.
â€¢ Signes diffÃ©rents : on soustrait les distances, on garde le signe du plus
  grand en distance. (+7) + (âˆ’4) = +3 ;  (âˆ’7) + (+4) = âˆ’3.

SOUSTRACTION
Soustraire = ajouter l''opposÃ©.
(+5) âˆ’ (+8) = (+5) + (âˆ’8) = âˆ’3.
(âˆ’4) âˆ’ (âˆ’9) = (âˆ’4) + (+9) = +5.

MULTIPLICATION ET DIVISION â€” RÃˆGLE DES SIGNES
â€¢ (+) Ã— (+) = (+) et (âˆ’) Ã— (âˆ’) = (+).
â€¢ (+) Ã— (âˆ’) = (âˆ’) et (âˆ’) Ã— (+) = (âˆ’).
MÃªme rÃ¨gle pour la division.
(âˆ’6) Ã— (âˆ’2) = +12 ;  (âˆ’12) Ã· (+3) = âˆ’4.

Ã€ RETENIR : Â« moins par moins donne plus Â». Pour soustraire, on transforme
en addition de l''opposÃ©.',
  lesson_ar = 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†Ø³Ø¨ÙŠØ©

Ø¬Ù…Ø¹ Ø¹Ø¯Ø¯ÙŠÙ† Ù†Ø³Ø¨ÙŠÙŠÙ†
â€¢ Ù†ÙØ³ Ø§Ù„Ø¥Ø´Ø§Ø±Ø©: Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø¨Ø¹Ø¯ÙŠÙ† Ø¹Ù† Ø§Ù„ØµÙØ± ÙˆÙ†Ø­ØªÙØ¸ Ø¨Ø§Ù„Ø¥Ø´Ø§Ø±Ø©.
  (+5) + (+3) = +8 Ø› (âˆ’5) + (âˆ’3) = âˆ’8.
â€¢ Ø¥Ø´Ø§Ø±ØªØ§Ù† Ù…Ø®ØªÙ„ÙØªØ§Ù†: Ù†Ø·Ø±Ø­ Ø§Ù„Ø¨Ø¹Ø¯ÙŠÙ† ÙˆÙ†Ø­ØªÙØ¸ Ø¨Ø¥Ø´Ø§Ø±Ø© Ø§Ù„Ø£ÙƒØ¨Ø± Ø¨Ø¹Ø¯Ù‹Ø§.
  (+7) + (âˆ’4) = +3 Ø› (âˆ’7) + (+4) = âˆ’3.

Ø§Ù„Ø·Ø±Ø­
Ø§Ù„Ø·Ø±Ø­ = Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„.
(+5) âˆ’ (+8) = (+5) + (âˆ’8) = âˆ’3.

Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© â€” Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¥Ø´Ø§Ø±Ø§Øª
â€¢ (+) Ã— (+) = (+) Ùˆ (âˆ’) Ã— (âˆ’) = (+).
â€¢ (+) Ã— (âˆ’) = (âˆ’) Ùˆ (âˆ’) Ã— (+) = (âˆ’).
Ù†ÙØ³ Ø§Ù„Ù‚Ø§Ø¹Ø¯Ø© Ù„Ù„Ù‚Ø³Ù…Ø©.
(âˆ’6) Ã— (âˆ’2) = +12 Ø› (âˆ’12) Ã· (+3) = âˆ’4.

ØªØ°ÙƒØ±: Â«Ø³Ø§Ù„Ø¨ ÙÙŠ Ø³Ø§Ù„Ø¨ ÙŠØ¹Ø·ÙŠ Ù…ÙˆØ¬Ø¨Ù‹Ø§Â». ÙˆÙ„Ù„Ø·Ø±Ø­ Ù†Ø­ÙˆÙ‘Ù„ Ø¥Ù„Ù‰ Ø¬Ù…Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'relatifs-operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : (âˆ’5) + (âˆ’3)', 'Ø§Ø­Ø³Ø¨: (âˆ’5) + (âˆ’3)',
   '["âˆ’8","âˆ’2","+8","+2"]'::jsonb, '["âˆ’8","âˆ’2","+8","+2"]'::jsonb,
   0, 'MÃªmes signes : on ajoute, on garde le signe.', 'Ù†ÙØ³ Ø§Ù„Ø¥Ø´Ø§Ø±Ø©: Ù†Ø¬Ù…Ø¹ ÙˆÙ†Ø­ØªÙØ¸ Ø¨Ø§Ù„Ø¥Ø´Ø§Ø±Ø©.', 'easy', 1),
  ('Calcule : (+7) + (âˆ’4)', 'Ø§Ø­Ø³Ø¨: (+7) + (âˆ’4)',
   '["+3","âˆ’3","+11","âˆ’11"]'::jsonb, '["+3","âˆ’3","+11","âˆ’11"]'::jsonb,
   0, 'On soustrait, signe du plus grand : +3.', 'Ù†Ø·Ø±Ø­ØŒ Ø¥Ø´Ø§Ø±Ø© Ø§Ù„Ø£ÙƒØ¨Ø±: +3.', 'medium', 2),
  ('Calcule : (âˆ’6) Ã— (âˆ’2)', 'Ø§Ø­Ø³Ø¨: (âˆ’6) Ã— (âˆ’2)',
   '["+12","âˆ’12","âˆ’8","+8"]'::jsonb, '["+12","âˆ’12","âˆ’8","+8"]'::jsonb,
   0, 'Moins par moins = plus.', 'Ø³Ø§Ù„Ø¨ ÙÙŠ Ø³Ø§Ù„Ø¨ = Ù…ÙˆØ¬Ø¨.', 'easy', 3),
  ('Calcule : (+5) âˆ’ (+8)', 'Ø§Ø­Ø³Ø¨: (+5) âˆ’ (+8)',
   '["âˆ’3","+3","+13","âˆ’13"]'::jsonb, '["âˆ’3","+3","+13","âˆ’13"]'::jsonb,
   0, '(+5) + (âˆ’8) = âˆ’3.', '(+5) + (âˆ’8) = âˆ’3.', 'medium', 4),
  ('Calcule : (âˆ’12) Ã· (+3)', 'Ø§Ø­Ø³Ø¨: (âˆ’12) Ã· (+3)',
   '["âˆ’4","+4","âˆ’9","âˆ’36"]'::jsonb, '["âˆ’4","+4","âˆ’9","âˆ’36"]'::jsonb,
   0, 'Signes diffÃ©rents = nÃ©gatif : âˆ’4.', 'Ø¥Ø´Ø§Ø±ØªØ§Ù† Ù…Ø®ØªÙ„ÙØªØ§Ù† = Ø³Ø§Ù„Ø¨: âˆ’4.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'relatifs-operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'OPÃ‰RATIONS SUR LES FRACTIONS

METTRE AU MÃŠME DÃ‰NOMINATEUR
Pour additionner ou soustraire, il faut le mÃªme dÃ©nominateur.
1/3 + 1/4 : dÃ©nominateur commun 12 â†’ 4/12 + 3/12 = 7/12.

MULTIPLICATION
On multiplie les numÃ©rateurs entre eux, les dÃ©nominateurs entre eux.
2/3 Ã— 5/7 = 10/21. On peut simplifier avant de calculer.

DIVISION
Diviser par une fraction = multiplier par son inverse.
2/3 Ã· 4/5 = 2/3 Ã— 5/4 = 10/12 = 5/6.

FRACTION D''UNE FRACTION
Les 2/3 de 3/4 : 2/3 Ã— 3/4 = 6/12 = 1/2.

SIMPLIFIER
On divise numÃ©rateur et dÃ©nominateur par le mÃªme nombre jusqu''Ã  la forme
irrÃ©ductible : 18/24 = 3/4 (Ã·6).

Ã€ RETENIR : on additionne SEULEMENT au mÃªme dÃ©nominateur ; on multiplie
directement ; on divise en multipliant par l''inverse.',
  lesson_ar = 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø¹Ù„Ù‰ Ø§Ù„ÙƒØ³ÙˆØ±

ØªÙˆØ­ÙŠØ¯ Ø§Ù„Ù…Ù‚Ø§Ù…Ø§Øª
Ù„Ù„Ø¬Ù…Ø¹ Ø£Ùˆ Ø§Ù„Ø·Ø±Ø­ ÙŠØ¬Ø¨ ØªÙˆØ­ÙŠØ¯ Ø§Ù„Ù…Ù‚Ø§Ù….
1/3 + 1/4: Ø§Ù„Ù…Ù‚Ø§Ù… Ø§Ù„Ù…Ø´ØªØ±Ùƒ 12 â† 4/12 + 3/12 = 7/12.

Ø§Ù„Ø¶Ø±Ø¨
Ù†Ø¶Ø±Ø¨ Ø§Ù„Ø¨Ø³Ø· ÙÙŠ Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù… ÙÙŠ Ø§Ù„Ù…Ù‚Ø§Ù….
2/3 Ã— 5/7 = 10/21. ÙŠÙ…ÙƒÙ† Ø§Ù„Ø§Ø®ØªØ²Ø§Ù„ Ù‚Ø¨Ù„ Ø§Ù„Ø­Ø³Ø§Ø¨.

Ø§Ù„Ù‚Ø³Ù…Ø©
Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹Ù„Ù‰ ÙƒØ³Ø± = Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ Ù…Ù‚Ù„ÙˆØ¨Ù‡.
2/3 Ã· 4/5 = 2/3 Ã— 5/4 = 5/6.

ÙƒØ³Ø± Ù…Ù† ÙƒØ³Ø±
2/3 Ù…Ù† 3/4: 2/3 Ã— 3/4 = 1/2.

Ø§Ù„Ø§Ø®ØªØ²Ø§Ù„
Ù†Ù‚Ø³Ù… Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù… Ø¹Ù„Ù‰ Ù†ÙØ³ Ø§Ù„Ø¹Ø¯Ø¯ Ø­ØªÙ‰ Ø§Ù„ØµÙˆØ±Ø© ØºÙŠØ± Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø§Ø®ØªØ²Ø§Ù„: 18/24 = 3/4.

ØªØ°ÙƒØ±: Ù†Ø¬Ù…Ø¹ ÙÙ‚Ø· Ø¨Ù†ÙØ³ Ø§Ù„Ù…Ù‚Ø§Ù…ØŒ ÙˆÙ†Ø¶Ø±Ø¨ Ù…Ø¨Ø§Ø´Ø±Ø©ØŒ ÙˆÙ†Ù‚Ø³Ù… Ø¨Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ Ø§Ù„Ù…Ù‚Ù„ÙˆØ¨.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'fractions-operations';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 1/3 + 1/4', 'Ø§Ø­Ø³Ø¨: 1/3 + 1/4',
   '["7/12","2/7","2/12","1/7"]'::jsonb, '["7/12","2/7","2/12","1/7"]'::jsonb,
   0, 'DÃ©nominateur 12 : 4/12 + 3/12 = 7/12.', 'Ø§Ù„Ù…Ù‚Ø§Ù… 12: 4/12 + 3/12 = 7/12.', 'medium', 1),
  ('Calcule : 2/3 Ã— 5/7', 'Ø§Ø­Ø³Ø¨: 2/3 Ã— 5/7',
   '["10/21","7/10","10/10","2/7"]'::jsonb, '["10/21","7/10","10/10","2/7"]'::jsonb,
   0, 'NumÃ©rateurs et dÃ©nominateurs : 10/21.', 'Ø§Ù„Ø¨Ø³Ø· ÙÙŠ Ø§Ù„Ø¨Ø³Ø· ÙˆØ§Ù„Ù…Ù‚Ø§Ù… ÙÙŠ Ø§Ù„Ù…Ù‚Ø§Ù…: 10/21.', 'easy', 2),
  ('Calcule : 2/3 Ã· 4/5', 'Ø§Ø­Ø³Ø¨: 2/3 Ã· 4/5',
   '["5/6","8/15","6/5","10/7"]'::jsonb, '["5/6","8/15","6/5","10/7"]'::jsonb,
   0, '2/3 Ã— 5/4 = 10/12 = 5/6.', '2/3 Ã— 5/4 = 5/6.', 'medium', 3),
  ('Simplifie : 18/24', 'Ø§Ø®ØªØ²Ù„: 18/24',
   '["3/4","9/12","2/3","6/8"]'::jsonb, '["3/4","9/12","2/3","6/8"]'::jsonb,
   0, 'On divise par 6 : 18/24 = 3/4.', 'Ù†Ù‚Ø³Ù… Ø¹Ù„Ù‰ 6: 3/4.', 'easy', 4),
  ('Les 2/3 de 3/4 = ?', '2/3 Ù…Ù† 3/4 = ØŸ',
   '["1/2","5/7","6/7","2/4"]'::jsonb, '["1/2","5/7","6/7","2/4"]'::jsonb,
   0, '2/3 Ã— 3/4 = 6/12 = 1/2.', '2/3 Ã— 3/4 = 1/2.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'fractions-operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'CALCUL LITTÃ‰RAL (initiation)

UNE EXPRESSION LITTÃ‰RALE
C''est un calcul contenant des lettres (variables). Ex. 3x + 5.
On peut CALCULER SA VALEUR en remplaÃ§ant la lettre par un nombre :
pour x = 2, 3x + 5 = 3Ã—2 + 5 = 11.

CONVENTIONS D''Ã‰CRITURE
On n''Ã©crit pas le signe Ã— devant une lettre : 3 Ã— x = 3x.
x Ã— x = xÂ². 1 Ã— x = x.

RÃ‰DUIRE UNE EXPRESSION
On regroupe les termes SEMBLABLES (mÃªmes lettres) :
3x + 5x = 8x ;  2x + 3 + 4x + 1 = 6x + 4.
On ne peut PAS additionner 3x et 5 (termes diffÃ©rents).

LA DISTRIBUTIVITÃ‰ (dÃ©velopper)
k(a + b) = ka + kb.
3(x + 2) = 3x + 6 ;  5(2x âˆ’ 1) = 10x âˆ’ 5.

Ã€ RETENIR : on ne rÃ©duit qu''entre termes semblables. Â« DÃ©velopper Â», c''est
supprimer les parenthÃ¨ses avec la distributivitÃ©.',
  lesson_ar = 'Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø­Ø±ÙÙŠ (ØªÙ…Ù‡ÙŠØ¯)

Ø§Ù„Ø¹Ø¨Ø§Ø±Ø© Ø§Ù„Ø­Ø±ÙÙŠØ©
Ø­Ø³Ø§Ø¨ ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ø­Ø±ÙˆÙ (Ù…ØªØºÙŠØ±Ø§Øª). Ù…Ø«Ø§Ù„: 3x + 5.
Ù†Ø­Ø³Ø¨ Ù‚ÙŠÙ…ØªÙ‡Ø§ Ø¨ØªØ¹ÙˆÙŠØ¶ Ø§Ù„Ø­Ø±Ù Ø¨Ø¹Ø¯Ø¯: Ù…Ù† Ø£Ø¬Ù„ x = 2ØŒ 3x + 5 = 11.

Ø§ØµØ·Ù„Ø§Ø­Ø§Øª Ø§Ù„ÙƒØªØ§Ø¨Ø©
Ù„Ø§ Ù†ÙƒØªØ¨ Ã— Ø£Ù…Ø§Ù… Ø­Ø±Ù: 3 Ã— x = 3x. Ùˆ x Ã— x = xÂ². Ùˆ 1 Ã— x = x.

Ø§Ø®ØªØ²Ø§Ù„ Ø¹Ø¨Ø§Ø±Ø©
Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø­Ø¯ÙˆØ¯ Ø§Ù„Ù…ØªØ´Ø§Ø¨Ù‡Ø© (Ù†ÙØ³ Ø§Ù„Ø­Ø±ÙˆÙ):
3x + 5x = 8x Ø› 2x + 3 + 4x + 1 = 6x + 4.
Ù„Ø§ Ù†Ø¬Ù…Ø¹ 3x Ùˆ5 (Ø­Ø¯Ù‘Ø§Ù† Ù…Ø®ØªÙ„ÙØ§Ù†).

Ø§Ù„ØªÙˆØ²ÙŠØ¹ÙŠØ© (Ø§Ù„Ù†Ø´Ø±)
k(a + b) = ka + kb.
3(x + 2) = 3x + 6 Ø› 5(2x âˆ’ 1) = 10x âˆ’ 5.

ØªØ°ÙƒØ±: Ù†Ø®ØªØ²Ù„ ÙÙ‚Ø· Ø¨ÙŠÙ† Ø§Ù„Ø­Ø¯ÙˆØ¯ Ø§Ù„Ù…ØªØ´Ø§Ø¨Ù‡Ø©. Ø§Ù„Ù†Ø´Ø± = Ø¥Ø²Ø§Ù„Ø© Ø§Ù„Ø£Ù‚ÙˆØ§Ø³ Ø¨Ø§Ù„ØªÙˆØ²ÙŠØ¹ÙŠØ©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Pour x = 2, que vaut 3x + 5 ?', 'Ù…Ù† Ø£Ø¬Ù„ x = 2ØŒ ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ 3x + 5ØŸ',
   '["11","10","16","8"]'::jsonb, '["11","10","16","8"]'::jsonb,
   0, '3Ã—2 + 5 = 11.', '3Ã—2 + 5 = 11.', 'easy', 1),
  ('RÃ©duis : 3x + 5x', 'Ø§Ø®ØªØ²Ù„: 3x + 5x',
   '["8x","8xÂ²","15x","8"]'::jsonb, '["8x","8xÂ²","15x","8"]'::jsonb,
   0, 'Termes semblables : 3x+5x = 8x.', 'Ø­Ø¯ÙˆØ¯ Ù…ØªØ´Ø§Ø¨Ù‡Ø©: 8x.', 'easy', 2),
  ('DÃ©veloppe : 3(x + 2)', 'Ø§Ù†Ø´Ø±: 3(x + 2)',
   '["3x + 6","3x + 2","x + 6","3x + 5"]'::jsonb, '["3x + 6","3x + 2","x + 6","3x + 5"]'::jsonb,
   0, 'k(a+b) = ka+kb.', 'k(a+b) = ka+kb.', 'medium', 3),
  ('RÃ©duis : 2x + 3 + 4x + 1', 'Ø§Ø®ØªØ²Ù„: 2x + 3 + 4x + 1',
   '["6x + 4","6x + 3","8x","10x"]'::jsonb, '["6x + 4","6x + 3","8x","10x"]'::jsonb,
   0, '(2x+4x) + (3+1) = 6x + 4.', '(2x+4x) + (3+1) = 6x + 4.', 'medium', 4),
  ('DÃ©veloppe : 5(2x âˆ’ 1)', 'Ø§Ù†Ø´Ø±: 5(2x âˆ’ 1)',
   '["10x âˆ’ 5","10x âˆ’ 1","7x âˆ’ 5","10x + 5"]'::jsonb, '["10x âˆ’ 5","10x âˆ’ 1","7x âˆ’ 5","10x + 5"]'::jsonb,
   0, '5Ã—2x âˆ’ 5Ã—1 = 10x âˆ’ 5.', '10x âˆ’ 5.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'calcul-litteral'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'PROPORTIONNALITÃ‰ ET POURCENTAGES

RAPPEL
Deux grandeurs proportionnelles ont un coefficient constant.

LES POURCENTAGES
â€¢ Calculer t % d''une valeur : (t Ã— valeur) Ã· 100.
  15 % de 200 = (15 Ã— 200) Ã· 100 = 30.
â€¢ Augmentation de 10 % : on multiplie par 1,10.
â€¢ RÃ©duction de 20 % : on multiplie par 0,80.

L''Ã‰CHELLE
Sur une carte, l''Ã©chelle 1/100 000 signifie : 1 cm sur la carte = 100 000 cm
= 1 km dans la rÃ©alitÃ©.
distance rÃ©elle = distance carte Ã— dÃ©nominateur de l''Ã©chelle.

LA VITESSE MOYENNE
v = distance Ã· temps. UnitÃ©s cohÃ©rentes (km et h, ou m et s).
150 km en 2 h â†’ v = 75 km/h.

Ã€ RETENIR : un pourcentage est une proportion sur 100. Augmenter de t %,
c''est multiplier par (1 + t/100).',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø§Ø³Ø¨ÙŠØ© ÙˆØ§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø¦ÙˆÙŠØ©

ØªØ°ÙƒÙŠØ±
Ø§Ù„Ù…Ù‚Ø¯Ø§Ø±Ø§Ù† Ø§Ù„Ù…ØªÙ†Ø§Ø³Ø¨Ø§Ù† Ù„Ù‡Ù…Ø§ Ù…Ø¹Ø§Ù…Ù„ Ø«Ø§Ø¨Øª.

Ø§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø¦ÙˆÙŠØ©
â€¢ Ø­Ø³Ø§Ø¨ t% Ù…Ù† Ù‚ÙŠÙ…Ø©: (t Ã— Ø§Ù„Ù‚ÙŠÙ…Ø©) Ã· 100.
  15% Ù…Ù† 200 = 30.
â€¢ Ø²ÙŠØ§Ø¯Ø© Ø¨Ù€ 10%: Ù†Ø¶Ø±Ø¨ ÙÙŠ 1.10.
â€¢ ØªØ®ÙÙŠØ¶ Ø¨Ù€ 20%: Ù†Ø¶Ø±Ø¨ ÙÙŠ 0.80.

Ø§Ù„Ø³Ù„Ù‘Ù…
Ø¹Ù„Ù‰ Ø®Ø±ÙŠØ·Ø©ØŒ Ø§Ù„Ø³Ù„Ù‘Ù… 1/100000 ÙŠØ¹Ù†ÙŠ: 1 Ø³Ù… Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø© = 100000 Ø³Ù… = 1 ÙƒÙ… ÙÙŠ Ø§Ù„ÙˆØ§Ù‚Ø¹.
Ø§Ù„Ù…Ø³Ø§ÙØ© Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© = Ù…Ø³Ø§ÙØ© Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ã— Ù…Ù‚Ø§Ù… Ø§Ù„Ø³Ù„Ù‘Ù….

Ø§Ù„Ø³Ø±Ø¹Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©
v = Ø§Ù„Ù…Ø³Ø§ÙØ© Ã· Ø§Ù„Ø²Ù…Ù† (ÙˆØ­Ø¯Ø§Øª Ù…ØªØ¬Ø§Ù†Ø³Ø©). 150 ÙƒÙ… ÙÙŠ Ø³Ø§Ø¹ØªÙŠÙ† â† 75 ÙƒÙ…/Ø³Ø§.

ØªØ°ÙƒØ±: Ø§Ù„Ù†Ø³Ø¨Ø© Ø§Ù„Ù…Ø¦ÙˆÙŠØ© ØªÙ†Ø§Ø³Ø¨ Ù…Ù† 100. Ø§Ù„Ø²ÙŠØ§Ø¯Ø© Ø¨Ù€ t% = Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ (1 + t/100).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('15 % de 200 = ?', '15% Ù…Ù† 200 = ØŸ',
   '["30","15","20","45"]'::jsonb, '["30","15","20","45"]'::jsonb,
   0, '(15Ã—200)/100 = 30.', '(15Ã—200)/100 = 30.', 'easy', 1),
  ('Augmenter 50 de 10 % donneâ€¦', 'Ø²ÙŠØ§Ø¯Ø© 50 Ø¨Ù€ 10% ØªØ¹Ø·ÙŠâ€¦',
   '["55","60","51","10"]'::jsonb, '["55","60","51","10"]'::jsonb,
   0, '50 Ã— 1,10 = 55.', '50 Ã— 1.10 = 55.', 'medium', 2),
  ('Ã‰chelle 1/100 000 : 3 cm sur la carte = ? rÃ©el', 'Ø§Ù„Ø³Ù„Ù‘Ù… 1/100000: 3 Ø³Ù… Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø© = ØŸ ÙÙŠ Ø§Ù„ÙˆØ§Ù‚Ø¹',
   '["3 km","300 m","30 km","3 m"]'::jsonb, '["3 ÙƒÙ…","300 Ù…","30 ÙƒÙ…","3 Ù…"]'::jsonb,
   0, '3 Ã— 100 000 = 300 000 cm = 3 km.', '3 Ã— 100000 = 3 ÙƒÙ….', 'medium', 3),
  ('150 km en 2 h : vitesse moyenne ?', '150 ÙƒÙ… ÙÙŠ Ø³Ø§Ø¹ØªÙŠÙ†: Ø§Ù„Ø³Ø±Ø¹Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©ØŸ',
   '["75 km/h","300 km/h","152 km/h","50 km/h"]'::jsonb, '["75 ÙƒÙ…/Ø³Ø§","300 ÙƒÙ…/Ø³Ø§","152 ÙƒÙ…/Ø³Ø§","50 ÙƒÙ…/Ø³Ø§"]'::jsonb,
   0, 'v = 150/2 = 75 km/h.', 'v = 150/2 = 75 ÙƒÙ…/Ø³Ø§.', 'easy', 4),
  ('RÃ©duire un prix de 20 %, c''est multiplier parâ€¦', 'ØªØ®ÙÙŠØ¶ Ø«Ù…Ù† Ø¨Ù€ 20% = Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠâ€¦',
   '["0,80","1,20","0,20","0,08"]'::jsonb, '["0.80","1.20","0.20","0.08"]'::jsonb,
   0, '100 % âˆ’ 20 % = 80 % â†’ Ã—0,80.', '100% âˆ’ 20% = 80% â† Ã—0.80.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'proportionnalite'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LA SYMÃ‰TRIE CENTRALE

DÃ‰FINITION
Le symÃ©trique d''un point M par rapport Ã  un point O est le point M'' tel que
O est le MILIEU du segment [MM'']. On dit qu''on a fait un demi-tour (180Â°)
autour de O.

CONSTRUCTION
Pour construire M'' : on trace la demi-droite [MO), et on reporte la distance
OM de l''autre cÃ´tÃ© : OM'' = OM.

PROPRIÃ‰TÃ‰S
La symÃ©trie centrale CONSERVE :
â€¢ les longueurs (un segment et son image ont mÃªme longueur),
â€¢ les angles (mÃªmes mesures),
â€¢ le parallÃ©lisme et l''alignement,
â€¢ les aires.
L''image d''une droite est une droite qui lui est PARALLÃˆLE.

CENTRE DE SYMÃ‰TRIE D''UNE FIGURE
Une figure a un centre de symÃ©trie O si elle se superpose Ã  elle-mÃªme aprÃ¨s
un demi-tour autour de O (ex. le cercle, le rectangle, le parallÃ©logramme).

DIFFÃ‰RENCE avec la symÃ©trie axiale : la symÃ©trie axiale est un pliage
(par rapport Ã  une droite) ; la symÃ©trie centrale est un demi-tour
(par rapport Ã  un point).',
  lesson_ar = 'Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ

ØªØ¹Ø±ÙŠÙ
Ù†Ø¸ÙŠØ± Ø§Ù„Ù†Ù‚Ø·Ø© M Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù„Ù†Ù‚Ø·Ø© O Ù‡Ùˆ Ø§Ù„Ù†Ù‚Ø·Ø© M'' Ø¨Ø­ÙŠØ« O Ù…Ù†ØªØµÙ Ø§Ù„Ù‚Ø·Ø¹Ø© [MM''].
Ø£ÙŠ Ø£Ù†Ù†Ø§ Ù‚Ù…Ù†Ø§ Ø¨Ù†ØµÙ Ø¯ÙˆØ±Ø© (180Â°) Ø­ÙˆÙ„ O.

Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡
Ù„Ø¥Ù†Ø´Ø§Ø¡ M'': Ù†Ø±Ø³Ù… Ù†ØµÙ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… [MO) ÙˆÙ†Ù†Ù‚Ù„ Ø§Ù„Ù…Ø³Ø§ÙØ© OM Ø¥Ù„Ù‰ Ø§Ù„Ø¬Ù‡Ø© Ø§Ù„Ø£Ø®Ø±Ù‰: OM'' = OM.

Ø§Ù„Ø®ØµØ§Ø¦Øµ
ÙŠØ­Ø§ÙØ¸ Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ø¹Ù„Ù‰:
â€¢ Ø§Ù„Ø£Ø·ÙˆØ§Ù„ØŒ â€¢ Ø§Ù„Ø²ÙˆØ§ÙŠØ§ØŒ â€¢ Ø§Ù„ØªÙˆØ§Ø²ÙŠ ÙˆØ§Ù„Ø§Ø³ØªÙ‚Ø§Ù…ÙŠØ©ØŒ â€¢ Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª.
ØµÙˆØ±Ø© Ù…Ø³ØªÙ‚ÙŠÙ… Ù‡ÙŠ Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙˆØ§Ø²ÙŠÙ‡.

Ù…Ø±ÙƒØ² ØªÙ†Ø§Ø¸Ø± Ø´ÙƒÙ„
Ù„Ù„Ø´ÙƒÙ„ Ù…Ø±ÙƒØ² ØªÙ†Ø§Ø¸Ø± O Ø¥Ø°Ø§ Ø§Ù†Ø·Ø¨Ù‚ Ø¹Ù„Ù‰ Ù†ÙØ³Ù‡ Ø¨Ø¹Ø¯ Ù†ØµÙ Ø¯ÙˆØ±Ø© Ø­ÙˆÙ„ O (Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©ØŒ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„ØŒ Ù…ØªÙˆØ§Ø²ÙŠ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹).

Ø§Ù„ÙØ±Ù‚ Ù…Ø¹ Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø­ÙˆØ±ÙŠ: Ø§Ù„Ù…Ø­ÙˆØ±ÙŠ Ø·ÙŠÙ‘ (Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù…Ø³ØªÙ‚ÙŠÙ…)ØŒ ÙˆØ§Ù„Ù…Ø±ÙƒØ²ÙŠ Ù†ØµÙ Ø¯ÙˆØ±Ø© (Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù†Ù‚Ø·Ø©).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'symetrie-centrale';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('La symÃ©trie centrale correspond Ã  unâ€¦', 'Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ ÙŠÙˆØ§ÙÙ‚â€¦',
   '["demi-tour (180Â°)","pliage","quart de tour","agrandissement"]'::jsonb, '["Ù†ØµÙ Ø¯ÙˆØ±Ø© (180Â°)","Ø·ÙŠÙ‘","Ø±Ø¨Ø¹ Ø¯ÙˆØ±Ø©","ØªÙƒØ¨ÙŠØ±"]'::jsonb,
   0, 'Demi-tour autour du centre.', 'Ù†ØµÙ Ø¯ÙˆØ±Ø© Ø­ÙˆÙ„ Ø§Ù„Ù…Ø±ÙƒØ².', 'easy', 1),
  ('Si M'' est le symÃ©trique de M par rapport Ã  O, alors O estâ€¦', 'Ø¥Ø°Ø§ ÙƒØ§Ù†Øª M'' Ù†Ø¸ÙŠØ±Ø© M Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù€ O ÙØ¥Ù† O Ù‡ÙŠâ€¦',
   '["le milieu de [MM'']","une extrÃ©mitÃ©","en dehors","confondu avec M"]'::jsonb, '["Ù…Ù†ØªØµÙ [MM'']","Ø·Ø±Ù","Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ø·Ø¹Ø©","Ù…Ù†Ø·Ø¨Ù‚Ø© Ø¹Ù„Ù‰ M"]'::jsonb,
   0, 'O est le milieu de [MM''].', 'O Ù…Ù†ØªØµÙ [MM''].', 'medium', 2),
  ('La symÃ©trie centrale conserveâ€¦', 'ÙŠØ­Ø§ÙØ¸ Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ø¹Ù„Ù‰â€¦',
   '["les longueurs et les angles","seulement les couleurs","rien","seulement le sens"]'::jsonb, '["Ø§Ù„Ø£Ø·ÙˆØ§Ù„ ÙˆØ§Ù„Ø²ÙˆØ§ÙŠØ§","Ø§Ù„Ø£Ù„ÙˆØ§Ù† ÙÙ‚Ø·","Ù„Ø§ Ø´ÙŠØ¡","Ø§Ù„Ù…Ù†Ø­Ù‰ ÙÙ‚Ø·"]'::jsonb,
   0, 'Longueurs, angles, aires sont conservÃ©s.', 'ÙŠØ­Ø§ÙØ¸ Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø·ÙˆØ§Ù„ ÙˆØ§Ù„Ø²ÙˆØ§ÙŠØ§ ÙˆØ§Ù„Ù…Ø³Ø§Ø­Ø§Øª.', 'medium', 3),
  ('L''image d''une droite par symÃ©trie centrale estâ€¦', 'ØµÙˆØ±Ø© Ù…Ø³ØªÙ‚ÙŠÙ… Ø¨Ø§Ù„ØªÙ†Ø§Ø¸Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ù‡ÙŠâ€¦',
   '["une droite parallÃ¨le","un cercle","un point","une courbe"]'::jsonb, '["Ù…Ø³ØªÙ‚ÙŠÙ… Ù…ÙˆØ§Ø²Ù","Ø¯Ø§Ø¦Ø±Ø©","Ù†Ù‚Ø·Ø©","Ù…Ù†Ø­Ù†Ù‰"]'::jsonb,
   0, 'Une droite parallÃ¨le Ã  la premiÃ¨re.', 'Ù…Ø³ØªÙ‚ÙŠÙ… ÙŠÙˆØ§Ø²ÙŠ Ø§Ù„Ø£ÙˆÙ„.', 'easy', 4),
  ('Laquelle a un centre de symÃ©trie ?', 'Ø£ÙŠ Ø´ÙƒÙ„ Ù„Ù‡ Ù…Ø±ÙƒØ² ØªÙ†Ø§Ø¸Ø±ØŸ',
   '["le rectangle","le triangle quelconque","le triangle isocÃ¨le seul","la lettre A"]'::jsonb, '["Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„","Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„ÙƒÙŠÙÙŠ","Ø§Ù„Ù…ØªÙ‚Ø§ÙŠØ³ Ø§Ù„Ø³Ø§Ù‚ÙŠÙ† ÙÙ‚Ø·","Ø§Ù„Ø­Ø±Ù A"]'::jsonb,
   0, 'Le rectangle a un centre de symÃ©trie (son centre).', 'Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„ Ù„Ù‡ Ù…Ø±ÙƒØ² ØªÙ†Ø§Ø¸Ø±.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'symetrie-centrale'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'ANGLES ET PARALLÃ‰LISME

DEUX DROITES COUPÃ‰ES PAR UNE SÃ‰CANTE
Quand une droite (sÃ©cante) coupe deux autres droites, elle forme des paires
d''angles remarquables :
â€¢ Angles ALTERNES-INTERNES : de part et d''autre de la sÃ©cante, entre les
  deux droites.
â€¢ Angles CORRESPONDANTS : mÃªme position par rapport Ã  la sÃ©cante et Ã  chaque
  droite.

PROPRIÃ‰TÃ‰ FONDAMENTALE
Si les deux droites sont PARALLÃˆLES, alors :
â€¢ les angles alternes-internes sont Ã‰GAUX,
â€¢ les angles correspondants sont Ã‰GAUX.

RÃ‰CIPROQUE (pour prouver le parallÃ©lisme)
Si deux angles alternes-internes sont Ã©gaux (ou deux correspondants Ã©gaux),
alors les deux droites sont PARALLÃˆLES.

ANGLES OPPOSÃ‰S PAR LE SOMMET
Toujours Ã©gaux, que les droites soient parallÃ¨les ou non.

Ã€ RETENIR : Â« alternes-internes Ã©gaux Â» âŸº Â« droites parallÃ¨les Â». C''est
l''outil pour dÃ©montrer que deux droites sont parallÃ¨les.',
  lesson_ar = 'Ø§Ù„Ø²ÙˆØ§ÙŠØ§ ÙˆØ§Ù„ØªÙˆØ§Ø²ÙŠ

Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† ÙŠÙ‚Ø·Ø¹Ù‡Ù…Ø§ Ù‚Ø§Ø·Ø¹
Ø¹Ù†Ø¯Ù…Ø§ ÙŠÙ‚Ø·Ø¹ Ù…Ø³ØªÙ‚ÙŠÙ… (Ù‚Ø§Ø·Ø¹) Ù…Ø³ØªÙ‚ÙŠÙ…ÙŠÙ† Ø¢Ø®Ø±ÙŠÙ† ÙŠÙƒÙˆÙ‘Ù† Ø£Ø²ÙˆØ§Ø¬ Ø²ÙˆØ§ÙŠØ§ Ù…Ù…ÙŠØ²Ø©:
â€¢ Ø²ÙˆØ§ÙŠØ§ Ù…ØªØ¨Ø§Ø¯Ù„Ø© Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§: Ø¹Ù„Ù‰ Ø¬Ø§Ù†Ø¨ÙŠ Ø§Ù„Ù‚Ø§Ø·Ø¹ Ø¨ÙŠÙ† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…ÙŠÙ†.
â€¢ Ø²ÙˆØ§ÙŠØ§ Ù…ØªÙ†Ø§Ø¸Ø±Ø©: Ù†ÙØ³ Ø§Ù„Ù…ÙˆØ¶Ø¹ Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ù„Ù‚Ø§Ø·Ø¹ ÙˆÙ„ÙƒÙ„ Ù…Ø³ØªÙ‚ÙŠÙ….

Ø§Ù„Ø®Ø§ØµÙŠØ© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©
Ø¥Ø°Ø§ ÙƒØ§Ù† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠÙŠÙ† ÙØ¥Ù†:
â€¢ Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„Ø© Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§ Ù…ØªØ³Ø§ÙˆÙŠØ©ØŒ
â€¢ Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…ØªÙ†Ø§Ø¸Ø±Ø© Ù…ØªØ³Ø§ÙˆÙŠØ©.

Ø§Ù„Ø¹ÙƒØ³ (Ù„Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªÙˆØ§Ø²ÙŠ)
Ø¥Ø°Ø§ ØªØ³Ø§ÙˆØª Ø²Ø§ÙˆÙŠØªØ§Ù† Ù…ØªØ¨Ø§Ø¯Ù„ØªØ§Ù† Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§ (Ø£Ùˆ Ù…ØªÙ†Ø§Ø¸Ø±ØªØ§Ù†) ÙØ§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†.

Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…ØªÙ‚Ø§Ø¨Ù„Ø© Ø¨Ø§Ù„Ø±Ø£Ø³
Ù…ØªØ³Ø§ÙˆÙŠØ© Ø¯Ø§Ø¦Ù…Ù‹Ø§ØŒ Ø³ÙˆØ§Ø¡ ÙƒØ§Ù† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠÙŠÙ† Ø£Ù… Ù„Ø§.

ØªØ°ÙƒØ±: Â«Ù…ØªØ¨Ø§Ø¯Ù„ØªØ§Ù† Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§ Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù†Â» âŸº Â«Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†Â».'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'angles-parallelisme';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les angles opposÃ©s par le sommet sontâ€¦', 'Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…ØªÙ‚Ø§Ø¨Ù„Ø© Ø¨Ø§Ù„Ø±Ø£Ø³â€¦',
   '["toujours Ã©gaux","toujours supplÃ©mentaires","toujours droits","jamais Ã©gaux"]'::jsonb, '["Ù…ØªØ³Ø§ÙˆÙŠØ© Ø¯Ø§Ø¦Ù…Ù‹Ø§","Ù…ØªÙƒØ§Ù…Ù„Ø© Ø¯Ø§Ø¦Ù…Ù‹Ø§","Ù‚Ø§Ø¦Ù…Ø© Ø¯Ø§Ø¦Ù…Ù‹Ø§","ØºÙŠØ± Ù…ØªØ³Ø§ÙˆÙŠØ© Ø£Ø¨Ø¯Ù‹Ø§"]'::jsonb,
   0, 'Toujours Ã©gaux.', 'Ù…ØªØ³Ø§ÙˆÙŠØ© Ø¯Ø§Ø¦Ù…Ù‹Ø§.', 'easy', 1),
  ('Si deux droites sont parallÃ¨les, les angles alternes-internes sontâ€¦', 'Ø¥Ø°Ø§ ÙƒØ§Ù† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠÙŠÙ† ÙØ§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„Ø© Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§â€¦',
   '["Ã©gaux","supplÃ©mentaires","complÃ©mentaires","nuls"]'::jsonb, '["Ù…ØªØ³Ø§ÙˆÙŠØ©","Ù…ØªÙƒØ§Ù…Ù„Ø©","Ù…ØªØªØ§Ù…Ù‘Ø©","Ù…Ø¹Ø¯ÙˆÙ…Ø©"]'::jsonb,
   0, 'ParallÃ¨les â†’ alternes-internes Ã©gaux.', 'Ø§Ù„ØªÙˆØ§Ø²ÙŠ â† Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„Ø© Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§ Ù…ØªØ³Ø§ÙˆÙŠØ©.', 'medium', 2),
  ('Deux angles correspondants Ã©gaux prouvent que les droites sontâ€¦', 'Ø²Ø§ÙˆÙŠØªØ§Ù† Ù…ØªÙ†Ø§Ø¸Ø±ØªØ§Ù† Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù† ØªØ«Ø¨ØªØ§Ù† Ø£Ù† Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…ÙŠÙ†â€¦',
   '["parallÃ¨les","perpendiculaires","sÃ©cants","confondus"]'::jsonb, '["Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†","Ù…ØªØ¹Ø§Ù…Ø¯Ø§Ù†","Ù…ØªÙ‚Ø§Ø·Ø¹Ø§Ù†","Ù…Ù†Ø·Ø¨Ù‚Ø§Ù†"]'::jsonb,
   0, 'RÃ©ciproque : correspondants Ã©gaux â†’ parallÃ¨les.', 'Ø§Ù„Ø¹ÙƒØ³: Ù…ØªÙ†Ø§Ø¸Ø±ØªØ§Ù† Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù† â† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù†.', 'medium', 3),
  ('Deux droites parallÃ¨les coupÃ©es par une sÃ©cante : un angle vaut 65Â°, son alterne-interne vautâ€¦', 'Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Ù† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù† ÙŠÙ‚Ø·Ø¹Ù‡Ù…Ø§ Ù‚Ø§Ø·Ø¹: Ø²Ø§ÙˆÙŠØ© 65Â°ØŒ Ù…ØªØ¨Ø§Ø¯Ù„ØªÙ‡Ø§ Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§â€¦',
   '["65Â°","115Â°","25Â°","180Â°"]'::jsonb, '["65Â°","115Â°","25Â°","180Â°"]'::jsonb,
   0, 'Alternes-internes Ã©gaux : 65Â°.', 'Ø§Ù„Ù…ØªØ¨Ø§Ø¯Ù„ØªØ§Ù† Ù…ØªØ³Ø§ÙˆÙŠØªØ§Ù†: 65Â°.', 'easy', 4),
  ('L''outil pour DÃ‰MONTRER que deux droites sont parallÃ¨les estâ€¦', 'Ø£Ø¯Ø§Ø© Ø¥Ø«Ø¨Ø§Øª Ø£Ù† Ù…Ø³ØªÙ‚ÙŠÙ…ÙŠÙ† Ù…ØªÙˆØ§Ø²ÙŠØ§Ù† Ù‡ÙŠâ€¦',
   '["l''Ã©galitÃ© d''angles alternes-internes","le calcul d''aire","le thÃ©orÃ¨me de Pythagore","la mÃ©diane"]'::jsonb, '["ØªØ³Ø§ÙˆÙŠ Ø²Ø§ÙˆÙŠØªÙŠÙ† Ù…ØªØ¨Ø§Ø¯Ù„ØªÙŠÙ† Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§","Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø³Ø§Ø­Ø©","Ø®Ø§ØµÙŠØ© ÙÙŠØ«Ø§ØºÙˆØ±Ø«","Ø§Ù„Ù…ØªÙˆØ³Ø·"]'::jsonb,
   0, 'La rÃ©ciproque sur les angles prouve le parallÃ©lisme.', 'Ø§Ù„Ø¹ÙƒØ³ Ø¹Ù„Ù‰ Ø§Ù„Ø²ÙˆØ§ÙŠØ§ ÙŠØ«Ø¨Øª Ø§Ù„ØªÙˆØ§Ø²ÙŠ.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'angles-parallelisme'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'LES TRIANGLES â€” DROITES REMARQUABLES

LES MÃ‰DIATRICES
La mÃ©diatrice d''un cÃ´tÃ© est perpendiculaire Ã  ce cÃ´tÃ© en son milieu.
Les 3 mÃ©diatrices se coupent en un point unique : le CENTRE DU CERCLE
CIRCONSCRIT (le cercle qui passe par les 3 sommets).

LES HAUTEURS
Une hauteur part d''un sommet et est perpendiculaire au cÃ´tÃ© opposÃ©.
Les 3 hauteurs se coupent en un point : l''ORTHOCENTRE.

LES MÃ‰DIANES
Une mÃ©diane joint un sommet au milieu du cÃ´tÃ© opposÃ©.
Les 3 mÃ©dianes se coupent en un point : le CENTRE DE GRAVITÃ‰ (G). Il est
situÃ© aux 2/3 de chaque mÃ©diane depuis le sommet.

LES BISSECTRICES
Une bissectrice partage un angle en deux angles Ã©gaux.
Les 3 bissectrices se coupent au CENTRE DU CERCLE INSCRIT (tangent aux
3 cÃ´tÃ©s).

Ã€ RETENIR : mÃ©diatrices â†’ cercle circonscrit ; bissectrices â†’ cercle
inscrit ; mÃ©dianes â†’ centre de gravitÃ© ; hauteurs â†’ orthocentre.',
  lesson_ar = 'Ø§Ù„Ù…Ø«Ù„Ø«Ø§Øª â€” Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ…Ø§Øª Ø§Ù„Ø®Ø§ØµØ©

Ø§Ù„Ù…Ø­Ø§ÙˆØ± (Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª Ø§Ù„Ø¹Ù…ÙˆØ¯ÙŠØ©)
Ù…Ø­ÙˆØ± Ø¶Ù„Ø¹ Ø¹Ù…ÙˆØ¯ÙŠ Ø¹Ù„ÙŠÙ‡ ÙÙŠ Ù…Ù†ØªØµÙÙ‡. ØªØªÙ‚Ø§Ø·Ø¹ Ø§Ù„Ù…Ø­Ø§ÙˆØ± Ø§Ù„Ø«Ù„Ø§Ø«Ø© ÙÙŠ Ù†Ù‚Ø·Ø© ÙˆØ§Ø­Ø¯Ø©:
Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­ÙŠØ·Ø© (Ø§Ù„Ù…Ø§Ø±Ø© Ø¨Ø§Ù„Ø±Ø¤ÙˆØ³ Ø§Ù„Ø«Ù„Ø§Ø«Ø©).

Ø§Ù„Ø§Ø±ØªÙØ§Ø¹Ø§Øª
Ø§Ù„Ø§Ø±ØªÙØ§Ø¹ ÙŠÙ†Ø·Ù„Ù‚ Ù…Ù† Ø±Ø£Ø³ ÙˆÙŠÙƒÙˆÙ† Ø¹Ù…ÙˆØ¯ÙŠÙ‹Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„. ØªØªÙ‚Ø§Ø·Ø¹ Ø§Ù„Ø§Ø±ØªÙØ§Ø¹Ø§Øª ÙÙŠ Ù†Ù‚Ø·Ø©:
Ù…Ø±ÙƒØ² Ø§Ù„Ø§Ø±ØªÙØ§Ø¹Ø§Øª (Ø§Ù„Ø£Ø±Ø«ÙˆÙ…Ø±ÙƒØ²).

Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª
Ø§Ù„Ù…ØªÙˆØ³Ø· ÙŠØµÙ„ Ø±Ø£Ø³Ù‹Ø§ Ø¨Ù…Ù†ØªØµÙ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„. ØªØªÙ‚Ø§Ø·Ø¹ Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª ÙÙŠ Ù†Ù‚Ø·Ø©:
Ù…Ø±ÙƒØ² Ø§Ù„Ø«Ù‚Ù„ (G) Ø¹Ù„Ù‰ Ø¨ÙØ¹Ø¯ 2/3 Ù…Ù† ÙƒÙ„ Ù…ØªÙˆØ³Ø· Ø§Ù†Ø·Ù„Ø§Ù‚Ù‹Ø§ Ù…Ù† Ø§Ù„Ø±Ø£Ø³.

Ø§Ù„Ù…Ù†ØµÙ‘ÙØ§Øª
Ø§Ù„Ù…Ù†ØµÙ‘Ù ÙŠÙ‚Ø³Ù… Ø²Ø§ÙˆÙŠØ© Ø¥Ù„Ù‰ Ø²Ø§ÙˆÙŠØªÙŠÙ† Ù…ØªØ³Ø§ÙˆÙŠØªÙŠÙ†. ØªØªÙ‚Ø§Ø·Ø¹ Ø§Ù„Ù…Ù†ØµÙ‘ÙØ§Øª ÙÙŠ Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­Ø§Ø·Ø©
(Ø§Ù„Ù…Ù…Ø§Ø³Ø© Ù„Ù„Ø£Ø¶Ù„Ø§Ø¹ Ø§Ù„Ø«Ù„Ø§Ø«Ø©).

ØªØ°ÙƒØ±: Ø§Ù„Ù…Ø­Ø§ÙˆØ± â† Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­ÙŠØ·Ø©ØŒ Ø§Ù„Ù…Ù†ØµÙ‘ÙØ§Øª â† Ø§Ù„Ù…Ø­Ø§Ø·Ø©ØŒ Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª â† Ù…Ø±ÙƒØ² Ø§Ù„Ø«Ù‚Ù„ØŒ Ø§Ù„Ø§Ø±ØªÙØ§Ø¹Ø§Øª â† Ø§Ù„Ø£Ø±Ø«ÙˆÙ…Ø±ÙƒØ².'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'triangles';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Les 3 mÃ©diatrices d''un triangle se coupent au centre du cercleâ€¦', 'ØªØªÙ‚Ø§Ø·Ø¹ Ù…Ø­Ø§ÙˆØ± Ø§Ù„Ù…Ø«Ù„Ø« ÙÙŠ Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©â€¦',
   '["circonscrit","inscrit","de gravitÃ©","tangent"]'::jsonb, '["Ø§Ù„Ù…Ø­ÙŠØ·Ø©","Ø§Ù„Ù…Ø­Ø§Ø·Ø©","Ø§Ù„Ø«Ù‚Ù„","Ø§Ù„Ù…Ù…Ø§Ø³Ø©"]'::jsonb,
   0, 'MÃ©diatrices â†’ cercle circonscrit.', 'Ø§Ù„Ù…Ø­Ø§ÙˆØ± â† Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­ÙŠØ·Ø©.', 'medium', 1),
  ('Une mÃ©diane joint un sommetâ€¦', 'Ø§Ù„Ù…ØªÙˆØ³Ø· ÙŠØµÙ„ Ø±Ø£Ø³Ù‹Ø§â€¦',
   '["au milieu du cÃ´tÃ© opposÃ©","au pied de la hauteur","au centre du cercle","Ã  un autre sommet"]'::jsonb,
   '["Ø¨Ù…Ù†ØªØµÙ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„","Ø¨Ø£Ø³ÙÙ„ Ø§Ù„Ø§Ø±ØªÙØ§Ø¹","Ø¨Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©","Ø¨Ø±Ø£Ø³ Ø¢Ø®Ø±"]'::jsonb,
   0, 'MÃ©diane : sommet â†’ milieu du cÃ´tÃ© opposÃ©.', 'Ø§Ù„Ù…ØªÙˆØ³Ø·: Ø±Ø£Ø³ â† Ù…Ù†ØªØµÙ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„.', 'easy', 2),
  ('Le point de concours des mÃ©dianes estâ€¦', 'Ù†Ù‚Ø·Ø© ØªÙ‚Ø§Ø·Ø¹ Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª Ù‡ÙŠâ€¦',
   '["le centre de gravitÃ©","l''orthocentre","le centre inscrit","le milieu"]'::jsonb, '["Ù…Ø±ÙƒØ² Ø§Ù„Ø«Ù‚Ù„","Ø§Ù„Ø£Ø±Ø«ÙˆÙ…Ø±ÙƒØ²","Ø§Ù„Ù…Ø±ÙƒØ² Ø§Ù„Ù…Ø­Ø§Ø·","Ø§Ù„Ù…Ù†ØªØµÙ"]'::jsonb,
   0, 'MÃ©dianes â†’ centre de gravitÃ© G.', 'Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª â† Ù…Ø±ÙƒØ² Ø§Ù„Ø«Ù‚Ù„.', 'medium', 3),
  ('Une hauteur est perpendiculaireâ€¦', 'Ø§Ù„Ø§Ø±ØªÙØ§Ø¹ Ø¹Ù…ÙˆØ¯ÙŠ Ø¹Ù„Ù‰â€¦',
   '["au cÃ´tÃ© opposÃ©","Ã  la mÃ©diane","Ã  la bissectrice","Ã  rien"]'::jsonb, '["Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„","Ø§Ù„Ù…ØªÙˆØ³Ø·","Ø§Ù„Ù…Ù†ØµÙ‘Ù","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb,
   0, 'Hauteur âŠ¥ cÃ´tÃ© opposÃ©.', 'Ø§Ù„Ø§Ø±ØªÙØ§Ø¹ Ø¹Ù…ÙˆØ¯ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ø¶Ù„Ø¹ Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„.', 'easy', 4),
  ('Le cercle inscrit dans un triangle a pour centre le point de concours desâ€¦', 'Ù…Ø±ÙƒØ² Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­Ø§Ø·Ø© ÙÙŠ Ù…Ø«Ù„Ø« Ù‡Ùˆ ØªÙ‚Ø§Ø·Ø¹â€¦',
   '["bissectrices","mÃ©diatrices","hauteurs","mÃ©dianes"]'::jsonb, '["Ø§Ù„Ù…Ù†ØµÙ‘ÙØ§Øª","Ø§Ù„Ù…Ø­Ø§ÙˆØ±","Ø§Ù„Ø§Ø±ØªÙØ§Ø¹Ø§Øª","Ø§Ù„Ù…ØªÙˆØ³Ø·Ø§Øª"]'::jsonb,
   0, 'Bissectrices â†’ cercle inscrit.', 'Ø§Ù„Ù…Ù†ØµÙ‘ÙØ§Øª â† Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ø§Ù„Ù…Ø­Ø§Ø·Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'triangles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

update public.chapters c set
  lesson_fr = 'STATISTIQUES (initiation)

VOCABULAIRE DE BASE
â€¢ Population : l''ensemble Ã©tudiÃ©. â€¢ CaractÃ¨re : ce qu''on observe (taille,
  noteâ€¦). â€¢ Effectif : nombre d''individus pour une valeur.
â€¢ Effectif total (N) : somme de tous les effectifs.

LA FRÃ‰QUENCE
frÃ©quence = effectif Ã· effectif total. On l''exprime en fraction, en dÃ©cimal
ou en pourcentage. Sur 25 Ã©lÃ¨ves, si 5 ont eu 16 : frÃ©quence = 5/25 = 0,2 = 20 %.

LES REPRÃ‰SENTATIONS GRAPHIQUES
â€¢ Diagramme en bÃ¢tons : la hauteur du bÃ¢ton = l''effectif.
â€¢ Diagramme circulaire : chaque part = un angle proportionnel Ã  l''effectif
  (angle = frÃ©quence Ã— 360Â°).
â€¢ Histogramme : pour des donnÃ©es regroupÃ©es en classes.

LA MOYENNE
moyenne = (somme de toutes les valeurs) Ã· (nombre de valeurs).
Moyenne pondÃ©rÃ©e : (Î£ valeur Ã— effectif) Ã· effectif total.

Ã€ RETENIR : la somme des frÃ©quences vaut toujours 1 (ou 100 %).',
  lesson_ar = 'Ø§Ù„Ø¥Ø­ØµØ§Ø¡ (ØªÙ…Ù‡ÙŠØ¯)

Ù…ØµØ·Ù„Ø­Ø§Øª Ø£Ø³Ø§Ø³ÙŠØ©
â€¢ Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠ: Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù…Ø¯Ø±ÙˆØ³Ø©. â€¢ Ø§Ù„Ù…ÙŠØ²Ø©: Ù…Ø§ Ù†Ù„Ø§Ø­Ø¸Ù‡ (Ø§Ù„Ø·ÙˆÙ„ØŒ Ø§Ù„Ø¹Ù„Ø§Ù…Ø©â€¦).
â€¢ Ø§Ù„ØªÙƒØ±Ø§Ø±: Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙØ±Ø§Ø¯ Ù„Ù‚ÙŠÙ…Ø© Ù…Ø¹ÙŠÙ†Ø©. â€¢ Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„ÙƒÙ„ÙŠ (N): Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ØªÙƒØ±Ø§Ø±Ø§Øª.

Ø§Ù„ØªÙˆØ§ØªØ±
Ø§Ù„ØªÙˆØ§ØªØ± = Ø§Ù„ØªÙƒØ±Ø§Ø± Ã· Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„ÙƒÙ„ÙŠØŒ ÙˆÙŠÙØ¹Ø¨Ù‘Ø± Ø¹Ù†Ù‡ Ø¨ÙƒØ³Ø± Ø£Ùˆ Ù†Ø³Ø¨Ø© Ù…Ø¦ÙˆÙŠØ©.
Ù…Ù† 25 ØªÙ„Ù…ÙŠØ°Ù‹Ø§ Ù†Ø§Ù„ 5 Ø¹Ù„Ø§Ù…Ø© 16: Ø§Ù„ØªÙˆØ§ØªØ± = 5/25 = 0.2 = 20%.

Ø§Ù„ØªÙ…Ø«ÙŠÙ„Ø§Øª Ø§Ù„Ø¨ÙŠØ§Ù†ÙŠØ©
â€¢ Ø§Ù„Ù…Ø®Ø·Ø· Ø¨Ø§Ù„Ø£Ø¹Ù…Ø¯Ø©: Ø§Ø±ØªÙØ§Ø¹ Ø§Ù„Ø¹Ù…ÙˆØ¯ = Ø§Ù„ØªÙƒØ±Ø§Ø±.
â€¢ Ø§Ù„Ù…Ø®Ø·Ø· Ø§Ù„Ø¯Ø§Ø¦Ø±ÙŠ: ÙƒÙ„ Ø¬Ø²Ø¡ Ø²Ø§ÙˆÙŠØ© ØªÙ†Ø§Ø³Ø¨ Ø§Ù„ØªÙƒØ±Ø§Ø± (Ø§Ù„Ø²Ø§ÙˆÙŠØ© = Ø§Ù„ØªÙˆØ§ØªØ± Ã— 360Â°).
â€¢ Ø§Ù„Ù…Ø¯Ø±Ù‘Ø¬ Ø§Ù„ØªÙƒØ±Ø§Ø±ÙŠ: Ù„Ù…Ø¹Ø·ÙŠØ§Øª Ù…Ø¬Ù…Ù‘Ø¹Ø© ÙÙŠ ÙØ¦Ø§Øª.

Ø§Ù„Ù…ØªÙˆØ³Ø· Ø§Ù„Ø­Ø³Ø§Ø¨ÙŠ
Ø§Ù„Ù…ØªÙˆØ³Ø· = (Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ù‚ÙŠÙ…) Ã· (Ø¹Ø¯Ø¯Ù‡Ø§).
Ø§Ù„Ù…ØªÙˆØ³Ø· Ø§Ù„Ù…ØªÙˆØ§Ø²Ù†: (Î£ Ø§Ù„Ù‚ÙŠÙ…Ø© Ã— Ø§Ù„ØªÙƒØ±Ø§Ø±) Ã· Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„ÙƒÙ„ÙŠ.

ØªØ°ÙƒØ±: Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ØªÙˆØ§ØªØ±Ø§Øª ÙŠØ³Ø§ÙˆÙŠ Ø¯Ø§Ø¦Ù…Ù‹Ø§ 1 (Ø£Ùˆ 100%).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'statistiques';

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c
join public.subjects s on s.id = c.subject_id
cross join (values
  ('Sur 25 Ã©lÃ¨ves, 5 ont eu 16. La frÃ©quence estâ€¦', 'Ù…Ù† 25 ØªÙ„Ù…ÙŠØ°Ù‹Ø§ Ù†Ø§Ù„ 5 Ø¹Ù„Ø§Ù…Ø© 16. Ø§Ù„ØªÙˆØ§ØªØ±â€¦',
   '["20 %","5 %","16 %","25 %"]'::jsonb, '["20 %","5 %","16 %","25 %"]'::jsonb,
   0, '5/25 = 0,2 = 20 %.', '5/25 = 20%.', 'medium', 1),
  ('L''effectif total estâ€¦', 'Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„ÙƒÙ„ÙŠ Ù‡Ùˆâ€¦',
   '["la somme de tous les effectifs","le plus grand effectif","la moyenne","le nombre de valeurs diffÃ©rentes"]'::jsonb,
   '["Ù…Ø¬Ù…ÙˆØ¹ ÙƒÙ„ Ø§Ù„ØªÙƒØ±Ø§Ø±Ø§Øª","Ø£ÙƒØ¨Ø± ØªÙƒØ±Ø§Ø±","Ø§Ù„Ù…ØªÙˆØ³Ø·","Ø¹Ø¯Ø¯ Ø§Ù„Ù‚ÙŠÙ… Ø§Ù„Ù…Ø®ØªÙ„ÙØ©"]'::jsonb,
   0, 'N = somme des effectifs.', 'N = Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ØªÙƒØ±Ø§Ø±Ø§Øª.', 'easy', 2),
  ('Moyenne de 10, 12, 14 ?', 'Ù…ØªÙˆØ³Ø· 10 Ùˆ12 Ùˆ14ØŸ',
   '["12","36","14","11"]'::jsonb, '["12","36","14","11"]'::jsonb,
   0, '(10+12+14)/3 = 12.', '(10+12+14)/3 = 12.', 'easy', 3),
  ('Dans un diagramme circulaire, l''angle d''une part = frÃ©quence Ã— â€¦', 'ÙÙŠ Ù…Ø®Ø·Ø· Ø¯Ø§Ø¦Ø±ÙŠØŒ Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø¬Ø²Ø¡ = Ø§Ù„ØªÙˆØ§ØªØ± Ã— â€¦',
   '["360Â°","180Â°","100Â°","90Â°"]'::jsonb, '["360Â°","180Â°","100Â°","90Â°"]'::jsonb,
   0, 'Le disque entier = 360Â°.', 'Ø§Ù„Ù‚Ø±Øµ ÙƒØ§Ù…Ù„ = 360Â°.', 'medium', 4),
  ('La somme de toutes les frÃ©quences vautâ€¦', 'Ù…Ø¬Ù…ÙˆØ¹ ÙƒÙ„ Ø§Ù„ØªÙˆØ§ØªØ±Ø§Øª ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["1 (ou 100 %)","0","N","360Â°"]'::jsonb, '["1 (Ø£Ùˆ 100%)","0","N","360Â°"]'::jsonb,
   0, 'Les frÃ©quences totalisent toujours 1.', 'Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ØªÙˆØ§ØªØ±Ø§Øª Ø¯Ø§Ø¦Ù…Ù‹Ø§ 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AM' and s.slug = 'mathematiques' and c.slug = 'statistiques'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);


-- ===============================================================
-- Migration: 20260722_023_primaire_maths
--
-- Primaire (1APâ€“4AP) maths: these grades had subjects seeded (migration
-- 017) but NO chapters. This creates age-appropriate maths chapters +
-- bilingual lessons + quiz banks for each. 5AP was already done in 017/018.
-- Idempotent: ON CONFLICT DO NOTHING chapters, guarded lesson UPDATEs,
-- NOT EXISTS quiz inserts.
-- ===============================================================

-- ===== 1. Create chapters =====

-- 1AP maths (very basic: numbers to 100, simple add/subtract, shapes)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-0-100',  'Les nombres de 0 Ã  100',  'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ù…Ù† 0 Ø¥Ù„Ù‰ 100', 'Lire, Ã©crire et compter jusqu''Ã  100.', 1),
  ('addition',       'L''addition',             'Ø§Ù„Ø¬Ù…Ø¹',                'Ajouter deux nombres jusqu''Ã  20.', 2),
  ('soustraction',   'La soustraction',         'Ø§Ù„Ø·Ø±Ø­',                'Retirer, trouver ce qui reste.', 3),
  ('formes',         'Les formes',              'Ø§Ù„Ø£Ø´ÙƒØ§Ù„',              'CarrÃ©, rond, triangle, rectangle.', 4)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 2AP maths (numbers to 1000, add/subtract with carry, intro multiplication)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-0-1000', 'Les nombres jusqu''Ã  1000', 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø­ØªÙ‰ 1000', 'Lire, Ã©crire, comparer jusqu''Ã  1000.', 1),
  ('addition-retenue','L''addition avec retenue',  'Ø§Ù„Ø¬Ù…Ø¹ Ù…Ø¹ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸', 'Poser et calculer une addition.', 2),
  ('soustraction-retenue','La soustraction avec retenue','Ø§Ù„Ø·Ø±Ø­ Ù…Ø¹ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸','Poser et calculer une soustraction.', 3),
  ('multiplication', 'La multiplication',          'Ø§Ù„Ø¶Ø±Ø¨',            'DÃ©couvrir le sens de la multiplication.', 4),
  ('mesures-temps',  'Le temps et les mesures',    'Ø§Ù„ÙˆÙ‚Øª ÙˆØ§Ù„Ù‚ÙŠØ§Ø³',     'Heures, jours, longueurs simples.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 3AP maths (numbers to 10000, tables, intro division, perimeter)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('nombres-10000',  'Les nombres jusqu''Ã  10 000', 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø­ØªÙ‰ 10000', 'Lire, Ã©crire et ranger les grands nombres.', 1),
  ('tables',         'Les tables de multiplication', 'Ø¬Ø¯Ø§ÙˆÙ„ Ø§Ù„Ø¶Ø±Ø¨',     'MÃ©moriser les tables de 1 Ã  9.', 2),
  ('division',       'La division',                 'Ø§Ù„Ù‚Ø³Ù…Ø©',           'Partager en parts Ã©gales.', 3),
  ('perimetre',      'Le pÃ©rimÃ¨tre',                'Ø§Ù„Ù…Ø­ÙŠØ·',           'Mesurer le tour d''une figure.', 4),
  ('problemes',      'RÃ©soudre des problÃ¨mes',      'Ø­Ù„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø§Øª',      'Choisir la bonne opÃ©ration.', 5)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- 4AP maths (numbers to millions, intro fractions/decimals, area, angles)
insert into public.chapters (subject_id, slug, title_fr, title_ar, description_fr, sort_order)
select s.id, v.slug, v.title_fr, v.title_ar, v.descr, v.ord
from public.subjects s
cross join (values
  ('grands-nombres', 'Les grands nombres',        'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ±Ø©',   'Lire et Ã©crire jusqu''au million.', 1),
  ('fractions',      'Les fractions',             'Ø§Ù„ÙƒØ³ÙˆØ±',            'DÃ©couvrir les fractions simples.', 2),
  ('decimaux',       'Les nombres dÃ©cimaux',      'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠØ©',   'La virgule, les dixiÃ¨mes.', 3),
  ('operations',     'Les quatre opÃ©rations',     'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø£Ø±Ø¨Ø¹',   'Poser addition, soustraction, Ã—, Ã·.', 4),
  ('aires',          'Les aires',                 'Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª',          'Aire du carrÃ© et du rectangle.', 5),
  ('angles',         'Les angles',                'Ø§Ù„Ø²ÙˆØ§ÙŠØ§',           'Angle droit, aigu, obtus.', 6)
) as v(slug, title_fr, title_ar, descr, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques'
on conflict (subject_id, slug) do nothing;

-- ===== 2. Lessons =====

update public.chapters c set
  lesson_fr = 'LES NOMBRES DE 0 Ã€ 100

COMPTER
On compte 1, 2, 3â€¦ jusqu''Ã  100. Les nombres se regroupent par DIZAINES :
10, 20, 30â€¦ AprÃ¨s 19 vient 20, aprÃ¨s 29 vient 30.

DIZAINES ET UNITÃ‰S
Le nombre 34 = 3 dizaines et 4 unitÃ©s. Le premier chiffre compte les
dizaines, le deuxiÃ¨me compte les unitÃ©s.

COMPARER
Pour dire quel nombre est le plus grand :
â€¢ On regarde d''abord les dizaines : 52 > 47 car 5 dizaines > 4 dizaines.
â€¢ Si les dizaines sont pareilles, on regarde les unitÃ©s : 34 < 38.

Signes : > veut dire Â« plus grand que Â», < veut dire Â« plus petit que Â».

Ã€ RETENIR : dans un nombre Ã  deux chiffres, le chiffre de gauche compte
les dizaines.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ù…Ù† 0 Ø¥Ù„Ù‰ 100

Ø§Ù„Ø¹Ø¯Ù‘
Ù†Ø¹Ø¯Ù‘ 1ØŒ 2ØŒ 3â€¦ Ø­ØªÙ‰ 100. ØªÙØ¬Ù…Ø¹ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø¨Ø§Ù„Ø¹Ø´Ø±Ø§Øª: 10ØŒ 20ØŒ 30â€¦ Ø¨Ø¹Ø¯ 19 ÙŠØ£ØªÙŠ 20.

Ø§Ù„Ø¹Ø´Ø±Ø§Øª ÙˆØ§Ù„ÙˆØ­Ø¯Ø§Øª
Ø§Ù„Ø¹Ø¯Ø¯ 34 = 3 Ø¹Ø´Ø±Ø§Øª Ùˆ4 ÙˆØ­Ø¯Ø§Øª. Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø£ÙˆÙ„ ÙŠØ¹Ø¯Ù‘ Ø§Ù„Ø¹Ø´Ø±Ø§Øª ÙˆØ§Ù„Ø«Ø§Ù†ÙŠ ÙŠØ¹Ø¯Ù‘ Ø§Ù„ÙˆØ­Ø¯Ø§Øª.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù„Ù…Ø¹Ø±ÙØ© Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø±:
â€¢ Ù†Ù†Ø¸Ø± Ø£ÙˆÙ„Ø§Ù‹ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ø´Ø±Ø§Øª: 52 > 47 Ù„Ø£Ù† 5 Ø¹Ø´Ø±Ø§Øª > 4 Ø¹Ø´Ø±Ø§Øª.
â€¢ Ø¥Ø°Ø§ ØªØ³Ø§ÙˆØª Ø§Ù„Ø¹Ø´Ø±Ø§Øª Ù†Ù†Ø¸Ø± Ø¥Ù„Ù‰ Ø§Ù„ÙˆØ­Ø¯Ø§Øª: 34 < 38.

Ø§Ù„Ø±Ù…ÙˆØ²: > ØªØ¹Ù†ÙŠ Â«Ø£ÙƒØ¨Ø± Ù…Ù†Â» Ùˆ< ØªØ¹Ù†ÙŠ Â«Ø£ØµØºØ± Ù…Ù†Â».

ØªØ°ÙƒØ±: ÙÙŠ Ø¹Ø¯Ø¯ Ù…Ù† Ø±Ù‚Ù…ÙŠÙ†ØŒ Ø§Ù„Ø±Ù‚Ù… Ø¹Ù„Ù‰ Ø§Ù„ÙŠØ³Ø§Ø± ÙŠØ¹Ø¯Ù‘ Ø§Ù„Ø¹Ø´Ø±Ø§Øª.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-100';

update public.chapters c set
  lesson_fr = 'L''ADDITION

AJOUTER, C''EST RÃ‰UNIR
Additionner, c''est mettre ensemble. 3 + 2 = 5 : j''ai 3 billes, j''en ajoute
2, j''ai 5 billes en tout. Le rÃ©sultat s''appelle la SOMME.

LE SIGNE +
Le signe + veut dire Â« plus Â» ou Â« et Â». 4 + 1 se lit Â« quatre plus un Â».

ADDITION ASTUCIEUSE
â€¢ Ajouter 0 ne change rien : 7 + 0 = 7.
â€¢ On peut changer l''ordre : 2 + 6 = 6 + 2 = 8.
â€¢ Pour ajouter 10, on ajoute 1 dizaine : 23 + 10 = 33.

CALCULER JUSQU''Ã€ 20
5 + 5 = 10 ; 6 + 4 = 10. Bien connaÃ®tre les paires qui font 10 aide beaucoup !

Ã€ RETENIR : le mot Â« en tout Â» ou Â« ensemble Â» veut souvent dire qu''il faut
additionner.',
  lesson_ar = 'Ø§Ù„Ø¬Ù…Ø¹

Ø§Ù„Ø¬Ù…Ø¹ Ù‡Ùˆ Ø§Ù„Ø¶Ù…Ù‘
Ø§Ù„Ø¬Ù…Ø¹ ÙŠØ¹Ù†ÙŠ ÙˆØ¶Ø¹ Ø§Ù„Ø£Ø´ÙŠØ§Ø¡ Ù…Ø¹Ù‹Ø§. 3 + 2 = 5: Ø¹Ù†Ø¯ÙŠ 3 ÙƒØ±Ø§Øª Ø£Ø¶ÙŠÙ 2 ÙÙŠØµØ¨Ø­ Ù„Ø¯ÙŠ 5.
Ø§Ù„Ù†ØªÙŠØ¬Ø© ØªÙØ³Ù…Ù‰ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹.

Ø§Ù„Ø±Ù…Ø² +
Ø§Ù„Ø±Ù…Ø² + ÙŠØ¹Ù†ÙŠ Â«Ø²Ø§Ø¦Ø¯Â» Ø£Ùˆ Â«ÙˆÂ». 4 + 1 ØªÙÙ‚Ø±Ø£ Â«Ø£Ø±Ø¨Ø¹Ø© Ø²Ø§Ø¦Ø¯ ÙˆØ§Ø­Ø¯Â».

Ø§Ù„Ø¬Ù…Ø¹ Ø§Ù„Ø°ÙƒÙŠ
â€¢ Ø¥Ø¶Ø§ÙØ© 0 Ù„Ø§ ØªØºÙŠÙ‘Ø± Ø´ÙŠØ¦Ù‹Ø§: 7 + 0 = 7.
â€¢ ÙŠÙ…ÙƒÙ† ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„ØªØ±ØªÙŠØ¨: 2 + 6 = 6 + 2 = 8.
â€¢ Ù„Ø¥Ø¶Ø§ÙØ© 10 Ù†Ø¶ÙŠÙ Ø¹Ø´Ø±Ø© ÙˆØ§Ø­Ø¯Ø©: 23 + 10 = 33.

Ø§Ù„Ø­Ø³Ø§Ø¨ Ø­ØªÙ‰ 20
5 + 5 = 10 Ø› 6 + 4 = 10. Ù…Ø¹Ø±ÙØ© Ø§Ù„Ø£Ø²ÙˆØ§Ø¬ Ø§Ù„ØªÙŠ Ù…Ø¬Ù…ÙˆØ¹Ù‡Ø§ 10 Ù…ÙÙŠØ¯Ø© Ø¬Ø¯Ù‹Ø§!

ØªØ°ÙƒØ±: Ø¹Ø¨Ø§Ø±Ø© Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» Ø£Ùˆ Â«Ù…Ø¹Ù‹Ø§Â» ØªØ¹Ù†ÙŠ ØºØ§Ù„Ø¨Ù‹Ø§ Ø§Ù„Ø¬Ù…Ø¹.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'addition';

update public.chapters c set
  lesson_fr = 'LA SOUSTRACTION

RETIRER, C''EST ENLEVER
Soustraire, c''est enlever. 5 âˆ’ 2 = 3 : j''ai 5 bonbons, j''en mange 2, il
m''en reste 3. Le rÃ©sultat s''appelle la DIFFÃ‰RENCE.

LE SIGNE âˆ’
Le signe âˆ’ veut dire Â« moins Â». 7 âˆ’ 3 se lit Â« sept moins trois Â».

CE QU''IL FAUT SAVOIR
â€¢ Enlever 0 ne change rien : 8 âˆ’ 0 = 8.
â€¢ Un nombre moins lui-mÃªme fait 0 : 6 âˆ’ 6 = 0.
â€¢ On ne peut pas enlever plus que ce qu''on a (au primaire).

LIEN AVEC L''ADDITION
La soustraction est le contraire de l''addition :
si 3 + 2 = 5, alors 5 âˆ’ 2 = 3 et 5 âˆ’ 3 = 2.

Ã€ RETENIR : les mots Â« reste Â», Â« enlÃ¨ve Â», Â« perd Â» veulent souvent dire
qu''il faut soustraire.',
  lesson_ar = 'Ø§Ù„Ø·Ø±Ø­

Ø§Ù„Ø·Ø±Ø­ Ù‡Ùˆ Ø§Ù„Ø¥Ø²Ø§Ù„Ø©
Ø§Ù„Ø·Ø±Ø­ ÙŠØ¹Ù†ÙŠ Ø£Ù† Ù†ÙØ²ÙŠÙ„. 5 âˆ’ 2 = 3: Ø¹Ù†Ø¯ÙŠ 5 Ø­Ù„ÙˆÙŠØ§Øª Ø¢ÙƒÙ„ 2 ÙÙŠØ¨Ù‚Ù‰ 3.
Ø§Ù„Ù†ØªÙŠØ¬Ø© ØªÙØ³Ù…Ù‰ Ø§Ù„ÙØ±Ù‚.

Ø§Ù„Ø±Ù…Ø² âˆ’
Ø§Ù„Ø±Ù…Ø² âˆ’ ÙŠØ¹Ù†ÙŠ Â«Ù†Ø§Ù‚ØµÂ». 7 âˆ’ 3 ØªÙÙ‚Ø±Ø£ Â«Ø³Ø¨Ø¹Ø© Ù†Ø§Ù‚Øµ Ø«Ù„Ø§Ø«Ø©Â».

Ù…Ø§ ÙŠØ¬Ø¨ Ù…Ø¹Ø±ÙØªÙ‡
â€¢ Ø¥Ø²Ø§Ù„Ø© 0 Ù„Ø§ ØªØºÙŠÙ‘Ø± Ø´ÙŠØ¦Ù‹Ø§: 8 âˆ’ 0 = 8.
â€¢ Ø¹Ø¯Ø¯ Ù†Ø§Ù‚Øµ Ù†ÙØ³Ù‡ = 0: 6 âˆ’ 6 = 0.

Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø¨Ø§Ù„Ø¬Ù…Ø¹
Ø§Ù„Ø·Ø±Ø­ Ø¹ÙƒØ³ Ø§Ù„Ø¬Ù…Ø¹:
Ø¥Ø°Ø§ ÙƒØ§Ù† 3 + 2 = 5 ÙØ¥Ù† 5 âˆ’ 2 = 3 Ùˆ 5 âˆ’ 3 = 2.

ØªØ°ÙƒØ±: ÙƒÙ„Ù…Ø§Øª Â«Ø§Ù„Ø¨Ø§Ù‚ÙŠÂ»ØŒ Â«ÙŠÙØ²ÙŠÙ„Â»ØŒ Â«ÙŠÙÙ‚Ø¯Â» ØªØ¹Ù†ÙŠ ØºØ§Ù„Ø¨Ù‹Ø§ Ø§Ù„Ø·Ø±Ø­.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'soustraction';

update public.chapters c set
  lesson_fr = 'LES FORMES

LES FORMES QU''ON VOIT PARTOUT
â€¢ Le CARRÃ‰ : 4 cÃ´tÃ©s Ã©gaux, 4 coins droits. (une fenÃªtre)
â€¢ Le RECTANGLE : 4 coins droits, mais 2 cÃ´tÃ©s longs et 2 cÃ´tÃ©s courts.
  (une porte, un cahier)
â€¢ Le TRIANGLE : 3 cÃ´tÃ©s et 3 coins. (un panneau)
â€¢ Le ROND (cercle) : tout arrondi, sans coin. (une roue, le soleil)

CÃ”TÃ‰S ET COINS
Un CÃ”TÃ‰ est un bord droit. Un COIN (sommet) est l''endroit oÃ¹ deux cÃ´tÃ©s se
rencontrent. Le carrÃ© a 4 cÃ´tÃ©s et 4 coins.

RECONNAÃŽTRE
On reconnaÃ®t une forme en comptant ses cÃ´tÃ©s :
3 cÃ´tÃ©s â†’ triangle, 4 cÃ´tÃ©s â†’ carrÃ© ou rectangle, 0 cÃ´tÃ© droit â†’ rond.

Ã€ RETENIR : le carrÃ© a tous ses cÃ´tÃ©s de la mÃªme longueur ; le rectangle a
des cÃ´tÃ©s longs et des cÃ´tÃ©s courts.',
  lesson_ar = 'Ø§Ù„Ø£Ø´ÙƒØ§Ù„

Ø£Ø´ÙƒØ§Ù„ Ù†Ø±Ø§Ù‡Ø§ ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù†
â€¢ Ø§Ù„Ù…Ø±Ø¨Ø¹: 4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ© Ùˆ4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©. (Ù†Ø§ÙØ°Ø©)
â€¢ Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„: 4 Ø²ÙˆØ§ÙŠØ§ Ù‚Ø§Ø¦Ù…Ø©ØŒ Ø¶Ù„Ø¹Ø§Ù† Ø·ÙˆÙŠÙ„Ø§Ù† ÙˆØ¶Ù„Ø¹Ø§Ù† Ù‚ØµÙŠØ±Ø§Ù†. (Ø¨Ø§Ø¨ØŒ ÙƒØ±Ø§Ø³)
â€¢ Ø§Ù„Ù…Ø«Ù„Ø«: 3 Ø£Ø¶Ù„Ø§Ø¹ Ùˆ3 Ø²ÙˆØ§ÙŠØ§. (Ù„ÙˆØ­Ø© Ø¥Ø´Ø§Ø±Ø©)
â€¢ Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©: Ù…Ø³ØªØ¯ÙŠØ±Ø© ØªÙ…Ø§Ù…Ù‹Ø§ Ø¨Ù„Ø§ Ø²ÙˆØ§ÙŠØ§. (Ø¹Ø¬Ù„Ø©ØŒ Ø§Ù„Ø´Ù…Ø³)

Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹ ÙˆØ§Ù„Ø²ÙˆØ§ÙŠØ§
Ø§Ù„Ø¶Ù„Ø¹ Ø­Ø§ÙØ© Ù…Ø³ØªÙ‚ÙŠÙ…Ø©. Ø§Ù„Ø²Ø§ÙˆÙŠØ© (Ø§Ù„Ø±Ø£Ø³) Ù‡ÙŠ Ù…ÙƒØ§Ù† Ø§Ù„ØªÙ‚Ø§Ø¡ Ø¶Ù„Ø¹ÙŠÙ†. Ø§Ù„Ù…Ø±Ø¨Ø¹ Ù„Ù‡ 4 Ø£Ø¶Ù„Ø§Ø¹ Ùˆ4 Ø²ÙˆØ§ÙŠØ§.

Ø§Ù„ØªØ¹Ø±Ù‘Ù
Ù†ØªØ¹Ø±Ù‘Ù Ø¹Ù„Ù‰ Ø§Ù„Ø´ÙƒÙ„ Ø¨Ø¹Ø¯Ù‘ Ø£Ø¶Ù„Ø§Ø¹Ù‡:
3 Ø£Ø¶Ù„Ø§Ø¹ â† Ù…Ø«Ù„Ø«ØŒ 4 Ø£Ø¶Ù„Ø§Ø¹ â† Ù…Ø±Ø¨Ø¹ Ø£Ùˆ Ù…Ø³ØªØ·ÙŠÙ„ØŒ Ø¨Ù„Ø§ Ø£Ø¶Ù„Ø§Ø¹ Ù…Ø³ØªÙ‚ÙŠÙ…Ø© â† Ø¯Ø§Ø¦Ø±Ø©.

ØªØ°ÙƒØ±: Ø§Ù„Ù…Ø±Ø¨Ø¹ Ø£Ø¶Ù„Ø§Ø¹Ù‡ Ù…ØªØ³Ø§ÙˆÙŠØ©ØŒ ÙˆØ§Ù„Ù…Ø³ØªØ·ÙŠÙ„ Ù„Ù‡ Ø£Ø¶Ù„Ø§Ø¹ Ø·ÙˆÙŠÙ„Ø© ÙˆØ£Ø®Ø±Ù‰ Ù‚ØµÙŠØ±Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'formes';

update public.chapters c set
  lesson_fr = 'LES NOMBRES JUSQU''Ã€ 1000

CENTAINES, DIZAINES, UNITÃ‰S
Le nombre 356 = 3 centaines, 5 dizaines, 6 unitÃ©s.
â€¢ 100 = 1 centaine = 10 dizaines.
â€¢ Le chiffre le plus Ã  gauche compte les centaines.

LIRE ET Ã‰CRIRE
356 se lit Â« trois cent cinquante-six Â». On Ã©crit les centaines, puis les
dizaines, puis les unitÃ©s.

COMPARER
On compare d''abord les centaines, puis les dizaines, puis les unitÃ©s :
420 > 399 car 4 centaines > 3 centaines.

RANGER
Ranger dans l''ordre croissant = du plus petit au plus grand.
Ordre dÃ©croissant = du plus grand au plus petit.

Ã€ RETENIR : dans un nombre Ã  trois chiffres, on lit de gauche Ã  droite :
centaines, dizaines, unitÃ©s.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø­ØªÙ‰ 1000

Ø§Ù„Ù…Ø¦Ø§Øª ÙˆØ§Ù„Ø¹Ø´Ø±Ø§Øª ÙˆØ§Ù„ÙˆØ­Ø¯Ø§Øª
Ø§Ù„Ø¹Ø¯Ø¯ 356 = 3 Ù…Ø¦Ø§Øª Ùˆ5 Ø¹Ø´Ø±Ø§Øª Ùˆ6 ÙˆØ­Ø¯Ø§Øª.
â€¢ 100 = Ù…Ø¦Ø© ÙˆØ§Ø­Ø¯Ø© = 10 Ø¹Ø´Ø±Ø§Øª.
â€¢ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø£Ù‚ØµÙ‰ ÙŠØ³Ø§Ø±Ù‹Ø§ ÙŠØ¹Ø¯Ù‘ Ø§Ù„Ù…Ø¦Ø§Øª.

Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© ÙˆØ§Ù„ÙƒØªØ§Ø¨Ø©
356 ÙŠÙÙ‚Ø±Ø£ Â«Ø«Ù„Ø§Ø«Ù…Ø¦Ø© ÙˆØ³ØªØ© ÙˆØ®Ù…Ø³ÙˆÙ†Â». Ù†ÙƒØªØ¨ Ø§Ù„Ù…Ø¦Ø§Øª Ø«Ù… Ø§Ù„Ø¹Ø´Ø±Ø§Øª Ø«Ù… Ø§Ù„ÙˆØ­Ø¯Ø§Øª.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ù…Ø¦Ø§Øª Ø£ÙˆÙ„Ø§Ù‹ Ø«Ù… Ø§Ù„Ø¹Ø´Ø±Ø§Øª Ø«Ù… Ø§Ù„ÙˆØ­Ø¯Ø§Øª:
420 > 399 Ù„Ø£Ù† 4 Ù…Ø¦Ø§Øª > 3 Ù…Ø¦Ø§Øª.

Ø§Ù„ØªØ±ØªÙŠØ¨
Ø§Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„ØªØµØ§Ø¹Ø¯ÙŠ = Ù…Ù† Ø§Ù„Ø£ØµØºØ± Ø¥Ù„Ù‰ Ø§Ù„Ø£ÙƒØ¨Ø±. Ø§Ù„ØªÙ†Ø§Ø²Ù„ÙŠ = Ù…Ù† Ø§Ù„Ø£ÙƒØ¨Ø± Ø¥Ù„Ù‰ Ø§Ù„Ø£ØµØºØ±.

ØªØ°ÙƒØ±: ÙÙŠ Ø¹Ø¯Ø¯ Ù…Ù† Ø«Ù„Ø§Ø«Ø© Ø£Ø±Ù‚Ø§Ù… Ù†Ù‚Ø±Ø£ Ù…Ù† Ø§Ù„ÙŠØ³Ø§Ø±: Ù…Ø¦Ø§ØªØŒ Ø¹Ø´Ø±Ø§ØªØŒ ÙˆØ­Ø¯Ø§Øª.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-1000';

update public.chapters c set
  lesson_fr = 'L''ADDITION AVEC RETENUE

POSER UNE ADDITION
On Ã©crit les nombres l''un sous l''autre en alignant les unitÃ©s sous les
unitÃ©s, les dizaines sous les dizaines.

LA RETENUE
Quand la somme d''une colonne dÃ©passe 9, on Ã©crit les unitÃ©s et on
Â« retient Â» la dizaine dans la colonne suivante.
Exemple : 27 + 15.
â€¢ UnitÃ©s : 7 + 5 = 12 â†’ j''Ã©cris 2, je retiens 1.
â€¢ Dizaines : 2 + 1 + 1 (retenue) = 4.
â€¢ RÃ©sultat : 42.

VÃ‰RIFIER
On peut vÃ©rifier en changeant l''ordre : 15 + 27 doit donner le mÃªme rÃ©sultat.

Ã€ RETENIR : on calcule toujours en commenÃ§ant par la colonne des UNITÃ‰S
(Ã  droite), et la retenue va vers la gauche.',
  lesson_ar = 'Ø§Ù„Ø¬Ù…Ø¹ Ù…Ø¹ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸

ÙˆØ¶Ø¹ Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø¬Ù…Ø¹
Ù†ÙƒØªØ¨ Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø¨Ø¹Ø¶Ù‡Ø§ ØªØ­Øª Ø¨Ø¹Ø¶ Ù…Ø¹ Ù…Ø­Ø§Ø°Ø§Ø© Ø§Ù„ÙˆØ­Ø¯Ø§Øª ØªØ­Øª Ø§Ù„ÙˆØ­Ø¯Ø§Øª ÙˆØ§Ù„Ø¹Ø´Ø±Ø§Øª ØªØ­Øª Ø§Ù„Ø¹Ø´Ø±Ø§Øª.

Ø§Ù„Ø§Ø­ØªÙØ§Ø¸
Ø¹Ù†Ø¯Ù…Ø§ ÙŠØªØ¬Ø§ÙˆØ² Ù…Ø¬Ù…ÙˆØ¹ Ø¹Ù…ÙˆØ¯ Ø§Ù„Ø¹Ø¯Ø¯ 9ØŒ Ù†ÙƒØªØ¨ Ø§Ù„ÙˆØ­Ø¯Ø§Øª ÙˆÂ«Ù†Ø­ØªÙØ¸Â» Ø¨Ø§Ù„Ø¹Ø´Ø±Ø© ÙÙŠ Ø§Ù„Ø¹Ù…ÙˆØ¯ Ø§Ù„ØªØ§Ù„ÙŠ.
Ù…Ø«Ø§Ù„: 27 + 15.
â€¢ Ø§Ù„ÙˆØ­Ø¯Ø§Øª: 7 + 5 = 12 â† Ù†ÙƒØªØ¨ 2 ÙˆÙ†Ø­ØªÙØ¸ Ø¨Ù€ 1.
â€¢ Ø§Ù„Ø¹Ø´Ø±Ø§Øª: 2 + 1 + 1 = 4.
â€¢ Ø§Ù„Ù†ØªÙŠØ¬Ø©: 42.

Ø§Ù„ØªØ­Ù‚Ù‚
ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ­Ù‚Ù‚ Ø¨ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„ØªØ±ØªÙŠØ¨: 15 + 27 ÙŠØ¹Ø·ÙŠ Ù†ÙØ³ Ø§Ù„Ù†ØªÙŠØ¬Ø©.

ØªØ°ÙƒØ±: Ù†Ø¨Ø¯Ø£ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ù…Ù† Ø¹Ù…ÙˆØ¯ Ø§Ù„ÙˆØ­Ø¯Ø§Øª (ÙŠÙ…ÙŠÙ†Ù‹Ø§)ØŒ ÙˆØ§Ù„Ø§Ø­ØªÙØ§Ø¸ ÙŠØªØ¬Ù‡ ÙŠØ³Ø§Ø±Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'addition-retenue';

update public.chapters c set
  lesson_fr = 'LA SOUSTRACTION AVEC RETENUE

POSER UNE SOUSTRACTION
On aligne les unitÃ©s sous les unitÃ©s, les dizaines sous les dizaines. Le plus
grand nombre est en haut.

QUAND ON NE PEUT PAS ENLEVER
Si le chiffre du haut est plus petit que celui du bas, on Â« emprunte Â» une
dizaine.
Exemple : 42 âˆ’ 15.
â€¢ UnitÃ©s : 2 âˆ’ 5 impossible â†’ on emprunte 1 dizaine : 12 âˆ’ 5 = 7.
â€¢ Dizaines : il reste 3 (car on a prÃªtÃ© 1), 3 âˆ’ 1 = 2.
â€¢ RÃ©sultat : 27.

VÃ‰RIFIER AVEC L''ADDITION
On vÃ©rifie : 27 + 15 = 42. Si Ã§a retombe sur le grand nombre, c''est juste !

Ã€ RETENIR : on commence par les unitÃ©s ; si on ne peut pas enlever, on
emprunte une dizaine Ã  la colonne de gauche.',
  lesson_ar = 'Ø§Ù„Ø·Ø±Ø­ Ù…Ø¹ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸

ÙˆØ¶Ø¹ Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø·Ø±Ø­
Ù†Ø­Ø§Ø°ÙŠ Ø§Ù„ÙˆØ­Ø¯Ø§Øª ØªØ­Øª Ø§Ù„ÙˆØ­Ø¯Ø§Øª ÙˆØ§Ù„Ø¹Ø´Ø±Ø§Øª ØªØ­Øª Ø§Ù„Ø¹Ø´Ø±Ø§Øª. Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø± ÙÙŠ Ø§Ù„Ø£Ø¹Ù„Ù‰.

Ø¹Ù†Ø¯Ù…Ø§ Ù„Ø§ Ù†Ø³ØªØ·ÙŠØ¹ Ø§Ù„Ø·Ø±Ø­
Ø¥Ø°Ø§ ÙƒØ§Ù† Ø±Ù‚Ù… Ø§Ù„Ø£Ø¹Ù„Ù‰ Ø£ØµØºØ± Ù…Ù† Ø±Ù‚Ù… Ø§Ù„Ø£Ø³ÙÙ„ØŒ Â«Ù†Ø³ØªÙ„ÙÂ» Ø¹Ø´Ø±Ø©.
Ù…Ø«Ø§Ù„: 42 âˆ’ 15.
â€¢ Ø§Ù„ÙˆØ­Ø¯Ø§Øª: 2 âˆ’ 5 Ù…Ø³ØªØ­ÙŠÙ„ â† Ù†Ø³ØªÙ„Ù Ø¹Ø´Ø±Ø©: 12 âˆ’ 5 = 7.
â€¢ Ø§Ù„Ø¹Ø´Ø±Ø§Øª: ÙŠØ¨Ù‚Ù‰ 3ØŒ Ø«Ù… 3 âˆ’ 1 = 2.
â€¢ Ø§Ù„Ù†ØªÙŠØ¬Ø©: 27.

Ø§Ù„ØªØ­Ù‚Ù‚ Ø¨Ø§Ù„Ø¬Ù…Ø¹
Ù†ØªØ­Ù‚Ù‚: 27 + 15 = 42. Ø¥Ø°Ø§ Ø±Ø¬Ø¹Ù†Ø§ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ± ÙØ§Ù„Ø¬ÙˆØ§Ø¨ ØµØ­ÙŠØ­!

ØªØ°ÙƒØ±: Ù†Ø¨Ø¯Ø£ Ø¨Ø§Ù„ÙˆØ­Ø¯Ø§ØªØŒ ÙˆØ¥Ø°Ø§ ØªØ¹Ø°Ù‘Ø± Ø§Ù„Ø·Ø±Ø­ Ù†Ø³ØªÙ„Ù Ø¹Ø´Ø±Ø© Ù…Ù† Ø§Ù„Ø¹Ù…ÙˆØ¯ Ø¹Ù„Ù‰ Ø§Ù„ÙŠØ³Ø§Ø±.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'soustraction-retenue';

update public.chapters c set
  lesson_fr = 'LA MULTIPLICATION

MULTIPLIER, C''EST ADDITIONNER PLUSIEURS FOIS
3 Ã— 4 veut dire Â« 3 fois 4 Â», c''est-Ã -dire 4 + 4 + 4 = 12.
On peut aussi voir 4 paquets de 3 : 3 + 3 + 3 + 3 = 12.

LE SIGNE Ã—
Le signe Ã— se lit Â« multipliÃ© par Â» ou Â« fois Â». Le rÃ©sultat s''appelle le
PRODUIT.

CE QUI AIDE
â€¢ Multiplier par 1 ne change rien : 7 Ã— 1 = 7.
â€¢ Multiplier par 0 donne toujours 0 : 8 Ã— 0 = 0.
â€¢ On peut changer l''ordre : 3 Ã— 4 = 4 Ã— 3 = 12.
â€¢ Multiplier par 2, c''est doubler : 6 Ã— 2 = 12.

LES DÃ‰BUTS DES TABLES
Table de 2 : 2, 4, 6, 8, 10â€¦ Table de 5 : 5, 10, 15, 20â€¦

Ã€ RETENIR : Â« fois Â» veut dire multiplier ; 3 Ã— 4 = 4 + 4 + 4.',
  lesson_ar = 'Ø§Ù„Ø¶Ø±Ø¨

Ø§Ù„Ø¶Ø±Ø¨ Ù‡Ùˆ Ø§Ù„Ø¬Ù…Ø¹ Ø§Ù„Ù…ØªÙƒØ±Ø±
3 Ã— 4 ØªØ¹Ù†ÙŠ Â«3 Ù…Ø±Ø§Øª 4Â»ØŒ Ø£ÙŠ 4 + 4 + 4 = 12.
ÙˆÙŠÙ…ÙƒÙ† Ø±Ø¤ÙŠØªÙ‡Ø§ 4 Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ù…Ù† 3: 3 + 3 + 3 + 3 = 12.

Ø§Ù„Ø±Ù…Ø² Ã—
Ø§Ù„Ø±Ù…Ø² Ã— ÙŠÙÙ‚Ø±Ø£ Â«Ù…Ø¶Ø±ÙˆØ¨ ÙÙŠÂ» Ø£Ùˆ Â«Ù…Ø±Ø©Â». Ø§Ù„Ù†ØªÙŠØ¬Ø© ØªÙØ³Ù…Ù‰ Ø§Ù„Ø¬Ø¯Ø§Ø¡.

Ù…Ø§ ÙŠØ³Ø§Ø¹Ø¯
â€¢ Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 1 Ù„Ø§ ÙŠØºÙŠÙ‘Ø± Ø´ÙŠØ¦Ù‹Ø§: 7 Ã— 1 = 7.
â€¢ Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 0 ÙŠØ¹Ø·ÙŠ 0 Ø¯Ø§Ø¦Ù…Ù‹Ø§: 8 Ã— 0 = 0.
â€¢ ÙŠÙ…ÙƒÙ† ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„ØªØ±ØªÙŠØ¨: 3 Ã— 4 = 4 Ã— 3.
â€¢ Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 2 Ù‡Ùˆ Ø§Ù„Ù…Ø¶Ø§Ø¹ÙØ©: 6 Ã— 2 = 12.

Ø¨Ø¯Ø§ÙŠØ§Øª Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„
Ø¬Ø¯ÙˆÙ„ 2: 2ØŒ 4ØŒ 6ØŒ 8ØŒ 10â€¦ Ø¬Ø¯ÙˆÙ„ 5: 5ØŒ 10ØŒ 15ØŒ 20â€¦

ØªØ°ÙƒØ±: Â«Ù…Ø±Ø©Â» ØªØ¹Ù†ÙŠ Ø§Ù„Ø¶Ø±Ø¨Ø› 3 Ã— 4 = 4 + 4 + 4.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'multiplication';

update public.chapters c set
  lesson_fr = 'LE TEMPS ET LES MESURES

LIRE L''HEURE
Une journÃ©e a 24 heures. L''horloge a une petite aiguille (les heures) et une
grande aiguille (les minutes). Quand la grande aiguille est sur 12, il est
Â« pile Â» l''heure. 1 heure = 60 minutes.

LES JOURS ET LES MOIS
La semaine a 7 jours (de samedi Ã  vendredi en AlgÃ©rie). L''annÃ©e a 12 mois et
365 jours.

MESURER LES LONGUEURS
On mesure avec une rÃ¨gle. L''unitÃ© est le CENTIMÃˆTRE (cm) et le MÃˆTRE (m).
1 mÃ¨tre = 100 centimÃ¨tres.
Un crayon fait environ 15 cm ; une porte fait environ 2 m.

COMPARER
Pour comparer, il faut la mÃªme unitÃ© : 1 m est plus long que 50 cm car
1 m = 100 cm.

Ã€ RETENIR : 1 heure = 60 minutes ; 1 mÃ¨tre = 100 centimÃ¨tres.',
  lesson_ar = 'Ø§Ù„ÙˆÙ‚Øª ÙˆØ§Ù„Ù‚ÙŠØ§Ø³

Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø³Ø§Ø¹Ø©
Ø§Ù„ÙŠÙˆÙ… 24 Ø³Ø§Ø¹Ø©. Ù„Ù„Ø³Ø§Ø¹Ø© Ø¹Ù‚Ø±Ø¨ ØµØºÙŠØ± (Ø§Ù„Ø³Ø§Ø¹Ø§Øª) ÙˆØ¹Ù‚Ø±Ø¨ ÙƒØ¨ÙŠØ± (Ø§Ù„Ø¯Ù‚Ø§Ø¦Ù‚). Ø¹Ù†Ø¯Ù…Ø§ ÙŠÙƒÙˆÙ† Ø§Ù„Ø¹Ù‚Ø±Ø¨
Ø§Ù„ÙƒØ¨ÙŠØ± Ø¹Ù„Ù‰ 12 ØªÙƒÙˆÙ† Ø§Ù„Ø³Ø§Ø¹Ø© Â«ØªÙ…Ø§Ù…Ù‹Ø§Â». 1 Ø³Ø§Ø¹Ø© = 60 Ø¯Ù‚ÙŠÙ‚Ø©.

Ø§Ù„Ø£ÙŠØ§Ù… ÙˆØ§Ù„Ø£Ø´Ù‡Ø±
Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ 7 Ø£ÙŠØ§Ù…. Ø§Ù„Ø³Ù†Ø© 12 Ø´Ù‡Ø±Ù‹Ø§ Ùˆ365 ÙŠÙˆÙ…Ù‹Ø§.

Ù‚ÙŠØ§Ø³ Ø§Ù„Ø£Ø·ÙˆØ§Ù„
Ù†Ù‚ÙŠØ³ Ø¨Ø§Ù„Ù…Ø³Ø·Ø±Ø©. Ø§Ù„ÙˆØ­Ø¯Ø© Ù‡ÙŠ Ø§Ù„Ø³Ù†ØªÙŠÙ…ØªØ± (Ø³Ù…) ÙˆØ§Ù„Ù…ØªØ± (Ù…). 1 Ù…ØªØ± = 100 Ø³Ù†ØªÙŠÙ…ØªØ±.
Ø§Ù„Ù‚Ù„Ù… Ø­ÙˆØ§Ù„ÙŠ 15 Ø³Ù…Ø› Ø§Ù„Ø¨Ø§Ø¨ Ø­ÙˆØ§Ù„ÙŠ 2 Ù….

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù„Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ù†Ø­ØªØ§Ø¬ Ù†ÙØ³ Ø§Ù„ÙˆØ­Ø¯Ø©: 1 Ù… Ø£Ø·ÙˆÙ„ Ù…Ù† 50 Ø³Ù… Ù„Ø£Ù† 1 Ù… = 100 Ø³Ù….

ØªØ°ÙƒØ±: 1 Ø³Ø§Ø¹Ø© = 60 Ø¯Ù‚ÙŠÙ‚Ø©Ø› 1 Ù…ØªØ± = 100 Ø³Ù†ØªÙŠÙ…ØªØ±.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'mesures-temps';

update public.chapters c set
  lesson_fr = 'LES NOMBRES JUSQU''Ã€ 10 000

LES CLASSES
Le nombre 4 573 = 4 milliers, 5 centaines, 7 dizaines, 3 unitÃ©s.
1 000 = 1 millier = 10 centaines.

LIRE UN GRAND NOMBRE
4 573 se lit Â« quatre mille cinq cent soixante-treize Â». On lit d''abord les
milliers, puis le reste.

COMPARER ET RANGER
On compare d''abord la classe la plus grande (les milliers), puis on descend.
2 999 < 3 001 car 2 milliers < 3 milliers.

LA DROITE GRADUÃ‰E
Chaque nombre a une place sur la droite graduÃ©e. On peut situer 3 500 entre
3 000 et 4 000, au milieu.

Ã€ RETENIR : pour comparer deux grands nombres, on regarde d''abord le chiffre
des milliers.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø­ØªÙ‰ 10000

Ø§Ù„Ø£Ù‚Ø³Ø§Ù…
Ø§Ù„Ø¹Ø¯Ø¯ 4573 = 4 Ø¢Ù„Ø§Ù Ùˆ5 Ù…Ø¦Ø§Øª Ùˆ7 Ø¹Ø´Ø±Ø§Øª Ùˆ3 ÙˆØ­Ø¯Ø§Øª.
1000 = Ø£Ù„Ù ÙˆØ§Ø­Ø¯ = 10 Ù…Ø¦Ø§Øª.

Ù‚Ø±Ø§Ø¡Ø© Ø¹Ø¯Ø¯ ÙƒØ¨ÙŠØ±
4573 ÙŠÙÙ‚Ø±Ø£ Â«Ø£Ø±Ø¨Ø¹Ø© Ø¢Ù„Ø§Ù ÙˆØ®Ù…Ø³Ù…Ø¦Ø© ÙˆØ«Ù„Ø§Ø«Ø© ÙˆØ³Ø¨Ø¹ÙˆÙ†Â». Ù†Ù‚Ø±Ø£ Ø§Ù„Ø¢Ù„Ø§Ù Ø£ÙˆÙ„Ø§Ù‹ Ø«Ù… Ø§Ù„Ø¨Ø§Ù‚ÙŠ.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© ÙˆØ§Ù„ØªØ±ØªÙŠØ¨
Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ø£ÙƒØ¨Ø± (Ø§Ù„Ø¢Ù„Ø§Ù) Ø£ÙˆÙ„Ø§Ù‹ Ø«Ù… Ù†Ù†Ø²Ù„.
2999 < 3001 Ù„Ø£Ù† 2 Ø£Ù„Ù < 3 Ø¢Ù„Ø§Ù.

Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ø§Ù„Ù…Ø¯Ø±Ù‘Ø¬
Ù„ÙƒÙ„ Ø¹Ø¯Ø¯ Ù…ÙƒØ§Ù† Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªÙ‚ÙŠÙ… Ø§Ù„Ù…Ø¯Ø±Ù‘Ø¬. Ù†Ø¶Ø¹ 3500 Ø¨ÙŠÙ† 3000 Ùˆ4000 ÙÙŠ Ø§Ù„Ù…Ù†ØªØµÙ.

ØªØ°ÙƒØ±: Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø¹Ø¯Ø¯ÙŠÙ† ÙƒØ¨ÙŠØ±ÙŠÙ† Ù†Ù†Ø¸Ø± Ø£ÙˆÙ„Ø§Ù‹ Ø¥Ù„Ù‰ Ø±Ù‚Ù… Ø§Ù„Ø¢Ù„Ø§Ù.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'nombres-10000';

update public.chapters c set
  lesson_fr = 'LES TABLES DE MULTIPLICATION

Ã€ QUOI Ã‡A SERT ?
ConnaÃ®tre ses tables permet de calculer vite, sans compter sur les doigts.
C''est la base de toutes les maths qui suivent.

LES ASTUCES
â€¢ Table de 2 : on double. 2Ã—7 = 14.
â€¢ Table de 5 : le rÃ©sultat finit toujours par 0 ou 5. 5Ã—6 = 30.
â€¢ Table de 10 : on ajoute un 0. 10Ã—4 = 40.
â€¢ Table de 9 : les dizaines montent, les unitÃ©s descendent (9, 18, 27, 36â€¦).
â€¢ 3Ã—4 = 4Ã—3 : apprendre une moitiÃ© suffit (on retourne).

LE PRODUIT
Le rÃ©sultat d''une multiplication s''appelle le produit. Dans 6 Ã— 7 = 42,
42 est le produit.

Ã€ RETENIR : apprendre ses tables par cÅ“ur fait gagner beaucoup de temps.
RÃ©viser un peu chaque jour est la meilleure mÃ©thode.',
  lesson_ar = 'Ø¬Ø¯Ø§ÙˆÙ„ Ø§Ù„Ø¶Ø±Ø¨

Ù…Ø§ ÙØ§Ø¦Ø¯ØªÙ‡Ø§ØŸ
Ù…Ø¹Ø±ÙØ© Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„ ØªØªÙŠØ­ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø¨Ø³Ø±Ø¹Ø© Ø¯ÙˆÙ† Ø§Ù„Ø¹Ø¯Ù‘ Ø¨Ø§Ù„Ø£ØµØ§Ø¨Ø¹ØŒ ÙˆÙ‡ÙŠ Ø£Ø³Ø§Ø³ ÙƒÙ„ Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠØ§Øª Ø§Ù„Ù„Ø§Ø­Ù‚Ø©.

Ø§Ù„Ø­ÙŠÙ„
â€¢ Ø¬Ø¯ÙˆÙ„ 2: Ù†Ø¶Ø§Ø¹Ù. 2Ã—7 = 14.
â€¢ Ø¬Ø¯ÙˆÙ„ 5: Ø§Ù„Ù†ØªÙŠØ¬Ø© ØªÙ†ØªÙ‡ÙŠ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø¨Ù€ 0 Ø£Ùˆ 5. 5Ã—6 = 30.
â€¢ Ø¬Ø¯ÙˆÙ„ 10: Ù†Ø¶ÙŠÙ ØµÙØ±Ù‹Ø§. 10Ã—4 = 40.
â€¢ Ø¬Ø¯ÙˆÙ„ 9: Ø§Ù„Ø¹Ø´Ø±Ø§Øª ØªØµØ¹Ø¯ ÙˆØ§Ù„ÙˆØ­Ø¯Ø§Øª ØªÙ†Ø²Ù„ (9ØŒ 18ØŒ 27ØŒ 36â€¦).
â€¢ 3Ã—4 = 4Ã—3: ÙŠÙƒÙÙŠ Ø­ÙØ¸ Ù†ØµÙ Ø§Ù„Ø¬Ø¯ÙˆÙ„.

Ø§Ù„Ø¬Ø¯Ø§Ø¡
Ù†ØªÙŠØ¬Ø© Ø§Ù„Ø¶Ø±Ø¨ ØªÙØ³Ù…Ù‰ Ø§Ù„Ø¬Ø¯Ø§Ø¡. ÙÙŠ 6 Ã— 7 = 42ØŒ Ø§Ù„Ø¹Ø¯Ø¯ 42 Ù‡Ùˆ Ø§Ù„Ø¬Ø¯Ø§Ø¡.

ØªØ°ÙƒØ±: Ø­ÙØ¸ Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„ Ø¹Ù† Ø¸Ù‡Ø± Ù‚Ù„Ø¨ ÙŠÙˆÙÙ‘Ø± ÙˆÙ‚ØªÙ‹Ø§ ÙƒØ¨ÙŠØ±Ù‹Ø§ØŒ ÙˆØ§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ÙŠÙˆÙ…ÙŠØ© Ø£ÙØ¶Ù„ Ø·Ø±ÙŠÙ‚Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'tables';

update public.chapters c set
  lesson_fr = 'LA DIVISION

PARTAGER EN PARTS Ã‰GALES
Diviser, c''est partager Ã©quitablement. 12 Ã· 3 = 4 : je partage 12 bonbons
entre 3 enfants, chacun reÃ§oit 4.

LE SIGNE Ã·
12 Ã· 3 se lit Â« douze divisÃ© par trois Â». Le rÃ©sultat s''appelle le QUOTIENT.

LIEN AVEC LA MULTIPLICATION
La division est le contraire de la multiplication :
si 3 Ã— 4 = 12, alors 12 Ã· 3 = 4 et 12 Ã· 4 = 3.
ConnaÃ®tre ses tables aide Ã©normÃ©ment pour diviser !

LE RESTE
Parfois le partage n''est pas exact. 13 Ã· 4 : chacun a 3 (car 4Ã—3 = 12) et il
RESTE 1. On Ã©crit : 13 = 4 Ã— 3 + 1.

Ã€ RETENIR : diviser, c''est partager en parts Ã©gales ; le reste est toujours
plus petit que le nombre par lequel on divise.',
  lesson_ar = 'Ø§Ù„Ù‚Ø³Ù…Ø©

Ø§Ù„ØªÙ‚Ø³ÙŠÙ… Ø¥Ù„Ù‰ Ø£Ø¬Ø²Ø§Ø¡ Ù…ØªØ³Ø§ÙˆÙŠØ©
Ø§Ù„Ù‚Ø³Ù…Ø© ØªØ¹Ù†ÙŠ Ø§Ù„ØªÙˆØ²ÙŠØ¹ Ø¨Ø§Ù„ØªØ³Ø§ÙˆÙŠ. 12 Ã· 3 = 4: Ø£ÙˆØ²Ù‘Ø¹ 12 Ø­Ù„ÙˆÙ‰ Ø¹Ù„Ù‰ 3 Ø£Ø·ÙØ§Ù„ ÙÙŠÙ†Ø§Ù„ ÙƒÙ„ ÙˆØ§Ø­Ø¯ 4.

Ø§Ù„Ø±Ù…Ø² Ã·
12 Ã· 3 ÙŠÙÙ‚Ø±Ø£ Â«Ø§Ø«Ù†Ø§ Ø¹Ø´Ø± Ù…Ù‚Ø³ÙˆÙ… Ø¹Ù„Ù‰ Ø«Ù„Ø§Ø«Ø©Â». Ø§Ù„Ù†ØªÙŠØ¬Ø© ØªÙØ³Ù…Ù‰ Ø§Ù„Ø­Ø§ØµÙ„ (Ø®Ø§Ø±Ø¬ Ø§Ù„Ù‚Ø³Ù…Ø©).

Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø¨Ø§Ù„Ø¶Ø±Ø¨
Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹ÙƒØ³ Ø§Ù„Ø¶Ø±Ø¨:
Ø¥Ø°Ø§ ÙƒØ§Ù† 3 Ã— 4 = 12 ÙØ¥Ù† 12 Ã· 3 = 4 Ùˆ 12 Ã· 4 = 3.
Ù…Ø¹Ø±ÙØ© Ø§Ù„Ø¬Ø¯Ø§ÙˆÙ„ ØªØ³Ø§Ø¹Ø¯ ÙƒØ«ÙŠØ±Ù‹Ø§ ÙÙŠ Ø§Ù„Ù‚Ø³Ù…Ø©!

Ø§Ù„Ø¨Ø§Ù‚ÙŠ
Ø£Ø­ÙŠØ§Ù†Ù‹Ø§ Ù„Ø§ ÙŠÙƒÙˆÙ† Ø§Ù„ØªÙ‚Ø³ÙŠÙ… ØªØ§Ù…Ù‹Ø§. 13 Ã· 4: Ù„ÙƒÙ„ ÙˆØ§Ø­Ø¯ 3 (Ù„Ø£Ù† 4Ã—3 = 12) ÙˆÙŠØ¨Ù‚Ù‰ 1.
Ù†ÙƒØªØ¨: 13 = 4 Ã— 3 + 1.

ØªØ°ÙƒØ±: Ø§Ù„Ù‚Ø³Ù…Ø© ØªÙ‚Ø³ÙŠÙ… Ù…ØªØ³Ø§ÙˆÙØŒ ÙˆØ§Ù„Ø¨Ø§Ù‚ÙŠ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø£ØµØºØ± Ù…Ù† Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø°ÙŠ Ù†Ù‚Ø³Ù… Ø¹Ù„ÙŠÙ‡.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'division';

update public.chapters c set
  lesson_fr = 'LE PÃ‰RIMÃˆTRE

C''EST QUOI LE PÃ‰RIMÃˆTRE ?
Le pÃ©rimÃ¨tre, c''est la longueur du TOUR d''une figure. Si tu marches tout
autour d''un terrain, la distance parcourue est son pÃ©rimÃ¨tre.

COMMENT LE CALCULER
On additionne la longueur de tous les cÃ´tÃ©s.
â€¢ Triangle de cÃ´tÃ©s 3, 4, 5 cm : P = 3 + 4 + 5 = 12 cm.
â€¢ CarrÃ© de cÃ´tÃ© 5 cm : les 4 cÃ´tÃ©s sont Ã©gaux â†’ P = 5 + 5 + 5 + 5 = 20 cm,
  ou plus vite : P = 4 Ã— 5 = 20 cm.
â€¢ Rectangle de 6 cm et 4 cm : P = 6 + 4 + 6 + 4 = 20 cm,
  ou P = 2 Ã— (6 + 4) = 20 cm.

L''UNITÃ‰
Le pÃ©rimÃ¨tre est une longueur : il se mesure en cm, m, kmâ€¦

Ã€ RETENIR : pÃ©rimÃ¨tre = on fait le tour et on additionne tous les cÃ´tÃ©s.',
  lesson_ar = 'Ø§Ù„Ù…Ø­ÙŠØ·

Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ù…Ø­ÙŠØ·ØŸ
Ø§Ù„Ù…Ø­ÙŠØ· Ù‡Ùˆ Ø·ÙˆÙ„ Ø§Ù„Ø¯ÙˆØ±Ø§Ù† Ø­ÙˆÙ„ Ø§Ù„Ø´ÙƒÙ„. Ø¥Ø°Ø§ Ù…Ø´ÙŠØª Ø­ÙˆÙ„ Ø£Ø±Ø¶ØŒ ÙØ§Ù„Ù…Ø³Ø§ÙØ© Ø§Ù„ØªÙŠ Ù‚Ø·Ø¹ØªÙ‡Ø§ Ù‡ÙŠ Ù…Ø­ÙŠØ·Ù‡Ø§.

ÙƒÙŠÙ Ù†Ø­Ø³Ø¨Ù‡
Ù†Ø¬Ù…Ø¹ Ø£Ø·ÙˆØ§Ù„ ÙƒÙ„ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹.
â€¢ Ù…Ø«Ù„Ø« Ø£Ø¶Ù„Ø§Ø¹Ù‡ 3 Ùˆ4 Ùˆ5 Ø³Ù…: Ø§Ù„Ù…Ø­ÙŠØ· = 3 + 4 + 5 = 12 Ø³Ù….
â€¢ Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 5 Ø³Ù…: Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹ Ø§Ù„Ø£Ø±Ø¨Ø¹Ø© Ù…ØªØ³Ø§ÙˆÙŠØ© â† 5 + 5 + 5 + 5 = 20 Ø³Ù…ØŒ
  Ø£Ùˆ Ø£Ø³Ø±Ø¹: 4 Ã— 5 = 20 Ø³Ù….
â€¢ Ù…Ø³ØªØ·ÙŠÙ„ 6 Ø³Ù… Ùˆ4 Ø³Ù…: 6 + 4 + 6 + 4 = 20 Ø³Ù…ØŒ Ø£Ùˆ 2 Ã— (6 + 4) = 20 Ø³Ù….

Ø§Ù„ÙˆØ­Ø¯Ø©
Ø§Ù„Ù…Ø­ÙŠØ· Ø·ÙˆÙ„: ÙŠÙÙ‚Ø§Ø³ Ø¨Ø§Ù„Ø³Ù… ÙˆØ§Ù„Ù… ÙˆØ§Ù„ÙƒÙ…â€¦

ØªØ°ÙƒØ±: Ø§Ù„Ù…Ø­ÙŠØ· = Ù†Ø¯ÙˆØ± Ø­ÙˆÙ„ Ø§Ù„Ø´ÙƒÙ„ ÙˆÙ†Ø¬Ù…Ø¹ ÙƒÙ„ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'perimetre';

update public.chapters c set
  lesson_fr = 'RÃ‰SOUDRE DES PROBLÃˆMES

LES 3 Ã‰TAPES
1. LIRE l''Ã©noncÃ© et bien comprendre la question.
2. CHOISIR la bonne opÃ©ration.
3. CALCULER et Ã©crire une phrase-rÃ©ponse avec l''unitÃ©.

LES MOTS QUI AIDENT
â€¢ Â« en tout Â», Â« ensemble Â», Â« au total Â» â†’ addition (+).
â€¢ Â« reste Â», Â« il enlÃ¨ve Â», Â« de moins Â» â†’ soustraction (âˆ’).
â€¢ Â« chaque â€¦ fois Â», Â« par paquets de Â» â†’ multiplication (Ã—).
â€¢ Â« partager Â», Â« rÃ©partir Ã©galement Â» â†’ division (Ã·).

EXEMPLE
Â« Un fermier a 4 caisses de 8 oranges. Combien d''oranges en tout ? Â»
Mot clÃ© : Â« en tout Â» + Â« caisses de Â» â†’ 4 Ã— 8 = 32.
RÃ©ponse : le fermier a 32 oranges.

Ã€ RETENIR : on Ã©crit toujours une phrase-rÃ©ponse complÃ¨te avec l''unitÃ©
(oranges, DA, cmâ€¦).',
  lesson_ar = 'Ø­Ù„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø§Øª

Ø§Ù„Ø®Ø·ÙˆØ§Øª Ø§Ù„Ø«Ù„Ø§Ø«
1. Ù†Ù‚Ø±Ø£ Ø§Ù„Ù†Øµ ÙˆÙ†ÙÙ‡Ù… Ø§Ù„Ø³Ø¤Ø§Ù„ Ø¬ÙŠØ¯Ù‹Ø§.
2. Ù†Ø®ØªØ§Ø± Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø§Ù„ØµØ­ÙŠØ­Ø©.
3. Ù†Ø­Ø³Ø¨ ÙˆÙ†ÙƒØªØ¨ Ø¬Ù…Ù„Ø© Ø§Ù„Ø¬ÙˆØ§Ø¨ Ù…Ø¹ Ø§Ù„ÙˆØ­Ø¯Ø©.

Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©
â€¢ Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â»ØŒ Â«Ù…Ø¹Ù‹Ø§Â» â† Ø§Ù„Ø¬Ù…Ø¹ (+).
â€¢ Â«Ø§Ù„Ø¨Ø§Ù‚ÙŠÂ»ØŒ Â«ÙŠÙØ²ÙŠÙ„Â»ØŒ Â«Ø£Ù‚Ù„ Ø¨Ù€Â» â† Ø§Ù„Ø·Ø±Ø­ (âˆ’).
â€¢ Â«ÙƒÙ„ â€¦ Ù…Ø±Ø©Â»ØŒ Â«Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ù…Ù†Â» â† Ø§Ù„Ø¶Ø±Ø¨ (Ã—).
â€¢ Â«Ù†Ù‚Ø³Ù…Â»ØŒ Â«Ù†ÙˆØ²Ù‘Ø¹ Ø¨Ø§Ù„ØªØ³Ø§ÙˆÙŠÂ» â† Ø§Ù„Ù‚Ø³Ù…Ø© (Ã·).

Ù…Ø«Ø§Ù„
Â«ÙÙ„Ø§Ø­ Ù„Ø¯ÙŠÙ‡ 4 ØµÙ†Ø§Ø¯ÙŠÙ‚ Ù…Ù† 8 Ø¨Ø±ØªÙ‚Ø§Ù„Ø§Øª. ÙƒÙ… Ø¨Ø±ØªÙ‚Ø§Ù„Ø© ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸÂ»
Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ©: Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» + Â«ØµÙ†Ø§Ø¯ÙŠÙ‚ Ù…Ù†Â» â† 4 Ã— 8 = 32.
Ø§Ù„Ø¬ÙˆØ§Ø¨: Ù„Ø¯Ù‰ Ø§Ù„ÙÙ„Ø§Ø­ 32 Ø¨Ø±ØªÙ‚Ø§Ù„Ø©.

ØªØ°ÙƒØ±: Ù†ÙƒØªØ¨ Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ø¬Ù…Ù„Ø© Ø¬ÙˆØ§Ø¨ ÙƒØ§Ù…Ù„Ø© Ù…Ø¹ Ø§Ù„ÙˆØ­Ø¯Ø© (Ø¨Ø±ØªÙ‚Ø§Ù„Ø©ØŒ Ø¯Ø¬ØŒ Ø³Ù…â€¦).'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'problemes';

update public.chapters c set
  lesson_fr = 'LES GRANDS NOMBRES

LES CLASSES
Un grand nombre se lit par classes de 3 chiffres :
â€¦ | millions | milliers | unitÃ©s.
Exemple : 1 254 630 = 1 million, 254 milliers, 630 unitÃ©s.

LIRE ET Ã‰CRIRE
On lit chaque classe puis on ajoute son nom : Â« un million deux cent
cinquante-quatre mille six cent trente Â». On laisse un petit espace entre
les classes pour lire plus facilement.

VALEUR D''UN CHIFFRE
Dans 1 254 630, le 2 vaut 200 000 (il est au rang des centaines de mille).

COMPARER
On compare classe par classe, en partant de la gauche.
1 254 630 > 998 000 car il y a plus de classes (7 chiffres contre 6).

Ã€ RETENIR : on regroupe les chiffres par 3 depuis la droite pour lire
facilement les grands nombres.',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ±Ø©

Ø§Ù„Ø£Ù‚Ø³Ø§Ù…
ÙŠÙÙ‚Ø±Ø£ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ± Ø¨Ø£Ù‚Ø³Ø§Ù… Ù…Ù† 3 Ø£Ø±Ù‚Ø§Ù…:
â€¦ | Ù…Ù„Ø§ÙŠÙŠÙ† | Ø¢Ù„Ø§Ù | ÙˆØ­Ø¯Ø§Øª.
Ù…Ø«Ø§Ù„: 1254630 = Ù…Ù„ÙŠÙˆÙ† Ùˆ254 Ø£Ù„ÙÙ‹Ø§ Ùˆ630.

Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© ÙˆØ§Ù„ÙƒØªØ§Ø¨Ø©
Ù†Ù‚Ø±Ø£ ÙƒÙ„ Ù‚Ø³Ù… Ø«Ù… Ù†Ø¶ÙŠÙ Ø§Ø³Ù…Ù‡: Â«Ù…Ù„ÙŠÙˆÙ† ÙˆÙ…Ø¦ØªØ§Ù† ÙˆØ£Ø±Ø¨Ø¹Ø© ÙˆØ®Ù…Ø³ÙˆÙ† Ø£Ù„ÙÙ‹Ø§ ÙˆØ³ØªÙ…Ø¦Ø© ÙˆØ«Ù„Ø§Ø«ÙˆÙ†Â».
Ù†ØªØ±Ùƒ ÙØ±Ø§ØºÙ‹Ø§ ØµØºÙŠØ±Ù‹Ø§ Ø¨ÙŠÙ† Ø§Ù„Ø£Ù‚Ø³Ø§Ù… Ù„ØªØ³Ù‡ÙŠÙ„ Ø§Ù„Ù‚Ø±Ø§Ø¡Ø©.

Ù‚ÙŠÙ…Ø© Ø§Ù„Ø±Ù‚Ù…
ÙÙŠ 1254630ØŒ Ø§Ù„Ø±Ù‚Ù… 2 ÙŠØ³Ø§ÙˆÙŠ 200000 (ÙÙŠ Ù…Ø±ØªØ¨Ø© Ù…Ø¦Ø§Øª Ø§Ù„Ø¢Ù„Ø§Ù).

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù†Ù‚Ø§Ø±Ù† Ù‚Ø³Ù…Ù‹Ø§ Ù‚Ø³Ù…Ù‹Ø§ Ù…Ù† Ø§Ù„ÙŠØ³Ø§Ø±.
1254630 > 998000 Ù„Ø£Ù† Ø£Ø±Ù‚Ø§Ù…Ù‡ Ø£ÙƒØ«Ø± (7 Ù…Ù‚Ø§Ø¨Ù„ 6).

ØªØ°ÙƒØ±: Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø£Ø±Ù‚Ø§Ù… Ø«Ù„Ø§Ø«Ø© Ø«Ù„Ø§Ø«Ø© Ù…Ù† Ø§Ù„ÙŠÙ…ÙŠÙ† Ù„Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„ÙƒØ¨ÙŠØ±Ø© Ø¨Ø³Ù‡ÙˆÙ„Ø©.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres';

update public.chapters c set
  lesson_fr = 'LES FRACTIONS

UNE FRACTION, C''EST UN PARTAGE
Quand on partage un gÃ¢teau en parts Ã©gales, chaque part est une fraction.
3/4 (trois quarts) : on a coupÃ© en 4 parts et on en prend 3.
â€¢ Le nombre du bas (dÃ©nominateur) = en combien de parts on coupe.
â€¢ Le nombre du haut (numÃ©rateur) = combien de parts on prend.

DES FRACTIONS QU''ON CONNAÃŽT
â€¢ 1/2 = un demi (la moitiÃ©).
â€¢ 1/4 = un quart.
â€¢ 3/4 = trois quarts.

COMPARER Ã€ 1
â€¢ Si le haut est plus petit que le bas â†’ la fraction est plus petite que 1
  (2/3 < 1).
â€¢ Si le haut = le bas â†’ la fraction vaut 1 (4/4 = 1).

Ã€ RETENIR : le dÃ©nominateur (en bas) dit en combien de parts on coupe ; le
numÃ©rateur (en haut) dit combien on en prend.',
  lesson_ar = 'Ø§Ù„ÙƒØ³ÙˆØ±

Ø§Ù„ÙƒØ³Ø± ØªØ¬Ø²Ø¦Ø©
Ø¹Ù†Ø¯Ù…Ø§ Ù†Ù‚Ø³Ù… ÙƒØ¹ÙƒØ© Ø¥Ù„Ù‰ Ø£Ø¬Ø²Ø§Ø¡ Ù…ØªØ³Ø§ÙˆÙŠØ©ØŒ ÙƒÙ„ Ø¬Ø²Ø¡ ÙƒØ³Ø±.
3/4 (Ø«Ù„Ø§Ø«Ø© Ø£Ø±Ø¨Ø§Ø¹): Ù‚Ø·Ø¹Ù†Ø§Ù‡Ø§ Ø¥Ù„Ù‰ 4 Ø£Ø¬Ø²Ø§Ø¡ ÙˆØ£Ø®Ø°Ù†Ø§ 3.
â€¢ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø³ÙÙ„ÙŠ (Ø§Ù„Ù…Ù‚Ø§Ù…) = Ø¥Ù„Ù‰ ÙƒÙ… Ø¬Ø²Ø¡ Ù†Ù‚Ø·Ø¹.
â€¢ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ù„ÙˆÙŠ (Ø§Ù„Ø¨Ø³Ø·) = ÙƒÙ… Ø¬Ø²Ø¡Ù‹Ø§ Ù†Ø£Ø®Ø°.

ÙƒØ³ÙˆØ± Ù†Ø¹Ø±ÙÙ‡Ø§
â€¢ 1/2 = Ù†ØµÙ. â€¢ 1/4 = Ø±Ø¨Ø¹. â€¢ 3/4 = Ø«Ù„Ø§Ø«Ø© Ø£Ø±Ø¨Ø§Ø¹.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ù€ 1
â€¢ Ø¥Ø°Ø§ ÙƒØ§Ù† Ø§Ù„Ø£Ø¹Ù„Ù‰ Ø£ØµØºØ± Ù…Ù† Ø§Ù„Ø£Ø³ÙÙ„ â† Ø§Ù„ÙƒØ³Ø± Ø£ØµØºØ± Ù…Ù† 1 (2/3 < 1).
â€¢ Ø¥Ø°Ø§ ØªØ³Ø§ÙˆÙ‰ Ø§Ù„Ø£Ø¹Ù„Ù‰ ÙˆØ§Ù„Ø£Ø³ÙÙ„ â† Ø§Ù„ÙƒØ³Ø± ÙŠØ³Ø§ÙˆÙŠ 1 (4/4 = 1).

ØªØ°ÙƒØ±: Ø§Ù„Ù…Ù‚Ø§Ù… (Ø§Ù„Ø£Ø³ÙÙ„) ÙŠÙ‚ÙˆÙ„ Ø¥Ù„Ù‰ ÙƒÙ… Ø¬Ø²Ø¡ Ù†Ù‚Ø·Ø¹ØŒ ÙˆØ§Ù„Ø¨Ø³Ø· (Ø§Ù„Ø£Ø¹Ù„Ù‰) ÙŠÙ‚ÙˆÙ„ ÙƒÙ… Ù†Ø£Ø®Ø°.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'fractions';

update public.chapters c set
  lesson_fr = 'LES NOMBRES DÃ‰CIMAUX

LA VIRGULE
Un nombre dÃ©cimal a une partie entiÃ¨re et une partie dÃ©cimale sÃ©parÃ©es par
une virgule. 3,5 : le 3 est la partie entiÃ¨re, le 5 est la partie dÃ©cimale.

LES DIXIÃˆMES
AprÃ¨s la virgule, le premier chiffre compte les DIXIÃˆMES.
3,5 = 3 unitÃ©s et 5 dixiÃ¨mes.
On peut le voir comme une fraction : 3,5 = 3 + 5/10.

LIEN AVEC L''ARGENT ET LES MESURES
â€¢ 2,50 DA = 2 dinars et 50 centimes.
â€¢ 1,5 m = 1 mÃ¨tre et 50 centimÃ¨tres.

COMPARER
On compare d''abord la partie entiÃ¨re : 4,2 > 3,9.
Si la partie entiÃ¨re est la mÃªme, on regarde aprÃ¨s la virgule : 3,7 > 3,2.

Ã€ RETENIR : le premier chiffre aprÃ¨s la virgule, ce sont les dixiÃ¨mes.
3,5 = 3,50 (on peut ajouter un zÃ©ro Ã  droite).',
  lesson_ar = 'Ø§Ù„Ø£Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠØ©

Ø§Ù„ÙØ§ØµÙ„Ø©
Ù„Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ø´Ø±ÙŠ Ø¬Ø²Ø¡ ØµØ­ÙŠØ­ ÙˆØ¬Ø²Ø¡ Ø¹Ø´Ø±ÙŠ ØªÙØµÙ„ Ø¨ÙŠÙ†Ù‡Ù…Ø§ ÙØ§ØµÙ„Ø©. 3.5: Ø§Ù„Ø¹Ø¯Ø¯ 3 Ø¬Ø²Ø¡ ØµØ­ÙŠØ­ ÙˆØ§Ù„Ø¹Ø¯Ø¯ 5 Ø¬Ø²Ø¡ Ø¹Ø´Ø±ÙŠ.

Ø§Ù„Ø£Ø¹Ø´Ø§Ø±
Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø©ØŒ Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø£ÙˆÙ„ ÙŠØ¹Ø¯Ù‘ Ø§Ù„Ø£Ø¹Ø´Ø§Ø±.
3.5 = 3 ÙˆØ­Ø¯Ø§Øª Ùˆ5 Ø£Ø¹Ø´Ø§Ø±.
ÙˆÙŠÙ…ÙƒÙ† Ø±Ø¤ÙŠØªÙ‡ ÙƒÙƒØ³Ø±: 3.5 = 3 + 5/10.

Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø¨Ø§Ù„Ù…Ø§Ù„ ÙˆØ§Ù„Ù‚ÙŠØ§Ø³
â€¢ 2.50 Ø¯Ø¬ = 2 Ø¯ÙŠÙ†Ø§Ø± Ùˆ50 Ø³Ù†ØªÙŠÙ…Ù‹Ø§.
â€¢ 1.5 Ù… = 1 Ù…ØªØ± Ùˆ50 Ø³Ù†ØªÙŠÙ…ØªØ±Ù‹Ø§.

Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø©
Ù†Ù‚Ø§Ø±Ù† Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØµØ­ÙŠØ­ Ø£ÙˆÙ„Ø§Ù‹: 4.2 > 3.9.
Ø¥Ø°Ø§ ØªØ³Ø§ÙˆÙ‰ Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØµØ­ÙŠØ­ Ù†Ù†Ø¸Ø± Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø©: 3.7 > 3.2.

ØªØ°ÙƒØ±: Ø£ÙˆÙ„ Ø±Ù‚Ù… Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© Ù‡Ùˆ Ø§Ù„Ø£Ø¹Ø´Ø§Ø±. 3.5 = 3.50.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'decimaux';

update public.chapters c set
  lesson_fr = 'LES QUATRE OPÃ‰RATIONS

LES QUATRE OPÃ‰RATIONS
â€¢ Addition (+) : rÃ©unir. 45 + 27 = 72.
â€¢ Soustraction (âˆ’) : enlever. 72 âˆ’ 27 = 45.
â€¢ Multiplication (Ã—) : rÃ©pÃ©ter. 6 Ã— 7 = 42.
â€¢ Division (Ã·) : partager. 42 Ã· 6 = 7.

CE QUI SE VÃ‰RIFIE
â€¢ L''addition et la soustraction se vÃ©rifient l''une l''autre.
â€¢ La multiplication et la division se vÃ©rifient l''une l''autre.

L''ORDRE DES CALCULS
Quand il y a plusieurs opÃ©rations, on fait d''abord la multiplication et la
division, ensuite l''addition et la soustraction.
5 + 3 Ã— 2 = 5 + 6 = 11 (et non 16).

CHOISIR LA BONNE OPÃ‰RATION
On repÃ¨re les mots-clÃ©s : Â« en tout Â» (addition), Â« reste Â» (soustraction),
Â« fois Â» (multiplication), Â« partager Â» (division).

Ã€ RETENIR : dans un calcul mÃ©langÃ©, la multiplication et la division passent
AVANT l''addition et la soustraction.',
  lesson_ar = 'Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø£Ø±Ø¨Ø¹

Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø£Ø±Ø¨Ø¹
â€¢ Ø§Ù„Ø¬Ù…Ø¹ (+): Ø§Ù„Ø¶Ù…Ù‘. 45 + 27 = 72.
â€¢ Ø§Ù„Ø·Ø±Ø­ (âˆ’): Ø§Ù„Ø¥Ø²Ø§Ù„Ø©. 72 âˆ’ 27 = 45.
â€¢ Ø§Ù„Ø¶Ø±Ø¨ (Ã—): Ø§Ù„ØªÙƒØ±Ø§Ø±. 6 Ã— 7 = 42.
â€¢ Ø§Ù„Ù‚Ø³Ù…Ø© (Ã·): Ø§Ù„ØªÙ‚Ø³ÙŠÙ…. 42 Ã· 6 = 7.

Ù…Ø§ ÙŠØªØ­Ù‚Ù‚
â€¢ Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­ ÙŠØªØ­Ù‚Ù‚ Ø£Ø­Ø¯Ù‡Ù…Ø§ Ø¨Ø§Ù„Ø¢Ø®Ø±.
â€¢ Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© ÙŠØªØ­Ù‚Ù‚ Ø£Ø­Ø¯Ù‡Ù…Ø§ Ø¨Ø§Ù„Ø¢Ø®Ø±.

ØªØ±ØªÙŠØ¨ Ø§Ù„Ø­Ø³Ø§Ø¨
Ø¹Ù†Ø¯ ÙˆØ¬ÙˆØ¯ Ø¹Ø¯Ø© Ø¹Ù…Ù„ÙŠØ§ØªØŒ Ù†Ø¨Ø¯Ø£ Ø¨Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© Ø«Ù… Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­.
5 + 3 Ã— 2 = 5 + 6 = 11 (ÙˆÙ„ÙŠØ³ 16).

Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø§Ù„ØµØ­ÙŠØ­Ø©
Ù†Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ÙØªØ§Ø­ÙŠØ©: Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» (Ø¬Ù…Ø¹)ØŒ Â«Ø§Ù„Ø¨Ø§Ù‚ÙŠÂ» (Ø·Ø±Ø­)ØŒ Â«Ù…Ø±Ø©Â» (Ø¶Ø±Ø¨)ØŒ Â«Ù†Ù‚Ø³Ù…Â» (Ù‚Ø³Ù…Ø©).

ØªØ°ÙƒØ±: ÙÙŠ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø®ØªÙ„Ø· Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© Ù‚Ø¨Ù„ Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'operations';

update public.chapters c set
  lesson_fr = 'LES AIRES

C''EST QUOI UNE AIRE ?
L''aire, c''est la SURFACE Ã  l''intÃ©rieur d''une figure, la place qu''elle
occupe. On la mesure en cmÂ² (centimÃ¨tres carrÃ©s).

L''AIRE DU CARRÃ‰
On multiplie le cÃ´tÃ© par lui-mÃªme.
CarrÃ© de cÃ´tÃ© 5 cm : A = 5 Ã— 5 = 25 cmÂ².

L''AIRE DU RECTANGLE
On multiplie la Longueur par la largeur.
Rectangle de 6 cm sur 4 cm : A = 6 Ã— 4 = 24 cmÂ².

NE PAS CONFONDRE AVEC LE PÃ‰RIMÃˆTRE
â€¢ Le pÃ©rimÃ¨tre = le tour (en cm).
â€¢ L''aire = l''intÃ©rieur (en cmÂ²).
Deux jardins peuvent avoir le mÃªme tour mais pas la mÃªme surface !

Ã€ RETENIR : aire du rectangle = Longueur Ã— largeur ; elle se mesure en cmÂ²
(unitÃ©s carrÃ©es).',
  lesson_ar = 'Ø§Ù„Ù…Ø³Ø§Ø­Ø§Øª

Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ù…Ø³Ø§Ø­Ø©ØŸ
Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ù‡ÙŠ Ø§Ù„Ø³Ø·Ø­ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø´ÙƒÙ„ØŒ Ø§Ù„Ù…ÙƒØ§Ù† Ø§Ù„Ø°ÙŠ ÙŠØ´ØºÙ„Ù‡. ØªÙÙ‚Ø§Ø³ Ø¨Ø§Ù„Ø³Ù…Â² (Ø³Ù†ØªÙŠÙ…ØªØ± Ù…Ø±Ø¨Ø¹).

Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø±Ø¨Ø¹
Ù†Ø¶Ø±Ø¨ Ø§Ù„Ø¶Ù„Ø¹ ÙÙŠ Ù†ÙØ³Ù‡.
Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 5 Ø³Ù…: Ø§Ù„Ù…Ø³Ø§Ø­Ø© = 5 Ã— 5 = 25 Ø³Ù…Â².

Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„
Ù†Ø¶Ø±Ø¨ Ø§Ù„Ø·ÙˆÙ„ ÙÙŠ Ø§Ù„Ø¹Ø±Ø¶.
Ù…Ø³ØªØ·ÙŠÙ„ 6 Ø³Ù… Ã— 4 Ø³Ù…: Ø§Ù„Ù…Ø³Ø§Ø­Ø© = 6 Ã— 4 = 24 Ø³Ù…Â².

Ù„Ø§ Ù†Ø®Ù„Ø· Ù…Ø¹ Ø§Ù„Ù…Ø­ÙŠØ·
â€¢ Ø§Ù„Ù…Ø­ÙŠØ· = Ø§Ù„Ø¯ÙˆØ±Ø§Ù† (Ø¨Ø§Ù„Ø³Ù…).
â€¢ Ø§Ù„Ù…Ø³Ø§Ø­Ø© = Ø§Ù„Ø¯Ø§Ø®Ù„ (Ø¨Ø§Ù„Ø³Ù…Â²).
Ø­Ø¯ÙŠÙ‚ØªØ§Ù† Ù‚Ø¯ ÙŠÙƒÙˆÙ† Ù„Ù‡Ù…Ø§ Ù†ÙØ³ Ø§Ù„Ù…Ø­ÙŠØ· Ù„ÙƒÙ† Ù„ÙŠØ³ Ù†ÙØ³ Ø§Ù„Ù…Ø³Ø§Ø­Ø©!

ØªØ°ÙƒØ±: Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„ = Ø§Ù„Ø·ÙˆÙ„ Ã— Ø§Ù„Ø¹Ø±Ø¶ØŒ ÙˆØªÙÙ‚Ø§Ø³ Ø¨Ø§Ù„Ø³Ù…Â².'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'aires';

update public.chapters c set
  lesson_fr = 'LES ANGLES

C''EST QUOI UN ANGLE ?
Un angle, c''est l''Ã©cartement entre deux lignes (deux cÃ´tÃ©s) qui se
rencontrent en un point (le sommet). Plus l''Ã©cartement est grand, plus
l''angle est grand.

LES TROIS ANGLES Ã€ CONNAÃŽTRE
â€¢ L''ANGLE DROIT : c''est le coin d''une feuille, d''une fenÃªtre. On le
  reconnaÃ®t avec l''Ã©querre. Il mesure 90Â°.
â€¢ L''ANGLE AIGU : plus fermÃ© que l''angle droit (plus petit que 90Â°).
â€¢ L''ANGLE OBTUS : plus ouvert que l''angle droit (plus grand que 90Â°).

LE PETIT CARRÃ‰
Pour montrer qu''un angle est droit, on dessine un petit carrÃ© dans le coin.

L''Ã‰QUERRE
L''Ã©querre sert Ã  tracer et Ã  vÃ©rifier les angles droits.

Ã€ RETENIR : angle droit = coin parfait (comme la feuille) ; aigu = plus
fermÃ© ; obtus = plus ouvert.',
  lesson_ar = 'Ø§Ù„Ø²ÙˆØ§ÙŠØ§

Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ø²Ø§ÙˆÙŠØ©ØŸ
Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ù‡ÙŠ Ø§Ù„Ø§Ù†ÙØ±Ø§Ø¬ Ø¨ÙŠÙ† Ø®Ø·ÙŠÙ† (Ø¶Ù„Ø¹ÙŠÙ†) ÙŠÙ„ØªÙ‚ÙŠØ§Ù† ÙÙŠ Ù†Ù‚Ø·Ø© (Ø§Ù„Ø±Ø£Ø³). ÙƒÙ„Ù…Ø§ Ø²Ø§Ø¯ Ø§Ù„Ø§Ù†ÙØ±Ø§Ø¬
ÙƒØ¨Ø±Øª Ø§Ù„Ø²Ø§ÙˆÙŠØ©.

Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ø«Ù„Ø§Ø« Ø§Ù„ÙˆØ§Ø¬Ø¨ Ù…Ø¹Ø±ÙØªÙ‡Ø§
â€¢ Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©: Ù‡ÙŠ Ø²Ø§ÙˆÙŠØ© ÙˆØ±Ù‚Ø© Ø£Ùˆ Ù†Ø§ÙØ°Ø©. Ù†ØªØ¹Ø±Ù‘Ù Ø¹Ù„ÙŠÙ‡Ø§ Ø¨Ø§Ù„ÙƒÙˆØ³. ØªÙ‚ÙŠØ³ 90Â°.
â€¢ Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø­Ø§Ø¯Ø©: Ø£ÙƒØ«Ø± Ø§Ù†ØºÙ„Ø§Ù‚Ù‹Ø§ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© (Ø£ØµØºØ± Ù…Ù† 90Â°).
â€¢ Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù…Ù†ÙØ±Ø¬Ø©: Ø£ÙƒØ«Ø± Ø§Ù†ÙØªØ§Ø­Ù‹Ø§ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© (Ø£ÙƒØ¨Ø± Ù…Ù† 90Â°).

Ø§Ù„Ù…Ø±Ø¨Ø¹ Ø§Ù„ØµØºÙŠØ±
Ù„Ø¨ÙŠØ§Ù† Ø£Ù† Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ù‚Ø§Ø¦Ù…Ø© Ù†Ø±Ø³Ù… Ù…Ø±Ø¨Ø¹Ù‹Ø§ ØµØºÙŠØ±Ù‹Ø§ ÙÙŠ Ø§Ù„Ø²Ø§ÙˆÙŠØ©.

Ø§Ù„ÙƒÙˆØ³ (Ø§Ù„Ù…Ø«Ù„Ø« Ø§Ù„Ù‚Ø§Ø¦Ù…)
Ø§Ù„ÙƒÙˆØ³ ÙŠÙØ³ØªØ¹Ù…Ù„ Ù„Ø±Ø³Ù… Ø§Ù„Ø²ÙˆØ§ÙŠØ§ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ÙˆØ§Ù„ØªØ­Ù‚Ù‚ Ù…Ù†Ù‡Ø§.

ØªØ°ÙƒØ±: Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© = Ø²Ø§ÙˆÙŠØ© ØªØ§Ù…Ø© (ÙƒØ§Ù„ÙˆØ±Ù‚Ø©)ØŒ Ø§Ù„Ø­Ø§Ø¯Ø© = Ø£ÙƒØ«Ø± Ø§Ù†ØºÙ„Ø§Ù‚Ù‹Ø§ØŒ Ø§Ù„Ù…Ù†ÙØ±Ø¬Ø© = Ø£ÙƒØ«Ø± Ø§Ù†ÙØªØ§Ø­Ù‹Ø§.'
from public.subjects s
where c.subject_id = s.id and s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'angles';

-- ===== 3. Quiz banks =====

-- 1AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 34, combien y a-t-il de dizaines ?', 'ÙÙŠ Ø§Ù„Ø¹Ø¯Ø¯ 34ØŒ ÙƒÙ… Ø¹Ø´Ø±Ø©ØŸ',
   '["3","4","34","7"]'::jsonb, '["3","4","34","7"]'::jsonb, 0,
   'Le chiffre de gauche = 3 dizaines.', 'Ø±Ù‚Ù… Ø§Ù„ÙŠØ³Ø§Ø± = 3 Ø¹Ø´Ø±Ø§Øª.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'Ø£ÙŠ Ø¹Ø¯Ø¯ Ø£ÙƒØ¨Ø±ØŸ',
   '["52","47","39","50"]'::jsonb, '["52","47","39","50"]'::jsonb, 0,
   '52 a 5 dizaines, c''est le plus grand.', '52 Ù„Ù‡ 5 Ø¹Ø´Ø±Ø§Øª ÙÙ‡Ùˆ Ø§Ù„Ø£ÙƒØ¨Ø±.', 'easy', 2),
  ('Quel nombre vient juste aprÃ¨s 29 ?', 'Ù…Ø§ Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø°ÙŠ ÙŠØ£ØªÙŠ Ø¨Ø¹Ø¯ 29 Ù…Ø¨Ø§Ø´Ø±Ø©ØŸ',
   '["30","28","40","31"]'::jsonb, '["30","28","40","31"]'::jsonb, 0,
   'AprÃ¨s 29 vient 30.', 'Ø¨Ø¹Ø¯ 29 ÙŠØ£ØªÙŠ 30.', 'medium', 3),
  ('ComplÃ¨te : 5 dizaines et 3 unitÃ©s = ?', 'Ø£ÙƒÙ…Ù„: 5 Ø¹Ø´Ø±Ø§Øª Ùˆ3 ÙˆØ­Ø¯Ø§Øª = ØŸ',
   '["53","35","8","503"]'::jsonb, '["53","35","8","503"]'::jsonb, 0,
   '5 dizaines = 50, plus 3 = 53.', '5 Ø¹Ø´Ø±Ø§Øª = 50 Ø²Ø§Ø¦Ø¯ 3 = 53.', 'medium', 4),
  ('Range du plus petit au plus grand : 40, 14, 41', 'Ø±ØªÙ‘Ø¨ Ù…Ù† Ø§Ù„Ø£ØµØºØ± Ø¥Ù„Ù‰ Ø§Ù„Ø£ÙƒØ¨Ø±: 40ØŒ 14ØŒ 41',
   '["14, 40, 41","40, 41, 14","41, 40, 14","14, 41, 40"]'::jsonb, '["14, 40, 41","40, 41, 14","41, 40, 14","14, 41, 40"]'::jsonb, 0,
   '14 < 40 < 41.', '14 < 40 < 41.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-100'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 3 + 2', 'Ø§Ø­Ø³Ø¨: 3 + 2',
   '["5","6","4","1"]'::jsonb, '["5","6","4","1"]'::jsonb, 0, '3 + 2 = 5.', '3 + 2 = 5.', 'easy', 1),
  ('Calcule : 6 + 4', 'Ø§Ø­Ø³Ø¨: 6 + 4',
   '["10","9","11","2"]'::jsonb, '["10","9","11","2"]'::jsonb, 0, '6 + 4 = 10.', '6 + 4 = 10.', 'easy', 2),
  ('Calcule : 7 + 0', 'Ø§Ø­Ø³Ø¨: 7 + 0',
   '["7","0","8","70"]'::jsonb, '["7","0","8","70"]'::jsonb, 0, 'Ajouter 0 ne change rien.', 'Ø¥Ø¶Ø§ÙØ© 0 Ù„Ø§ ØªØºÙŠÙ‘Ø± Ø´ÙŠØ¦Ù‹Ø§.', 'medium', 3),
  ('Calcule : 8 + 5', 'Ø§Ø­Ø³Ø¨: 8 + 5',
   '["13","12","14","3"]'::jsonb, '["13","12","14","3"]'::jsonb, 0, '8 + 5 = 13.', '8 + 5 = 13.', 'medium', 4),
  ('23 + 10 = ?', '23 + 10 = ØŸ',
   '["33","24","32","13"]'::jsonb, '["33","24","32","13"]'::jsonb, 0, 'Ajouter 10 = +1 dizaine.', 'Ø¥Ø¶Ø§ÙØ© 10 = Ø¹Ø´Ø±Ø© ÙˆØ§Ø­Ø¯Ø©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'addition'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 5 âˆ’ 2', 'Ø§Ø­Ø³Ø¨: 5 âˆ’ 2',
   '["3","2","7","4"]'::jsonb, '["3","2","7","4"]'::jsonb, 0, '5 âˆ’ 2 = 3.', '5 âˆ’ 2 = 3.', 'easy', 1),
  ('Calcule : 8 âˆ’ 0', 'Ø§Ø­Ø³Ø¨: 8 âˆ’ 0',
   '["8","0","7","80"]'::jsonb, '["8","0","7","80"]'::jsonb, 0, 'Enlever 0 ne change rien.', 'Ø¥Ø²Ø§Ù„Ø© 0 Ù„Ø§ ØªØºÙŠÙ‘Ø± Ø´ÙŠØ¦Ù‹Ø§.', 'easy', 2),
  ('Calcule : 6 âˆ’ 6', 'Ø§Ø­Ø³Ø¨: 6 âˆ’ 6',
   '["0","6","12","1"]'::jsonb, '["0","6","12","1"]'::jsonb, 0, 'Un nombre moins lui-mÃªme = 0.', 'Ø¹Ø¯Ø¯ Ù†Ø§Ù‚Øµ Ù†ÙØ³Ù‡ = 0.', 'medium', 3),
  ('Calcule : 10 âˆ’ 4', 'Ø§Ø­Ø³Ø¨: 10 âˆ’ 4',
   '["6","7","5","14"]'::jsonb, '["6","7","5","14"]'::jsonb, 0, '10 âˆ’ 4 = 6.', '10 âˆ’ 4 = 6.', 'medium', 4),
  ('J''ai 9 billes, j''en perds 3. Il me resteâ€¦', 'Ù„Ø¯ÙŠÙ‘ 9 ÙƒØ±Ø§Øª ÙÙ‚Ø¯Øª 3. ÙŠØ¨Ù‚Ù‰â€¦',
   '["6","12","3","9"]'::jsonb, '["6","12","3","9"]'::jsonb, 0, '9 âˆ’ 3 = 6.', '9 âˆ’ 3 = 6.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'soustraction'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Combien de cÃ´tÃ©s a un triangle ?', 'ÙƒÙ… Ø¶Ù„Ø¹Ù‹Ø§ Ù„Ù„Ù…Ø«Ù„Ø«ØŸ',
   '["3","4","5","0"]'::jsonb, '["3","4","5","0"]'::jsonb, 0, 'Le triangle a 3 cÃ´tÃ©s.', 'Ù„Ù„Ù…Ø«Ù„Ø« 3 Ø£Ø¶Ù„Ø§Ø¹.', 'easy', 1),
  ('Quelle forme n''a pas de coin ?', 'Ø£ÙŠ Ø´ÙƒÙ„ Ø¨Ù„Ø§ Ø²ÙˆØ§ÙŠØ§ØŸ',
   '["le rond","le carrÃ©","le triangle","le rectangle"]'::jsonb, '["Ø§Ù„Ø¯Ø§Ø¦Ø±Ø©","Ø§Ù„Ù…Ø±Ø¨Ø¹","Ø§Ù„Ù…Ø«Ù„Ø«","Ø§Ù„Ù…Ø³ØªØ·ÙŠÙ„"]'::jsonb, 0,
   'Le rond est tout arrondi, sans coin.', 'Ø§Ù„Ø¯Ø§Ø¦Ø±Ø© Ù…Ø³ØªØ¯ÙŠØ±Ø© Ø¨Ù„Ø§ Ø²ÙˆØ§ÙŠØ§.', 'easy', 2),
  ('Combien de cÃ´tÃ©s a un carrÃ© ?', 'ÙƒÙ… Ø¶Ù„Ø¹Ù‹Ø§ Ù„Ù„Ù…Ø±Ø¨Ø¹ØŸ',
   '["4","3","5","6"]'::jsonb, '["4","3","5","6"]'::jsonb, 0, 'Le carrÃ© a 4 cÃ´tÃ©s.', 'Ù„Ù„Ù…Ø±Ø¨Ø¹ 4 Ø£Ø¶Ù„Ø§Ø¹.', 'medium', 3),
  ('Une porte a la forme d''unâ€¦', 'Ø§Ù„Ø¨Ø§Ø¨ Ù„Ù‡ Ø´ÙƒÙ„â€¦',
   '["rectangle","rond","triangle","carrÃ©"]'::jsonb, '["Ù…Ø³ØªØ·ÙŠÙ„","Ø¯Ø§Ø¦Ø±Ø©","Ù…Ø«Ù„Ø«","Ù…Ø±Ø¨Ø¹"]'::jsonb, 0,
   'La porte est un rectangle (cÃ´tÃ©s longs et courts).', 'Ø§Ù„Ø¨Ø§Ø¨ Ù…Ø³ØªØ·ÙŠÙ„.', 'medium', 4),
  ('Le carrÃ© a tous ses cÃ´tÃ©sâ€¦', 'Ø§Ù„Ù…Ø±Ø¨Ø¹ ÙƒÙ„ Ø£Ø¶Ù„Ø§Ø¹Ù‡â€¦',
   '["Ã©gaux","diffÃ©rents","arrondis","de 3"]'::jsonb, '["Ù…ØªØ³Ø§ÙˆÙŠØ©","Ù…Ø®ØªÙ„ÙØ©","Ù…Ø³ØªØ¯ÙŠØ±Ø©","Ø«Ù„Ø§Ø«Ø©"]'::jsonb, 0,
   'Le carrÃ© a 4 cÃ´tÃ©s Ã©gaux.', 'Ø§Ù„Ù…Ø±Ø¨Ø¹ Ù„Ù‡ 4 Ø£Ø¶Ù„Ø§Ø¹ Ù…ØªØ³Ø§ÙˆÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '1AP' and s.slug = 'mathematiques' and c.slug = 'formes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 2AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 356, combien de centaines ?', 'ÙÙŠ 356ØŒ ÙƒÙ… Ù…Ø¦Ø©ØŸ',
   '["3","5","6","356"]'::jsonb, '["3","5","6","356"]'::jsonb, 0, 'Le chiffre de gauche = 3 centaines.', 'Ø±Ù‚Ù… Ø§Ù„ÙŠØ³Ø§Ø± = 3 Ù…Ø¦Ø§Øª.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'Ø£ÙŠ Ø¹Ø¯Ø¯ Ø£ÙƒØ¨Ø±ØŸ',
   '["420","399","350","401"]'::jsonb, '["420","399","350","401"]'::jsonb, 0, '420 a 4 centaines.', '420 Ù„Ù‡ 4 Ù…Ø¦Ø§Øª.', 'easy', 2),
  ('100 = combien de dizaines ?', '100 = ÙƒÙ… Ø¹Ø´Ø±Ø©ØŸ',
   '["10","100","1","1000"]'::jsonb, '["10","100","1","1000"]'::jsonb, 0, '100 = 10 dizaines.', '100 = 10 Ø¹Ø´Ø±Ø§Øª.', 'medium', 3),
  ('Comment se lit 205 ?', 'ÙƒÙŠÙ ÙŠÙÙ‚Ø±Ø£ 205ØŸ',
   '["deux cent cinq","deux cent cinquante","vingt-cinq","deux mille cinq"]'::jsonb, '["Ù…Ø¦ØªØ§Ù† ÙˆØ®Ù…Ø³Ø©","Ù…Ø¦ØªØ§Ù† ÙˆØ®Ù…Ø³ÙˆÙ†","Ø®Ù…Ø³Ø© ÙˆØ¹Ø´Ø±ÙˆÙ†","Ø£Ù„ÙØ§Ù† ÙˆØ®Ù…Ø³Ø©"]'::jsonb, 0,
   '205 = deux cent cinq.', '205 = Ù…Ø¦ØªØ§Ù† ÙˆØ®Ù…Ø³Ø©.', 'medium', 4),
  ('Range dans l''ordre croissant : 250, 205, 502', 'Ø±ØªÙ‘Ø¨ ØªØµØ§Ø¹Ø¯ÙŠÙ‹Ø§: 250ØŒ 205ØŒ 502',
   '["205, 250, 502","250, 205, 502","502, 250, 205","205, 502, 250"]'::jsonb, '["205, 250, 502","250, 205, 502","502, 250, 205","205, 502, 250"]'::jsonb, 0,
   '205 < 250 < 502.', '205 < 250 < 502.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'nombres-0-1000'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('27 + 15 = ?', '27 + 15 = ØŸ',
   '["42","32","41","52"]'::jsonb, '["42","32","41","52"]'::jsonb, 0, '7+5=12 (retenue), puis 2+1+1=4 â†’ 42.', '7+5=12 Ø«Ù… 4 â†’ 42.', 'medium', 1),
  ('Dans 8 + 5 = 13, la retenue estâ€¦', 'ÙÙŠ 8 + 5 = 13ØŒ Ø§Ù„Ø§Ø­ØªÙØ§Ø¸ Ù‡Ùˆâ€¦',
   '["1","3","8","5"]'::jsonb, '["1","3","8","5"]'::jsonb, 0, 'On Ã©crit 3, on retient 1.', 'Ù†ÙƒØªØ¨ 3 ÙˆÙ†Ø­ØªÙØ¸ Ø¨Ù€ 1.', 'medium', 2),
  ('45 + 5 = ?', '45 + 5 = ØŸ',
   '["50","40","55","4"]'::jsonb, '["50","40","55","4"]'::jsonb, 0, '45 + 5 = 50.', '45 + 5 = 50.', 'easy', 3),
  ('On commence l''addition par la colonne desâ€¦', 'Ù†Ø¨Ø¯Ø£ Ø§Ù„Ø¬Ù…Ø¹ Ù…Ù† Ø¹Ù…ÙˆØ¯â€¦',
   '["unitÃ©s","dizaines","centaines","milliers"]'::jsonb, '["Ø§Ù„ÙˆØ­Ø¯Ø§Øª","Ø§Ù„Ø¹Ø´Ø±Ø§Øª","Ø§Ù„Ù…Ø¦Ø§Øª","Ø§Ù„Ø¢Ù„Ø§Ù"]'::jsonb, 0,
   'On commence par les unitÃ©s (Ã  droite).', 'Ù†Ø¨Ø¯Ø£ Ø¨Ø§Ù„ÙˆØ­Ø¯Ø§Øª (ÙŠÙ…ÙŠÙ†Ù‹Ø§).', 'easy', 4),
  ('38 + 24 = ?', '38 + 24 = ØŸ',
   '["62","52","61","63"]'::jsonb, '["62","52","61","63"]'::jsonb, 0, '8+4=12, retenue; 3+2+1=6 â†’ 62.', '8+4=12 Ø«Ù… 6 â†’ 62.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'addition-retenue'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('42 âˆ’ 15 = ?', '42 âˆ’ 15 = ØŸ',
   '["27","37","33","28"]'::jsonb, '["27","37","33","28"]'::jsonb, 0, 'On emprunte : 12âˆ’5=7, 3âˆ’1=2 â†’ 27.', 'Ù†Ø³ØªÙ„Ù: 27.', 'medium', 1),
  ('Pour vÃ©rifier 42 âˆ’ 15 = 27, on calculeâ€¦', 'Ù„Ù„ØªØ­Ù‚Ù‚ Ù…Ù† 42 âˆ’ 15 = 27 Ù†Ø­Ø³Ø¨â€¦',
   '["27 + 15","27 âˆ’ 15","42 + 15","42 + 27"]'::jsonb, '["27 + 15","27 âˆ’ 15","42 + 15","42 + 27"]'::jsonb, 0,
   '27 + 15 = 42 : c''est juste.', '27 + 15 = 42: ØµØ­ÙŠØ­.', 'medium', 2),
  ('50 âˆ’ 20 = ?', '50 âˆ’ 20 = ØŸ',
   '["30","70","20","40"]'::jsonb, '["30","70","20","40"]'::jsonb, 0, '50 âˆ’ 20 = 30.', '50 âˆ’ 20 = 30.', 'easy', 3),
  ('Le plus grand nombre se metâ€¦', 'Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø± ÙŠÙˆØ¶Ø¹â€¦',
   '["en haut","en bas","Ã  droite","au milieu"]'::jsonb, '["ÙÙŠ Ø§Ù„Ø£Ø¹Ù„Ù‰","ÙÙŠ Ø§Ù„Ø£Ø³ÙÙ„","ÙŠÙ…ÙŠÙ†Ù‹Ø§","ÙÙŠ Ø§Ù„ÙˆØ³Ø·"]'::jsonb, 0,
   'Le plus grand nombre en haut.', 'Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø£ÙƒØ¨Ø± ÙÙŠ Ø§Ù„Ø£Ø¹Ù„Ù‰.', 'easy', 4),
  ('63 âˆ’ 28 = ?', '63 âˆ’ 28 = ØŸ',
   '["35","45","41","31"]'::jsonb, '["35","45","41","31"]'::jsonb, 0, 'On emprunte : 13âˆ’8=5, 5âˆ’2=3 â†’ 35.', 'Ù†Ø³ØªÙ„Ù: 35.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'soustraction-retenue'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('3 Ã— 4 veut direâ€¦', '3 Ã— 4 ØªØ¹Ù†ÙŠâ€¦',
   '["4 + 4 + 4","3 + 4","4 âˆ’ 3","3 + 3"]'::jsonb, '["4 + 4 + 4","3 + 4","4 âˆ’ 3","3 + 3"]'::jsonb, 0,
   '3 fois 4 = 4+4+4 = 12.', '3 Ù…Ø±Ø§Øª 4 = 12.', 'easy', 1),
  ('7 Ã— 1 = ?', '7 Ã— 1 = ØŸ',
   '["7","1","8","70"]'::jsonb, '["7","1","8","70"]'::jsonb, 0, 'Multiplier par 1 ne change rien.', 'Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 1 Ù„Ø§ ÙŠØºÙŠÙ‘Ø±.', 'easy', 2),
  ('8 Ã— 0 = ?', '8 Ã— 0 = ØŸ',
   '["0","8","80","1"]'::jsonb, '["0","8","80","1"]'::jsonb, 0, 'Multiplier par 0 donne 0.', 'Ø§Ù„Ø¶Ø±Ø¨ ÙÙŠ 0 = 0.', 'medium', 3),
  ('5 Ã— 3 = ?', '5 Ã— 3 = ØŸ',
   '["15","8","10","53"]'::jsonb, '["15","8","10","53"]'::jsonb, 0, '5 Ã— 3 = 15.', '5 Ã— 3 = 15.', 'medium', 4),
  ('6 Ã— 2 = ? (doubler 6)', '6 Ã— 2 = ØŸ (Ø¶Ø¹Ù 6)',
   '["12","8","62","16"]'::jsonb, '["12","8","62","16"]'::jsonb, 0, 'Doubler 6 = 12.', 'Ø¶Ø¹Ù 6 = 12.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'multiplication'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('1 heure = combien de minutes ?', '1 Ø³Ø§Ø¹Ø© = ÙƒÙ… Ø¯Ù‚ÙŠÙ‚Ø©ØŸ',
   '["60","100","30","24"]'::jsonb, '["60","100","30","24"]'::jsonb, 0, '1 heure = 60 minutes.', '1 Ø³Ø§Ø¹Ø© = 60 Ø¯Ù‚ÙŠÙ‚Ø©.', 'easy', 1),
  ('1 mÃ¨tre = combien de centimÃ¨tres ?', '1 Ù…ØªØ± = ÙƒÙ… Ø³Ù†ØªÙŠÙ…ØªØ±ØŸ',
   '["100","10","1000","60"]'::jsonb, '["100","10","1000","60"]'::jsonb, 0, '1 m = 100 cm.', '1 Ù… = 100 Ø³Ù….', 'easy', 2),
  ('Combien de jours dans une semaine ?', 'ÙƒÙ… ÙŠÙˆÙ…Ù‹Ø§ ÙÙŠ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ØŸ',
   '["7","12","30","365"]'::jsonb, '["7","12","30","365"]'::jsonb, 0, 'La semaine = 7 jours.', 'Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ = 7 Ø£ÙŠØ§Ù….', 'medium', 3),
  ('Qu''est-ce qui est le plus long ?', 'Ø£ÙŠÙ‡Ù…Ø§ Ø£Ø·ÙˆÙ„ØŸ',
   '["1 m","50 cm","20 cm","99 cm"]'::jsonb, '["1 Ù…","50 Ø³Ù…","20 Ø³Ù…","99 Ø³Ù…"]'::jsonb, 0,
   '1 m = 100 cm > 99 cm.', '1 Ù… = 100 Ø³Ù… > 99 Ø³Ù….', 'medium', 4),
  ('Combien de mois dans une annÃ©e ?', 'ÙƒÙ… Ø´Ù‡Ø±Ù‹Ø§ ÙÙŠ Ø§Ù„Ø³Ù†Ø©ØŸ',
   '["12","7","365","24"]'::jsonb, '["12","7","365","24"]'::jsonb, 0, 'L''annÃ©e = 12 mois.', 'Ø§Ù„Ø³Ù†Ø© = 12 Ø´Ù‡Ø±Ù‹Ø§.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '2AP' and s.slug = 'mathematiques' and c.slug = 'mesures-temps'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 3AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 4 573, combien de milliers ?', 'ÙÙŠ 4573ØŒ ÙƒÙ… Ø£Ù„ÙÙ‹Ø§ØŸ',
   '["4","5","7","3"]'::jsonb, '["4","5","7","3"]'::jsonb, 0, 'Le chiffre de gauche = 4 milliers.', 'Ø±Ù‚Ù… Ø§Ù„ÙŠØ³Ø§Ø± = 4 Ø¢Ù„Ø§Ù.', 'easy', 1),
  ('Quel nombre est le plus grand ?', 'Ø£ÙŠ Ø¹Ø¯Ø¯ Ø£ÙƒØ¨Ø±ØŸ',
   '["3 001","2 999","3 000","2 998"]'::jsonb, '["3 001","2 999","3 000","2 998"]'::jsonb, 0, '3 001 a 3 milliers.', '3001 Ù„Ù‡ 3 Ø¢Ù„Ø§Ù.', 'easy', 2),
  ('1 000 = combien de centaines ?', '1000 = ÙƒÙ… Ù…Ø¦Ø©ØŸ',
   '["10","100","1","1000"]'::jsonb, '["10","100","1","1000"]'::jsonb, 0, '1 000 = 10 centaines.', '1000 = 10 Ù…Ø¦Ø§Øª.', 'medium', 3),
  ('Comment se lit 4 573 ?', 'ÙƒÙŠÙ ÙŠÙÙ‚Ø±Ø£ 4573ØŸ',
   '["quatre mille cinq cent soixante-treize","quatre cent cinquante-sept","quarante-cinq mille","quatre mille sept cent"]'::jsonb,
   '["Ø£Ø±Ø¨Ø¹Ø© Ø¢Ù„Ø§Ù ÙˆØ®Ù…Ø³Ù…Ø¦Ø© ÙˆØ«Ù„Ø§Ø«Ø© ÙˆØ³Ø¨Ø¹ÙˆÙ†","Ø£Ø±Ø¨Ø¹Ù…Ø¦Ø© ÙˆØ³Ø¨Ø¹Ø© ÙˆØ®Ù…Ø³ÙˆÙ†","Ø®Ù…Ø³Ø© ÙˆØ£Ø±Ø¨Ø¹ÙˆÙ† Ø£Ù„ÙÙ‹Ø§","Ø£Ø±Ø¨Ø¹Ø© Ø¢Ù„Ø§Ù ÙˆØ³Ø¨Ø¹Ù…Ø¦Ø©"]'::jsonb, 0,
   '4 573 = quatre mille cinq cent soixante-treize.', 'Ø£Ø±Ø¨Ø¹Ø© Ø¢Ù„Ø§Ù ÙˆØ®Ù…Ø³Ù…Ø¦Ø© ÙˆØ«Ù„Ø§Ø«Ø© ÙˆØ³Ø¨Ø¹ÙˆÙ†.', 'medium', 4),
  ('3 500 se situe entreâ€¦', '3500 ÙŠÙ‚Ø¹ Ø¨ÙŠÙ†â€¦',
   '["3 000 et 4 000","2 000 et 3 000","4 000 et 5 000","3 500 et 3 600"]'::jsonb, '["3000 Ùˆ4000","2000 Ùˆ3000","4000 Ùˆ5000","3500 Ùˆ3600"]'::jsonb, 0,
   '3 500 est entre 3 000 et 4 000.', '3500 Ø¨ÙŠÙ† 3000 Ùˆ4000.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'nombres-10000'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('7 Ã— 8 = ?', '7 Ã— 8 = ØŸ',
   '["56","54","63","49"]'::jsonb, '["56","54","63","49"]'::jsonb, 0, '7 Ã— 8 = 56.', '7 Ã— 8 = 56.', 'medium', 1),
  ('6 Ã— 9 = ?', '6 Ã— 9 = ØŸ',
   '["54","56","45","63"]'::jsonb, '["54","56","45","63"]'::jsonb, 0, '6 Ã— 9 = 54.', '6 Ã— 9 = 54.', 'medium', 2),
  ('Dans la table de 5, les rÃ©sultats finissent parâ€¦', 'ÙÙŠ Ø¬Ø¯ÙˆÙ„ 5ØŒ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ ØªÙ†ØªÙ‡ÙŠ Ø¨Ù€â€¦',
   '["0 ou 5","1 ou 2","toujours 5","toujours 0"]'::jsonb, '["0 Ø£Ùˆ 5","1 Ø£Ùˆ 2","Ø¯Ø§Ø¦Ù…Ù‹Ø§ 5","Ø¯Ø§Ø¦Ù…Ù‹Ø§ 0"]'::jsonb, 0,
   'Table de 5 : 5, 10, 15, 20â€¦', 'Ø¬Ø¯ÙˆÙ„ 5: 5ØŒ 10ØŒ 15ØŒ 20â€¦', 'easy', 3),
  ('8 Ã— 10 = ?', '8 Ã— 10 = ØŸ',
   '["80","18","800","88"]'::jsonb, '["80","18","800","88"]'::jsonb, 0, 'Table de 10 : on ajoute un 0.', 'Ø¬Ø¯ÙˆÙ„ 10: Ù†Ø¶ÙŠÙ ØµÙØ±Ù‹Ø§.', 'easy', 4),
  ('Combien font 9 Ã— 9 ?', 'ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ 9 Ã— 9ØŸ',
   '["81","72","90","99"]'::jsonb, '["81","72","90","99"]'::jsonb, 0, '9 Ã— 9 = 81.', '9 Ã— 9 = 81.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'tables'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('12 Ã· 3 = ?', '12 Ã· 3 = ØŸ',
   '["4","3","6","9"]'::jsonb, '["4","3","6","9"]'::jsonb, 0, '12 partagÃ© en 3 = 4.', '12 Ø¹Ù„Ù‰ 3 = 4.', 'easy', 1),
  ('20 Ã· 5 = ?', '20 Ã· 5 = ØŸ',
   '["4","5","15","10"]'::jsonb, '["4","5","15","10"]'::jsonb, 0, '20 Ã· 5 = 4.', '20 Ã· 5 = 4.', 'easy', 2),
  ('Si 3 Ã— 4 = 12, alors 12 Ã· 4 = ?', 'Ø¥Ø°Ø§ ÙƒØ§Ù† 3 Ã— 4 = 12 ÙØ¥Ù† 12 Ã· 4 = ØŸ',
   '["3","4","12","8"]'::jsonb, '["3","4","12","8"]'::jsonb, 0, 'Division = contraire de multiplication.', 'Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹ÙƒØ³ Ø§Ù„Ø¶Ø±Ø¨.', 'medium', 3),
  ('On partage 15 bonbons entre 3 enfants. Chacun aâ€¦', 'Ù†Ù‚Ø³Ù… 15 Ø­Ù„ÙˆÙ‰ Ø¹Ù„Ù‰ 3 Ø£Ø·ÙØ§Ù„. Ù„ÙƒÙ„ ÙˆØ§Ø­Ø¯â€¦',
   '["5","3","12","6"]'::jsonb, '["5","3","12","6"]'::jsonb, 0, '15 Ã· 3 = 5.', '15 Ã· 3 = 5.', 'medium', 4),
  ('13 Ã· 4 : combien reste-t-il ?', '13 Ã· 4: ÙƒÙ… Ø§Ù„Ø¨Ø§Ù‚ÙŠØŸ',
   '["1","3","0","2"]'::jsonb, '["1","3","0","2"]'::jsonb, 0, '4Ã—3=12, reste 1.', '4Ã—3=12ØŒ Ø§Ù„Ø¨Ø§Ù‚ÙŠ 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'division'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('PÃ©rimÃ¨tre d''un triangle de cÃ´tÃ©s 3, 4, 5 cm ?', 'Ù…Ø­ÙŠØ· Ù…Ø«Ù„Ø« Ø£Ø¶Ù„Ø§Ø¹Ù‡ 3 Ùˆ4 Ùˆ5 Ø³Ù…ØŸ',
   '["12 cm","9 cm","15 cm","60 cm"]'::jsonb, '["12 Ø³Ù…","9 Ø³Ù…","15 Ø³Ù…","60 Ø³Ù…"]'::jsonb, 0, '3+4+5 = 12 cm.', '3+4+5 = 12 Ø³Ù….', 'easy', 1),
  ('PÃ©rimÃ¨tre d''un carrÃ© de cÃ´tÃ© 5 cm ?', 'Ù…Ø­ÙŠØ· Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 5 Ø³Ù…ØŸ',
   '["20 cm","25 cm","10 cm","5 cm"]'::jsonb, '["20 Ø³Ù…","25 Ø³Ù…","10 Ø³Ù…","5 Ø³Ù…"]'::jsonb, 0, '4 Ã— 5 = 20 cm.', '4 Ã— 5 = 20 Ø³Ù….', 'easy', 2),
  ('Le pÃ©rimÃ¨tre, c''estâ€¦', 'Ø§Ù„Ù…Ø­ÙŠØ· Ù‡Ùˆâ€¦',
   '["le tour de la figure","l''intÃ©rieur","la hauteur","le nombre de cÃ´tÃ©s"]'::jsonb, '["Ø¯ÙˆØ±Ø§Ù† Ø§Ù„Ø´ÙƒÙ„","Ø§Ù„Ø¯Ø§Ø®Ù„","Ø§Ù„Ø§Ø±ØªÙØ§Ø¹","Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹"]'::jsonb, 0,
   'Le pÃ©rimÃ¨tre = le tour.', 'Ø§Ù„Ù…Ø­ÙŠØ· = Ø§Ù„Ø¯ÙˆØ±Ø§Ù†.', 'medium', 3),
  ('Rectangle 6 cm et 4 cm : pÃ©rimÃ¨tre ?', 'Ù…Ø³ØªØ·ÙŠÙ„ 6 Ø³Ù… Ùˆ4 Ø³Ù…: Ø§Ù„Ù…Ø­ÙŠØ·ØŸ',
   '["20 cm","24 cm","10 cm","48 cm"]'::jsonb, '["20 Ø³Ù…","24 Ø³Ù…","10 Ø³Ù…","48 Ø³Ù…"]'::jsonb, 0, '2Ã—(6+4)=20 cm.', '2Ã—(6+4)=20 Ø³Ù….', 'medium', 4),
  ('Le pÃ©rimÃ¨tre se mesure enâ€¦', 'Ø§Ù„Ù…Ø­ÙŠØ· ÙŠÙÙ‚Ø§Ø³ Ø¨Ù€â€¦',
   '["cm","cmÂ²","kg","litres"]'::jsonb, '["Ø³Ù…","Ø³Ù…Â²","ÙƒØº","Ù„ØªØ±Ø§Øª"]'::jsonb, 0, 'Le pÃ©rimÃ¨tre est une longueur (cm).', 'Ø§Ù„Ù…Ø­ÙŠØ· Ø·ÙˆÙ„ (Ø³Ù…).', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'perimetre'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Â« en tout Â» indique souventâ€¦', 'Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» ØªØ¯Ù„ ØºØ§Ù„Ø¨Ù‹Ø§ Ø¹Ù„Ù‰â€¦',
   '["une addition","une soustraction","une division","rien"]'::jsonb, '["Ø§Ù„Ø¬Ù…Ø¹","Ø§Ù„Ø·Ø±Ø­","Ø§Ù„Ù‚Ø³Ù…Ø©","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb, 0,
   'Â« en tout Â» â†’ addition.', 'Â«ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Â» â† Ø§Ù„Ø¬Ù…Ø¹.', 'easy', 1),
  ('Â« partager Ã©galement Â» indiqueâ€¦', 'Â«Ù†ÙˆØ²Ù‘Ø¹ Ø¨Ø§Ù„ØªØ³Ø§ÙˆÙŠÂ» ØªØ¯Ù„ Ø¹Ù„Ù‰â€¦',
   '["une division","une addition","une multiplication","une soustraction"]'::jsonb, '["Ø§Ù„Ù‚Ø³Ù…Ø©","Ø§Ù„Ø¬Ù…Ø¹","Ø§Ù„Ø¶Ø±Ø¨","Ø§Ù„Ø·Ø±Ø­"]'::jsonb, 0,
   'Â« partager Â» â†’ division.', 'Â«Ù†Ù‚Ø³Ù…Â» â† Ø§Ù„Ù‚Ø³Ù…Ø©.', 'easy', 2),
  ('4 caisses de 8 oranges : combien en tout ?', '4 ØµÙ†Ø§Ø¯ÙŠÙ‚ Ù…Ù† 8 Ø¨Ø±ØªÙ‚Ø§Ù„Ø§Øª: ÙƒÙ… ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ØŸ',
   '["32","12","4","24"]'::jsonb, '["32","12","4","24"]'::jsonb, 0, '4 Ã— 8 = 32.', '4 Ã— 8 = 32.', 'medium', 3),
  ('Yacine a 50 DA, il dÃ©pense 30 DA. Il resteâ€¦', 'ÙŠØ§Ø³ÙŠÙ† Ù„Ø¯ÙŠÙ‡ 50 Ø¯Ø¬ Ø£Ù†ÙÙ‚ 30 Ø¯Ø¬. ÙŠØ¨Ù‚Ù‰â€¦',
   '["20 DA","80 DA","30 DA","10 DA"]'::jsonb, '["20 Ø¯Ø¬","80 Ø¯Ø¬","30 Ø¯Ø¬","10 Ø¯Ø¬"]'::jsonb, 0, '50 âˆ’ 30 = 20 DA.', '50 âˆ’ 30 = 20 Ø¯Ø¬.', 'medium', 4),
  ('Â« de moins que Â» indiqueâ€¦', 'Â«Ø£Ù‚Ù„ Ø¨Ù€Â» ØªØ¯Ù„ Ø¹Ù„Ù‰â€¦',
   '["une soustraction","une addition","une multiplication","une division"]'::jsonb, '["Ø§Ù„Ø·Ø±Ø­","Ø§Ù„Ø¬Ù…Ø¹","Ø§Ù„Ø¶Ø±Ø¨","Ø§Ù„Ù‚Ø³Ù…Ø©"]'::jsonb, 0,
   'Â« de moins Â» â†’ soustraction.', 'Â«Ø£Ù‚Ù„ Ø¨Ù€Â» â† Ø§Ù„Ø·Ø±Ø­.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '3AP' and s.slug = 'mathematiques' and c.slug = 'problemes'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

-- 4AP
insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 1 254 630, que vaut le chiffre 2 ?', 'ÙÙŠ 1254630ØŒ ÙƒÙ… ÙŠØ³Ø§ÙˆÙŠ Ø§Ù„Ø±Ù‚Ù… 2ØŸ',
   '["200 000","2 000","20 000","2 000 000"]'::jsonb, '["200 000","2 000","20 000","2 000 000"]'::jsonb, 0,
   'Le 2 est au rang des centaines de mille.', 'Ø§Ù„Ø±Ù‚Ù… 2 ÙÙŠ Ù…Ø±ØªØ¨Ø© Ù…Ø¦Ø§Øª Ø§Ù„Ø¢Ù„Ø§Ù.', 'medium', 1),
  ('Quel est le plus grand ?', 'Ø£ÙŠ Ø¹Ø¯Ø¯ Ø£ÙƒØ¨Ø±ØŸ',
   '["1 254 630","998 000","875 999","1 000 000"]'::jsonb, '["1 254 630","998 000","875 999","1 000 000"]'::jsonb, 0,
   '1 254 630 a 7 chiffres.', '1254630 Ù„Ù‡ 7 Ø£Ø±Ù‚Ø§Ù….', 'easy', 2),
  ('Un million s''Ã©critâ€¦', 'Ø§Ù„Ù…Ù„ÙŠÙˆÙ† ÙŠÙÙƒØªØ¨â€¦',
   '["1 000 000","100 000","10 000","1 000"]'::jsonb, '["1 000 000","100 000","10 000","1 000"]'::jsonb, 0,
   'Un million = 6 zÃ©ros.', 'Ø§Ù„Ù…Ù„ÙŠÙˆÙ† = 6 Ø£ØµÙØ§Ø±.', 'easy', 3),
  ('On regroupe les chiffres parâ€¦ pour lire', 'Ù†Ø¬Ù…Ø¹ Ø§Ù„Ø£Ø±Ù‚Ø§Ù…â€¦ Ù„ØªØ³Ù‡ÙŠÙ„ Ø§Ù„Ù‚Ø±Ø§Ø¡Ø©',
   '["3","2","4","5"]'::jsonb, '["3","2","4","5"]'::jsonb, 0,
   'Par classes de 3 chiffres.', 'Ø¨Ø£Ù‚Ø³Ø§Ù… Ù…Ù† 3 Ø£Ø±Ù‚Ø§Ù….', 'medium', 4),
  ('Combien de chiffres a le nombre "deux cent mille" ?', 'ÙƒÙ… Ø±Ù‚Ù…Ù‹Ø§ Ù„Ù„Ø¹Ø¯Ø¯ Â«Ù…Ø¦ØªØ§ Ø£Ù„ÙÂ»ØŸ',
   '["6","5","4","7"]'::jsonb, '["6","5","4","7"]'::jsonb, 0,
   '200 000 a 6 chiffres.', '200000 Ù„Ù‡ 6 Ø£Ø±Ù‚Ø§Ù….', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'grands-nombres'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 3/4, quel est le dÃ©nominateur ?', 'ÙÙŠ 3/4ØŒ Ù…Ø§ Ø§Ù„Ù…Ù‚Ø§Ù…ØŸ',
   '["4","3","7","1"]'::jsonb, '["4","3","7","1"]'::jsonb, 0, 'Le nombre du bas = dÃ©nominateur.', 'Ø§Ù„Ø¹Ø¯Ø¯ Ø§Ù„Ø³ÙÙ„ÙŠ = Ø§Ù„Ù…Ù‚Ø§Ù….', 'easy', 1),
  ('Quelle fraction est la moitiÃ© ?', 'Ø£ÙŠ ÙƒØ³Ø± ÙŠÙ…Ø«Ù„ Ø§Ù„Ù†ØµÙØŸ',
   '["1/2","1/4","3/4","2/3"]'::jsonb, '["1/2","1/4","3/4","2/3"]'::jsonb, 0, '1/2 = la moitiÃ©.', '1/2 = Ø§Ù„Ù†ØµÙ.', 'easy', 2),
  ('4/4 vautâ€¦', '4/4 ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["1","4","0","1/2"]'::jsonb, '["1","4","0","1/2"]'::jsonb, 0, 'Haut = bas â†’ la fraction vaut 1.', 'Ø§Ù„Ø¨Ø³Ø· = Ø§Ù„Ù…Ù‚Ø§Ù… â† ÙŠØ³Ø§ÙˆÙŠ 1.', 'medium', 3),
  ('Une pizza en 4 parts, j''en prends 3 :', 'Ø¨ÙŠØªØ²Ø§ ÙÙŠ 4 Ø£Ø¬Ø²Ø§Ø¡ Ø¢Ø®Ø° 3:',
   '["3/4","4/3","3/1","1/4"]'::jsonb, '["3/4","4/3","3/1","1/4"]'::jsonb, 0, '3 parts sur 4 = 3/4.', '3 Ù…Ù† 4 = 3/4.', 'medium', 4),
  ('2/3 comparÃ© Ã  1 :', '2/3 Ù…Ù‚Ø§Ø±Ù†Ø© Ø¨Ù€ 1:',
   '["plus petit que 1","plus grand que 1","Ã©gal Ã  1","Ã©gal Ã  2"]'::jsonb, '["Ø£ØµØºØ± Ù…Ù† 1","Ø£ÙƒØ¨Ø± Ù…Ù† 1","ÙŠØ³Ø§ÙˆÙŠ 1","ÙŠØ³Ø§ÙˆÙŠ 2"]'::jsonb, 0,
   'Haut < bas â†’ plus petit que 1.', 'Ø§Ù„Ø¨Ø³Ø· < Ø§Ù„Ù…Ù‚Ø§Ù… â† Ø£ØµØºØ± Ù…Ù† 1.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'fractions'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Dans 3,5, quelle est la partie dÃ©cimale ?', 'ÙÙŠ 3.5ØŒ Ù…Ø§ Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø¹Ø´Ø±ÙŠØŸ',
   '["5","3","35","0"]'::jsonb, '["5","3","35","0"]'::jsonb, 0, 'AprÃ¨s la virgule = 5.', 'Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© = 5.', 'easy', 1),
  ('Le premier chiffre aprÃ¨s la virgule, ce sont lesâ€¦', 'Ø£ÙˆÙ„ Ø±Ù‚Ù… Ø¨Ø¹Ø¯ Ø§Ù„ÙØ§ØµÙ„Ø© Ù‡Ùˆâ€¦',
   '["dixiÃ¨mes","unitÃ©s","dizaines","centiÃ¨mes"]'::jsonb, '["Ø§Ù„Ø£Ø¹Ø´Ø§Ø±","Ø§Ù„ÙˆØ­Ø¯Ø§Øª","Ø§Ù„Ø¹Ø´Ø±Ø§Øª","Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„Ù…Ø¦Ø©"]'::jsonb, 0,
   '1er aprÃ¨s la virgule = dixiÃ¨mes.', 'Ø£ÙˆÙ„ Ø±Ù‚Ù… = Ø§Ù„Ø£Ø¹Ø´Ø§Ø±.', 'medium', 2),
  ('2,50 DA = ?', '2.50 Ø¯Ø¬ = ØŸ',
   '["2 dinars et 50 centimes","250 dinars","2 dinars et 5 centimes","25 dinars"]'::jsonb, '["2 Ø¯ÙŠÙ†Ø§Ø± Ùˆ50 Ø³Ù†ØªÙŠÙ…Ù‹Ø§","250 Ø¯ÙŠÙ†Ø§Ø±Ù‹Ø§","2 Ø¯ÙŠÙ†Ø§Ø± Ùˆ5 Ø³Ù†ØªÙŠÙ…Ø§Øª","25 Ø¯ÙŠÙ†Ø§Ø±Ù‹Ø§"]'::jsonb, 0,
   '2,50 = 2 dinars et 50 centimes.', '2.50 = 2 Ø¯ÙŠÙ†Ø§Ø± Ùˆ50 Ø³Ù†ØªÙŠÙ…Ù‹Ø§.', 'medium', 3),
  ('Compare : 4,2 â€¦ 3,9', 'Ù‚Ø§Ø±Ù†: 4.2 â€¦ 3.9',
   '["4,2 > 3,9","4,2 < 3,9","4,2 = 3,9","impossible"]'::jsonb, '["4.2 > 3.9","4.2 < 3.9","4.2 = 3.9","Ù…Ø³ØªØ­ÙŠÙ„"]'::jsonb, 0,
   'Partie entiÃ¨re 4 > 3.', 'Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„ØµØ­ÙŠØ­ 4 > 3.', 'easy', 4),
  ('3,5 est Ã©gal Ã â€¦', '3.5 ÙŠØ³Ø§ÙˆÙŠâ€¦',
   '["3,50","3,05","35","0,35"]'::jsonb, '["3.50","3.05","35","0.35"]'::jsonb, 0,
   'On peut ajouter un zÃ©ro Ã  droite.', 'ÙŠÙ…ÙƒÙ† Ø¥Ø¶Ø§ÙØ© ØµÙØ± Ø¹Ù„Ù‰ Ø§Ù„ÙŠÙ…ÙŠÙ†.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'decimaux'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Calcule : 5 + 3 Ã— 2', 'Ø§Ø­Ø³Ø¨: 5 + 3 Ã— 2',
   '["11","16","13","10"]'::jsonb, '["11","16","13","10"]'::jsonb, 0, 'Multiplication d''abord.', 'Ø§Ù„Ø¶Ø±Ø¨ Ø£ÙˆÙ„Ø§Ù‹.', 'medium', 1),
  ('Le contraire de la multiplication estâ€¦', 'Ø¹ÙƒØ³ Ø§Ù„Ø¶Ø±Ø¨ Ù‡Ùˆâ€¦',
   '["la division","l''addition","la soustraction","rien"]'::jsonb, '["Ø§Ù„Ù‚Ø³Ù…Ø©","Ø§Ù„Ø¬Ù…Ø¹","Ø§Ù„Ø·Ø±Ø­","Ù„Ø§ Ø´ÙŠØ¡"]'::jsonb, 0,
   'Division = contraire de Ã—.', 'Ø§Ù„Ù‚Ø³Ù…Ø© Ø¹ÙƒØ³ Ø§Ù„Ø¶Ø±Ø¨.', 'easy', 2),
  ('45 + 27 = ?', '45 + 27 = ØŸ',
   '["72","62","71","73"]'::jsonb, '["72","62","71","73"]'::jsonb, 0, '45 + 27 = 72.', '45 + 27 = 72.', 'easy', 3),
  ('Dans un calcul mÃ©langÃ©, on fait d''abordâ€¦', 'ÙÙŠ Ø­Ø³Ø§Ø¨ Ù…Ø®ØªÙ„Ø· Ù†Ø¨Ø¯Ø£ Ø¨Ù€â€¦',
   '["Ã— et Ã·","+ et âˆ’","de gauche Ã  droite","au hasard"]'::jsonb, '["Ã— ÙˆÃ·","+ Ùˆâˆ’","Ù…Ù† Ø§Ù„ÙŠØ³Ø§Ø±","Ø¹Ø´ÙˆØ§Ø¦ÙŠÙ‹Ø§"]'::jsonb, 0,
   'Multiplication/division avant addition/soustraction.', 'Ø§Ù„Ø¶Ø±Ø¨ ÙˆØ§Ù„Ù‚Ø³Ù…Ø© Ù‚Ø¨Ù„ Ø§Ù„Ø¬Ù…Ø¹ ÙˆØ§Ù„Ø·Ø±Ø­.', 'medium', 4),
  ('6 Ã— 7 = ?', '6 Ã— 7 = ØŸ',
   '["42","36","48","13"]'::jsonb, '["42","36","48","13"]'::jsonb, 0, '6 Ã— 7 = 42.', '6 Ã— 7 = 42.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'operations'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Aire d''un carrÃ© de cÃ´tÃ© 5 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 5 Ø³Ù…ØŸ',
   '["25 cmÂ²","20 cmÂ²","10 cmÂ²","25 cm"]'::jsonb, '["25 Ø³Ù…Â²","20 Ø³Ù…Â²","10 Ø³Ù…Â²","25 Ø³Ù…"]'::jsonb, 0, '5 Ã— 5 = 25 cmÂ².', '5 Ã— 5 = 25 Ø³Ù…Â².', 'easy', 1),
  ('Aire d''un rectangle 6 cm Ã— 4 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø³ØªØ·ÙŠÙ„ 6 Ø³Ù… Ã— 4 Ø³Ù…ØŸ',
   '["24 cmÂ²","20 cmÂ²","10 cmÂ²","24 cm"]'::jsonb, '["24 Ø³Ù…Â²","20 Ø³Ù…Â²","10 Ø³Ù…Â²","24 Ø³Ù…"]'::jsonb, 0, '6 Ã— 4 = 24 cmÂ².', '6 Ã— 4 = 24 Ø³Ù…Â².', 'easy', 2),
  ('L''aire se mesure enâ€¦', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© ØªÙÙ‚Ø§Ø³ Ø¨Ù€â€¦',
   '["cmÂ²","cm","kg","min"]'::jsonb, '["Ø³Ù…Â²","Ø³Ù…","ÙƒØº","Ø¯Ù‚ÙŠÙ‚Ø©"]'::jsonb, 0, 'L''aire est une surface : cmÂ².', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ø³Ø·Ø­: Ø³Ù…Â².', 'medium', 3),
  ('L''aire, c''estâ€¦', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ù‡ÙŠâ€¦',
   '["l''intÃ©rieur de la figure","le tour","le nombre de cÃ´tÃ©s","la hauteur"]'::jsonb, '["Ø¯Ø§Ø®Ù„ Ø§Ù„Ø´ÙƒÙ„","Ø§Ù„Ø¯ÙˆØ±Ø§Ù†","Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø¶Ù„Ø§Ø¹","Ø§Ù„Ø§Ø±ØªÙØ§Ø¹"]'::jsonb, 0,
   'L''aire = la surface intÃ©rieure.', 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© = Ø§Ù„Ø³Ø·Ø­ Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ.', 'medium', 4),
  ('Aire d''un carrÃ© de cÃ´tÃ© 10 cm ?', 'Ù…Ø³Ø§Ø­Ø© Ù…Ø±Ø¨Ø¹ Ø¶Ù„Ø¹Ù‡ 10 Ø³Ù…ØŸ',
   '["100 cmÂ²","40 cmÂ²","20 cmÂ²","1000 cmÂ²"]'::jsonb, '["100 Ø³Ù…Â²","40 Ø³Ù…Â²","20 Ø³Ù…Â²","1000 Ø³Ù…Â²"]'::jsonb, 0, '10 Ã— 10 = 100 cmÂ².', '10 Ã— 10 = 100 Ø³Ù…Â².', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'aires'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);

insert into public.quiz_questions (chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty, sort_order)
select c.id, v.* from public.chapters c join public.subjects s on s.id = c.subject_id
cross join (values
  ('Un angle droit ressemble au coin d''uneâ€¦', 'Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ØªØ´Ø¨Ù‡ Ø²Ø§ÙˆÙŠØ©â€¦',
   '["feuille","balle","assiette","roue"]'::jsonb, '["ÙˆØ±Ù‚Ø©","ÙƒØ±Ø©","ØµØ­Ù†","Ø¹Ø¬Ù„Ø©"]'::jsonb, 0,
   'L''angle droit = coin d''une feuille.', 'Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© = Ø²Ø§ÙˆÙŠØ© ÙˆØ±Ù‚Ø©.', 'easy', 1),
  ('Un angle plus fermÃ© que l''angle droit estâ€¦', 'Ø²Ø§ÙˆÙŠØ© Ø£ÙƒØ«Ø± Ø§Ù†ØºÙ„Ø§Ù‚Ù‹Ø§ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù‡ÙŠâ€¦',
   '["aigu","obtus","plat","rond"]'::jsonb, '["Ø­Ø§Ø¯Ø©","Ù…Ù†ÙØ±Ø¬Ø©","Ù…Ø³ØªÙ‚ÙŠÙ…Ø©","Ø¯Ø§Ø¦Ø±ÙŠØ©"]'::jsonb, 0,
   'Plus fermÃ© = aigu.', 'Ø£ÙƒØ«Ø± Ø§Ù†ØºÙ„Ø§Ù‚Ù‹Ø§ = Ø­Ø§Ø¯Ø©.', 'easy', 2),
  ('Un angle plus ouvert que l''angle droit estâ€¦', 'Ø²Ø§ÙˆÙŠØ© Ø£ÙƒØ«Ø± Ø§Ù†ÙØªØ§Ø­Ù‹Ø§ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù‡ÙŠâ€¦',
   '["obtus","aigu","droit","nul"]'::jsonb, '["Ù…Ù†ÙØ±Ø¬Ø©","Ø­Ø§Ø¯Ø©","Ù‚Ø§Ø¦Ù…Ø©","Ù…Ø¹Ø¯ÙˆÙ…Ø©"]'::jsonb, 0,
   'Plus ouvert = obtus.', 'Ø£ÙƒØ«Ø± Ø§Ù†ÙØªØ§Ø­Ù‹Ø§ = Ù…Ù†ÙØ±Ø¬Ø©.', 'medium', 3),
  ('Quel outil sert Ã  tracer un angle droit ?', 'Ø£ÙŠ Ø£Ø¯Ø§Ø© ØªØ±Ø³Ù… Ø²Ø§ÙˆÙŠØ© Ù‚Ø§Ø¦Ù…Ø©ØŸ',
   '["l''Ã©querre","la rÃ¨gle seule","le compas","la gomme"]'::jsonb, '["Ø§Ù„ÙƒÙˆØ³","Ø§Ù„Ù…Ø³Ø·Ø±Ø© ÙˆØ­Ø¯Ù‡Ø§","Ø§Ù„Ø¨Ø±ÙƒØ§Ø±","Ø§Ù„Ù…Ù…Ø­Ø§Ø©"]'::jsonb, 0,
   'L''Ã©querre trace/vÃ©rifie l''angle droit.', 'Ø§Ù„ÙƒÙˆØ³ ÙŠØ±Ø³Ù… Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.', 'medium', 4),
  ('Pour montrer un angle droit, on dessineâ€¦', 'Ù„Ø¨ÙŠØ§Ù† Ø§Ù„Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù†Ø±Ø³Ù…â€¦',
   '["un petit carrÃ©","un rond","une flÃ¨che","une croix"]'::jsonb, '["Ù…Ø±Ø¨Ø¹Ù‹Ø§ ØµØºÙŠØ±Ù‹Ø§","Ø¯Ø§Ø¦Ø±Ø©","Ø³Ù‡Ù…Ù‹Ø§","ØµÙ„ÙŠØ¨Ù‹Ø§"]'::jsonb, 0,
   'Un petit carrÃ© dans le coin.', 'Ù…Ø±Ø¨Ø¹Ù‹Ø§ ØµØºÙŠØ±Ù‹Ø§ ÙÙŠ Ø§Ù„Ø²Ø§ÙˆÙŠØ©.', 'hard', 5)
) as v(p_fr, p_ar, o_fr, o_ar, ci, e_fr, e_ar, diff, ord)
where s.grade_code = '4AP' and s.slug = 'mathematiques' and c.slug = 'angles'
  and not exists (select 1 from public.quiz_questions q where q.chapter_id = c.id);
