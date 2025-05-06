import type { Config } from 'tailwindcss';

const lightColors = {
  white: {
    50: '#fefefe',
    100: '#fcfcfc',
    200: '#fafafa',
    300: '#f8f8f8',
    400: '#f6f6f6',
    500: '#f4f4f4',
    600: '#dedede',
    700: '#dadada',
    800: '#b8b8b8',
    900: '#868686',
  },
  black: {
    50: '#e6e7e7',
    100: '#b1b3b6',
    200: '#8b8e92',
    300: '#555861',
    400: '#353b42',
    500: '#020a13',
  },
};

const darkColors = {
  white: {
    50: '#fefefe',
    100: '#fcfcfc',
    200: '#fafafa',
    300: '#f8f8f8',
    400: '#f6f6f6',
    500: '#f4f4f4',
    600: '#dedede',
    700: '#dadada',
    800: '#b8b8b8',
    900: '#868686',
  },
  black: {
    50: '#e6e7e7',
    100: '#b1b3b6',
    200: '#8b8e92',
    300: '#555861',
    400: '#353b42',
    500: '#020a13',
  },
};

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: lightColors,
        dark: darkColors,
      },
      backgroundImage: {
        dots: 'radial-gradient(rgb(0 0 0 / 6%) 1px, transparent 2px)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
