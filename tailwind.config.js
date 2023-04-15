/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '920px',
      'lg': '1200px',
    }
  },
  plugins: [],
}

