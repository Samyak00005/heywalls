-- HeyWalls — user collections.
-- Run after the existing migrations.
-- Collections are private to their owner; wallpapers themselves remain public.

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.collection_wallpapers (
  collection_id uuid references public.collections(id) on delete cascade not null,
  wallpaper_id uuid references public.wallpapers(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (collection_id, wallpaper_id)
);

alter table public.collections enable row level security;
alter table public.collection_wallpapers enable row level security;

drop policy if exists "Users can view own collections" on public.collections;
create policy "Users can view own collections"
on public.collections for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own collections" on public.collections;
create policy "Users can create own collections"
on public.collections for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own collections" on public.collections;
create policy "Users can update own collections"
on public.collections for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own collections" on public.collections;
create policy "Users can delete own collections"
on public.collections for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view own collection wallpapers" on public.collection_wallpapers;
create policy "Users can view own collection wallpapers"
on public.collection_wallpapers for select
using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);

drop policy if exists "Users can add to own collections" on public.collection_wallpapers;
create policy "Users can add to own collections"
on public.collection_wallpapers for insert
with check (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);

drop policy if exists "Users can remove from own collections" on public.collection_wallpapers;
create policy "Users can remove from own collections"
on public.collection_wallpapers for delete
using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);

create index if not exists collections_user_id_idx
  on public.collections(user_id);

create index if not exists collection_wallpapers_wallpaper_id_idx
  on public.collection_wallpapers(wallpaper_id);
