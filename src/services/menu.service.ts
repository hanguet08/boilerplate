import { api } from '.';
import { API } from '@/constants/apiUrls';
import { ActiveStatus, Category, MenuItem, PageParams, Paginated } from '@/interfaces';
import { filterInvalidField } from '@/ultils/function';

export type CategoryPayload = {
  name?: string;
  imageUrl?: string | null;
  sortOrder?: number;
  status?: ActiveStatus;
};

export type MenuItemPayload = Partial<
  Pick<MenuItem, 'categoryId' | 'name' | 'description' | 'price' | 'imageUrl' | 'isAvailable' | 'sortOrder'>
>;

export interface MenuItemQuery extends PageParams {
  categoryId?: number;
  q?: string;
  isAvailable?: boolean;
}

export const getCategories = (rid: number) => api.get<Required<Category>[]>(API.CATEGORIES(rid));

export const createCategory = (rid: number, body: CategoryPayload) =>
  api.post<Category>(API.CATEGORIES(rid), body);

export const updateCategory = (rid: number, id: number, body: CategoryPayload) =>
  api.patch<Category>(API.CATEGORY(rid, id), body);

export const deleteCategory = (rid: number, id: number) =>
  api.delete<{ success: boolean }>(API.CATEGORY(rid, id));

export const getMenuItems = (rid: number, params: MenuItemQuery) =>
  api.get<Paginated<MenuItem>>(API.MENU_ITEMS(rid), { params: filterInvalidField(params) });

export const createMenuItem = (rid: number, body: MenuItemPayload) =>
  api.post<MenuItem>(API.MENU_ITEMS(rid), body);

export const updateMenuItem = (rid: number, id: number, body: MenuItemPayload) =>
  api.patch<MenuItem>(API.MENU_ITEM(rid, id), body);

export const setMenuItemAvailability = (rid: number, id: number, isAvailable: boolean) =>
  api.patch<MenuItem>(API.MENU_ITEM_AVAILABILITY(rid, id), { isAvailable });

export const deleteMenuItem = (rid: number, id: number) =>
  api.delete<{ success: boolean }>(API.MENU_ITEM(rid, id));
