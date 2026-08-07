# Guestbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub-login guestbook to aldjan.com — visitors sign in with GitHub to leave up to 3 notes and add/toggle emoji reactions, with the owner able to delete any entry.

**Architecture:** Supabase provides both auth (built-in GitHub OAuth provider) and storage (two new tables with Row-Level Security). A single new React component (`GuestbookSection.jsx`) renders the entry list, sign-in state, note form, and reactions; it renders above the existing `<Footer />`. The Supabase client (`src/lib/supabase.js`) is already wired.

**Tech Stack:** React 19, Vite 8, `@supabase/supabase-js` v2 (already a dependency). No new dependencies. No test framework in the repo — verification is `npm run build` plus manual browser checks on the Vercel `dev` preview and Cloudflare production.

## Global Constraints

- All styling inline (repo convention — no Tailwind/CSS modules). Match existing dark theme: `background: 'rgba(8,8,8,0.97)'`, border `1px solid rgba(200,220,20,0.4)`, radius 6, text `#f0ebe0`, muted `rgba(240,235,224,0.3)`.
- Owner GitHub username: `jizzy002`.
- Reaction emojis (fixed set): `👍`, `🔥`, `❤️`, `😄`. One per emoji per user per entry.
- Max 3 notes per account; max 300 chars per message.
- Section must render gracefully (read-only/disabled, no crash) if the Supabase client is `null`.
- No comments in code unless asked (repo convention).
- Supabase project URL: `https://ovywpamkhjzdxbotkorw.supabase.co`.

---

### Task 1: Supabase tables + RLS migration

**Files:**
- Create: `supabase/guestbook.sql`

**Interfaces:**
- Produces: SQL script the user runs in the Supabase SQL editor. Defines tables
  `public.guestbook_entries` and `public.guestbook_reactions` plus RLS policies
  that later tasks rely on (owner delete uses `auth.jwt() -> 'user_metadata' ->> 'user_name'`).

- [ ] **Step 1: Create the SQL migration file**

`supabase/guestbook.sql`:

```sql
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

-- signed-in users insert their own entries
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
```

- [ ] **Step 2: Verify with the user**

Hand this to the user and ask them to:
1. Open Supabase Dashboard → project `ovywpamkhjzdxbotkorw` → SQL Editor.
2. Paste the file contents → Run.
3. Confirm "Success. No rows returned" and that both tables appear in Table Editor.

- [ ] **Step 3: Commit**

```bash
git add supabase/guestbook.sql
git commit -m "add guestbook tables and RLS migration"
```

---

### Task 2: GuestbookSection component

**Files:**
- Create: `src/components/GuestbookSection.jsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase.js` (already exported; `null` when env missing).
- Produces: default-exported `GuestbookSection` component (no props). Later task
  renders it in `App.jsx`.

- [ ] **Step 1: Write the component**

