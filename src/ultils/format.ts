import dayjs from 'dayjs';

export const formatMoney = (value: number | null | undefined) =>
  `${new Intl.NumberFormat('vi-VN').format(value ?? 0)}đ`;

export const formatTime = (iso?: string | null) => (iso ? dayjs(iso).format('HH:mm') : '');

export const formatDateTime = (iso?: string | null) => (iso ? dayjs(iso).format('HH:mm DD/MM/YYYY') : '');

export const isToday = (iso?: string | null) => Boolean(iso) && dayjs(iso).isSame(dayjs(), 'day');

export const summarizeItems = (items: { itemName: string; quantity: number }[] = [], max = 3) => {
  const parts = items.map((item) => `${item.quantity} × ${item.itemName}`);
  return parts.length > max ? `${parts.slice(0, max).join(', ')} +${parts.length - max}` : parts.join(', ');
};

export const getErrorMessage = (error: any, fallback = 'Có lỗi xảy ra, vui lòng thử lại') =>
  typeof error?.message === 'string' && error.message ? error.message : fallback;
