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
        'analog-gold': '#C5A059', // Sophisticated Bronze
        'gunmetal-grey': '#0A0A0A', // Deep Obsidian
        'bronze': '#C5A059',
        'obsidian': '#0A0A0A',
        'vintage-paper': '#F5E6D3',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Lora', 'serif'], // Elegant serif for titles
      },
    },
  },
  plugins: [],
};
export default config;
