-- =====================================================================
-- FIX_TEACHERS.sql  —  ensures every teacher table/column exists
-- Idempotent: safe to run once. Fixes 'configuration de la base incomplete'
-- when adding a teacher, and enables the teacher community.
-- =====================================================================

-- ----- from 20260509_013_teacher_mode.sql -----
-- ===============================================================
-- Migration: 20260509_013_teacher_mode
-- Mode Enseignant â€” teachers create classes, import students by CSV,
-- and assign devoirs (homework). MVP: just account + classes + student
-- list + simple devoir assignment. Real grading wiring comes later.
-- ===============================================================

-- 1) Teacher profiles â€” extension of auth.users (one row per teacher).
-- A user can be both a parent AND a teacher at the same time, so this is a
-- separate table from parent_profiles instead of a role column.
create table if not exists public.teacher_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  school_name  text,
  wilaya       text,
  phone        text,
  bio          text,
  verified     boolean not null default false,    -- staff confirms diploma later
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2) Classes â€” owned by a teacher. Year (2025-26 etc) + grade level.
create table if not exists public.teacher_classes (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references auth.users(id) on delete cascade,
  name         text not null,                     -- e.g. "5AP-A â€” Ã‰cole Hassiba Ben Bouali"
  grade        text not null,                     -- '1AP'..'3AS'
  school_year  text not null default '2025-2026',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_teacher_classes_teacher
  on public.teacher_classes(teacher_id, created_at desc);

-- 3) Students â€” one row per student in a class. Imported via CSV (name,
-- grade row in mass-paste). Optional link to an existing children.id (the
-- kid's parent has a child registered in the platform).
create table if not exists public.class_students (
  id            uuid primary key default gen_random_uuid(),
  class_id      uuid not null references public.teacher_classes(id) on delete cascade,
  full_name     text not null,
  numero        text,                            -- numero d'inscription (school-internal)
  child_id      uuid references public.children(id) on delete set null,
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_class_students_class
  on public.class_students(class_id, full_name);

-- 4) Devoirs â€” homework assignments. Teacher picks N quiz_questions or
-- a chapter, sets a due_at. We track student completion via a separate
-- table (devoir_completions).
create table if not exists public.teacher_devoirs (
  id             uuid primary key default gen_random_uuid(),
  class_id       uuid not null references public.teacher_classes(id) on delete cascade,
  title          text not null,
  description    text,
  chapter_id     uuid,                           -- optional FK to chapters; not enforced
  due_at         timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_teacher_devoirs_class
  on public.teacher_devoirs(class_id, due_at);

-- 5) RLS â€” only the teacher who created a row can read/edit it.
alter table public.teacher_profiles enable row level security;
alter table public.teacher_classes  enable row level security;
alter table public.class_students   enable row level security;
alter table public.teacher_devoirs  enable row level security;

drop policy if exists "teacher manages own profile" on public.teacher_profiles;
create policy "teacher manages own profile" on public.teacher_profiles
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "teacher manages own classes" on public.teacher_classes;
create policy "teacher manages own classes" on public.teacher_classes
  for all to authenticated
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

drop policy if exists "teacher manages own students" on public.class_students;
create policy "teacher manages own students" on public.class_students
  for all to authenticated
  using (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()))
  with check (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()));

drop policy if exists "teacher manages own devoirs" on public.teacher_devoirs;
create policy "teacher manages own devoirs" on public.teacher_devoirs
  for all to authenticated
  using (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()))
  with check (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()));


-- ----- from 20260509_016_teacher_network.sql -----
-- ===============================================================
-- Migration: 20260509_016_teacher_network
--
-- Public-facing teacher profiles + a shared feed + peer-to-peer messaging
-- between approved teachers.
--
-- Extends the existing teacher_profiles table with public-profile fields:
--   - is_public      : teacher opted into the public reseau
--   - status         : pending / approved / rejected (admin gates visibility)
--   - bio_public     : longer bio shown on /enseignant/reseau/[id]
--   - subjects       : array of subject codes ['math','fr','ar',...]
--   - grades_taught  : array like ['1AP','2AP','3AS']
--
-- New tables:
--   - teacher_posts  : feed items (resource shared, question asked, etc.)
--   - teacher_dms    : direct messages between two teacher user_ids
-- ===============================================================

