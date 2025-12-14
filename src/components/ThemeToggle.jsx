export default function ThemeToggle({ isDark, setIsDark }) {
  const handleToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <style>{`
        .theme-switch-container {
          position: fixed;
          bottom: 19px;
          right: 18px;
          width: 62px;
          height: 38px;
          border-radius: 24px;
          background: ${isDark ? 'rgba(77, 200, 255, 0.15)' : 'rgba(255, 165, 0, 0.15)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? 'rgba(77, 200, 255, 0.3)' : 'rgba(255, 165, 0, 0.3)'};
          z-index: 499;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease;
        }

        .theme-switch {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 50px;
          height: 28px;
          border-radius: 14px;
          border: none;
          background: ${isDark ? '#4dc8ff' : '#ffa500'};
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: ${isDark ? 'flex-end' : 'flex-start'};
          transition: all 0.4s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 500;
          outline: none;
          backdrop-filter: blur(8px);
          background: ${isDark ? 'rgba(77, 200, 255, 0.9)' : 'rgba(255, 165, 0, 0.9)'};
        }
        
        .theme-switch:hover {
          box-shadow: 0 6px 20px ${isDark ? 'rgba(77, 200, 255, 0.5)' : 'rgba(255, 165, 0, 0.5)'};
          transform: scale(1.08);
        }
        
        .theme-switch-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          font-size: 14px;
          color: ${isDark ? '#4dc8ff' : '#ffa500'};
        }
      `}</style>
      <div className="theme-switch-container"></div>
      <button
        onClick={handleToggle}
        className="theme-switch"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="theme-switch-circle">
          <i className={`fas fa-${isDark ? 'moon' : 'sun'}`}></i>
        </div>
      </button>
    </>
  );
}
