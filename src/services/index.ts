import ApiClient, { API_URL } from '@/configs/ApiClient';

// Interceptor unwraps `response.data`, so every call resolves to the body type
const api = new ApiClient(API_URL).getInstance() as unknown as {
  get<T = any>(url: string, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
};

export { api };