alter table public.teacher_profiles
  add column if not exists is_public boolean not null default false,
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused')),
  add column if not exists bio_public text,
  add column if not exists subjects text[] default '{}',
  add column if not exists grades_taught text[] default '{}',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id);

create index if not exists idx_teacher_profiles_status
  on public.teacher_profiles(status, is_public);

-- ===== teacher_posts =====
create table if not exists public.teacher_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references auth.users(id) on delete cascade,
  kind        text not null default 'note'
    check (kind in ('note', 'resource', 'question', 'tip')),
  title       text,
  body        text not null,
  -- Optional metadata (filtering / search)
  subjects    text[] default '{}',
  grades      text[] default '{}',
  attachment_url text,
  -- Visibility â€” for now always 'network' (other approved teachers)
  visibility  text not null default 'network' check (visibility in ('network', 'private')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_teacher_posts_recent
  on public.teacher_posts(created_at desc);
create index if not exists idx_teacher_posts_author
  on public.teacher_posts(author_id, created_at desc);

-- ===== teacher_dms =====
-- Two approved teachers can message each other. Simple flat table â€” one
-- row per message â€” no separate "thread" table; we group client-side by
-- (sender, recipient) pair.
create table if not exists public.teacher_dms (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_teacher_dms_pair
  on public.teacher_dms(sender_id, recipient_id, created_at);
create index if not exists idx_teacher_dms_recipient
  on public.teacher_dms(recipient_id, created_at desc);

-- ===== RLS =====
alter table public.teacher_posts enable row level security;
alter table public.teacher_dms enable row level security;

-- teacher_posts: any approved teacher reads network posts; author inserts own.
drop policy if exists "approved teachers read network posts" on public.teacher_posts;
create policy "approved teachers read network posts" on public.teacher_posts
  for select to authenticated
  using (
    visibility = 'network'
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
  );

drop policy if exists "approved teacher inserts post" on public.teacher_posts;
create policy "approved teacher inserts post" on public.teacher_posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
  );

-- teacher_dms: only sender + recipient read; sender inserts (must be approved).
drop policy if exists "dm parties read" on public.teacher_dms;
create policy "dm parties read" on public.teacher_dms
  for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

drop policy if exists "approved teacher sends dm" on public.teacher_dms;
create policy "approved teacher sends dm" on public.teacher_dms
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
    and exists (
      select 1 from public.teacher_profiles
      where user_id = recipient_id and status = 'approved'
    )
  );

-- teacher_profiles: anyone reads approved + public profiles; owner reads own.
-- (Update existing policies â€” drop old, recreate.)
drop policy if exists "anyone reads approved teacher profiles" on public.teacher_profiles;
create policy "anyone reads approved teacher profiles" on public.teacher_profiles
  for select to anon, authenticated
  using (status = 'approved' and is_public = true);


-- ----- from 20260722_027_teacher_post_comments.sql -----
-- ===============================================================
-- Migration: 20260722_027_teacher_post_comments
--
-- Comments on the teacher community feed (teacher_posts from migration 016).
-- Only approved teachers can read/write â€” same gate as the posts.
-- Idempotent.
-- ===============================================================

create table if not exists public.teacher_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.teacher_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_teacher_comments_post
  on public.teacher_post_comments (post_id, created_at);

alter table public.teacher_post_comments enable row level security;

-- Approved teachers can read comments.
drop policy if exists "approved teachers read comments" on public.teacher_post_comments;
create policy "approved teachers read comments" on public.teacher_post_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.teacher_profiles tp
      where tp.user_id = auth.uid() and tp.status = 'approved'
    )
  );

-- Approved teachers can comment (as themselves).
drop policy if exists "approved teachers write comments" on public.teacher_post_comments;
create policy "approved teachers write comments" on public.teacher_post_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles tp
      where tp.user_id = auth.uid() and tp.status = 'approved'
    )
  );

drop policy if exists "service role teacher comments" on public.teacher_post_comments;
create policy "service role teacher comments" on public.teacher_post_comments
  for all to service_role using (true) with check (true);

comment on table public.teacher_post_comments is
  'Comments on teacher_posts. Read/write restricted to approved teachers.';


-- Refresh the PostgREST schema cache so the new tables are visible immediately
notify pgrst, 'reload schema';
