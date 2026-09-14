import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#020C1B",
          800: "#0A1931",
          700: "#0F2340",
          600: "#112240",
          500: "#1A365D",
        },
        gold: {
          400: "#F1C453",
          500: "#D4AF37",
          600: "#C5A880",
          700: "#B8960C",
        },
        breaking: "#C41E3A",
      },
      fontFamily: {
        tajawal: ["Tajawal", "Cairo", "sans-serif"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        pulseGold: "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        pulseGold: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
