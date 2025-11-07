/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          DEFAULT: '#2d7471',
          dark: '#245d5a',
          light: '#3a8985',
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
          dark: '#6fccc2',
          light: '#a8e0da',
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
        'dark': {
          DEFAULT: '#1a1a1a',
          medium: '#4a4a4a',
          light: '#737373',
        },
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Source Serif Pro', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'texture-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
