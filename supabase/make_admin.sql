-- Run once in the Supabase SQL Editor to make samyak005 the admin account.
-- Not a migration — a one-time data change, so it isn't numbered with
-- the others in supabase/migrations/.

update public.profiles set role = 'admin' where username = 'samyak005';

-- Confirm it worked:
select username, role from public.profiles where username = 'samyak005';
