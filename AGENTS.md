# aldjan.com

## Deployment mapping

- `dev` branch → **Vercel** (`aldjancom-dev`) → `dev.aldjan.com` (preview)
- `master` branch → **Cloudflare Pages** → `aldjan.com` (live)

## Env vars

- `VITE_*` vars (incl. `VITE_GOOGLE_CLIENT_ID`) must be set in **both** Cloudflare Pages and Vercel.
- Secrets (`PASSWORD`, `SUPABASE_SERVICE_KEY`) live only in the Cloudflare Worker (`stats.aldjan.workers.dev`), never in the client bundle or the repo.

## Google OAuth

- The Google OAuth web client ID is shared between the Supabase Google provider and the client-side GIS popup; it must stay identical (`VITE_GOOGLE_CLIENT_ID`).
- Authorized JavaScript origins must cover every host the app runs on: `https://aldjan.com`, `https://dev.aldjan.com`, `http://localhost:3000`.
