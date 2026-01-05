/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base oscura elegante
        surface: {
          DEFAULT: '#0a0a0f',
          raised: '#12121a',
          overlay: '#1a1a24',
          subtle: '#22222e',
        },
        // Acento principal - coral/naranja vibrante
        accent: {
          DEFAULT: '#ff6b35',
          light: '#ff8c5a',
          dark: '#e55a2b',
          glow: 'rgba(255, 107, 53, 0.3)',
        },
        // Secundario - cyan eléctrico
        electric: {
          DEFAULT: '#00d4ff',
          light: '#5aebff',
          dark: '#00a8cc',
          glow: 'rgba(0, 212, 255, 0.3)',
        },
        // Estados
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        // Texto
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 40px rgba(255, 107, 53, 0.15)',
        'glow-electric': '0 0 40px rgba(0, 212, 255, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}