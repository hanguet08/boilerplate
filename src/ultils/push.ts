import { getVapidPublicKey, subscribePush, unsubscribePush } from '@/services/push.service';

export const isPushSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(Array.from(raw).map((c) => c.charCodeAt(0)));
}

export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => undefined);
};

export const getPushSubscription = async () => {
  if (!isPushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
};

/** Returns true when the device is subscribed after the call */
export const enablePush = async () => {
  if (!isPushSupported()) throw { message: 'Trình duyệt không hỗ trợ thông báo đẩy' };
  const reg = await navigator.serviceWorker.ready;
  if ((await Notification.requestPermission()) !== 'granted') {
    throw { message: 'Bạn chưa cho phép thông báo trên trình duyệt' };
  }

  const { publicKey } = await getVapidPublicKey();
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  await subscribePush(sub.toJSON());
  return true;
};

export const disablePush = async () => {
  const sub = await getPushSubscription();
  if (!sub) return;
  await unsubscribePush(sub.endpoint).catch(() => undefined);
  await sub.unsubscribe();
};
