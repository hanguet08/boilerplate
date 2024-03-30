import { APIResponse } from '@/interfaces';
import axios, { AxiosResponse, AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const REFRESH_URL = process.env.NEXT_PUBLIC_APP_URL;
const errorMessage = 'Có lỗi trong quá trình thực thi';

const errorCallback = (status: number, error: string) => {
  return { status, error: error ?? errorMessage };
};

const processQueue = (error: AxiosError | null, token = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });

  failedQueue = [];
};

const handleGetToken = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`;
};

const handle403Status = async (dataError, config) => {
  if (config.url === `${REFRESH_URL}/api/auth/refresh_token`) {
    handleGetToken();
  }
  return errorCallback(403, dataError?.message);
};

const handleRefreshToken = async (config: InternalAxiosRequestConfig<any>, api: AxiosInstance) => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  })
    .then(() => {
      if (config) return api(config);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
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
      (config: any) => {
        const token = localStorage.getItem('token') ?? '';

        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['apptype'] = 'web';
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    api.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;

        if (data.success === false) {
          const message = typeof data?.message === 'string' ? data?.message : errorMessage;
          return { ...response.data, status: 400, error: message };
        }

        return response.data;
      },
      async (error: AxiosError) => {
        const config = error.config;
        const resError = error.response;
        const dataError: any = resError?.data;

        switch (resError?.status) {
          case 500:
            return errorCallback(500, dataError?.message);
          case 403: {
            return handle403Status(dataError, config);
          }
          case 401: {
            if (config.url === `${REFRESH_URL}/api/auth/refresh_token`) {
              handleGetToken();
              return errorCallback(401, dataError?.message);
            }

            // Handle if token is refreshing
            if (isRefreshing) {
              return handleRefreshToken(config, api);
            }
            isRefreshing = true;

            const res: APIResponse<{
              access_token: string;
            }> = await api.get(`${REFRESH_URL}/api/auth/refresh_token`);

            if (res?.data?.access_token) {
              const { access_token } = res.data;
              localStorage.setItem('token', access_token);
              processQueue(null, access_token);
              if (config)
                return api(config).finally(() => {
                  isRefreshing = false;
                });
            }

            return Promise.reject(error);
          }

          default:
            return errorCallback(500, dataError?.message);
        }
      },
    );
    return api;
  }
}

export default ApiClient;
