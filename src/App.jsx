import { useCallback, useEffect, useRef, useState } from 'react'
import useNowPlaying from './hooks/useNowPlaying'
import HeroSection from './components/HeroSection'
import { HELMET_SEQUENCE_ENABLED } from './components/HelmetSequence'
import FeedSection from './components/FeedSection'
import GuestbookSection from './components/GuestbookSection'
import Footer from './components/Footer'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const canHover = window.matchMedia('(hover: hover)').matches

export default function App() {
  const [musicHold, setMusicHold] = useState(true) // hero reports: intro running / scrolled away
  const { nowPlaying, recentTracks, musicHintState, setMusicHintState } = useNowPlaying(musicHold)
  const feedRef = useRef(null)
  const [sequenceFailed, setSequenceFailed] = useState(false)
  const sequenceEnabled = HELMET_SEQUENCE_ENABLED && !sequenceFailed
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
      <HeroSection
        nowPlaying={nowPlaying}
        recentTracks={recentTracks}
        musicHintState={musicHintState}
        setMusicHintState={setMusicHintState}
        onScrollToFeed={scrollToFeed}
        sequenceEnabled={sequenceEnabled}
        reducedMotion={reducedMotion}
        onSequenceFail={onSequenceFail}
        onMusicHold={setMusicHold}
      />
      <FeedSection ref={feedRef} />
      <GuestbookSection />
      <Footer />
    </div>
  )
}
