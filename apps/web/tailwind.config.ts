import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        plum: "#4B2E5A",
        cream: "#FAF6F1",
        midnight: "#1D1522",
        teal: "#2E8B8B",
        coral: "#E2725B",
        sage: "#5F8D6B",
        amber: "#D99A2B",
        emergency: "#B3261E",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        card: "0 16px 48px rgba(49, 35, 54, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
