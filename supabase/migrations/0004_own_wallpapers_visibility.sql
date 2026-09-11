-- HeyWalls — Phase 3 follow-up. Run after 0003_profile_insert_policy.sql.
-- Lets a signed-in user see their OWN wallpapers regardless of status
-- (pending/rejected included) — needed for the My Uploads page, which
-- would otherwise only see approved ones like the public does.

create policy "Users can view own wallpapers regardless of status" on public.wallpapers
  for select using (auth.uid() = uploader_id);
