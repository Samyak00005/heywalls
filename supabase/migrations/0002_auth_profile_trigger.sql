-- HeyWalls — Phase 3 migration. Run after 0001_init.sql + seed.sql.
-- Auto-creates a profiles row whenever someone signs up, and lets users
-- update their own profile.

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

  -- username has a unique constraint — if it's taken, append a number
  -- rather than letting signup fail outright.
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username) values (new.id, final_username);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
