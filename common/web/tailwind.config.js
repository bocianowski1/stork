/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--color-dark)",
        white: "var(--color-white)",
        offwhite: "var(--color-offwhite)",
        gray: "var(--color-gray)",
        darkgray: "var(--color-darkgray)",
        primary: "var(--color-primary)",
        selected: "var(--color-selected)",
      },
    },
  },
  plugins: [],
};
