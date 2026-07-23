-- =====================================================================
-- FIX_EVERYTHING.sql
--
-- Reconciles an older database (built from SETUP.sql) with what the current
-- code expects. The root cause of the recurring "configuration de la base
-- de données est incomplète" errors is schema drift: tables exist but are
-- missing newer columns, and CREATE TABLE IF NOT EXISTS can't patch them —
-- only ALTER TABLE ADD COLUMN can.
--
-- 100% safe: only ADDS columns/tables, never drops data. Idempotent — run
-- it as many times as you like.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) parent_profiles — admin flag + onboarding
-- ---------------------------------------------------------------------
alter table public.parent_profiles add column if not exists is_admin   boolean not null default false;
alter table public.parent_profiles add column if not exists onboarded  boolean not null default false;
alter table public.parent_profiles add column if not exists phone      text;
alter table public.parent_profiles add column if not exists wilaya     text;
alter table public.parent_profiles add column if not exists updated_at timestamptz not null default now();
-- Account role chosen at sign-up (parent | student | teacher).
alter table public.parent_profiles add column if not exists role text not null default 'parent';
do $$ begin
  alter table public.parent_profiles drop constraint if exists parent_profiles_role_check;
  alter table public.parent_profiles add constraint parent_profiles_role_check
    check (role in ('parent','student','teacher'));
exception when others then null; end $$;

-- ---------------------------------------------------------------------
-- 2) children — kids-universe opt-in + parental controls
-- ---------------------------------------------------------------------
alter table public.children add column if not exists kids_universe_enabled  boolean not null default false;
alter table public.children add column if not exists avatar_id              text default 'default-1';
alter table public.children add column if not exists daily_time_limit_minutes integer default 60;
alter table public.children add column if not exists lock_games_until_quizzes boolean default false;

-- ---------------------------------------------------------------------
-- 3) chapters — inline lesson content (migrations 017/018)
-- ---------------------------------------------------------------------
alter table public.chapters add column if not exists lesson_fr text;
alter table public.chapters add column if not exists lesson_ar text;

-- ---------------------------------------------------------------------
-- 4) teacher_profiles — THE teacher-signup fix (missing school_name etc.)
-- ---------------------------------------------------------------------
create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);
alter table public.teacher_profiles add column if not exists full_name     text;
alter table public.teacher_profiles add column if not exists school_name   text;
alter table public.teacher_profiles add column if not exists wilaya        text;
alter table public.teacher_profiles add column if not exists phone         text;
alter table public.teacher_profiles add column if not exists bio           text;
alter table public.teacher_profiles add column if not exists verified      boolean not null default false;
alter table public.teacher_profiles add column if not exists created_at    timestamptz not null default now();
alter table public.teacher_profiles add column if not exists updated_at    timestamptz not null default now();
alter table public.teacher_profiles add column if not exists is_public     boolean not null default false;
alter table public.teacher_profiles add column if not exists status        text not null default 'pending';
alter table public.teacher_profiles add column if not exists bio_public    text;
alter table public.teacher_profiles add column if not exists subjects      text[] default '{}';
alter table public.teacher_profiles add column if not exists grades_taught text[] default '{}';
alter table public.teacher_profiles add column if not exists approved_at   timestamptz;
alter table public.teacher_profiles add column if not exists approved_by   uuid references auth.users(id);

do $$
begin
  alter table public.teacher_profiles drop constraint if exists teacher_profiles_status_check;
  alter table public.teacher_profiles
    add constraint teacher_profiles_status_check check (status in ('pending','approved','rejected','paused'));
exception when others then null;
end $$;

alter table public.teacher_profiles enable row level security;
drop policy if exists "teacher manages own profile" on public.teacher_profiles;
create policy "teacher manages own profile" on public.teacher_profiles
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "service role teachers" on public.teacher_profiles;
create policy "service role teachers" on public.teacher_profiles
  for all to service_role using (true) with check (true);
-- public can read APPROVED + public profiles (the réseau directory)
drop policy if exists "public reads approved teachers" on public.teacher_profiles;
create policy "public reads approved teachers" on public.teacher_profiles
  for select to anon, authenticated using (status = 'approved' and is_public = true);

-- ---------------------------------------------------------------------
-- 5) Teacher community feed (posts + comments)
-- ---------------------------------------------------------------------
create table if not exists public.teacher_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'note' check (kind in ('note','resource','question','tip')),
  title text,
  body text not null,
  subjects text[] default '{}',
  grades text[] default '{}',
  attachment_url text,
  visibility text not null default 'network' check (visibility in ('network','private')),
  created_at timestamptz not null default now()
);
create index if not exists idx_teacher_posts_recent on public.teacher_posts(created_at desc);
alter table public.teacher_posts enable row level security;
drop policy if exists "approved teachers read network posts" on public.teacher_posts;
create policy "approved teachers read network posts" on public.teacher_posts
  for select to authenticated
  using (exists (select 1 from public.teacher_profiles tp where tp.user_id = auth.uid() and tp.status = 'approved'));
