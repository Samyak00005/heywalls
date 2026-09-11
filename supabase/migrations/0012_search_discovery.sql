-- HeyWalls v18.0 — Search & Discovery indexes.
-- Run this migration in Supabase after 0011_profile_display_name.sql.

create index if not exists wallpapers_approved_created_at_idx
  on public.wallpapers (created_at desc)
  where status = 'approved';

create index if not exists wallpapers_approved_download_count_idx
  on public.wallpapers (download_count desc)
  where status = 'approved';

create index if not exists wallpapers_title_lower_idx
  on public.wallpapers (lower(title));

create index if not exists wallpaper_categories_category_id_wallpaper_id_idx
  on public.wallpaper_categories (category_id, wallpaper_id);

create index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

create index if not exists profiles_display_name_lower_idx
  on public.profiles (lower(display_name));
