import useReveal from '../hooks/useReveal'

// ── PLACEHOLDER CONTENT: replace with the real text ──
const ABOUT = {
  headline: 'Riding, tinkering, exploring and much more.',
  body: [
    'Hi, I\'m a motorcycle and car enthusiast, in some occurrences a content creator, that is interested in many fields that are related to technology, vehicles, and the outdoors.',
    'I love exploring many fields that are known and unknown to me, one day solving a problem on my motorcycle, the other day fixing something on my PC, and the next, I\'m studying an electronic circuit that was malfunctioning and finding a solution to fix it.',
    'I\'m currently currently working as a customer support specialist for a small Bosnian company on a German project where I provide assistance to customers, solve their issues and provide support for the problems that arise.',
    'In my spare time, I manage my own social media channels, where I share my passion for motorcycles, all the experiences and make fun content for my audience.',
  ],
  facts: [
    ['Based in', 'Livno, Bosnia & Herzegovina'],
    ['Riding since', '2019'],
    ['Currently on', 'Suzuki · GSX750F'],
  ],
}

export default function AboutSection() {
  const ref = useReveal()

  function toGuestbook(e) {
    e.preventDefault()
    document.getElementById('guestbook')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={ref} className="card reveal" style={{ padding: 'clamp(20px, 4vw, 28px)', marginBottom: 24 }}>
      <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span className="eyebrow-rule" />
        About me
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 400,
        fontSize: 'clamp(20px, 3.4vw, 26px)',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        color: 'var(--text)',
        margin: '0 0 12px',
      }}>
        {ABOUT.headline}
      </h2>

      {ABOUT.body.map((p, i) => (
        <p key={i} style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-dim)', margin: '0 0 18px', maxWidth: 620 }}>
          {p}
        </p>
      ))}

      <div style={{ height: 1, background: 'linear-gradient(to right, var(--border-strong), transparent)', margin: '18px 0 16px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px 20px' }}>
        {ABOUT.facts.map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize: 'var(--fs-label)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>

      <a
        href="#guestbook"
        onClick={toGuestbook}
        style={{
          display: 'inline-block',
          marginTop: 18,
          fontSize: 'var(--fs-label)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          textDecoration: 'none',
        }}
      >
        Say hi in the guestbook ↓
      </a>
    </div>
  )
}
