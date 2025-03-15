/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ff0000', // Red color for the logo
        'background': '#0a1929', // Dark blue background
      },
    },
  },
  plugins: [],
}