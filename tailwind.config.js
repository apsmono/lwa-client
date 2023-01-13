/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#FEFAEC",
          100: "#FDF4D8",
          200: "#FBEBB6",
          300: "#FAE18F",
          400: "#F8D668",
          500: "#F6CC44",
          600: "#EEB90B",
          700: "#B48C09",
          800: "#7A5F06",
          900: "#3A2D03",
        },
        secondary: {
          50: "#FBFAFF",
          100: "#F4F0FF",
          200: "#E9E0FF",
          300: "#DED1FF",
          400: "#D3C2FF",
          500: "#C8B3FF",
          600: "#8A5CFF",
          700: "#4C05FF",
          800: "#3100AD",
          900: "#190057",
        },
      },
    },
  },
  plugins: [],
};
