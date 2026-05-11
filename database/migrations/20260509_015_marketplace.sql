-- ===============================================================
-- Migration: 20260509_015_marketplace
--
-- Helper marketplace for the /fac (Université) section.
--
-- 4 tables:
--   1. helper_profiles    — public profile pages of students / professionals
--                            who offer paid help (orientation, mémoire, etc.).
--                            Admin-approved before going public.
--   2. service_requests    — a buyer (anyone signed-in) requests a service
--                            from a helper. Two flows:
--                              - "ask_student" : flat 400 DA fee, paid
--                                upfront, gives access to one Q&A thread.
--                              - "negotiate"   : free to open, price set
--                                inside chat by the helper, paid via a
--                                Chargily link the helper drops in chat.
--   3. chat_threads        — buyer ↔ helper conversation tied to a request.
--   4. chat_messages       — individual messages in a thread.
--
-- All tables have RLS. Helpers see their own profiles + their own requests
-- + the threads attached. Buyers see their own requests + their threads.
-- Admin reads everything via service-role.
-- ===============================================================

-- ===== 1. helper_profiles =====
create table if not exists public.helper_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,

  -- Identity
  display_name    text not null check (length(display_name) >= 2),
  -- For privacy: stored full name → on public pages we show "First L."
  last_initial    text,

  -- Helper type — "student" or "pro"
  helper_type     text not null check (helper_type in ('student', 'pro')),

  -- Student-specific
  university_slug text,    -- 'usthb', 'enp', 'ensia' etc. — joins to UNIVERSITIES catalogue
  study_year      int,     -- 1..7
  field           text,    -- 'informatique', 'medecine', etc.

  -- Pro-specific
  profession      text,    -- 'tutor_math', 'memoire_writer', etc.
  experience_years int,

  -- What they offer
  services        text[] default '{}', -- e.g. ['orientation','memoire','exercises']
  bio             text,
  hourly_rate_da  int,     -- optional indicative rate
  responds_within text,    -- '1h', '24h', etc.

  -- Photo
  photo_url       text,

  -- Approval gate
  status          text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused')),
  rejection_note  text,

  approved_at     timestamptz,
  approved_by     uuid references auth.users(id),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (user_id)
);

create index if not exists idx_helper_profiles_status
  on public.helper_profiles(status, created_at desc);
create index if not exists idx_helper_profiles_uni
  on public.helper_profiles(university_slug, status);
create index if not exists idx_helper_profiles_type
  on public.helper_profiles(helper_type, status);

-- ===== 2. service_requests =====
create table if not exists public.service_requests (
  id              uuid primary key default gen_random_uuid(),
  buyer_id        uuid not null references auth.users(id) on delete cascade,
  helper_id       uuid not null references public.helper_profiles(id) on delete cascade,

  -- Flow type
  flow            text not null check (flow in ('ask_student', 'negotiate')),

  -- For ask_student: fixed price (400 DA, may be discounted 50% for subscribers)
  -- For negotiate: NULL initially, set once helper proposes inside the chat
  price_da        int,
  subscriber_discount_applied boolean default false,

  -- Status machine:
  --  open       : request created, awaiting payment (ask_student) or
  --               waiting for price proposal (negotiate)
  --  paid       : buyer paid → chat unlocked
  --  completed  : helper marked the work done
  --  cancelled  : either side cancelled
  --  refunded   : admin manually refunded
  status          text not null default 'open'
    check (status in ('open', 'paid', 'completed', 'cancelled', 'refunded')),

  -- Free-text initial brief from the buyer
  brief           text,

  -- Chargily payment reference (filled when buyer paid)
  chargily_checkout_id  text,
  paid_at         timestamptz,
  completed_at    timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_service_requests_buyer
  on public.service_requests(buyer_id, created_at desc);
create index if not exists idx_service_requests_helper
  on public.service_requests(helper_id, created_at desc);
create index if not exists idx_service_requests_status
  on public.service_requests(status, created_at desc);

-- ===== 3. chat_threads =====
create table if not exists public.chat_threads (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.service_requests(id) on delete cascade,
  buyer_id        uuid not null references auth.users(id) on delete cascade,
  helper_user_id  uuid not null references auth.users(id) on delete cascade,

  last_message_at timestamptz not null default now(),
  buyer_unread    int not null default 0,
  helper_unread   int not null default 0,

  created_at      timestamptz not null default now(),

  unique (request_id)
);

create index if not exists idx_chat_threads_buyer
  on public.chat_threads(buyer_id, last_message_at desc);
create index if not exists idx_chat_threads_helper
  on public.chat_threads(helper_user_id, last_message_at desc);

-- ===== 4. chat_messages =====
create table if not exists public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references public.chat_threads(id) on delete cascade,
  sender_id       uuid not null references auth.users(id) on delete cascade,

  -- Message kind:
  --  text   : regular text body
  --  price  : helper proposes a price (body is JSON {amount:int, note:string})
  --  pay    : auto-system message confirming payment received
  --  system : misc system notice
  kind            text not null default 'text'
    check (kind in ('text', 'price', 'pay', 'system')),
  body            text not null,

  created_at      timestamptz not null default now()
);

create index if not exists idx_chat_messages_thread
  on public.chat_messages(thread_id, created_at);

-- ===== RLS =====
alter table public.helper_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- helper_profiles: public can read approved profiles; owner reads own;
-- owner inserts own; owner can update own (pre-approval edits).
drop policy if exists "anyone reads approved helper profiles" on public.helper_profiles;
create policy "anyone reads approved helper profiles" on public.helper_profiles
  for select to anon, authenticated using (status = 'approved');

drop policy if exists "owner reads own profile" on public.helper_profiles;
create policy "owner reads own profile" on public.helper_profiles
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "owner inserts own profile" on public.helper_profiles;
create policy "owner inserts own profile" on public.helper_profiles
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "owner updates own profile" on public.helper_profiles;
create policy "owner updates own profile" on public.helper_profiles
  for update to authenticated using (user_id = auth.uid());

-- service_requests: buyer + helper see their rows; buyer inserts.
drop policy if exists "request parties read" on public.service_requests;
create policy "request parties read" on public.service_requests
  for select to authenticated
  using (
    buyer_id = auth.uid()
    or helper_id in (select id from public.helper_profiles where user_id = auth.uid())
  );

drop policy if exists "buyer inserts request" on public.service_requests;
create policy "buyer inserts request" on public.service_requests
  for insert to authenticated with check (buyer_id = auth.uid());

-- chat_threads: buyer + helper read; system inserts via service-role.
drop policy if exists "thread parties read" on public.chat_threads;
create policy "thread parties read" on public.chat_threads
  for select to authenticated
  using (buyer_id = auth.uid() or helper_user_id = auth.uid());

-- chat_messages: thread parties read; sender inserts.
drop policy if exists "thread parties read messages" on public.chat_messages;
create policy "thread parties read messages" on public.chat_messages
  for select to authenticated
  using (
    thread_id in (
      select id from public.chat_threads
      where buyer_id = auth.uid() or helper_user_id = auth.uid()
    )
  );

drop policy if exists "thread party sends message" on public.chat_messages;
create policy "thread party sends message" on public.chat_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and thread_id in (
      select id from public.chat_threads
      where buyer_id = auth.uid() or helper_user_id = auth.uid()
    )
  );
