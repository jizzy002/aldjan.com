import { useState } from 'react'
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

  return (
    <div style={{
      background: 'rgba(8,8,8,0.97)',
      border: '1px solid rgba(200,220,20,0.4)',
      borderRadius: 6,
      boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
      padding: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 16, height: 1, background: 'rgba(200,220,20,0.5)' }} />
        <span style={{ fontSize: 10, color: 'rgba(200,220,20,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
          Garage
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
        {GARAGE_TABS.map((t, i) => (
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
            {t.name}
          </button>
        ))}
      </div>

      {tab?.image && (
        <picture style={{ width: '100%', aspectRatio: '4 / 3', display: 'block', marginBottom: 8 }}>
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
          <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.35)', letterSpacing: '0.06em', minWidth: 50, flexShrink: 0 }}>{label}</span>
          <span style={{ fontSize: 11, color: '#f0ebe0', fontWeight: 450 }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
