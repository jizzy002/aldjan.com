import { useState } from 'react';
import { GALLERY_ITEMS, getLightboxUrl, getLightboxSrcSet, getPlaceholderUrl } from '../data';

export default function Lightbox({ imageIndex, onClose, colors, isDark }) {
  const [index, setIndex] = useState(imageIndex);
  const item = GALLERY_ITEMS[index];

  const nextImage = () => setIndex((index + 1) % GALLERY_ITEMS.length);
  const prevImage = () => setIndex((index - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
    else if (e.key === 'Escape') onClose();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '20px',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          margin: 'auto',
          overflow: 'visible',
          animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={getLightboxUrl(item.imgur)}
              srcSet={getLightboxSrcSet(item.imgur)}
              alt={item.title}
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
                backgroundImage: `url('${getPlaceholderUrl(item.imgur)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Controls - Positioned over image with padding */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                color: colors.primary,
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 0
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: isMobile ? '12px' : '16px', color: isDark ? colors.textLight : '#ffffff', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '16px' : '18px', marginBottom: '0', margin: `0 0 ${isMobile ? '10px' : '12px'} 0`, color: isDark ? colors.textLight : '#ffffff' }}>{item.title}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '12px' : '24px', flexWrap: 'wrap' }}>
            <button
              onClick={prevImage}
              style={{
                backgroundColor: isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
                color: isDark ? colors.primary : '#ffffff',
                border: isDark ? `1px solid ${colors.primary}` : '1px solid #ffffff',
                width: isMobile ? '32px' : '36px',
                height: isMobile ? '32px' : '36px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ◀
            </button>
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: isDark ? colors.textMuted : '#cccccc', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
              {item.exif}
            </span>
            <button
              onClick={nextImage}
              style={{
                backgroundColor: isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
                color: isDark ? colors.primary : '#ffffff',
                border: isDark ? `1px solid ${colors.primary}` : '1px solid #ffffff',
                width: isMobile ? '32px' : '36px',
                height: isMobile ? '32px' : '36px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Counter */}
        <div style={{
          marginTop: isMobile ? '8px' : '12px',
          textAlign: 'center',
          color: isDark ? colors.textMuted : '#cccccc',
          fontSize: isMobile ? '11px' : '12px'
        }}>
          {index + 1} / {GALLERY_ITEMS.length}
        </div>
      </div>
    </div>
  );
}
