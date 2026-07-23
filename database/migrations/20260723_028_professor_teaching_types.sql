-- ===============================================================
-- Migration: 20260723_028_professor_teaching_types
--
-- Adds a structured "how do you teach" field to professors so the BAC
-- finder can guide students: at school, private tutoring, or online.
-- Values: 'school' | 'private' | 'online' (a professor can offer several).
-- Backfilled from the existing mode + teaches_at text. Idempotent.
-- ===============================================================

alter table public.professors
  add column if not exists teaching_types text[] not null default '{}';

comment on column public.professors.teaching_types is
  'How the professor teaches: any of school / private / online.';

-- Backfill only rows that don't have it set yet.
update public.professors p set teaching_types = coalesce((
  select array_remove(array[
    case when p.mode in ('in_person','both')
          and (p.teaches_at ilike '%lyc%' or p.teaches_at ilike '%éc%'
               or p.teaches_at ilike '%ec%' or p.teaches_at ilike '%coll%'
               or p.teaches_at ilike '%school%') then 'school' end,
    case when p.mode in ('in_person','both')
          and p.teaches_at ilike '%particulier%' then 'private' end,
    case when p.mode in ('online','both') then 'online' end
  ]::text[], null)
), '{}')
where p.teaching_types = '{}';

-- Anyone in-person with nothing matched still offers private tutoring.
update public.professors
set teaching_types = teaching_types || array['private']
where mode in ('in_person','both') and teaching_types = '{}';

-- Anyone online-only with nothing matched offers online.
update public.professors
set teaching_types = array['online']
where mode = 'online' and teaching_types = '{}';

notify pgrst, 'reload schema';
