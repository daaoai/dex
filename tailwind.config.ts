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
    10: '#000000',
    50: '#0F0F0F',
    100: '#1A1A1A',
    200: '#1F1F1F',
    300: '#1C1C1C',
    400: '#ACACAC',
    500: '#64758B',
  },
  pink: {
    10: '#E232B1',
    50: '#32192B',
    100: '#261722',
  },
  purple: {
    10: '#A457FF',
    50: '#730CEF',
    100: '#5108A7',
    200: '#241B31',
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
    10: '#000000',
    50: '#0F0F0F',
    100: '#1A1A1A',
    200: '#1F1F1F',
    300: '#1C1C1C',
    400: '#ACACAC',
    500: '#64758B',
  },
  pink: {
    10: '#E232B1',
    50: '#32192B',
    100: '#261722',
  },
  purple: {
    10: '#A457FF',
    50: '#730CEF',
    100: '#5108A7',
    200: '#241B31',
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
