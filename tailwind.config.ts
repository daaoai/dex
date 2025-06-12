import type { Config } from 'tailwindcss';

const config: Config = {
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
        background: 'var(--color-background)',
        'background-2': 'var(--color-background-2)',
        'background-3': 'var(--color-background-3)',
        'background-4': 'var(--color-background-4)',
        'background-5': 'var(--color-background-5)',
        'background-6': 'var(--color-background-6)',

        grey: 'var(--color-grey)',
        'grey-2': 'var(--color-grey-2)',
        'grey-3': 'var(--color-grey-3)',
        'grey-4': 'var(--color-grey-4)',
        'grey-5': 'var(--color-grey-5)',

        stroke: 'var(--color-stroke)',
        'stroke-2': 'var(--color-stroke-2)',

        primary: 'var(--color-primary)',
        'primary-2': 'var(--color-primary-2)',
        'primary-3': 'var(--color-primary-3)',
        'primary-4': 'var(--color-primary-4)',
        'primary-5': 'var(--color-primary-5)',

        secondary: 'var(--color-secondary)',
        'secondary-2': 'var(--color-secondary-2)',
        'secondary-3': 'var(--color-secondary-3)',
        black: 'var(--color-black)',
        magenta: 'var(--color-magenta)',
        'magenta-2': 'var(--color-magenta-2)',
        rose: 'var(--color-rose)',
        gradient: 'var(--color-gradient-1)',
        'gradient-2': 'var(--color-gradient-2)',
      },
      backgroundImage: {
        dots: 'radial-gradient(rgb(0 0 0 / 6%) 1px, transparent 2px)',
        'btn-gradient': 'linear-gradient(to right, #492AFF, #F49167)',
        'gradient-purple': 'linear-gradient(90deg, #3F21FC, #916DF5)',
      },
      textColor: {
        'gradient-purple': 'transparent',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
