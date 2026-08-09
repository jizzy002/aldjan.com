# aldjan.com

Minimalist motorcycle-rider landing page. Built with **React 19** + **Vite 8**.

**Live:** [`aldjan.com`](https://aldjan.com) · **Preview:** [`dev.aldjan.com`](https://dev.aldjan.com) · **Vercel:** [`aldjancom-dev.vercel.app`](https://aldjancom-dev.vercel.app)

## Features

- **Helmet hotspots** — interactive dots on the LS2 Strobe II helmet (Gear info, Instagram link)
- **Last.fm now-playing** — polls every 25s, shows currently scrobbling track + recent queue with a pulsing green dot
- **Garage tabs** — bike showcase in the feed section (Lucille: Suzuki GSX750F, Kawi: Kawasaki EN500), side by side with Instagram on desktop
- **Social links** — Facebook, Snapchat, Telegram, LinkedIn, YouTube, TikTok via Font Awesome
- **Instagram feed** — SnapWidget embed with latest posts
- **Global editable stats** — Supabase-backed stats row (Followers, Kilometers, Countries). Tap 3× within 3 seconds to open an in-app editor (password-gated, validated server-side via Cloudflare Worker)
- **Guestbook** — visitors sign in with **GitHub** or **Google** and leave up to 3 notes with reactions. Identities and limits are enforced server-side (Supabase RLS + trigger). Google sign-in uses the **Google Identity Services** one-tap popup, so the URL bar never shows `supabase.co`
- **Minimalist dark theme** — plain black background with a site-wide lime grid (fixed, 48px cells, fades out at the top and bottom of the viewport), lime-green accents, custom serif heading, matching card components
- **Responsive** — clamp-based sizing, two-column feed layout on desktop (≥768px)

## Quick Start

Create `.env` in the project root:

```env
# Last.fm (required for now-playing)
VITE_LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_USERNAME=your_lastfm_username

# Supabase (required for editable stats + guestbook)
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Google OAuth (required for guestbook Google sign-in)
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

`VITE_GOOGLE_CLIENT_ID` must be the **same** Google OAuth web client ID configured in Supabase Auth, and your site origin must be listed in the client's **Authorized JavaScript origins** (see [Guestbook setup](#guestbook-setup)).

```sh
npm install
npm run dev        # dev server at localhost:3000
npm run build      # production build to dist/
```

## Project Structure

```
src/
  App.jsx                      — thin orchestrator (site-wide lime grid + section layout)
  main.jsx                     — entry point
  index.css                    — global styles, keyframes, social-link hover
  hooks/
    useNowPlaying.js           — Last.fm polling + hint state machine
  lib/
    supabase.js                — Supabase client (null if env vars missing)
  components/
    HeroSection.jsx            — hero layout (name, tagline, helmet, hotspots, stats)
    StatsSection.jsx           — Supabase-backed stats row + 3-tap editor modal
    MusicHotspot.jsx           — music dot + now-playing popup
    GarageSection.jsx          — bike tabs (Lucille / Kawi) with photos + specs
    FeedSection.jsx            — social links + Garage + Instagram embed (responsive two-column)
    GuestbookSection.jsx       — guestbook notes, reactions, GitHub/Google sign-in
    Footer.jsx                 — copyright line
  imports/                     — helmet + bike images (WebP + PNG fallback)
public/
  sitemap.xml                  — search-engine sitemap
  robots.txt                   — crawl rules
  favicon.ico, *.png           — favicons + apple-touch-icon
supabase/
  stats-rls.sql                — RLS lockdown for the stats table (writes = service role only)
  guestbook.sql                — guestbook tables, RLS policies, and limits trigger
workers/
  update-stats/index.js        — Cloudflare Worker source (password validation + Supabase write)
```

## Stack

- React 19, Vite 8, Terser (minification)
- Font Awesome 6.7.2 (CDN)
- Google Fonts: DM Sans + Playfair Display
- Supabase (database + RLS + Auth for stats and guestbook)
- Google Identity Services (one-tap popup for Google sign-in)
- Cloudflare Worker (password validation, secure stats writes)
- Hosted on Cloudflare Pages (live) + Vercel (preview)

## Deployment

| Branch | Host | URL |
|--------|------|-----|
| `master` | **Cloudflare Pages** | `aldjan.com` (live) |
| `dev` | **Vercel** (`aldjancom-dev`) | `dev.aldjan.com` (preview) |

Both deploy automatically on push to their branch.

### Environment variables

Set these in **both** Cloudflare Pages and Vercel (Dashboard → project → Settings → Environment variables):

| Variable | Notes |
|----------|-------|
| `VITE_SUPABASE_URL` | Public (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Public (client-side, RLS-gated) |
| `VITE_LASTFM_API_KEY` | Public (client-side) |
| `VITE_LASTFM_USERNAME` | Public (client-side) |
| `VITE_GOOGLE_CLIENT_ID` | Public (client-side) — Google OAuth web client ID |

### Guestbook setup

1. In **Supabase → Authentication → Providers**, enable **Google** and paste the Google OAuth web client ID.
2. In **Google Cloud Console**, the same client ID must have every app host in **Authorized JavaScript origins**:
   - `https://aldjan.com`
   - `https://dev.aldjan.com`
   - `http://localhost:3000`
3. Run `supabase/guestbook.sql` in the Supabase SQL editor (tables, RLS, limits trigger) — includes `drop policy if exists` guards, safe to re-run.

### Cloudflare Worker

The stats editor password is validated by a Cloudflare Worker at `stats.aldjan.workers.dev`.
Worker variables set in the Cloudflare Dashboard:

| Variable | Notes |
|----------|-------|
| `PASSWORD` | **Secret** — your chosen stats password |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | **Secret** — Supabase service role key |

The Worker source is archived at `workers/update-stats/index.js`.

### Security

- `VITE_` env vars are bundled in the client — they are public by design
- `PASSWORD` and `SUPABASE_SERVICE_KEY` are set in Cloudflare only, **never** in the client bundle or the repo
- The `stats` table allows reads only (`supabase/stats-rls.sql`); all writes require the service role, so the Cloudflare Worker password is the only gate for writing stats
- The guestbook table uses RLS plus a `security definer` trigger that derives `user_id`, names, avatars, and emails from `auth.users`/JWT — the client can't spoof them — and hard-caps 3 notes per account
- Google sign-in uses the Google Identity Services one-tap flow (no server redirect); a fresh SHA-256 **nonce** is generated per sign-in, sent hashed to Google and raw to Supabase, and the ID token is exchanged via `supabase.auth.signInWithIdToken` over HTTPS with signature/aud/exp validation

## Dev notes

- Branch: `master` (live, Cloudflare Pages) and `dev` (preview, Vercel) — see [Deployment](#deployment)
- Testing Google sign-in locally requires `VITE_GOOGLE_CLIENT_ID` in `.env` and `http://localhost:3000` in the Google client's authorized JS origins
- The Google one-tap prompt requires a `https` origin (or `http://localhost`); it won't appear over plain `http` on a LAN IP
- All images pre-optimized as WebP with PNG fallbacks
