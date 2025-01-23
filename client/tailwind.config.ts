import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    screen: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      primary: "var(--font-Rubik)",
    },
    extend: {
      colors: {
        secondary: "#1c1c22",
        primary: "#000d1a",
        accent: {
          DEFAULT: "#00ff99",
          hover: "#00e187",
        },
      },
      boxShadow: {
        custom: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        custom_hover: "0px 2px 6px rgba(0, 0, 0, 0.32)",
      },
      backgroundColor: {
        shadow: "rgba(0, 0, 0, 0.6)",
      },
      hide: {},
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), heroui()],
} satisfies Config;

export default config;
