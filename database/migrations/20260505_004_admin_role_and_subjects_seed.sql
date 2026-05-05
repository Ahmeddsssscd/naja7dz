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
create policy "auth reads writing prompts" on public.writing_prompts
  for select to authenticated using (active = true);
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

create policy "service role groups" on public.study_groups for all to service_role using (true) with check (true);
create policy "service role members" on public.group_members for all to service_role using (true) with check (true);
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
create policy "teacher reads own" on public.teacher_profiles for select to authenticated using (user_id = auth.uid());
create policy "teacher updates own" on public.teacher_profiles for update to authenticated using (user_id = auth.uid());
create policy "service role teachers" on public.teacher_profiles for all to service_role using (true) with check (true);

-- 6. Helpful indexes for activity / KPIs
create index if not exists idx_attempts_child_correct on public.attempts (child_id, is_correct);
create index if not exists idx_quizzes_child_completed on public.quizzes (child_id, completed_at desc) where completed_at is not null;

comment on column public.parent_profiles.is_admin is 'Manually set in Supabase SQL editor for admin users.';
