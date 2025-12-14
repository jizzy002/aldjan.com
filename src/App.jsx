import { useState, useRef } from 'react';
import { useTheme } from './useTheme';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import FloatingLastFm from './components/FloatingLastFm';
import Lightbox from './components/Lightbox';

export default function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const footerRef = useRef(null);
  const { isDark, setIsDark, colors } = useTheme();

  const handleScrollToFooter = () => {
    setTimeout(() => {
      footerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.textLight, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onAboutClick={handleScrollToFooter} colors={colors} isDark={isDark} />
      <Gallery onImageClick={setCurrentImageIndex} colors={colors} isDark={isDark} />
      <Footer ref={footerRef} colors={colors} isDark={isDark} />
      <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      <FloatingLastFm colors={colors} isDark={isDark} />
      {currentImageIndex !== null && (
        <Lightbox imageIndex={currentImageIndex} onClose={() => setCurrentImageIndex(null)} colors={colors} isDark={isDark} />
      )}
    </div>
  );
}