`src/components/GuestbookSection.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const OWNER_USERNAME = 'jizzy002'
const MAX_NOTES = 3
const MAX_MESSAGE_LENGTH = 300
const EMOJIS = ['👍', '🔥', '❤️', '😄']

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

export default function GuestbookSection() {
  const [session, setSession] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [authError, setAuthError] = useState('')
  const [usedNotes, setUsedNotes] = useState(0)

  const loadEntries = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('guestbook_entries')
      .select('*, guestbook_reactions(*)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setEntries(data)
  }, [])

  const loadUsedNotes = useCallback(async userId => {
    if (!supabase || !userId) return
    const { count } = await supabase
      .from('guestbook_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    setUsedNotes(count ?? 0)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadUsedNotes(data.session.user.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) loadUsedNotes(newSession.user.id)
    })
    loadEntries().finally(() => setLoading(false))
    return () => sub.subscription.unsubscribe()
  }, [loadEntries, loadUsedNotes])

  async function handleSignIn() {
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
    if (error) setAuthError('Login cancelled or failed')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  async function handlePost() {
    const text = message.trim()
    if (!text || posting || !session) return
    setPosting(true)
    setError('')

    if (text.length > MAX_MESSAGE_LENGTH) {
      setError(`Max ${MAX_MESSAGE_LENGTH} characters`)
      setPosting(false)
      return
    }

    const { count } = await supabase
      .from('guestbook_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
    if (count >= MAX_NOTES) {
      setError(`Max ${MAX_NOTES} notes per account`)
      setPosting(false)
      return
    }

    const { error: insertError } = await supabase
      .from('guestbook_entries')
      .insert({
        user_id: session.user.id,
        github_username: session.user.user_metadata?.user_name || 'github-user',
        github_avatar: session.user.user_metadata?.avatar_url || '',
        message: text,
      })
    if (insertError) {
      setError('Failed to post — try again')
      setPosting(false)
      return
    }
    setMessage('')
    setUsedNotes(prev => prev + 1)
    await loadEntries()
    setPosting(false)
  }

  async function handleToggleReaction(entryId, emoji) {
    if (!session) return
    const existing = await supabase
      .from('guestbook_reactions')
      .select('id')
      .eq('entry_id', entryId)
      .eq('user_id', session.user.id)
      .eq('emoji', emoji)
      .maybeSingle()
    if (existing.data) {
      await supabase.from('guestbook_reactions').delete().eq('id', existing.data.id)
    } else {
      await supabase.from('guestbook_reactions').insert({
        entry_id: entryId,
        user_id: session.user.id,
        emoji,
      })
    }
    await loadEntries()
  }

  async function handleDeleteEntry(entryId) {
    await supabase.from('guestbook_entries').delete().eq('id', entryId)
    await loadEntries()
  }

  if (!supabase) {
    return (
      <section style={{ padding: '0 24px 80px' }}>
        <div className="feed-container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Guestbook unavailable
          </span>
        </div>
      </section>
    )
  }

  const isOwner = session?.user?.user_metadata?.user_name === OWNER_USERNAME
  const remainingNotes = MAX_NOTES - usedNotes

  function reactionCounts(entry) {
    const counts = {}
    for (const emoji of EMOJIS) counts[emoji] = 0
    for (const r of entry.guestbook_reactions || []) {
      if (counts[r.emoji] !== undefined) counts[r.emoji] += 1
    }
    return counts
  }

  function reactionForUser(entry, emoji) {
    return (entry.guestbook_reactions || []).find(
      r => r.emoji === emoji && session && r.user_id === session.user.id
    )
  }

  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div className="feed-container">

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Guestbook
          </span>
        </div>

        <div style={{
          background: 'rgba(8,8,8,0.97)',
          border: '1px solid rgba(200,220,20,0.4)',
          borderRadius: 6,
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
          padding: 22,
        }}>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <img
                  src={session.user.user_metadata?.avatar_url || ''}
                  alt=""
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                />
                <span style={{ fontSize: 13, color: '#f0ebe0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.user_metadata?.user_name || 'Signed in'}
                </span>
              </div>
              <button onClick={handleSignOut} style={{
                padding: '6px 12px', background: 'transparent', border: '1px solid rgba(200,220,20,0.3)',
                borderRadius: 4, color: 'rgba(240,235,224,0.6)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {authError && (
                <div style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginBottom: 8 }}>{authError}</div>
              )}
              <button onClick={handleSignIn} style={{
                padding: '8px 18px', background: 'rgba(200,220,20,0.15)', border: '1px solid rgba(200,220,20,0.5)',
                borderRadius: 4, color: '#c8dc14', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 500, letterSpacing: '0.04em',
              }}>
                Sign in with GitHub
              </button>
            </div>
          )}

          {session && (
            <div style={{ marginBottom: 20 }}>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Leave a note…"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', background: '#111',
                  border: '1px solid rgba(200,220,20,0.3)', borderRadius: 4,
                  color: '#f0ebe0', fontSize: 13, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', marginBottom: 8,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>
                  {remainingNotes} of {MAX_NOTES} notes left · {message.length}/{MAX_MESSAGE_LENGTH}
                </span>
                <button onClick={handlePost} disabled={posting || !message.trim()} style={{
                  padding: '7px 16px', background: 'rgba(200,220,20,0.15)', border: '1px solid rgba(200,220,20,0.5)',
                  borderRadius: 4, color: '#c8dc14', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  opacity: posting || !message.trim() ? 0.4 : 1,
                }}>
                  {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
              {error && (
                <div style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginTop: 8 }}>{error}</div>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>Loading entries…</span>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>No entries yet.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {entries.map(entry => {
                const counts = reactionCounts(entry)
                return (
                  <div key={entry.id} style={{
                    background: '#0d0d0d', border: '1px solid rgba(240,235,224,0.08)',
                    borderRadius: 4, padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <img
                          src={entry.github_avatar}
                          alt=""
                          width={20}
                          height={20}
                          style={{ borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                        />
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,235,224,0.6)' }}>
                          {entry.github_username}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.25)' }}>
                          {timeAgo(entry.created_at)}
                        </span>
                      </div>
                      {isOwner && (
                        <button onClick={() => handleDeleteEntry(entry.id)} title="Delete entry" aria-label="Delete entry" style={{
                          padding: '2px 8px', background: 'transparent', border: '1px solid rgba(255,80,80,0.4)',
                          borderRadius: 4, color: 'rgba(255,80,80,0.7)', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          Delete
                        </button>
                      )}
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: '#f0ebe0', lineHeight: 1.45, wordBreak: 'break-word' }}>
                      {entry.message}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {EMOJIS.map(emoji => {
                        const mine = reactionForUser(entry, emoji)
                        const count = counts[emoji]
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(entry.id, emoji)}
                            title={session ? 'React' : 'Sign in to react'}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '3px 8px', background: mine ? 'rgba(200,220,20,0.15)' : '#111',
                              border: `1px solid ${mine ? 'rgba(200,220,20,0.5)' : 'rgba(240,235,224,0.1)'}`,
                              borderRadius: 20, color: '#f0ebe0', fontSize: 12,
                              cursor: session ? 'pointer' : 'default', fontFamily: 'inherit',
                            }}
                          >
                            <span>{emoji}</span>
                            <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.5)' }}>{count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/GuestbookSection.jsx
git commit -m "add guestbook section component"
```

