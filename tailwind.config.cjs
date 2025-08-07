const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: colors.emerald
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Cantarell", "Noto Sans", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif"]
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
