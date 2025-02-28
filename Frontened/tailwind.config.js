/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        ur: ['Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'serif']
      }
    },
  },
  plugins: [],
}