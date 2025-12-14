import { useState, useEffect } from 'react';
import { GALLERY_ITEMS, getLightboxUrl, getLightboxSrcSet, getPlaceholderUrl } from '../data';

export default function Lightbox({ imageIndex, onClose, colors, isDark }) {
  const [index, setIndex] = useState(imageIndex);
  const [isClosing, setIsClosing] = useState(false);
  const item = GALLERY_ITEMS[index];

  //Selfimplementation of touch events for mobile swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [swipeTrail, setSwipeTrail] = useState([]);

  const nextImage = () => setIndex((index + 1) % GALLERY_ITEMS.length);
  const prevImage = () => setIndex((index - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    }
    else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Add global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Disable page scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [index]);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setSwipeTrail([]);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null || touchStartY === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    // Create a new particle at current position
    setSwipeTrail((prev) => {
      const newTrail = [...prev, {
        id: Date.now() + Math.random(),
        x: currentX,
        y: currentY
      }];
      // Keep only last 15 particles for performance
      return newTrail.slice(-15);
    });
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage(); // swipe left = next
      }
      else {
        prevImage(); // swipe right = prev
      }
    }
    
    // Fade out trail
    setTimeout(() => setSwipeTrail([]), 300);
    setTouchStart(null);
    setTouchStartY(null);
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
        animation: isClosing ? 'fadeOutOnly 0.3s ease-out' : 'fadeIn 0.3s ease-out'
      }}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      autoFocus
    >
      {/* Close Button - Top Level */}
      <button
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
          color: colors.primary,
          border: isDark ? `1px solid ${colors.primary}` : '1px solid #ffffff',
          fontSize: '24px',
          cursor: 'pointer',
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1',
          padding: 0,
          zIndex: 1001,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';
        }}
      >     
        ✕
      </button>
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          margin: 'auto',
          overflow: 'hidden',
          animation: isClosing ? 'slideOutDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
        
      >
        {/* Image Container */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', gap: '20px' }}>
          {/* Prev Button - Desktop Only */}
          {!isMobile && (
            <button
              onClick={prevImage}
              style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
                color: colors.primary,
                border: isDark ? `1px solid ${colors.primary}` : '1px solid #ffffff',
                fontSize: '24px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                padding: 0,
                zIndex: 500,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';
              }}
            >
              ◀
            </button>
          )}

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={getLightboxUrl(item.imgur)}
              srcSet={getLightboxSrcSet(item.imgur)}
              sizes="(max-width: 768px) 100vw, 900px"
              alt={item.title}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
                backgroundImage: `url('${getPlaceholderUrl(item.imgur)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>

          {/* Next Button - Desktop Only */}
          {!isMobile && (
            <button
              onClick={nextImage}
              style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
                color: colors.primary,
                border: isDark ? `1px solid ${colors.primary}` : '1px solid #ffffff',
                fontSize: '24px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                padding: 0,
                zIndex: 500,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';
              }}
            >
              ▶
            </button>
          )}
        </div>
        
        <div style={{ marginTop: isMobile ? '12px' : '16px', color: isDark ? colors.textLight : '#ffffff', textAlign: 'center' }}>
          <h3 style={{ fontSize: isMobile ? '16px' : '18px', marginBottom: '0', margin: `0 0 ${isMobile ? '10px' : '12px'} 0`, color: isDark ? colors.textLight : '#ffffff' }}>{item.title}</h3>
          <p style={{ fontSize: isMobile ? '12px' : '14px', color: isDark ? colors.textMuted : '#cccccc', margin: 0 }}>
            {item.exif}
          </p>
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

      {/* Swipe Gesture Hint - Mobile Only */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: isDark ? colors.textMuted : '#999999',
          textAlign: 'center',
          opacity: 0.7
        }}>
          Swipe to navigate
        </div>
      )}

      {/* Swipe Trail Particles */}
      {isMobile && swipeTrail.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            pointerEvents: 'none',
            animation: 'fadeOut 0.6s ease-out forwards',
            boxShadow: `0 0 8px ${colors.primary}`,
            zIndex: 999
          }}
        />
      ))}
    </div>
  );
}
