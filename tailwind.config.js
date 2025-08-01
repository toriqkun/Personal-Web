// tailwind.config.js
module.exports = {
  content: ["./views/**/*.{hbs,html}", "./assets/js/**/*.{js}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
