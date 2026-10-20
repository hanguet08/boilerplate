import { api } from '.';
import { API } from '@/constants/apiUrls';
import { Order, OrderStatus, PageParams, Paginated } from '@/interfaces';
import { filterInvalidField } from '@/ultils/function';

export interface OrderQuery extends PageParams {
  status?: OrderStatus | OrderStatus[];
  tableId?: number;
  from?: string;
  to?: string;
  q?: string;
}

export const getOrders = (rid: number, { status, ...params }: OrderQuery) =>
  api.get<Paginated<Order>>(API.ORDERS(rid), {
    params: filterInvalidField({ ...params, status: Array.isArray(status) ? status.join(',') : status }),
  });

// Walks every page (limit 100) — used for dashboard aggregates over a single day
export const getAllOrders = async (rid: number, query: OrderQuery, maxPages = 20) => {
  const orders: Order[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await getOrders(rid, { ...query, page, limit: 100 });
    orders.push(...res.data);
    if (page >= res.meta.totalPages) break;
  }
  return orders;
};

export const getOrder = (rid: number, id: number) => api.get<Order>(API.ORDER(rid, id));

export const updateOrderStatus = (rid: number, id: number, status: OrderStatus) =>
  api.patch<Order>(API.ORDER_STATUS(rid, id), { status });
