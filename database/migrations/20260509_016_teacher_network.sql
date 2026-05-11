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
  -- Visibility — for now always 'network' (other approved teachers)
  visibility  text not null default 'network' check (visibility in ('network', 'private')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_teacher_posts_recent
  on public.teacher_posts(created_at desc);
create index if not exists idx_teacher_posts_author
  on public.teacher_posts(author_id, created_at desc);

-- ===== teacher_dms =====
-- Two approved teachers can message each other. Simple flat table — one
-- row per message — no separate "thread" table; we group client-side by
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
-- (Update existing policies — drop old, recreate.)
drop policy if exists "anyone reads approved teacher profiles" on public.teacher_profiles;
create policy "anyone reads approved teacher profiles" on public.teacher_profiles
  for select to anon, authenticated
  using (status = 'approved' and is_public = true);
