import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Tag } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/layout/app';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { CLOSED_STATUSES } from '@/constants/order';
import { useAuth } from '@/providers/AuthProvider';
import { getOrders, updateOrderStatus } from '@/services/order.service';
import { getTableDetail } from '@/services/table.service';
import { formatMoney, getErrorMessage } from '@/ultils/format';
import OrderCard from '@/modules/orders/components/OrderCard';
import OrderDrawer from '@/modules/orders/components/OrderDrawer';

export default function TableDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const tableId = Number(router.query.tableId);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  const {
    data: table,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['tables', restaurantId, 'detail', tableId],
    () => getTableDetail(restaurantId as number, tableId),
    { enabled: Boolean(restaurantId && tableId) },
  );

  const { data: history } = useQuery(
    ['orders', restaurantId, 'table-history', tableId],
    () => getOrders(restaurantId as number, { tableId, status: CLOSED_STATUSES, limit: 10 }),
    { enabled: Boolean(restaurantId && tableId) },
  );

  // "Thanh toán": close every open order of the table
  const checkout = useMutation(
    () =>
      Promise.all(
        (table?.orders ?? []).map((o) => updateOrderStatus(restaurantId as number, o.id, 'COMPLETED')),
      ),
    {
      onSuccess: () => {
        showMessage.success('Đã thanh toán, bàn đã trống');
        queryClient.invalidateQueries(['tables', restaurantId]);
        queryClient.invalidateQueries(['orders', restaurantId]);
      },
      onError: (err) => {
        showMessage.error(getErrorMessage(err));
        queryClient.invalidateQueries(['tables', restaurantId]);
      },
    },
  );

  const confirmCheckout = () =>
    Modal.confirm({
      title: `Thanh toán ${table?.name}?`,
      content: `Tổng tiền ${formatMoney(table?.total)}. Tất cả order đang mở sẽ chuyển sang Hoàn thành.`,
      okText: 'Thanh toán',
      cancelText: 'Huỷ',
      onOk: () => checkout.mutateAsync(),
    });

  const openOrders = table?.orders ?? [];
  const hasPending = openOrders.some((o) => o.status === 'PENDING');

  return (
    <AppLayout title={table?.name ?? 'Chi tiết bàn'} backHref="/tables" hideTabBar>
      {isLoading && <PageLoading />}
      {error && <PageError error={error} onRetry={refetch} />}
      {table && (
        <div className="max-w-3xl mx-auto flex flex-col gap-4 pb-28 lg:pb-0">
          <div className="flex items-center gap-2">
            {hasPending ? (
              <Tag color="red">Có đơn mới</Tag>
            ) : openOrders.length ? (
              <Tag color="orange">Đang phục vụ</Tag>
            ) : (
              <Tag color="green">Trống</Tag>
            )}
            {table.status === 'INACTIVE' && <Tag>Ngưng hoạt động</Tag>}
          </div>

          <section>
            <h2 className="text-base font-semibold mb-3">Đơn hiện tại ({openOrders.length})</h2>
            {openOrders.length === 0 ? (
              <EmptyState description="Bàn chưa có order đang mở" />
            ) : (
              <div className="flex flex-col gap-3">
                {openOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showTable={false}
                    onOpen={(o) => setOpenOrderId(o.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sticky on mobile, inline on desktop */}
          <div className="fixed lg:static bottom-0 inset-x-0 z-30 bg-white lg:bg-transparent border-0 border-t lg:border-t-0 border-solid border-gray-100 p-3 lg:p-0 pb-safe">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng</span>
                <span className="text-xl font-bold">{formatMoney(table.total)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="large"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => window.open(`/order/${table.qrToken}/menu`, '_blank')}
                >
                  Gọi thêm
                </Button>
                <Button
                  size="large"
                  block
                  type="primary"
                  className="bg-emerald-500"
                  icon={<CheckOutlined />}
                  disabled={!openOrders.length}
                  loading={checkout.isLoading}
                  onClick={confirmCheckout}
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-base font-semibold mb-3">Lịch sử order</h2>
            {history?.data.length ? (
              <div className="flex flex-col gap-2">
                {history.data.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showTable={false}
                    compact
                    onOpen={(o) => setOpenOrderId(o.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState description="Chưa có lịch sử" />
            )}
          </section>
        </div>
      )}
      <OrderDrawer orderId={openOrderId} onClose={() => setOpenOrderId(null)} />
    </AppLayout>
  );
}
