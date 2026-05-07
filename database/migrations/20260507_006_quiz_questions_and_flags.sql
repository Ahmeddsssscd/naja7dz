-- ===============================================================
-- Migration: 20260507_006_quiz_questions_and_flags
-- Adds:
--   1. quiz_questions  — bank of questions per chapter (admin-managed)
--   2. feature_flags   — admin-toggleable global feature switches
-- ===============================================================

-- ===== 1. Quiz question bank =====
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  prompt_fr text not null,
  prompt_ar text,
  -- options is an array of strings. correct_index is 0-based.
  options_fr jsonb not null,
  options_ar jsonb,
  correct_index integer not null,
  explanation_fr text,
  explanation_ar text,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quiz_questions_chapter
  on public.quiz_questions (chapter_id, active, sort_order);

alter table public.quiz_questions enable row level security;

-- Authenticated users can read active questions (so the student player can
-- fetch them via the user session).
drop policy if exists "auth read active questions" on public.quiz_questions;
create policy "auth read active questions"
  on public.quiz_questions for select to authenticated
  using (active = true);

-- service_role does everything (admin CRUD goes through service role).
drop policy if exists "service role full access on quiz_questions" on public.quiz_questions;
create policy "service role full access on quiz_questions"
  on public.quiz_questions for all to service_role
  using (true) with check (true);

-- updated_at trigger
drop trigger if exists trg_quiz_questions_updated on public.quiz_questions;
create trigger trg_quiz_questions_updated
  before update on public.quiz_questions
  for each row execute function public.set_updated_at();

comment on table public.quiz_questions is
  'Question bank — student quiz player picks N random questions per chapter from this pool.';

-- ===== 2. Feature flags =====
-- A simple key/value table the admin can toggle. The app reads these once
-- per request and gates UI features (kid-universe tiles, social, etc).
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default true,
  label_fr text not null,
  description_fr text,
  group_name text,
  sort_order integer default 0,
  updated_at timestamptz not null default now()
);

alter table public.feature_flags enable row level security;

-- Anyone can read flags — they affect what UI to show.
drop policy if exists "anon read feature flags" on public.feature_flags;
create policy "anon read feature flags"
  on public.feature_flags for select to anon, authenticated
  using (true);

drop policy if exists "service role full access on feature_flags" on public.feature_flags;
create policy "service role full access on feature_flags"
  on public.feature_flags for all to service_role
  using (true) with check (true);

drop trigger if exists trg_feature_flags_updated on public.feature_flags;
create trigger trg_feature_flags_updated
  before update on public.feature_flags
  for each row execute function public.set_updated_at();

-- Seed default flags. Idempotent via ON CONFLICT.
insert into public.feature_flags (key, enabled, label_fr, description_fr, group_name, sort_order) values
  ('kids_coloring',     true, 'Coloriage',         'Page /petits/coloriage', 'kids',  10),
  ('kids_maths',        true, 'Jeux de maths',     'Number Ninja & Souk',     'kids',  20),
  ('kids_smart',        true, 'Jeux malins',       'Sudoku, mémoire, motifs', 'kids',  30),
  ('kids_reading',      true, 'Lis avec moi',      'Coran et lecture guidée', 'kids',  40),
  ('kids_world',        true, 'Le monde réel',     'Heure, wilayas, manières','kids',  50),
  ('kids_quran',        true, 'Suivi Coran',       'Tracker des sourates',    'kids',  60),
  ('kids_riddle',       true, 'Énigme du jour',    'Logique pour 7-12 ans',   'kids',  70),
  ('eleve_tutor',       false,'Tuteur IA',         'Désactivé tant que la clé Claude n''est pas configurée','eleve', 10),
  ('eleve_homework_ai', false,'Aide aux devoirs IA','Désactivé tant que la clé Claude n''est pas configurée','eleve', 20),
  ('eleve_groupes',     false,'Groupes d''étude',  'Activable après configuration de la modération','eleve', 30),
  ('eleve_calligraphie',true, 'Calligraphie arabe','Pratique de l''écriture',  'eleve', 40),
  ('eleve_redaction',   true, 'Rédaction du jour', 'Sujets quotidiens d''écriture','eleve', 50),
  ('eleve_bac',         true, 'Bac & BEM',         'Archive des sujets',       'eleve', 60),
  ('parent_reports',    false,'Rapports PDF',      'Désactivé tant que Resend SMTP n''est pas configuré','parent', 10)
on conflict (key) do nothing;

comment on table public.feature_flags is
  'Admin-toggleable feature switches. App reads once per page render.';
