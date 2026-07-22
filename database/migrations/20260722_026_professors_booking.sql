-- ===============================================================
-- Migration: 20260722_026_professors_booking
--
-- BAC professors directory + booking requests.
--   professors        — teachers available across the country (subject,
--                       wilaya, in-person / online, where they teach)
--   booking_requests  — a parent/student asks to book a professor; the team
--                       follows up. No live scheduling/payment here.
-- Idempotent.
-- ===============================================================

create table if not exists public.professors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  subject text not null,               -- e.g. "Mathématiques"
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
  ('Pr. Karim Boudiaf',   'Mathématiques', 'Alger',       'Lycée El Idrissi · cours particuliers', 'both',   'Professeur de mathématiques, 15 ans d''expérience en préparation au BAC sciences et maths.', 1500, true, 1),
  ('Pr. Nawal Saïdi',     'Sciences physiques', 'Oran',   'Lycée Pasteur',                         'both',   'Spécialiste de la physique-chimie du BAC, méthode axée sur les annales officielles.',      1400, true, 2),
  ('Pr. Yacine Meddour',  'Sciences naturelles', 'Constantine', 'Cours particuliers',            'online', 'SVT pour BAC sciences expérimentales. Suivi personnalisé en ligne.',                        1200, true, 3),
  ('Pr. Amel Benkhaled',  'Français',      'Sétif',        'Lycée Kerouani',                        'both',   'Préparation à l''épreuve de français : compréhension, production écrite, méthodologie.',    1000, true, 4),
  ('Pr. Sofiane Herbi',   'Mathématiques', 'Blida',        'Cours particuliers',                    'in_person', 'Maths pour 3AS toutes filières. Groupes réduits à Blida.',                              1300, true, 5),
  ('Pr. Lina Ait Ahmed',  'Anglais',       'Tizi Ouzou',   'Lycée Fadhma N''Soumer',                'online', 'Anglais BAC : compréhension, expression et vocabulaire thématique.',                        1000, true, 6),
  ('Pr. Rachid Zenati',   'Philosophie',   'Annaba',       'Lycée Saint-Augustin',                  'both',   'Méthodologie de la dissertation et du commentaire philosophique.',                          1100, true, 7),
  ('Pr. Souad Belkacem',  'Sciences physiques', 'Alger',   'Cours particuliers',                    'online', 'Physique-chimie, préparation intensive aux examens blancs.',                                1400, true, 8)
) as v(full_name, subject, wilaya, teaches_at, mode, bio, hourly_rate_dzd, verified, sort_order)
where not exists (select 1 from public.professors);
