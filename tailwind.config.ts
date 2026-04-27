import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        "popover": "0 24px 70px rgba(0, 0, 0, 0.55)"
      },
      screens: {
        "xs": "420px"
      }
    }
  },
  plugins: []
};

export default config;
