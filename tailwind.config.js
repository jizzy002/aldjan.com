/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- PALETTES ---
        // Dark Theme Colors (Default)
        'primary-blue': '#4dc8ff', // Deep Accent
        'primary-dark': '#e0e0e0', // Light Text
        'surface-light': '#121212', // Deep Dark Background
        'card-bg': '#1e1e1e', // Dark Card Surface
        
        // Light Theme Colors (Used when body has 'light-mode' class)
        'light-bg': '#f0f0f0',
        'light-surface': '#ffffff',
        'light-text': '#222222',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'material': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'material-hover': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'floating': '0 12px 20px rgba(0, 0, 0, 0.6)',
      }
    }
  },
  plugins: [],
}
