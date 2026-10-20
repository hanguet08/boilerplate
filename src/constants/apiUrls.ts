const r = (rid: number) => `/restaurants/${rid}`;

export const API = {
  // auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',

  // restaurants
  RESTAURANTS: '/restaurants',
  RESTAURANT: (rid: number) => r(rid),
  STAFF: (rid: number) => `${r(rid)}/staff`,
  STAFF_MEMBER: (rid: number, memberId: number) => `${r(rid)}/staff/${memberId}`,

  // tables
  TABLES: (rid: number) => `${r(rid)}/tables`,
  TABLES_OVERVIEW: (rid: number) => `${r(rid)}/tables/overview`,
  TABLE: (rid: number, tableId: number) => `${r(rid)}/tables/${tableId}`,
  TABLE_REGENERATE_QR: (rid: number, tableId: number) => `${r(rid)}/tables/${tableId}/regenerate-qr`,
  TABLE_QR: (rid: number, tableId: number) => `${r(rid)}/tables/${tableId}/qr`,
  TABLE_QR_PNG: (rid: number, tableId: number) => `${r(rid)}/tables/${tableId}/qr.png`,

  // menu
  CATEGORIES: (rid: number) => `${r(rid)}/categories`,
  CATEGORY: (rid: number, id: number) => `${r(rid)}/categories/${id}`,
  MENU_ITEMS: (rid: number) => `${r(rid)}/menu-items`,
  MENU_ITEM: (rid: number, id: number) => `${r(rid)}/menu-items/${id}`,
  MENU_ITEM_AVAILABILITY: (rid: number, id: number) => `${r(rid)}/menu-items/${id}/availability`,

  // orders
  ORDERS: (rid: number) => `${r(rid)}/orders`,
  ORDER: (rid: number, id: number) => `${r(rid)}/orders/${id}`,
  ORDER_STATUS: (rid: number, id: number) => `${r(rid)}/orders/${id}/status`,

  // uploads
  UPLOAD_IMAGE: (rid: number) => `${r(rid)}/uploads/images`,

  // public (QR)
  PUBLIC_MENU: (qrToken: string) => `/public/tables/${qrToken}/menu`,
  PUBLIC_ORDERS: (qrToken: string) => `/public/tables/${qrToken}/orders`,
  PUBLIC_ORDER: (qrToken: string, code: string) => `/public/tables/${qrToken}/orders/${code}`,

  // push
  VAPID_PUBLIC_KEY: '/push/vapid-public-key',
  PUSH_SUBSCRIPTIONS: '/push/subscriptions',
  PUSH_TEST: '/push/test',
};
