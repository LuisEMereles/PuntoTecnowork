/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#4285F4',
          DEFAULT: '#4285F4'
        },
        emphasis: {
          red: '#EA4335',
        },
        secondary: {
          yellow: '#FBBC05',
        },
        success: {
          green: '#34A853',
        },
        text: {
          carbon: '#323232',
          onColor: '#FAFAFA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}