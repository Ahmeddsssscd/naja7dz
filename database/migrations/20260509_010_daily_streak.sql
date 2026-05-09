-- ===============================================================
-- Migration: 20260509_010_daily_streak
-- Adds daily streak tracking to children — 🔥 X jours counter on /eleve home.
-- Increments by 1 if the child does any quiz/activity on a calendar day,
-- resets to 0 if they skip a day.
-- ===============================================================

alter table public.children
  add column if not exists current_streak int not null default 0,
  add column if not exists longest_streak int not null default 0,
  add column if not exists last_activity_date date;

-- Helper RPC: idempotent — call it whenever a quiz is completed or an
-- activity is logged. It bumps the streak iff this is a new calendar day,
-- resets to 1 if there was a gap, and tracks longest_streak.
create or replace function public.bump_child_streak(p_child_id uuid)
returns table (out_streak int, out_longest int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Africa/Algiers')::date;
  v_last  date;
  v_curr  int;
  v_long  int;
  v_new_curr int;
begin
  select last_activity_date, current_streak, longest_streak
    into v_last, v_curr, v_long
  from public.children
  where id = p_child_id;

  if not found then
    return; -- no row, no-op
  end if;

  if v_last is null or v_last < v_today - interval '1 day' then
    -- First activity ever, OR a gap of 2+ days → reset to 1.
    v_new_curr := 1;
  elsif v_last = v_today then
    -- Already counted today — nothing to do.
    v_new_curr := v_curr;
  else
    -- v_last = yesterday → increment.
    v_new_curr := v_curr + 1;
  end if;

  v_long := greatest(coalesce(v_long, 0), v_new_curr);

  update public.children
    set current_streak = v_new_curr,
        longest_streak = v_long,
        last_activity_date = v_today
  where id = p_child_id;

  return query select v_new_curr, v_long;
end
$$;
