/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
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
          kanaquest: "#FACC15" // warmes Gelb

        },
      },
      borderRadius: { brand: "1rem" },
    },
  },
  plugins: [],
};

