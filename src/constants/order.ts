import { OrderStatus, TableBoardState } from '@/interfaces';

export const ORDER_STATUS: Record<OrderStatus, { label: string; color: string; tagColor: string }> = {
  PENDING: { label: 'Mới', color: '#ef4444', tagColor: 'red' },
  CONFIRMED: { label: 'Đang phục vụ', color: '#f59e0b', tagColor: 'orange' },
  COMPLETED: { label: 'Hoàn thành', color: '#10b981', tagColor: 'green' },
  CANCELLED: { label: 'Đã huỷ', color: '#9ca3af', tagColor: 'default' },
};

// Wording the customer sees for their own order
export const CUSTOMER_ORDER_STATUS: Record<OrderStatus, string> = {
  PENDING: 'Chờ quán nhận',
  CONFIRMED: 'Quán đã nhận',
  COMPLETED: 'Đã phục vụ',
  CANCELLED: 'Đã huỷ',
};

export const TABLE_STATE: Record<
  TableBoardState,
  { label: string; className: string; dotClassName: string }
> = {
  EMPTY: { label: 'Trống', className: 'bg-emerald-50 border-emerald-100', dotClassName: 'bg-emerald-500' },
  SERVING: { label: 'Đang phục vụ', className: 'bg-amber-50 border-amber-100', dotClassName: 'bg-amber-500' },
  NEW_ORDER: { label: 'Có order mới', className: 'bg-rose-50 border-rose-200', dotClassName: 'bg-rose-500' },
};

export const OPEN_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED'];
export const CLOSED_STATUSES: OrderStatus[] = ['COMPLETED', 'CANCELLED'];

export const isFinalStatus = (status: OrderStatus) => CLOSED_STATUSES.includes(status);
