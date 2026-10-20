import { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Badge, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';
import { PageLoading } from '@/components/common/PageState';
import { useAuth } from '@/providers/AuthProvider';
import { getOrders } from '@/services/order.service';
import { BOTTOM_TABS, isNavActive, NavItem, SIDEBAR_ITEMS } from './navigation';
import SidebarFooter from './SidebarFooter';

interface IProps {
  title: ReactNode;
  pageTitle?: string;
  backHref?: string;
  extra?: ReactNode;
  ownerOnly?: boolean;
  /** Hide the mobile bottom tab bar (detail screens with their own sticky actions) */
  hideTabBar?: boolean;
  children: ReactNode;
}

const usePendingCount = (restaurantId: number | null) => {
  const { data } = useQuery(
    ['orders', restaurantId, 'pending-count'],
    () => getOrders(restaurantId as number, { status: 'PENDING', limit: 1 }),
    { enabled: Boolean(restaurantId), refetchInterval: 60 * 1000 },
  );
  return data?.meta.total ?? 0;
};

function NavBadge({
  item,
  pendingCount,
  children,
}: {
  item: NavItem;
  pendingCount: number;
  children: ReactNode;
}) {
  if (item.badge !== 'pending') return <>{children}</>;
  return (
    <Badge count={pendingCount} size="small" offset={[4, 0]}>
      {children}
    </Badge>
  );
}

export default function AppLayout({
  title,
  pageTitle,
  backHref,
  extra,
  ownerOnly,
  hideTabBar,
  children,
}: IProps) {
  const router = useRouter();
  const { ready, token, isLoadingMe, me, restaurantId, restaurant, isOwner } = useAuth();
  const pendingCount = usePendingCount(restaurantId);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (me && !restaurantId) router.replace(`/restaurants?redirect=${encodeURIComponent(router.asPath)}`);
  }, [ready, token, me, restaurantId]);

  if (!ready || !token || isLoadingMe || !restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoading />
      </div>
    );
  }

  const sidebarItems = SIDEBAR_ITEMS.filter((item) => !item.ownerOnly || isOwner);
  const documentTitle = pageTitle ?? (typeof title === 'string' ? title : 'QOrder');

  return (
    <div className="min-h-screen lg:flex">
      <Head>
        <title>{`${documentTitle} · QOrder`}</title>
      </Head>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-sidebar text-gray-300 h-screen sticky top-0">
        <Link href="/tables" className="flex items-center gap-3 px-5 h-16 text-white">
          <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-lg">🍽️</span>
          <span className="text-lg font-bold">QOrder</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1 px-3 py-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const active = isNavActive(item, router.pathname);
            return (
              <Link
                key={item.key}
                href={item.path}
                className={cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
                )}
              >
                <span className="text-base flex">{item.icon}</span>
                <NavBadge item={item} pendingCount={pendingCount}>
                  <span className={cx('text-inherit', { 'font-medium': active })}>{item.label}</span>
                </NavBadge>
              </Link>
            );
          })}
        </nav>
        <SidebarFooter />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header (mobile + desktop) */}
        <header className="sticky top-0 z-30 bg-white border-0 border-b border-solid border-gray-100">
          <div className="flex items-center gap-2 h-14 lg:h-16 px-2 lg:px-6">
            {backHref ? (
              <button
                type="button"
                aria-label="Quay lại"
                className="w-10 h-10 flex items-center justify-center bg-transparent border-0 cursor-pointer text-lg"
                onClick={() => router.push(backHref)}
              >
                <ArrowLeftOutlined />
              </button>
            ) : (
              <span className="w-2 lg:w-0" />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-xl font-semibold truncate">{title}</h1>
              <div className="text-xs text-gray-500 truncate lg:hidden">{restaurant?.name}</div>
            </div>
            {extra && <div className="flex items-center gap-2 pr-2 lg:pr-0">{extra}</div>}
          </div>
        </header>

        <main className={cx('flex-1 p-3 sm:p-4 lg:p-6', { 'pb-24 lg:pb-6': !hideTabBar })}>
          {ownerOnly && !isOwner ? (
            <Result status="403" title="Không có quyền" subTitle="Chức năng này chỉ dành cho chủ quán." />
          ) : (
            children
          )}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      {!hideTabBar && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-0 border-t border-solid border-gray-200 pb-safe">
          <div className="grid grid-cols-4 h-16">
            {BOTTOM_TABS.map((item) => {
              const active = isNavActive(item, router.pathname);
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  className={cx(
                    'flex flex-col items-center justify-center gap-1 text-xs',
                    active ? 'text-primary font-medium' : 'text-gray-500',
                  )}
                >
                  <NavBadge item={item} pendingCount={pendingCount}>
                    <span className={cx('text-xl flex', active ? 'text-primary' : 'text-gray-500')}>
                      {item.icon}
                    </span>
                  </NavBadge>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