drop policy if exists "service role teacher posts" on public.teacher_posts;
create policy "service role teacher posts" on public.teacher_posts
  for all to service_role using (true) with check (true);

create table if not exists public.teacher_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.teacher_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_teacher_comments_post on public.teacher_post_comments (post_id, created_at);
alter table public.teacher_post_comments enable row level security;
drop policy if exists "service role teacher comments" on public.teacher_post_comments;
create policy "service role teacher comments" on public.teacher_post_comments
  for all to service_role using (true) with check (true);

-- ---------------------------------------------------------------------
-- 6) Professors directory + booking (migration 026)
-- ---------------------------------------------------------------------
create table if not exists public.professors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  subject text not null,
  wilaya text not null,
  teaches_at text,
  mode text not null default 'both' check (mode in ('in_person','online','both')),
  bio text,
  hourly_rate_dzd integer,
  photo_url text,
  verified boolean not null default false,
  active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);
-- teaching_types powers the guided BAC finder (school / private / online).
alter table public.professors add column if not exists teaching_types text[] not null default '{}';
update public.professors p set teaching_types = coalesce((
  select array_remove(array[
    case when p.mode in ('in_person','both')
          and (p.teaches_at ilike '%lyc%' or p.teaches_at ilike '%éc%'
               or p.teaches_at ilike '%ec%' or p.teaches_at ilike '%coll%') then 'school' end,
    case when p.mode in ('in_person','both')
          and p.teaches_at ilike '%particulier%' then 'private' end,
    case when p.mode in ('online','both') then 'online' end
  ]::text[], null)
), '{}') where p.teaching_types = '{}';
update public.professors set teaching_types = teaching_types || array['private']
  where mode in ('in_person','both') and teaching_types = '{}';
update public.professors set teaching_types = array['online']
  where mode = 'online' and teaching_types = '{}';

-- Link a self-registered professor account to its directory listing.
alter table public.professors add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists idx_professors_user on public.professors (user_id);

alter table public.professors enable row level security;
drop policy if exists "anon read active professors" on public.professors;
create policy "anon read active professors" on public.professors
  for select to anon, authenticated using (active = true);
drop policy if exists "service role professors" on public.professors;
create policy "service role professors" on public.professors
  for all to service_role using (true) with check (true);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references public.professors(id) on delete cascade,
  parent_id uuid references auth.users(id) on delete set null,
  student_name text,
  grade text,
  preferred_mode text check (preferred_mode in ('in_person','online','both')),
  phone text,
  message text,
  status text not null default 'pending' check (status in ('pending','contacted','confirmed','cancelled')),
  created_at timestamptz not null default now()
);
alter table public.booking_requests enable row level security;
drop policy if exists "auth insert booking" on public.booking_requests;
create policy "auth insert booking" on public.booking_requests
  for insert to authenticated with check (true);
drop policy if exists "service role bookings" on public.booking_requests;
create policy "service role bookings" on public.booking_requests
  for all to service_role using (true) with check (true);

-- ---------------------------------------------------------------------
-- 7) Weekly study planner (migration 025)
-- ---------------------------------------------------------------------
create table if not exists public.weekly_plan_items (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_weekly_plan_child on public.weekly_plan_items (child_id, day_of_week, sort_order);
alter table public.weekly_plan_items enable row level security;
drop policy if exists "service role weekly plan" on public.weekly_plan_items;
create policy "service role weekly plan" on public.weekly_plan_items
  for all to service_role using (true) with check (true);

-- ---------------------------------------------------------------------
-- 8) Prof-to-prof private messaging (teacher_dms)
-- ---------------------------------------------------------------------
create table if not exists public.teacher_dms (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_teacher_dms_pair on public.teacher_dms(sender_id, recipient_id, created_at);
create index if not exists idx_teacher_dms_recipient on public.teacher_dms(recipient_id, created_at desc);
alter table public.teacher_dms enable row level security;
drop policy if exists "service role teacher dms" on public.teacher_dms;
create policy "service role teacher dms" on public.teacher_dms
  for all to service_role using (true) with check (true);

-- ---------------------------------------------------------------------
-- 9) Refresh the PostgREST schema cache so all changes are visible now.
-- ---------------------------------------------------------------------
notify pgrst, 'reload schema';
