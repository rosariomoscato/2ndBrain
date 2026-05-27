import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        tech: ["JetBrains Mono", "monospace"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          purple: "var(--color-neon-purple)",
          cyan: "var(--color-neon-cyan)",
          blue: "var(--color-neon-blue)",
          pink: "var(--color-neon-pink)",
          green: "var(--color-neon-green)",
        },
        space: {
          black: "var(--color-space-black)",
          starfield: "var(--color-starfield)",
          nebulaDark: "var(--color-nebula-dark)",
          nebulaPurple: "var(--color-nebula-purple)",
        },
        glass: {
          surface: "var(--color-glass-surface)",
          border: "var(--color-glass-border)",
          highlight: "var(--color-glass-highlight)",
        },
      },
    },
  },
  plugins: [],
};

export default config;