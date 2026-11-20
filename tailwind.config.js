/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#2b2140',
        twilight: '#2e1a5e',
        grape: '#6d4bc9',
        sky: '#4fb8e8',
        mint: '#5fd3a8',
        sun: '#ffc94b',
        coral: '#ff7a7a',
        blush: '#ff9ecb',
      },
      boxShadow: {
        pop: '0 12px 30px -10px rgba(39,22,78,.45)',
        card: '0 18px 40px -18px rgba(39,22,78,.55)',
        inset: 'inset 0 2px 0 rgba(255,255,255,.55)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0' },
          '10%': { opacity: '.9' },
          '100%': { transform: 'translate3d(var(--dx),-110vh,0) scale(1.35)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.8)', opacity: '.7' },
          '100%': { transform: 'scale(2.1)', opacity: '0' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(.6) translateY(14px)', opacity: '0' },
          '70%': { transform: 'scale(1.05) translateY(-2px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        drift: 'drift linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseRing: 'pulseRing 2.4s ease-out infinite',
        wiggle: 'wiggle 2.6s ease-in-out infinite',
        popIn: 'popIn .45s cubic-bezier(.2,.9,.3,1.2) both',
      },
    },
  },
  plugins: [],
};
