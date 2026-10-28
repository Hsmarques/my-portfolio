/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkroom: {
          DEFAULT: "#181818",
          muted: "#9B9B9B",
          raised: "#1F1F1F",
        },
        // Keep legacy tokens so unlinked experiment pages still compile.
        surface: "#181818",
        vinho: {
          DEFAULT: "#181818",
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#9B9B9B",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#313131",
          800: "#1F1F1F",
          900: "#181818",
        },
        superbock: {
          DEFAULT: "#9B9B9B",
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#9B9B9B",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#313131",
          900: "#1F1F1F",
        },
        bacalhau: {
          DEFAULT: "#ffffff",
          50: "#ffffff",
          100: "#ffffff",
          200: "#f5f5f5",
          300: "#9B9B9B",
          400: "#d4d4d4",
          500: "#a3a3a3",
        },
        accent: {
          300: "#ffffff",
          400: "#9B9B9B",
          500: "#737373",
          600: "#181818",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        serif: [
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        darkroom: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        800: "800ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
