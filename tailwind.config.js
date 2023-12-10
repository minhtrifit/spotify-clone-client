/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-green": "#1ed760",
        "sub-green": "#19fa6a",
        "light-bg": "#fffffe",
      },
    },
  },
  plugins: [],
};
