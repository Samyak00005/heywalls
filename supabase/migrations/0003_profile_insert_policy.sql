-- HeyWalls — Phase 3 fix. Run after 0002_auth_profile_trigger.sql.
-- The client now self-heals by creating its own profile row if the
-- on-signup trigger didn't produce one — but that requires an INSERT
-- policy, which was missing (only SELECT and UPDATE existed).

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
