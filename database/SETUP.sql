-- ================================================================
-- Najaح — CONSOLIDATED DATABASE SETUP
--
-- All migrations stitched into one idempotent file.
-- Paste into Supabase SQL Editor -> Run.
-- Re-running is SAFE (every CREATE uses IF NOT EXISTS, every
-- CREATE POLICY is preceded by DROP POLICY IF EXISTS).
--
-- Apply at: https://supabase.com/dashboard/project/cyabavzunccvlfwvuyuj/sql/new
-- ================================================================


-- ==== FROM 20260504_001_early_access_signups.sql ====

-- ===============================================================
-- Migration: 20260504_001_early_access_signups
-- Purpose:  Pre-launch waitlist signups from the landing page
-- Apply:    Paste this SQL into Supabase → SQL Editor → Run
-- ===============================================================

create table if not exists public.early_access_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'fr' check (locale in ('fr','ar')),
  source text,
  created_at timestamptz not null default now(),
  -- Same email can sign up only once
  constraint early_access_signups_email_unique unique (email)
);

-- Index for "recent signups" queries in the future admin dashboard
create index if not exists idx_early_access_created_at
  on public.early_access_signups (created_at desc);

-- Enable Row Level Security (RLS) — locked by default, opened explicitly
alter table public.early_access_signups enable row level security;

-- Public can INSERT (so the landing page can save signups via anon key)
-- but cannot read (so anon key cannot scrape the email list)
-- idempotent guard for "anon can insert signups"
drop policy if exists "anon can insert signups" on public.early_access_signups;
create policy "anon can insert signups"
  on public.early_access_signups
  for insert
  to anon
  with check (true);

-- Only service_role (server-side) can read — used by future admin dashboard
-- idempotent guard for "service role full access"
drop policy if exists "service role full access" on public.early_access_signups;
create policy "service role full access"
  on public.early_access_signups
  for all
  to service_role
  using (true)
  with check (true);

-- Helpful comment for future you
comment on table public.early_access_signups is
  'Pre-launch waitlist. Email captured on landing page. Read access via service_role only.';


-- ==== FROM 20260505_002_payments_subscriptions.sql ====

-- ===============================================================
-- Migration: 20260505_002_payments_subscriptions
-- Purpose:  Tables for Chargily checkout sessions, payments, and subscriptions
-- Apply:    Paste into Supabase → SQL Editor → Run
-- ===============================================================

