import { api } from '.';
import { API } from '@/constants/apiUrls';
import { API_URL } from '@/configs/ApiClient';
import auth from '@/constants/auth';
import { ActiveStatus, Table, TableDetail, TableOverview } from '@/interfaces';

export type TablePayload = { name?: string; sortOrder?: number; status?: ActiveStatus };

export const getTables = (rid: number) => api.get<Table[]>(API.TABLES(rid));

export const getTablesOverview = (rid: number) => api.get<TableOverview[]>(API.TABLES_OVERVIEW(rid));

export const getTableDetail = (rid: number, tableId: number) => api.get<TableDetail>(API.TABLE(rid, tableId));

export const createTable = (rid: number, body: TablePayload) => api.post<Table>(API.TABLES(rid), body);

export const updateTable = (rid: number, tableId: number, body: TablePayload) =>
  api.patch<Table>(API.TABLE(rid, tableId), body);

export const deleteTable = (rid: number, tableId: number) =>
  api.delete<{ success: boolean }>(API.TABLE(rid, tableId));

export const regenerateQr = (rid: number, tableId: number) =>
  api.post<Table>(API.TABLE_REGENERATE_QR(rid, tableId));

export const getTableQr = (rid: number, tableId: number) =>
  api.get<{ table: Table; url: string }>(API.TABLE_QR(rid, tableId));

// qr.png needs the Authorization header, so it can't be used directly in <img src>
export const downloadTableQrPng = async (rid: number, tableId: number, fileName: string) => {
  const res = await fetch(`${API_URL}${API.TABLE_QR_PNG(rid, tableId)}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem(auth.TOKEN)}` },
  });
  if (!res.ok) throw { status: res.status, message: 'Không tải được ảnh QR' };
  const blobUrl = URL.createObjectURL(await res.blob());
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(blobUrl);
};
