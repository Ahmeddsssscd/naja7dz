-- ===============================================================
-- Migration: 20260509_011_fac_service_requests
-- Stores Faculté section service-request submissions from logged-in users.
--
-- Plain table (no RLS by default — staff inbox app handles access).
-- ===============================================================

create table if not exists public.fac_service_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  email        text,
  service      text not null check (service in ('orientation', 'dossier', 'memoire', 'bourse', 'autre')),
  details      text not null,
  phone        text,
  status       text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_fac_service_requests_user
  on public.fac_service_requests(user_id, created_at desc);

create index if not exists idx_fac_service_requests_status
  on public.fac_service_requests(status, created_at desc);

-- RLS: user can read their own requests; only service_role inserts/updates.
alter table public.fac_service_requests enable row level security;

drop policy if exists "user reads own requests" on public.fac_service_requests;
create policy "user reads own requests" on public.fac_service_requests
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "user inserts own requests" on public.fac_service_requests;
create policy "user inserts own requests" on public.fac_service_requests
  for insert to authenticated
  with check (user_id = auth.uid());
