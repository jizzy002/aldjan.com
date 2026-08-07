# Guestbook Design

Date: 2026-08-07

## Goal

Add a guestbook to aldjan.com, modeled after omarzunic.com: visitors sign in with
GitHub to leave notes (max 3 per account) or add emoji reactions to entries.

## Decisions

- **Auth**: Supabase GitHub provider (built-in OAuth). GitHub Client ID + Secret
  live in the Supabase Dashboard (Auth → Providers → GitHub), never in code.
- **Data**: two new Supabase tables with Row-Level Security.
- **Owner identity**: GitHub username `jizzy002` is the site owner and can delete
  any entry.
- **Reactions**: fixed emoji set — 👍 🔥 ❤️ 😄 — toggled on/off, one per emoji
  per user per entry (unique constraint).

## Data model

### `guestbook_entries`

| column            | type      | notes                                  |
| ----------------- | --------- | -------------------------------------- |
| `id`              | uuid      | PK, default gen_random_uuid()          |
| `user_id`         | uuid      | FK → auth.users.id, not null           |
| `github_username` | text      | not null; from GitHub provider metadata (`user_metadata.user_name`) |
| `github_avatar`   | text      | not null; from GitHub provider metadata (`user_metadata.avatar_url`) |
| `message`         | text      | not null, max 300 chars                |
| `created_at`      | timestamptz | default now()                        |

### `guestbook_reactions`

| column      | type | notes                                        |
| ----------- | ---- | -------------------------------------------- |
| `id`        | uuid | PK, default gen_random_uuid()                |
| `entry_id`  | uuid | FK → guestbook_entries.id, not null          |
| `user_id`   | uuid | FK → auth.users.id, not null                 |
| `emoji`     | text | one of 👍 🔥 ❤️ 😄                           |
| `created_at`| timestamptz | default now()                     |

Unique constraint on `(entry_id, user_id, emoji)` — a user can react with a given
emoji once per entry; inserting the same tuple again toggles it off (delete).

## RLS policies

**guestbook_entries**
- `SELECT`: everyone (anon + authenticated)
- `INSERT`: authenticated only, `auth.uid() = user_id`
- `DELETE`: owner (`github_username = 'jizzy002'`) OR own entry (`auth.uid() = user_id`)

**guestbook_reactions**
- `SELECT`: everyone
- `INSERT`/`DELETE`: authenticated only, `auth.uid() = user_id`

Max-3 rule is enforced in the app (count query before insert) with a redundant
guard inside the insert flow.

## Component: `src/components/GuestbookSection.jsx`

Rendered above `<Footer />` in `App.jsx`.

- **Entry list**: newest first — avatar, GitHub username, message, created-at
  relative time, reaction buttons with live counts.
- **Signed out**: "Sign in with GitHub" button → `supabase.auth.signInWithOAuth({ provider: 'github' })`.
- **Signed in**: textarea (max 300 chars, char counter) + "Post" button; message
  box shows "X of 3 notes used".
- **Reactions**: clicking an emoji toggles it (insert or delete reaction).
- **Owner controls**: for `jizzy002`, a small delete control appears on every entry.
- **Degradation**: if the Supabase client is `null` (env missing), the section
  renders read-only/disabled, mirroring StatsSection behavior.

## Error handling

- Login cancelled → inline "login cancelled" message, no stuck state.
- Insert/delete failure → inline error ("Failed to post — try again"), textarea
  content preserved.
- Missing env → read-only section, no crash.

## Testing

No test framework in the repo; manual verification:

1. On Vercel preview (`dev`), sign in with GitHub.
2. Post 3 notes → 4th is blocked with the limit message.
3. Add and toggle reactions; verify counts and unique-per-user behavior.
4. As owner, delete a test entry (also delete one as a second account if possible).
5. Verify on Cloudflare production after merge to `master`.

## Implementation steps

1. User: create GitHub OAuth App → add Client ID + Secret to Supabase Dashboard
   (Auth → Providers → GitHub). Callback URL:
   `https://ovywpamkhjzdxbotkorw.supabase.co/auth/v1/callback`.
2. SQL migration: create tables + RLS policies (Supabase SQL editor).
3. Build `GuestbookSection.jsx`.
4. Wire into `App.jsx`.
5. Env vars already present in Vercel + Cloudflare Pages (from stats work).
6. Commit → push `dev` → test on Vercel → fast-forward `master` → test prod.
