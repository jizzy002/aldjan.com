import { useState, forwardRef } from 'react';

const Footer = forwardRef(({ colors, isDark }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);

    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://formspree.io/f/mgvgzlbl', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsLoading(false);
        setShowSuccess(true);
        e.target.reset();
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        setIsLoading(false);
        setMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      setMessage('Error sending message. Please try again.');
    }
  };

  const testAnimation = () => {
    setIsLoading(true);
    setShowSuccess(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    }, 2500);
  };

  return (
    <footer
      ref={ref}
      style={{
        backgroundColor: colors.cardBg,
        padding: '60px 40px',
        borderTop: `1px solid ${colors.border}`,
        marginTop: 'auto'
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: 30px 16px !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes dotBounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes colorPulse {
          0% { color: #4dc8ff; }
          25% { color: #ff6b9d; }
          50% { color: #ffa500; }
          75% { color: #00ff88; }
          100% { color: #4dc8ff; }
        }
        
        @keyframes buttonShine {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(77, 200, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(77, 200, 255, 0);
          }
        }
        
        @keyframes fadeInText {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .success-message {
          animation: slideUp 0.4s ease-out, colorPulse 1.5s ease-in-out;
        }
        
        .success-text {
          animation: fadeInText 0.5s ease-out;
        }
        
        .loading-spinner {
          display: inline-flex;
          gap: 6px;
          align-items: center;
        }
        
        .loading-spinner span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          animation: dotBounce 1.4s infinite;
        }
        
        .loading-spinner span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .loading-spinner span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @media (max-width: 768px) {
          .footer-form div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          .footer-form button,
          .footer-form div[style*="display: flex"] {
            width: 100%;
          }
          .footer-form div[style*="display: flex"] {
            flex-direction: column;
          }
          
          .footer-form button {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          .footer-grid > div {
            margin: 0 auto !important;
            width: 100% !important;
            padding: 0 16px;
          }
          
          .footer-grid div[style*="display: flex"] {
            justify-content: center !important;
          }
        }
      `}</style>
      <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', padding: '0 20px' }}>
        {/* Left Column - About Me */}
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', color: colors.textLight }}>
            About Me
          </h2>
          <p style={{ fontSize: '15px', marginBottom: '24px', color: colors.textMuted, lineHeight: '1.8' }}>
            You're probably wondering how you found my website. You received it from someone, maybe you saw it on Google, or perhaps you were just intrigued about my photography and wanted to examine my collection and perhaps hire me to shoot some pictures of you? Anyways enjoy what you are looking at now!
          </p>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: colors.textLight }}>
              FIND ME ON:
            </h3>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'nowrap', justifyContent: 'flex-start', overflowX: 'auto' }}>
              {[
                { name: 'Facebook', url: 'https://www.facebook.com/ald.jan01/', icon: 'fab fa-facebook-f' },
                { name: 'Instagram', url: 'https://www.instagram.com/ald.jan/', icon: 'fab fa-instagram' },
                { name: 'Twitter', url: 'https://twitter.com/ald__jan', icon: 'fab fa-twitter' },
                { name: 'Snapchat', url: 'https://www.snapchat.com/add/ald_jan', icon: 'fab fa-snapchat-ghost' },
                { name: 'Telegram', url: 'https://t.me/jizzy002', icon: 'fab fa-telegram-plane' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aldin-jandri%C4%87-559aa3ab/', icon: 'fab fa-linkedin' }
              ].map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.primary,
                    textDecoration: 'none',
                    fontSize: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(0, 153, 204, 0.1)',
                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDark ? 'rgba(77, 200, 255, 0.2)' : 'rgba(0, 153, 204, 0.2)';
                    e.target.style.transform = 'translateY(-4px) scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(0, 153, 204, 0.1)';
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                  title={social.name}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', color: colors.textMuted, fontSize: '15px' }}>
              © 2025 aldjan.com
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', color: colors.textLight }}>
            Get in Touch
          </h2>
          <form onSubmit={handleSubmit} className="footer-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: isDark ? '#ffffff' : '#000000',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(0, 153, 204, 0.1)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: isDark ? '#ffffff' : '#000000',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(0, 153, 204, 0.1)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                required
                style={{
                  gridColumn: '1 / -1',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: isDark ? '#ffffff' : '#000000',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(77, 200, 255, 0.1)' : 'rgba(0, 153, 204, 0.1)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: showSuccess ? '#22c55e' : colors.primary,
                  color: isDark ? '#000000' : '#ffffff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: isLoading || showSuccess ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isDark ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && !showSuccess) {
                    const hoverColor = isDark ? '#82e0ffff' : 'rgba(77, 200, 255, 0.9)';
                    const hoverSuccessColor = isDark ? '#4ae876' : 'rgba(34, 197, 94, 0.9)';
                    e.target.style.backgroundColor = showSuccess ? hoverSuccessColor : hoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = showSuccess ? '#22c55e' : colors.primary;
                }}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </> 
                ) : showSuccess ? (
                  <>
                    <span className="success-text"> Message Sent!</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
              <button
                type="reset"
                style={{
                  backgroundColor: colors.border,
                  color: isDark ? '#ffffff' : '#000000',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.border;
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
