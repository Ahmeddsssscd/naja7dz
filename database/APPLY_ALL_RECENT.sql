-- ===============================================================================
-- APPLY_ALL_RECENT.sql
--
-- One-shot idempotent migration bundle covering everything added since
-- migration 010 (daily streak). Paste this whole file into your Supabase
-- SQL Editor and click Run. It's safe to run multiple times — every
-- statement uses IF NOT EXISTS / IF EXISTS guards, and policies are
-- dropped + recreated atomically.
--
-- Includes:
--   010 — Daily streak (children.current_streak, longest_streak, last_activity_date + RPC)
--   011 — Fac service requests (orientation/dossier/memoire/bourse)
--   012 — Parent questions ("comment expliquer X à un Y")
--   013 — Teacher mode (teacher_profiles + classes + class_students)
--   014 — School quote requests (Pack École quotes from /ecole form)
--   015 — Marketplace (helper_profiles + service_requests + chat_threads
--                       + chat_messages — the /fac/aide marketplace)
--   016 — Teacher network (teacher_profiles extensions + teacher_posts
--                          + teacher_dms)
--
-- Source files are in database/migrations/ for reference and version
-- control. This consolidated file is the operational one — apply it,
-- then mark the project's "schema version" as 016.
-- ===============================================================================

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 010 — DAILY STREAK                                                         ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

alter table public.children
  add column if not exists current_streak int not null default 0,
  add column if not exists longest_streak int not null default 0,
  add column if not exists last_activity_date date;

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
   where id = p_child_id
   for update;

  if not found then
    return;
  end if;

  if v_last = v_today then
    v_new_curr := v_curr;
  elsif v_last = v_today - 1 then
    v_new_curr := coalesce(v_curr, 0) + 1;
  else
    v_new_curr := 1;
  end if;

  update public.children
     set current_streak = v_new_curr,
         longest_streak = greatest(coalesce(v_long, 0), v_new_curr),
         last_activity_date = v_today
   where id = p_child_id;

  return query select v_new_curr, greatest(coalesce(v_long, 0), v_new_curr);
end;
$$;

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 011 — FAC SERVICE REQUESTS                                                 ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

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

alter table public.fac_service_requests enable row level security;
drop policy if exists "user reads own requests" on public.fac_service_requests;
create policy "user reads own requests" on public.fac_service_requests
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "user inserts own requests" on public.fac_service_requests;
create policy "user inserts own requests" on public.fac_service_requests
  for insert to authenticated with check (user_id = auth.uid());

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 012 — PARENT QUESTIONS                                                     ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

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

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 013 — TEACHER MODE (profiles, classes, class_students)                     ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.teacher_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  school_name  text,
  wilaya       text,
  phone        text,
  bio          text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.teacher_classes (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  grade        text not null,
  school_year  text not null default '2025-2026',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_teacher_classes_teacher
  on public.teacher_classes(teacher_id, created_at desc);

create table if not exists public.class_students (
  id           uuid primary key default gen_random_uuid(),
  class_id     uuid not null references public.teacher_classes(id) on delete cascade,
  full_name    text not null,
  numero       text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_class_students_class
  on public.class_students(class_id, full_name);

alter table public.teacher_profiles enable row level security;
alter table public.teacher_classes enable row level security;
alter table public.class_students enable row level security;

drop policy if exists "teacher reads own profile" on public.teacher_profiles;
create policy "teacher reads own profile" on public.teacher_profiles
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "teacher upserts own profile" on public.teacher_profiles;
create policy "teacher upserts own profile" on public.teacher_profiles
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "teacher updates own profile" on public.teacher_profiles;
create policy "teacher updates own profile" on public.teacher_profiles
  for update to authenticated using (user_id = auth.uid());

drop policy if exists "teacher reads own classes" on public.teacher_classes;
create policy "teacher reads own classes" on public.teacher_classes
  for select to authenticated using (teacher_id = auth.uid());
drop policy if exists "teacher inserts own classes" on public.teacher_classes;
create policy "teacher inserts own classes" on public.teacher_classes
  for insert to authenticated with check (teacher_id = auth.uid());
drop policy if exists "teacher updates own classes" on public.teacher_classes;
create policy "teacher updates own classes" on public.teacher_classes
  for update to authenticated using (teacher_id = auth.uid());
drop policy if exists "teacher deletes own classes" on public.teacher_classes;
create policy "teacher deletes own classes" on public.teacher_classes
  for delete to authenticated using (teacher_id = auth.uid());

drop policy if exists "teacher reads own students" on public.class_students;
create policy "teacher reads own students" on public.class_students
  for select to authenticated
  using (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()));
drop policy if exists "teacher inserts own students" on public.class_students;
create policy "teacher inserts own students" on public.class_students
  for insert to authenticated
  with check (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()));
