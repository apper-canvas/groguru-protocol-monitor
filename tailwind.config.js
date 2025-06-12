/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',
        secondary: '#7CB342',
        accent: '#FF6B35',
        surface: {
          50: '#FAFAF5',
          100: '#F5F5DC',
          200: '#F0F0E8',
          300: '#E8E8DC',
          400: '#D0D0C4',
          500: '#B8B8AC',
          600: '#9A9A8E',
          700: '#7C7C70',
          800: '#5E5E52',
          900: '#404034'
        },
        semantic: {
          success: '#4CAF50',
          warning: '#FFA726',
          error: '#EF5350',
          info: '#29B6F6'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['DM Serif Display', 'ui-serif', 'Georgia'],
        display: ['DM Serif Display', 'ui-serif', 'Georgia']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [],
}