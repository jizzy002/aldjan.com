export default function ThemeToggle({ isDark, setIsDark }) {
  const handleToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <style>{`
        .theme-switch {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 32px;
          border-radius: 16px;
          border: none;
          background: ${isDark ? '#4dc8ff' : '#ffa500'};
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: ${isDark ? 'flex-end' : 'flex-start'};
          transition: all 0.4s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 500;
          outline: none;
        }
        
        .theme-switch:hover {
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px ${isDark ? 'rgba(77, 200, 255, 0.4)' : 'rgba(255, 165, 0, 0.4)'};
          transform: scale(1.05);
        }
        
        .theme-switch-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          font-size: 16px;
          color: ${isDark ? '#4dc8ff' : '#ffa500'};
        }
      `}</style>
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
