import { useRef } from 'react'
import useNowPlaying from './hooks/useNowPlaying'
import HeroSection from './components/HeroSection'
import FeedSection from './components/FeedSection'
import Footer from './components/Footer'

export default function App() {
  const { nowPlaying, recentTracks, musicHintState, setMusicHintState } = useNowPlaying()
  const feedRef = useRef(null)

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: '#080808', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <HeroSection
        nowPlaying={nowPlaying}
        recentTracks={recentTracks}
        musicHintState={musicHintState}
        setMusicHintState={setMusicHintState}
        onScrollToFeed={scrollToFeed}
      />
      <FeedSection ref={feedRef} />
      <Footer />
    </div>
  )
}
