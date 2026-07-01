/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      /* ── Brand colours ──────────────────────────────────────────── */
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8fafc',
          border:  '#e2e8f0',
        },
      },

      /* ── Typography ─────────────────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ── Shadows ────────────────────────────────────────────────── */
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover':'0 4px 12px 0 rgb(0 0 0 / 0.10)',
        'panel':    '0 8px 32px -4px rgb(0 0 0 / 0.14)',
      },

      /* ── Height: dvh so iOS Safari viewport is handled correctly ── */
      height: {
        screen: '100dvh',
      },
      minHeight: {
        screen: '100dvh',
      },

      /* ── Animations ─────────────────────────────────────────────── */
      keyframes: {
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-in-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'slide-in-up':    'slide-in-up 0.2s ease-out',
        'fade-in':        'fade-in 0.15s ease-out',
      },
    },
  },

  plugins: [],
};
