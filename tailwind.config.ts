import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf7f2",
        blush: "#f3d7df",
        rose: "#b9345e",
        ink: "#1f1720"
      },
      boxShadow: {
        scene: "0 18px 56px rgba(88, 39, 55, 0.22)",
        card: "0 14px 30px rgba(31, 23, 32, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
