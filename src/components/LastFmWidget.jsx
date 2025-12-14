import { useState, useEffect } from 'react';

export default function LastFmWidget({ colors, isDark }) {
  const [track, setTrack] = useState({
    name: 'Example Song',
    artist: 'Example Artist',
    album: 'Example Album',
    image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png',
    url: '#'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
        const username = import.meta.env.VITE_LASTFM_USERNAME;
        
        if (!apiKey || !username) {
          console.warn('Last.fm API key or username not configured');
          setLoading(false);
          return;
        }

        const url = new URL('https://ws.audioscrobbler.com/2.0/');
        url.searchParams.append('method', 'user.getRecentTracks');
        url.searchParams.append('user', username);
        url.searchParams.append('api_key', apiKey);
        url.searchParams.append('format', 'json');
        url.searchParams.append('limit', '1');

        console.log('Fetching Last.fm data for user:', username);
        const response = await fetch(url);
        const data = await response.json();

        console.log('Last.fm response:', data);

        if (data.error) {
          console.error('Last.fm API error:', data.message);
          setLoading(false);
          return;
        }

        if (data.recenttracks?.track) {
          // track is an array, get the first one (currently playing)
          const trackData = Array.isArray(data.recenttracks.track) 
            ? data.recenttracks.track[0] 
            : data.recenttracks.track;
          
          if (!trackData) {
            console.warn('No track data found');
            setLoading(false);
            return;
          }
          
          // Handle artist data (can be string or object)
          let artist = '';
          if (typeof trackData.artist === 'string') {
            artist = trackData.artist;
          } else if (trackData.artist?.name) {
            artist = trackData.artist.name;
          } else if (trackData.artist?.['#text']) {
            artist = trackData.artist['#text'];
          }

          // Handle album data
          let album = '';
          if (typeof trackData.album === 'string') {
            album = trackData.album;
          } else if (trackData.album?.['#text']) {
            album = trackData.album['#text'];
          }

          // Handle image
          let image = 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png';
          if (Array.isArray(trackData.image) && trackData.image.length > 0) {
            console.log('Image array:', trackData.image);
            // Last.fm returns images in order: small (0), medium (1), large (2), extralarge (3)
            image = trackData.image[3]?.['#text'] || trackData.image[2]?.['#text'] || trackData.image[1]?.['#text'] || image;
            console.log('Selected image URL:', image);
          }

          console.log('Current track:', trackData.name, 'by', artist);
          
          setTrack({
            name: trackData.name || 'Unknown Track',
            artist: artist || 'Unknown Artist',
            album: album || 'Unknown Album',
            image: image,
            url: trackData.url || '#'
          });
        } else {
          console.warn('No recent tracks found in response');
        }
      } catch (error) {
        console.error('Error fetching Last.fm data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: colors.cardBg,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      maxWidth: '280px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = colors.primary;
      e.currentTarget.style.boxShadow = isDark 
        ? '0 8px 16px rgba(77, 200, 255, 0.15)' 
        : '0 8px 16px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = colors.border;
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Album Art */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: colors.border
      }}>
        <img 
          src={track.image} 
          alt={track.album}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Track Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          color: colors.textMuted,
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '600'
        }}>
          He's listening to:
        </div>
        
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: colors.textLight,
          margin: '0 0 4px 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {track.name}
        </h3>

        <p style={{
          fontSize: '12px',
          color: colors.textMuted,
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {track.artist}
        </p>
      </div>

      {/* Last.fm Icon */}
      <div style={{
        fontSize: '20px',
        color: colors.primary,
        flexShrink: 0
      }}>
        <i className="fab fa-spotify"></i>
      </div>
    </div>
  );
}
