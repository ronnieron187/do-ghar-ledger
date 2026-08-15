import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1620",
        surface: "#16212D",
        surface2: "#1D2B39",
        line: "#2A3947",
        ivory: "#EDEDE4",
        mist: "#9FB0BE",
        nz: { DEFAULT: "#4FB8AF", soft: "#2E4A48" },
        pk: { DEFAULT: "#C9A44C", soft: "#4A3F26" },
        alert: "#E2635A",
        good: "#6FBF8B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { card: "14px" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
      },
      keyframes: {
        flow: {
          "0%": { transform: "translateX(-6%)", opacity: "0.4" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(106%)", opacity: "0.4" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flow: "flow 3.2s linear infinite",
        rise: "rise 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
