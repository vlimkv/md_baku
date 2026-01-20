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
        gold: {
          400: '#FACC15',
          500: '#D4AF37',
          600: '#B4941F',
          700: '#856D14',
        },
        dark: {
          800: '#1A1A1A',
          900: '#0F0F0F',
        },
        gray: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
        },
        brandGray: {
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
        }
      },
      fontFamily: {
        sans: ['var(--font-opensans)', 'Arial', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
        },
      },
      boxShadow: {
        'card': '0 2px 5px rgba(0,0,0,0.05)',
        'card-hover': '0 5px 15px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
};
export default config;