---

### Task 3: Wire into App and verify

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `GuestbookSection` (default export, no props) from `./components/GuestbookSection`.
- Produces: guestbook rendered above `<Footer />` on the live page.

- [ ] **Step 1: Import and render the section**

In `src/App.jsx` (current imports at lines 1-5, render at lines 15-26):

```jsx
import { useRef } from 'react'
import useNowPlaying from './hooks/useNowPlaying'
import HeroSection from './components/HeroSection'
import FeedSection from './components/FeedSection'
import GuestbookSection from './components/GuestbookSection'
import Footer from './components/Footer'
```

Render it between `<FeedSection ref={feedRef} />` and `<Footer />`:

```jsx
      <FeedSection ref={feedRef} />
      <GuestbookSection />
      <Footer />
```

- [ ] **Step 2: Build and run dev server**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`
Expected: at the bottom of the page, above the footer, the Guestbook section renders with "Sign in with GitHub" and "No entries yet."

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "wire guestbook section into app"
```

---

### Task 4: Manual verification and deploy

**Files:**
- None (verification + git operations only)

**Interfaces:**
- Consumes: everything from Tasks 1-3, plus the user's GitHub OAuth App configured in Supabase.

- [ ] **Step 1: Confirm GitHub OAuth is configured**

User must have already done:
1. Created a GitHub OAuth App at https://github.com/settings/developers (Authorization callback URL: `https://ovywpamkhjzdxbotkorw.supabase.co/auth/v1/callback`).
2. Added Client ID + Client Secret in Supabase Dashboard → Authentication → Providers → GitHub → enabled.
3. (Supabase on free tier with GitHub provider works without SMTP setup.)

- [ ] **Step 2: Verify on the Vercel dev preview**

1. Push `dev` to origin (deploys the Vercel preview automatically).
2. Open the preview URL. Scroll to Guestbook.
3. Click "Sign in with GitHub" → authorize → redirected back signed in.
4. Post a note → appears at top of list with avatar + username.
5. Post 2 more notes → "0 of 3 notes left"; a 4th post is blocked with "Max 3 notes per account".
6. Click 👍 / 🔥 / ❤️ / 😄 → count increments, button highlights. Click again → toggles off.
7. Confirm other reaction buttons are disabled for anonymous users when signed out (visible in Task 2 code: cursor default, no-op).
8. Sign out, confirm reactions still show counts but aren't clickable.

- [ ] **Step 3: Verify owner delete as jizzy002**

1. Sign in as the owner GitHub account.
2. Delete a test entry via the "Delete" control.
3. Confirm the entry disappears immediately.

- [ ] **Step 4: Deploy to production**

```bash
git push origin dev
git checkout master
git merge dev --ff-only
git push origin master
git checkout dev
```

- [ ] **Step 5: Verify production**

1. Open https://aldjan.com → scroll to Guestbook.
2. Spot-check: entries render, sign-in works, reactions toggle, owner delete works.

---

## Self-Review Notes

- **Spec coverage:** GitHub login (Task 4 Step 1-2), max 3 notes (Task 2 `handlePost` + UI counter), reactions fixed set toggled (Task 2 `handleToggleReaction` + `EMOJIS`), owner delete (Task 2 `isOwner` + RLS policy in Task 1), RLS tables (Task 1), placement above footer (Task 3), graceful degradation when env missing (Task 2 `if (!supabase)` branch).
- **Type consistency:** All handlers named consistently (`handleSignIn`, `handleSignOut`, `handlePost`, `handleToggleReaction`, `handleDeleteEntry`); `session.user.user_metadata.user_name` used in both component and RLS `auth.jwt() -> 'user_metadata' ->> 'user_name'` — the two must match for owner delete to work.
- **Placeholder scan:** No TBD/TODO; all code is complete.
