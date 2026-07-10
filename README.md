# aldjan.com

Minimalist motorcycle-rider landing page. Built with **React 19** + **Vite 5**.

**Live:** [dev.aldjan.com](https://dev.aldjan.com)

## Features

- **Helmet hotspots** — interactive dots on the LS2 Strobe II helmet (Gear info, Instagram link)
- **Last.fm now-playing** — polls every 10s, shows currently scrobbling track with a pulsing green dot
- **Garage tabs** — bike showcase in the feed section (Lucille: Suzuki GSX750F, Kawi: Kawasaki EN500), side by side with Instagram on desktop
- **Social links** — Facebook, Snapchat, Telegram, LinkedIn, YouTube, TikTok via Font Awesome
- **Instagram feed** — SnapWidget embed with latest posts
- **Global editable stats** — Supabase-backed stats row (Followers, Kilometers, Countries). Tap 3× within 3 seconds to open an in-app editor (password-gated, validated server-side via Vercel serverless function)
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

These are never bundled in production — only used as a fallback when the Vercel API is unreachable:

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
api/
  update-stats.mjs             — Vercel serverless function: validates password, writes stats to Supabase
public/
  sitemap.xml                  — search-engine sitemap
  robots.txt                   — crawl rules
  favicon.ico, *.png           — favicons + apple-touch-icon
```

## Stack

- React 19, Vite 5, Terser (minification)
- Font Awesome 6.7.2 (CDN)
- Google Fonts: DM Sans + Playfair Display
- Supabase (database + RLS for stats)
- Vercel serverless functions (password validation, secure writes)
- Hosted on Vercel

## Deployment on Vercel

1. Connect the GitHub repo to Vercel
2. Add these environment variables in Vercel project settings:

| Variable | Required for | Notes |
|----------|-------------|-------|
| `VITE_LASTFM_API_KEY` | Last.fm now-playing | Public (client-side) |
| `VITE_LASTFM_USERNAME` | Last.fm now-playing | Public (client-side) |
| `VITE_SUPABASE_URL` | Stats editor | Public (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Stats editor | Public (client-side, RLS-gated) |
| `STATS_PASSWORD` | Stats editor | **Secret** — server-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | Stats editor | **Secret** — server-side only |

3. Deploy — the `api/update-stats.mjs` function is auto-detected

### Security

- `VITE_` env vars are bundled in the client — they are public by design
- `STATS_PASSWORD` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel only, **never** in `.env` or the client bundle
- The Supabase service role bypasses RLS, so the password is the only gate for writing stats

## Dev notes

- Branch: `dev` for active development
- `.vscode/tasks.json` — auto-opens an `opencode` WSL terminal on folder open
- All images pre-optimized as WebP with PNG fallbacks
