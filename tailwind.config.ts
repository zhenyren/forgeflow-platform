import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 中性灰阶克制风格
        surface: "#0a0a0b",
        "surface-elevated": "#121214",
        "surface-hover": "#1a1a1d",
        border: "rgba(255,255,255,0.08)",
        "border-strong": "rgba(255,255,255,0.14)",
        text: "#ededee",
        "text-muted": "#8a8a92",
        accent: "#6366f1",
        "accent-hover": "#818cf8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
