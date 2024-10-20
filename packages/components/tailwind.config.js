/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector"], 
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#0075ba",
          DEFAULT: "#005587",
          dark: "#003554",
        },
        secondary: {
          light: "#ee955e",
          DEFAULT: "#e97730",
          dark: "#d05d16",
        },
        accent: "#FFC72C",
      },
    },
    fontFamily: {
      sans: [
        "ui-sans-serif",
        "system-ui",
        "Work Sans",
        "Inter var",
        "sans-serif",
      ],
    },
  },
  plugins: [],
};
