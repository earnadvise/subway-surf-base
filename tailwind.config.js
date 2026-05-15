/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: '#0052FF',
          dark: '#0A0B0D',
          light: '#F5F5F5',
          neon: '#00F0FF',
          purple: '#B533FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px #0052FF, 0 0 20px #0052FF' },
          '100%': { boxShadow: '0 0 20px #00F0FF, 0 0 40px #00F0FF' },
        }
      }
    },
  },
  plugins: [],
}
