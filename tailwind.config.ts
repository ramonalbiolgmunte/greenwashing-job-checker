import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDEAE9",
        "paper-dim": "#E2DEDB",
        ink: "#1C1B19",
        "ink-soft": "#4A4844",
        highlight: "#E3AE1F",
        "highlight-soft": "#F3DFA3",
        sage: "#5C7A5E",
        rust: "#A83B2C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        report: "680px",
      },
    },
  },
  plugins: [],
};
export default config;
