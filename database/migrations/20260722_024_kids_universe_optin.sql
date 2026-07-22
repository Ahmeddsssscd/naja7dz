-- ===============================================================
-- Migration: 20260722_024_kids_universe_optin
--
-- Kids Universe becomes opt-in. By default every child — including
-- primary-school pupils — lands on the age-appropriate academic space
-- (/eleve: lessons, quizzes, their year's program). A parent can turn the
-- playful "Kids Universe" (/petits games) ON per child when they want it.
--
-- Idempotent.
-- ===============================================================

alter table public.children
  add column if not exists kids_universe_enabled boolean not null default false;

comment on column public.children.kids_universe_enabled is
  'When true, this child may access /petits (Kids Universe games). Off by '
  'default so primary pupils see age-appropriate academic content first.';