-- ===== Plans (catalog) =====
create table if not exists public.plans (
  id text primary key,             -- 'eleve_monthly', 'famille_annual', 'pack_bac', etc.
  name_fr text not null,
  name_ar text,
  amount_dzd integer not null,     -- price in DZD (no decimals — Chargily expects integers)
  period text not null check (period in ('monthly', 'annual', 'one_time')),
  description_fr text,
  description_ar text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed the 4 plans from spec
insert into public.plans (id, name_fr, name_ar, amount_dzd, period, description_fr) values
  ('eleve_monthly', 'Élève — Mensuel', 'تلميذ — شهري', 990, 'monthly', '1 enfant, toutes matières, accès complet'),
  ('eleve_annual', 'Élève — Annuel', 'تلميذ — سنوي', 7400, 'annual', '1 enfant, paiement annuel (-38%)'),
  ('famille_monthly', 'Famille — Mensuel', 'عائلة — شهري', 1990, 'monthly', 'Jusqu''à 4 enfants + espace parents complet'),
  ('famille_annual', 'Famille — Annuel', 'عائلة — سنوي', 14900, 'annual', 'Jusqu''à 4 enfants, paiement annuel (-38%)'),
  ('pack_bac', 'Pack Bac 90 jours', 'حزمة البكالوريا 90 يوم', 9000, 'one_time', 'Programme intensif de préparation au Bac')
on conflict (id) do nothing;

-- ===== Checkout sessions (created when user clicks "Pay") =====
create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null references public.plans(id),
  email text not null,
  customer_name text,
  customer_phone text,
  amount_dzd integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  -- Chargily refs
  chargily_checkout_id text,
  chargily_payment_id text,
  -- Locale of the user when they checked out (so we know which language emails to send)
  locale text not null default 'fr' check (locale in ('fr', 'ar')),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_checkout_sessions_email on public.checkout_sessions (email);
create index if not exists idx_checkout_sessions_chargily_id on public.checkout_sessions (chargily_checkout_id);
create index if not exists idx_checkout_sessions_status_created on public.checkout_sessions (status, created_at desc);

-- ===== Webhook events log (audit trail of every Chargily event) =====
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,        -- 'checkout.paid', 'checkout.failed', etc.
  chargily_event_id text,
  payload jsonb not null,
  signature text,
  signature_valid boolean,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_payment_events_chargily_id
  on public.payment_events (chargily_event_id)
  where chargily_event_id is not null;

-- ===== RLS — locked down by default =====
alter table public.plans enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.payment_events enable row level security;

-- Plans: anyone can read the catalog (public product info)
-- idempotent guard for "anon can read active plans"
drop policy if exists "anon can read active plans" on public.plans;
create policy "anon can read active plans"
  on public.plans for select
  to anon, authenticated
  using (active = true);

-- Checkout sessions: only service_role can read/write (anon never touches them)
-- idempotent guard for "service role full access on checkouts"
drop policy if exists "service role full access on checkouts" on public.checkout_sessions;
create policy "service role full access on checkouts"
  on public.checkout_sessions for all
  to service_role
  using (true) with check (true);

-- Payment events: service_role only
-- idempotent guard for "service role full access on events"
drop policy if exists "service role full access on events" on public.payment_events;
create policy "service role full access on events"
  on public.payment_events for all
  to service_role
  using (true) with check (true);

-- ===== updated_at trigger for checkout_sessions =====
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_checkout_sessions_updated on public.checkout_sessions;
create trigger trg_checkout_sessions_updated
  before update on public.checkout_sessions
  for each row execute function public.set_updated_at();

comment on table public.plans is 'Subscription plan catalog. Source of truth for prices.';
comment on table public.checkout_sessions is 'One row per checkout attempt. Updated by Chargily webhook.';
comment on table public.payment_events is 'Audit log of every Chargily webhook received.';


-- ==== FROM 20260505_003_user_profiles_curriculum_quizzes.sql ====

-- ===============================================================
-- Migration: 20260505_003_user_profiles_curriculum_quizzes
-- Purpose:  Tables for Stages 2-7: auth profiles, children,
--           curriculum (grades/subjects/chapters), quizzes,
--           tutor conversations, exams, kids games.
-- Apply:    Paste into Supabase → SQL Editor → Run
-- ===============================================================

-- =========================================================
-- 1. PARENT PROFILES — extends auth.users with parent fields
-- =========================================================
create table if not exists public.parent_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  wilaya text,
  language_pref text not null default 'fr' check (language_pref in ('fr', 'ar')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2. CHILDREN
-- =========================================================
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  age integer check (age between 5 and 18),
  grade text check (grade in ('1AP','2AP','3AP','4AP','5AP','1AM','2AM','3AM','4AM','1AS','2AS','3AS')),
  filiere text check (filiere in ('sciences_exp','math','lettres','tech','gestion','tronc_commun')),
  avatar_id text default 'default-1',
  profile_visibility text not null default 'private' check (profile_visibility in ('private','public')),
  daily_time_limit_minutes integer default 60,
  lock_games_until_quizzes boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_children_parent on public.children (parent_id);

-- =========================================================
-- 3. CURRICULUM — grades / subjects / chapters
-- =========================================================
create table if not exists public.grades (
  code text primary key,
  level_order integer not null,
  name_fr text not null,
  name_ar text
);

insert into public.grades (code, level_order, name_fr, name_ar) values
  ('1AP', 1, '1ère année primaire', 'السنة الأولى ابتدائي'),
  ('2AP', 2, '2ème année primaire', 'السنة الثانية ابتدائي'),
  ('3AP', 3, '3ème année primaire', 'السنة الثالثة ابتدائي'),
  ('4AP', 4, '4ème année primaire', 'السنة الرابعة ابتدائي'),
  ('5AP', 5, '5ème année primaire', 'السنة الخامسة ابتدائي'),
  ('1AM', 6, '1ère année moyen', 'السنة الأولى متوسط'),
  ('2AM', 7, '2ème année moyen', 'السنة الثانية متوسط'),
  ('3AM', 8, '3ème année moyen', 'السنة الثالثة متوسط'),
  ('4AM', 9, '4ème année moyen — BEM', 'السنة الرابعة متوسط — البيم'),
  ('1AS', 10, '1ère année secondaire', 'السنة الأولى ثانوي'),
  ('2AS', 11, '2ème année secondaire', 'السنة الثانية ثانوي'),
  ('3AS', 12, '3ème année secondaire — Bac', 'السنة الثالثة ثانوي — البكالوريا')
on conflict (code) do nothing;

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  grade_code text not null references public.grades(code) on delete cascade,
  slug text not null,
  name_fr text not null,
  name_ar text,
  icon text default 'book',
  sort_order integer default 0,
  unique (grade_code, slug)
);

create index if not exists idx_subjects_grade on public.subjects (grade_code);

-- Seed core subjects per grade (we'll grow chapters in next sessions)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('3AM', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('3AM', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('3AM', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('3AM', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('3AM', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('3AM', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 6),
  ('3AM', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا', 'map', 7),
  ('4AM', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('4AM', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('4AM', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('4AM', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('4AM', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('4AM', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 6),
  ('3AS', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('3AS', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('3AS', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('3AS', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('3AS', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('3AS', 'philosophie', 'Philosophie', 'الفلسفة', 'lightbulb', 6),
  ('3AS', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 7)
on conflict (grade_code, slug) do nothing;

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  slug text not null,
  title_fr text not null,
  title_ar text,
  description_fr text,
  sort_order integer default 0,
  unique (subject_id, slug)
);

create index if not exists idx_chapters_subject on public.chapters (subject_id);

-- =========================================================
-- 4. QUIZZES + ATTEMPTS
-- =========================================================
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  type text not null default 'regular' check (type in ('regular','mistakes','exam_mock','diagnostic')),
  score_pct numeric(5,2),
  total_questions integer,
  correct_count integer,
  difficulty text default 'medium' check (difficulty in ('easy','medium','hard','adaptive')),
  language text default 'fr' check (language in ('fr','ar')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer
);

create index if not exists idx_quizzes_child_started on public.quizzes (child_id, started_at desc);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt_fr text not null,
  prompt_ar text,
  question_type text not null default 'mcq' check (question_type in ('mcq','text','photo')),
  options_json jsonb,
  correct_answer text not null,
  explanation_fr text,
  explanation_ar text,
  generated_by_ai boolean default true,
  sort_order integer default 0
);

create index if not exists idx_questions_quiz on public.questions (quiz_id);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  child_id uuid references public.children(id) on delete cascade,
  answer text,
  is_correct boolean,
  time_spent_seconds integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_attempts_child on public.attempts (child_id, created_at desc);

-- =========================================================
-- 5. TUTOR CONVERSATIONS
-- =========================================================
create table if not exists public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  title text,
  language text default 'fr' check (language in ('fr','ar')),
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create index if not exists idx_tutor_conversations_child on public.tutor_conversations (child_id, last_message_at desc);

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.tutor_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  photo_url text,
  generated_at timestamptz not null default now()
);

create index if not exists idx_tutor_messages_conv on public.tutor_messages (conversation_id, generated_at);

-- =========================================================
-- 6. EXAMS (Bac/BEM archive + mock attempts)
-- =========================================================
create table if not exists public.exam_papers (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null check (exam_type in ('bac','bem')),
  year integer not null check (year between 1990 and 2100),
  filiere text,
  subject_slug text not null,
  file_url text,
  ocr_text text,
  official boolean default false,
  ai_solution_text text,
  solution_verified_by_admin boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_exam_papers_type_year on public.exam_papers (exam_type, year desc);

create table if not exists public.mock_exams (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  paper_id uuid references public.exam_papers(id) on delete set null,
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  completed_at timestamptz,
  score_pct numeric(5,2),
  locked boolean default true
);

-- =========================================================
-- 7. MOTIVATIONAL SPEECHES (Bac countdown)
-- =========================================================
create table if not exists public.motivational_speeches (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete set null,
  author_name text,
  author_wilaya text,
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  scheduled_for date,
  reviewed_by_admin uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 8. KIDS UNIVERSE — game progress + trophies
-- =========================================================
create table if not exists public.game_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  game_type text not null,
  level integer default 1,
  score integer default 0,
  metadata_json jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_progress_child on public.game_progress (child_id, created_at desc);

create table if not exists public.trophies (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  trophy_type text not null,
  earned_at timestamptz not null default now(),
  visible_on_profile boolean default true
);

-- =========================================================
-- 9. ACTIVITY LOG (parent dashboard feed)
-- =========================================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  activity_type text not null,
  metadata_json jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_child on public.activity_logs (child_id, occurred_at desc);

-- =========================================================
-- 10. RLS POLICIES
-- =========================================================
alter table public.parent_profiles enable row level security;
alter table public.children enable row level security;
alter table public.grades enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.tutor_conversations enable row level security;
alter table public.tutor_messages enable row level security;
alter table public.exam_papers enable row level security;
alter table public.mock_exams enable row level security;
alter table public.motivational_speeches enable row level security;
alter table public.game_progress enable row level security;
alter table public.trophies enable row level security;
alter table public.activity_logs enable row level security;

-- Parent profiles: parent can read/write their own
-- idempotent guard for "parent reads own profile"
drop policy if exists "parent reads own profile" on public.parent_profiles;
create policy "parent reads own profile" on public.parent_profiles
  for select to authenticated using (user_id = auth.uid());
-- idempotent guard for "parent updates own profile"
drop policy if exists "parent updates own profile" on public.parent_profiles;
create policy "parent updates own profile" on public.parent_profiles
  for update to authenticated using (user_id = auth.uid());
-- idempotent guard for "parent inserts own profile"
drop policy if exists "parent inserts own profile" on public.parent_profiles;
create policy "parent inserts own profile" on public.parent_profiles
  for insert to authenticated with check (user_id = auth.uid());

-- Children: parent can manage own children
-- idempotent guard for "parent reads own children"
drop policy if exists "parent reads own children" on public.children;
create policy "parent reads own children" on public.children
  for select to authenticated using (parent_id = auth.uid());
-- idempotent guard for "parent inserts own children"
drop policy if exists "parent inserts own children" on public.children;
create policy "parent inserts own children" on public.children
  for insert to authenticated with check (parent_id = auth.uid());
-- idempotent guard for "parent updates own children"
drop policy if exists "parent updates own children" on public.children;
create policy "parent updates own children" on public.children
  for update to authenticated using (parent_id = auth.uid());
-- idempotent guard for "parent deletes own children"
drop policy if exists "parent deletes own children" on public.children;
create policy "parent deletes own children" on public.children
  for delete to authenticated using (parent_id = auth.uid());

-- Curriculum: anyone authenticated can read
-- idempotent guard for "auth reads grades"
drop policy if exists "auth reads grades" on public.grades;
create policy "auth reads grades" on public.grades for select to authenticated using (true);
-- idempotent guard for "auth reads subjects"
drop policy if exists "auth reads subjects" on public.subjects;
create policy "auth reads subjects" on public.subjects for select to authenticated using (true);
-- idempotent guard for "auth reads chapters"
drop policy if exists "auth reads chapters" on public.chapters;
create policy "auth reads chapters" on public.chapters for select to authenticated using (true);
-- idempotent guard for "anon reads grades"
drop policy if exists "anon reads grades" on public.grades;
create policy "anon reads grades" on public.grades for select to anon using (true);
-- idempotent guard for "anon reads subjects"
drop policy if exists "anon reads subjects" on public.subjects;
create policy "anon reads subjects" on public.subjects for select to anon using (true);
-- idempotent guard for "anon reads chapters"
drop policy if exists "anon reads chapters" on public.chapters;
create policy "anon reads chapters" on public.chapters for select to anon using (true);

-- Quizzes/questions/attempts: parent reads child's, service role full access
-- idempotent guard for "parent reads child quizzes"
drop policy if exists "parent reads child quizzes" on public.quizzes;
create policy "parent reads child quizzes" on public.quizzes
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role quizzes"
drop policy if exists "service role quizzes" on public.quizzes;
create policy "service role quizzes" on public.quizzes
  for all to service_role using (true) with check (true);
-- idempotent guard for "service role questions"
drop policy if exists "service role questions" on public.questions;
create policy "service role questions" on public.questions
  for all to service_role using (true) with check (true);
-- idempotent guard for "service role attempts"
drop policy if exists "service role attempts" on public.attempts;
create policy "service role attempts" on public.attempts
  for all to service_role using (true) with check (true);

-- Tutor conversations
-- idempotent guard for "parent reads child convs"
drop policy if exists "parent reads child convs" on public.tutor_conversations;
create policy "parent reads child convs" on public.tutor_conversations
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role tutor conv"
drop policy if exists "service role tutor conv" on public.tutor_conversations;
create policy "service role tutor conv" on public.tutor_conversations
  for all to service_role using (true) with check (true);
-- idempotent guard for "service role tutor msg"
drop policy if exists "service role tutor msg" on public.tutor_messages;
create policy "service role tutor msg" on public.tutor_messages
  for all to service_role using (true) with check (true);

-- Exam papers: anyone authenticated reads (published exams are public per ONEC)
-- idempotent guard for "auth reads exam papers"
drop policy if exists "auth reads exam papers" on public.exam_papers;
create policy "auth reads exam papers" on public.exam_papers
  for select to authenticated using (true);
-- idempotent guard for "service role exam papers"
drop policy if exists "service role exam papers" on public.exam_papers;
create policy "service role exam papers" on public.exam_papers
  for all to service_role using (true) with check (true);
-- idempotent guard for "service role mock exams"
drop policy if exists "service role mock exams" on public.mock_exams;
create policy "service role mock exams" on public.mock_exams
  for all to service_role using (true) with check (true);

-- Speeches: anyone authenticated reads approved ones; child submits theirs
-- idempotent guard for "auth reads approved speeches"
drop policy if exists "auth reads approved speeches" on public.motivational_speeches;
create policy "auth reads approved speeches" on public.motivational_speeches
  for select to authenticated using (status = 'approved');
-- idempotent guard for "service role speeches"
drop policy if exists "service role speeches" on public.motivational_speeches;
create policy "service role speeches" on public.motivational_speeches
  for all to service_role using (true) with check (true);

-- Games: parent reads child's, service role full access
-- idempotent guard for "parent reads child games"
drop policy if exists "parent reads child games" on public.game_progress;
create policy "parent reads child games" on public.game_progress
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role games"
drop policy if exists "service role games" on public.game_progress;
create policy "service role games" on public.game_progress
  for all to service_role using (true) with check (true);

-- idempotent guard for "parent reads child trophies"
drop policy if exists "parent reads child trophies" on public.trophies;
create policy "parent reads child trophies" on public.trophies
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role trophies"
drop policy if exists "service role trophies" on public.trophies;
create policy "service role trophies" on public.trophies
  for all to service_role using (true) with check (true);

-- Activity logs
-- idempotent guard for "parent reads child activity"
drop policy if exists "parent reads child activity" on public.activity_logs;
create policy "parent reads child activity" on public.activity_logs
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role activity"
drop policy if exists "service role activity" on public.activity_logs;
create policy "service role activity" on public.activity_logs
  for all to service_role using (true) with check (true);

-- updated_at trigger for parent_profiles
drop trigger if exists trg_parent_profiles_updated on public.parent_profiles;
create trigger trg_parent_profiles_updated
  before update on public.parent_profiles
  for each row execute function public.set_updated_at();

comment on table public.parent_profiles is 'Profile data for authenticated parents. Linked to auth.users.';
comment on table public.children is 'Children belonging to a parent. RLS-scoped to parent_id = auth.uid().';


-- ==== FROM 20260505_004_admin_role_and_subjects_seed.sql ====

-- ===============================================================
-- Migration: 20260505_004_admin_role_and_more_seeds
-- Adds: is_admin column, indexes, and additional curriculum seeds
-- Apply: paste into Supabase → SQL Editor → Run
-- ===============================================================

-- 1. Admin role on parent_profiles
alter table public.parent_profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists idx_parent_profiles_admin
  on public.parent_profiles (is_admin) where is_admin = true;

-- After running this, mark yourself admin with:
--   update public.parent_profiles set is_admin = true where user_id = '<your-user-id>';

-- 2. Seed subjects for primary grades (1AP-5AP) and BEM grades (1AM-2AM)
insert into public.subjects (grade_code, slug, name_fr, name_ar, icon, sort_order) values
  ('1AP', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('1AP', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 2),
  ('1AP', 'francais', 'Français', 'الفرنسية', 'book', 3),
  ('1AP', 'eveil', 'Éveil scientifique', 'الإيقاظ العلمي', 'leaf', 4),
  ('2AP', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('2AP', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 2),
  ('2AP', 'francais', 'Français', 'الفرنسية', 'book', 3),
  ('3AP', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('3AP', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 2),
  ('3AP', 'francais', 'Français', 'الفرنسية', 'book', 3),
  ('3AP', 'eveil', 'Éveil scientifique', 'الإيقاظ العلمي', 'leaf', 4),
  ('4AP', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('4AP', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 2),
  ('4AP', 'francais', 'Français', 'الفرنسية', 'book', 3),
  ('4AP', 'eveil', 'Éveil scientifique', 'الإيقاظ العلمي', 'leaf', 4),
  ('4AP', 'histoire-geo', 'Histoire-géographie', 'التاريخ والجغرافيا', 'map', 5),
  ('5AP', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('5AP', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 2),
  ('5AP', 'francais', 'Français', 'الفرنسية', 'book', 3),
  ('5AP', 'eveil', 'Éveil scientifique', 'الإيقاظ العلمي', 'leaf', 4),
  ('1AM', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('1AM', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('1AM', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('1AM', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('1AM', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('1AM', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 6),
  ('2AM', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('2AM', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('2AM', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('2AM', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('2AM', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('2AM', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 6),
  ('1AS', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('1AS', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('1AS', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('1AS', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('1AS', 'francais', 'Français', 'الفرنسية', 'book', 5),
  ('1AS', 'anglais', 'Anglais', 'الإنجليزية', 'globe', 6),
  ('2AS', 'mathematiques', 'Mathématiques', 'الرياضيات', 'sigma', 1),
  ('2AS', 'physique', 'Sciences physiques', 'العلوم الفيزيائية', 'atom', 2),
  ('2AS', 'svt', 'Sciences naturelles', 'العلوم الطبيعية', 'leaf', 3),
  ('2AS', 'arabe', 'Arabe', 'اللغة العربية', 'book-arabic', 4),
  ('2AS', 'francais', 'Français', 'الفرنسية', 'book', 5)
on conflict (grade_code, slug) do nothing;

-- 3. Writing prompts seed (per age range)
create table if not exists public.writing_prompts (
  id uuid primary key default gen_random_uuid(),
  age_min integer not null,
  age_max integer not null,
  prompt_fr text not null,
  prompt_ar text,
  type text default 'free' check (type in ('free', 'structured')),
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.writing_prompts enable row level security;
-- idempotent guard for "auth reads writing prompts"
drop policy if exists "auth reads writing prompts" on public.writing_prompts;
create policy "auth reads writing prompts" on public.writing_prompts
  for select to authenticated using (active = true);
-- idempotent guard for "service role writing prompts"
drop policy if exists "service role writing prompts" on public.writing_prompts;
create policy "service role writing prompts" on public.writing_prompts
  for all to service_role using (true) with check (true);

insert into public.writing_prompts (age_min, age_max, prompt_fr, prompt_ar, type) values
  (5, 8, 'Décris ton plat préféré en 3 phrases.', 'صف طبقك المفضل في 3 جمل.', 'free'),
  (5, 8, 'Raconte ce que tu as fait ce matin.', 'احكِ ما فعلتَه هذا الصباح.', 'free'),
  (8, 11, 'Décris ta wilaya en 5 lignes.', 'صف ولايتك في 5 أسطر.', 'free'),
  (8, 11, 'Raconte un souvenir d''enfance.', 'احكِ ذكرى طفولة.', 'free'),
  (11, 14, 'Imagine que tu es un explorateur dans le Sahara. Raconte ta journée.', 'تخيل أنك مستكشف في الصحراء. احكِ يومك.', 'free'),
  (11, 14, 'Quel est le rôle de la famille dans ton éducation ?', 'ما دور العائلة في تربيتك؟', 'structured'),
  (14, 18, 'Le baccalauréat : pression ou opportunité ? Argumente.', 'البكالوريا: ضغط أم فرصة؟ ناقش.', 'structured'),
  (14, 18, 'Décris une journée idéale dans 10 ans.', 'صف يوماً مثالياً بعد 10 سنوات.', 'free'),
  (14, 18, 'Si tu pouvais changer une chose en Algérie, ce serait quoi ?', 'لو استطعت تغيير شيء في الجزائر، ما هو؟', 'structured')
on conflict do nothing;

-- 4. Study groups + members tables
create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.children(id) on delete cascade,
  invite_code text not null unique default substr(md5(random()::text), 1, 8),
  max_members integer not null default 10,
  created_at timestamptz default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.study_groups(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, child_id)
);

create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  sender_id uuid not null references public.children(id) on delete cascade,
  content text not null,
  ai_moderation_status text default 'pending' check (ai_moderation_status in ('pending', 'approved', 'flagged', 'blocked')),
  created_at timestamptz default now()
);

create index if not exists idx_group_messages_group on public.group_messages (group_id, created_at desc);

alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;

-- idempotent guard for "service role groups"
drop policy if exists "service role groups" on public.study_groups;
create policy "service role groups" on public.study_groups for all to service_role using (true) with check (true);
-- idempotent guard for "service role members"
drop policy if exists "service role members" on public.group_members;
create policy "service role members" on public.group_members for all to service_role using (true) with check (true);
-- idempotent guard for "service role messages"
drop policy if exists "service role messages" on public.group_messages;
create policy "service role messages" on public.group_messages for all to service_role using (true) with check (true);

-- 5. Teacher profiles
create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  school text,
  subjects text[],
  bio text,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.teacher_profiles enable row level security;
-- idempotent guard for "teacher reads own"
drop policy if exists "teacher reads own" on public.teacher_profiles;
create policy "teacher reads own" on public.teacher_profiles for select to authenticated using (user_id = auth.uid());
-- idempotent guard for "teacher updates own"
drop policy if exists "teacher updates own" on public.teacher_profiles;
create policy "teacher updates own" on public.teacher_profiles for update to authenticated using (user_id = auth.uid());
-- idempotent guard for "service role teachers"
drop policy if exists "service role teachers" on public.teacher_profiles;
create policy "service role teachers" on public.teacher_profiles for all to service_role using (true) with check (true);

-- 6. Helpful indexes for activity / KPIs
create index if not exists idx_attempts_child_correct on public.attempts (child_id, is_correct);
create index if not exists idx_quizzes_child_completed on public.quizzes (child_id, completed_at desc) where completed_at is not null;

comment on column public.parent_profiles.is_admin is 'Manually set in Supabase SQL editor for admin users.';


-- ==== FROM 20260505_005_parental_controls_friends_support.sql ====

-- ===============================================================
-- Migration 005 — parental controls, friend requests, support, trophies
-- Apply: paste into Supabase SQL Editor → Run
-- ===============================================================

-- 1. Per-child parental controls
create table if not exists public.parent_controls (
  child_id uuid primary key references public.children(id) on delete cascade,
  parent_id uuid not null references auth.users(id) on delete cascade,
  daily_time_limit_minutes integer default 60 check (daily_time_limit_minutes between 0 and 720),
  lock_games_until_quizzes boolean default false,
  allowed_kids_universe boolean default true,
  allowed_social boolean default false,
  bedtime_start time,
  bedtime_end time,
  updated_at timestamptz default now()
);

alter table public.parent_controls enable row level security;
-- idempotent guard for "parent reads own child controls"
drop policy if exists "parent reads own child controls" on public.parent_controls;
create policy "parent reads own child controls" on public.parent_controls
  for select to authenticated using (parent_id = auth.uid());
-- idempotent guard for "parent updates own child controls"
drop policy if exists "parent updates own child controls" on public.parent_controls;
create policy "parent updates own child controls" on public.parent_controls
  for all to authenticated using (parent_id = auth.uid()) with check (parent_id = auth.uid());

drop trigger if exists trg_parent_controls_updated on public.parent_controls;
create trigger trg_parent_controls_updated
  before update on public.parent_controls
  for each row execute function public.set_updated_at();

-- 2. Support messages from contact form
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  locale text default 'fr' check (locale in ('fr','ar')),
  status text default 'open' check (status in ('open','in_progress','resolved')),
  created_at timestamptz default now()
);

create index if not exists idx_support_status_created on public.support_messages (status, created_at desc);

alter table public.support_messages enable row level security;
-- idempotent guard for "service role support"
drop policy if exists "service role support" on public.support_messages;
create policy "service role support" on public.support_messages
  for all to service_role using (true) with check (true);

-- 3. Logic riddles + wilayas + quran content
create table if not exists public.logic_riddles (
  id uuid primary key default gen_random_uuid(),
  question_fr text not null,
  question_ar text,
  answer text not null,
  hint_fr text,
  age_min integer default 7,
  age_max integer default 12,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.logic_riddles enable row level security;
-- idempotent guard for "auth reads riddles"
drop policy if exists "auth reads riddles" on public.logic_riddles;
create policy "auth reads riddles" on public.logic_riddles for select to authenticated using (active);
-- idempotent guard for "service role riddles"
drop policy if exists "service role riddles" on public.logic_riddles;
create policy "service role riddles" on public.logic_riddles for all to service_role using (true) with check (true);

insert into public.logic_riddles (question_fr, question_ar, answer, hint_fr) values
  ('Plus tu en prends, plus tu en laisses derrière toi. Qui suis-je ?', 'كلما أخذت أكثر تركت أكثر خلفك. من أنا؟', 'pas', 'On les compte en marchant'),
  ('Je n''ai pas de bouche, mais je parle. Pas d''oreilles, mais j''écoute. Qui suis-je ?', 'ليس لي فم لكنني أتكلم، ولا أذنين لكنني أسمع. من أنا؟', 'écho', 'On me trouve dans les montagnes'),
  ('Si tu m''as, tu veux me partager. Si tu me partages, tu ne m''as plus. Qui suis-je ?', 'إذا حصلت علي تريد مشاركتي، وإذا شاركتني فقدتني. ما أنا؟', 'secret', 'C''est quelque chose qui ne se dit pas'),
  ('Je peux voler sans ailes, je peux pleurer sans yeux. Qui suis-je ?', 'أطير بلا أجنحة وأبكي بلا عيون. من أنا؟', 'nuage', 'Tu me regardes dans le ciel'),
  ('Plus je sèche, plus je deviens humide. Qui suis-je ?', 'كلما جففت أصبحت أكثر بللاً. من أنا؟', 'serviette', 'Après la douche'),
  ('J''ai 88 touches mais je ne ferme aucune porte. Qui suis-je ?', 'لدي 88 مفتاحاً لكنني لا أفتح أي باب. من أنا؟', 'piano', 'Un instrument de musique'),
  ('Quel est le mot français de 5 lettres qui contient deux fois la même lettre au début et à la fin ?', null, 'avale', 'Pense à un verbe'),
  ('Combien d''anniversaires un homme moyen a-t-il ?', 'كم عيد ميلاد للإنسان العادي؟', '1', 'Réfléchis : il naît combien de fois ?'),
  ('Je commence par P, fini par E, et je contiens des milliers de lettres. Qui suis-je ?', 'أبدأ بحرف P وأنتهي بحرف E وأحتوي على آلاف الحروف. ما أنا؟', 'poste', 'On y va pour envoyer du courrier'),
  ('Plus tu m''enlèves, plus je grandis. Qui suis-je ?', 'كلما أزلت مني أكبر أكثر. ما أنا؟', 'trou', 'Avec une pelle')
on conflict do nothing;

-- 4. Wilayas (58)
create table if not exists public.wilayas (
  code integer primary key,
  name_fr text not null,
  name_ar text not null,
  region_fr text,
  fact_fr text
);

insert into public.wilayas (code, name_fr, name_ar, region_fr, fact_fr) values
  (1, 'Adrar', 'أدرار', 'Sud', 'Connue pour ses oasis et son architecture en pisé.'),
  (2, 'Chlef', 'الشلف', 'Nord', 'Située dans la vallée du Chéliff.'),
  (3, 'Laghouat', 'الأغواط', 'Hauts plateaux', 'Porte du Sahara, célèbre pour ses palmiers.'),
  (4, 'Oum El Bouaghi', 'أم البواقي', 'Est', 'Riche en sites archéologiques numides.'),
  (5, 'Batna', 'باتنة', 'Aurès', 'Capitale des Aurès, près de Timgad.'),
  (6, 'Béjaïa', 'بجاية', 'Kabylie', 'Ville côtière historique, ancien royaume hammadide.'),
  (7, 'Biskra', 'بسكرة', 'Sud-est', 'Reine des Zibans, oasis de palmiers.'),
  (8, 'Béchar', 'بشار', 'Sud-ouest', 'Porte du Sahara occidental.'),
  (9, 'Blida', 'البليدة', 'Nord', 'Surnommée la ville des Roses.'),
  (10, 'Bouira', 'البويرة', 'Centre', 'Au pied du Djurdjura.'),
  (11, 'Tamanrasset', 'تمنراست', 'Sud', 'Capitale du Hoggar, terre touarègue.'),
  (12, 'Tébessa', 'تبسة', 'Est', 'Riche en vestiges romains.'),
  (13, 'Tlemcen', 'تلمسان', 'Ouest', 'Ancienne capitale zianide, ville de l''art andalou.'),
  (14, 'Tiaret', 'تيارت', 'Hauts plateaux', 'Berceau de la dynastie rostémide.'),
  (15, 'Tizi Ouzou', 'تيزي وزو', 'Kabylie', 'Capitale de la Grande Kabylie.'),
  (16, 'Alger', 'الجزائر', 'Centre', 'Capitale du pays, surnommée El Behdja.'),
  (17, 'Djelfa', 'الجلفة', 'Hauts plateaux', 'Région de pastoralisme et steppes.'),
  (18, 'Jijel', 'جيجل', 'Nord', 'Côte sauvage, plages et grottes.'),
  (19, 'Sétif', 'سطيف', 'Hauts plateaux', 'Connue pour ses ruines romaines de Djemila.'),
  (20, 'Saïda', 'سعيدة', 'Ouest', 'Région agricole et thermale.'),
  (21, 'Skikda', 'سكيكدة', 'Est', 'Port pétrolier important.'),
  (22, 'Sidi Bel Abbès', 'سيدي بلعباس', 'Ouest', 'Ville coloniale historique.'),
  (23, 'Annaba', 'عنابة', 'Est', 'Anciennement Hippone, ville de Saint Augustin.'),
  (24, 'Guelma', 'قالمة', 'Est', 'Théâtre romain bien conservé.'),
  (25, 'Constantine', 'قسنطينة', 'Est', 'Ville des ponts suspendus.'),
  (26, 'Médéa', 'المدية', 'Centre', 'Vignobles historiques et plateaux.'),
  (27, 'Mostaganem', 'مستغانم', 'Ouest', 'Port méditerranéen et plages.'),
  (28, 'M''Sila', 'المسيلة', 'Hauts plateaux', 'Lac salé de Chott El Hodna.'),
  (29, 'Mascara', 'معسكر', 'Ouest', 'Ville natale de l''Émir Abdelkader.'),
  (30, 'Ouargla', 'ورقلة', 'Sahara', 'Ville saharienne, oasis pétrolière.'),
  (31, 'Oran', 'وهران', 'Ouest', 'La Radieuse, deuxième ville du pays.'),
  (32, 'El Bayadh', 'البيض', 'Hauts plateaux', 'Région de monts et d''oasis.'),
  (33, 'Illizi', 'إليزي', 'Sahara', 'Sahara central, art rupestre du Tassili.'),
  (34, 'Bordj Bou Arreridj', 'برج بوعريريج', 'Hauts plateaux', 'Hub d''électronique.'),
  (35, 'Boumerdès', 'بومرداس', 'Centre', 'Côte est d''Alger.'),
  (36, 'El Tarf', 'الطارف', 'Est', 'Frontière avec la Tunisie, parc national.'),
  (37, 'Tindouf', 'تندوف', 'Sud-ouest', 'Frontière avec le Sahara occidental.'),
  (38, 'Tissemsilt', 'تيسمسيلت', 'Centre', 'Région de l''Ouarsenis.'),
  (39, 'El Oued', 'الوادي', 'Sahara', 'Ville aux mille coupoles.'),
  (40, 'Khenchela', 'خنشلة', 'Aurès', 'Au cœur des Aurès.'),
  (41, 'Souk Ahras', 'سوق أهراس', 'Est', 'Ville natale de Saint Augustin.'),
  (42, 'Tipaza', 'تيبازة', 'Centre', 'Ruines romaines patrimoine UNESCO.'),
  (43, 'Mila', 'ميلة', 'Est', 'Région agricole et historique.'),
  (44, 'Aïn Defla', 'عين الدفلى', 'Centre', 'Vallée du Chéliff, agriculture.'),
  (45, 'Naâma', 'النعامة', 'Ouest', 'Steppes et élevage.'),
  (46, 'Aïn Témouchent', 'عين تموشنت', 'Ouest', 'Côte méditerranéenne.'),
  (47, 'Ghardaïa', 'غرداية', 'Sud', 'Vallée du M''zab, patrimoine UNESCO.'),
  (48, 'Relizane', 'غليزان', 'Ouest', 'Plaine du Chéliff.'),
  (49, 'Timimoun', 'تيميمون', 'Sud', 'Oasis rouge du Gourara.'),
  (50, 'Bordj Badji Mokhtar', 'برج باجي مختار', 'Sahara', 'Frontière avec le Mali.'),
  (51, 'Ouled Djellal', 'أولاد جلال', 'Sud-est', 'Région des Ziban.'),
  (52, 'Béni Abbès', 'بني عباس', 'Sud-ouest', 'Oasis verte au cœur du Sahara.'),
  (53, 'In Salah', 'عين صالح', 'Sahara', 'Au cœur du désert.'),
  (54, 'In Guezzam', 'عين قزام', 'Sahara', 'Frontière avec le Niger.'),
  (55, 'Touggourt', 'تقرت', 'Sahara', 'Oasis de palmiers.'),
  (56, 'Djanet', 'جانت', 'Sahara', 'Tassili N''Ajjer, art rupestre.'),
  (57, 'El M''Ghair', 'المغير', 'Sud-est', 'Région saharienne.'),
  (58, 'El Meniaa', 'المنيعة', 'Sahara', 'Oasis du Mzab.')
on conflict (code) do nothing;

alter table public.wilayas enable row level security;
-- idempotent guard for "anyone reads wilayas"
drop policy if exists "anyone reads wilayas" on public.wilayas;
create policy "anyone reads wilayas" on public.wilayas for select to anon, authenticated using (true);

-- 5. Quran surahs (114) — minimal seed
create table if not exists public.quran_surahs (
  number integer primary key,
  name_ar text not null,
  name_translit text not null,
  name_fr text,
  ayah_count integer not null,
  revelation_place text check (revelation_place in ('mecca','medina'))
);

alter table public.quran_surahs enable row level security;
-- idempotent guard for "anyone reads surahs"
drop policy if exists "anyone reads surahs" on public.quran_surahs;
create policy "anyone reads surahs" on public.quran_surahs for select to anon, authenticated using (true);

-- Insert all 114 surahs (compact form)
insert into public.quran_surahs (number, name_ar, name_translit, name_fr, ayah_count, revelation_place) values
  (1, 'الفاتحة','Al-Fatiha','L''Ouverture',7,'mecca'),
  (2, 'البقرة','Al-Baqara','La Vache',286,'medina'),
  (3, 'آل عمران','Al-Imran','La Famille d''Imran',200,'medina'),
  (4, 'النساء','An-Nisa','Les Femmes',176,'medina'),
  (5, 'المائدة','Al-Maida','La Table Servie',120,'medina'),
  (6, 'الأنعام','Al-Anam','Les Bestiaux',165,'mecca'),
  (7, 'الأعراف','Al-Araf','Les Hauteurs',206,'mecca'),
  (8, 'الأنفال','Al-Anfal','Le Butin',75,'medina'),
  (9, 'التوبة','At-Tawba','Le Repentir',129,'medina'),
  (10, 'يونس','Yunus','Jonas',109,'mecca'),
  (11, 'هود','Hud','Houd',123,'mecca'),
  (12, 'يوسف','Yusuf','Joseph',111,'mecca'),
  (13, 'الرعد','Ar-Rad','Le Tonnerre',43,'medina'),
  (14, 'إبراهيم','Ibrahim','Abraham',52,'mecca'),
  (15, 'الحجر','Al-Hijr','Al-Hijr',99,'mecca'),
  (16, 'النحل','An-Nahl','Les Abeilles',128,'mecca'),
  (17, 'الإسراء','Al-Isra','Le Voyage Nocturne',111,'mecca'),
  (18, 'الكهف','Al-Kahf','La Caverne',110,'mecca'),
  (19, 'مريم','Maryam','Marie',98,'mecca'),
  (20, 'طه','Ta-Ha','Ta-Ha',135,'mecca'),
  (108, 'الكوثر','Al-Kawthar','L''Abondance',3,'mecca'),
  (109, 'الكافرون','Al-Kafirun','Les Infidèles',6,'mecca'),
  (110, 'النصر','An-Nasr','Le Secours',3,'medina'),
  (111, 'المسد','Al-Masad','Les Fibres',5,'mecca'),
  (112, 'الإخلاص','Al-Ikhlas','Le Monothéisme Pur',4,'mecca'),
  (113, 'الفلق','Al-Falaq','L''Aube Naissante',5,'mecca'),
  (114, 'الناس','An-Nas','Les Hommes',6,'mecca')
on conflict (number) do nothing;

-- 6. Manners (adab) lessons
create table if not exists public.adab_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_fr text not null,
  title_ar text,
  body_fr text not null,
  body_ar text,
  age_min integer default 5,
  age_max integer default 12,
  sort_order integer default 0
);

alter table public.adab_lessons enable row level security;
-- idempotent guard for "anyone reads adab"
drop policy if exists "anyone reads adab" on public.adab_lessons;
create policy "anyone reads adab" on public.adab_lessons for select to anon, authenticated using (true);

insert into public.adab_lessons (slug, title_fr, title_ar, body_fr, body_ar, sort_order) values
  ('saluer', 'Saluer', 'السلام', 'Quand tu rencontres quelqu''un, dis « Assalamu alaykum » ou « Bonjour ». Le sourire est aussi un cadeau.', 'عندما تلتقي بشخص، قل "السلام عليكم" أو "صباح الخير". الابتسامة أيضاً هدية.', 1),
  ('respect-parents', 'Respecter ses parents', 'احترام الوالدين', 'Tes parents te veulent du bien. Écoute-les avec respect, même si tu n''es pas d''accord.', 'والداك يريدان لك الخير. أصغِ إليهما باحترام، حتى لو لم تتفق معهما.', 2),
  ('verite', 'Dire la vérité', 'قول الحقيقة', 'La vérité te rend libre. Même si elle est dure, dire la vérité est toujours mieux que mentir.', 'الحقيقة تحررك. حتى لو كانت صعبة، قول الحقيقة دائماً أفضل من الكذب.', 3),
  ('partage', 'Partager', 'المشاركة', 'Quand tu partages avec tes amis ou ta famille, tu reçois plus de joie que tu n''en donnes.', 'عندما تشارك أصدقاءك أو عائلتك، تكسب فرحاً أكثر مما تعطي.', 4),
  ('patience', 'Avoir de la patience', 'الصبر', 'Tout ne s''obtient pas tout de suite. La patience est la clé de toutes les réussites.', 'لا يأتي كل شيء على الفور. الصبر هو مفتاح كل النجاحات.', 5),
  ('proprete', 'Être propre', 'النظافة', 'Te laver les mains, brosser tes dents, ranger ta chambre — la propreté est une moitié de la foi.', 'غسل اليدين وتفريش الأسنان وترتيب الغرفة — النظافة من الإيمان.', 6),
  ('aider', 'Aider les autres', 'مساعدة الآخرين', 'Aider une personne âgée à traverser la rue, partager ton goûter avec un ami — chaque petit geste compte.', 'مساعدة شخص كبير في عبور الشارع، أو مشاركة وجبتك مع صديق — كل لفتة صغيرة تهم.', 7),
  ('voisin', 'Respecter les voisins', 'احترام الجار', 'Tes voisins font partie de ta famille élargie. Salue-les, aide-les, et ne fais pas de bruit la nuit.', 'جيرانك جزء من عائلتك. حيهم وساعدهم ولا تزعجهم في الليل.', 8)
on conflict (slug) do nothing;

-- 7. Quran progress tracker per child (referenced by /api/quran/progress)
create table if not exists public.quran_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.children(id) on delete cascade,
  surah_number integer not null,
  verses_memorized integer default 0,
  last_practiced timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists uq_quran_progress_student_surah
  on public.quran_progress (student_id, surah_number);

alter table public.quran_progress enable row level security;
-- idempotent guard for "parent reads child quran"
drop policy if exists "parent reads child quran" on public.quran_progress;
create policy "parent reads child quran" on public.quran_progress
  for select to authenticated using (student_id in (select id from public.children where parent_id = auth.uid()));
-- idempotent guard for "service role quran"
drop policy if exists "service role quran" on public.quran_progress;
create policy "service role quran" on public.quran_progress
  for all to service_role using (true) with check (true);

-- 8. Auth audit log (login attempts, password changes)
create table if not exists public.auth_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  ip text,
  user_agent text,
  success boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_auth_audit_user on public.auth_audit (user_id, created_at desc);
alter table public.auth_audit enable row level security;
-- idempotent guard for "service role audit"
drop policy if exists "service role audit" on public.auth_audit;
create policy "service role audit" on public.auth_audit for all to service_role using (true) with check (true);

comment on table public.parent_controls is 'Per-child screen time and feature limits, set by parent.';
