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
        'background-7': 'var(--color-background-7)',
        'background-8': 'var(--color-background-8)',
        'background-9': 'var(--color-background-9)',
        'background-10': 'var(--color-background-10)',
        'background-11': 'var(--color-background-11)',
        'background-12': 'var(--color-background-12)',
        'background-13': 'var(--color-background-13)',
        'background-14': 'var(--color-background-14)',
        'background-15': 'var(--color-background-15)',
        'background-16': 'var(--color-background-16)',
        'background-17': 'var(--color-background-17)',
        'background-19': 'var(--color-background-19)',
        'background-20': 'var(--color-background-20)',
        'background-21': 'var(--color-background-21)',

        'background-23': 'var(--color-background-23)',
        'background-24': 'var(--color-background-24)',

        grey: 'var(--color-grey)',
        'grey-2': 'var(--color-grey-2)',
        'grey-3': 'var(--color-grey-3)',
        'grey-4': 'var(--color-grey-4)',
        'grey-5': 'var(--color-grey-5)',

        stroke: 'var(--color-stroke)',
        'stroke-2': 'var(--color-stroke-2)',
        'stroke-3': 'var(--color-stroke-3)',
        'stroke-4': 'var(--color-stroke-4)',
        'stroke-5': 'var(--color-stroke-5)',
        'stroke-6': 'var(--color-stroke-6)',
        'stroke-7': 'var(--color-stroke-7)',
        'stroke-8': 'var(--color-stroke-8)',
        'stroke-9': 'var(--color-stroke-9)',

        primary: 'var(--color-primary)',
        'primary-1': 'var(--color-primary-2)',
        'primary-2': 'var(--color-primary-2)',
        'primary-3': 'var(--color-primary-3)',
        'primary-4': 'var(--color-primary-4)',
        'primary-5': 'var(--color-primary-5)',
        'primary-6': 'var(--color-primary-6)',
        'primary-7': 'var(--color-primary-7)',
        'primary-8': 'var(--color-primary-8)',
        'primary-9': 'var(--color-primary-9)',

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
        'gradient-purple': 'linear-gradient(90deg, #DBDFFF, #9F8CFF)',
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
