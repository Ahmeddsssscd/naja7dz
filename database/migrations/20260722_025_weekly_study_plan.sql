-- ===============================================================
-- Migration: 20260722_025_weekly_study_plan
--
-- Weekly study planner. A student drags chapters of their grade onto days
-- of the week and ticks them off as they go. Each item points at a chapter
-- (module) so the student can jump straight into its lesson + quiz.
--
-- day_of_week: 0 = Samedi … 6 = Vendredi (Algerian week starts Saturday).
-- Idempotent.
-- ===============================================================

create table if not exists public.weekly_plan_items (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_weekly_plan_child
  on public.weekly_plan_items (child_id, day_of_week, sort_order);

alter table public.weekly_plan_items enable row level security;

-- Service role only (all access goes through /api/plan after verifying the
-- child belongs to the authenticated parent).
drop policy if exists "service role weekly plan" on public.weekly_plan_items;
create policy "service role weekly plan"
  on public.weekly_plan_items for all to service_role
  using (true) with check (true);

comment on table public.weekly_plan_items is
  'Student weekly study plan: chapters scheduled per day of week, tickable.';
