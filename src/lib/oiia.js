// Spinning-cat ("OIIA OIIA") easter egg: plays public/sounds/oiia.mp3 with a matching spin.
// Hidden on purpose: type "oiia" or tap the helmet 5x quickly (see HeroSection). false disables it.
export const OIIA_ENABLED = true

const CLIP_URL = '/sounds/oiia.mp3'
// Loud "oiia" bursts in the clip (seconds), measured from its loudness envelope
// [start, end, syllables per second] — the second burst is sung ~30% slower
const CLIP_SEGMENTS = [[0.45, 1.85, 10], [3.3, 5.15, 7.1]]
const TURNS_PER_SYLLABLE = 0.28 // spin locked to the singing: 10 syl/s -> 2.8 turns/s

const CLIP_DURATION = 5.72
const SLOW = 0.35 // rotations per second between the bursts

// Plays the clip and resolves to { duration, speedAt(t) }. Call straight from a user
// gesture (click/keydown) so autoplay rules allow the sound; if it's blocked the helmet
// still spins, just silently.
export async function playOiia() {
  const clip = new Audio(CLIP_URL)
  try {
    await clip.play()
  } catch {
    // no sound (blocked or failed to load)
  }
  const duration = Number.isFinite(clip.duration) ? clip.duration : CLIP_DURATION
  return { duration, speedAt: clipSpeed }
}

// Rotations per second at time t: fast during each "oiia", slow in the gaps
function clipSpeed(t) {
  const seg = CLIP_SEGMENTS.find(([a, b]) => t >= a && t < b)
  return seg ? seg[2] * TURNS_PER_SYLLABLE : SLOW
}

export const SPIN_SETTLE_SPEED = 1.2

// The cat that joins in: sprite sheet cut from a green-screen clip of the meme.
// Cell 0 = standing, cells 1..spinFrames = two revolutions of the spin.
export const CAT = {
  url: '/oiia/cat-sprite.webp',
  cols: 6,
  rows: 4,
  spinFrames: 22,
  framesPerTurn: 11,
}
