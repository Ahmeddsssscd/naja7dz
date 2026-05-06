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
