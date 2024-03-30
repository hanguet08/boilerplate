module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blurBtn: '#18A0FB',
        outdate: '#D9724C',
        error: '#EB5757',
        link: '#80BFD1',
        primary: '#00904A',
        'primary-dark': '#006534',
        'primary-light': '#33A66E',
        'primary-lighter': '#B3DEC9',
        'primary-lightest': '#E5F4ED',
        'text-regular': '#262626',
        'black-1': '#2D2D2D',
        'grey-500': '#5C5C5C',
        'grey-400': '#7A7A7A',
        'grey-300': '#9A9A9A',
        'grey-250': '#BDBDBD',
        'grey-200': '#D6D6D6',
        'grey-100': '#E8E8E8',
        'grey-75': '#F8F8F8',
        'grey-50': '#F3F3F3',
        'active-nav': '#D1F8F3',
      },
    },
  },
  plugins: [],
};
