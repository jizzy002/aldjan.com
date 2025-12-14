import { getPublicPosts, getPrivatePosts } from '../../testing/instagram';

export default function InstagramFeed({ colors, isDark }) {
  const publicPosts = getPublicPosts();
  const privatePosts = getPrivatePosts();

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const renderFeed = (posts, title, alignment) => (
    <div
      style={{
        flex: 1,
        margin: alignment === 'left' ? '0 auto 0 0' : '0 0 0 auto'
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '20px',
          color: colors.textLight,
          textAlign: alignment === 'left' ? 'left' : 'right'
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {posts.map(post => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src={post.image}
              alt={post.caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Hover Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                padding: '16px',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}
            >
              <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '14px' }}>
                  <span>❤️</span>
                  <span>{formatNumber(post.likes)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '14px' }}>
                  <span>💬</span>
                  <span>{formatNumber(post.comments)}</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#fff', lineHeight: '1.4' }}>
                {post.caption.length > 60 ? post.caption.substring(0, 60) + '...' : post.caption}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <section
      style={{
        padding: '60px 20px',
        backgroundColor: colors.bg
      }}
    >
      <h2
        style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '50px',
          color: colors.textLight,
          textAlign: 'center'
        }}
      >
        Instagram
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        {renderFeed(publicPosts, 'Public Profile', 'left')}
        {renderFeed(privatePosts, 'Private Profile', 'right')}
      </div>
    </section>
  );
}
