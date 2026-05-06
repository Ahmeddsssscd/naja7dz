-- ===============================================================
-- Migration: 20260505_002_payments_subscriptions
-- Purpose:  Tables for Chargily checkout sessions, payments, and subscriptions
-- Apply:    Paste into Supabase → SQL Editor → Run
-- ===============================================================

-- ===== Plans (catalog) =====
create table if not exists public.plans (
  id text primary key,             -- 'eleve_monthly', 'famille_annual', 'pack_bac', etc.
  name_fr text not null,
  name_ar text,
  amount_dzd integer not null,     -- price in DZD (no decimals — Chargily expects integers)
  period text not null check (period in ('monthly', 'annual', 'one_time')),
  description_fr text,
  description_ar text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed the 5 plans from spec (with both FR + AR descriptions for the AR locale)
insert into public.plans (id, name_fr, name_ar, amount_dzd, period, description_fr, description_ar) values
  ('eleve_monthly', 'Élève — Mensuel', 'تلميذ — شهري', 990, 'monthly',
    '1 enfant, toutes matières, accès complet',
    'طفل واحد، جميع المواد، وصول كامل'),
  ('eleve_annual', 'Élève — Annuel', 'تلميذ — سنوي', 7400, 'annual',
    '1 enfant, paiement annuel (-38%)',
    'طفل واحد، دفع سنوي (-38%)'),
  ('famille_monthly', 'Famille — Mensuel', 'عائلة — شهري', 1990, 'monthly',
    'Jusqu''à 4 enfants + espace parents complet',
    'حتى 4 أطفال + فضاء الآباء كامل'),
  ('famille_annual', 'Famille — Annuel', 'عائلة — سنوي', 14900, 'annual',
    'Jusqu''à 4 enfants, paiement annuel (-38%)',
    'حتى 4 أطفال، دفع سنوي (-38%)'),
  ('pack_bac', 'Pack Bac 90 jours', 'حزمة البكالوريا 90 يوم', 9000, 'one_time',
    'Programme intensif de préparation au Bac',
    'برنامج مكثف للتحضير للبكالوريا')
on conflict (id) do nothing;

-- ===== Checkout sessions (created when user clicks "Pay") =====
create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null references public.plans(id),
  email text not null,
  customer_name text,
  customer_phone text,
  amount_dzd integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  -- Chargily refs
  chargily_checkout_id text,
  chargily_payment_id text,
  -- Locale of the user when they checked out (so we know which language emails to send)
  locale text not null default 'fr' check (locale in ('fr', 'ar')),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_checkout_sessions_email on public.checkout_sessions (email);
create index if not exists idx_checkout_sessions_chargily_id on public.checkout_sessions (chargily_checkout_id);
create index if not exists idx_checkout_sessions_status_created on public.checkout_sessions (status, created_at desc);

-- ===== Webhook events log (audit trail of every Chargily event) =====
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,        -- 'checkout.paid', 'checkout.failed', etc.
  chargily_event_id text,
  payload jsonb not null,
  signature text,
  signature_valid boolean,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_payment_events_chargily_id
  on public.payment_events (chargily_event_id)
  where chargily_event_id is not null;

-- ===== RLS — locked down by default =====
alter table public.plans enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.payment_events enable row level security;

-- Plans: anyone can read the catalog (public product info)
-- idempotent guard for "anon can read active plans"
drop policy if exists "anon can read active plans" on public.plans;
create policy "anon can read active plans"
  on public.plans for select
  to anon, authenticated
  using (active = true);

-- Checkout sessions: only service_role can read/write (anon never touches them)
-- idempotent guard for "service role full access on checkouts"
drop policy if exists "service role full access on checkouts" on public.checkout_sessions;
create policy "service role full access on checkouts"
  on public.checkout_sessions for all
  to service_role
  using (true) with check (true);

-- Payment events: service_role only
-- idempotent guard for "service role full access on events"
drop policy if exists "service role full access on events" on public.payment_events;
create policy "service role full access on events"
  on public.payment_events for all
  to service_role
  using (true) with check (true);

-- ===== updated_at trigger for checkout_sessions =====
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_checkout_sessions_updated on public.checkout_sessions;
create trigger trg_checkout_sessions_updated
  before update on public.checkout_sessions
  for each row execute function public.set_updated_at();

comment on table public.plans is 'Subscription plan catalog. Source of truth for prices.';
comment on table public.checkout_sessions is 'One row per checkout attempt. Updated by Chargily webhook.';
comment on table public.payment_events is 'Audit log of every Chargily webhook received.';
