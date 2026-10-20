import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from '@/components/messages/GMessage';
import { Order, OrderStatus } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { updateOrderStatus } from '@/services/order.service';
import { getErrorMessage } from '@/ultils/format';

const SUCCESS_TEXT: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: 'Đã nhận order',
  COMPLETED: 'Đã hoàn thành order',
  CANCELLED: 'Đã huỷ order',
};

export const ORDER_ACTIONS: Record<OrderStatus, { status: OrderStatus; label: string }[]> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Đã nhận' },
    { status: 'COMPLETED', label: 'Hoàn thành' },
  ],
  CONFIRMED: [{ status: 'COMPLETED', label: 'Hoàn thành' }],
  COMPLETED: [],
  CANCELLED: [],
};

export const canCancel = (order: Pick<Order, 'status'>) => ['PENDING', 'CONFIRMED'].includes(order.status);

export default function useOrderActions() {
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();

  return useMutation(
    ({ orderId, status }: { orderId: number; status: OrderStatus; silent?: boolean }) =>
      updateOrderStatus(restaurantId as number, orderId, status),
    {
      onSuccess: (order, { status, silent }) => {
        queryClient.setQueryData(['orders', restaurantId, 'detail', order.id], (prev: Order | undefined) =>
          prev ? { ...prev, ...order } : prev,
        );
        queryClient.invalidateQueries(['orders', restaurantId]);
        queryClient.invalidateQueries(['tables', restaurantId]);
        if (!silent && SUCCESS_TEXT[status]) showMessage.success(SUCCESS_TEXT[status]);
      },
      onError: (error) => showMessage.error(getErrorMessage(error)),
    },
  );
}
