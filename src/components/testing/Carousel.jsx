import { useState, useEffect, useRef } from 'react';
import { GALLERY_ITEMS, getThumbUrl, getThumbSrcSet, getPlaceholderUrl } from '../../data';

export default function Carousel({ onImageClick, colors, isDark }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragCurrent, setDragCurrent] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const autoScrollTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const TRANSITION_DURATION = 800; // ms
  const AUTO_SCROLL_INTERVAL = 5000;
  const PAUSE_DURATION = 3000;


  // Handle drag/mouse events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragCurrent(e.clientX);
    setIsAutoScrolling(false);
    clearInterval(autoScrollTimerRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dragDistance = dragStart - e.clientX;
    setDragCurrent(e.clientX);

    // Advance carousel on drag (every 100px of movement)
    const threshold = 100;
    const moves = Math.floor(Math.abs(dragDistance) / threshold);
    
    if (moves > 0) {
      if (dragDistance > 0) {
        // Dragging left = advance forward
        setCurrentIndex((prev) => (prev + moves) % GALLERY_ITEMS.length);
      } else {
        // Dragging right = advance backward
        setCurrentIndex((prev) => (prev - moves + GALLERY_ITEMS.length * 10) % GALLERY_ITEMS.length);
      }
      setDragStart(e.clientX);
    }

    // Calculate tilt effect
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
      const y = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      setTilt({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });

    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, PAUSE_DURATION);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
        setIsAutoScrolling(false);
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          setIsAutoScrolling(true);
        }, PAUSE_DURATION);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
        setIsAutoScrolling(false);
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          setIsAutoScrolling(true);
        }, PAUSE_DURATION);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCurrentSlide = (offset) => {
    return GALLERY_ITEMS[(currentIndex + offset + GALLERY_ITEMS.length) % GALLERY_ITEMS.length];
  };

  const getSlideTransform = (position) => {
    // Center card (largest)
    if (position === 0) return { left: '50%', top: '50%', tx: 0, ty: 0, rotY: 0, rotZ: 0, scale: 1.1, tz: 0 };
    
    // Right cards (next cards) - compact stacked layout
    if (position === 1) return { left: '55%', top: '53%', tx: '0px', ty: '0px', rotY: 0, rotZ: 0, scale: 0.96, tz: -30 };
    if (position === 2) return { left: '60%', top: '56%', tx: '0px', ty: '5px', rotY: 0, rotZ: 0, scale: 0.90, tz: -80 };
    if (position === 3) return { left: '64%', top: '58%', tx: '0px', ty: '8px', rotY: 0, rotZ: 0, scale: 0.84, tz: -120 };
    
    // Left cards (previous cards) - compact stacked layout
    if (position === -1) return { left: '45%', top: '53%', tx: '0px', ty: '0px', rotY: 0, rotZ: 0, scale: 0.96, tz: -30 };
    if (position === -2) return { left: '40%', top: '56%', tx: '0px', ty: '5px', rotY: 0, rotZ: 0, scale: 0.90, tz: -80 };
    if (position === -3) return { left: '36%', top: '58%', tx: '0px', ty: '8px', rotY: 0, rotZ: 0, scale: 0.84, tz: -120 };
    
    // Hidden cards behind
    if (position > 0) return { left: `${68 + (position - 4) * 3}%`, top: `60%`, tx: `0px`, ty: `10px`, rotY: 0, rotZ: 0, scale: 0.78, tz: -160 };
    if (position < 0) return { left: `${32 - (Math.abs(position) - 4) * 3}%`, top: `60%`, tx: `0px`, ty: `10px`, rotY: 0, rotZ: 0, scale: 0.78, tz: -160 };
    
    return { left: '50%', top: '50%', tx: 0, ty: 0, rotY: 0, rotZ: 0, scale: 0.9, tz: -200 };
  };

  const renderSlide = (offset, position) => {
    const slide = getCurrentSlide(offset);
    const transform = getSlideTransform(position);
    const isCurrent = position === 0;
    const isVisible = Math.abs(position) <= 3;

    // Determine animation based on position
    let animationName = '';
    if (!isDragging && isVisible) {
      if (isCurrent) animationName = 'slideInCenter';
      else if (position > 0) animationName = 'slideInFromRight';
      else animationName = 'slideInFromLeft';
    }

    // Calculate z-index to stack cards properly
    const zIndex = 100 - Math.abs(position) * 5;

    return (
      <div
        key={`${slide.id}-${position}`}
        data-position={position === 0 ? 'current' : position > 0 ? 'next' : 'previous'}
        style={{
          position: 'absolute',
          left: transform.left,
          top: transform.top,
          width: '380px',
          height: '460px',
          perspective: '1000px',
          transform: `translate(-50%, -50%) translate3d(${transform.tx}, ${transform.ty}, ${transform.tz}px) rotateY(${transform.rotY}deg) rotateZ(${transform.rotZ}deg) scale(${transform.scale})`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : `transform ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          animation: isDragging ? 'none' : `${animationName} ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          cursor: isCurrent ? 'grab' : 'pointer',
          zIndex: zIndex,
          pointerEvents: isCurrent ? 'auto' : 'none',
          opacity: isVisible ? 1 : 0,
          overflow: 'hidden',
          borderRadius: '16px'
        }}
        onClick={() => {
          if (isCurrent) {
            onImageClick(currentIndex);
          } else if (position > 0) {
            setCurrentIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
          } else {
            setCurrentIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
          }
          setIsAutoScrolling(false);
          clearTimeout(resumeTimerRef.current);
          resumeTimerRef.current = setTimeout(() => {
            setIsAutoScrolling(true);
          }, PAUSE_DURATION);
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transform: isCurrent && isDragging ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            boxShadow: isDark
              ? `0 20px 40px rgba(0, 0, 0, 0.5)`
              : `0 20px 40px rgba(0, 0, 0, 0.2)`
          }}
        >
          <img
            src={getThumbUrl(slide.imgur)}
            srcSet={getThumbSrcSet(slide.imgur)}
            sizes="280px"
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: !isCurrent ? 'brightness(0.5)' : 'brightness(0.8)',
              transition: 'filter 0.3s ease'
            }}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          {isCurrent && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '24px 16px 16px',
                animation: 'slideInUp 0.5s ease-out'
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: colors.textLight,
                  marginBottom: '8px'
                }}
              >
                {slide.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#999',
                  lineHeight: '1.4'
                }}
              >
                {slide.exif}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px'
      }}
    >
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate3d(-400px, 0, -300px) rotateY(60deg) scale(0.6);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) translate3d(-280px, 0, -100px) rotateY(45deg) scale(1);
          }
        }

        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate3d(400px, 0, -300px) rotateY(-60deg) scale(0.6);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) translate3d(280px, 0, -100px) rotateY(-45deg) scale(1);
          }
        }

        @keyframes slideInCenter {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) translate3d(0, 20px, -200px) scale(0.7);
          }
          50% {
            opacity: 0.9;
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1.2);
          }
        }

        main:active {
          cursor: grabbing;
        }
      `}</style>

      {/* Background blur effect */}
      {currentIndex !== null && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${getPlaceholderUrl(getCurrentSlide(0).imgur)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.4)',
            zIndex: -1,
            transition: `opacity ${TRANSITION_DURATION}ms ease`,
            opacity: 0.8
          }}
        />
      )}

      {/* Slides container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          maxWidth: '90vw'
        }}
      >
        {renderSlide(-3, -3)}
        {renderSlide(-2, -2)}
        {renderSlide(-1, -1)}
        {renderSlide(0, 0)}
        {renderSlide(1, 1)}
        {renderSlide(2, 2)}
        {renderSlide(3, 3)}
      </div>

      {/* Navigation hint */}
      <div
        style={{
          marginTop: '60px',
          fontSize: '13px',
          color: colors.textMuted,
          textAlign: 'center'
        }}
      >
        ← Drag or Swipe to Navigate →
      </div>
    </main>
  );
}
