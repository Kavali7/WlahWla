import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '1rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1240px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e7efff',
          200: '#cfddff',
          300: '#a7c0ff',
          400: '#7799ff',
          500: '#3d6bff',
          600: '#2d53db',
          700: '#2443af',
          800: '#203a8d',
          900: '#1d326f',
        },
        accent: '#fb923c',
        surface: '#ffffff',
        'surface-muted': '#f1f5f9',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 32px -14px rgba(15, 23, 42, 0.4)',
        ring: '0 0 0 4px rgba(61, 107, 255, 0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: {
        content: '72rem',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config
