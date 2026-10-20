import { ApiError } from '@/interfaces';
import auth from '@/constants/auth';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const errorMessage = 'Có lỗi trong quá trình thực thi';

export const API_HOST = (process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000').replace(/\/$/, '');
export const API_URL = `${API_HOST}/api`;

// Validation errors return `message` as an array
const normalizeMessage = (message: unknown) => {
  if (Array.isArray(message)) return message.join('\n');
  if (typeof message === 'string') return message;
  return errorMessage;
};

const handleUnauthorized = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(auth.TOKEN);
  const { pathname } = window.location;
  // Public QR pages and auth pages never require login
  if (pathname.startsWith('/order') || pathname === '/login' || pathname === '/register') return;
  window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
};

class ApiClient {
  baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || '';
  }

  getInstance() {
    const api: AxiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    api.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(auth.TOKEN) : null;
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        const resError = error.response;
        const dataError: any = resError?.data;
        const status = resError?.status ?? 0;

        const isAuthRequest = /\/auth\/(login|register|change-password)$/.test(error.config?.url ?? '');
        if (status === 401 && !isAuthRequest) handleUnauthorized();

        const apiError: ApiError = {
          status,
          message: status ? normalizeMessage(dataError?.message) : 'Không kết nối được tới máy chủ',
          data: dataError,
        };
        return Promise.reject(apiError);
      },
    );
    return api;
  }
}

export default ApiClient;
