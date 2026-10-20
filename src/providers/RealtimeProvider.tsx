import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { API_HOST } from '@/configs/ApiClient';
import { Order } from '@/interfaces';
import { playNewOrderSound, vibrate } from '@/ultils/sound';
import NewOrderAlert from '@/modules/orders/components/NewOrderAlert';
import { useAuth } from './AuthProvider';

interface IRealtimeContext {
  connected: boolean;
}

const RealtimeContext = createContext<IRealtimeContext>({ connected: false });

// Everything that shows orders or table state lives under these query keys
const invalidateOrderData = (queryClient: ReturnType<typeof useQueryClient>, rid: number) => {
  queryClient.invalidateQueries(['orders', rid]);
  queryClient.invalidateQueries(['tables', rid]);
};

export default function RealtimeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, restaurantId, signOut } = useAuth();
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState<Order[]>([]);
  const ridRef = useRef(restaurantId);
  ridRef.current = restaurantId;
  const socketRef = useRef<Socket | null>(null);
  const joinedIdsRef = useRef<number[]>([]);

  // Customer QR pages run their own socket with qrToken
  const isStaffArea = !router.pathname.startsWith('/order');

  useEffect(() => {
    if (!token || !isStaffArea) return;

    const socket: Socket = io(`${API_HOST}/realtime`, { auth: { token }, transports: ['websocket'] });
    socketRef.current = socket;
    let hasConnected = false;

    socket.on('ready', ({ restaurantIds }: { restaurantIds: number[] }) => {
      joinedIdsRef.current = restaurantIds ?? [];
    });

    socket.on('connect', () => {
      setConnected(true);
      // Refetch after a reconnect so events missed while offline are not lost
      if (hasConnected && ridRef.current) invalidateOrderData(queryClient, ridRef.current);
      hasConnected = true;
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('order.created', (order: Order) => {
      if (order.restaurantId !== ridRef.current) return;
      invalidateOrderData(queryClient, order.restaurantId);
      setAlerts((prev) => [...prev.filter((o) => o.id !== order.id), order]);
      playNewOrderSound();
      vibrate();
    });

    socket.on('order.updated', (order: Order) => {
      if (order.restaurantId !== ridRef.current) return;
      invalidateOrderData(queryClient, order.restaurantId);
      queryClient.setQueryData(
        ['orders', order.restaurantId, 'detail', order.id],
        (prev: Order | undefined) => (prev ? { ...prev, ...order } : prev),
      );
      // Someone else handled it — drop the popup
      if (order.status !== 'PENDING') setAlerts((prev) => prev.filter((o) => o.id !== order.id));
    });

    socket.on('error', ({ message }: { message: string }) => {
      if (message === 'Unauthorized') signOut();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, isStaffArea]);

  useEffect(() => {
    setAlerts([]);
    // Rooms are joined only at connect time — reconnect after joining/creating a new restaurant
    const socket = socketRef.current;
    if (socket?.connected && restaurantId && !joinedIdsRef.current.includes(restaurantId)) {
      socket.disconnect().connect();
    }
  }, [restaurantId]);

  const dismissAlert = (orderId: number) => setAlerts((prev) => prev.filter((o) => o.id !== orderId));

  return (
    <RealtimeContext.Provider value={{ connected }}>
      {children}
      {isStaffArea && restaurantId && <NewOrderAlert orders={alerts} onDismiss={dismissAlert} />}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
