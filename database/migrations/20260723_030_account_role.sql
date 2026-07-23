-- ===============================================================
-- Migration: 20260723_030_account_role
--
-- Role chosen at sign-up drives the whole experience:
--   parent  → simple parent space (manage children)
--   student → lands straight in the student space (is their own learner)
--   teacher → "PRO" teacher space, teacher-only sections
-- Idempotent.
-- ===============================================================

alter table public.parent_profiles
  add column if not exists role text not null default 'parent'
  check (role in ('parent', 'student', 'teacher'));

comment on column public.parent_profiles.role is
  'Account role picked at sign-up: parent | student | teacher.';

notify pgrst, 'reload schema';
