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
create policy "parent reads own profile" on public.parent_profiles
  for select to authenticated using (user_id = auth.uid());
create policy "parent updates own profile" on public.parent_profiles
  for update to authenticated using (user_id = auth.uid());
create policy "parent inserts own profile" on public.parent_profiles
  for insert to authenticated with check (user_id = auth.uid());

-- Children: parent can manage own children
create policy "parent reads own children" on public.children
  for select to authenticated using (parent_id = auth.uid());
create policy "parent inserts own children" on public.children
  for insert to authenticated with check (parent_id = auth.uid());
create policy "parent updates own children" on public.children
  for update to authenticated using (parent_id = auth.uid());
create policy "parent deletes own children" on public.children
  for delete to authenticated using (parent_id = auth.uid());

-- Curriculum: anyone authenticated can read
create policy "auth reads grades" on public.grades for select to authenticated using (true);
create policy "auth reads subjects" on public.subjects for select to authenticated using (true);
create policy "auth reads chapters" on public.chapters for select to authenticated using (true);
create policy "anon reads grades" on public.grades for select to anon using (true);
create policy "anon reads subjects" on public.subjects for select to anon using (true);
create policy "anon reads chapters" on public.chapters for select to anon using (true);

-- Quizzes/questions/attempts: parent reads child's, service role full access
create policy "parent reads child quizzes" on public.quizzes
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role quizzes" on public.quizzes
  for all to service_role using (true) with check (true);
create policy "service role questions" on public.questions
  for all to service_role using (true) with check (true);
create policy "service role attempts" on public.attempts
  for all to service_role using (true) with check (true);

-- Tutor conversations
create policy "parent reads child convs" on public.tutor_conversations
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role tutor conv" on public.tutor_conversations
  for all to service_role using (true) with check (true);
create policy "service role tutor msg" on public.tutor_messages
  for all to service_role using (true) with check (true);

-- Exam papers: anyone authenticated reads (published exams are public per ONEC)
create policy "auth reads exam papers" on public.exam_papers
  for select to authenticated using (true);
create policy "service role exam papers" on public.exam_papers
  for all to service_role using (true) with check (true);
create policy "service role mock exams" on public.mock_exams
  for all to service_role using (true) with check (true);

-- Speeches: anyone authenticated reads approved ones; child submits theirs
create policy "auth reads approved speeches" on public.motivational_speeches
  for select to authenticated using (status = 'approved');
create policy "service role speeches" on public.motivational_speeches
  for all to service_role using (true) with check (true);

-- Games: parent reads child's, service role full access
create policy "parent reads child games" on public.game_progress
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role games" on public.game_progress
  for all to service_role using (true) with check (true);

create policy "parent reads child trophies" on public.trophies
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role trophies" on public.trophies
  for all to service_role using (true) with check (true);

-- Activity logs
create policy "parent reads child activity" on public.activity_logs
  for select to authenticated using (child_id in (select id from public.children where parent_id = auth.uid()));
create policy "service role activity" on public.activity_logs
  for all to service_role using (true) with check (true);

-- updated_at trigger for parent_profiles
drop trigger if exists trg_parent_profiles_updated on public.parent_profiles;
create trigger trg_parent_profiles_updated
  before update on public.parent_profiles
  for each row execute function public.set_updated_at();

comment on table public.parent_profiles is 'Profile data for authenticated parents. Linked to auth.users.';
comment on table public.children is 'Children belonging to a parent. RLS-scoped to parent_id = auth.uid().';
