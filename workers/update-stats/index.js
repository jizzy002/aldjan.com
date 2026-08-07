const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: CORS_HEADERS,
      })
    }

    const { password, stats } = await request.json()

    if (password !== env.PASSWORD) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), {
        status: 401,
        headers: CORS_HEADERS,
      })
    }

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/stats?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ data: stats }),
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to save' }), {
        status: 500,
        headers: CORS_HEADERS,
      })
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: CORS_HEADERS,
    })
  },
}
