import { CAT } from '../lib/oiia'

// The spinning cat that joins the helmet during the OIIA easter egg: rises up-right from
// behind the helmet and stays behind it as a background subject.
// Shows one cell of the sprite sheet (0 = standing, 1..spinFrames = spin). Sized off --hb.
export default function OiiaCat({ frame, leaving }) {
  const col = frame % CAT.cols
  const row = Math.floor(frame / CAT.cols)
  return (
    <div
      aria-hidden
      className={`oiia-cat${leaving ? ' is-leaving' : ''}`}
      style={{
        position: 'absolute',
        zIndex: 0, // behind the helmet box (zIndex 1)
        pointerEvents: 'none',
        left: 'calc(var(--hb) * 0.5)',
        top: 'calc(var(--hb) * 0.02)',
        width: 'calc(var(--hb) * 0.48)',
        aspectRatio: '1 / 1',
        backgroundImage: `url(${CAT.url})`,
        backgroundSize: `${CAT.cols * 100}% ${CAT.rows * 100}%`,
        backgroundPosition: `${(col / (CAT.cols - 1)) * 100}% ${(row / (CAT.rows - 1)) * 100}%`,
      }}
    />
  )
}
