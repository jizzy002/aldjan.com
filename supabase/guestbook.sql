-- Guestbook tables + RLS. Run this in the Supabase SQL editor.
-- Project: https://ovywpamkhjzdxbotkorw.supabase.co

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  github_username text not null,
  github_avatar text not null,
  display_name text not null default '',
  profile_email text not null default '',
  message text not null check (char_length(message) <= 300),
  created_at timestamptz not null default now()
);

-- idempotent migration for databases that already created the table
alter table public.guestbook_entries add column if not exists display_name text not null default '';
alter table public.guestbook_entries add column if not exists profile_email text not null default '';

create table if not exists public.guestbook_reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.guestbook_entries (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  emoji text not null check (emoji in ('👍','🔥','❤️','😄')),
  created_at timestamptz not null default now(),
  unique (entry_id, user_id, emoji)
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

create index if not exists guestbook_reactions_entry_idx
  on public.guestbook_reactions (entry_id);

create index if not exists guestbook_entries_profile_email_idx
  on public.guestbook_entries (profile_email) where profile_email <> '';

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_reactions enable row level security;

-- Public readers can see notes, but never the email used for the note limit.
revoke select on public.guestbook_entries from public, anon, authenticated;
revoke select (profile_email) on public.guestbook_entries from public, anon, authenticated;
grant select (id, user_id, github_username, github_avatar, display_name, message, created_at)
  on public.guestbook_entries to anon, authenticated;
grant insert, delete on public.guestbook_entries to authenticated;
grant select on public.guestbook_reactions to anon, authenticated;
grant insert, delete on public.guestbook_reactions to authenticated;

-- anyone can read entries
drop policy if exists "guestbook_entries_select" on public.guestbook_entries;
create policy "guestbook_entries_select" on public.guestbook_entries
  for select using (true);

-- signed-in users insert entries; identity is set server-side from the JWT
drop policy if exists "guestbook_entries_insert" on public.guestbook_entries;
create policy "guestbook_entries_insert" on public.guestbook_entries
  for insert with check (auth.uid() = user_id);

-- A trusted app_metadata claim marks the moderator; user_metadata is user-editable.
drop policy if exists "guestbook_entries_delete" on public.guestbook_entries;
create policy "guestbook_entries_delete" on public.guestbook_entries
  for delete using (
    auth.uid() = user_id
    or auth.jwt() -> 'app_metadata' ->> 'guestbook_owner' = 'true'
  );

-- anyone can read reactions
drop policy if exists "guestbook_reactions_select" on public.guestbook_reactions;
create policy "guestbook_reactions_select" on public.guestbook_reactions
  for select using (true);

-- signed-in users insert their own reactions
drop policy if exists "guestbook_reactions_insert" on public.guestbook_reactions;
create policy "guestbook_reactions_insert" on public.guestbook_reactions
  for insert with check (auth.uid() = user_id);

-- signed-in users delete their own reactions
drop policy if exists "guestbook_reactions_delete" on public.guestbook_reactions;
create policy "guestbook_reactions_delete" on public.guestbook_reactions
  for delete using (auth.uid() = user_id);

-- Identity and limits are enforced server-side: never trust the client payload.
-- The trigger derives user_id / github_username / github_avatar / display_name /
-- profile_email from the authenticated user row (auth.users) — NOT the JWT
-- metadata snapshot, which can lag after updateUser — and hard-caps entries per
-- email (falling back to per-user when no email is present), so direct REST
-- calls can't spam or spoof.
-- Multi-provider support: GitHub populates user_name/avatar_url; Google falls
-- back to full_name/name and avatar_url/picture, so display_name is set and the
-- name prompt is skipped. github_username stays empty for non-GitHub providers.
create or replace function public.enforce_guestbook_entry_policy()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  entry_count int;
  user_meta jsonb;
begin
  new.user_id := auth.uid();

  if new.user_id is null then
    raise exception 'Not authenticated';
  end if;

  select raw_user_meta_data into user_meta
  from auth.users
  where id = new.user_id;

  new.github_username := coalesce(user_meta ->> 'user_name', '');
  new.github_avatar  := coalesce(user_meta ->> 'avatar_url', user_meta ->> 'picture', '');
  new.display_name   := coalesce(user_meta ->> 'display_name', user_meta ->> 'full_name', user_meta ->> 'name', '');
  new.profile_email  := coalesce(auth.jwt() ->> 'email', user_meta ->> 'email', '');

  if new.profile_email <> '' then
    select count(*) into entry_count from public.guestbook_entries where profile_email = new.profile_email;
  else
    select count(*) into entry_count from public.guestbook_entries where user_id = new.user_id;
  end if;

  if entry_count >= 3 then
    raise exception 'Max 3 notes per account';
  end if;

  return new;
end;
$$;

drop trigger if exists guestbook_entries_before_insert on public.guestbook_entries;
create trigger guestbook_entries_before_insert
  before insert on public.guestbook_entries
  for each row execute function public.enforce_guestbook_entry_policy();

-- Return only the current user's note count; never expose profile_email.
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
