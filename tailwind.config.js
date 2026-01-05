/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        nexus: {
          black: '#0a0a0a',
          dark: '#121212',
          card: '#1a1a1a',
          green: '#10b981', 
          greenGlow: '#34d399', 
          blue: '#06b6d4', 
          blueGlow: '#22d3ee', 
        }
      }
    },
  },
  plugins: [],
}