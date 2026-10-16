import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import bikeWebp from '../imports/gsx750f-lucille.webp'
import bikePng from '../imports/gsx750f-lucille.png'
import kawiWebp from '../imports/kawi-1993.webp'
import kawiPng from '../imports/kawi-1993.png'

const GARAGE_TABS = [
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
]

export default function GarageSection() {
  const [activeTab, setActiveTab] = useState(0)
  const tab = GARAGE_TABS[activeTab]
  const revealRef = useReveal()

  return (
    <div ref={revealRef} className="card reveal" style={{ padding: 22 }}>
      <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="eyebrow-rule" />
        Garage
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
        {GARAGE_TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            fontSize: 'var(--fs-label)',
            fontFamily: 'inherit',
            letterSpacing: '0.08em',
            padding: '5px 12px',
            borderRadius: 999,
            border: `1px solid ${activeTab === i ? 'var(--border-strong)' : 'rgba(var(--accent),0.18)'}`,
            background: activeTab === i ? 'rgba(var(--accent),0.12)' : 'transparent',
            color: activeTab === i ? 'var(--accent-solid)' : 'var(--text-dim)',
            cursor: 'pointer',
            transition: 'all 0.2s var(--ease-out)',
            outline: 'none',
          }}>
            {t.name}
          </button>
        ))}
      </div>

      {tab?.image && (
        <picture key={activeTab} className="enter-fade" style={{ '--delay': '0s', width: '100%', aspectRatio: '4 / 3', display: 'block', marginBottom: 8 }}>
          {tab.imageWebp && <source srcSet={tab.imageWebp} type="image/webp" />}
          <source srcSet={tab.image} type="image/png" />
          <img src={tab.image} alt={`${tab.name} - ${tab.items[0][1]} motorcycle`} style={{
            width: '100%', height: '100%', objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }} />
        </picture>
      )}

      {tab?.items.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 4, alignItems: 'baseline' }}>
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text-faint)', letterSpacing: '0.06em', minWidth: 50, flexShrink: 0 }}>{label}</span>
          <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text)', fontWeight: 500 }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
