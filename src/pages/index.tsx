import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageLoading } from '@/components/common/PageState';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { ready, token } = useAuth();

  useEffect(() => {
    if (ready) router.replace(token ? '/tables' : '/login');
  }, [ready, token]);

  return <PageLoading className="min-h-screen" />;
}
