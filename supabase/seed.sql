-- HeyWalls — seed data. Run after 0001_init.sql.
-- All seeded wallpapers are curated (uploader_id null, status approved) —
-- this is standing in for real user uploads until Phase 4.

insert into public.categories (name, slug) values
  ('Nature', 'nature'),
  ('Minimal', 'minimal'),
  ('Abstract', 'abstract'),
  ('Texture', 'texture'),
  ('Space', 'space'),
  ('Anime', 'anime')
on conflict (slug) do nothing;

-- Wallpapers. image_url doubles as thumbnail_url for now (Phase 4 will
-- generate real separate thumbnails on upload).
with w as (
  insert into public.wallpapers (title, description, image_url, thumbnail_url, orientation, width, height, status)
  values
    ('Moss trail', 'A quiet trail through dense moss.', 'https://picsum.photos/seed/moss-1/360/640', 'https://picsum.photos/seed/moss-1/360/640', 'phone', 360, 640, 'approved'),
    ('Grid line', 'Minimal architectural lines.', 'https://picsum.photos/seed/grid-2/640/360', 'https://picsum.photos/seed/grid-2/640/360', 'desktop', 640, 360, 'approved'),
    ('Dust field', 'Abstract texture in warm dust tones.', 'https://picsum.photos/seed/dust-3/360/640', 'https://picsum.photos/seed/dust-3/360/640', 'phone', 360, 640, 'approved'),
    ('Ink wash', 'Soft ink-wash texture.', 'https://picsum.photos/seed/ink-4/640/360', 'https://picsum.photos/seed/ink-4/640/360', 'desktop', 640, 360, 'approved'),
    ('Night haze', 'Deep space haze at night.', 'https://picsum.photos/seed/haze-5/360/640', 'https://picsum.photos/seed/haze-5/360/640', 'phone', 360, 640, 'approved'),
    ('Soft line', 'A minimal soft gradient line.', 'https://picsum.photos/seed/line-6/640/360', 'https://picsum.photos/seed/line-6/640/360', 'desktop', 640, 360, 'approved'),
    ('Fern light', 'Light filtering through fern leaves.', 'https://picsum.photos/seed/fern-7/360/640', 'https://picsum.photos/seed/fern-7/360/640', 'phone', 360, 640, 'approved'),
    ('Static field', 'Abstract static noise pattern.', 'https://picsum.photos/seed/static-8/640/360', 'https://picsum.photos/seed/static-8/640/360', 'desktop', 640, 360, 'approved'),
    ('Paper grain', 'Fine paper grain texture.', 'https://picsum.photos/seed/paper-9/360/640', 'https://picsum.photos/seed/paper-9/360/640', 'phone', 360, 640, 'approved'),
    ('Deep orbit', 'A planet in deep orbit.', 'https://picsum.photos/seed/orbit-10/640/360', 'https://picsum.photos/seed/orbit-10/640/360', 'desktop', 640, 360, 'approved'),
    ('Ronin sketch', 'Anime-style character sketch.', 'https://picsum.photos/seed/ronin-11/360/640', 'https://picsum.photos/seed/ronin-11/360/640', 'phone', 360, 640, 'approved'),
    ('Clay wall', 'Warm clay wall texture.', 'https://picsum.photos/seed/clay-12/640/360', 'https://picsum.photos/seed/clay-12/640/360', 'desktop', 640, 360, 'approved'),
    ('Wet asphalt', 'City street after rain.', 'https://picsum.photos/seed/user-a/360/640', 'https://picsum.photos/seed/user-a/360/640', 'phone', 360, 640, 'approved'),
    ('Cut glass', 'Abstract cut-glass pattern.', 'https://picsum.photos/seed/user-b/360/640', 'https://picsum.photos/seed/user-b/360/640', 'phone', 360, 640, 'approved'),
    ('Sand line', 'Wind lines across dunes.', 'https://picsum.photos/seed/user-c/360/640', 'https://picsum.photos/seed/user-c/360/640', 'phone', 360, 640, 'approved'),
    ('Ink panel', 'A single anime ink panel.', 'https://picsum.photos/seed/user-d/360/640', 'https://picsum.photos/seed/user-d/360/640', 'phone', 360, 640, 'approved')
  returning id, title
)
insert into public.wallpaper_categories (wallpaper_id, category_id)
select w.id, c.id
from w
join public.categories c on
  (w.title = 'Moss trail' and c.slug = 'nature') or
  (w.title = 'Grid line' and c.slug = 'minimal') or
  (w.title = 'Dust field' and c.slug = 'abstract') or
  (w.title = 'Ink wash' and c.slug = 'texture') or
  (w.title = 'Night haze' and c.slug = 'space') or
  (w.title = 'Soft line' and c.slug = 'minimal') or
  (w.title = 'Fern light' and c.slug = 'nature') or
  (w.title = 'Static field' and c.slug = 'abstract') or
  (w.title = 'Paper grain' and c.slug = 'texture') or
  (w.title = 'Deep orbit' and c.slug = 'space') or
  (w.title = 'Ronin sketch' and c.slug = 'anime') or
  (w.title = 'Clay wall' and c.slug = 'texture') or
  (w.title = 'Wet asphalt' and c.slug = 'texture') or
  (w.title = 'Cut glass' and c.slug = 'abstract') or
  (w.title = 'Sand line' and c.slug = 'nature') or
  (w.title = 'Ink panel' and c.slug = 'anime');
