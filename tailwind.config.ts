import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        surface: "#101010",
        elevated: "#161616",
        bone: {
          DEFAULT: "#ECEAE4",
          dim: "#9B9994",
          faint: "#5C5B57",
        },
        ash: "#6F6F6D",
        line: "#1B1B1B",
        // Subtle "accent" used sparingly — a brighter off-white, never colored
        accent: "#F5F2EC",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "DM Mono", "ui-monospace", "monospace"],
        block: ["var(--font-block)", "Bebas Neue", "Impact", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(5rem, 14vw, 14rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(3.5rem, 9vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        widest: "0.3em",
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.16, 1, 0.3, 1)",
        cinematic: "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      animation: {
        "scroll-down": "scrollDown 2.4s cubic-bezier(0.77, 0, 0.175, 1) infinite",
      },
      keyframes: {
        scrollDown: {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
