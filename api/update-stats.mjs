import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, stats } = req.body

  if (password !== process.env.STATS_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error } = await supabase
    .from('stats')
    .update({ data: stats })
    .eq('id', 1)

  if (error) {
    console.error('Supabase update error:', error)
    return res.status(500).json({ error: 'Failed to save' })
  }

  return res.status(200).json({ ok: true })
}
