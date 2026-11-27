-- Apply in the production Supabase SQL editor before deploying the updated client.
-- The owner must have app_metadata.guestbook_owner = true, set by an admin.
begin;

revoke select on public.guestbook_entries from public, anon, authenticated;
revoke select (profile_email) on public.guestbook_entries from public, anon, authenticated;
grant select (id, user_id, github_username, github_avatar, display_name, message, created_at)
  on public.guestbook_entries to anon, authenticated;

drop policy if exists "guestbook_entries_delete" on public.guestbook_entries;
create policy "guestbook_entries_delete" on public.guestbook_entries
  for delete using (
    auth.uid() = user_id
    or auth.jwt() -> 'app_metadata' ->> 'guestbook_owner' = 'true'
  );

create or replace function public.guestbook_used_notes()
returns integer language sql stable security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.guestbook_entries
  where auth.uid() is not null
    and (
      (coalesce(auth.jwt() ->> 'email', '') <> ''
        and profile_email = auth.jwt() ->> 'email')
      or (coalesce(auth.jwt() ->> 'email', '') = ''
        and user_id = auth.uid())
    );
$$;
revoke all on function public.guestbook_used_notes() from public, anon;
grant execute on function public.guestbook_used_notes() to authenticated;

commit;
notify pgrst, 'reload schema';
