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
          .footer-form button {
            width: 100%;
          }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        {/* Left Column - About Me */}
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: colors.textLight }}>
            About Me
          </h2>
          <p style={{ marginBottom: '24px', color: colors.textMuted, lineHeight: '1.8' }}>
            You're probably wondering how you found my website. You received it from someone, maybe you saw it on Google, or perhaps you were just intrigued about my photography and wanted to examine my collection and perhaps hire me to shoot some pictures of you? Anyways enjoy what you are looking at now!
          </p>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: colors.textLight }}>
              FIND ME ON:
            </h3>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {[
                { name: 'Facebook', url: 'https://www.facebook.com/ald.jan01/', icon: 'fab fa-facebook-f' },
                { name: 'Instagram', url: 'https://www.instagram.com/ald.jan/', icon: 'fab fa-instagram' },
                { name: 'Twitter', url: 'https://twitter.com/ald__jan', icon: 'fab fa-twitter' },
                { name: 'Snapchat', url: 'https://www.snapchat.com/add/ald_jan', icon: 'fab fa-snapchat-ghost' },
                { name: 'Telegram', url: 'https://t.me/jizzy002', icon: 'fab fa-telegram-plane' }
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
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: colors.textLight }}>
            Get in Touch
          </h3>
          <form onSubmit={handleSubmit} className="footer-form">
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: colors.input,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.textLight,
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: colors.input,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.textLight,
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: colors.input,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.textLight,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: showSuccess ? '#22c55e' : colors.primary,
                color: isDark ? '#000000' : '#ffffff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: isLoading || showSuccess ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden'
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
          </form>
        </div>
      </div>

      <div style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: `1px solid ${colors.border}`,
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: '12px'
      }}>
        © 2025 aldjan.com. All rights reserved.
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
