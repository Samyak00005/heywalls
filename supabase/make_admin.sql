-- Run once in the Supabase SQL Editor. Promotes accounts to admin by
-- email (joined through auth.users) rather than username, since email is
-- guaranteed unique and exactly what you see in Account Settings.
--
-- IMPORTANT: after running this, sign out and sign back in on the site.
-- The app caches your profile (including role) for the current session,
-- so a role change made directly in the database won't show up until
-- the session re-fetches it.

update public.profiles
set role = 'admin'
from auth.users
where profiles.id = auth.users.id
  and auth.users.email in (
    'samyak.timepass@gmail.com',
    'itsdonutpanda@gmail.com'
  );

-- Confirm it worked — both rows below should show role = admin:
select p.username, p.role, u.email
from public.profiles p
join auth.users u on u.id = p.id
where u.email in ('samyak.timepass@gmail.com', 'itsdonutpanda@gmail.com');
