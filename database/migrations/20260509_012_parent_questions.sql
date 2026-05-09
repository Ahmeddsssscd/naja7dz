-- ===============================================================
-- Migration: 20260509_012_parent_questions
-- "Mode questions du parent" storage. Each row is a question + the
-- template reply we returned + status so a tutor can follow up.
-- ===============================================================

create table if not exists public.parent_questions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  question    text not null,
  grade       text,
  subject_fr  text,
  subject_ar  text,
  reply       jsonb,
  status      text not null default 'answered_template' check (status in ('answered_template', 'tutor_pending', 'tutor_replied')),
  tutor_reply text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_parent_questions_user
  on public.parent_questions(user_id, created_at desc);

create index if not exists idx_parent_questions_status
  on public.parent_questions(status, created_at desc);

alter table public.parent_questions enable row level security;

drop policy if exists "user reads own questions" on public.parent_questions;
create policy "user reads own questions" on public.parent_questions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "user inserts own questions" on public.parent_questions;
create policy "user inserts own questions" on public.parent_questions
  for insert to authenticated with check (user_id = auth.uid());
