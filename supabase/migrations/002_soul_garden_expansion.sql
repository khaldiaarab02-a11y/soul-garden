-- ============================================================
-- SOUL GARDEN — Migration 002: language, Inner Child, subscriptions
-- Run after schema.sql. Purely additive — no drops, no data loss.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING throughout.
-- ============================================================

-- ---------- user_settings: language ----------
alter table public.user_settings
  add column if not exists language text not null default 'ar'
  check (language in ('ar', 'en'));

-- ---------- profiles: subscription fields ----------
-- Entitlement truth lives here and is written ONLY by the stripe-webhook
-- Edge Function (service role), never directly by the client. RLS below
-- still lets the user read their own row, but write access from the client
-- is restricted to non-subscription columns via the trigger further down.
alter table public.profiles
  add column if not exists subscription_status text not null default 'free'
  check (subscription_status in ('free', 'trialing', 'active', 'past_due', 'cancelled'));
alter table public.profiles
  add column if not exists subscription_plan text; -- 'monthly' | 'yearly' | null
alter table public.profiles
  add column if not exists stripe_customer_id text;
alter table public.profiles
  add column if not exists stripe_subscription_id text;
alter table public.profiles
  add column if not exists subscription_current_period_end timestamptz;
alter table public.profiles
  add column if not exists inner_child_name text;

create unique index if not exists idx_profiles_stripe_customer
  on public.profiles(stripe_customer_id) where stripe_customer_id is not null;

-- Prevent a signed-in client from ever setting their own entitlement —
-- only the service role (used exclusively inside the webhook Edge
-- Function) may change these columns. This is the enforcement point that
-- makes "never trust a client-provided premium=true" actually true.
create or replace function public.protect_subscription_columns()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    if new.subscription_status is distinct from old.subscription_status
      or new.subscription_plan is distinct from old.subscription_plan
      or new.stripe_customer_id is distinct from old.stripe_customer_id
      or new.stripe_subscription_id is distinct from old.stripe_subscription_id
      or new.subscription_current_period_end is distinct from old.subscription_current_period_end
    then
      raise exception 'subscription fields can only be changed by the payment webhook';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_subscription_columns on public.profiles;
create trigger trg_protect_subscription_columns
  before update on public.profiles
  for each row execute procedure public.protect_subscription_columns();

-- ---------- inner_child ----------
-- Kept as its own table (rather than columns on profiles) so future
-- dialogue/encounter history has room to grow without reshaping profiles.
create table if not exists public.inner_child (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  relationship_stage text not null default 'distant'
    check (relationship_stage in ('distant', 'noticing', 'approaching', 'present', 'close')),
  interactions_count int not null default 0,
  last_interaction_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.inner_child enable row level security;

drop policy if exists "inner_child_owner_all" on public.inner_child;
create policy "inner_child_owner_all" on public.inner_child
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- indexes ----------
create index if not exists idx_profiles_subscription_status
  on public.profiles(subscription_status);
