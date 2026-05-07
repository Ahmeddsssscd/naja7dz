-- ===============================================================
-- Migration: 20260507_008_idempotent_activate_rpc
-- Fixes: activate_subscription_from_checkout was incrementing expiry
-- on every call. Each call should be a no-op if THIS specific checkout
-- has already been activated.
-- ===============================================================

create or replace function public.activate_subscription_from_checkout(p_checkout_id uuid)
returns table (out_user_id uuid, out_plan_id text, out_expires_at timestamptz)
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
  v_current_last_checkout uuid;
  v_current_plan text;
  v_current_expires timestamptz;
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

  -- If user_id wasn't set, resolve from email.
  if v_user_id is null and v_email is not null then
    select id into v_user_id from auth.users where lower(email) = lower(v_email) limit 1;
    if v_user_id is not null then
      update public.checkout_sessions set user_id = v_user_id where id = p_checkout_id;
    end if;
  end if;

  if v_user_id is null then
    return;
  end if;

  -- IDEMPOTENCY GUARD: if this exact checkout has already been activated for
  -- this user, return the existing state without modifying.
  select s.last_checkout_id, s.plan_id, s.expires_at
    into v_current_last_checkout, v_current_plan, v_current_expires
  from public.subscriptions s
  where s.user_id = v_user_id;

  if v_current_last_checkout = p_checkout_id then
    return query select v_user_id, v_current_plan, v_current_expires;
    return;
  end if;

  -- New activation (or extension via a NEW checkout). Compute expiry: extend
  -- if user already has an active sub, otherwise start from now.
  if v_current_expires is null or v_current_expires < now() then
    v_expires := now() + make_interval(days => v_duration);
  else
    v_expires := v_current_expires + make_interval(days => v_duration);
  end if;

  insert into public.subscriptions (user_id, plan_id, status, started_at, expires_at, last_checkout_id)
  values (v_user_id, v_plan_id, 'active', now(), v_expires, p_checkout_id)
  on conflict (user_id) do update
    set plan_id          = excluded.plan_id,
        status           = 'active',
        expires_at       = excluded.expires_at,
        last_checkout_id = excluded.last_checkout_id;

  return query select v_user_id, v_plan_id, v_expires;
end
$$;
