-- HeyWalls — Phase 4 + Admin migration. Run after 0004.

-- Admins can see every wallpaper regardless of status, and change status
-- (approve/reject). Uses a subquery against profiles rather than a
-- helper function, to keep this self-contained.
create policy "Admins can view all wallpapers" on public.wallpapers
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can update wallpaper status" on public.wallpapers
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Users can create their own wallpapers (the actual upload).
create policy "Users can insert own wallpapers" on public.wallpapers
  for insert with check (auth.uid() = uploader_id);

create policy "Users can insert own wallpaper_categories" on public.wallpaper_categories
  for insert with check (
    exists (select 1 from public.wallpapers w where w.id = wallpaper_id and w.uploader_id = auth.uid())
  );

-- favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  wallpaper_id uuid references public.wallpapers(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (user_id, wallpaper_id)
);
alter table public.favorites enable row level security;

create policy "Users can view own favorites" on public.favorites
  for select using (auth.uid() = user_id);
create policy "Users can add own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "Users can remove own favorites" on public.favorites
  for delete using (auth.uid() = user_id);

-- downloads (guests included — user_id nullable)
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  wallpaper_id uuid references public.wallpapers(id) on delete cascade not null,
  created_at timestamptz not null default now()
);
alter table public.downloads enable row level security;

create policy "Anyone can log a download" on public.downloads
  for insert with check (true);

create or replace function public.increment_download_count(wallpaper_id uuid)
returns void
language sql
security definer
as $$
  update public.wallpapers set download_count = download_count + 1 where id = wallpaper_id;
$$;

-- Admins can view/manage all categories and profiles.
create policy "Admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
