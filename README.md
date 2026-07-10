# aldjan.com

Minimalist motorcycle-rider landing page. Built with **React 19** + **Vite 5**.

**Live:** [aldjan.com](https://aldjan.com)

## Features

- **Helmet hotspots** — interactive dots on the LS2 Strobe II helmet (Garage bike showcase, Gear info, Instagram link)
- **Last.fm now-playing** — polls every 10s, shows currently scrobbling track with a pulsing green dot
- **Garage tabs** — bike photos + specs (Lucille: Suzuki GSX750F, Kawi: Kawasaki EN500)
- **Social links** — Facebook, Snapchat, Telegram, LinkedIn, YouTube, TikTok via Font Awesome
- **Instagram feed** — SnapWidget embed with latest posts
- **Minimalist dark theme** — grid background, lime-green accents, custom serif heading
- **Responsive** — clamp-based sizing, works on mobile and desktop

## Quick Start

Create `.env` in the project root:

```env
VITE_LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_USERNAME=your_lastfm_username
```

```sh
npm install
npm run dev        # dev server at localhost:3000
npm run build      # production build to dist/
```

## Project Structure

```
src/
  App.jsx                      — thin orchestrator
  main.jsx                     — entry point
  index.css                    — global styles, keyframes, social-link hover
  hooks/
    useNowPlaying.js           — Last.fm polling + hint state machine
  components/
    HeroSection.jsx            — hero layout (grid, name, tagline, helmet, hotspots, stats)
    MusicHotspot.jsx           — music dot + now-playing popup
    FeedSection.jsx            — social links + Instagram embed
    Footer.jsx                 — copyright line
  imports/                     — helmet + bike images (WebP + PNG fallback)
```

## Stack

- React 19, Vite 5, Terser (minification)
- Font Awesome 6.7.2 (CDN)
- Google Fonts: DM Sans + Playfair Display
- Deployed on Vercel

## Dev notes

- Branch: `dev` for active development
- `.vscode/tasks.json` — auto-opens an `opencode` WSL terminal on folder open
- `sharp` removed; all images pre-optimized as WebP
