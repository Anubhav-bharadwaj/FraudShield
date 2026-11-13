/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#171715',
        surface: {
          DEFAULT: '#211F1B',
          2: '#2B2822',
          3: '#353128',
        },
        sand: {
          DEFAULT: '#D8C5A3',
          light: '#E9DDC7',
          muted: '#A99A80',
        },
        text: {
          DEFAULT: '#F1EBDD',
          muted: '#AAA395',
        },
        border: {
          DEFAULT: '#403B32',
          subtle: '#2E2A24',
        },
        risk: {
          low: '#78A88A',
          medium: '#D2A45F',
          high: '#D98558',
          critical: '#D46D68',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

