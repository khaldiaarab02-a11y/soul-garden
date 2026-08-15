-- ============================================================
-- SOUL GARDEN — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.
-- ============================================================

-- ---------- profiles ----------
-- One row per auth user. Created automatically on signup via trigger below.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- check_ins ----------
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion_id text not null,
  intensity int not null check (intensity between 1 and 5),
  note text,
  created_at timestamptz not null default now()
);

alter table public.check_ins enable row level security;

drop policy if exists "check_ins_owner_all" on public.check_ins;
create policy "check_ins_owner_all" on public.check_ins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- journal_entries ----------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

drop policy if exists "journal_entries_owner_all" on public.journal_entries;
create policy "journal_entries_owner_all" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- exercise_completions ----------
create table if not exists public.exercise_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  journey_id text,
  day_id text,
  completed_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);

alter table public.exercise_completions enable row level security;

drop policy if exists "exercise_completions_owner_all" on public.exercise_completions;
create policy "exercise_completions_owner_all" on public.exercise_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- journey_progress ----------
create table if not exists public.journey_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id text not null,
  day_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, day_id)
);

alter table public.journey_progress enable row level security;

drop policy if exists "journey_progress_owner_all" on public.journey_progress;
create policy "journey_progress_owner_all" on public.journey_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- garden_state ----------
-- One row per user — the garden is derived data, but we cache the last
-- known stage/percent so it renders instantly without recomputation.
create table if not exists public.garden_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stage_id text not null default 'empty',
  percent int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.garden_state enable row level security;

drop policy if exists "garden_state_owner_all" on public.garden_state;
create policy "garden_state_owner_all" on public.garden_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- achievements ----------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table public.achievements enable row level security;

drop policy if exists "achievements_owner_all" on public.achievements;
create policy "achievements_owner_all" on public.achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- user_settings ----------
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  audio_enabled boolean not null default true,
  effects_enabled boolean not null default true,
  luna_enabled boolean not null default true,
  reduced_motion boolean not null default false,
  large_text boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings_owner_all" on public.user_settings;
create policy "user_settings_owner_all" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- helpful indexes ----------
create index if not exists idx_check_ins_user on public.check_ins(user_id, created_at desc);
create index if not exists idx_journal_entries_user on public.journal_entries(user_id, created_at desc);
create index if not exists idx_exercise_completions_user on public.exercise_completions(user_id);
create index if not exists idx_journey_progress_user on public.journey_progress(user_id);
