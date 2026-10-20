import { Button, Popconfirm, Timeline } from 'antd';
import { useQuery } from '@tanstack/react-query';
import OrderStatusTag from '@/components/common/OrderStatusTag';
import { PageError, PageLoading } from '@/components/common/PageState';
import { ORDER_STATUS } from '@/constants/order';
import { useAuth } from '@/providers/AuthProvider';
import { getOrder } from '@/services/order.service';
import { formatDateTime, formatMoney } from '@/ultils/format';
import useOrderActions, { canCancel, ORDER_ACTIONS } from '../useOrderActions';

export const orderDetailKey = (rid: number | null, orderId: number) => ['orders', rid, 'detail', orderId];

/** Full order view with status history and actions — used in the drawer and on /orders/[orderId]. */
export default function OrderDetail({ orderId }: { orderId: number }) {
  const { restaurantId } = useAuth();
  const updateStatus = useOrderActions();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery(orderDetailKey(restaurantId, orderId), () => getOrder(restaurantId as number, orderId), {
    enabled: Boolean(restaurantId && orderId),
  });

  if (isLoading) return <PageLoading />;
  if (error || !order) return <PageError error={error} onRetry={refetch} />;

  const actions = ORDER_ACTIONS[order.status];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xl font-bold">{order.table?.name}</div>
          <div className="text-sm text-gray-500">
            <span className="font-mono">{order.orderCode}</span> · {formatDateTime(order.createdAt)}
          </div>
        </div>
        <OrderStatusTag status={order.status} />
      </div>

      <div className="rounded-xl border border-solid border-gray-100 divide-y divide-x-0 divide-solid divide-gray-100">
        {(order.items ?? []).map((item) => (
          <div key={item.id} className="flex justify-between gap-3 p-3">
            <div className="min-w-0">
              <div>
                <b>{item.quantity}</b> × {item.itemName}
              </div>
              <div className="text-xs text-gray-400">{formatMoney(item.itemPrice)}</div>
              {item.note && <div className="text-xs text-amber-600 italic mt-0.5">{item.note}</div>}
            </div>
            <span className="whitespace-nowrap font-medium">{formatMoney(item.subtotal)}</span>
          </div>
        ))}
        {order.discount > 0 && (
          <div className="flex justify-between p-3 text-sm">
            <span className="text-gray-500">Giảm giá</span>
            <span>-{formatMoney(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between p-3">
          <span className="font-medium">Tổng</span>
          <span className="text-lg font-bold">{formatMoney(order.total)}</span>
        </div>
      </div>

      {order.note && (
        <div className="text-sm bg-amber-50 text-amber-700 rounded-lg px-3 py-2">Ghi chú: {order.note}</div>
      )}

      {(actions.length > 0 || canCancel(order)) && (
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={action.status}
              type={index === 0 ? 'primary' : 'default'}
              size="large"
              className="flex-1"
              loading={updateStatus.isLoading && updateStatus.variables?.status === action.status}
              onClick={() => updateStatus.mutate({ orderId: order.id, status: action.status })}
            >
              {action.label}
            </Button>
          ))}
          {canCancel(order) && (
            <Popconfirm
              title="Huỷ order này?"
              okText="Huỷ order"
              okButtonProps={{ danger: true }}
              cancelText="Không"
              onConfirm={() => updateStatus.mutate({ orderId: order.id, status: 'CANCELLED' })}
            >
              <Button danger size="large">
                Huỷ
              </Button>
            </Popconfirm>
          )}
        </div>
      )}

      {order.statusHistory && order.statusHistory.length > 0 && (
        <div>
          <div className="font-medium mb-3">Lịch sử trạng thái</div>
          <Timeline
            items={order.statusHistory.map((h) => ({
              color: ORDER_STATUS[h.status].color,
              children: (
                <div className="text-sm">
                  <div className="font-medium">{ORDER_STATUS[h.status].label}</div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(h.createdAt)} · {h.createdBy?.name ?? 'Khách / Hệ thống'}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
}
