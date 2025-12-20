import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      colors: {
        linkedin: {
          blue: '#0A66C2',
          dark: '#004182'
        }
      }
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', '.light &');
      addVariant('light-hover', '.light &:hover');
      addVariant('light-focus', '.light &:focus');
      addVariant('light-active', '.light &:active');
      addVariant('light-disabled', '.light &:disabled');
    }),
  ],
};

export default config;