-- ===============================================================
-- Migration: 20260723_029_professor_accounts
--
-- Links a self-registered professor account (auth user) to their public
-- directory listing, so their message center can show the student booking
-- requests addressed to them. Prof-to-prof DMs reuse teacher_dms (016).
-- Idempotent.
-- ===============================================================

-- A directory listing can belong to a registered professor account.
alter table public.professors
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_professors_user on public.professors (user_id);

-- Make sure teacher_dms exists (prof-to-prof private messaging).
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

notify pgrst, 'reload schema';
