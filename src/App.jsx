import { useRef } from 'react'
import useNowPlaying from './hooks/useNowPlaying'
import HeroSection from './components/HeroSection'
import FeedSection from './components/FeedSection'
import GuestbookSection from './components/GuestbookSection'
import Footer from './components/Footer'

export default function App() {
  const { nowPlaying, recentTracks, musicHintState, setMusicHintState } = useNowPlaying()
  const feedRef = useRef(null)

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(200,220,20,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,220,20,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      />
      <HeroSection
        nowPlaying={nowPlaying}
        recentTracks={recentTracks}
        musicHintState={musicHintState}
        setMusicHintState={setMusicHintState}
        onScrollToFeed={scrollToFeed}
      />
      <FeedSection ref={feedRef} />
      <GuestbookSection />
      <Footer />
    </div>
  )
}
