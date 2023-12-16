/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/*.html"],
  theme: {
    extend: {
      colors: {
        "dark-600": "#121212",
        "dark-500": "#282828",
        "dark-400": "#3F3F3F",
        "dark-300": "#575757",
        "dark-200": "#717171",
        "dark-100": "#8B8B8B",
      }
    },
  },
  plugins: [],
};
