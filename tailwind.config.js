module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        error: '#EF4444',
        primary: '#2563EB',
        'primary-dark': '#1D4ED8',
        'primary-light': '#3B82F6',
        'primary-lighter': '#BFDBFE',
        'primary-lightest': '#EFF6FF',
        'text-regular': '#111827',
        'grey-500': '#5C5C5C',
        'grey-400': '#7A7A7A',
        'grey-300': '#9A9A9A',
        'grey-250': '#BDBDBD',
        'grey-200': '#D6D6D6',
        'grey-100': '#E8E8E8',
        'grey-75': '#F8F8F8',
        'grey-50': '#F3F3F3',
        sidebar: '#111827',
      },
    },
  },
  plugins: [],
};
