import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const theme = isDark ? 'dark' : 'light';
  
  const colors = {
    dark: {
      bg: '#121212',
      cardBg: '#1e1e1e',
      textLight: '#e0e0e0',
      textMuted: '#9ca3af',
      border: '#333333',
      primary: '#4dc8ff',
      input: '#222222'
    },
    light: {
      bg: '#ffffff',
      cardBg: '#f5f5f5',
      textLight: '#222222',
      textMuted: '#666666',
      border: '#e0e0e0',
      primary: '#0099cc',
      input: '#f9f9f9'
    }
  };

  return {
    isDark,
    setIsDark,
    theme,
    colors: colors[theme]
  };
};
