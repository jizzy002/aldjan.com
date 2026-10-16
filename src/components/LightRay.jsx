// Decorative window light: a soft ray coming in from the left edge of the page onto the helmet
// (the photos were lit by a window on that side). It sits *behind* the helmet layer, so it
// never changes the helmet's pixels or reflections. --hb is the helmet box width.
export default function LightRay({ on = true }) {
  return (
    <div
      aria-hidden
      className={`light-ray${on ? ' is-on' : ''}`}
      style={{
        position: 'absolute',
        zIndex: 0,
        pointerEvents: 'none',
        // from the page's left edge to just past the helmet's centre
        left: 'calc((var(--hb) - 100vw) / 2)',
        width: 'calc((100vw - var(--hb)) / 2 + var(--hb) * 0.62)',
        top: '-12%',
        height: '124%',
        // slightly falling, widening ray
        clipPath: 'polygon(0% 2%, 100% 22%, 100% 84%, 0% 40%)',
        background: 'linear-gradient(to right, rgba(255,243,224,0.20) 0%, rgba(255,243,224,0.12) 55%, rgba(255,243,224,0.05) 85%, rgba(255,243,224,0) 100%)',
        filter: 'blur(6px)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
