# aldjan.com

Minimalist motorcycle-rider landing page. Built with **React 19** + **Vite 8**.

**Live:** [`aldjan.com`](https://aldjan.com) · **Preview:** [`dev.aldjan.com`](https://dev.aldjan.com) · **Vercel:** [`aldjancom-dev.vercel.app`](https://aldjancom-dev.vercel.app)

## Features

- **360° helmet** — drag/swipe (with momentum) or use the arrow keys to turn the LS2 Strobe II through 48 real turntable photos (canvas, progressively preloaded, 640px set on mobile). No scroll-jacking: vertical swipes still scroll the page. A short wiggle on load hints that it turns (skipped with `prefers-reduced-motion`). Falls back to the static illustration if frames fail to load
- **Helmet hotspots** — interactive dots on the helmet (Instagram link, Gear info); they show when the helmet faces front
- **Window light** — a decorative light ray from the left page edge (behind the helmet, never relights the photos) with a lever switch on the edge (click, flick or arrow keys; remembered per visitor). Toggle both in code via `LIGHT_RAY` / `LIGHT_SWITCH` in `HeroSection.jsx`
- **Last.fm now-playing** — polls every 7.5s (and on tab return). The music dot rides on the helmet's intercom unit and only appears when you turn the intercom into view; the popup re-positions itself to stay on screen
- **Garage tabs** — bike showcase in the feed section (Lucille: Suzuki GSX750F, Kawi: Kawasaki EN500), side by side with Instagram on desktop
- **Social links** — Facebook, Snapchat, Telegram, LinkedIn, YouTube, TikTok via Font Awesome
- **Instagram feed** — SnapWidget embed with latest posts
- **Global editable stats** — Supabase-backed stats row (Followers, Kilometers, Countries). Tap 3× within 3 seconds to open an in-app editor (password-gated, validated server-side via Cloudflare Worker)
- **Guestbook** — visitors sign in with **GitHub** or **Google** and leave up to 3 notes with reactions. Identities and limits are enforced server-side (Supabase RLS + trigger). Google sign-in uses the **Google Identity Services** one-tap popup, so the URL bar never shows `supabase.co`
- **Minimalist dark theme** — black background with a slowly drifting lime grid and a cursor spotlight, lime accents, Playfair Display + DM Sans, shared design tokens (CSS variables) and card styles
- **Motion** — staggered hero entrance, scroll-reveal cards, popup animations; all disabled under `prefers-reduced-motion`
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
  App.jsx                      — orchestrator (background grid/spotlight, pinned hero, sections)
  main.jsx                     — entry point
  index.css                    — design tokens, shared classes (card, eyebrow, hotspots), keyframes
  hooks/
    useNowPlaying.js           — Last.fm polling + hint state machine
    useHelmetDrag.js           — drag/swipe/keyboard rotation with momentum and frame snapping
    useReveal.js               — adds .is-visible when an element scrolls into view
  lib/
    supabase.js                — Supabase client (null if env vars missing)
    oiia.js                    — 🐈
  components/
    HeroSection.jsx            — hero layout (name, tagline, helmet, hotspots + intercom track, stats)
    HelmetSequence.jsx         — frame sequence on a canvas (HELMET_FRAMES)
    HotspotDot.jsx             — shared dot + pulse + tooltip
    LightRay.jsx               — decorative window light ray
    LightSwitch.jsx            — lever on the page edge that toggles the light
    StatsSection.jsx           — Supabase-backed stats row + 3-tap editor modal
    MusicHotspot.jsx           — music dot + now-playing popup (viewport-aware placement)
    GarageSection.jsx          — bike tabs (Lucille / Kawi) with photos + specs
    FeedSection.jsx            — social links + Garage + Instagram embed (responsive two-column)
    GuestbookSection.jsx       — guestbook notes, reactions, GitHub/Google sign-in
    Footer.jsx                 — copyright line
  imports/                     — helmet + bike images (WebP + PNG fallback)
public/
  helmet/                      — 48 turntable frames (960px WebP) + sm/ (640px)
  sounds/                      — audio
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

The stats editor password is validated by a Cloudflare Worker at `stats.aldjan.workers.dev`. It only accepts requests from the site's own origins (`ALLOWED_ORIGINS`), compares the password in constant time with a delay on failure, caps the body size and validates the stats shape. For per-IP attempt limits, add a Workers rate-limiting binding named `RATE_LIMITER` (or a Cloudflare WAF rate-limiting rule on the worker route).
Worker variables set in the Cloudflare Dashboard:

| Variable | Notes |
|----------|-------|
| `PASSWORD` | **Secret** — your chosen stats password |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | **Secret** — Supabase service role key |

The Worker source is archived at `workers/update-stats/index.js`.

### Security

- `VITE_` env vars are bundled in the client — they are public by design
- Security headers (nosniff, referrer policy, no third-party framing, permissions policy) are set via `public/_headers` (Cloudflare Pages) and `vercel.json` (Vercel)
- `PASSWORD` and `SUPABASE_SERVICE_KEY` are set in Cloudflare only, **never** in the client bundle or the repo
- The `stats` table allows reads only (`supabase/stats-rls.sql`); all writes require the service role, so the Cloudflare Worker password is the only gate for writing stats
- The guestbook table uses RLS plus a `security definer` trigger that derives `user_id`, names, avatars, and emails from `auth.users`/JWT — the client can't spoof them — and hard-caps 3 notes per account
- Google sign-in uses the Google Identity Services one-tap flow (no server redirect); a fresh SHA-256 **nonce** is generated per sign-in, sent hashed to Google and raw to Supabase, and the ID token is exchanged via `supabase.auth.signInWithIdToken` over HTTPS with signature/aud/exp validation

## Dev notes

- Branch: `master` (live, Cloudflare Pages) and `dev` (preview, Vercel) — see [Deployment](#deployment)
- Testing Google sign-in locally requires `VITE_GOOGLE_CLIENT_ID` in `.env` and `http://localhost:3000` in the Google client's authorized JS origins
- The Google one-tap prompt requires a `https` origin (or `http://localhost`); it won't appear over plain `http` on a LAN IP
- All images pre-optimized as WebP with PNG fallbacks
- Helmet frames come from a blue-backdrop turntable video; the 960px RGBA PNG masters (visor hand-edited for transparency) live in `/helmet/frames-edited/PNG/` (git-ignored). After editing a master, regenerate **both** `public/helmet/helmet-NNN.webp` (960px) and `public/helmet/sm/helmet-NNN.webp` (640px) — phones load `sm/`
- Frame 0 must stay the 3/4 front-right view; if the frames change, update `HELMET_FRAMES` in `HelmetSequence.jsx` and the hotspot coordinates (`HOTSPOTS`, `MUSIC_TRACK`, in % of the unzoomed frame) in `HeroSection.jsx`
