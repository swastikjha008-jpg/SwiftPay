/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#07070C",
          surface: "#101018",
          raised: "#181822",
          line: "#242432",
        },
        flow: {
          DEFAULT: "#7C5CFC",
          soft: "#C084FC",
        },
        gold: "#FFC145",
        azure: "#4FA8FF",
        mint: "#33F2A0",
        muted: "#9C96B5",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
