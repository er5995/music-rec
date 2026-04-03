/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EC',
        'warm-white': '#FDF8F2',
        'ghibli-gold': '#D4A843',
        'ghibli-sage': '#7EA67A',
        'ghibli-blue': '#6B8FA0',
        'ghibli-lavender': '#B8A9C9',
        'ghibli-coral': '#D4847A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        'vinyl-spin': 'vinyl-spin 8s linear infinite',
        'vinyl-spin-slow': 'vinyl-spin 12s linear infinite',
        firefly: 'firefly 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'note-float': 'note-float 3s ease-in-out infinite',
        ellipsis: 'ellipsis 1.5s steps(4, end) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'vinyl-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        firefly: {
          '0%, 100%': { opacity: '0', transform: 'translate(0, 0) scale(1)' },
          '25%': { opacity: '1', transform: 'translate(20px, -30px) scale(1.2)' },
          '50%': { opacity: '0.7', transform: 'translate(-15px, -60px) scale(0.8)' },
          '75%': { opacity: '0.9', transform: 'translate(10px, -90px) scale(1.1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 67, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 67, 0.6), 0 0 80px rgba(212, 168, 67, 0.2)' },
        },
        'note-float': {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.8)' },
          '20%': { opacity: '1' },
          '80%': { opacity: '0.6' },
          '100%': { opacity: '0', transform: 'translateY(-120px) scale(1.1)' },
        },
        ellipsis: {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
          '100%': { content: '"."' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
