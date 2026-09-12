-- HeyWalls v18.7 — Tablet wallpaper orientation.
-- Adds a first-class tablet orientation while preserving existing desktop/phone/both values.

alter table public.wallpapers
  drop constraint if exists wallpapers_orientation_check;

alter table public.wallpapers
  add constraint wallpapers_orientation_check
  check (orientation in ('desktop', 'phone', 'tablet', 'both'));

-- Classify existing desktop uploads with a tablet-friendly landscape/square-ish ratio.
-- This only touches rows that have stored dimensions and were previously labelled desktop.
update public.wallpapers
set orientation = 'tablet'
where orientation = 'desktop'
  and width is not null
  and height is not null
  and width >= height
  and width::numeric / nullif(height, 0) between 1.20 and 1.60;
