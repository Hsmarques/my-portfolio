const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          300: '#D8BA8A', // light camel
          400: '#C19A6B', // camel
          500: '#A87F50', // deeper camel
          600: '#8F6A42'  // dark camel
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Cantarell", "Noto Sans", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Libre Baskerville", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"]
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
