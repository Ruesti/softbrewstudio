// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        softbrew: {
          blue: "#0EA5E9",
          black: "#111827",
          white: "#FFFFFF",
          gray:  "#F3F4F6",
          mid:   "#9CA3AF",
        },
        product: {
          focuspilot: "#7C3AED",
          shiftrix:   "#F97316",
          linguai:    "#10B981",
        }
      },
      borderRadius: {
        brand: "1rem"
      }
    },
  },
  plugins: [],
};
export default config;

