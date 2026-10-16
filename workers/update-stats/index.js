// Cloudflare Worker: password-gated write of the stats row (deployed via the Cloudflare
// dashboard; this file is the source of truth to paste there).
// Env: PASSWORD (secret), SUPABASE_URL, SUPABASE_SERVICE_KEY (secret).
// Optional: RATE_LIMITER (Workers rate-limiting binding) — add it to cap attempts per IP.

const ALLOWED_ORIGINS = [
  'https://aldjan.com',
  'https://dev.aldjan.com',
  'https://aldjancom-dev.vercel.app',
  'http://localhost:3000',
]
const MAX_BODY = 2048 // bytes
const FAIL_DELAY_MS = 800 // slows down password guessing

function cors(request) {
  const origin = request.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } })
}

// constant-time comparison (hash both so lengths match)
async function safeEqual(a, b) {
  const enc = new TextEncoder()
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(String(a))),
    crypto.subtle.digest('SHA-256', enc.encode(String(b))),
  ])
  return crypto.subtle.timingSafeEqual(ha, hb)
}

// stats must be exactly [[value, label], ...] with short strings
function validStats(stats) {
  return Array.isArray(stats) && stats.length >= 1 && stats.length <= 6 &&
    stats.every(s => Array.isArray(s) && s.length === 2 &&
      typeof s[0] === 'string' && s[0].length > 0 && s[0].length <= 12 &&
      typeof s[1] === 'string' && s[1].length > 0 && s[1].length <= 20)
}

export default {
  async fetch(request, env) {
    const headers = cors(request)

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, headers)
    if (!ALLOWED_ORIGINS.includes(request.headers.get('Origin'))) return json({ error: 'Forbidden' }, 403, headers)

    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
      const { success } = await env.RATE_LIMITER.limit({ key: ip })
      if (!success) return json({ error: 'Too many attempts' }, 429, headers)
    }

    const raw = await request.text()
    if (raw.length > MAX_BODY) return json({ error: 'Payload too large' }, 413, headers)
    let body
    try {
      body = JSON.parse(raw)
    } catch {
      return json({ error: 'Invalid JSON' }, 400, headers)
    }
    const { password, stats } = body || {}

    if (!env.PASSWORD || !(await safeEqual(password, env.PASSWORD))) {
      await new Promise(r => setTimeout(r, FAIL_DELAY_MS))
      return json({ error: 'Wrong password' }, 401, headers)
    }
    if (!validStats(stats)) return json({ error: 'Invalid stats' }, 400, headers)

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/stats?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ data: stats }),
    })

    if (!res.ok) return json({ error: 'Failed to save' }, 500, headers)
    return json({ ok: true }, 200, headers)
  },
}
