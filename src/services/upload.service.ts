import { api } from '.';
import { API } from '@/constants/apiUrls';

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const uploadImage = (rid: number, file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  // Let the browser set the multipart boundary
  return api.post<{ url: string; mimeType: string; size: number }>(API.UPLOAD_IMAGE(rid), fd, {
    headers: { 'Content-Type': undefined },
  });
};
