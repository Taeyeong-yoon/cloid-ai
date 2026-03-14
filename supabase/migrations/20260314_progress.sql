-- User learning progress tracking
-- Tracks which learning topics a user has completed/viewed

create table if not exists public.user_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  content_id  text not null,
  content_type text not null check (content_type in ('learning', 'lab', 'skill', 'radar')),
  completed   boolean not null default false,
  last_viewed_at timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  unique (user_id, content_id, content_type)
);

-- Index for fast user lookups
create index if not exists user_progress_user_id_idx on public.user_progress(user_id);

-- RLS: users can only read/write their own progress
alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);
