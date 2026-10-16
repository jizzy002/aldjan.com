import { forwardRef } from 'react'
import GarageSection from './GarageSection'
import useReveal from '../hooks/useReveal'

const SOCIAL_LINKS = [
  { id: 'facebook', href: 'https://www.facebook.com/ald.jan01/', color: '#1877F2', cls: 'fa-brands fa-facebook' },
  { id: 'snapchat', href: 'https://www.snapchat.com/add/ald_jan', color: '#FFFC00', cls: 'fa-brands fa-snapchat' },
  { id: 'telegram', href: 'https://t.me/ald_jan', color: '#26A5E4', cls: 'fa-brands fa-telegram' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/aldin-jandri%C4%87-559aa3ab/', color: '#0A66C2', cls: 'fa-brands fa-linkedin' },
  { id: 'youtube', href: 'https://youtube.com/@ald_jan', color: '#FF0000', cls: 'fa-brands fa-youtube' },
  { id: 'tiktok', href: 'https://www.tiktok.com/@ald.jan', color: '#ffffff', cls: 'fa-brands fa-tiktok' },
]

const FeedSection = forwardRef(function FeedSection(_props, ref) {
  const linksRef = useReveal()
  const postsRef = useReveal()
  return (
    <section ref={ref} style={{ padding: '64px 24px 80px' }}>
      <div className="feed-container">

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            Find me on
          </span>
        </div>

        <div ref={linksRef} className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 2vw, 16px)', padding: '0 0 96px' }}>
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 2vw, 30px)' }}>
              {i > 0 && <span style={{ color: 'rgba(var(--text-rgb),0.2)', fontSize: 'clamp(6px, 1.5vw, 10px)' }}>·</span>}
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

          <div ref={postsRef} className="card reveal" style={{ '--delay': '0.12s', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="eyebrow-rule" />
                Latest Posts
              </div>
              <a
                href="https://instagram.com/aldjan.pov"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', textDecoration: 'none' }}
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
