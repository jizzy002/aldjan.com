import { useState } from 'react'

export default function MusicHotspot({
  nowPlaying,
  recentTracks,
  musicHintState,
  setMusicHintState,
  isActive,
  onToggle,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  supportsHover,
  style,
}) {
  const [showRecent, setShowRecent] = useState(false)
  return (
    <div data-hotspot style={style}>
      {/* Pulse ring */}
      {!isActive && nowPlaying?.isPlaying && (
        <span aria-hidden style={{
          position: 'absolute',
          top: -14, left: -14,
          width: 28, height: 28,
          borderRadius: '50%',
          border: '1px solid rgba(26,217,128,0.6)',
          animation: 'musicPulse 1.2s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Dot */}
      <button
        onClick={() => { onToggle(); setMusicHintState('done') }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={nowPlaying?.isPlaying ? `Now playing: ${nowPlaying.track}` : 'Last.fm'}
        style={{
          position: 'absolute',
          top: -22, left: -22,
          width: 44, height: 44,
          borderRadius: '50%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          width: 11, height: 11,
          borderRadius: '50%',
          background: isActive || nowPlaying?.isPlaying ? '#1adb80' : 'rgba(240,235,224,0.3)',
          border: `2px solid ${isActive || nowPlaying?.isPlaying ? 'rgba(255,255,255,0.6)' : 'rgba(240,235,224,0.15)'}`,
          boxShadow: isActive || nowPlaying?.isPlaying ? '0 0 18px rgba(26,217,128,1)' : 'none',
          transition: 'all 0.18s ease',
        }} />

        {/* Hover tooltip */}
        {supportsHover && !isActive && isHovered && (
          <span style={{
            position: 'absolute',
            top: -12, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'rgba(240,235,224,0.7)',
            background: 'rgba(8,8,8,0.92)',
            padding: '3px 9px',
            borderRadius: 3,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            border: '1px solid rgba(26,219,128,0.25)',
          }}>
            {nowPlaying?.isPlaying ? 'Now Playing' : 'Last.fm'}
          </span>
        )}
      </button>

      {/* Initial 'now playing' hint */}
      {(musicHintState === 'showing' || musicHintState === 'hiding') && nowPlaying?.isPlaying && (
        <span style={{
          position: 'absolute',
          top: -48, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: 'rgba(26,217,128,0.8)',
          background: 'rgba(8, 8, 8, 0.57)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: musicHintState === 'showing' ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}>
          ♫ he is listening to something ♫
        </span>
      )}

      {/* Now-playing popup */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          transform: 'translateY(-50%)',
          left: 14,
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}>
          <span aria-hidden style={{
            position: 'absolute', top: '50%', left: -14, width: 14,
            height: 1, background: 'rgba(26,219,128,0.5)',
          }} />
          <div style={{
            background: 'rgba(8,8,8,0.97)',
            border: '1px solid rgba(26,219,128,0.4)',
            borderRadius: 8,
            boxShadow: '0 6px 32px rgba(0,0,0,0.8)',
            padding: 14,
            minWidth: 240,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {nowPlaying?.image && (
                <img
                  src={nowPlaying.image}
                  alt={`${nowPlaying.track} by ${nowPlaying.artist}`}
                  style={{
                    width: 64, height: 64, borderRadius: 6,
                    objectFit: 'cover', flexShrink: 0,
                    ...(nowPlaying?.isPlaying ? {} : { opacity: 0.6 }),
                  }}
                />
              )}
              <div style={nowPlaying?.isPlaying ? { minWidth: 0 } : {}}>
                <div style={{
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  color: nowPlaying?.isPlaying ? 'rgba(26,217,128,0.9)' : 'rgba(240,235,224,0.3)',
                }}>
                  {nowPlaying?.isPlaying ? '♫ Now Playing' : 'Last Played'}
                </div>
                <div style={{
                  fontSize: 14, color: '#f0ebe0', fontWeight: 500, lineHeight: 1.3,
                  ...(nowPlaying?.isPlaying ? { overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
                }}>
                  {nowPlaying ? nowPlaying.track : 'Nothing played yet'}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 2,
                  color: nowPlaying?.isPlaying ? 'rgba(240,235,224,0.5)' : 'rgba(240,235,224,0.4)',
                }}>
                  {nowPlaying ? nowPlaying.artist : ''}
                </div>
              </div>
            </div>

            {recentTracks?.length > 0 && (
              <>
                {!showRecent ? (
                  <div
                    onClick={e => { e.stopPropagation(); setShowRecent(true) }}
                    style={{
                      marginTop: 10, textAlign: 'center', cursor: 'pointer',
                      fontSize: 10, letterSpacing: '0.06em', color: 'rgba(240,235,224,0.35)',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,235,224,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,235,224,0.35)'}
                  >
                    ▸ Show recent ({recentTracks.length})
                  </div>
                ) : (
                  <>
                    <div style={{ margin: '10px 0 8px', height: 1, background: 'rgba(26,219,128,0.15)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                      {recentTracks.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {t.image && (
                            <img src={t.image} alt={`${t.track} by ${t.artist}`} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', flexShrink: 0, opacity: 0.6 }} />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: 'rgba(240,235,224,0.6)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.track}</div>
                            <div style={{ fontSize: 10, color: 'rgba(240,235,224,0.3)' }}>{t.artist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      onClick={e => { e.stopPropagation(); setShowRecent(false) }}
                      style={{
                        marginTop: 8, textAlign: 'center', cursor: 'pointer',
                        fontSize: 10, letterSpacing: '0.06em', color: 'rgba(240,235,224,0.35)',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,235,224,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,235,224,0.35)'}
                    >
                      ▾ Hide recent
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
