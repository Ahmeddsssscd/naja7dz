-- ===============================================================
-- Migration: 20260722_027_teacher_post_comments
--
-- Comments on the teacher community feed (teacher_posts from migration 016).
-- Only approved teachers can read/write — same gate as the posts.
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
