import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          black: "#000000",
          deep: "#0a0a0a",
          warm: "#1a1410"
        },
        text: {
          primary: "#f5f1e8",
          secondary: "#a8a094"
        },
        accent: {
          amber: "#c89968",
          "amber-soft": "#8a7050"
        }
      },
      fontFamily: {
        serif: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        widest: "0.3em",
        wider2: "0.2em"
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
