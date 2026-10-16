import { useLayoutEffect, useRef, useState } from 'react'
import HotspotDot from './HotspotDot'

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
  labelLeft,
  showHint = true,
  style,
}) {
  const [showRecent, setShowRecent] = useState(false)
  const playing = !!nowPlaying?.isPlaying
  const wrapRef = useRef(null)
  const cardRef = useRef(null)
  // 'side' = next to the dot; otherwise { left } = above the dot, clamped inside the viewport
  const [placement, setPlacement] = useState('side')

  useLayoutEffect(() => {
    if (!isActive) return
    const MARGIN = 12
    function fit() {
      const dot = wrapRef.current?.getBoundingClientRect()
      const w = cardRef.current?.offsetWidth
      if (!dot || !w) return
      const vw = document.documentElement.clientWidth
      const sideFits = labelLeft ? dot.left - 18 - w >= MARGIN : dot.left + 18 + w <= vw - MARGIN
      if (sideFits) {
        setPlacement('side')
      } else {
        const left = Math.min(Math.max(dot.left - w / 2, MARGIN), vw - MARGIN - w)
        setPlacement({ left: left - dot.left })
      }
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [isActive, labelLeft, style?.left, style?.top, showRecent, nowPlaying?.track])

  const above = placement !== 'side'

  return (
    <div data-hotspot ref={wrapRef} style={style}>
      <HotspotDot
        label={playing ? `Now playing: ${nowPlaying.track}` : 'Last.fm'}
        tooltip={playing ? 'Now Playing' : 'Last.fm'}
        color="var(--music)"
        isActive={isActive}
        isMuted={!isActive && !playing}
        pulse={playing}
        showTooltip={supportsHover && isHovered}
        onClick={() => { onToggle(); setMusicHintState('done') }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {/* Initial 'now playing' hint */}
      {showHint && (musicHintState === 'showing' || musicHintState === 'hiding') && nowPlaying?.isPlaying && (
        <span style={{
          position: 'absolute',
          top: -48, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: 'rgba(var(--music),0.8)',
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
        <div className={above ? 'pop-in-up' : 'pop-in'} style={{
          position: 'absolute',
          zIndex: 2,
          whiteSpace: 'nowrap',
          ...(above
            ? { bottom: 20, left: placement.left, transformOrigin: 'center bottom' }
            : {
                top: 0,
                transform: 'translateY(-50%)',
                ...(labelLeft ? { right: 18, transformOrigin: 'right center' } : { left: 18, transformOrigin: 'left center' }),
              }),
        }}>
          {!above && (
            <span aria-hidden className="hotspot-connector" style={{
              '--hs': 'var(--music)',
              ...(labelLeft ? { right: -18, width: 18, transformOrigin: 'right' } : { left: -18, width: 18, transformOrigin: 'left' }),
            }} />
          )}
          <div ref={cardRef} className="card" style={{
            borderColor: 'rgba(var(--music),0.35)',
            padding: 14,
            minWidth: 'min(240px, calc(100vw - 24px))',
            maxWidth: 'min(320px, calc(100vw - 24px))',
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
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  color: nowPlaying?.isPlaying ? 'rgba(var(--music),0.9)' : 'rgba(var(--text-rgb),0.3)',
                }}>
                  {nowPlaying?.isPlaying ? '♫ Now Playing' : 'Last Played'}
                </div>
                <div style={{
                  fontSize: 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {nowPlaying ? nowPlaying.track : 'Nothing played yet'}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  color: nowPlaying?.isPlaying ? 'rgba(var(--text-rgb),0.5)' : 'rgba(var(--text-rgb),0.4)',
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
                      fontSize: 10, letterSpacing: '0.06em', color: 'rgba(var(--text-rgb),0.35)',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(var(--text-rgb),0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(var(--text-rgb),0.35)'}
                  >
                    ▸ Show recent ({recentTracks.length})
                  </div>
                ) : (
                  <>
                    <div style={{ margin: '10px 0 8px', height: 1, background: 'rgba(var(--music),0.15)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                      {recentTracks.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {t.image && (
                            <img src={t.image} alt={`${t.track} by ${t.artist}`} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', flexShrink: 0, opacity: 0.6 }} />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: 'rgba(var(--text-rgb),0.6)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.track}</div>
                            <div style={{ fontSize: 10, color: 'rgba(var(--text-rgb),0.3)' }}>{t.artist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      onClick={e => { e.stopPropagation(); setShowRecent(false) }}
                      style={{
                        marginTop: 8, textAlign: 'center', cursor: 'pointer',
                        fontSize: 10, letterSpacing: '0.06em', color: 'rgba(var(--text-rgb),0.35)',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(var(--text-rgb),0.6)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(var(--text-rgb),0.35)'}
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
