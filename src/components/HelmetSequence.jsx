import { useEffect, useRef, useState } from 'react'
import helmetWebp from '../imports/LS2-strobe2_3D.webp'
import helmetPng from '../imports/LS2-strobe2_3D.png'

// Number of turntable frames in public/helmet/ (helmet-000.webp …).
// 0 = no sequence yet → static image, no scroll pinning.
export const HELMET_FRAMES = 48
export const HELMET_SEQUENCE_ENABLED = HELMET_FRAMES > 0

const SMALL_QUERY = '(max-width: 767px)'
const HAS_SMALL_SET = true
const SMALL = HAS_SMALL_SET && window.matchMedia(SMALL_QUERY).matches

function frameUrl(i, small) {
  return `/helmet/${small ? 'sm/' : ''}helmet-${String(i).padStart(3, '0')}.webp`
}

// Load order: first frame, then every 4th (coarse scrub works early), then the rest
function loadOrder(n) {
  const order = [0]
  for (let i = 4; i < n; i += 4) order.push(i)
  for (let i = 1; i < n; i++) if (i % 4) order.push(i)
  return order
}

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
  filter: 'drop-shadow(0 12px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(var(--accent),0.15))',
}

export default function HelmetSequence({ progress = 0, enabled, onFail, zoom = 1 }) {
  const canvasRef = useRef(null)
  const frames = useRef([])
  const [loaded, setLoaded] = useState(0)
  const [firstReady, setFirstReady] = useState(false)

  // Preload frames progressively after first paint
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const order = loadOrder(HELMET_FRAMES)
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 200))

    async function loadAll() {
      for (const i of order) {
        if (cancelled) return
        const img = new Image()
        img.src = frameUrl(i, SMALL)
        try {
          await img.decode()
        } catch {
          if (i === 0) { onFail?.(); return }
          continue
        }
        if (cancelled) return
        frames.current[i] = img
        if (i === 0) setFirstReady(true)
        setLoaded(c => c + 1)
      }
    }

    idle(loadAll)
    return () => { cancelled = true }
  }, [enabled, onFail])

  // Keep canvas backing store matched to its CSS size × DPR
  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(entry.contentRect.width * dpr)
      canvas.height = Math.round(entry.contentRect.height * dpr)
      drawRef.current()
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [enabled])

  const drawRef = useRef(() => {})
  drawRef.current = draw

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || !frames.current.length) return
    // progress 0→1 is one full turn (wraps, so 1 lands back on frame 0)
    const N = HELMET_FRAMES
    const target = ((Math.round(progress * N) % N) + N) % N
    // Nearest frame that has finished loading
    let img = null
    for (let d = 0; d < N && !img; d++) {
      img = frames.current[(target - d + N) % N] || frames.current[(target + d) % N] || null
    }
    if (!img) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }

  useEffect(draw, [progress, loaded, firstReady])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {enabled ? (
        // Zoomed layer: larger than the box (frames have empty margin), drawn at full size so it stays sharp
        <div style={{ position: 'absolute', inset: `${-(zoom - 1) * 50}%` }}>
          {/* Frame 0 as a plain <img> for first paint; the canvas takes over once frames decode */}
          <img
            src={frameUrl(0, SMALL)}
            alt="LS2 Strobe II helmet"
            fetchPriority="high"
            style={{ ...imgStyle, opacity: firstReady ? 0 : 1 }}
          />
          <canvas
            ref={canvasRef}
            aria-hidden
            style={{ ...imgStyle, position: 'absolute', inset: 0, opacity: firstReady ? 1 : 0 }}
          />
        </div>
      ) : (
        <picture style={{ width: '100%', height: '100%', display: 'block' }}>
          <source srcSet={helmetWebp} type="image/webp" />
          <source srcSet={helmetPng} type="image/png" />
          <img src={helmetPng} alt="LS2 Strobe II helmet" style={imgStyle} />
        </picture>
      )}
    </div>
  )
}
