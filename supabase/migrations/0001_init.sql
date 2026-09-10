-- HeyWalls — Phase 2 migration
-- Run this in the Supabase SQL Editor before seed.sql.
-- Covers: profiles, categories, wallpapers, wallpaper_categories
-- (favorites, downloads, reports come in Phase 4/5 alongside auth + admin)

create extension if not exists "pgcrypto";

-- profiles extends auth.users. Not populated until Phase 3 (auth) lands,
-- but created now so wallpapers.uploader_id has somewhere to point.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  hex_color text,
  created_at timestamptz not null default now()
);

create table if not exists public.wallpapers (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  image_url text not null,
  thumbnail_url text,
  orientation text not null check (orientation in ('desktop', 'phone', 'both')),
  width int,
  height int,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.wallpaper_categories (
  wallpaper_id uuid references public.wallpapers(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (wallpaper_id, category_id)
);

-- Row Level Security. Only public-read policies for now — insert/update
-- policies for uploads and moderation land in Phase 4 and 5 once auth
-- and roles are wired up.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.wallpapers enable row level security;
alter table public.wallpaper_categories enable row level security;

create policy "Public read categories" on public.categories
  for select using (true);

create policy "Public read approved wallpapers" on public.wallpapers
  for select using (status = 'approved');

create policy "Public read wallpaper_categories" on public.wallpaper_categories
  for select using (true);

create policy "Public read profiles" on public.profiles
  for select using (true);
