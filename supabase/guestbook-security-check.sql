-- Read-only production check. Returns policy text and privileges, not guestbook data.
select policyname, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename = 'guestbook_entries'
  and cmd = 'DELETE';

select
  has_column_privilege('anon', 'public.guestbook_entries', 'profile_email', 'SELECT')
    as anon_can_read_profile_email,
  has_column_privilege('authenticated', 'public.guestbook_entries', 'profile_email', 'SELECT')
    as authenticated_can_read_profile_email;
