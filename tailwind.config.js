const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        palo: ["Palo"],
      },
      colors: {
        primary: {
          50: "#F3E9FE",
          100: "#F3E9FE",
          200: "#E6D3FE",
          300: "#D6BDFD",
          400: "#C9ABFB",
          500: "#B390F9",
          600: "#8969D6",
          700: "#6448B3",
          800: "#442D90",
          900: "#2D1B77",
        },
        secondary: {
          50: "#FEF9D9",
          100: "#FEF9D9",
          200: "#FEF2B4",
          300: "#FCE78E",
          400: "#F9DC72",
          500: "#F5CC44",
          600: "#D2A931",
          700: "#B08822",
          800: "#8E6915",
          900: "#75530D",
        },
        neutral: {
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#E6E6E6",
          300: "#B3B3B3",
          400: "#999999",
          500: "#666666",
          600: "#4D4D4D",
          700: "#333333",
          800: "#1A1A1A",
          900: "#000000",
        },
        success: {
          50: "#CDFCD6",
          100: "#CDFCD6",
          200: "#9DF9B7",
          300: "#69ED9C",
          400: "#43DC8D",
          500: "#0FC67A",
          600: "#0AAA77",
          700: "#078E71",
          800: "#047266",
          900: "#025F5D",
        },
        info: {
          50: "#CDE9FC",
          100: "#CDE9FC",
          200: "#9CCFFA",
          300: "#69AEF2",
          400: "#438DE6",
          500: "#0C60D6",
          600: "#084AB8",
          700: "#06379A",
          800: "#03267C",
          900: "#021B66",
        },
        warning: {
          50: "#FEF7CD",
          100: "#FEF7CD",
          200: "#FEEC9B",
          300: "#FEDE69",
          400: "#FDD144",
          500: "#FCBB07",
          600: "#D89A05",
          700: "#B57C03",
          800: "#926002",
          900: "#784C01",
        },
        danger: {
          50: "#FDE5D1",
          100: "#FDE5D1",
          200: "#FCC4A4",
          300: "#F69A75",
          400: "#ED7352",
          500: "#E2371D",
          600: "#C21E15",
          700: "#A20E12",
          800: "#830916",
          900: "#6C0518",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".with-shadow": {
          "box-shadow": "3px 3px 0 #000",
        },
      });
    }),
  ],
};
