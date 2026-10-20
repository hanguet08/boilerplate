export * from './models';

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface PageParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}
