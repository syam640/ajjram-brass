import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0B2D1F",
          50: "#E8EDEA",
          100: "#D1DAD5",
          200: "#A3B5AB",
          300: "#759081",
          400: "#476B57",
          500: "#0B2D1F",
          600: "#092418",
          700: "#071B12",
          800: "#05120C",
          900: "#030906",
        },
        secondary: {
          DEFAULT: "#B08D57",
          50: "#F7F2E8",
          100: "#EFE5D1",
          200: "#DFCBA3",
          300: "#CFB175",
          400: "#B08D57",
          500: "#8E7045",
          600: "#6B5434",
          700: "#483823",
          800: "#251C11",
          900: "#120E08",
        },
        accent: {
          DEFAULT: "#C9A86A",
          50: "#FBF6EC",
          100: "#F6EDD9",
          200: "#EDDBA3",
          300: "#E4C97D",
          400: "#C9A86A",
          500: "#A48755",
          600: "#7F6641",
          700: "#5A452D",
          800: "#352519",
          900: "#1A120C",
        },
        background: "#F7F2E8",
        surface: "#FCFAF5",
        text: "#1A1A1A",
        muted: "#6B7280",
        border: "#E5DDD0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
