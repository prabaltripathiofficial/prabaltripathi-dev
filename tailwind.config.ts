import type { Config } from "tailwindcss";

// Mirrors mitchellh.com: green accent, Inter UI, PT Serif prose,
// Archivo Expanded (≈ Nimbus Sans Bold Extended) for the name heading.
const config: Config = {
  darkMode: "media", // follow system preference, like the reference site
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        secondary: {
          400: "#4ade80",
          500: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-pt-serif)", "ui-serif", "Georgia", "serif"],
        nimbus: ["var(--font-nimbus)", "var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
