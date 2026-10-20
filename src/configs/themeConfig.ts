import { ThemeConfig } from '@/UI';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2563eb',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    fontSize: 14,
    borderRadius: 8,
    colorBorder: '#E5E7EB',
    controlHeightLG: 46,
    controlHeight: 40,
    controlHeightSM: 32,
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      fontWeight: 500,
    },
  },
};
