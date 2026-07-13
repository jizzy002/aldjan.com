# aldjan.com

Minimalist motorcycle-rider landing page. Built with **React 19** + **Vite 8**.

**Live:** [aldjan.com](https://aldjan.com) · **Preview:** [`aldjan.pages.dev`](https://aldjan.pages.dev)

## Features

- **Helmet hotspots** — interactive dots on the LS2 Strobe II helmet (Gear info, Instagram link)
- **Last.fm now-playing** — polls every 25s, shows currently scrobbling track + recent queue with a pulsing green dot
- **Garage tabs** — bike showcase in the feed section (Lucille: Suzuki GSX750F, Kawi: Kawasaki EN500), side by side with Instagram on desktop
- **Social links** — Facebook, Snapchat, Telegram, LinkedIn, YouTube, TikTok via Font Awesome
- **Instagram feed** — SnapWidget embed with latest posts
- **Global editable stats** — Supabase-backed stats row (Followers, Kilometers, Countries). Tap 3× within 3 seconds to open an in-app editor (password-gated, validated server-side via Cloudflare Worker)
- **Minimalist dark theme** — grid background, lime-green accents, custom serif heading, matching card components
- **Responsive** — clamp-based sizing, two-column feed layout on desktop (≥768px)

## Quick Start

Create `.env` in the project root:

```env
# Last.fm (required for now-playing)
VITE_LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_USERNAME=your_lastfm_username

# Supabase (required for editable stats)
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```sh
npm install
npm run dev        # dev server at localhost:3000
npm run build      # production build to dist/
```

### Dev-only env vars

These are never bundled in production — only used as a fallback when the Cloudflare Worker is unreachable:

```env
VITE_STATS_PASSWORD=your_dev_password
```

## Project Structure

```
src/
  App.jsx                      — thin orchestrator
  main.jsx                     — entry point
  index.css                    — global styles, keyframes, social-link hover
  hooks/
    useNowPlaying.js           — Last.fm polling + hint state machine
  lib/
    supabase.js                — Supabase client (null if env vars missing)
  components/
    HeroSection.jsx            — hero layout (grid, name, tagline, helmet, hotspots, stats)
    StatsSection.jsx           — Supabase-backed stats row + 3-tap editor modal
    MusicHotspot.jsx           — music dot + now-playing popup
    GarageSection.jsx          — bike tabs (Lucille / Kawi) with photos + specs
    FeedSection.jsx            — social links + Garage + Instagram embed (responsive two-column)
    Footer.jsx                 — copyright line
  imports/                     — helmet + bike images (WebP + PNG fallback)
  public/
    sitemap.xml                  — search-engine sitemap
    robots.txt                   — crawl rules
    favicon.ico, *.png           — favicons + apple-touch-icon
  workers/
    update-stats/index.js        — Cloudflare Worker source code (password validation + Supabase write)
```

## Stack

- React 19, Vite 8, Terser (minification)
- Font Awesome 6.7.2 (CDN)
- Google Fonts: DM Sans + Playfair Display
- Supabase (database + RLS for stats)
- Cloudflare Worker (password validation, secure writes)
- Hosted on Cloudflare Pages

## Deployment

The site deploys automatically via Cloudflare Pages on push to `master`.

### Environment variables

Set these in **Cloudflare Dashboard → Workers & Pages → your project → Settings → Environment variables**:

| Variable | Notes |
|----------|-------|
| `VITE_SUPABASE_URL` | Public (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Public (client-side, RLS-gated) |
| `VITE_LASTFM_API_KEY` | Public (client-side) |
| `VITE_LASTFM_USERNAME` | Public (client-side) |

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
- `PASSWORD` and `SUPABASE_SERVICE_KEY` are set in Cloudflare only, **never** in the client bundle
- The Supabase service role bypasses RLS, so the password is the only gate for writing stats

## Dev notes

- Branch: `dev` for active development
- `.vscode/tasks.json` — auto-opens an `opencode` WSL terminal on folder open
- All images pre-optimized as WebP with PNG fallbacks
