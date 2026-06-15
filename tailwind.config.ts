import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf6ed",
        foreground: "#1a1a1a",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1a1a1a",
        },
        primary: {
          DEFAULT: "#01589f",
          foreground: "#ffffff",
          50: "#e6f2fb",
          100: "#cce5f7",
          200: "#99cbef",
          300: "#66b1e7",
          400: "#3397df",
          500: "#01589f",
          600: "#014a87",
          700: "#013c6f",
          800: "#002e57",
          900: "#00203f",
        },
        secondary: {
          DEFAULT: "#ffefbc",
          foreground: "#1a1a1a",
        },
        warm: "#ffefbc",
        muted: {
          DEFAULT: "#f5f0e6",
          foreground: "#555555",
        },
        accent: {
          DEFAULT: "#01589f",
          foreground: "#ffffff",
          teal: "#14b8a6",
          rose: "#f43f5e",
          amber: "#f59e0b",
        },
        destructive: {
          DEFAULT: "#f43f5e",
          foreground: "#ffffff",
        },
        border: "rgba(0,0,0,0.08)",
        input: "rgba(0,0,0,0.08)",
        ring: "#01589f",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(244,63,94,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(244,63,94,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 2s infinite",
        float: "float 4s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
