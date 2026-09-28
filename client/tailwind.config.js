/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#04070D',
          900: '#080D18',
          850: '#0C1322',
          800: '#111A2E',
          700: '#1B2844',
          600: '#2A3C63',
        },
        aurora: {
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          DEFAULT: '#00F5A0',
          glow: 'rgba(0, 245, 160, 0.15)',
        },
        cyanElectric: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          glow: 'rgba(6, 182, 212, 0.15)',
        },
        amberGold: {
          400: '#FBBF24',
          500: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'aurora': '0 0 30px -5px rgba(0, 245, 160, 0.2)',
        'cyan': '0 0 30px -5px rgba(6, 182, 212, 0.2)',
        'executive': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
}
