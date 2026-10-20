import { api } from '.';
import { API } from '@/constants/apiUrls';
import { ActiveStatus, Membership, Restaurant, RestaurantRole } from '@/interfaces';

export type RestaurantPayload = Partial<
  Pick<Restaurant, 'name' | 'slug' | 'logoUrl' | 'phone' | 'address' | 'status'>
>;

export interface StaffPayload {
  email: string;
  name?: string;
  password?: string;
  role?: RestaurantRole;
}

export const getMyRestaurants = () => api.get<(Restaurant & { role: RestaurantRole })[]>(API.RESTAURANTS);

export const createRestaurant = (body: RestaurantPayload) => api.post<Restaurant>(API.RESTAURANTS, body);

export const getRestaurant = (rid: number) => api.get<Restaurant>(API.RESTAURANT(rid));

export const updateRestaurant = (rid: number, body: RestaurantPayload) =>
  api.patch<Restaurant>(API.RESTAURANT(rid), body);

export const getStaff = (rid: number) => api.get<Membership[]>(API.STAFF(rid));

export const addStaff = (rid: number, body: StaffPayload) => api.post<Membership>(API.STAFF(rid), body);

export const updateStaff = (
  rid: number,
  memberId: number,
  body: { role?: RestaurantRole; status?: ActiveStatus },
) => api.patch<Membership>(API.STAFF_MEMBER(rid, memberId), body);

export const removeStaff = (rid: number, memberId: number) =>
  api.delete<{ success: boolean }>(API.STAFF_MEMBER(rid, memberId));
