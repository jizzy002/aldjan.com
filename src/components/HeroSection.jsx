import { useState, useEffect } from 'react'
import helmetWebp from '../imports/LS2-strobe2_3D.webp'
import helmetPng from '../imports/LS2-strobe2_3D.png'
import bikeWebp from '../imports/gsx750f-lucille.webp'
import bikePng from '../imports/gsx750f-lucille.png'
import kawiWebp from '../imports/kawi-1993.webp'
import kawiPng from '../imports/kawi-1993.png'
import MusicHotspot from './MusicHotspot'

const HOTSPOTS = [
  { id: 0, label: 'Instagram',  href: 'https://instagram.com/aldjan.pov', x: 27,  y: 67 },
  {
    id: 1, label: 'Gear', x: 92,  y: 80,
    content: {
      title: 'What gear do I use?',
      items: [
        ['Camera', 'DJI Osmo Action 4'],
        ['Audio', 'DJI Mic Mini'],
        ['Editing', 'Adobe Premiere Pro'],
      ],
    },
  },
  {
    id: 2, label: 'Garage', x: 55,  y: 38, popupBelow: true,
    content: {
      title: 'Garage',
      tabs: [
        {
          name: 'Lucille',
          image: bikePng,
          imageWebp: bikeWebp,
          items: [
            ['Make', 'Suzuki GSX750F'],
            ['Year', '2001'],
            ['Engine', '750cc inline-four'],
            ['Power', '92 hp'],
          ],
        },
        {
          name: 'Kawi',
          image: kawiPng,
          imageWebp: kawiWebp,
          items: [
            ['Make', 'Kawasaki EN500'],
            ['Year', '1993'],
            ['Engine', '500cc parallel-twin'],
            ['Power', '50 hp'],
          ],
        },
      ],
    },
  },
]

const MUSIC_ID = 3
const MUSIC_POS = { x: 23, y: 20 }

function PopupItems({ items }) {
  return items.map(([label, value]) => (
    <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 4, alignItems: 'baseline' }}>
      <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.35)', letterSpacing: '0.06em', minWidth: 50, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: '#f0ebe0', fontWeight: 450 }}>{value}</span>
    </div>
  ))
}

