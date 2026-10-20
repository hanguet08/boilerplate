import { api } from '.';
import { API } from '@/constants/apiUrls';

export const getVapidPublicKey = () => api.get<{ publicKey: string }>(API.VAPID_PUBLIC_KEY);

export const subscribePush = (subscription: PushSubscriptionJSON) =>
  api.post<{ success: boolean }>(API.PUSH_SUBSCRIPTIONS, subscription);

export const unsubscribePush = (endpoint: string) =>
  api.delete<{ success: boolean }>(API.PUSH_SUBSCRIPTIONS, { data: { endpoint } });

export const sendTestPush = () => api.post<{ sent: number; failed: number }>(API.PUSH_TEST);
