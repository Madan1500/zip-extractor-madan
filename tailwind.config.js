/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pine-green': "#157A6E",
        'shamrock-green': "#499F68",
        'cambridge-blue': "#77B28C",
        'ash-gray': "#C2C5BB",
        'brown-sugar': "#B4654A",
      },
    },
  },
  plugins: [],
}

