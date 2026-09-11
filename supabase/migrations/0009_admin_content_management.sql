-- HeyWalls — admin content management.
-- Allows admins to permanently remove wallpapers from the moderation/content queue.
-- Run after 0008_collections.sql.

create policy "Admins can delete wallpapers"
on public.wallpapers
for delete
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Admins can inspect download records for analytics if needed later.
drop policy if exists "Admins can view downloads" on public.downloads;
create policy "Admins can view downloads"
on public.downloads
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
