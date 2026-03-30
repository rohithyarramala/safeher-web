-- SafeHer core schema
-- Run this in Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  emergency_contacts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sos_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_url text,
  lat double precision,
  lng double precision,
  threat_level text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'escalated', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sos_records_user_id on public.sos_records(user_id);
create index if not exists idx_sos_records_created_at on public.sos_records(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_sos_records_updated_at on public.sos_records;
create trigger trg_sos_records_updated_at
before update on public.sos_records
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.sos_records enable row level security;

-- Profiles policies
create policy if not exists "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy if not exists "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy if not exists "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- SOS policies
create policy if not exists "Users can read own SOS records"
on public.sos_records for select
using (auth.uid() = user_id);

create policy if not exists "Users can insert own SOS records"
on public.sos_records for insert
with check (auth.uid() = user_id);

create policy if not exists "Users can update own SOS records"
on public.sos_records for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
