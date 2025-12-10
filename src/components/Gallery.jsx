import { GALLERY_ITEMS, getThumbUrl, getThumbSrcSet, getPlaceholderUrl } from '../data';

export default function Gallery({ onImageClick, colors, isDark }) {
  return (
    <main style={{ flex: 1, backgroundColor: colors.bg }}>
      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onImageClick(item.id - 1)}
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isDark ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
              animation: `slideInUp 0.5s ease-out ${index * 0.05}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = isDark ? '0 12px 24px rgba(0, 0, 0, 0.4)' : '0 12px 24px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = isDark ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <img
              src={getThumbUrl(item.imgur)}
              srcSet={getThumbSrcSet(item.imgur)}
              alt={item.title}
              loading={item.id === 1 ? 'eager' : 'lazy'}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
                backgroundImage: `url('${getPlaceholderUrl(item.imgur)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: colors.textLight }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '12px', color: colors.textMuted }}>
                {item.exif}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
