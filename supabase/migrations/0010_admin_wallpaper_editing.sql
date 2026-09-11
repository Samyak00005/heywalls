-- HeyWalls — Phase 1: admin wallpaper editing.
-- Allows admins to replace the category links when editing a wallpaper.

create policy "Admins can manage wallpaper categories"
on public.wallpaper_categories
for all
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
