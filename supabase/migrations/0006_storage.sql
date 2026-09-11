-- HeyWalls — Storage setup for uploads. Run after 0005.

insert into storage.buckets (id, name, public)
values ('wallpapers', 'wallpapers', true)
on conflict (id) do nothing;

create policy "Public read wallpaper files" on storage.objects
  for select using (bucket_id = 'wallpapers');

create policy "Authenticated users can upload wallpaper files" on storage.objects
  for insert with check (bucket_id = 'wallpapers' and auth.role() = 'authenticated');
