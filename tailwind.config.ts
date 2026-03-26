import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7B2D0A",
        primaryHover: "#A13A12",
        gold: "#D4AF37",
        cream: "#F3E1B6",
        beige: "#F8F3EF",
        dark: "#2A1A12",
      },
      fontFamily: {
        heading: ["var(--font-playfair)"],
        body: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};

export default config;