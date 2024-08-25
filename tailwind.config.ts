import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/**/*.{js,ts,jsx,tsx,mdx}',
    './domains/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        '3xl': '1600px',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        text: {
          DEFAULT: 'var(--text)',
          dim: '#83838B',
          link: 'var(--text-link)',
          danger: '#DC2626',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          1: '#0F172A',
          2: '#0F172A',
          3: '#FBFBFC',
          4: '#F4F6F7',
          5: '#EFF1F4',
          6: '#D7E7FF',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          1: '#F6F6F93D',
          2: '#F6F6F93D',
          3: '#009644',
          4: '#F14336',
          5: '#FF3E1D1A',
          6: '#F1F5F9',
          7: '#E2E8F0',
        },
      },
      backgroundColor: {
        background: '#fff',
        'background-lighter': '#f1f5f9',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'pulse-loader': {
          '0%': { opacity: '0' },
          '50%': { transform: 'scale(1.4)', opacity: '0.4' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'pulse-loader': 'pulse-loader 1000ms cubic-bezier(0.9, 0.7, 0.5, 0.9) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
