import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mal: {
          purple: '#351A75',
          'purple-light': '#F3EFFD',
          'purple-dark': '#2a1560',
          dark: '#171717',
          gray: '#4B5563',
          'gray-dark': '#4B5563',
          'gray-light': '#F9FAFB',
          border: '#E5E7EB',
          success: '#059669',
          'success-light': '#ECFDF5',
          warning: '#D97706',
          'warning-light': '#FFFBEB',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default config;
