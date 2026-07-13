import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_STATS = [['1.4k', 'Followers'], ['40k+', 'Kilometers'], ['9', 'Countries']]

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [edits, setEdits] = useState([])
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(false)
  const [saving, setSaving] = useState(false)
  const tapTimestamps = useRef([])
  const flashTimer = useRef(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('stats').select('data').eq('id', 1).single()
      .then(({ data }) => {
        if (data?.data) setStats(data.data)
      })
      .catch(() => {})
  }, [])

  function handleTap() {
    const now = Date.now()
    tapTimestamps.current = tapTimestamps.current.filter(t => now - t < 3000)
    tapTimestamps.current.push(now)

    setFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(false), 200)

    if (tapTimestamps.current.length >= 3) {
      setEdits(stats.map(([val]) => val))
      setPassword('')
      setError('')
      setShowModal(true)
      tapTimestamps.current = []
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const updated = stats.map(([_, lbl], i) => [edits[i] || stats[i][0], lbl])

    // Production path: call Vercel serverless API
    try {
      const res = await fetch('https://stats.aldjan.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, stats: updated }),
      })

      if (res.ok) {
        setStats(updated)
        setShowModal(false)
        setSaving(false)
        return
      }

      if (res.status === 401) {
        setError('Wrong password')
        setSaving(false)
        return
      }

      const data = await res.json()
      if (import.meta.env.DEV) {
        throw new Error('API unavailable, trying dev fallback')
      }
      setError(data.error || 'Failed to save')
      setSaving(false)
      return
    } catch {
      // Dev fallback: local password + direct Supabase write
      if (!import.meta.env.DEV) {
        setError('Failed to save')
        setSaving(false)
        return
      }
    }

    const devPassword = import.meta.env.VITE_STATS_PASSWORD
    if (password !== devPassword) {
      setError('Wrong password')
      setSaving(false)
      return
    }

    if (!supabase) {
      setStats(updated)
      setShowModal(false)
      setSaving(false)
      return
    }

    supabase.from('stats').update({ data: updated }).eq('id', 1)
      .then(() => {
        setStats(updated)
        setShowModal(false)
        setSaving(false)
      })
      .catch(() => {
        setError('Failed to save')
        setSaving(false)
      })
  }

  const rowStyle = {
    display: 'flex', gap: 'clamp(16px, 3vw, 48px)', marginTop: 'clamp(12px, 2vh, 32px)',
    paddingTop: 'clamp(10px, 2vh, 28px)',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    opacity: flash ? 0.5 : 1,
  }

  return (
    <>
      <div style={rowStyle} onClick={handleTap}>
        {stats.map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 'clamp(11px, 2.2vh, 22px)', fontWeight: 500, color: flash ? '#c8dc14' : '#f0ebe0', letterSpacing: '-0.02em', transition: 'color 0.1s' }}>{val}</p>
            <p style={{ margin: 0, fontSize: 'clamp(7px, 1.2vh, 13px)', color: 'rgba(240,235,224,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 'clamp(1px, 0.3vh, 3px)' }}>{lbl}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(8,8,8,0.97)',
            border: '1px solid rgba(200,220,20,0.4)',
            borderRadius: 8,
            boxShadow: '0 6px 32px rgba(0,0,0,0.8)',
            padding: 24,
            minWidth: 300,
          }}>
            <div style={{ fontSize: 12, color: 'rgba(200,220,20,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 500 }}>
              Edit Stats
            </div>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              style={{
                width: '100%', marginBottom: 12, padding: '8px 10px',
                background: '#111', border: '1px solid rgba(200,220,20,0.3)',
                borderRadius: 4, color: '#f0ebe0', fontSize: 13,
                outline: 'none', fontFamily: 'inherit',
              }}
            />

            {stats.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <input
                  value={edits[i] || ''}
                  onChange={e => setEdits(prev => { const next = [...prev]; next[i] = e.target.value; return next })}
                  style={{
                    width: 100, padding: '6px 8px',
                    background: '#111', border: '1px solid rgba(200,220,20,0.3)',
                    borderRadius: 4, color: '#f0ebe0', fontSize: 13,
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>{stats[i][1]}</span>
              </div>
            ))}

            {error && (
              <div style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginBottom: 8 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} disabled={saving} style={{
                padding: '6px 14px', background: 'transparent', border: '1px solid rgba(200,220,20,0.3)',
                borderRadius: 4, color: 'rgba(240,235,224,0.6)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                opacity: saving ? 0.4 : 1,
              }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '6px 14px', background: 'rgba(200,220,20,0.15)', border: '1px solid rgba(200,220,20,0.5)',
                borderRadius: 4, color: '#c8dc14', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                opacity: saving ? 0.4 : 1,
              }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
