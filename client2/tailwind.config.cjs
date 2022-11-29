/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{html,css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#005587',
        'secondary': '#FFFFFF',
        'accent': '#FFC72C',
      }
    },
    fontFamily: {
      sans: ['Work Sans', 'Inter var', 'sans-serif'],
    }
  },
  plugins: [],
}
