import { useState } from 'react';
import Link from 'next/link';
import { Button, Segmented } from 'antd';
import { useQueries, useQuery } from '@tanstack/react-query';
import CustomerLayout from '@/layout/customer';
import { EmptyState, PageLoading } from '@/components/common/PageState';
import { Order } from '@/interfaces';
import { getPublicOpenOrders, getPublicOrder } from '@/services/public.service';
import { publicOrdersKey, useCustomer } from './CustomerProvider';
import CustomerOrderCard from './components/CustomerOrderCard';
import useCustomerSocket from './useCustomerSocket';

type TabKey = 'mine' | 'table';

export default function History() {
  const { qrToken, menu, orderCodes } = useCustomer();
  const [tab, setTab] = useState<TabKey>('mine');
  useCustomerSocket(qrToken);

  const myOrderQueries = useQueries({
    queries: orderCodes.map((code) => ({
      queryKey: [...publicOrdersKey(qrToken), code],
      queryFn: () => getPublicOrder(qrToken, code),
      enabled: Boolean(qrToken) && tab === 'mine',
      retry: false,
    })),
  });
  const myOrders = myOrderQueries.map((q) => q.data).filter(Boolean) as Order[];
  const isLoadingMine = myOrderQueries.some((q) => q.isLoading && q.fetchStatus !== 'idle');

  const { data: tableOrders = [], isLoading: isLoadingTable } = useQuery(
    [...publicOrdersKey(qrToken), 'open'],
    () => getPublicOpenOrders(qrToken),
    { enabled: Boolean(qrToken) && tab === 'table' },
  );

  const orders = tab === 'mine' ? myOrders : tableOrders;
  const loading = tab === 'mine' ? isLoadingMine : isLoadingTable;

  return (
    <CustomerLayout
      pageTitle="Order của tôi"
      title="Lịch sử gọi món"
      subtitle={menu?.table.name}
      backHref={`/order/${qrToken}/menu`}
      footer={
        <Link href={`/order/${qrToken}/menu`}>
          <Button type="primary" size="large" block>
            Gọi thêm món
          </Button>
        </Link>
      }
    >
      <div className="p-4 flex flex-col gap-3 bg-gray-50 flex-1">
        <Segmented
          block
          value={tab}
          onChange={(value) => setTab(value as TabKey)}
          options={[
            { label: 'Của tôi', value: 'mine' },
            { label: 'Đang mở tại bàn', value: 'table' },
          ]}
        />
        {loading && <PageLoading />}
        {!loading && orders.length === 0 && (
          <EmptyState description={tab === 'mine' ? 'Bạn chưa gửi order nào' : 'Bàn chưa có order đang mở'} />
        )}
        {orders.map((order) => (
          <CustomerOrderCard key={order.id} order={order} />
        ))}
      </div>
    </CustomerLayout>
  );
}
