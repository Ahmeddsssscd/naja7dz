-- ===============================================================
-- Migration: 20260509_013_teacher_mode
-- Mode Enseignant — teachers create classes, import students by CSV,
-- and assign devoirs (homework). MVP: just account + classes + student
-- list + simple devoir assignment. Real grading wiring comes later.
-- ===============================================================

-- 1) Teacher profiles — extension of auth.users (one row per teacher).
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

-- 2) Classes — owned by a teacher. Year (2025-26 etc) + grade level.
create table if not exists public.teacher_classes (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references auth.users(id) on delete cascade,
  name         text not null,                     -- e.g. "5AP-A — École Hassiba Ben Bouali"
  grade        text not null,                     -- '1AP'..'3AS'
  school_year  text not null default '2025-2026',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_teacher_classes_teacher
  on public.teacher_classes(teacher_id, created_at desc);

-- 3) Students — one row per student in a class. Imported via CSV (name,
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

-- 4) Devoirs — homework assignments. Teacher picks N quiz_questions or
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

-- 5) RLS — only the teacher who created a row can read/edit it.
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
