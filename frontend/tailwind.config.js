/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#07110B",
        field: "#16A34A",
        lime: "#D9FF00",
        card: "#111827",
        muted: "#94A3B8",
      },
    },
  },
  plugins: [],
};
