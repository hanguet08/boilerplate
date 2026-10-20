import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Switch } from 'antd';
import { BellFilled } from '@ant-design/icons';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Order } from '@/interfaces';
import { formatMoney, formatTime } from '@/ultils/format';
import useOrderActions from '../useOrderActions';

const AUTO_HIDE_MS = 2 * 60 * 1000;

interface IProps {
  orders: Order[];
  onDismiss: (orderId: number) => void;
}

/** "Đơn mới" popup shown when a socket `order.created` arrives. Shows the oldest unhandled one first. */
export default function NewOrderAlert({ orders, onDismiss }: IProps) {
  const router = useRouter();
  const updateStatus = useOrderActions();
  const [autoHide, setAutoHide] = useLocalStorage('new-order-auto-hide', true);
  const order = orders[0];

  useEffect(() => {
    if (!order || !autoHide) return;
    const timer = setTimeout(() => onDismiss(order.id), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [order?.id, autoHide]);

  if (!order) return null;

  const confirm = () =>
    updateStatus.mutate({ orderId: order.id, status: 'CONFIRMED' }, { onSuccess: () => onDismiss(order.id) });

  return (
    <Modal
      open
      footer={null}
      closable={false}
      centered
      width={380}
      maskClosable={false}
      onCancel={() => onDismiss(order.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-500 font-semibold">
          <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse">
            <BellFilled />
          </span>
          Đơn mới {orders.length > 1 && <span className="text-xs text-gray-400">(+{orders.length - 1})</span>}
        </div>
        <span className="text-rose-500 font-medium">{formatTime(order.createdAt)}</span>
      </div>

      <div className="text-2xl font-bold mt-4">{order.table?.name}</div>
      <div className="mt-3 flex flex-col gap-1.5">
        {(order.items ?? []).map((item) => (
          <div key={item.id} className="flex justify-between gap-3">
            <span>
              {item.quantity} × {item.itemName}
              {item.note && <span className="text-xs text-amber-600 italic"> ({item.note})</span>}
            </span>
            <span className="text-gray-500 whitespace-nowrap">{formatMoney(item.subtotal)}</span>
          </div>
        ))}
      </div>
      {order.note && (
        <div className="text-sm text-amber-700 bg-amber-50 rounded-md px-2 py-1 mt-3">
          Ghi chú: {order.note}
        </div>
      )}
      <div className="flex justify-between mt-4 pt-3 border-0 border-t border-dashed border-gray-200">
        <span className="text-gray-500">Tổng</span>
        <span className="text-lg font-bold">{formatMoney(order.total)}</span>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <Button type="primary" size="large" block loading={updateStatus.isLoading} onClick={confirm}>
          Đã nhận
        </Button>
        <div className="flex gap-2">
          <Button
            block
            onClick={() => {
              onDismiss(order.id);
              router.push(`/tables/${order.tableId}`);
            }}
          >
            Xem bàn
          </Button>
          <Button block onClick={() => onDismiss(order.id)}>
            Đóng
          </Button>
        </div>
      </div>

      <label className="flex items-center justify-between mt-4 text-sm text-gray-500 cursor-pointer">
        Tự ẩn sau 2 phút
        <Switch size="small" checked={autoHide} onChange={setAutoHide} />
      </label>
    </Modal>
  );
}
