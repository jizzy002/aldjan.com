import { useState, useEffect, useRef } from 'react'
import HelmetSequence, { HELMET_FRAMES } from './HelmetSequence'
import HotspotDot from './HotspotDot'
import MusicHotspot from './MusicHotspot'
import StatsSection from './StatsSection'
import LightRay from './LightRay'
import LightSwitch from './LightSwitch'
import { OIIA_ENABLED, playOiia, SPIN_SETTLE_SPEED } from '../lib/oiia'
import useHelmetDrag from '../hooks/useHelmetDrag'

const TEXT_RGB = [240, 235, 224]
const ACCENT_RGB = [200, 220, 20]

function LetterDrift({ text }) {
  const containerRef = useRef(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const rects = useRef([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function measure() {
      rects.current = [...el.children].map(child => {
        const r = child.getBoundingClientRect()
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
      })
    }

    function onMove(e) {
      setCursor({ x: e.clientX, y: e.clientY })
    }
    function onEnter() { measure(); setHovering(true) }
    function onLeave() { setHovering(false) }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <h1 ref={containerRef} style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(30px, 5.4vw, 46px)',
      fontWeight: 400,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.015em',
      textAlign: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      cursor: 'default',
      userSelect: 'none',
    }}>
      {[...text].map((ch, i) => {
        let t = 0
        if (hovering && rects.current[i]) {
          const { cx, cy } = rects.current[i]
          const dist = Math.hypot(cursor.x - cx, cursor.y - cy)
          const maxDist = 60
          if (dist < maxDist) t = 1 - dist / maxDist
        }
        const rgb = TEXT_RGB.map((c, k) => Math.round(c + (ACCENT_RGB[k] - c) * t * 0.6))
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${-t * 3}px) scale(${1 + t * 0.14})`,
              color: t ? `rgb(${rgb.join(',')})` : undefined,
              transition: 'transform 0.15s var(--ease-out), color 0.15s ease',
              whiteSpace: ch === ' ' ? 'pre' : undefined,
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        )
      })}
    </h1>
  )
}

const HOTSPOTS = [
  { id: 0, label: 'Instagram', color: 'var(--insta)', icon: 'fa-brands fa-instagram', href: 'https://instagram.com/aldjan.pov', x: 30, y: 60.5 },
  {
    id: 1, label: 'Gear', x: 77.5, y: 63,
    content: {
      title: 'What gear do I use?',
      items: [
        ['Camera', 'DJI Osmo Action 4'],
        ['Audio', 'DJI Mic Mini'],
        ['Editing', 'Adobe Premiere Pro'],
      ],
    },
  },
]

const MUSIC_ID = 3
// Photo frames have empty margin around the helmet; draw them this much larger than the box
const HELMET_ZOOM = 1.25
// Decorative window light from the left page edge (just a prop, doesn't relight the photos)
const LIGHT_RAY = false
// Lever on the page edge that turns the ray on/off; false hides it and keeps the ray on
const LIGHT_SWITCH = false
// The music dot rides on the intercom unit, which only faces the viewer mid-turn: [frame, x%, y%]
const MUSIC_TRACK = [
  // 18, 22 and 26 are hand-placed; the rest follow a smooth curve through them
  [17, 66.5, 69.5], [18, 62, 69.5], [19, 57.5, 69.5], [20, 52.5, 69.5], [21, 47, 69.2],
  [22, 42, 69], [23, 38, 69], [24, 34.3, 69], [25, 30.5, 68.5],
]
// Static illustration (no rotation): dot on the ear area
const MUSIC_STATIC = { x: 23, y: 20 }

function trackPosition(track, frame) {
  if (frame < track[0][0] || frame > track.at(-1)[0]) return null
  let i = 0
  while (i < track.length - 2 && track[i + 1][0] <= frame) i++
  const [f0, x0, y0] = track[i]
  const [f1, x1, y1] = track[i + 1]
  const t = Math.min(1, Math.max(0, (frame - f0) / (f1 - f0)))
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t }
}

function PopupItems({ items }) {
  return items.map(([label, value]) => (
    <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 5, alignItems: 'baseline' }}>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-faint)', letterSpacing: '0.06em', minWidth: 50, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  ))
}

function CornerAccent({ position }) {
  const [v, h] = position.split('-')
  return (
    <div aria-hidden className="enter-fade" style={{
      '--delay': '1.1s',
      position: 'absolute', zIndex: 1, width: 36, height: 36,
      [v]: v === 'top' ? 'var(--hero-inset-top)' : 'var(--hero-inset-bottom)',
      [h]: 'var(--hero-inset-x)',
      [`border${v === 'top' ? 'Top' : 'Bottom'}`]: '1px solid var(--border)',
      [`border${h === 'left' ? 'Left' : 'Right'}`]: '1px solid var(--border)',
    }} />
  )
}

export default function HeroSection({
  nowPlaying, recentTracks, musicHintState, setMusicHintState, onScrollToFeed,
  sequenceEnabled, reducedMotion, onSequenceFail,
}) {
  const [active, setActive] = useState(null)
  const [hoveredSpot, setHoveredSpot] = useState(null)
  const [hintVisible, setHintVisible] = useState(true)
  const supportsHover = useState(() => window.matchMedia('(hover: hover)').matches)[0]
  const [spinTurns, setSpinTurns] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const spinFrame = useRef(0)
  const [seqReady, setSeqReady] = useState(false)
  // window light on/off (remembered per visitor)
  const [lightOn, setLightOn] = useState(() => {
    try { return localStorage.getItem('helmet-light') !== 'off' } catch { return true }
  })
  function toggleLight() {
    setLightOn(on => {
      try { localStorage.setItem('helmet-light', on ? 'off' : 'on') } catch { /* storage blocked */ }
      return !on
    })
  }
  const drag = useHelmetDrag({
    frames: HELMET_FRAMES,
    reducedMotion,
    onDragStart: () => setHintVisible(false),
  })
  const rotation = drag.turns + spinTurns
  // Same frame the canvas is showing, so the dots stay glued to the helmet
  const frame = ((Math.round(rotation * HELMET_FRAMES) % HELMET_FRAMES) + HELMET_FRAMES) % HELMET_FRAMES
  // HOTSPOTS are measured on frame 0 only, so they show on exactly that frame
  const nearFront = frame === 0
  // front dots (Instagram, Gear) only when the helmet faces the viewer and isn't moving
  const hideSpots = spinning || (sequenceEnabled && (!nearFront || drag.dragging))
  const musicTrackPos = !sequenceEnabled ? MUSIC_STATIC : spinning ? null : trackPosition(MUSIC_TRACK, frame)
  const degrees = Math.round((((rotation % 1) + 1) % 1) * 360) % 360
  // Hotspot coords are % of the unzoomed frame; map them onto the zoomed helmet
  const zoom = sequenceEnabled ? HELMET_ZOOM : 1
  const zoomPct = v => 50 + (v - 50) * zoom
  const musicPos = musicTrackPos && { x: zoomPct(musicTrackPos.x), y: zoomPct(musicTrackPos.y) }
  const listeningHint = sequenceEnabled && nowPlaying?.isPlaying && (musicHintState === 'showing' || musicHintState === 'hiding')

  const musicVisible = !!musicPos
  useEffect(() => {
    if (!musicVisible) setActive(a => (a === MUSIC_ID ? null : a))
  }, [musicVisible])

  useEffect(() => () => cancelAnimationFrame(spinFrame.current), [])

  // OIIA easter egg: fast/slow spin timed to the sound, then glide back to the front
  const spinningRef = useRef(false)
  async function startSpin() {
    if (spinningRef.current) return
    spinningRef.current = true
    setSpinning(true)
    setActive(null)
    setHintVisible(false)
    const { duration, speedAt } = await playOiia()
    const start = performance.now()
    let last = start
    let turns = 0
    const tick = now => {
      const t = (now - start) / 1000
      const dt = (now - last) / 1000
      last = now
      if (t < duration) {
        turns += speedAt(t) * dt
      } else {
        const next = Math.ceil(turns)
        turns = Math.min(next, turns + SPIN_SETTLE_SPEED * dt)
        if (turns >= next) {
          setSpinTurns(0)
          setSpinning(false)
          spinningRef.current = false
          return
        }
      }
      setSpinTurns(turns)
      spinFrame.current = requestAnimationFrame(tick)
    }
    spinFrame.current = requestAnimationFrame(tick)
  }

  // Secret triggers: type "oiia" anywhere, or tap the helmet (not a dot) 5x within 2s
  const helmetRef = useRef(null)
  const startSpinRef = useRef(startSpin)
  startSpinRef.current = startSpin
  const eggEnabled = OIIA_ENABLED && sequenceEnabled
  const tapTimes = useRef([])

  function helmetOnScreen() {
    const r = helmetRef.current?.getBoundingClientRect()
    return !!r && r.bottom > 0 && r.top < window.innerHeight
  }

  useEffect(() => {
    if (!eggEnabled) return
    let typed = ''
    function onKey(e) {
      const el = e.target
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
      if (e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-4)
      if (typed === 'oiia' && helmetOnScreen()) {
        typed = ''
        startSpinRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [eggEnabled])

  function handleHelmetTap(e) {
    if (!eggEnabled || e.target.closest('[data-hotspot]')) return
    const now = Date.now()
    tapTimes.current = [...tapTimes.current.filter(t => now - t < 2000), now]
    if (tapTimes.current.length >= 5) {
      tapTimes.current = []
      startSpin()
    }
  }

  useEffect(() => {
    if (!hintVisible) return
    const timer = setTimeout(() => setHintVisible(false), 3500)
    return () => clearTimeout(timer)
  }, [hintVisible])

  // hidden front dots take their popups with them
  useEffect(() => {
    if (hideSpots) setActive(a => (a === MUSIC_ID ? a : null))
  }, [hideSpots])

  // once the coarse frames are in, swing the helmet a little to show it can be turned
  const wiggle = drag.wiggle
  useEffect(() => {
    if (!seqReady) return
    const t = setTimeout(wiggle, 900)
    return () => clearTimeout(t)
  }, [seqReady, wiggle])

  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('[data-hotspot]')) {
        setActive(null)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <section
      style={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--hero-inset-top) var(--hero-inset-x) var(--hero-inset-bottom)',
      }}
    >
      {/* Central glow */}
      <div aria-hidden className="enter-fade" style={{
        position: 'absolute', zIndex: 0,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(var(--accent),0.1) 0%, rgba(var(--accent),0.035) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(p => <CornerAccent key={p} position={p} />)}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '100%', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Name */}
          <div className="enter" style={{ '--delay': '0.1s', marginBottom: 'clamp(12px, 1.8vh, 20px)' }}>
            <LetterDrift text="Aldin Jandrić" />
          </div>

          {/* Tagline row */}
          <div className="enter" style={{ '--delay': '0.3s', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(28px, 5vh, 48px)' }}>
            <span className="draw-line" style={{ '--delay': '0.6s', width: 36, height: 1, background: 'linear-gradient(to left, rgba(var(--accent),0.6), transparent)', transformOrigin: 'right' }} />
            <p className="eyebrow" style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', letterSpacing: '0.24em', whiteSpace: 'nowrap', margin: 0 }}>
              Motorcycle Enthusiast
            </p>
            <span className="draw-line" style={{ '--delay': '0.6s', width: 36, height: 1, background: 'linear-gradient(to right, rgba(var(--accent),0.6), transparent)', transformOrigin: 'left' }} />
          </div>
        </div>

        {/* Helmet container */}
        <div className="enter" style={{ '--delay': '0.45s', position: 'relative', zIndex: 2, '--hb': 'min(480px, 82vw, 45svh)' }}>
          {LIGHT_RAY && <LightRay on={!LIGHT_SWITCH || lightOn} />}
          {LIGHT_RAY && LIGHT_SWITCH && <LightSwitch on={lightOn} onToggle={toggleLight} />}
          <div
            ref={helmetRef}
            className="helmet-box"
            onClick={handleHelmetTap}
            {...(sequenceEnabled ? drag.handlers : {})}
            {...(sequenceEnabled ? {
              tabIndex: 0,
              role: 'slider',
              'aria-label': 'Helmet, drag or use the arrow keys to rotate',
              'aria-valuemin': 0,
              'aria-valuemax': 359,
              'aria-valuenow': degrees,
              'aria-valuetext': `${degrees} degrees`,
            } : {})}
            style={{
              position: 'relative',
              width: 'var(--hb)',
              zIndex: 1,
              aspectRatio: '1 / 1',
              userSelect: 'none',
              // vertical swipes still scroll the page; horizontal ones spin the helmet
              touchAction: sequenceEnabled ? 'pan-y' : 'manipulation',
              cursor: sequenceEnabled ? (drag.dragging ? 'grabbing' : 'grab') : undefined,
              transform: spinning ? `translateY(${-Math.abs(Math.sin(spinTurns * Math.PI * 2)) * 8}px)` : undefined,
            }}
          >
            <HelmetSequence
              progress={rotation}
              enabled={sequenceEnabled}
              onFail={onSequenceFail}
              onReady={() => setSeqReady(true)}
              zoom={zoom}
            />

            {/* Vignette */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 50%, transparent 75%, #000 100%)',
              pointerEvents: 'none',
            }} />

            {/* Hotspots */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: hideSpots ? 0 : 1,
              visibility: hideSpots ? 'hidden' : 'visible',
              transition: 'opacity 0.3s ease, visibility 0.3s',
            }}>
              {HOTSPOTS.map((spot) => {
                const isActive = active === spot.id
                const labelLeft = spot.x > 50

                return (
                  <div
                    key={spot.id}
                    data-hotspot
                    style={{
                      position: 'absolute',
                      left: `${zoomPct(spot.x)}%`,
                      top: `${zoomPct(spot.y)}%`,
                      width: 0,
                      height: 0,
                      zIndex: isActive ? 11 : 10,
                    }}
                  >
                    <HotspotDot
                      label={spot.label}
                      color={spot.color}
                      isActive={isActive}
                      pulse
                      showTooltip={supportsHover && hoveredSpot === spot.id}
                      onClick={() => { setActive(isActive ? null : spot.id); setHintVisible(false) }}
                      onMouseEnter={() => setHoveredSpot(spot.id)}
                      onMouseLeave={() => setHoveredSpot(null)}
                    />

                    {/* Label popup */}
                    {isActive && (
                      <div className="pop-in" style={{
                        position: 'absolute',
                        top: 0,
                        transform: 'translateY(-50%)',
                        ...(labelLeft ? { right: 18, transformOrigin: 'right center' } : { left: 18, transformOrigin: 'left center' }),
                        whiteSpace: 'nowrap',
                      }}>
                        <span aria-hidden className="hotspot-connector" style={{
                          '--hs': spot.color || 'var(--accent)',
                          ...(labelLeft ? { right: -18, width: 18, transformOrigin: 'right' } : { left: -18, width: 18, transformOrigin: 'left' }),
                        }} />
                        {spot.content ? (
                          <div className="card" style={{ padding: 14, minWidth: 220 }}>
                            <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                              <span className="eyebrow-rule" />
                              {spot.content.title}
                            </div>
                            <PopupItems items={spot.content.items} />
                          </div>
                        ) : (
                          <a
                            href={spot.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 14px',
                              color: 'var(--text)',
                              fontSize: 'clamp(11px, 2.5vw, 13px)',
                              fontWeight: 500,
                              letterSpacing: '0.06em',
                              textDecoration: 'none',
                            }}
                          >
                            {spot.icon && <i className={spot.icon} style={{ color: spot.color ? `rgb(${spot.color})` : 'var(--accent-solid)' }} />}
                            {spot.popupLabel || spot.label}
                            <span style={{ color: 'var(--text-faint)' }}>↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

            </div>

            {/* Music hotspot (on the intercom while it faces the viewer) */}
            {musicPos && (
              <MusicHotspot
                nowPlaying={nowPlaying}
                recentTracks={recentTracks}
                musicHintState={musicHintState}
                setMusicHintState={setMusicHintState}
                isActive={active === MUSIC_ID}
                onToggle={() => setActive(active === MUSIC_ID ? null : MUSIC_ID)}
                isHovered={hoveredSpot === MUSIC_ID}
                onMouseEnter={() => setHoveredSpot(MUSIC_ID)}
                onMouseLeave={() => setHoveredSpot(null)}
                supportsHover={supportsHover}
                labelLeft={musicPos.x > 50}
                showHint={!sequenceEnabled}
                style={{
                  position: 'absolute',
                  left: `${musicPos.x}%`,
                  top: `${musicPos.y}%`,
                  width: 0,
                  height: 0,
                  zIndex: active === MUSIC_ID ? 11 : 10,
                  animation: 'fadeIn 0.3s ease',
                }}
              />
            )}
          </div>
        </div>

        {/* Click hint */}
        <div style={{
          marginTop: 10,
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 13,
          letterSpacing: '0.04em',
          color: listeningHint ? 'rgba(var(--music),0.85)' : 'rgba(var(--accent),0.75)',
          opacity: (listeningHint ? musicHintState === 'showing' : hintVisible) && !hideSpots ? 1 : 0,
          transition: 'opacity 1.5s ease',
          pointerEvents: 'none',
        }}>
          {listeningHint
            ? '♫ he is listening to something, spin the helmet to find it ♫'
            : sequenceEnabled ? 'tap the dots · drag to spin' : 'tap the dots'}
        </div>

        <div>
          <div className="enter" style={{ '--delay': '0.65s' }}>
            <StatsSection />
          </div>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="enter" style={{ '--delay': '0.9s', marginTop: 16 }}>
        <button
          onClick={onScrollToFeed}
          aria-label="Scroll to feed"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 'var(--fs-small)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            Explore More
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'bob 1.8s ease-in-out infinite' }}>
            <path d="M4 7l6 6 6-6" style={{ stroke: 'rgba(var(--accent),0.7)' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
