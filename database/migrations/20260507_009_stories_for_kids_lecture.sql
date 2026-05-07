-- ===============================================================
-- Migration: 20260507_009_stories_for_kids_lecture
-- Purpose: short reading content for /petits/lecture ("Lis avec moi")
-- Each story has bilingual paragraphs and a difficulty hint so we can
-- show age-appropriate items.
-- ===============================================================

create table if not exists public.stories (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_fr        text not null,
  title_ar        text not null,
  cover_emoji     text default '📖',
  difficulty      text not null default 'easy' check (difficulty in ('easy','medium','hard')),
  -- Story body as ordered paragraphs in each language. JSON array of strings.
  paragraphs_fr   jsonb not null default '[]'::jsonb,
  paragraphs_ar   jsonb not null default '[]'::jsonb,
  reading_minutes int default 3,
  active          boolean not null default true,
  sort_order      int default 0,
  created_at      timestamptz not null default now()
);

create index if not exists stories_active_sort_idx on public.stories (active, sort_order);

alter table public.stories enable row level security;

-- Anyone authenticated can read active stories; admin gating happens at
-- the app layer for editing.
drop policy if exists "auth reads active stories" on public.stories;
create policy "auth reads active stories"
  on public.stories for select
  using (auth.role() = 'authenticated' and active = true);

drop policy if exists "service role full access stories" on public.stories;
create policy "service role full access stories"
  on public.stories for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
