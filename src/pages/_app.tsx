import 'antd/dist/reset.css';
import '@/assets/styles/app.scss';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ConfigProvider } from '@/UI';
import { App as AntApp } from 'antd';
import { theme } from '@/configs/themeConfig';
import AuthProvider from '@/providers/AuthProvider';
import RealtimeProvider from '@/providers/RealtimeProvider';
import { registerServiceWorker } from '@/ultils/push';

dayjs.locale('vi');

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: true, retry: 1, staleTime: 10 * 1000 },
        },
      }),
  );

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <title>QOrder</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme} locale={viVN}>
          <AntApp>
            <ErrorBoundary>
              <AuthProvider>
                <RealtimeProvider>
                  <Component {...pageProps} />
                </RealtimeProvider>
              </AuthProvider>
            </ErrorBoundary>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
