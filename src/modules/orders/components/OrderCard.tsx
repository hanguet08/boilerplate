import { Button } from 'antd';
import cx from 'classnames';
import OrderStatusTag from '@/components/common/OrderStatusTag';
import { ORDER_STATUS } from '@/constants/order';
import { Order } from '@/interfaces';
import { formatDateTime, formatMoney, formatTime, isToday } from '@/ultils/format';
import useOrderActions, { ORDER_ACTIONS } from '../useOrderActions';

interface IProps {
  order: Order;
  onOpen?: (order: Order) => void;
  showTable?: boolean;
  compact?: boolean;
}

export default function OrderCard({ order, onOpen, showTable = true, compact }: IProps) {
  const updateStatus = useOrderActions();
  const primaryAction = ORDER_ACTIONS[order.status][0];
  const items = order.items ?? [];
  const visibleItems = compact ? items.slice(0, 3) : items;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(order)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen?.(order)}
      className={cx(
        'bg-white rounded-xl border border-solid p-4 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-md',
        order.status === 'PENDING' ? 'border-rose-200' : 'border-gray-100',
      )}
      style={{ borderLeft: `4px solid ${ORDER_STATUS[order.status].color}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {showTable && (
            <div className="font-semibold text-base">{order.table?.name ?? `Bàn #${order.tableId}`}</div>
          )}
          <div className="text-xs text-gray-500">
            {isToday(order.createdAt) ? formatTime(order.createdAt) : formatDateTime(order.createdAt)} ·{' '}
            <span className="font-mono">{order.orderCode}</span>
          </div>
        </div>
        <OrderStatusTag status={order.status} />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex justify-between gap-2">
            <span className="min-w-0">
              <b>{item.quantity}</b> × {item.itemName}
              {item.note && <span className="text-xs text-amber-600 italic"> ({item.note})</span>}
            </span>
            {!compact && (
              <span className="text-gray-500 whitespace-nowrap">{formatMoney(item.subtotal)}</span>
            )}
          </div>
        ))}
        {compact && items.length > visibleItems.length && (
          <span className="text-xs text-gray-400">+{items.length - visibleItems.length} món khác</span>
        )}
      </div>

      {order.note && (
        <div className="text-xs bg-amber-50 text-amber-700 rounded-md px-2 py-1">Ghi chú: {order.note}</div>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="font-bold">{formatMoney(order.total)}</span>
        {primaryAction && (
          <Button
            type="primary"
            size="small"
            className={primaryAction.status === 'COMPLETED' ? 'bg-emerald-500' : undefined}
            loading={updateStatus.isLoading}
            onClick={(e) => {
              e.stopPropagation();
              updateStatus.mutate({ orderId: order.id, status: primaryAction.status });
            }}
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
