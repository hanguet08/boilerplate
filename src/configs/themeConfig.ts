import { ThemeConfig } from '@/UI';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#00904a',
    fontSize: 14,
    borderRadius: 4,
    colorBorder: '#E8E8E8',
    controlHeightLG: 44,
    controlHeight: 40,
    controlHeightSM: 32,
    // boxShadow: '#00904a33',
  },
  components: {
    Modal: {
      paddingContentHorizontalLG: 0,
      paddingMD: 0,
      colorTextHeading: '#fff',
    },
  },
};
