/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif'],
      },
      colors: {
        'brand': {
          50: '#e6f2f2',
          100: '#cce5e4',
          200: '#99cbc9',
          300: '#66b1ae',
          400: '#339793',
          500: '#2d7471',
          600: '#245d5a',
          700: '#1b4644',
          800: '#122e2d',
          900: '#091717',
        },
        'accent': {
          DEFAULT: '#8ad6ce',
          50: '#f0faf9',
          100: '#d4f1ed',
          200: '#b9e8e2',
          300: '#9edfd6',
          400: '#8ad6ce',
          500: '#6bc9bf',
          600: '#4eb8ad',
          700: '#3c9a91',
          800: '#2d7571',
          900: '#1e504e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
