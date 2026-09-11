-- HeyWalls Phase 3 — profile display names.
-- Run after 0010_admin_wallpaper_editing.sql.

alter table public.profiles
  add column if not exists display_name text;

-- Keep new signups' display name from auth metadata when the profile row is
-- created by the existing auth trigger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    nullif(trim(new.raw_user_meta_data->>'display_name'), '')
  );
  return new;
end;
$$;

-- Existing accounts keep working; they can fill in their display name from
-- Account settings. This only backfills when auth metadata already contains it.
update public.profiles p
set display_name = nullif(trim(u.raw_user_meta_data->>'display_name'), '')
from auth.users u
where u.id = p.id
  and p.display_name is null
  and nullif(trim(u.raw_user_meta_data->>'display_name'), '') is not null;
