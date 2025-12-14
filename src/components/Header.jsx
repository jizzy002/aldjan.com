import { useState } from 'react';

export default function Header({ onAboutClick, colors, isDark }) {
  const [titleHovered, setTitleHovered] = useState(false);

  const handleAboutClick = () => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Scroll to footer with padding above "About Me" text
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        const scrollPosition = window.scrollY + footerRect.top - 80; // 80px padding
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }
    } else {
      // Desktop behavior - call original handler
      onAboutClick();
    }
  };

  return (
    <>
      <style>{`
        .header-container {
          justify-content: space-between;
          flex-direction: row;
        }
        
        .header-title a {
          transition: color 0.3s ease;
          cursor: pointer;
        }
        
        .about-button {
          transition: all 0.3s ease;
        }
        
        
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .header-title {
            white-space: nowrap !important;
          }
        }
      `}</style>
      <header style={{
        backgroundColor: colors.cardBg,
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0 0 12px 12px',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
      }} className="header-container">
        <h1 style={{ fontSize: '23px', fontWeight: '300', color: colors.textLight, whiteSpace: 'nowrap' }} className="header-title">
          <a 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ 
              color: titleHovered ? colors.primary : colors.textLight, 
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            <strong style={{ fontWeight: 'bold' }}>Aldin Jandric's</strong> Homepage
          </a>
        </h1>
        <button
          onClick={handleAboutClick}
          className="about-button"
          style={{
            backgroundColor: colors.primary,
            color: isDark ? '#000000' : '#ffffff',
            border: `1px solid ${colors.primary}`,
            fontSize: '16px',
            cursor: 'pointer',
            padding: '8px 18px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDark ? 'rgba(77, 200, 255, 0.9)' : 'rgba(0, 153, 204, 0.9)';
            e.target.style.boxShadow = isDark ? '0 4px 12px rgba(77, 200, 255, 0.3)' : '0 4px 12px rgba(0, 153, 204, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-info-circle" style={{ marginRight: '8px' }} />About
        </button>
      </header>
    </>
  );
}