drop policy if exists "teacher deletes own students" on public.class_students;
create policy "teacher deletes own students" on public.class_students
  for delete to authenticated
  using (class_id in (select id from public.teacher_classes where teacher_id = auth.uid()));

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 014 — SCHOOL QUOTE REQUESTS (/ecole form)                                   ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

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

alter table public.school_quote_requests enable row level security;
drop policy if exists "anyone can submit a quote request" on public.school_quote_requests;
create policy "anyone can submit a quote request" on public.school_quote_requests
  for insert to anon, authenticated
  with check (true);

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 015 — MARKETPLACE (helpers + requests + chat threads/messages)             ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

create table if not exists public.helper_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  display_name    text not null check (length(display_name) >= 2),
  last_initial    text,
  helper_type     text not null check (helper_type in ('student', 'pro')),
  university_slug text,
  study_year      int,
  field           text,
  profession      text,
  experience_years int,
  services        text[] default '{}',
  bio             text,
  hourly_rate_da  int,
  responds_within text,
  photo_url       text,
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

create table if not exists public.service_requests (
  id              uuid primary key default gen_random_uuid(),
  buyer_id        uuid not null references auth.users(id) on delete cascade,
  helper_id       uuid not null references public.helper_profiles(id) on delete cascade,
  flow            text not null check (flow in ('ask_student', 'negotiate')),
  price_da        int,
  subscriber_discount_applied boolean default false,
  status          text not null default 'open'
    check (status in ('open', 'paid', 'completed', 'cancelled', 'refunded')),
  brief           text,
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

create table if not exists public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references public.chat_threads(id) on delete cascade,
  sender_id       uuid not null references auth.users(id) on delete cascade,
  kind            text not null default 'text'
    check (kind in ('text', 'price', 'pay', 'system')),
  body            text not null,
  created_at      timestamptz not null default now()
);
create index if not exists idx_chat_messages_thread
  on public.chat_messages(thread_id, created_at);

alter table public.helper_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

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

drop policy if exists "thread parties read" on public.chat_threads;
create policy "thread parties read" on public.chat_threads
  for select to authenticated
  using (buyer_id = auth.uid() or helper_user_id = auth.uid());

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

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║ 016 — TEACHER NETWORK (teacher_profiles ext + posts + DMs)                 ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

alter table public.teacher_profiles
  add column if not exists is_public boolean not null default false,
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused')),
  add column if not exists bio_public text,
  add column if not exists subjects text[] default '{}',
  add column if not exists grades_taught text[] default '{}',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id);

create index if not exists idx_teacher_profiles_status
  on public.teacher_profiles(status, is_public);

create table if not exists public.teacher_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references auth.users(id) on delete cascade,
  kind        text not null default 'note'
    check (kind in ('note', 'resource', 'question', 'tip')),
  title       text,
  body        text not null,
  subjects    text[] default '{}',
  grades      text[] default '{}',
  attachment_url text,
  visibility  text not null default 'network' check (visibility in ('network', 'private')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_teacher_posts_recent
  on public.teacher_posts(created_at desc);
create index if not exists idx_teacher_posts_author
  on public.teacher_posts(author_id, created_at desc);

create table if not exists public.teacher_dms (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists idx_teacher_dms_pair
  on public.teacher_dms(sender_id, recipient_id, created_at);
create index if not exists idx_teacher_dms_recipient
  on public.teacher_dms(recipient_id, created_at desc);

alter table public.teacher_posts enable row level security;
alter table public.teacher_dms enable row level security;

drop policy if exists "approved teachers read network posts" on public.teacher_posts;
create policy "approved teachers read network posts" on public.teacher_posts
  for select to authenticated
  using (
    visibility = 'network'
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
  );
drop policy if exists "approved teacher inserts post" on public.teacher_posts;
create policy "approved teacher inserts post" on public.teacher_posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
  );

drop policy if exists "dm parties read" on public.teacher_dms;
create policy "dm parties read" on public.teacher_dms
  for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());
drop policy if exists "approved teacher sends dm" on public.teacher_dms;
create policy "approved teacher sends dm" on public.teacher_dms
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and status = 'approved'
    )
    and exists (
      select 1 from public.teacher_profiles
      where user_id = recipient_id and status = 'approved'
    )
  );

drop policy if exists "anyone reads approved teacher profiles" on public.teacher_profiles;
create policy "anyone reads approved teacher profiles" on public.teacher_profiles
  for select to anon, authenticated
  using (status = 'approved' and is_public = true);

-- ===============================================================================
-- DONE. If the run completes without errors you're at schema version 016.
-- ===============================================================================
