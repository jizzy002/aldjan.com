import { useState, useRef, useEffect } from 'react'

const LASTFM_KEY = import.meta.env.VITE_LASTFM_API_KEY
const LASTFM_USER = import.meta.env.VITE_LASTFM_USERNAME

export default function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null)
  const [recentTracks, setRecentTracks] = useState([])
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
      fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=5`)
        .then(r => r.json())
        .then(data => {
          const tracks = data?.recenttracks?.track
          if (!tracks?.length) {
            setNowPlaying(null)
            setRecentTracks([])
            wasPlaying.current = false
            return
          }
          const first = tracks[0]
          const isPlaying = first['@attr']?.nowplaying === 'true'

          setNowPlaying({
            track: first.name,
            artist: first.artist['#text'],
            image: first.image?.find(i => i.size === 'large')?.['#text'] || '',
            isPlaying,
          })

          setRecentTracks(
            tracks.slice(1, 5).map(t => ({
              track: t.name,
              artist: t.artist['#text'],
              image: t.image?.find(i => i.size === 'small')?.['#text'] || '',
            }))
          )

          if (isPlaying && !wasPlaying.current) {
            setMusicHintState('showing')
          }
          wasPlaying.current = isPlaying
        })
        .catch(() => {})
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 25000)
    return () => clearInterval(interval)
  }, [])

  return { nowPlaying, recentTracks, musicHintState, setMusicHintState }
}
