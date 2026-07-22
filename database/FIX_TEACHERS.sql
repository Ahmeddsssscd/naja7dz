-- =====================================================================
-- FIX_TEACHERS.sql  (v2 — column-safe)
--
-- Root cause: an older teacher_profiles table exists with different
-- columns (e.g. "school" instead of "school_name"). CREATE TABLE IF NOT
-- EXISTS can't fix that, so this script ALTERs the table to add every
-- column the app needs. Fully idempotent — safe to run again.
-- =====================================================================

-- 1) Make sure the table exists at all (no-op if it already does).
create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

-- 2) Add EVERY column the app reads/writes. add column if not exists is
--    idempotent and DOES patch a pre-existing table (unlike create table).
alter table public.teacher_profiles add column if not exists full_name    text;
alter table public.teacher_profiles add column if not exists school_name  text;
alter table public.teacher_profiles add column if not exists wilaya       text;
alter table public.teacher_profiles add column if not exists phone        text;
alter table public.teacher_profiles add column if not exists bio          text;
alter table public.teacher_profiles add column if not exists verified     boolean not null default false;
alter table public.teacher_profiles add column if not exists created_at   timestamptz not null default now();
alter table public.teacher_profiles add column if not exists updated_at   timestamptz not null default now();

-- Community / réseau columns (migration 016).
alter table public.teacher_profiles add column if not exists is_public    boolean not null default false;
alter table public.teacher_profiles add column if not exists status       text not null default 'pending';
alter table public.teacher_profiles add column if not exists bio_public   text;
alter table public.teacher_profiles add column if not exists subjects     text[] default '{}';
alter table public.teacher_profiles add column if not exists grades_taught text[] default '{}';
alter table public.teacher_profiles add column if not exists approved_at  timestamptz;
alter table public.teacher_profiles add column if not exists approved_by  uuid references auth.users(id);

-- status must accept the 4 states used by the approval flow.
do $$
begin
  alter table public.teacher_profiles drop constraint if exists teacher_profiles_status_check;
  alter table public.teacher_profiles
    add constraint teacher_profiles_status_check
    check (status in ('pending','approved','rejected','paused'));
exception when others then null;
end $$;

-- 3) Row-level security: the teacher can INSERT/UPDATE/READ their own row.
--    (The old SETUP.sql only had select+update policies — no insert — which
--    would also block "add teacher". This FOR ALL policy covers all three.)
alter table public.teacher_profiles enable row level security;

drop policy if exists "teacher manages own profile" on public.teacher_profiles;
create policy "teacher manages own profile" on public.teacher_profiles
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "service role teachers" on public.teacher_profiles;
create policy "service role teachers" on public.teacher_profiles
  for all to service_role using (true) with check (true);

-- 4) Community feed tables (posts + comments) so /enseignant/communaute works.
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

-- 5) Refresh the PostgREST schema cache so the new columns are visible now.
notify pgrst, 'reload schema';
