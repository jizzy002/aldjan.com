import { useState, useEffect } from 'react';

export default function FloatingLastFm({ colors, isDark }) {
  const [track, setTrack] = useState({
    name: 'Not Playing',
    artist: 'Last.fm',
    album: 'Unknown Album',
    image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png',
    url: '#'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
          console.error('Last.fm API error:', data.message);
          setLoading(false);
          return;
        }

        if (data.recenttracks?.track) {
          const trackData = Array.isArray(data.recenttracks.track)
            ? data.recenttracks.track[0]
            : data.recenttracks.track;

          if (!trackData) {
            setLoading(false);
            return;
          }

          let artist = '';
          if (typeof trackData.artist === 'string') {
            artist = trackData.artist;
          } else if (trackData.artist?.name) {
            artist = trackData.artist.name;
          } else if (trackData.artist?.['#text']) {
            artist = trackData.artist['#text'];
          }

          let album = '';
          if (typeof trackData.album === 'string') {
            album = trackData.album;
          } else if (trackData.album?.['#text']) {
            album = trackData.album['#text'];
          }

          let image = 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png';
          if (Array.isArray(trackData.image) && trackData.image.length > 0) {
            image = trackData.image[3]?.['#text'] || trackData.image[2]?.['#text'] || trackData.image[1]?.['#text'] || image;
          }

          setTrack({
            name: trackData.name || 'Unknown Track',
            artist: artist || 'Unknown Artist',
            album: album || 'Unknown Album',
            image: image,
            url: trackData.url || '#'
          });

          // Check if currently playing
          setIsPlaying(trackData['@attr']?.nowplaying === 'true');
        }
      } catch (error) {
        console.error('Error fetching Last.fm data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes waveform {
          0%, 100% { height: 12px; }
          50% { height: 18px; }
        }
        
        @keyframes waveform-2 {
          0%, 100% { height: 10px; }
          50% { height: 16px; }
        }
        
        @keyframes waveform-3 {
          0%, 100% { height: 11px; }
          50% { height: 17px; }
        }
        
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 ${colors.primary}80;
          }
          70% {
            box-shadow: 0 0 0 10px ${colors.primary}00;
          }
          100% {
            box-shadow: 0 0 0 0 ${colors.primary}00;
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .floating-circle {
          animation: slideInLeft 0.5s ease-out;
        }
        
        .floating-circle.playing {
          animation: pulse-ring 2s infinite;
        }

        /* Responsive popup - edit these to adjust sizes */
        @media (max-width: 768px) {
          .floating-popup {
            width: calc(100vw - 120px) !important;
            max-width: none !important;
            padding: 16px !important;
          }
          .floating-popup img {
            aspect-ratio: 1 !important;
            margin-bottom: 12px !important;
          }
          .floating-popup h3 {
            font-size: 13px !important;
          }
          .floating-popup p {
            font-size: 11px !important;
          }
        }
      `}</style>

      {/* Floating Circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-circle"
        style={{
          position: 'fixed',
          left: '24px',
          bottom: '24px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.primary}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          zIndex: 999,
          transition: 'all 0.3s ease',
          boxShadow: isDark
            ? `0 8px 16px rgba(0, 0, 0, 0.3), inset 0 0 20px ${colors.primary}20`
            : `0 8px 16px rgba(0, 0, 0, 0.1), inset 0 0 20px ${colors.primary}10`,
          ...(isPlaying && {
            animation: 'pulse-ring 2s infinite'
          })
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = isDark
            ? `0 12px 24px rgba(0, 0, 0, 0.4), inset 0 0 20px ${colors.primary}30`
            : `0 12px 24px rgba(0, 0, 0, 0.15), inset 0 0 20px ${colors.primary}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = isDark
            ? `0 8px 16px rgba(0, 0, 0, 0.3), inset 0 0 20px ${colors.primary}20`
            : `0 8px 16px rgba(0, 0, 0, 0.1), inset 0 0 20px ${colors.primary}10`;
        }}
        title={isPlaying ? track.name : 'Not Playing'}
      >
        {isPlaying ? (
          <div style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'flex-end',
            height: '24px'
          }}>
            <div style={{
              width: '4px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              animation: 'waveform 0.6s ease-in-out infinite'
            }} />
            <div style={{
              width: '4px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              animation: 'waveform-2 0.6s ease-in-out infinite',
              animationDelay: '0.1s'
            }} />
            <div style={{
              width: '4px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              animation: 'waveform-3 0.6s ease-in-out infinite',
              animationDelay: '0.2s'
            }} />
          </div>
        ) : (
          <i className="fab fa-spotify" style={{
            fontSize: '24px',
            color: colors.primary,
            opacity: 0.6
          }}></i>
        )}
      </button>

      {/* Cloud Popup */}
      {isOpen && (
        <div
          className="floating-popup"
          style={{
            position: 'fixed',
            left: '24px',
            bottom: '76px',
            backgroundColor: colors.cardBg,
            borderRadius: '20px',
            padding: '20px',
            boxShadow: isDark
              ? '0 20px 40px rgba(0, 0, 0, 0.5)'
              : '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${colors.border}`,
            maxWidth: '280px',
            zIndex: 999,
            animation: 'slideInLeft 0.3s ease-out',
            backdropFilter: 'blur(10px)',
            margin: '0 auto'
          }}
        >
        
          {/* Album Art */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px',
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
          <div>
            <div style={{
              fontSize: '11px',
              color: colors.textMuted,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600'
            }}>
              {isPlaying ? 'Now Playing' : 'Last Played'}
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
              margin: '0 0 8px 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {track.artist}
            </p>

            {/* Link to Last.fm */}
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                fontSize: '11px',
                color: colors.primary,
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.textDecoration = 'none';
              }}
            >
              View on Last.fm →
            </a>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998
          }}
        />
      )}
    </>
  );
}
