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
        palo: ["Palo"],
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
          50: "#F8F5FE",
          100: "#EEE7FE",
          200: "#E1D3FD",
          300: "#D1BBFB",
          400: "#C3A8FA",
          500: "#B390F9",
          600: "#8147F5",
          700: "#520CDF",
          800: "#370896",
          900: "#1B0449",
        },
      },
    },
  },
  plugins: [],
};
