import cx from 'classnames';
import { CUSTOMER_ORDER_STATUS, ORDER_STATUS } from '@/constants/order';
import { Order } from '@/interfaces';
import { formatMoney, formatTime, isToday, formatDateTime } from '@/ultils/format';

export default function CustomerOrderCard({ order }: { order: Order }) {
  const status = ORDER_STATUS[order.status];
  const items = order.items ?? [];

  return (
    <div className="rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {isToday(order.createdAt) ? formatTime(order.createdAt) : formatDateTime(order.createdAt)} ·{' '}
          <span className="font-mono">{order.orderCode}</span>
        </span>
        <span
          className={cx('text-xs font-medium rounded-full px-2 py-0.5')}
          style={{ color: status.color, backgroundColor: `${status.color}1a` }}
        >
          {CUSTOMER_ORDER_STATUS[order.status]}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-sm">
            <div className="min-w-0">
              <span className="font-medium">{item.quantity} ×</span> {item.itemName}
              {item.note && <div className="text-xs text-gray-400 italic">{item.note}</div>}
            </div>
            <span className="whitespace-nowrap">{formatMoney(item.subtotal)}</span>
          </div>
        ))}
      </div>
      {order.note && <div className="text-xs text-gray-500 mt-2">Ghi chú: {order.note}</div>}
      <div className="flex justify-between mt-3 pt-3 border-0 border-t border-dashed border-gray-200">
        <span className="text-gray-500">Tổng</span>
        <span className="font-bold">{formatMoney(order.total)}</span>
      </div>
    </div>
  );
}
