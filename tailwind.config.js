/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          800: '#1D232A',
          400: '#2A323C'
        },
        gray: {
          100: '#a6adbb'
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin') // add this line
  ],
}

