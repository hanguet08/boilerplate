import { AxiosResponse } from 'axios';

export interface APIResponse<T = any> extends AxiosResponse<T> {
  error?: string;
  total?: number;
  message?: string;
}
