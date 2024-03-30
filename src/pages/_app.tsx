import 'antd/dist/reset.css';
import '@/assets/styles/app.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ConfigProvider } from '@/UI';
import { theme } from '@/configs/themeConfig';
import { AuthClient } from '@/configs/Auth/client';

const queryClient = new QueryClient();

function MyApp({ Component }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <ErrorBoundary>
          <AuthClient>
            <Component />
          </AuthClient>
        </ErrorBoundary>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
