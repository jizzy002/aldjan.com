export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }

    const { password, stats } = await request.json()

    if (password !== env.PASSWORD) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), { status: 401 })
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
      return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  },
}
