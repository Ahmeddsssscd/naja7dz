-- ===============================================================
-- Migration: 20260509_014_school_quote_requests
--
-- Pack École quote requests. Filled by /ecole quote form. Anonymous-
-- friendly (no auth.users FK) — schools shouldn't have to sign up to
-- get a price. RLS denies all SELECT to anon/auth — staff reads via
-- service-role from the admin tooling.
-- ===============================================================

create table if not exists public.school_quote_requests (
  id                    uuid primary key default gen_random_uuid(),
  school_name           text not null,
  contact_name          text,
  role                  text,
  email                 text not null,
  phone                 text,
  wilaya                text,
  student_count_bucket  text check (student_count_bucket is null or student_count_bucket in ('<100', '100-300', '300-600', '600-1000', '>1000')),
  levels                text[] default '{}',
  message               text,
  status                text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost', 'closed')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_school_quote_requests_status
  on public.school_quote_requests(status, created_at desc);

create index if not exists idx_school_quote_requests_email
  on public.school_quote_requests(email);

-- RLS — public can INSERT (anonymous quote form), but nobody reads via
-- the public client. Staff uses service-role key from the admin app.
alter table public.school_quote_requests enable row level security;

drop policy if exists "anyone can submit a quote request" on public.school_quote_requests;
create policy "anyone can submit a quote request" on public.school_quote_requests
  for insert to anon, authenticated
  with check (true);
