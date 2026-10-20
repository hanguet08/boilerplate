import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { API_HOST } from '@/configs/ApiClient';
import { Order } from '@/interfaces';
import { publicOrdersKey } from './CustomerProvider';

/** Live status updates for the customer's orders at this table. */
export default function useCustomerSocket(qrToken: string, onUpdated?: (order: Order) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!qrToken) return;
    const socket = io(`${API_HOST}/realtime`, { auth: { qrToken }, transports: ['websocket'] });

    socket.on('order.updated', (order: Order) => {
      queryClient.setQueryData([...publicOrdersKey(qrToken), order.orderCode], (prev: Order | undefined) =>
        prev ? { ...prev, ...order } : order,
      );
      queryClient.invalidateQueries([...publicOrdersKey(qrToken), 'open']);
      onUpdated?.(order);
    });

    return () => {
      socket.disconnect();
    };
  }, [qrToken]);
}
