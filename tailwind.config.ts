import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#FDFBF7',
        'brand-surface': '#F7F4EE',
        'brand-card': '#FFFFFF',
        'brand-border': '#E8E2D9',
        'brand-accent': '#8B5E3C',
        'brand-accent-hover': '#6F4A2E',
        'brand-text': '#1A1A1A',
        'brand-body': '#4A4A4A',
        'brand-muted': '#9A9488',
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-playfair)', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}

export default config
