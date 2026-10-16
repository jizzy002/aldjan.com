import { useCallback, useEffect, useRef, useState } from 'react'
import useNowPlaying from './hooks/useNowPlaying'
import useScrollProgress from './hooks/useScrollProgress'
import HeroSection from './components/HeroSection'
import { HELMET_SEQUENCE_ENABLED } from './components/HelmetSequence'
import FeedSection from './components/FeedSection'
import GuestbookSection from './components/GuestbookSection'
import Footer from './components/Footer'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const canHover = window.matchMedia('(hover: hover)').matches

export default function App() {
  const { nowPlaying, recentTracks, musicHintState, setMusicHintState } = useNowPlaying()
  const feedRef = useRef(null)
  const pinRef = useRef(null)
  const [sequenceFailed, setSequenceFailed] = useState(false)
  const pinned = HELMET_SEQUENCE_ENABLED && !reducedMotion && !sequenceFailed
  const progress = useScrollProgress(pinRef, pinned)
  const onSequenceFail = useCallback(() => setSequenceFailed(true), [])

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Cursor spotlight over the grid
  useEffect(() => {
    if (reducedMotion || !canHover) return
    const root = document.documentElement
    let frame = 0
    let x = 0, y = 0
    function onMove(e) {
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0
        root.style.setProperty('--mx', `${x}px`)
        root.style.setProperty('--my', `${y}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div>
      <div aria-hidden className="bg-grid" />
      <div aria-hidden className="bg-spotlight" />
      <div ref={pinRef} style={{ height: pinned ? '220svh' : undefined, position: 'relative' }}>
        <HeroSection
          nowPlaying={nowPlaying}
          recentTracks={recentTracks}
          musicHintState={musicHintState}
          setMusicHintState={setMusicHintState}
          onScrollToFeed={scrollToFeed}
          pinned={pinned}
          progress={progress}
          onSequenceFail={onSequenceFail}
        />
      </div>
      <FeedSection ref={feedRef} />
      <GuestbookSection />
      <Footer />
    </div>
  )
}
