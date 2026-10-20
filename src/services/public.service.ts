import { api } from '.';
import { API } from '@/constants/apiUrls';
import { CreateOrderPayload, Order, PublicMenu } from '@/interfaces';

export const getPublicMenu = (qrToken: string) => api.get<PublicMenu>(API.PUBLIC_MENU(qrToken));

export const createPublicOrder = (qrToken: string, body: CreateOrderPayload) =>
  api.post<Order>(API.PUBLIC_ORDERS(qrToken), body);

export const getPublicOpenOrders = (qrToken: string) => api.get<Order[]>(API.PUBLIC_ORDERS(qrToken));

export const getPublicOrder = (qrToken: string, orderCode: string) =>
  api.get<Order>(API.PUBLIC_ORDER(qrToken, orderCode));
