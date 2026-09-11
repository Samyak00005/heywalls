-- HeyWalls — Admin profile management.
-- Lets admins change user roles from the Admin > Users page.
-- Run after 0006_storage.sql.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());
