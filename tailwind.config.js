/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      keyframes: {
        riseAndFade: {
          '0%': { opacity: 1.0},
          '100%': { opacity: 0.0, transform:'translateY(-20px)'}
        }
      },
      animation: {
        copyConfirm: 'riseAndFade 0.5s ease-out 1'
      }
    },
    screens: {
      'sm': '640px',
      'md': '920px',
      'lg': '1200px',
    },
  },
  plugins: [],
}

