import _ from 'lodash';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{html,css,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#005587',
        'primary_light': '#428bca',
        'secondary': '#e97730',
        'accent': '#FFC72C',
      },
      boxShadow: {
        'box': '0px 0px 15px rgba(0, 0, 0, 0.25)',
        'box-sm': '0px 0px 5px rgba(0, 0, 0, 0.25)',
      }
    },
    fontFamily: {
      sans: ['Work Sans', 'Inter var', 'sans-serif'],
    }
  },
  safelist: _.range(100).map((i) => `w-[${i}%]`), // all percent width classes for progress bar
  plugins: [
  ],
}