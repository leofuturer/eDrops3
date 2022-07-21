const lineClamp = require('@tailwindcss/line-clamp');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Work Sans', 'Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [lineClamp],
};
