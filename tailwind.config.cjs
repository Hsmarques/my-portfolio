/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: '#1a0f14',
        vinho: {
          DEFAULT: '#592532',
          50:  '#fdf2f4',
          100: '#f8d9df',
          200: '#f0b3bf',
          300: '#d4707e',
          400: '#8a3044',
          500: '#592532',
          600: '#4a1e2a',
          700: '#3b1721',
          800: '#2c1019',
          900: '#1a0a0f',
        },
        superbock: {
          DEFAULT: '#D49E08',
          50:  '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#f5c842',
          400: '#D49E08',
          500: '#b88700',
          600: '#9a7100',
          700: '#7c5b00',
          800: '#5e4400',
          900: '#3f2e00',
        },
        bacalhau: {
          DEFAULT: '#FFF0D1',
          50:  '#fffbf0',
          100: '#FFF0D1',
          200: '#ffe8b8',
          300: '#ffd98a',
          400: '#f5c842',
          500: '#d4a820',
        },
        accent: {
          300: '#FFF0D1',
          400: '#D49E08',
          500: '#b88700',
          600: '#592532',
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Cantarell", "Noto Sans", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Libre Baskerville", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"]
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
