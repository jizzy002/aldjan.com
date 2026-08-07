-- Guestbook tables + RLS. Run this in the Supabase SQL editor.
-- Project: https://ovywpamkhjzdxbotkorw.supabase.co

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  github_username text not null,
  github_avatar text not null,
  message text not null check (char_length(message) <= 300),
  created_at timestamptz not null default now()
);

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

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_reactions enable row level security;

grant select on public.guestbook_entries to anon, authenticated;
grant insert, delete on public.guestbook_entries to authenticated;
grant select on public.guestbook_reactions to anon, authenticated;
grant insert, delete on public.guestbook_reactions to authenticated;

-- anyone can read entries
create policy "guestbook_entries_select" on public.guestbook_entries
  for select using (true);

-- signed-in users insert entries; identity is set server-side from the JWT
create policy "guestbook_entries_insert" on public.guestbook_entries
  for insert with check (auth.uid() = user_id);

-- owner (GitHub username jizzy002) or the author can delete
create policy "guestbook_entries_delete" on public.guestbook_entries
  for delete using (
    auth.uid() = user_id
    or auth.jwt() -> 'user_metadata' ->> 'user_name' = 'jizzy002'
  );

-- anyone can read reactions
create policy "guestbook_reactions_select" on public.guestbook_reactions
  for select using (true);

-- signed-in users insert their own reactions
create policy "guestbook_reactions_insert" on public.guestbook_reactions
  for insert with check (auth.uid() = user_id);

-- signed-in users delete their own reactions
create policy "guestbook_reactions_delete" on public.guestbook_reactions
  for delete using (auth.uid() = user_id);

-- Identity and limits are enforced server-side: never trust the client payload.
-- The trigger derives user_id / github_username / github_avatar from the JWT
-- and hard-caps entries per account, so direct REST calls can't spam or spoof.
create or replace function public.enforce_guestbook_entry_policy()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  new.user_id := auth.uid();
  new.github_username := coalesce(auth.jwt() -> 'user_metadata' ->> 'user_name', 'github-user');
  new.github_avatar  := coalesce(auth.jwt() -> 'user_metadata' ->> 'avatar_url', '');

  if new.user_id is null then
    raise exception 'Not authenticated';
  end if;

  if (select count(*) from public.guestbook_entries where user_id = new.user_id) >= 3 then
    raise exception 'Max 3 notes per account';
  end if;

  return new;
end;
$$;

drop trigger if exists guestbook_entries_before_insert on public.guestbook_entries;
create trigger guestbook_entries_before_insert
  before insert on public.guestbook_entries
  for each row execute function public.enforce_guestbook_entry_policy();
