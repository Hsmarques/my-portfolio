const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: '#111111',
        accent: {
          300: '#E5D5B9', // light sand
          400: '#C9B085', // gold
          500: '#AA9062', // antique gold
          600: '#8C734B'  // bronze
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
