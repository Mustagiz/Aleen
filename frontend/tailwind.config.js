/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#8B0000',
        gold: '#D4AF37',
        cream: '#FFFDD0',
      },
    },
  },
  plugins: [],
}
