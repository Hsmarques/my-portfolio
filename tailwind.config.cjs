/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** Portuguese palette: Port wine, Super Bock gold, Bacalhau cream */
        port: '#592532',
        bock: '#D49E08',
        cream: '#FFF0D1',
        accent: {
          300: '#FFF0D1',
          400: '#D49E08',
          500: '#B88907',
          600: '#592532'
        }
      },
      backgroundImage: {
        'palette-gradient':
          'linear-gradient(180deg, #592532 0%, #944D0F 28%, #D9A108 52%, #EBD46B 74%, #F6E9BD 100%)'
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
