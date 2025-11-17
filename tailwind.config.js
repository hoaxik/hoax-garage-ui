/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fivem-black': '#000000',
        'fivem-gray': {
          DEFAULT: '#1a1a1a',
          light: '#262626',
          border: '#3c3c3c',
          text: '#9ca3af'
        }
      }
    },
  },
  plugins: [],
}