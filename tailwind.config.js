/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fef5f9',
          100: '#fde9f3',
          200: '#fcd3e7',
          300: '#fab0d4',
          400: '#f77fb8',
          500: '#f0559d',
          600: '#de337d',
          700: '#c02363',
          800: '#9f2053',
          900: '#851f48',
        },
        pastel: {
          pink: '#FFE4E9',
          purple: '#E4D4F4',
          blue: '#D4E4F4',
          mint: '#D4F4E4',
        }
      },
      fontFamily: {
        sans: ['"Bitcount Prop Double"', 'sans-serif'],
      },
      borderRadius: {
        'bubble': '20px',
        'super': '30px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 182, 193, 0.3)',
        'hover': '0 8px 30px rgba(255, 182, 193, 0.4)',
      }
    },
  },
  plugins: [],
}
