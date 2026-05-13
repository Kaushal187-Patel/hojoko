/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan app, components, and utils for class names (production purge)
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './utils/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f4ef',
        ink: '#171412',
        stone: {
          50: '#faf8f5',
          100: '#f0ebe4',
          200: '#ddd4c8',
          300: '#c4b8a8',
          500: '#8a7d6d',
          700: '#4f463d',
        },
        brand: {
          50: '#faf8f5',
          100: '#f0ebe4',
          500: '#8a7d6d',
          600: '#6f6356',
          700: '#4f463d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 20, 18, 0.08)',
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
