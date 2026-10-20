import { useState } from 'react';
import { useRouter } from 'next/router';
import { DatePicker, Input, Pagination, Segmented } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import AppLayout from '@/layout/app';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { CLOSED_STATUSES } from '@/constants/order';
import { OrderStatus } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { getOrders, OrderQuery } from '@/services/order.service';
import lodash from '@/ultils/lodash';
import OrderCard from './components/OrderCard';
import OrderDrawer from './components/OrderDrawer';

type TabKey = 'new' | 'serving' | 'history';

const TABS: Record<TabKey, { label: string; status: OrderStatus[] }> = {
  new: { label: 'Đơn mới', status: ['PENDING'] },
  serving: { label: 'Đang phục vụ', status: ['CONFIRMED'] },
  history: { label: 'Lịch sử', status: CLOSED_STATUSES },
};

const PAGE_SIZE = 20;

const useOrderCount = (rid: number | null, status: OrderStatus[]) => {
  const { data } = useQuery(
    ['orders', rid, 'count', status.join(',')],
    () => getOrders(rid as number, { status, limit: 1 }),
    { enabled: Boolean(rid) },
  );
  return data?.meta.total;
};

export default function OrderList() {
  const router = useRouter();
  const { restaurantId } = useAuth();
  const tab = (router.query.tab as TabKey) in TABS ? (router.query.tab as TabKey) : 'new';
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [day, setDay] = useState<Dayjs | null>(dayjs());
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  const newCount = useOrderCount(restaurantId, TABS.new.status);
  const servingCount = useOrderCount(restaurantId, TABS.serving.status);

  const query: OrderQuery = {
    status: TABS[tab].status,
    page,
    limit: PAGE_SIZE,
    q: search || undefined,
    ...(tab === 'history' && day
      ? { from: day.startOf('day').toISOString(), to: day.add(1, 'day').startOf('day').toISOString() }
      : {}),
  };

  const { data, isLoading, error, refetch } = useQuery(
    ['orders', restaurantId, 'list', query],
    () => getOrders(restaurantId as number, query),
    { enabled: Boolean(restaurantId), keepPreviousData: true },
  );

  const [debouncedSearch] = useState(() =>
    lodash.debounce((value: string) => {
      setSearch(value.trim());
      setPage(1);
    }, 400),
  );

  const changeTab = (value: TabKey) => {
    setPage(1);
    router.replace({ query: { ...router.query, tab: value } }, undefined, { shallow: true });
  };

  const withCount = (label: string, count?: number) => (count ? `${label} (${count})` : label);

  return (
    <AppLayout title="Danh sách order">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Segmented
            value={tab}
            onChange={(value) => changeTab(value as TabKey)}
            options={[
              { value: 'new', label: withCount(TABS.new.label, newCount) },
              { value: 'serving', label: withCount(TABS.serving.label, servingCount) },
              { value: 'history', label: TABS.history.label },
            ]}
            className="self-start max-w-full overflow-x-auto"
          />
          <div className="flex gap-2 md:ml-auto">
            {tab === 'history' && (
              <DatePicker
                value={day}
                onChange={(value) => {
                  setDay(value);
                  setPage(1);
                }}
                format="DD/MM/YYYY"
                placeholder="Tất cả ngày"
                className="w-40"
              />
            )}
            <Input
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm mã order"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="md:w-56"
            />
          </div>
        </div>

        {isLoading && <PageLoading />}
        {error && <PageError error={error} onRetry={refetch} />}
        {data && data.data.length === 0 && (
          <EmptyState description={tab === 'new' ? 'Chưa có đơn mới' : 'Không có order nào'} />
        )}
        {data && data.data.length > 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {data.data.map((order) => (
                <OrderCard key={order.id} order={order} onOpen={(o) => setOpenOrderId(o.id)} />
              ))}
            </div>
            {data.meta.totalPages > 1 && (
              <Pagination
                className="self-center mt-2"
                current={page}
                pageSize={PAGE_SIZE}
                total={data.meta.total}
                onChange={setPage}
                showSizeChanger={false}
                size="small"
              />
            )}
          </>
        )}
      </div>
      <OrderDrawer orderId={openOrderId} onClose={() => setOpenOrderId(null)} />
    </AppLayout>
  );
}
