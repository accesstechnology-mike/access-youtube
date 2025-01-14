/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-start": "#ee58f4",
        "primary-end": "#d00059",
        dark: "#2e1433",
        light: "#f7f5f8",
      },
    },
  },
  plugins: [],
};
