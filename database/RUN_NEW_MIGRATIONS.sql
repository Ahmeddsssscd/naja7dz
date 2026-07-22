-- ===== FILE: 20260722_024_kids_universe_optin.sql =====
-- ===============================================================
-- Migration: 20260722_024_kids_universe_optin
--
-- Kids Universe becomes opt-in. By default every child â€” including
-- primary-school pupils â€” lands on the age-appropriate academic space
-- (/eleve: lessons, quizzes, their year's program). A parent can turn the
-- playful "Kids Universe" (/petits games) ON per child when they want it.
--
-- Idempotent.
-- ===============================================================

alter table public.children
  add column if not exists kids_universe_enabled boolean not null default false;

comment on column public.children.kids_universe_enabled is
  'When true, this child may access /petits (Kids Universe games). Off by '
  'default so primary pupils see age-appropriate academic content first.';


-- ===== FILE: 20260722_025_weekly_study_plan.sql =====
-- ===============================================================
-- Migration: 20260722_025_weekly_study_plan
--
-- Weekly study planner. A student drags chapters of their grade onto days
-- of the week and ticks them off as they go. Each item points at a chapter
-- (module) so the student can jump straight into its lesson + quiz.
--
-- day_of_week: 0 = Samedi â€¦ 6 = Vendredi (Algerian week starts Saturday).
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


-- ===== FILE: 20260722_026_professors_booking.sql =====
-- ===============================================================
-- Migration: 20260722_026_professors_booking
--
-- BAC professors directory + booking requests.
--   professors        â€” teachers available across the country (subject,
--                       wilaya, in-person / online, where they teach)
--   booking_requests  â€” a parent/student asks to book a professor; the team
--                       follows up. No live scheduling/payment here.
-- Idempotent.
-- ===============================================================

create table if not exists public.professors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  subject text not null,               -- e.g. "MathÃ©matiques"
  wilaya text not null,                -- e.g. "Alger"
  teaches_at text,                     -- school / institution / "Cours particuliers"
  mode text not null default 'both' check (mode in ('in_person', 'online', 'both')),
  bio text,
  hourly_rate_dzd integer,             -- optional indicative rate
  photo_url text,
  verified boolean not null default false,
  active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_professors_filters
  on public.professors (active, subject, wilaya);

alter table public.professors enable row level security;

-- Anyone can read active professors (public directory).
drop policy if exists "anon read active professors" on public.professors;
create policy "anon read active professors"
  on public.professors for select to anon, authenticated
  using (active = true);

drop policy if exists "service role professors" on public.professors;
create policy "service role professors"
  on public.professors for all to service_role
  using (true) with check (true);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references public.professors(id) on delete cascade,
  parent_id uuid references auth.users(id) on delete set null,
  student_name text,
  grade text,
  preferred_mode text check (preferred_mode in ('in_person', 'online', 'both')),
  phone text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_booking_requests_prof
  on public.booking_requests (professor_id, created_at desc);

alter table public.booking_requests enable row level security;

-- Authenticated users can create a booking request.
drop policy if exists "auth insert booking" on public.booking_requests;
create policy "auth insert booking"
  on public.booking_requests for insert to authenticated
  with check (true);

drop policy if exists "service role bookings" on public.booking_requests;
create policy "service role bookings"
  on public.booking_requests for all to service_role
  using (true) with check (true);

-- ===== Seed a handful of example professors across the country =====
-- Guarded: only seeds when the table is empty, so re-running never duplicates.
insert into public.professors (full_name, subject, wilaya, teaches_at, mode, bio, hourly_rate_dzd, verified, sort_order)
select * from (values
  ('Pr. Karim Boudiaf',   'MathÃ©matiques', 'Alger',       'LycÃ©e El Idrissi Â· cours particuliers', 'both',   'Professeur de mathÃ©matiques, 15 ans d''expÃ©rience en prÃ©paration au BAC sciences et maths.', 1500, true, 1),
  ('Pr. Nawal SaÃ¯di',     'Sciences physiques', 'Oran',   'LycÃ©e Pasteur',                         'both',   'SpÃ©cialiste de la physique-chimie du BAC, mÃ©thode axÃ©e sur les annales officielles.',      1400, true, 2),
  ('Pr. Yacine Meddour',  'Sciences naturelles', 'Constantine', 'Cours particuliers',            'online', 'SVT pour BAC sciences expÃ©rimentales. Suivi personnalisÃ© en ligne.',                        1200, true, 3),
  ('Pr. Amel Benkhaled',  'FranÃ§ais',      'SÃ©tif',        'LycÃ©e Kerouani',                        'both',   'PrÃ©paration Ã  l''Ã©preuve de franÃ§ais : comprÃ©hension, production Ã©crite, mÃ©thodologie.',    1000, true, 4),
  ('Pr. Sofiane Herbi',   'MathÃ©matiques', 'Blida',        'Cours particuliers',                    'in_person', 'Maths pour 3AS toutes filiÃ¨res. Groupes rÃ©duits Ã  Blida.',                              1300, true, 5),
  ('Pr. Lina Ait Ahmed',  'Anglais',       'Tizi Ouzou',   'LycÃ©e Fadhma N''Soumer',                'online', 'Anglais BAC : comprÃ©hension, expression et vocabulaire thÃ©matique.',                        1000, true, 6),
  ('Pr. Rachid Zenati',   'Philosophie',   'Annaba',       'LycÃ©e Saint-Augustin',                  'both',   'MÃ©thodologie de la dissertation et du commentaire philosophique.',                          1100, true, 7),
  ('Pr. Souad Belkacem',  'Sciences physiques', 'Alger',   'Cours particuliers',                    'online', 'Physique-chimie, prÃ©paration intensive aux examens blancs.',                                1400, true, 8)
) as v(full_name, subject, wilaya, teaches_at, mode, bio, hourly_rate_dzd, verified, sort_order)
where not exists (select 1 from public.professors);


-- ===== FILE: 20260722_027_teacher_post_comments.sql =====
-- ===============================================================
-- Migration: 20260722_027_teacher_post_comments
--
-- Comments on the teacher community feed (teacher_posts from migration 016).
-- Only approved teachers can read/write â€” same gate as the posts.
-- Idempotent.
-- ===============================================================

create table if not exists public.teacher_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.teacher_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_teacher_comments_post
  on public.teacher_post_comments (post_id, created_at);

alter table public.teacher_post_comments enable row level security;

-- Approved teachers can read comments.
drop policy if exists "approved teachers read comments" on public.teacher_post_comments;
create policy "approved teachers read comments" on public.teacher_post_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.teacher_profiles tp
      where tp.user_id = auth.uid() and tp.status = 'approved'
    )
  );

-- Approved teachers can comment (as themselves).
drop policy if exists "approved teachers write comments" on public.teacher_post_comments;
create policy "approved teachers write comments" on public.teacher_post_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.teacher_profiles tp
      where tp.user_id = auth.uid() and tp.status = 'approved'
    )
  );

drop policy if exists "service role teacher comments" on public.teacher_post_comments;
create policy "service role teacher comments" on public.teacher_post_comments
  for all to service_role using (true) with check (true);

comment on table public.teacher_post_comments is
  'Comments on teacher_posts. Read/write restricted to approved teachers.';
