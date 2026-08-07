-- Lock down the stats table. Run this in the Supabase SQL editor.
-- Project: https://ovywpamkhjzdxbotkorw.supabase.co
--
-- The stats table used to allow anonymous writes via the public anon key,
-- which completely bypassed the Cloudflare Worker password gate. Only the
-- service role (used by the Worker) may write; everyone else may only read.
-- The service role bypasses RLS, so the Worker keeps working unchanged.

alter table public.stats enable row level security;

revoke insert, update, delete on public.stats from anon, authenticated;
grant select on public.stats to anon, authenticated;

-- Drop any permissive write policies left over from the earlier setup.
-- (Names vary depending on how the policies were created; drop both common ones.)
drop policy if exists "stats_update" on public.stats;
drop policy if exists "Enable insert for anon" on public.stats;
drop policy if exists "Enable update for anon" on public.stats;
drop policy if exists "Enable delete for anon" on public.stats;

-- Read is allowed for everyone (anon + authenticated) via RLS.
drop policy if exists "stats_select" on public.stats;
create policy "stats_select" on public.stats
  for select using (true);

-- No insert/update/delete policies: anon and authenticated are blocked by RLS,
-- and the service role bypasses RLS for Worker writes.