export default function HeroSection({ nowPlaying, musicHintState, setMusicHintState, onScrollToFeed }) {
  const [active, setActive] = useState(null)
  const [hoveredSpot, setHoveredSpot] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)
  const supportsHover = useState(() => window.matchMedia('(hover: hover)').matches)[0]

  useEffect(() => {
    if (active !== 2) setActiveTab(0)
  }, [active])

  useEffect(() => {
    if (!hintVisible) return
    const timer = setTimeout(() => setHintVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [hintVisible])

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
        padding: '48px 24px 32px',
      }}
    >
      {/* Grid background */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(200,220,20,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,220,20,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Central glow */}
      <div aria-hidden style={{
        position: 'absolute', zIndex: 0,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,200,10,0.1) 0%, rgba(180,200,10,0.04) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Corner accents */}
      <div aria-hidden style={{ position: 'absolute', top: 48, left: 24, width: 40, height: 40, borderTop: '1px solid rgba(200,220,20,0.25)', borderLeft: '1px solid rgba(200,220,20,0.25)', zIndex: 1 }} />
      <div aria-hidden style={{ position: 'absolute', top: 48, right: 24, width: 40, height: 40, borderTop: '1px solid rgba(200,220,20,0.25)', borderRight: '1px solid rgba(200,220,20,0.25)', zIndex: 1 }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 32, left: 24, width: 40, height: 40, borderBottom: '1px solid rgba(200,220,20,0.25)', borderLeft: '1px solid rgba(200,220,20,0.25)', zIndex: 1 }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 32, right: 24, width: 40, height: 40, borderBottom: '1px solid rgba(200,220,20,0.25)', borderRight: '1px solid rgba(200,220,20,0.25)', zIndex: 1 }} />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '100%' }}>

        {/* Name */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 400,
          color: '#f0ebe0',
          margin: '20px 0 clamp(16px, 2vh, 28px)',
          letterSpacing: '-0.015em',
          textAlign: 'center',
        }}>
          Aldin J.
        </h1>

        {/* Tagline row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(36px, 6vh, 54px)' }}>
          <span style={{ width: 32, height: 1, background: 'rgba(200,220,20,0.5)' }} />
          <p style={{
            fontSize: 'clamp(8px, 2.2vw, 11px)', whiteSpace: 'nowrap', fontWeight: 550, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(200,220,20,0.8)', margin: 0,
          }}>
            Motorcycle Enthusiast
          </p>
          <span style={{ width: 32, height: 1, background: 'rgba(200,220,20,0.5)' }} />
        </div>

        {/* Helmet container */}
        <div style={{
          position: 'relative',
          width: 'min(480px, 82vw, 45svh)',
          aspectRatio: '1 / 1',
          userSelect: 'none',
        }}>
          {/* Helmet image */}
          <picture style={{ width: '100%', height: '100%', display: 'block' }}>
            <source srcSet={helmetWebp} type="image/webp" />
            <source srcSet={helmetPng} type="image/png" />
            <img
              src={helmetPng}
              alt="LS2 Strobe II helmet"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 12px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(180,200,10,0.15))',
              }}
            />
          </picture>

          {/* Vignette */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, transparent 75%, #080808 100%)',
            pointerEvents: 'none',
          }} />

          {/* Hotspots */}
          {HOTSPOTS.map((spot) => {
            const isActive = active === spot.id
            const labelLeft = spot.labelLeft ?? spot.x > 50

            return (
              <div
                key={spot.id}
                data-hotspot
                style={{
                  position: 'absolute',
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 0,
                  height: 0,
                  zIndex: 10,
                }}
              >
                {/* Pulse ring */}
                {!isActive && (
                  <span aria-hidden style={{
                    position: 'absolute',
                    top: -14, left: -14,
                    width: 28, height: 28,
                    borderRadius: '50%',
                    border: '1px solid rgba(200,220,20,0.4)',
                    animation: 'pulse 2.4s ease-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Dot */}
                <button
                  onClick={() => { setActive(isActive ? null : spot.id); setHintVisible(false) }}
                  onMouseEnter={() => setHoveredSpot(spot.id)}
                  onMouseLeave={() => setHoveredSpot(null)}
                  aria-label={spot.label}
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
                    background: isActive ? '#c8dc14' : 'rgba(200,220,20,0.9)',
                    border: `2px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                    boxShadow: isActive ? '0 0 18px rgba(200,220,20,1)' : '0 0 8px rgba(200,220,20,0.5)',
                    transition: 'all 0.18s ease',
                  }} />
                  {/* Hover tooltip */}
                  {supportsHover && !isActive && hoveredSpot === spot.id && (
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
                      border: '1px solid rgba(200,220,20,0.25)',
                    }}>
                      {spot.label}
                    </span>
                  )}
                </button>

                {/* Label popup */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    ...(spot.popupBelow
                      ? { top: 22, left: '50%', transform: 'translateX(-50%)' }
                      : { top: 0, transform: 'translateY(-50%)', ...(labelLeft ? { right: 14 } : { left: 14 }) }
                    ),
                    whiteSpace: 'nowrap',
                  }}>
                    {/* Connector */}
                    <span aria-hidden style={spot.popupBelow
                      ? { position: 'absolute', top: -6, left: '50%', width: 1, height: 6, background: 'rgba(200,220,20,0.5)' }
                      : { position: 'absolute', top: '50%', ...(labelLeft ? { right: -14, width: 14 } : { left: -14, width: 14 }), height: 1, background: 'rgba(200,220,20,0.5)' }
                    } />
                    {spot.content ? (
                      <div style={{
                        background: 'rgba(8,8,8,0.97)',
                        border: '1px solid rgba(200,220,20,0.4)',
                        borderRadius: 6,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
                        padding: 12,
                        minWidth: 220,
                      }}>
                        <div style={{ fontSize: 10, color: 'rgba(200,220,20,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>
                          {spot.content.title}
                        </div>
                        {spot.content.tabs ? (
                          <>
                            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                              {spot.content.tabs.map((tab, i) => (
                                <button key={i} onClick={() => setActiveTab(i)} style={{
                                  fontSize: 10,
                                  letterSpacing: '0.06em',
                                  padding: '4px 10px',
                                  borderRadius: 3,
                                  border: `1px solid ${activeTab === i ? 'rgba(200,220,20,0.6)' : 'rgba(200,220,20,0.2)'}`,
                                  background: activeTab === i ? 'rgba(200,220,20,0.12)' : 'transparent',
                                  color: activeTab === i ? '#c8dc14' : 'rgba(240,235,224,0.5)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  outline: 'none',
                                }}>
                                  {tab.name}
                                </button>
                              ))}
                            </div>
                            {spot.content.tabs[activeTab]?.image && (
                              <picture style={{ width: '100%', aspectRatio: '4 / 3', display: 'block', marginBottom: 8 }}>
                                <source srcSet={spot.content.tabs[activeTab].imageWebp} type="image/webp" />
                                <source srcSet={spot.content.tabs[activeTab].image} type="image/png" />
                                <img src={spot.content.tabs[activeTab].image} alt="" style={{
                                  width: '100%', height: '100%', objectFit: 'contain',
                                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                                }} />
                              </picture>
                            )}
                            <PopupItems items={spot.content.tabs[activeTab]?.items} />
                          </>
                        ) : (
                          <>
                            {spot.content.image && (
                              <picture style={{ width: '100%', aspectRatio: '4 / 3', display: 'block', marginBottom: 8 }}>
                                {spot.content.imageWebp && <source srcSet={spot.content.imageWebp} type="image/webp" />}
                                <source srcSet={spot.content.image} type="image/png" />
                                <img src={spot.content.image} alt="" style={{
                                  width: '100%', height: '100%', objectFit: 'contain',
                                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                                }} />
                              </picture>
                            )}
                            <PopupItems items={spot.content.items} />
                          </>
                        )}
                      </div>
                    ) : (
                      <a
                        href={spot.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '7px 13px',
                          background: 'rgba(8,8,8,0.97)',
                          border: '1px solid rgba(200,220,20,0.4)',
                          borderRadius: 4,
                          color: '#f0ebe0',
                          fontSize: 'clamp(8px, 2.5vw, 13px)',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          textDecoration: 'none',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
                        }}
                      >
                        {spot.popupLabel || spot.label} ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Music hotspot */}
          <MusicHotspot
            nowPlaying={nowPlaying}
            musicHintState={musicHintState}
            setMusicHintState={setMusicHintState}
            isActive={active === MUSIC_ID}
            onToggle={() => setActive(active === MUSIC_ID ? null : MUSIC_ID)}
            isHovered={hoveredSpot === MUSIC_ID}
            onMouseEnter={() => setHoveredSpot(MUSIC_ID)}
            onMouseLeave={() => setHoveredSpot(null)}
            supportsHover={supportsHover}
            style={{
              position: 'absolute',
              left: `${MUSIC_POS.x}%`,
              top: `${MUSIC_POS.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 0,
              height: 0,
              zIndex: 10,
            }}
          />
        </div>

        {/* Click hint */}
        <div style={{
          marginTop: 8,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(200, 220, 20, 0.73)',
          opacity: hintVisible ? 1 : 0,
          transition: 'opacity 2s ease',
          pointerEvents: 'none',
        }}>
          • tap the dots •
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 'clamp(16px, 3vw, 48px)', marginTop: 'clamp(12px, 2vh, 32px)',
          paddingTop: 'clamp(10px, 2vh, 28px)',
        }}>
          {[['1.4k', 'Followers'], ['40k+', 'Kilometers'], ['9', 'Countries']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 'clamp(11px, 2.2vh, 22px)', fontWeight: 500, color: '#f0ebe0', letterSpacing: '-0.02em' }}>{val}</p>
              <p style={{ margin: 0, fontSize: 'clamp(7px, 1.2vh, 13px)', color: 'rgba(240,235,224,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 'clamp(1px, 0.3vh, 3px)' }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <div style={{ marginTop: 24, marginBottom: 2 }}>
        <button
          onClick={onScrollToFeed}
          aria-label="Scroll to feed"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Explore More
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'bob 1.8s ease-in-out infinite' }}>
            <path d="M4 7l6 6 6-6" stroke="rgba(200,220,20,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
