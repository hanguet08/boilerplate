/* QOrder service worker: Web Push for new orders + PWA installability. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// A fetch handler is required for "Add to Home Screen" on some browsers; network passthrough only
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let payload;
  try {
    payload = event.data ? event.data.json() : null;
  } catch (e) {
    payload = { title: 'QOrder', body: event.data ? event.data.text() : '' };
  }
  if (!payload) return;

  event.waitUntil(
    (async () => {
      // App open and visible → the WebSocket popup already alerted the staff
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (payload.type !== 'test' && clientsList.some((c) => c.visibilityState === 'visible')) return;

      await self.registration.showNotification(payload.title, {
        body: payload.body,
        tag: payload.tag,
        data: payload.data,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        renotify: Boolean(payload.tag),
      });
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const d = event.notification.data;
  const url = d && d.orderId ? `/orders/${d.orderId}?rid=${d.restaurantId}` : '/orders';

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const existing = clientsList.find((c) => new URL(c.url).origin === self.location.origin);
      if (existing) {
        await existing.focus();
        return existing.navigate(url);
      }
      return self.clients.openWindow(url);
    })(),
  );
});
