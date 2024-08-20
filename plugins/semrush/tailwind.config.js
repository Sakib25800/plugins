import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--framer-color-bg)",
        secondary: "var(--framer-color-bg-secondary)",
        tertiary: "var(--framer-color-bg-tertiary)",
        divider: "var(--framer-color-divider)",
        tint: "var(--framer-color-tint)",
        tintDimmed: "var(--framer-color-tint-dimmed)",
        tintDark: "var(--framer-color-tint-dark)",
        blackDimmed: "rgba(0, 0, 0, 0.5)",
      },
      colors: {
        primary: "var(--framer-color-text)",
        secondary: "var(--framer-color-text-secondary)",
        tertiary: "var(--framer-color-text-tertiary)",
        inverted: "var(--framer-color-text-inverted)",
        "framer-red": "#FF3366",
        "framer-yellow": "#FFC25A",
        "framer-blue": "#0099FF",
        "framer-green": "#00c25a",
      },
      borderColor: {
        divider: "var(--framer-color-divider)",
      },
      fontSize: {
        "2xs": "10px",
      },
      spacing: {
        30: "30px",
        15: "15px",
      },
      fontFamily: {
        sans: ["Arial", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    }),
  ],
};
