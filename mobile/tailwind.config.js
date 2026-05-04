/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Base
        background: '#F7F9FF',
        'on-background': '#2A333C',

        surface: '#F7F9FF',
        'surface-bright': '#F7F9FF',
        'surface-dim': '#D0DBE8',
        'surface-tint': '#1E6397',
        'surface-variant': '#D9E4EF',

        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#EEF4FC',
        'surface-container': '#E7EFF8',
        'surface-container-high': '#E0E9F4',
        'surface-container-highest': '#D9E4EF',

        'on-surface': '#2A333C',
        'on-surface-variant': '#56606A',

        // Primary
        primary: '#1E6397',
        'primary-dim': '#04578A',
        'primary-container': '#8CC6FF',
        'primary-fixed': '#8CC6FF',
        'primary-fixed-dim': '#7EB8F1',

        'on-primary': '#F7F9FF',
        'on-primary-container': '#003F67',
        'on-primary-fixed': '#002A46',
        'on-primary-fixed-variant': '#004975',
        'inverse-primary': '#89C3FD',

        // Secondary
        secondary: '#84439F',
        'secondary-dim': '#773792',
        'secondary-container': '#F8D8FF',
        'secondary-fixed': '#F8D8FF',
        'secondary-fixed-dim': '#F2C5FF',

        'on-secondary': '#FFF7FC',
        'on-secondary-container': '#753590',
        'on-secondary-fixed': '#60207C',
        'on-secondary-fixed-variant': '#803F9B',

        // Tertiary
        tertiary: '#006E37',
        'tertiary-dim': '#00602F',
        'tertiary-container': '#6BFE9C',
        'tertiary-fixed': '#6BFE9C',
        'tertiary-fixed-dim': '#5BEF90',

        'on-tertiary': '#E8FFE8',
        'on-tertiary-container': '#005F2F',
        'on-tertiary-fixed': '#004A23',
        'on-tertiary-fixed-variant': '#006A35',

        // Error
        error: '#AC3434',
        'error-dim': '#70030F',
        'error-container': '#F56965',
        'on-error': '#FFF7F6',
        'on-error-container': '#65000B',

        // Outline
        outline: '#727C86',
        'outline-variant': '#A9B3BE',

        // Inverse
        'inverse-surface': '#0A0F13',
        'inverse-on-surface': '#999DA4',
      },

      fontFamily: {
        display: ['System'],
        headline: ['System'],
        body: ['System'],
        label: ['System'],
      },

      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        premium: '0 12px 40px rgba(42, 51, 60, 0.06)',
        card: '0 20px 50px rgba(30, 99, 151, 0.15)',
      },
    },
  },
  plugins: [],
}