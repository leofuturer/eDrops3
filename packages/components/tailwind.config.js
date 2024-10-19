/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#005587',
          light: '#428bca',
        },
        'secondary': '#e97730',
        'accent': '#FFC72C',
      }
    },
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', 'Work Sans', 'Inter var', 'sans-serif'],
    }
  },
  plugins: [],
}

