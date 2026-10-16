import { useRef } from 'react'

// Lever switch mounted on the left edge of the page, under where the light ray comes in.
// Lever shape (base on the "wall" + flip handle), drawn in the site's own minimal style.

function clickSound() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  const ctx = new Ctx()
  const len = Math.floor(ctx.sampleRate * 0.03)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5)
  const src = ctx.createBufferSource()
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1600
  bp.Q.value = 1.2
  const gain = ctx.createGain()
  gain.gain.value = 0.3
  src.buffer = buf
  src.connect(bp).connect(gain).connect(ctx.destination)
  src.start()
  src.onended = () => ctx.close()
}

const FLICK = 8 // px of vertical drag that flips the lever

export default function LightSwitch({ on, onToggle }) {
  const drag = useRef(null)

  function set(next) {
    if (next === on) return
    clickSound()
    onToggle()
  }

  // grab the handle and flick it: up = on, down = off
  function onPointerDown(e) {
    if (e.button !== 0) return
    drag.current = { id: e.pointerId, y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dy = e.clientY - d.y
    if (Math.abs(dy) < FLICK) return
    d.moved = true
    d.y = e.clientY
    set(dy < 0)
  }

  function onPointerUp(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (d.moved) e.currentTarget.dataset.dragged = '1' // the click that follows is not a toggle
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Light"
      title={on ? 'Lights off' : 'Lights on'}
      className={`lever${on ? ' is-on' : ''}`}
      onClick={e => {
        if (e.currentTarget.dataset.dragged) {
          delete e.currentTarget.dataset.dragged
          return
        }
        clickSound()
        onToggle()
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault()
          set(e.key === 'ArrowUp')
        }
      }}
      style={{
        touchAction: 'none', // vertical flicks move the lever, not the page
        position: 'absolute',
        zIndex: 3,
        left: 'calc((var(--hb) - 100vw) / 2)', // flush with the page edge
        top: '-25%',
      }}
    >
      <svg viewBox="0 0 40 48" width="40" height="48" aria-hidden>
        {/* handle + knob, pivoting on the base */}
        <g className="lever-arm">
          <line x1="8" y1="24" x2="27" y2="24" className="lever-rod" />
          <circle cx="28" cy="24" r="4.5" className="lever-knob" />
        </g>
        {/* base coming out of the page edge */}
        <rect x="-8" y="11" width="18" height="26" rx="6" className="lever-base" />
        <circle cx="8" cy="24" r="2.6" className="lever-pivot" />
      </svg>
    </button>
  )
}
