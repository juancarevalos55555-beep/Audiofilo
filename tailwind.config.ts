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
        'netflix-black': '#141414',
        'netflix-dark': '#1F1F1F',
        'netflix-hover': '#2F2F2F',
        'netflix-red': '#E50914',
        'premium-gold': '#FFD700',
        'netflix-text': '#FFFFFF',
        'netflix-muted': '#B3B3B3',
        'netflix-border': '#404040',
        // Keeping old ones for compatibility during transition if needed, but primary focus is Netflix theme
        'analog-gold': '#FFD700', // Mapping to premium gold
        'gunmetal-grey': '#141414', // Mapping to netflix black
        'bronze': '#FFD700',
        'obsidian': '#141414',
        'vintage-paper': '#F5E6D3',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
