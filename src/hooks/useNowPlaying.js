import { useState, useRef, useEffect } from 'react'

const LASTFM_KEY = import.meta.env.VITE_LASTFM_API_KEY
const LASTFM_USER = import.meta.env.VITE_LASTFM_USERNAME

export default function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null)
  const [musicHintState, setMusicHintState] = useState('idle')
  const wasPlaying = useRef(false)

  useEffect(() => {
    if (musicHintState === 'showing') {
      const timer = setTimeout(() => setMusicHintState('hiding'), 2500)
      return () => clearTimeout(timer)
    }
    if (musicHintState === 'hiding') {
      const timer = setTimeout(() => setMusicHintState('done'), 1500)
      return () => clearTimeout(timer)
    }
  }, [musicHintState])

  useEffect(() => {
    function fetchNowPlaying() {
      fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`)
        .then(r => r.json())
        .then(data => {
          const track = data?.recenttracks?.track?.[0]
          if (!track) {
            setNowPlaying(null)
            wasPlaying.current = false
            return
          }
          const isPlaying = track['@attr']?.nowplaying === 'true'
          setNowPlaying({
            track: track.name,
            artist: track.artist['#text'],
            image: track.image?.find(i => i.size === 'large')?.['#text'] || '',
            isPlaying,
          })
          if (isPlaying && !wasPlaying.current) {
            setMusicHintState('showing')
          }
          wasPlaying.current = isPlaying
        })
        .catch(() => {})
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 10000)
    return () => clearInterval(interval)
  }, [])

  return { nowPlaying, musicHintState, setMusicHintState }
}
