import { forwardRef } from 'react'
import GarageSection from './GarageSection'

const SOCIAL_LINKS = [
  { id: 'facebook', href: 'https://www.facebook.com/ald.jan01/', color: '#1877F2', cls: 'fa-brands fa-facebook' },
  { id: 'snapchat', href: 'https://www.snapchat.com/add/ald_jan', color: '#FFFC00', cls: 'fa-brands fa-snapchat' },
  { id: 'telegram', href: 'https://t.me/ald_jan', color: '#26A5E4', cls: 'fa-brands fa-telegram' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/aldin-jandri%C4%87-559aa3ab/', color: '#0A66C2', cls: 'fa-brands fa-linkedin' },
  { id: 'youtube', href: 'https://youtube.com/@ald_jan', color: '#FF0000', cls: 'fa-brands fa-youtube' },
  { id: 'tiktok', href: 'https://www.tiktok.com/@ald.jan', color: '#ffffff', cls: 'fa-brands fa-tiktok' },
]

const FeedSection = forwardRef(function FeedSection(_props, ref) {
  return (
    <section ref={ref} style={{ padding: '64px 24px 80px' }}>
      <div className="feed-container">

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.25)' }}>
            Find me on
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 2vw, 16px)', padding: '0 0 100px' }}>
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 2vw, 30px)' }}>
              {i > 0 && <span style={{ color: 'rgba(240,235,224,0.2)', fontSize: 'clamp(6px, 1.5vw, 10px)' }}>·</span>}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.id}
                className="social-link"
                style={{
                  '--link-color': link.color,
                  textDecoration: 'none',
                  fontSize: 30,
                }}
              >
                <i className={link.cls} />
              </a>
            </span>
          ))}
        </div>

        <div className="feed-layout">

          <GarageSection />

          <div style={{
            background: 'rgba(8,8,8,0.97)',
            border: '1px solid rgba(200,220,20,0.4)',
            borderRadius: 6,
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            padding: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 1, background: 'rgba(200,220,20,0.5)' }} />
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,220,20,0.8)' }}>
                  Latest Posts
                </span>
              </div>
              <a
                href="https://instagram.com/aldjan.pov"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.3)', textDecoration: 'none' }}
              >
                @aldjan.pov ↗
              </a>
            </div>

            <iframe
              src="https://snapwidget.com/embed/1126768"
              className="snapwidget-widget"
              allowtransparency="true"
              frameBorder={0}
              scrolling="no"
              title="Posts from Instagram"
              style={{ border: 'none', overflow: 'hidden', width: '100%', aspectRatio: '1 / 1', borderRadius: 4 }}
            />
          </div>

        </div>

      </div>
    </section>
  )
})

export default FeedSection
