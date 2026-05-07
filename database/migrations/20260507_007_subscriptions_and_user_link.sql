-- ===============================================================
-- Migration: 20260507_007_subscriptions_and_user_link
-- Adds:
--   1. checkout_sessions.user_id  (link payments to auth users)
--   2. subscriptions table        (active plan + expiry per user)
--   3. plans.tier + plans.duration_days (access-control + auto-expiry)
--   4. RPC: activate_subscription_from_checkout(checkout_id) — atomic
--      function used by webhook + post-payment recovery
-- ===============================================================

-- ===== 1. Link checkouts to users =====
alter table public.checkout_sessions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_checkout_sessions_user_id
  on public.checkout_sessions (user_id, created_at desc);

-- ===== 2. plans: add tier (full vs bac-only) and duration =====
alter table public.plans
  add column if not exists tier text not null default 'full'
    check (tier in ('full', 'bac_only'));
alter table public.plans
  add column if not exists duration_days integer not null default 30;

-- Seed correct durations + tier on existing plans.
update public.plans set duration_days = 30,  tier = 'full'     where id = 'eleve_monthly';
update public.plans set duration_days = 365, tier = 'full'     where id = 'eleve_annual';
update public.plans set duration_days = 30,  tier = 'full'     where id = 'famille_monthly';
update public.plans set duration_days = 365, tier = 'full'     where id = 'famille_annual';
update public.plans set duration_days = 90,  tier = 'bac_only' where id = 'pack_bac';

-- ===== 3. Subscriptions =====
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_checkout_id uuid references public.checkout_sessions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_status_expires
  on public.subscriptions (status, expires_at);

alter table public.subscriptions enable row level security;

-- Each user reads their own subscription.
drop policy if exists "user reads own subscription" on public.subscriptions;
create policy "user reads own subscription"
  on public.subscriptions for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "service role full access on subscriptions" on public.subscriptions;
create policy "service role full access on subscriptions"
  on public.subscriptions for all to service_role
  using (true) with check (true);

drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

comment on table public.subscriptions is
  'Active plan per user. One row per user. Updated by webhook on checkout.paid.';

-- ===== 4. RPC: activate subscription from a paid checkout =====
-- Idempotent: if user already has an active sub, extends it; otherwise creates.
-- Called from the webhook AND from /checkout/success as a recovery path
-- in case the webhook didn't fire yet.
create or replace function public.activate_subscription_from_checkout(p_checkout_id uuid)
returns table (user_id uuid, plan_id text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_email text;
  v_plan_id text;
  v_duration int;
  v_status text;
  v_expires timestamptz;
begin
  -- Pull the checkout. Must be paid.
  select cs.user_id, cs.email, cs.plan_id, cs.status, p.duration_days
    into v_user_id, v_email, v_plan_id, v_status, v_duration
  from public.checkout_sessions cs
  join public.plans p on p.id = cs.plan_id
  where cs.id = p_checkout_id;

  if not found or v_status <> 'paid' then
    return;
  end if;

  -- If user_id wasn't set on the checkout, try to resolve from email.
  if v_user_id is null and v_email is not null then
    select id into v_user_id from auth.users where lower(email) = lower(v_email) limit 1;
    if v_user_id is not null then
      update public.checkout_sessions set user_id = v_user_id where id = p_checkout_id;
    end if;
  end if;

  if v_user_id is null then
    return;
  end if;

  -- Compute new expiry. If user has a subscription extending into the future,
  -- add the new duration on top; otherwise start from now.
  select s.expires_at into v_expires from public.subscriptions s where s.user_id = v_user_id;
  if v_expires is null or v_expires < now() then
    v_expires := now() + make_interval(days => v_duration);
  else
    v_expires := v_expires + make_interval(days => v_duration);
  end if;

  insert into public.subscriptions (user_id, plan_id, status, started_at, expires_at, last_checkout_id)
  values (v_user_id, v_plan_id, 'active', now(), v_expires, p_checkout_id)
  on conflict (user_id) do update
    set plan_id          = excluded.plan_id,
        status           = 'active',
        expires_at       = excluded.expires_at,
        last_checkout_id = excluded.last_checkout_id;

  return query
    select v_user_id, v_plan_id, v_expires;
end
$$;

revoke all on function public.activate_subscription_from_checkout(uuid) from public;
grant execute on function public.activate_subscription_from_checkout(uuid) to service_role;

comment on function public.activate_subscription_from_checkout(uuid) is
  'Idempotent activation. Webhook calls this on checkout.paid. /checkout/success calls it as recovery if the webhook is delayed.';
