import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const OWNER_USERNAME = 'jizzy002'
const MAX_NOTES = 3
const MAX_MESSAGE_LENGTH = 300
const EMOJIS = ['👍', '🔥', '❤️', '😄']

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

export default function GuestbookSection() {
  const [session, setSession] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [authError, setAuthError] = useState('')
  const [usedNotes, setUsedNotes] = useState(0)

  const loadEntries = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('guestbook_entries')
      .select('*, guestbook_reactions(*)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setEntries(data)
  }, [])

  const loadUsedNotes = useCallback(async userId => {
    if (!supabase || !userId) return
    const { count } = await supabase
      .from('guestbook_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    setUsedNotes(count ?? 0)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadUsedNotes(data.session.user.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) loadUsedNotes(newSession.user.id)
    })
    loadEntries().finally(() => setLoading(false))
    return () => sub.subscription.unsubscribe()
  }, [loadEntries, loadUsedNotes])

  async function handleSignIn() {
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
    if (error) setAuthError('Login cancelled or failed')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  async function handlePost() {
    const text = message.trim()
    if (!text || posting || !session) return
    setPosting(true)
    setError('')

    if (text.length > MAX_MESSAGE_LENGTH) {
      setError(`Max ${MAX_MESSAGE_LENGTH} characters`)
      setPosting(false)
      return
    }

    const { count } = await supabase
      .from('guestbook_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
    if (count >= MAX_NOTES) {
      setError(`Max ${MAX_NOTES} notes per account`)
      setPosting(false)
      return
    }

    const { error: insertError } = await supabase
      .from('guestbook_entries')
      .insert({
        user_id: session.user.id,
        github_username: session.user.user_metadata?.user_name || 'github-user',
        github_avatar: session.user.user_metadata?.avatar_url || '',
        message: text,
      })
    if (insertError) {
      setError('Failed to post — try again')
      setPosting(false)
      return
    }
    setMessage('')
    setUsedNotes(prev => prev + 1)
    await loadEntries()
    setPosting(false)
  }

  async function handleToggleReaction(entryId, emoji) {
    if (!session) return
    const existing = await supabase
      .from('guestbook_reactions')
      .select('id')
      .eq('entry_id', entryId)
      .eq('user_id', session.user.id)
      .eq('emoji', emoji)
      .maybeSingle()
    if (existing.data) {
      await supabase.from('guestbook_reactions').delete().eq('id', existing.data.id)
    } else {
      await supabase.from('guestbook_reactions').insert({
        entry_id: entryId,
        user_id: session.user.id,
        emoji,
      })
    }
    await loadEntries()
  }

  async function handleDeleteEntry(entryId) {
    await supabase.from('guestbook_entries').delete().eq('id', entryId)
    await loadEntries()
  }

  if (!supabase) {
    return (
      <section style={{ padding: '0 24px 80px' }}>
        <div className="feed-container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Guestbook unavailable
          </span>
        </div>
      </section>
    )
  }

  const isOwner = session?.user?.user_metadata?.user_name === OWNER_USERNAME
  const remainingNotes = MAX_NOTES - usedNotes

  function reactionCounts(entry) {
    const counts = {}
    for (const emoji of EMOJIS) counts[emoji] = 0
    for (const r of entry.guestbook_reactions || []) {
      if (counts[r.emoji] !== undefined) counts[r.emoji] += 1
    }
    return counts
  }

  function reactionForUser(entry, emoji) {
    return (entry.guestbook_reactions || []).find(
      r => r.emoji === emoji && session && r.user_id === session.user.id
    )
  }

  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div className="feed-container">

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Guestbook
          </span>
        </div>

        <div style={{
          background: 'rgba(8,8,8,0.97)',
          border: '1px solid rgba(200,220,20,0.4)',
          borderRadius: 6,
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
          padding: 22,
        }}>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <img
                  src={session.user.user_metadata?.avatar_url || ''}
                  alt=""
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                />
                <span style={{ fontSize: 13, color: '#f0ebe0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.user_metadata?.user_name || 'Signed in'}
                </span>
              </div>
              <button onClick={handleSignOut} style={{
                padding: '6px 12px', background: 'transparent', border: '1px solid rgba(200,220,20,0.3)',
                borderRadius: 4, color: 'rgba(240,235,224,0.6)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {authError && (
                <div style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginBottom: 8 }}>{authError}</div>
              )}
              <button onClick={handleSignIn} style={{
                padding: '8px 18px', background: 'rgba(200,220,20,0.15)', border: '1px solid rgba(200,220,20,0.5)',
                borderRadius: 4, color: '#c8dc14', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 500, letterSpacing: '0.04em',
              }}>
                Sign in with GitHub
              </button>
            </div>
          )}

          {session && (
            <div style={{ marginBottom: 20 }}>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Leave a note…"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', background: '#111',
                  border: '1px solid rgba(200,220,20,0.3)', borderRadius: 4,
                  color: '#f0ebe0', fontSize: 13, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', marginBottom: 8,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>
                  {remainingNotes} of {MAX_NOTES} notes left · {message.length}/{MAX_MESSAGE_LENGTH}
                </span>
                <button onClick={handlePost} disabled={posting || !message.trim()} style={{
                  padding: '7px 16px', background: 'rgba(200,220,20,0.15)', border: '1px solid rgba(200,220,20,0.5)',
                  borderRadius: 4, color: '#c8dc14', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  opacity: posting || !message.trim() ? 0.4 : 1,
                }}>
                  {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
              {error && (
                <div style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginTop: 8 }}>{error}</div>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>Loading entries…</span>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 11, color: 'rgba(240,235,224,0.35)' }}>No entries yet.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {entries.map(entry => {
                const counts = reactionCounts(entry)
                return (
                  <div key={entry.id} style={{
                    background: '#0d0d0d', border: '1px solid rgba(240,235,224,0.08)',
                    borderRadius: 4, padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <img
                          src={entry.github_avatar}
                          alt=""
                          width={20}
                          height={20}
                          style={{ borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                        />
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,235,224,0.6)' }}>
                          {entry.github_username}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.25)' }}>
                          {timeAgo(entry.created_at)}
                        </span>
                      </div>
                      {isOwner && (
                        <button onClick={() => handleDeleteEntry(entry.id)} title="Delete entry" aria-label="Delete entry" style={{
                          padding: '2px 8px', background: 'transparent', border: '1px solid rgba(255,80,80,0.4)',
                          borderRadius: 4, color: 'rgba(255,80,80,0.7)', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          Delete
                        </button>
                      )}
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: '#f0ebe0', lineHeight: 1.45, wordBreak: 'break-word' }}>
                      {entry.message}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {EMOJIS.map(emoji => {
                        const mine = reactionForUser(entry, emoji)
                        const count = counts[emoji]
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(entry.id, emoji)}
                            title={session ? 'React' : 'Sign in to react'}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '3px 8px', background: mine ? 'rgba(200,220,20,0.15)' : '#111',
                              border: `1px solid ${mine ? 'rgba(200,220,20,0.5)' : 'rgba(240,235,224,0.1)'}`,
                              borderRadius: 20, color: '#f0ebe0', fontSize: 12,
                              cursor: session ? 'pointer' : 'default', fontFamily: 'inherit',
                            }}
                          >
                            <span>{emoji}</span>
                            <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.5)' }}>{count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
