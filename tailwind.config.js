/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D46A',
          50:  '#e6fff3',
          100: '#b3ffe0',
          200: '#66ffbe',
          300: '#1aff9c',
          400: '#00e875',
          500: '#00D46A',
          600: '#00a854',
          700: '#007a3d',
          800: '#004d26',
          900: '#002110',
        },
        dark: {
          DEFAULT: '#080808',
          card:    '#101010',
          border:  '#1c1c1c',
          hover:   '#161616',
          muted:   '#222222',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0H0v40' stroke='%231c1c1c' stroke-width='1'/%3E%3C/svg%3E\")",
        'glow-green': 'radial-gradient(ellipse at center, rgba(0,212,106,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(0,212,106,0.25)',
        'glow':     '0 0 24px rgba(0,212,106,0.3)',
        'glow-lg':  '0 0 48px rgba(0,212,106,0.2)',
        'card':     '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease forwards',
        'slide-up':  'slideUp 0.4s ease forwards',
        'pulse-slow':'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse':'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(0,212,106,0.2)' },
          '50%':     { boxShadow: '0 0 32px rgba(0,212,106,0.5)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.200'),
            a: { color: theme('colors.primary.400'), '&:hover': { color: theme('colors.primary.300') } },
            h1: { color: theme('colors.white'), fontFamily: theme('fontFamily.display').join(', ') },
            h2: { color: theme('colors.white'), fontFamily: theme('fontFamily.display').join(', ') },
            h3: { color: theme('colors.gray.100') },
            strong: { color: theme('colors.white') },
            code: {
              color: theme('colors.primary.400'),
              backgroundColor: theme('colors.dark.card'),
              borderRadius: '4px',
              padding: '2px 6px',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
              color: theme('colors.gray.300'),
            },
            hr: { borderColor: theme('colors.dark.border') },
            img: { borderRadius: '12px' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}