/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy / Government Enterprise identity
        navy: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c2d7e9',
          300: '#94bcdb',
          400: '#5e9cc9',
          500: '#387eb4',
          600: '#276497',
          700: '#1f4f7a',
          800: '#1a4163',
          900: '#0f2942', // Platform Deep Navy
          950: '#0a1a2b',
        },
        gov: {
          blue: '#1e3a8a',
          dark: '#0f172a',
          gold: '#d97706',
          ash: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
