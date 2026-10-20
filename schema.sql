-- ARX Stories 2.0 — run this in Supabase SQL Editor.
-- SECURITY: do not place your service_role key in config.js or any browser code.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Real Paranormal Cases','Nightmare Fuel','Conspiracy Theories')),
  label text not null default 'ARX FILE',
  reading_time integer not null default 5 check (reading_time between 1 and 180),
  description text not null default '',
  image text not null default '',
  lead text not null default '',
  sections jsonb not null default '[]'::jsonb,
  note text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, story_id)
);

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.bookmarks enable row level security;

-- Anyone may read only published stories. No browser user can insert/update/delete stories.
drop policy if exists "Published stories are public" on public.stories;
create policy "Published stories are public" on public.stories for select using (published = true);

-- A member can only read and change their own profile row.
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- A member can only see/manage their own bookmarks.
drop policy if exists "Read own bookmarks" on public.bookmarks;
create policy "Read own bookmarks" on public.bookmarks for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Add own bookmarks" on public.bookmarks;
create policy "Add own bookmarks" on public.bookmarks for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Delete own bookmarks" on public.bookmarks;
create policy "Delete own bookmarks" on public.bookmarks for delete to authenticated using (auth.uid() = user_id);

-- Create your owner/admin role using the Supabase SQL Editor (instructions in SETUP.md).
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;
-- No browser-facing policy grants access to site_admins; manage it only in SQL Editor.
-- Admin publishing is intentionally NOT exposed in this static front end. Use Supabase
-- Dashboard > Table Editor to add/edit/publish stories; RLS blocks member publishing.
